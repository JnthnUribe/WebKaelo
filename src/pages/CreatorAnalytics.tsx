import { Eye, ShoppingBag, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatMXN } from "@/lib/mockData";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const monthlyEarnings = [
    { month: "Sep", earnings: 1200, sales: 14 },
    { month: "Oct", earnings: 2100, sales: 25 },
    { month: "Nov", earnings: 1850, sales: 22 },
    { month: "Dic", earnings: 3200, sales: 38 },
    { month: "Ene", earnings: 3800, sales: 45 },
    { month: "Feb", earnings: 3400, sales: 40 },
];

const routePerformance = [
    { name: "Ruta de los Cenotes", views: 1250, purchases: 89, conversion: 7.1, revenue: 6412, rating: 4.8, refundRate: 1.1 },
    { name: "Costa Esmeralda", views: 520, purchases: 28, conversion: 5.4, revenue: 2023, rating: 4.4, refundRate: 3.6 },
    { name: "Haciendas del Norte", views: 0, purchases: 0, conversion: 0, revenue: 0, rating: 0, refundRate: 0 },
    { name: "Cenotes Secretos", views: 0, purchases: 0, conversion: 0, revenue: 0, rating: 0, refundRate: 0 },
];

const viewsVsSales = [
    { month: "Sep", views: 420, sales: 14 },
    { month: "Oct", views: 680, sales: 25 },
    { month: "Nov", views: 590, sales: 22 },
    { month: "Dic", views: 950, sales: 38 },
    { month: "Ene", views: 1100, sales: 45 },
    { month: "Feb", views: 980, sales: 40 },
];

export default function CreatorAnalytics() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">📈 Analytics de Rutas</h1>
                <p className="text-muted-foreground text-sm">Rendimiento de tus rutas publicadas</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Views totales" value="1,770" icon={Eye} color="primary" change={{ value: 15.3, label: "vs mes anterior" }} />
                <StatCard title="Ventas totales" value="117" icon={ShoppingBag} color="accent" change={{ value: 8.2 }} />
                <StatCard title="Conversión media" value="6.6%" icon={TrendingUp} color="secondary" change={{ value: 1.4 }} />
                <StatCard title="Earnings totales" value={formatMXN(15550)} icon={DollarSign} color="success" change={{ value: 22.1 }} />
            </div>

            {/* Earnings chart */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                <h3 className="font-semibold mb-4">Earnings Mensuales</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyEarnings}>
                        <defs>
                            <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} formatter={(v: any, name: string) => [name === "earnings" ? formatMXN(v) : v, name === "earnings" ? "Earnings" : "Ventas"]} />
                        <Area type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#earnGrad)" dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Views vs Sales */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                <h3 className="font-semibold mb-4">Views vs Ventas</h3>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={viewsVsSales}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                        <Legend />
                        <Bar dataKey="views" name="Views" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.4} />
                        <Bar dataKey="sales" name="Ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Route performance table */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                <h3 className="font-semibold mb-4">🗺️ Rendimiento por Ruta</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Ruta</th>
                                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Views</th>
                                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Ventas</th>
                                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Conversión</th>
                                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Revenue</th>
                                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Rating</th>
                                <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Refunds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routePerformance.map((r) => (
                                <tr key={r.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="py-3 px-3 font-medium">{r.name}</td>
                                    <td className="py-3 px-3 text-right">{r.views > 0 ? r.views.toLocaleString() : "—"}</td>
                                    <td className="py-3 px-3 text-right">{r.purchases > 0 ? r.purchases : "—"}</td>
                                    <td className="py-3 px-3 text-right">
                                        {r.conversion > 0 && (
                                            <span className="inline-flex items-center gap-1 text-emerald-500">
                                                {r.conversion}% <ArrowUpRight className="h-3 w-3" />
                                            </span>
                                        )}
                                        {r.conversion === 0 && "—"}
                                    </td>
                                    <td className="py-3 px-3 text-right font-medium text-emerald-500">{r.revenue > 0 ? formatMXN(r.revenue) : "—"}</td>
                                    <td className="py-3 px-3 text-right">{r.rating > 0 ? `${r.rating} ⭐` : "—"}</td>
                                    <td className="py-3 px-3 text-right">
                                        {r.refundRate > 0 && (
                                            <span className={r.refundRate > 3 ? "text-amber-500" : "text-muted-foreground"}>{r.refundRate}%</span>
                                        )}
                                        {r.refundRate === 0 && "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
