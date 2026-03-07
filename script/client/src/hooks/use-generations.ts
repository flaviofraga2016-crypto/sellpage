import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GenerateInput, type GenerationListResponse } from "@shared/routes";

// GET /api/generations
export function useGenerations() {
  return useQuery({
    queryKey: [api.generations.list.path],
    queryFn: async () => {
      const res = await fetch(api.generations.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch generations");
      return api.generations.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/generations/:id
export function useGeneration(id: number) {
  return useQuery({
    queryKey: [api.generations.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.generations.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch generation");
      return api.generations.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/generate
export function useCreateGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateInput) => {
      const res = await fetch(api.generations.create.path, {
        method: api.generations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (res.status === 401) throw new Error("Unauthorized");
      
      if (res.status === 402) {
        // Payment required
        const error = api.generations.create.responses[402].parse(await res.json());
        throw new Error(error.message || "Payment required");
      }

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.generations.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to generate content");
      }
      
      return api.generations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.generations.list.path] });
    },
  });
}
