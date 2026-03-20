import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, updatePassword } from "@/lib/supabaseService";

const roleLabels: Record<string, string> = {
  admin: "Administrador de Plataforma",
  comercio: "Dueno de Negocio",
  creador: "Creador de Rutas",
};

export default function SettingsPage() {
  const { user, currentRole, isDemoMode } = useAuth();
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState({ pedidos: true, moderacion: true, pagos: true, emails: true });
  const [privacy, setPrivacy] = useState({ publicProfile: true });
  const [saving, setSaving] = useState(false);

  const notifLabels: Record<string, string> = {
    pedidos: "Nuevos pedidos",
    moderacion: "Alertas de moderacion",
    pagos: "Pagos y retiros",
    emails: "Notificaciones por email",
  };

  const handleSave = async () => {
    if (isDemoMode) {
      toast.success("Configuracion guardada (modo demo)");
      return;
    }
    setSaving(true);

    // Update profile name
    if (user.id && name !== user.name) {
      const result = await updateProfile(user.id, { full_name: name });
      if (result.error) {
        setSaving(false);
        toast.error(`Error al actualizar perfil: ${result.error}`);
        return;
      }
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        setSaving(false);
        toast.error("La contrasena debe tener al menos 6 caracteres");
        return;
      }
      const result = await updatePassword(newPassword);
      if (result.error) {
        setSaving(false);
        toast.error(`Error al cambiar contrasena: ${result.error}`);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
    }

    setSaving(false);
    toast.success("Configuracion guardada");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold">Configuracion</h1>

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
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <input value={email} type="email" disabled
              className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm opacity-60 cursor-not-allowed" />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-4">
        <h2 className="font-semibold">Seguridad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Contrasena actual</label>
            <input type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Nueva contrasena</label>
            <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-xl p-5 shadow-card space-y-3">
        <h2 className="font-semibold">Notificaciones</h2>
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
        <h2 className="font-semibold">Privacidad</h2>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm">Perfil publico</span>
          <button onClick={() => setPrivacy(p => ({ ...p, publicProfile: !p.publicProfile }))}
            className={`w-10 h-5 rounded-full transition-colors ${privacy.publicProfile ? "bg-primary" : "bg-muted"}`}>
            <div className={`w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform ${privacy.publicProfile ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </section>

      <button onClick={handleSave} disabled={saving}
        className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-60">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : "Guardar Cambios"}
      </button>
    </div>
  );
}
