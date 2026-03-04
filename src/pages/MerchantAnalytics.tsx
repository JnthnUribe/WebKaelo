import { DollarSign, ShoppingBag, TrendingUp, Clock, Package } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatMXN } from "@/lib/mockData";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const dailyRevenue = [
    { day: "Lun", revenue: 850, orders: 5 },
    { day: "Mar", revenue: 1320, orders: 8 },
    { day: "Mié", revenue: 480, orders: 3 },
    { day: "Jue", revenue: 1100, orders: 7 },
    { day: "Vie", revenue: 1950, orders: 12 },
    { day: "Sáb", revenue: 2400, orders: 15 },
    { day: "Dom", revenue: 1500, orders: 9 },
];

const weeklyTrend = [
    { week: "Sem 1", revenue: 5200 },
    { week: "Sem 2", revenue: 6800 },
    { week: "Sem 3", revenue: 4300 },
    { week: "Sem 4", revenue: 7100 },
];

const topProducts = [
    { name: "Kit Energético", qty: 45, revenue: 5400 },
    { name: "Café de Olla", qty: 62, revenue: 2790 },
    { name: "Pan de Cazón", qty: 28, revenue: 2660 },
    { name: "Horchata con Coco", qty: 35, revenue: 1925 },
];

const hourlyPeak = [
    { hour: "7-8", orders: 3 },
    { hour: "8-9", orders: 8 },
    { hour: "9-10", orders: 12 },
    { hour: "10-11", orders: 15 },
    { hour: "11-12", orders: 10 },
    { hour: "12-1", orders: 7 },
    { hour: "1-2", orders: 5 },
    { hour: "2-3", orders: 3 },
];

const paymentMethods = [
    { name: "Tarjeta", value: 65, color: "hsl(var(--primary))" },
    { name: "Efectivo", value: 30, color: "hsl(var(--accent))" },
    { name: "Wallet", value: 5, color: "hsl(var(--secondary))" },
];

export default function MerchantAnalytics() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">📈 Analytics del Comercio</h1>
                <p className="text-muted-foreground text-sm">Rendimiento de Café Cenote · Febrero 2026</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Revenue del mes" value={formatMXN(9600)} icon={DollarSign} color="primary" change={{ value: 18.5, label: "vs enero" }} />
                <StatCard title="Total pedidos" value="59" icon={ShoppingBag} color="accent" change={{ value: 12.3 }} />
                <StatCard title="Ticket promedio" value={formatMXN(162.7)} icon={TrendingUp} color="secondary" change={{ value: 5.1 }} />
                <StatCard title="Tiempo promedio" value="18 min" icon={Clock} color="success" change={{ value: -8.2, label: "más rápido" }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Daily revenue */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                    <h3 className="font-semibold mb-4">Revenue Diario</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={dailyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} formatter={(v: any) => formatMXN(v)} />
                            <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Hourly peak */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                    <h3 className="font-semibold mb-4">🕐 Horas Pico</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={hourlyPeak}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                            <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Top products */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
                    <h3 className="font-semibold mb-4">🏆 Productos Más Vendidos</h3>
                    <div className="space-y-3">
                        {topProducts.map((p, i) => (
                            <div key={p.name} className="flex items-center gap-4">
                                <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{p.name}</span>
                                        <span className="text-sm font-bold text-emerald-500">{formatMXN(p.revenue)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-accent rounded-full" style={{ width: `${(p.qty / topProducts[0].qty) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-muted-foreground">{p.qty} uds</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment methods */}
                <div className="bg-card border border-border rounded-xl p-5 shadow-card">
                    <h3 className="font-semibold mb-4">💳 Métodos de Pago</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                                {paymentMethods.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} formatter={(v: any) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {paymentMethods.map((m) => (
                            <div key={m.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                                    <span>{m.name}</span>
                                </div>
                                <span className="font-medium">{m.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
