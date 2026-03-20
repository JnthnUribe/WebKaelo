import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, ChevronRight, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/usuarios": "Gestión de Usuarios",
  "/admin/rutas": "Moderación de Rutas",
  "/admin/comercios": "Moderación de Comercios",
  "/admin/analytics": "Analytics",
  "/comercio": "Dashboard Comercio",
  "/comercio/productos": "Gestión de Productos",
  "/comercio/pedidos": "Gestión de Pedidos",
  "/comercio/reviews": "Reviews",
  "/comercio/perfil": "Perfil del Negocio",
  "/comercio/analytics": "Analytics",
  "/creador/rutas": "Mis Rutas",
  "/creador/wallet": "Wallet",
  "/creador/analytics": "Analytics",
  "/configuracion": "Configuración",
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  comercio: "Comercio",
  creador: "Creador de Rutas",
};

export default function Layout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, currentRole, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pageName = breadcrumbMap[location.pathname] || "Kaelo";
  const isDark = theme === "dark";

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    // Clear Supabase session from localStorage FIRST
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
    try {
      await logout();
    } catch {
      // ignore — localStorage already cleared
    }
    // Force full page reload to guarantee login screen
    window.location.replace("/");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-sm">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-10 md:ml-0">
            <span className="font-medium text-primary">Kaelo</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{pageName}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="h-4.5 w-4.5" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="h-4.5 w-4.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>

            {/* Avatar + dropdown menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/20 ml-1 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className="text-[10px] text-primary font-medium mt-0.5">{roleLabels[currentRole]}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => { setMenuOpen(false); navigate("/configuracion"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Configuración
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
