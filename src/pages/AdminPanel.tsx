import { useState, useEffect } from "react";
import { Users, Route, Store, DollarSign } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatMXN, formatNumber } from "@/lib/mockData";
import { fetchAdminStats, fetchPendingRoutes, fetchPendingBusinesses } from "@/lib/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const { isDemoMode } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalRoutes: 0, totalBusinesses: 0, totalRevenue: 0 });
  const [pendingRoutes, setPendingRoutes] = useState<any[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminStats(isDemoMode).then(setStats);
    fetchPendingRoutes().then(setPendingRoutes);
    fetchPendingBusinesses().then(setPendingBusinesses);
  }, [isDemoMode]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Panel de Administracion</h1>
        <p className="text-muted-foreground text-sm">Vista general de la plataforma Kaelo</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total usuarios" value={formatNumber(stats.totalUsers)} icon={Users} color="primary" />
        <StatCard title="Rutas publicadas" value={String(stats.totalRoutes)} icon={Route} color="secondary" />
        <StatCard title="Comercios activos" value={String(stats.totalBusinesses)} icon={Store} color="accent" />
        <StatCard title="Revenue total" value={formatMXN(stats.totalRevenue)} icon={DollarSign} color="success" />
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending moderation */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pendientes de Moderacion</h3>
            <span className="text-xs bg-warning/15 text-warning px-2.5 py-1 rounded-full font-bold">{pendingRoutes.length + pendingBusinesses.length}</span>
          </div>
          {pendingRoutes.length === 0 && pendingBusinesses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm text-muted-foreground">No hay elementos pendientes de revision</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="font-semibold mb-4">Accesos Rapidos</h3>
          <div className="space-y-3">
            <Link to="/admin/usuarios" className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-medium">Gestion de Usuarios</p>
                <p className="text-xs text-muted-foreground">{stats.totalUsers} usuarios registrados</p>
              </div>
            </Link>
            <Link to="/admin/rutas" className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-secondary/10"><Route className="h-4 w-4 text-secondary" /></div>
              <div>
                <p className="text-sm font-medium">Moderacion de Rutas</p>
                <p className="text-xs text-muted-foreground">{pendingRoutes.length} pendientes de revision</p>
              </div>
            </Link>
            <Link to="/admin/comercios" className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-accent/10"><Store className="h-4 w-4 text-accent" /></div>
              <div>
                <p className="text-sm font-medium">Moderacion de Comercios</p>
                <p className="text-xs text-muted-foreground">{pendingBusinesses.length} pendientes de aprobacion</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
