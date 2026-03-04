import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Star, CreditCard } from "lucide-react";
import { transactions, formatMXN } from "@/lib/mockData";
import StatCard from "@/components/StatCard";

export default function WalletPage() {
  const balance = 1250;
  const totalEarned = transactions.filter(t => t.type === "ingreso").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold">💰 Mi Wallet</h1>

      <div className="bg-gradient-to-br from-primary to-primary-hover rounded-lg p-6 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-80">Balance disponible</p>
        <p className="text-3xl font-bold mt-1">{formatMXN(balance)}</p>
        <button disabled className="mt-4 px-4 py-2 rounded-lg bg-primary-foreground/20 text-sm font-medium cursor-not-allowed opacity-60" title="Mínimo $500 MXN">
          Retirar Fondos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total ganado" value={formatMXN(totalEarned)} icon={TrendingUp} color="primary" />
        <StatCard title="Rutas vendidas (mes)" value="4" icon={CreditCard} color="secondary" />
        <StatCard title="Rating como creador" value="4.7 ⭐" icon={Star} color="accent" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Historial de Transacciones</h2>
        <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Descripción</th>
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
      </div>
    </div>
  );
}
