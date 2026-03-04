import { useState, useEffect } from "react";
import { Users, Route, Store, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import { adminStats as mockAdminStats, adminGrowth, adminRevenue, formatMXN, formatNumber, pendingRoutes, pendingBusinesses } from "@/lib/mockData";
import { fetchAdminStats } from "@/lib/supabaseService";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";

const recentActivity = [
  { id: "1", text: "Nuevo comercio registrado: Taquería Don Pepe", icon: Store, time: "Hace 15 min", type: "info" },
  { id: "2", text: "Ruta aprobada: Ruta del Flamenco por Sofía Canul", icon: CheckCircle, time: "Hace 1 hora", type: "success" },
  { id: "3", text: "Usuario suspendido: Diego Balam — violación de ToS", icon: AlertCircle, time: "Hace 2 horas", type: "warning" },
  { id: "4", text: "Nueva ruta enviada para revisión: Camino de las Haciendas", icon: Clock, time: "Hace 3 horas", type: "info" },
  { id: "5", text: "Retiro procesado: Carlos Méndez — $500 MXN", icon: DollarSign, time: "Hace 5 horas", type: "success" },
];

const activityColors: Record<string, string> = {
  info: "text-blue-500 bg-blue-500/10",
  success: "text-emerald-500 bg-emerald-500/10",
  warning: "text-amber-500 bg-amber-500/10",
};

export default function AdminPanel() {
  const [stats, setStats] = useState(mockAdminStats);

  useEffect(() => {
    fetchAdminStats().then(setStats);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">🛡️ Panel de Administración</h1>
        <p className="text-muted-foreground text-sm">Vista general de la plataforma Kaelo</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total usuarios" value={formatNumber(stats.totalUsers)} icon={Users} color="primary" change={{ value: 12.3, label: "vs mes anterior" }} />
        <StatCard title="Rutas publicadas" value={String(stats.totalRoutes)} icon={Route} color="secondary" change={{ value: 8.5 }} />
        <StatCard title="Comercios activos" value={String(stats.totalBusinesses)} icon={Store} color="accent" change={{ value: 16.7 }} />
        <StatCard title="Revenue total" value={formatMXN(stats.totalRevenue)} icon={DollarSign} color="success" change={{ value: 22.1 }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-4">Crecimiento de Usuarios</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={adminGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#userGrad)" dot={{ r: 4, fill: "hsl(var(--primary))" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-4">Revenue de Plataforma</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={adminRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} formatter={(v: any) => formatMXN(v)} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 4, fill: "hsl(var(--accent))" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending items + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending moderation */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">⏳ Pendientes de Moderación</h3>
            <span className="text-xs bg-warning/15 text-warning px-2.5 py-1 rounded-full font-bold">{pendingRoutes.length + pendingBusinesses.length}</span>
          </div>
          <div className="space-y-3">
            {pendingRoutes.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">por {r.creator} · {r.distance} km · {r.difficulty}</p>
                </div>
                <Link to="/admin/rutas" className="text-xs font-medium text-primary hover:underline">Revisar</Link>
              </div>
            ))}
            {pendingBusinesses.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.type} · {b.owner} · {b.location}</p>
                </div>
                <Link to="/admin/comercios" className="text-xs font-medium text-primary hover:underline">Revisar</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-4">🕐 Actividad Reciente</h3>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg shrink-0 ${activityColors[a.type]}`}>
                  <a.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
