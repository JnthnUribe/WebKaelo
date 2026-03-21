import { motion } from "framer-motion";
import { Store, Map } from "lucide-react";
import { useAuth, type UserRole } from "@/contexts/AuthContext";

const roleConfig: Record<string, { icon: React.ReactNode; label: string; description: string; color: string }> = {
  comercio: {
    icon: <Store className="h-10 w-10" />,
    label: "Mi Comercio",
    description: "Gestiona pedidos, productos, reseñas y el perfil de tu negocio.",
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-500/70",
  },
  creador: {
    icon: <Map className="h-10 w-10" />,
    label: "Creador de Rutas",
    description: "Administra tus rutas, revisa ventas y consulta tu wallet.",
    color: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/70",
  },
};

export default function RoleSelector() {
  const { user, availableRoles, selectRole } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-muted-foreground mb-1">Bienvenido de nuevo</p>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Tu cuenta tiene acceso a múltiples paneles.<br />¿Con cuál quieres continuar?
          </p>
        </motion.div>

        {/* Role cards */}
        <div className="flex flex-col gap-4">
          {availableRoles.map((role, i) => {
            const cfg = roleConfig[role];
            if (!cfg) return null;
            return (
              <motion.button
                key={role}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                onClick={() => selectRole(role as UserRole)}
                className={`w-full text-left flex items-center gap-5 p-5 rounded-2xl border bg-gradient-to-br ${cfg.color} transition-all duration-200 group`}
              >
                <div className="flex-shrink-0 text-foreground/70 group-hover:text-foreground transition-colors">
                  {cfg.icon}
                </div>
                <div>
                  <p className="font-semibold text-base">{cfg.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{cfg.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
