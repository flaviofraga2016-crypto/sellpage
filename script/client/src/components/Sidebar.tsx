import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useGenerations } from "@/hooks/use-generations";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  LogOut, 
  CreditCard,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const { data: generations } = useGenerations();

  const isActive = (path: string) => location === path;

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 z-20">
      {/* Logo Area */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
          <Sparkles size={18} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-foreground">
          SellPage AI
        </span>
      </div>

      {/* Main Navigation */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/dashboard" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            isActive("/dashboard") 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <PlusCircle size={20} className={isActive("/dashboard") ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
            <span>Nova Geração</span>
          </Link>

          <Link href="/dashboard/history" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            isActive("/dashboard/history") 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <History size={20} className={isActive("/dashboard/history") ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
            <span>Histórico</span>
          </Link>

          <Link href="/pricing" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            isActive("/pricing") 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <CreditCard size={20} className={isActive("/pricing") ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
            <span>Assinatura</span>
          </Link>
        </div>

        {/* Trial Counter Widget */}
        {generations && !window.location.search.includes("admin=true") && (
          <div className="px-4 mt-6">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Uso do Trial</span>
                <span className="text-xs font-bold text-foreground">
                  {Math.min(generations.length, 3)} de 3
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    generations.length >= 3 ? "bg-destructive" : "bg-primary"
                  )}
                  style={{ width: `${(Math.min(generations.length, 3) / 3) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {generations.length >= 3 
                  ? "Limite atingido. Faça o upgrade!" 
                  : `${3 - generations.length} gerações restantes`}
              </p>
            </div>
          </div>
        )}

        {/* Recent Generations Widget */}
        {generations && generations.length > 0 && (
          <div className="mt-8">
            <h4 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Recentes
            </h4>
            <div className="space-y-1">
              {generations.slice(0, 5).map((gen) => (
                <Link key={gen.id} href={`/dashboard/generation/${gen.id}`} className="block">
                  <div className="px-4 py-2 rounded-lg hover:bg-muted group transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                        {gen.productName || "Untitled Project"}
                      </span>
                      <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(gen.createdAt || "").toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.firstName?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate max-w-[100px]">
                {user?.firstName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                {user?.email}
              </p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
