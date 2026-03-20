import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Shield, FileCheck, Building2, Users,
  ShoppingBag, Package, ClipboardList, Star, Store,
  PenSquare, Wallet, TrendingUp,
  ChevronLeft, ChevronRight, Bike, Menu, X, ChevronsUpDown
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth, type UserRole } from "@/contexts/AuthContext";

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sectionsByRole: Record<UserRole, NavSection[]> = {
  admin: [
    {
      label: "OVERVIEW",
      items: [
        { title: "Dashboard", icon: BarChart3, path: "/admin" },
      ],
    },
    {
      label: "GESTIÓN",
      items: [
        { title: "Usuarios", icon: Users, path: "/admin/usuarios" },
        { title: "Mod. Rutas", icon: FileCheck, path: "/admin/rutas" },
        { title: "Mod. Comercios", icon: Building2, path: "/admin/comercios" },
      ],
    },
    {
      label: "ANALYTICS",
      items: [
        { title: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
      ],
    },
  ],
  comercio: [
    {
      label: "OVERVIEW",
      items: [
        { title: "Dashboard", icon: BarChart3, path: "/comercio" },
      ],
    },
    {
      label: "OPERACIONES",
      items: [
        { title: "Pedidos", icon: ClipboardList, path: "/comercio/pedidos" },
        { title: "Productos", icon: Package, path: "/comercio/productos" },
        { title: "Reviews", icon: Star, path: "/comercio/reviews" },
      ],
    },
    {
      label: "MI NEGOCIO",
      items: [
        { title: "Perfil", icon: Store, path: "/comercio/perfil" },
        { title: "Analytics", icon: TrendingUp, path: "/comercio/analytics" },
      ],
    },
  ],
  creador: [
    {
      label: "OVERVIEW",
      items: [
        { title: "Mis Rutas", icon: PenSquare, path: "/creador/rutas" },
      ],
    },
    {
      label: "FINANZAS",
      items: [
        { title: "Wallet", icon: Wallet, path: "/creador/wallet" },
      ],
    },
    {
      label: "ANALYTICS",
      items: [
        { title: "Analytics", icon: TrendingUp, path: "/creador/analytics" },
      ],
    },
  ],
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  comercio: "Comercio",
  creador: "Creador",
};

const roleColors: Record<UserRole, string> = {
  admin: "from-violet-600 to-indigo-700",
  comercio: "from-amber-500 to-orange-600",
  creador: "from-emerald-500 to-teal-600",
};

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, currentRole, setCurrentRole, isDemoMode } = useAuth();

  const sections = sectionsByRole[currentRole];
  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <Bike className="h-7 w-7 text-primary shrink-0" />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-primary tracking-tight"
          >
            Kaelo
          </motion.span>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2 relative">
          {/* Demo role switcher — only visible via ?demo=true */}
          {isDemoMode ? (
            <>
              <button
                onClick={() => setShowRoleSwitch(!showRoleSwitch)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${roleColors[currentRole]}`}>
                  <ShoppingBag className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{roleLabels[currentRole]}</p>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </button>
              <AnimatePresence>
                {showRoleSwitch && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute left-3 right-3 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                  >
                    <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cambiar rol (demo)</p>
                    {(["admin", "comercio", "creador"] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => { setCurrentRole(r); setShowRoleSwitch(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${currentRole === r ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                      >
                        <div className={`p-1 rounded-md bg-gradient-to-br ${roleColors[r]}`}>
                          <div className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{roleLabels[r]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* Production: just show user info, no role switcher */
            <div className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/50">
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${roleColors[currentRole]}`}>
                <ShoppingBag className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-semibold truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{roleLabels[currentRole]}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground hover:bg-muted"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-3 border-t border-sidebar-border hover:bg-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}
    </div>
  );

  // Mobile: hamburger + drawer
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-card shadow-card border border-border"
        >
          <Menu className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-foreground/40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 z-50 h-full w-[260px] bg-sidebar border-r border-sidebar-border"
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-3 right-3 p-1 rounded hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-200 ${collapsed ? "w-[60px]" : "w-[260px]"
        }`}
    >
      <SidebarContent />
    </aside>
  );
}
