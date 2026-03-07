import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Zap, 
  Layout, 
  TrendingUp,
  BarChart3
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">SellPage AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="btn-primary">
                  Ir para o Painel
                </Button>
              </Link>
            ) : (
              <>
                <a href="/api/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                  Entrar
                </a>
                <a href="/api/login">
                  <Button className="btn-primary">
                    Começar Agora
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse" />
          <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Novo: Geração Potencializada por GPT-4o
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Gere Páginas de Vendas de <br className="hidden sm:block" />
            <span className="text-gradient">Alta Conversão em Segundos</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Pare de lutar com textos. Transforme a descrição do seu produto em uma página de vendas profissional e persuasiva instantaneamente usando IA avançada.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <a href={user ? "/dashboard" : "/api/login"}>
              <Button size="lg" className="h-14 px-8 text-lg btn-primary w-full sm:w-auto">
                Gerar Minha Página Agora <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
              Não é necessário cartão para a primeira geração
            </p>
          </div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="relative rounded-2xl border border-border shadow-2xl bg-card overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none z-10" />
            
            {/* Abstract UI representation */}
            <div className="grid grid-cols-12 h-[600px] divide-x divide-border">
              {/* Fake Sidebar */}
              <div className="hidden md:block col-span-2 bg-muted/20 p-6 space-y-4">
                <div className="h-8 w-24 bg-primary/20 rounded-lg mb-8" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
              </div>
              
              {/* Fake Main Area */}
              <div className="col-span-12 md:col-span-10 bg-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-8 w-48 bg-foreground/10 rounded-lg" />
                  <div className="h-10 w-32 bg-primary rounded-lg shadow-lg shadow-primary/20" />
                </div>
                
                <div className="grid grid-cols-2 gap-8 h-full">
                  <div className="space-y-6">
                    <div className="h-32 w-full bg-muted/30 rounded-xl border border-border" />
                    <div className="h-12 w-full bg-muted/30 rounded-xl border border-border" />
                    <div className="h-12 w-full bg-muted/30 rounded-xl border border-border" />
                  </div>
                  <div className="bg-muted/10 rounded-xl border border-border p-6 space-y-4">
                    <div className="h-6 w-3/4 bg-foreground/10 rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="mt-8 h-40 w-full bg-muted/20 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Tudo o que você precisa para converter visitantes
            </h2>
            <p className="text-lg text-muted-foreground">
              Nossa IA não apenas escreve texto. Ela estrutura argumentos persuasivos, cuida da formatação e otimiza para vendas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Copywriting Instantâneo</h3>
              <p className="text-muted-foreground">
                Gere títulos profissionais, benefícios e chamadas para ação em segundos com base em informações mínimas.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">HTML Formatado</h3>
              <p className="text-muted-foreground">
                Receba código HTML limpo e pronto para uso. Não é necessário lidar com ferramentas de formatação ou design.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Focado em Conversão</h3>
              <p className="text-muted-foreground">
                Treinado em páginas de vendas de alta conversão. Usamos frameworks comprovados como AIDA e PAS.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing CTA */}
      <div className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Comece a Gerar Vendas Hoje
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais de marketing que usam o SellPage AI para lançar produtos mais rápido.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle size={20} className="text-green-500" />
                <span>Acesso Instantâneo</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle size={20} className="text-green-500" />
                <span>Cancele a Qualquer Momento</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle size={20} className="text-green-500" />
                <span>Pagamento Seguro</span>
              </div>
            </div>

            <div className="mt-10">
              <a href={user ? "/dashboard" : "/api/login"}>
                <Button size="lg" className="h-14 px-10 text-lg btn-primary">
                  Começar Gratuitamente
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center">
              <Sparkles size={14} />
            </div>
            <span className="font-bold text-foreground">SellPage AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SellPage AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
