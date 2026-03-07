import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { CreateGenerationForm } from "@/components/CreateGenerationForm";
import { ResultView } from "@/components/ResultView";
import type { Generation } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  // If we have a generation ID in URL params or state, we can show it
  // For simplicity, we just keep local state for the current session's new generation
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 h-screen overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          <header className="mb-8 shrink-0">
            <h1 className="text-2xl font-display font-bold text-foreground">
              Nova Geração
            </h1>
            <p className="text-muted-foreground">
              Descreva seu produto e deixe a IA criar uma página de vendas de alta conversão.
            </p>
          </header>

          <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
            {/* Left Panel: Input Form */}
            <div className="col-span-12 lg:col-span-5 h-full min-h-0 bg-card rounded-2xl border border-border shadow-sm p-6 overflow-hidden">
              <CreateGenerationForm 
                onSuccess={(gen) => setCurrentGeneration(gen)} 
              />
            </div>

            {/* Right Panel: Results */}
            <div className="col-span-12 lg:col-span-7 h-full min-h-0">
              {currentGeneration ? (
                <ResultView generation={currentGeneration} />
              ) : (
                <div className="h-full bg-muted/10 rounded-2xl border border-border border-dashed flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Loader2 className="text-muted-foreground animate-spin-slow" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pronto para Gerar</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Preencha o formulário à esquerda para gerar sua página de vendas. O resultado aparecerá aqui instantaneamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
