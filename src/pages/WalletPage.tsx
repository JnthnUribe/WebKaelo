import { ArrowUpRight, ArrowDownLeft, TrendingUp, Star, CreditCard } from "lucide-react";
import { transactions as mockTransactions, formatMXN } from "@/lib/mockData";
import { fetchWalletData } from "@/lib/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/StatCard";
import { useState, useEffect } from "react";

export default function WalletPage() {
  const { user, isDemoMode } = useAuth();
  const [transactions, setTransactions] = useState(isDemoMode ? mockTransactions : []);
  const [balance, setBalance] = useState(isDemoMode ? 1250 : 0);

  useEffect(() => {
    if (isDemoMode) {
      setTransactions(mockTransactions);
      setBalance(1250);
      return;
    }
    if (!user?.id) return;
    fetchWalletData(user.id).then((data) => {
      if (data) {
        setBalance(data.balance);
        setTransactions(data.transactions);
      }
    });
  }, [user?.id, isDemoMode]);

  const totalEarned = transactions.filter(t => t.type === "ingreso").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold">Mi Wallet</h1>

      <div className="bg-gradient-to-br from-primary to-primary-hover rounded-lg p-6 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-80">Balance disponible</p>
        <p className="text-3xl font-bold mt-1">{formatMXN(balance)}</p>
        <button disabled={balance < 500}
          className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${balance >= 500 ? "bg-primary-foreground/20 hover:bg-primary-foreground/30 cursor-pointer" : "bg-primary-foreground/20 cursor-not-allowed opacity-60"}`}
          title={balance < 500 ? "Minimo $500 MXN" : "Solicitar retiro"}>
          Retirar Fondos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total ganado" value={formatMXN(totalEarned)} icon={TrendingUp} color="primary" />
        <StatCard title="Rutas vendidas (mes)" value={String(transactions.filter(t => t.type === "ingreso").length)} icon={CreditCard} color="secondary" />
        <StatCard title="Rating como creador" value={isDemoMode ? "4.7" : "—"} icon={Star} color="accent" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Historial de Transacciones</h2>
        {transactions.length === 0 ? (
          <div className="bg-card border border-border rounded-lg shadow-card p-10 text-center">
            <p className="text-3xl mb-3">💰</p>
            <p className="font-medium mb-1">Sin transacciones aun</p>
            <p className="text-sm text-muted-foreground">Cuando un ciclista compre una de tus rutas, veras tus ingresos aqui.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Descripcion</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Monto</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      {t.type === "ingreso" ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownLeft className="h-4 w-4 text-error" />}
                    </td>
                    <td className="px-4 py-3">{t.description}</td>
                    <td className={`px-4 py-3 text-right font-medium ${t.type === "ingreso" ? "text-success" : "text-error"}`}>
                      {t.type === "ingreso" ? "+" : "-"}{formatMXN(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
