import { ShoppingBag, DollarSign, Star, MessageSquare, Clock, ChevronRight } from "lucide-react";
import StatCard from "@/components/StatCard";
import PendingApproval from "@/components/PendingApproval";
import { orders as mockOrders, formatMXN } from "@/lib/mockData";
import { fetchOrders, fetchMerchantStats, updateOrderStatus, subscribeToOrders } from "@/lib/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  pendiente: "bg-amber-500/15 text-amber-600",
  confirmado: "bg-blue-500/15 text-blue-600",
  preparando: "bg-violet-500/15 text-violet-600",
  listo: "bg-emerald-500/15 text-emerald-600",
  entregado: "bg-slate-500/15 text-slate-500",
};

const statusIcons: Record<string, string> = {
  pendiente: "🔔",
  confirmado: "✅",
  preparando: "👨‍🍳",
  listo: "📦",
  entregado: "🏁",
};

const nextStatus: Record<string, string> = { pendiente: "confirmado", confirmado: "preparando", preparando: "listo", listo: "entregado" };
const nextLabel: Record<string, string> = { pendiente: "Confirmar", confirmado: "Preparar", preparando: "Marcar Listo", listo: "Entregar" };

export default function MerchantDashboard() {
  const { userBusiness, isDemoMode } = useAuth();
  const businessId = userBusiness?.id;
  const businessName = userBusiness?.name || "Mi Comercio";
  const isPending = userBusiness?.status === 'pendiente';

  const [orderList, setOrderList] = useState(isDemoMode ? mockOrders : []);
  const [stats, setStats] = useState({ ordersToday: 0, monthRevenue: 0, rating: 0, totalReviews: 0 });
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    if (isPending && !isDemoMode) return;
    fetchOrders(businessId, isDemoMode).then(setOrderList);
    fetchMerchantStats(businessId, isDemoMode).then(setStats);
  }, [businessId, isDemoMode, isPending]);

  // Real-time order updates
  useEffect(() => {
    if (!businessId || isDemoMode) return;
    const sub = subscribeToOrders(businessId, () => {
      fetchOrders(businessId).then(setOrderList);
    });
    return () => sub.unsubscribe();
  }, [businessId, isDemoMode]);

  const advanceStatus = async (id: string) => {
    const order = orderList.find(o => o.id === id);
    if (!order || !nextStatus[order.status]) return;

    const newStatus = nextStatus[order.status];

    // Optimistic update
    setOrderList(prev => prev.map(o =>
      o.id === id ? { ...o, status: newStatus as any } : o
    ));
    toast.success(`${statusIcons[newStatus]} Pedido ${id} → ${newStatus}`);

    // Persist to Supabase
    const result = await updateOrderStatus(id, newStatus);
    if (result.error) {
      // Rollback on error
      setOrderList(prev => prev.map(o =>
        o.id === id ? { ...o, status: order.status } : o
      ));
      toast.error(`Error al actualizar: ${result.error}`);
    }
  };

  const filtered = filter === "todos" ? orderList : orderList.filter(o => o.status === filter);
  const activeOrders = orderList.filter(o => !["entregado"].includes(o.status)).length;

  if (isPending && !isDemoMode) {
    return <PendingApproval businessName={businessName} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard del Comercio</h1>
        <p className="text-muted-foreground text-sm">{businessName}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pedidos activos" value={String(activeOrders)} icon={ShoppingBag} color="primary" />
        <StatCard title="Ingresos del mes" value={formatMXN(stats.monthRevenue)} icon={DollarSign} color="accent" />
        <StatCard title="Rating" value={`${stats.rating} ⭐`} icon={Star} color="secondary" />
        <StatCard title="Reviews" value={String(stats.totalReviews)} icon={MessageSquare} color="success" />
      </div>

      {/* Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Cola de Pedidos</h3>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {["todos", "pendiente", "confirmado", "preparando", "listo"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="bg-card border border-border rounded-xl p-4 shadow-card">
              <div className="flex flex-wrap items-start gap-4">
                {/* Customer */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <img src={o.customerAvatar} alt={o.customerName} className="h-10 w-10 rounded-full border-2 border-primary/10" />
                  <div>
                    <p className="text-sm font-semibold">{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.id}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 min-w-[200px]">
                  {o.items.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {item.qty}x {item.name} <span className="text-foreground font-medium">{formatMXN(item.price)}</span>
                    </p>
                  ))}
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatMXN(o.total)}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Pickup: {o.pickupTime}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[o.status]}`}>
                    {statusIcons[o.status]} {o.status}
                  </span>
                  {nextStatus[o.status] && (
                    <button onClick={() => advanceStatus(o.id)}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                      {nextLabel[o.status]} <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm font-medium">
                {filter === "todos"
                  ? "No hay pedidos aún. Cuando un ciclista haga un pedido desde la app, aparecerá aquí."
                  : `No hay pedidos con estado "${filter}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
