import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Clock, Phone, Globe, Camera } from "lucide-react";

const businessTypes = [
    { value: "restaurante", label: "Restaurante" },
    { value: "cafeteria", label: "Cafetería" },
    { value: "tienda", label: "Tienda" },
    { value: "taller_bicicletas", label: "Taller de Bicicletas" },
    { value: "hospedaje", label: "Hospedaje" },
    { value: "tienda_conveniencia", label: "Tienda de Conveniencia" },
    { value: "mercado", label: "Mercado" },
];

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function BusinessProfile() {
    const [profile, setProfile] = useState({
        name: "Café Cenote",
        description: "Cafetería artesanal con productos locales para ciclistas. Bebidas energéticas, snacks y comida yucateca.",
        type: "cafeteria",
        address: "Calle 60 #482, Centro, Mérida",
        phone: "+52 999 123 4567",
        whatsapp: "+52 999 123 4567",
        email: "info@cafecenote.mx",
        website: "www.cafecenote.mx",
        acceptsPreOrders: true,
        minimumOrder: 50,
        advanceHours: 2,
    });

    const [hours, setHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>({
        Lunes: { open: "07:00", close: "21:00", closed: false },
        Martes: { open: "07:00", close: "21:00", closed: false },
        Miércoles: { open: "07:00", close: "21:00", closed: false },
        Jueves: { open: "07:00", close: "21:00", closed: false },
        Viernes: { open: "07:00", close: "22:00", closed: false },
        Sábado: { open: "08:00", close: "22:00", closed: false },
        Domingo: { open: "08:00", close: "15:00", closed: false },
    });

    const handleSave = () => toast.success("✅ Perfil del negocio actualizado");

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold">🏪 Perfil del Negocio</h1>
                <p className="text-muted-foreground text-sm">Configura la información visible para los ciclistas</p>
            </div>

            {/* Cover & logo */}
            <section className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 relative flex items-center justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-sm font-medium hover:bg-card transition-colors">
                        <Camera className="h-4 w-4" /> Cambiar portada
                    </button>
                </div>
                <div className="p-5 -mt-10 flex items-end gap-4">
                    <div className="h-20 w-20 rounded-xl bg-card border-4 border-card shadow-md flex items-center justify-center text-3xl">☕</div>
                    <div>
                        <h2 className="text-lg font-bold">{profile.name}</h2>
                        <p className="text-sm text-muted-foreground capitalize">{profile.type}</p>
                    </div>
                </div>
            </section>

            {/* Basic info */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
                <h2 className="font-semibold">Información General</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Nombre del negocio</label>
                        <input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Tipo de negocio</label>
                        <select value={profile.type} onChange={(e) => setProfile(p => ({ ...p, type: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
                            {businessTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Descripción</label>
                    <textarea value={profile.description} onChange={(e) => setProfile(p => ({ ...p, description: e.target.value }))} rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
            </section>

            {/* Contact */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><Phone className="h-4 w-4" /> Contacto</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "Teléfono", key: "phone", icon: "📞" },
                        { label: "WhatsApp", key: "whatsapp", icon: "💬" },
                        { label: "Email", key: "email", icon: "✉️" },
                        { label: "Sitio web", key: "website", icon: "🌐" },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="text-sm text-muted-foreground mb-1 block">{f.icon} {f.label}</label>
                            <input value={(profile as any)[f.key]} onChange={(e) => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Location */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Ubicación</h2>
                <input value={profile.address} onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <div className="h-48 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border">
                    🗺️ Mapa de ubicación (integración con Mapbox)
                </div>
            </section>

            {/* Hours */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
                <h2 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4" /> Horarios</h2>
                <div className="space-y-2">
                    {days.map((day) => (
                        <div key={day} className="flex items-center gap-4 py-2">
                            <span className="text-sm font-medium w-24">{day}</span>
                            <label className="flex items-center gap-2 text-sm">
                                <button onClick={() => setHours(h => ({ ...h, [day]: { ...h[day], closed: !h[day].closed } }))}
                                    className={`w-9 h-5 rounded-full transition-colors ${hours[day].closed ? "bg-muted" : "bg-primary"}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${hours[day].closed ? "translate-x-0.5" : "translate-x-4"}`} />
                                </button>
                            </label>
                            {!hours[day].closed ? (
                                <div className="flex items-center gap-2">
                                    <input type="time" value={hours[day].open} onChange={(e) => setHours(h => ({ ...h, [day]: { ...h[day], open: e.target.value } }))}
                                        className="px-2 py-1 rounded border border-input bg-background text-sm" />
                                    <span className="text-muted-foreground text-sm">a</span>
                                    <input type="time" value={hours[day].close} onChange={(e) => setHours(h => ({ ...h, [day]: { ...h[day], close: e.target.value } }))}
                                        className="px-2 py-1 rounded border border-input bg-background text-sm" />
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground">Cerrado</span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Pre-order config */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
                <h2 className="font-semibold">⚙️ Configuración de Pedidos</h2>
                <div className="flex items-center justify-between py-1">
                    <span className="text-sm">Aceptar pre-órdenes</span>
                    <button onClick={() => setProfile(p => ({ ...p, acceptsPreOrders: !p.acceptsPreOrders }))}
                        className={`w-10 h-5 rounded-full transition-colors ${profile.acceptsPreOrders ? "bg-primary" : "bg-muted"}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${profile.acceptsPreOrders ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Pedido mínimo (MXN)</label>
                        <input type="number" value={profile.minimumOrder} onChange={(e) => setProfile(p => ({ ...p, minimumOrder: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Horas de anticipación</label>
                        <input type="number" value={profile.advanceHours} onChange={(e) => setProfile(p => ({ ...p, advanceHours: Number(e.target.value) }))}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                    </div>
                </div>
            </section>

            <button onClick={handleSave}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm">
                Guardar Cambios
            </button>
        </div>
    );
}
