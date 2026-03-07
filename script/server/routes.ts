import type { Express } from "express";
import { type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import Stripe from "stripe";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Initialize Stripe (if key exists)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-01-27.acacia" }) 
  : null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // --- Generations API ---

  app.post(api.generations.create.path, async (req, res) => {
    try {
      const input = api.generations.create.input.parse(req.body);
      
      // Check for admin bypass
      const isAdmin = (req.body as any).isAdmin === true;

      // Check quota for public user
      const gens = await storage.getGenerations("public");
      const sub = await storage.getSubscription("public");
      const isPro = sub?.status === 'active' || sub?.status === 'PRO';

      // For public users, if not PRO and not admin, limit to 3 generations
      if (!isPro && !isAdmin && gens.length >= 3) {
        return res.status(402).json({ 
          message: "Você atingiu o limite gratuito de 3 gerações.",
          checkoutUrl: "/pricing"
        });
      }

      // Call OpenAI
      const prompt = `
        You are an expert copywriter. Create a high-converting landing page structure for:
        Product: ${input.description}
        Audience: ${input.audience || "General"}
        Tone: ${input.tone || "Professional"}
        Price: ${input.price || "Not specified"}

        Return a JSON object with this EXACT structure:
        {
          "headline": "Main H1 headline",
          "subheadline": "Compelling H2/subhead",
          "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
          "sections": [
             { "title": "Section Title", "bullets": ["Point 1", "Point 2"] }
          ],
          "faq": [
             { "q": "Question?", "a": "Answer." }
          ],
          "ctaText": "Call to Action Button Text",
          "html": "<section>...</section>" // A simple HTML representation of the content using Tailwind classes
        }
        
        Ensure the HTML uses standard Tailwind classes for styling (p-8, bg-white, text-gray-900, etc.).
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (!content) throw new Error("No content generated");

      const outputJson = JSON.parse(content);

      // Save to DB (publicly)
      const generation = await storage.createGeneration({
        ...input,
        userId: "public",
        output: outputJson,
      });

      res.status(201).json(generation);
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  app.get(api.generations.list.path, async (req, res) => {
    const gens = await storage.getGenerations("public");
    res.json(gens);
  });

  app.get(api.generations.get.path, async (req, res) => {
    const gen = await storage.getGeneration(Number(req.params.id));
    
    if (!gen) return res.status(404).json({ message: "Not found" });
    
    res.json(gen);
  });

  // --- Billing API ---

  app.get(api.billing.status.path, async (req, res) => {
    // Check if public user has an active subscription
    const sub = await storage.getSubscription("public");
    const isPro = sub?.status === 'active' || sub?.status === 'PRO';
    res.json({
      isActive: isPro,
      status: sub?.status || null,
      currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() || null
    });
  });

  app.post(api.billing.checkout.path, async (req, res) => {
    if (!stripe) return res.status(500).json({ message: "Stripe not configured" });
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: "SellPage AI Pro",
                description: "Unlimited landing page generations",
              },
              unit_amount: 1900, // R$19.00
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: "public",
        },
        success_url: `${req.protocol}://${req.get("host")}/dashboard?success=true`,
        cancel_url: `${req.protocol}://${req.get("host")}/pricing?canceled=true`,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error("Stripe error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // --- Webhook ---
  app.post("/api/webhooks/stripe", async (req, res) => {
    if (!stripe) return res.status(500).send("Stripe not configured");
    
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      if (!sig || !webhookSecret) {
         // Fallback for dev without verification if needed, or strict error
         // For now, we'll try to use rawBody if available (from index.ts middleware)
         // If rawBody is not available, this will fail for production use cases
         const rawBody = (req as any).rawBody;
         if (rawBody) {
            event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret!);
         } else {
             console.warn("Webhook received but no rawBody found. Skipping signature verification (DEV ONLY).");
             event = req.body;
         }
      } else {
         const rawBody = (req as any).rawBody;
         if (rawBody) {
             event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
         } else {
             throw new Error("Missing rawBody for webhook verification");
         }
      }
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      if (userId) {
        await storage.upsertSubscription({
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approx 1 month
        });
      }
    }

    res.json({ received: true });
  });

  app.get("/api/login", (req, res) => {
    // Simulate login by redirecting to dashboard
    res.redirect("/dashboard");
  });

  app.get("/api/logout", (req, res) => {
    // Replit Auth logout: clear the session cookie
    res.clearCookie("replit-auth-v2"); // Standard Replit Auth cookie name
    // Also clear general express session if exists
    if (req.session) {
      req.session.destroy?.(() => {});
    }
    res.redirect("/");
  });

  return httpServer;
}
