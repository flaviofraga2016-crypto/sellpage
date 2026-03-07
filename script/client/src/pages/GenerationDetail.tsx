import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { ResultView } from "@/components/ResultView";
import { useGeneration } from "@/hooks/use-generations";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function GenerationDetail() {
  const [match, params] = useRoute("/dashboard/generation/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: generation, isLoading, error } = useGeneration(id);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 h-screen overflow-hidden flex flex-col">
        <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
          <header className="mb-6 shrink-0 flex items-center gap-4">
            <Link href="/dashboard/history">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {generation?.productName || "Carregando..."}
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerado em {generation?.createdAt ? new Date(generation.createdAt).toLocaleDateString() : "..."}
              </p>
            </div>
          </header>

          <div className="flex-1 min-h-0 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : error || !generation ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-bold text-foreground">Geração não encontrada</h3>
                <p className="text-muted-foreground mb-6">A geração que você está procurando não existe ou você não tem acesso.</p>
                <Link href="/dashboard">
                  <Button variant="outline">Voltar ao Painel</Button>
                </Link>
              </div>
            ) : (
              <ResultView generation={generation} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
