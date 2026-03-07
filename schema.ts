import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import Auth & Chat models (required by blueprints)
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === SELLPAGE AI TABLES ===

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").default("public"),
  productName: text("product_name"),
  description: text("description").notNull(),
  audience: text("audience"),
  tone: text("tone"),
  price: text("price"),
  output: jsonb("output").notNull(), // Stores the full JSON from OpenAI
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(), // active, trailing, past_due, canceled
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === RELATIONS ===

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

// === ZOD SCHEMAS ===

export const insertGenerationSchema = createInsertSchema(generations).omit({ 
  id: true, 
  userId: true, 
  createdAt: true,
  output: true 
});

// === EXPLICIT API TYPES ===

export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Request types
export type GenerateRequest = InsertGeneration;

// Response types
export interface GenerateResponse {
  generation: Generation;
  quotaRemaining?: number;
}

export type GenerationHistoryResponse = Generation[];

export interface SubscriptionStatusResponse {
  isActive: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
}

export interface CheckoutSessionResponse {
  url: string;
}
