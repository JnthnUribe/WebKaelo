import { ShoppingBag, DollarSign, Star, MessageSquare, Clock, Phone, ChevronRight } from "lucide-react";
import StatCard from "@/components/StatCard";
import { merchantStats, orders as mockOrders, dailyOrders, formatMXN } from "@/lib/mockData";
import { fetchOrders, fetchMerchantStats } from "@/lib/supabaseService";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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
  const [orderList, setOrderList] = useState(mockOrders);
  const [stats, setStats] = useState(merchantStats);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    fetchOrders().then(setOrderList);
    fetchMerchantStats().then(setStats);
  }, []);

  const advanceStatus = (id: string) => {
    setOrderList(prev => prev.map(o => {
      if (o.id === id && nextStatus[o.status]) {
        toast.success(`${statusIcons[nextStatus[o.status]]} Pedido ${id} → ${nextStatus[o.status]}`);
        return { ...o, status: nextStatus[o.status] as any };
      }
      return o;
    }));
  };

  const filtered = filter === "todos" ? orderList : orderList.filter(o => o.status === filter);
  const activeOrders = orderList.filter(o => !["entregado"].includes(o.status)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">🏪 Dashboard del Comercio</h1>
        <p className="text-muted-foreground text-sm">Café Cenote · Calle 60 #482, Centro, Mérida</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pedidos activos" value={String(activeOrders)} icon={ShoppingBag} color="primary" />
        <StatCard title="Ingresos del mes" value={formatMXN(stats.monthRevenue)} icon={DollarSign} color="accent" change={{ value: 18.5, label: "vs mes anterior" }} />
        <StatCard title="Rating" value={`${stats.rating} ⭐`} icon={Star} color="secondary" />
        <StatCard title="Reviews" value={String(stats.totalReviews)} icon={MessageSquare} color="success" change={{ value: 4 }} />
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <h3 className="font-semibold mb-4">Pedidos por Día</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyOrders}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">📋 Cola de Pedidos</h3>
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
                      {item.qty}× {item.name} <span className="text-foreground font-medium">{formatMXN(item.price)}</span>
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
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No hay pedidos con estado "{filter}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
