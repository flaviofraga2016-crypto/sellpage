import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type SubscriptionStatus } from "@shared/routes";

// GET /api/subscription/status
export function useSubscriptionStatus() {
  return useQuery({
    queryKey: [api.billing.status.path],
    queryFn: async () => {
      const res = await fetch(api.billing.status.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch subscription status");
      return api.billing.status.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

// POST /api/checkout
export function useCheckout() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.billing.checkout.path, {
        method: api.billing.checkout.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to initiate checkout");
      
      const data = await res.json();
      return api.billing.checkout.responses[200].parse(data);
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
  });
}
