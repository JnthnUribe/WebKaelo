import { DollarSign, TrendingUp, ShoppingBag, Route, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatMXN } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const revenueBySource = [
    { month: "Sep", rutas: 4500, pedidos: 2800, total: 7300 },
    { month: "Oct", rutas: 6200, pedidos: 4100, total: 10300 },
    { month: "Nov", rutas: 7800, pedidos: 5200, total: 13000 },
    { month: "Dic", rutas: 10200, pedidos: 6800, total: 17000 },
    { month: "Ene", rutas: 12500, pedidos: 8200, total: 20700 },
    { month: "Feb", rutas: 11800, pedidos: 7500, total: 19300 },
];

const topRoutes = [
    { name: "Ruta de los Cenotes", sales: 89, revenue: 7565, conversion: 7.1 },
    { name: "Camino Real Maya", sales: 56, revenue: 8400, conversion: 5.7 },
    { name: "Ruta Arqueológica Uxmal", sales: 41, revenue: 4100, conversion: 4.6 },
    { name: "Cenotes del Oriente", sales: 32, revenue: 3840, conversion: 4.9 },
    { name: "Costa Esmeralda", sales: 28, revenue: 2380, conversion: 5.4 },
];

const usersByType = [
    { name: "Ciclistas", value: 420, color: "hsl(var(--primary))" },
    { name: "Creadores", value: 45, color: "hsl(var(--accent))" },
    { name: "Comercios", value: 73, color: "hsl(var(--secondary))" },
];

const kpiCards = [
    { title: "GMV Total", value: formatMXN(87500), icon: DollarSign, change: 18.3, color: "primary" as const },
    { title: "Take Rate", value: "12.4%", icon: TrendingUp, change: 1.2, color: "accent" as const },
    { title: "Transacciones", value: "246", icon: ShoppingBag, change: 22.8, color: "secondary" as const },
    { title: "Tasa de Refund", value: "2.1%", icon: Route, change: -0.5, color: "success" as const },
];

function EmptyAnalytics() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Analytics de Plataforma</h1>
                <p className="text-muted-foreground text-sm">Metricas detalladas de revenue y rendimiento</p>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">Sin datos de analytics</h2>
                <p className="text-muted-foreground max-w-md">
                    Los analytics se generaran automaticamente cuando haya transacciones, ventas de rutas y actividad en la plataforma.
                </p>
            </div>
        </div>
    );
}

export default function AdminAnalytics() {
    const { isDemoMode } = useAuth();

    if (!isDemoMode) return <EmptyAnalytics />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Analytics de Plataforma</h1>
                <p className="text-muted-foreground text-sm">Metricas detalladas de revenue y rendimiento</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((k) => (
                    <StatCard key={k.title} title={k.title} value={k.value} icon={k.icon} color={k.color} change={{ value: k.change, label: "vs mes anterior" }} />
                ))}
            </div>

            {/* Revenue by source */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                <h3 className="font-semibold mb-4">Revenue por Fuente</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueBySource}>
                        <defs>
                            <linearGradient id="rutasGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="pedidosGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} formatter={(v: any) => formatMXN(v)} />
                        <Legend />
                        <Area type="monotone" dataKey="rutas" name="Venta de Rutas" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rutasGrad)" />
                        <Area type="monotone" dataKey="pedidos" name="Comision Pedidos" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#pedidosGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Top routes */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
                    <h3 className="font-semibold mb-4">Top Rutas por Revenue</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Ruta</th>
                                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Ventas</th>
                                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Revenue</th>
                                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Conversion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topRoutes.map((r, i) => (
                                    <tr key={r.name} className="border-b border-border last:border-0">
                                        <td className="py-2.5 px-3 font-medium">
                                            <span className="text-muted-foreground mr-2">#{i + 1}</span>{r.name}
                                        </td>
                                        <td className="py-2.5 px-3 text-right">{r.sales}</td>
                                        <td className="py-2.5 px-3 text-right font-medium text-emerald-500">{formatMXN(r.revenue)}</td>
                                        <td className="py-2.5 px-3 text-right">{r.conversion}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Users by type */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                    <h3 className="font-semibold mb-4">Usuarios por Tipo</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={usersByType} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                                {usersByType.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {usersByType.map((u) => (
                            <div key={u.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: u.color }} />
                                    <span>{u.name}</span>
                                </div>
                                <span className="font-medium">{u.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
