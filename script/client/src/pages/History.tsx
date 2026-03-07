import { Sidebar } from "@/components/Sidebar";
import { useGenerations } from "@/hooks/use-generations";
import { Link } from "wouter";
import { Loader2, Calendar, ArrowRight, FileText } from "lucide-react";

export default function History() {
  const { data: generations, isLoading } = useGenerations();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">
              Histórico
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie suas gerações de páginas de vendas anteriores.
            </p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : !generations || generations.length === 0 ? (
            <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma geração ainda</h3>
              <p className="text-muted-foreground mb-6">Comece criando sua primeira página de vendas.</p>
              <Link href="/dashboard">
                <button className="btn-primary">Criar Nova</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {generations.map((gen) => (
                <Link key={gen.id} href={`/dashboard/generation/${gen.id}`}>
                  <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {gen.productName || "Projeto sem Título"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">
                        {gen.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{new Date(gen.createdAt || "").toLocaleDateString()}</span>
                      </div>
                      <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
