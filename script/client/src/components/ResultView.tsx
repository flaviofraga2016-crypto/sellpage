import { Copy, Check, ExternalLink, Code } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionStatus } from "@/hooks/use-billing";
import type { Generation } from "@shared/schema";

interface ResultViewProps {
  generation: Generation;
}

export function ResultView({ generation }: ResultViewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { data: subscription } = useSubscriptionStatus();
  const output = generation.output as any;

  const isPro = !!subscription?.isActive;

  const handleCopy = () => {
    if (!output?.html) return;
    navigator.clipboard.writeText(output.html);
    setCopied(true);
    toast({
      title: "Copiado!",
      description: "O código HTML foi copiado para sua área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const downloads = localStorage.getItem("downloads_free");

      if (!downloads) {
        localStorage.setItem("downloads_free", "1");
      } else {
        alert("Limite gratuito atingido. Faça upgrade para baixar ilimitado.");
        return;
      }

      if (!output?.html) {
        alert("Nenhuma página gerada.");
        return;
      }

      const blob = new Blob([output.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "landing-page.html";
      a.click();

      URL.revokeObjectURL(url);
  
  };

  if (!output) return null;

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#020617",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* Barra topo */}
      <div style={{
        padding: "14px",
        background: "#020617",
        borderBottom: "1px solid #111",
        display: "flex",
        justifyContent: "center",
        gap: "10px"
      }}>

        <button
          onClick={handleDownload}
          style={{
            background: "linear-gradient(90deg,#6366f1,#06b6d4)",
            border: "none",
            padding: "12px 20px",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ⬇ Baixar Landing Page
        </button>

        <button
          onClick={handleCopy}
          style={{
            background: "#0f172a",
            border: "1px solid #333",
            padding: "12px 20px",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          📋 Copiar HTML
        </button>

      </div>

      {/* Preview */}
      <iframe
        srcDoc={output.html}
        title="preview"
        style={{
          width: "100%",
          flex: 1,
          border: "none",
          background: "white"
        }}
      />

    </div>
  );
}
