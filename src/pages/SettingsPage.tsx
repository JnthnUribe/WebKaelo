import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const roleLabels: Record<string, string> = {
  admin: "Administrador de Plataforma",
  comercio: "Dueño de Negocio",
  creador: "Creador de Rutas",
};

export default function SettingsPage() {
  const { user, currentRole, logout } = useAuth();
  const [notifications, setNotifications] = useState({ pedidos: true, moderacion: true, pagos: true, emails: true });
  const [privacy, setPrivacy] = useState({ publicProfile: true });

  const notifLabels: Record<string, string> = {
    pedidos: "Nuevos pedidos",
    moderacion: "Alertas de moderación",
    pagos: "Pagos y retiros",
    emails: "Notificaciones por email",
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold">⚙️ Configuración</h1>

      {/* Profile */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
        <h2 className="font-semibold">Perfil</h2>
        <div className="flex items-center gap-4">
          <img src={user.avatar} className="h-16 w-16 rounded-full border-2 border-primary/20" alt="Avatar" />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{roleLabels[currentRole]}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Nombre</label>
            <input defaultValue={user.name}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <input defaultValue={user.email} type="email"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
        <h2 className="font-semibold">🔒 Seguridad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Contraseña actual</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Nueva contraseña</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-3">
        <h2 className="font-semibold">🔔 Notificaciones</h2>
        {Object.entries(notifications).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between py-1">
            <span className="text-sm">{notifLabels[key] || key}</span>
            <button onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
              className={`w-10 h-5 rounded-full transition-colors ${val ? "bg-primary" : "bg-muted"}`}>
              <div className={`w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform ${val ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </section>

      {/* Privacy */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-3">
        <h2 className="font-semibold">🔐 Privacidad</h2>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm">Perfil público</span>
          <button onClick={() => setPrivacy(p => ({ ...p, publicProfile: !p.publicProfile }))}
            className={`w-10 h-5 rounded-full transition-colors ${privacy.publicProfile ? "bg-primary" : "bg-muted"}`}>
            <div className={`w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform ${privacy.publicProfile ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-card border border-error/30 rounded-xl p-5 shadow-card space-y-3">
        <h2 className="font-semibold text-error">Zona de Peligro</h2>
        <div className="flex gap-3">
          <button onClick={logout}
            className="px-4 py-2 rounded-lg border border-error text-error text-sm font-medium hover:bg-error/10 transition-colors">
            Cerrar Sesión
          </button>
          <button onClick={() => { if (confirm("¿Estás seguro? Esta acción es irreversible.")) toast.error("Cuenta eliminada"); }}
            className="px-4 py-2 rounded-lg bg-error text-primary-foreground text-sm font-medium hover:bg-error/90 transition-colors">
            Eliminar Cuenta
          </button>
        </div>
      </section>

      <button onClick={() => toast.success("✅ Configuración guardada")}
        className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors">
        Guardar Cambios
      </button>
    </div>
  );
}
