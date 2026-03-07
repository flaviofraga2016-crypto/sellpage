import { Sidebar } from "@/components/Sidebar";
import { useSubscriptionStatus, useCheckout } from "@/hooks/use-billing";
import { CheckCircle, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

export default function Pricing() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: subscription, isLoading: isLoadingStatus } = useSubscriptionStatus();
  const checkout = useCheckout();

  const handleFreeClick = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      window.location.href = "/api/login";
    }
  };

  // Determine if we're in the dashboard layout or public layout
  // For simplicity, we'll assume logged in users see the sidebar layout
  const Container = user ? 
    ({ children }: { children: React.ReactNode }) => (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">{children}</main>
      </div>
    ) : 
    ({ children }: { children: React.ReactNode }) => (
      <div className="min-h-screen bg-background p-8">{children}</div>
    );

  const isActive = subscription?.isActive;

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Preços Simples e Transparentes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tenha acesso ilimitado à geração de páginas de vendas com IA. Sem taxas ocultas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Free Tier Card */}
          <div 
            onClick={handleFreeClick}
            className="bg-card rounded-2xl p-8 border border-border shadow-sm opacity-80 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">Plano Gratuito</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-display font-bold">R$0</span>
              <span className="text-muted-foreground">/ sempre</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Perfeito para testar e gerar sua primeira página.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle size={18} className="text-green-500" />
                <span>3 Gerações Grátis</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle size={18} className="text-green-500" />
                <span>Saída HTML Básica</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <AlertCircle size={18} />
                <span>Resultados com marca d'água</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              Começar grátis
            </Button>
          </div>

          {/* Pro Tier Card */}
          <div className="bg-card rounded-2xl p-8 border-2 border-primary shadow-xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
              RECOMENDADO
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              Acesso PRO <Sparkles size={16} className="text-accent" />
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-display font-bold text-primary">R$19</span>
              <span className="text-muted-foreground">/ mês</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Desbloqueie o potencial ilimitado para o seu negócio.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle size={18} className="text-primary" />
                <span>Gerações Ilimitadas</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle size={18} className="text-primary" />
                <span>Sem Marcas d'água</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle size={18} className="text-primary" />
                <span>Download em HTML</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle size={18} className="text-primary" />
                <span>Modelos de IA Premium</span>
              </li>
            </ul>

            {isLoadingStatus ? (
              <Button disabled className="w-full h-12">
                <Loader2 className="animate-spin mr-2" /> Carregando...
              </Button>
            ) : isActive ? (
              <Button disabled className="w-full h-12 bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20">
                <CheckCircle className="mr-2 h-4 w-4" /> Assinatura Ativa
              </Button>
            ) : (
              <a href="https://pay.kiwify.com.br/5O9JjAE" target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button 
                  className="w-full btn-primary h-12 text-lg shadow-xl shadow-primary/20 bg-black hover:bg-black/90 text-white rounded-[10px]"
                >
                  Virar PRO por R$19/mês
                </Button>
              </a>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Pagamento seguro. Cancele a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
