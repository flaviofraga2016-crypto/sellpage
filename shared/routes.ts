import { z } from 'zod';
import { insertGenerationSchema, generations, subscriptions } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  paymentRequired: z.object({
    message: z.string(),
    checkoutUrl: z.string().optional(),
  })
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  generations: {
    create: {
      method: 'POST' as const,
      path: '/api/generate' as const,
      input: insertGenerationSchema,
      responses: {
        201: z.custom<typeof generations.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        402: errorSchemas.paymentRequired, // Quota exceeded / needs sub
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/generations' as const,
      responses: {
        200: z.array(z.custom<typeof generations.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/generations/:id' as const,
      responses: {
        200: z.custom<typeof generations.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  billing: {
    checkout: {
      method: 'POST' as const,
      path: '/api/checkout' as const,
      input: z.object({}), // No params needed, uses auth user
      responses: {
        200: z.object({ url: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    status: {
      method: 'GET' as const,
      path: '/api/subscription/status' as const,
      responses: {
        200: z.object({
          isActive: z.boolean(),
          status: z.string().nullable(),
          currentPeriodEnd: z.string().nullable().optional(), // Date string
        }),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type GenerateInput = z.infer<typeof api.generations.create.input>;
export type GenerationResponse = z.infer<typeof api.generations.create.responses[201]>;
export type GenerationListResponse = z.infer<typeof api.generations.list.responses[200]>;
export type SubscriptionStatus = z.infer<typeof api.billing.status.responses[200]>;
