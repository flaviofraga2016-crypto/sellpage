import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGenerationSchema } from "@shared/schema";
import { useCreateGeneration } from "@/hooks/use-generations";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";

interface CreateGenerationFormProps {
  onSuccess: (data: any) => void;
}

export function CreateGenerationForm({ onSuccess }: CreateGenerationFormProps) {
  const { toast } = useToast();
  const createGeneration = useCreateGeneration();

  const form = useForm({
    resolver: zodResolver(insertGenerationSchema),
    defaultValues: {
      productName: "",
      description: "",
      audience: "",
      tone: "Profissional e persuasivo",
      price: "",
    },
  });

  const isAdmin = window.location.search.includes("admin=true");

  const onSubmit = async (data: any) => {
    try {
      const result = await createGeneration.mutateAsync({
        ...data,
        isAdmin
      });
      toast({
        title: "Sucesso!",
        description: "Sua página de vendas foi gerada.",
      });
      onSuccess(result);
    } catch (error: any) {
      // Error is handled by react-query error boundary or displayed inline
      console.error(error);
    }
  };

  const isPaymentError = !!(createGeneration.error?.message?.includes("limit reached") || 
                           createGeneration.error?.message?.includes("Subscription"));

  if (isPaymentError && !isAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-card border border-border rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Limite Grátis Atingido</h3>
        <p className="text-muted-foreground mb-8 max-w-md">
          Você atingiu o limite gratuito de 3 gerações. Assine o Plano PRO para desbloquear gerações ilimitadas e remover a marca d'água.
        </p>
        <a href="https://pay.kiwify.com.br/5O9JjAE" target="_blank" rel="noopener noreferrer" className="w-full max-w-xs">
          <Button size="lg" className="w-full btn-primary bg-black hover:bg-black/90 text-white rounded-[10px]">
            Desbloquear acesso
          </Button>
        </a>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Carteira SuperSlim" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Descrição do Produto <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva seu produto em detalhes. Qual problema ele resolve? Quais são as principais características?" 
                    className="input-field min-h-[160px] resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Público-Alvo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Profissionais ocupados, 25-40 anos" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Preço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: R$ 49,90" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">Tom de Voz</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Amigável, Urgente, Luxuoso" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 border-t border-border mt-auto">
          {createGeneration.isError && !isPaymentError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{createGeneration.error?.message}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full btn-primary h-12 text-lg"
            disabled={createGeneration.isPending}
          >
            {createGeneration.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gerando Mágica...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Gerar Página de Vendas
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Leva cerca de 15-30 segundos. A IA pode ser lenta, mas vale a pena.
          </p>
        </div>
      </form>
    </Form>
  );
}
