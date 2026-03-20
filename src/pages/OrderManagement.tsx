import { useState, useEffect } from "react";
import { orders as mockOrders, formatMXN } from "@/lib/mockData";
import { fetchOrders } from "@/lib/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import PendingApproval from "@/components/PendingApproval";

const statusStyles: Record<string, string> = {
  pendiente: "bg-warning/15 text-warning",
  confirmado: "bg-info/15 text-info",
  preparando: "bg-accent/15 text-accent",
  listo: "bg-success/15 text-success",
  entregado: "bg-muted text-muted-foreground",
};
const allStatuses = ["todos", "pendiente", "confirmado", "preparando", "listo", "entregado"];

export default function OrderManagement() {
  const { userBusiness, isDemoMode } = useAuth();
  const [orderList, setOrderList] = useState(isDemoMode ? mockOrders : []);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    if (userBusiness?.status === 'pendiente' && !isDemoMode) return;
    fetchOrders(userBusiness?.id, isDemoMode).then(setOrderList);
  }, [userBusiness?.id, isDemoMode]);

  if (userBusiness?.status === 'pendiente' && !isDemoMode) {
    return <PendingApproval businessName={userBusiness?.name} />;
  }

  const filtered = filter === "todos" ? orderList : orderList.filter(o => o.status === filter);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold">Gestion de Pedidos</h1>
      <div className="flex flex-wrap gap-2">
        {allStatuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-pill text-xs font-medium capitalize transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {s}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm font-medium">
            {filter === "todos"
              ? "No hay pedidos aun. Cuando un ciclista haga un pedido desde la app, aparecera aqui."
              : `No hay pedidos con estado "${filter}"`}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pedido</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Pickup</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3 flex items-center gap-2"><img src={o.customerAvatar} className="h-6 w-6 rounded-full" />{o.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.items.map(i => `${i.name} x${i.qty}`).join(", ")}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatMXN(o.total)}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-pill text-xs font-bold capitalize ${statusStyles[o.status]}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{o.pickupTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
