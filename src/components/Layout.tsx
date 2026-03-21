import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, ChevronRight, Settings, LogOut, ShoppingBag, Map, Star, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { fetchNotifications, markNotificationsRead, fetchUserPreferences, type NotificationItem } from "@/lib/supabaseService";

// Tipos de notificación que corresponden a cada rol
const ROLE_NOTIF_TYPES: Record<string, string[]> = {
  admin:    [], // sin filtro — ve todo
  comercio: ["orden_recibida", "nueva_resena", "sistema"],
  creador:  ["ruta_comprada", "pago_recibido", "sistema"],
};

const DEMO_NOTIFICATIONS: Record<string, NotificationItem[]> = {
  admin: [
    { id: "d1", title: "Negocios pendientes", body: "2 negocios pendientes de aprobación", notification_type: "negocio_pendiente", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
    { id: "d2", title: "Ruta para moderar", body: "1 ruta en revisión esperando moderación", notification_type: "ruta_pendiente", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
  ],
  comercio: [
    { id: "d3", title: "Nuevo pedido", body: "Nuevo pedido #0042 recibido", notification_type: "orden_recibida", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
    { id: "d4", title: "Nueva reseña", body: "Nueva reseña ⭐⭐⭐⭐⭐ de un cliente", notification_type: "nueva_resena", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
  ],
  creador: [
    { id: "d5", title: "Ruta aprobada", body: "Tu ruta 'Ruta Cenotes' fue aprobada", notification_type: "ruta_comprada", is_read: true, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
  ],
};

function notificationIcon(type: string) {
  switch (type) {
    case "orden_recibida":   return <ShoppingBag className="h-3.5 w-3.5 text-primary" />;
    case "ruta_comprada":
    case "pago_recibido":
    case "ruta_pendiente":   return <Map className="h-3.5 w-3.5 text-primary" />;
    case "nueva_resena":     return <Star className="h-3.5 w-3.5 text-primary" />;
    case "negocio_pendiente": return <Store className="h-3.5 w-3.5 text-primary" />;
    default:                 return <Bell className="h-3.5 w-3.5 text-primary" />;
  }
}

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
  const { user, currentRole, logout, isDemoMode, supabaseUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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

  // Close notifications on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  const openNotifications = async () => {
    if (notifOpen) { setNotifOpen(false); return; }
    setNotifOpen(true);

    if (isDemoMode) {
      const mocks = (DEMO_NOTIFICATIONS[currentRole] ?? []).map((n) => ({ ...n, is_read: true }));
      setNotifications(mocks);
      return;
    }

    if (!supabaseUser?.id) return;
    setNotifLoading(true);
    const roleTypes = ROLE_NOTIF_TYPES[currentRole] ?? [];
    const prefs = await fetchUserPreferences(supabaseUser.id);
    const notifPrefs = prefs?.notifications;

    let typesToFetch: string[] | undefined;
    if (roleTypes.length > 0) {
      let filtered = [...roleTypes];
      if (notifPrefs) {
        if (notifPrefs.pedidos === false)    filtered = filtered.filter(t => t !== 'orden_recibida' && t !== 'ruta_comprada');
        if (notifPrefs.moderacion === false) filtered = filtered.filter(t => t !== 'sistema');
        if (notifPrefs.pagos === false)      filtered = filtered.filter(t => t !== 'pago_recibido');
      }
      if (filtered.length === 0) {
        setNotifications([]);
        setNotifLoading(false);
        return;
      }
      typesToFetch = filtered;
    }

    const items = await fetchNotifications(supabaseUser.id, typesToFetch);
    setNotifications(items);
    setNotifLoading(false);
    markNotificationsRead(supabaseUser.id); // fire-and-forget
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
            <div className="relative" ref={notifRef}>
              <button
                onClick={openNotifications}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Notificaciones"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center text-[9px] font-bold text-white leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <p className="text-sm font-semibold">Notificaciones</p>
                      {unreadCount > 0 && (
                        <span className="text-xs text-muted-foreground">{unreadCount} sin leer</span>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifLoading ? (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">Cargando...</div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Sin notificaciones</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors ${
                              !n.is_read ? "bg-primary/5" : "hover:bg-muted"
                            }`}
                          >
                            <div className="mt-0.5 flex-shrink-0 p-1.5 rounded-md bg-primary/10">
                              {notificationIcon(n.notification_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{n.title}</p>
                              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{n.body}</p>
                              {n.created_at && (
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                  {new Date(n.created_at).toLocaleDateString("es-MX", {
                                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                            {!n.is_read && (
                              <div className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
