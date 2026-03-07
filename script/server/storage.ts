import { db } from "./db";
import { 
  users, generations, subscriptions,
  type User, type UpsertUser,
  type Generation, type InsertGeneration,
  type Subscription 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Generations
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGenerations(userId: string): Promise<Generation[]>;
  getGeneration(id: number): Promise<Generation | undefined>;
  
  // Subscriptions
  getSubscription(userId: string): Promise<Subscription | undefined>;
  upsertSubscription(sub: typeof subscriptions.$inferInsert): Promise<Subscription>;
}

export class DatabaseStorage implements IStorage {
  // Auth (Required by Replit Auth integration)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Generations
  async createGeneration(generation: InsertGeneration): Promise<Generation> {
    const [gen] = await db.insert(generations).values(generation).returning();
    return gen;
  }

  async getGenerations(userId: string): Promise<Generation[]> {
    return db
      .select()
      .from(generations)
      .where(eq(generations.userId, "public"))
      .orderBy(desc(generations.createdAt));
  }

  async getGeneration(id: number): Promise<Generation | undefined> {
    const [gen] = await db.select().from(generations).where(eq(generations.id, id));
    return gen;
  }

  // Subscriptions
  async getSubscription(userId: string): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return sub;
  }

  async upsertSubscription(subData: typeof subscriptions.$inferInsert): Promise<Subscription> {
    const [sub] = await db
      .insert(subscriptions)
      .values(subData)
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: {
          status: subData.status,
          stripeSubscriptionId: subData.stripeSubscriptionId,
          stripeCustomerId: subData.stripeCustomerId,
          currentPeriodEnd: subData.currentPeriodEnd,
          updatedAt: new Date(),
        },
      })
      .returning();
    return sub;
  }

  async setProPlan(userId: string): Promise<Subscription> {
    return this.upsertSubscription({
      userId,
      status: "PRO",
      currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // Far future
    });
  }
}

export const storage = new DatabaseStorage();
// Re-export for auth integration compatibility
export const authStorage = storage;
