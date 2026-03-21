import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import RoleSelector from "@/components/RoleSelector";

// Pages
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/AdminPanel";
import AdminAnalytics from "./pages/AdminAnalytics";
import UserManagement from "./pages/UserManagement";
import RouteModeration from "./pages/RouteModeration";
import BusinessModeration from "./pages/BusinessModeration";
import MerchantDashboard from "./pages/MerchantDashboard";
import ProductManagement from "./pages/ProductManagement";
import OrderManagement from "./pages/OrderManagement";
import MerchantReviews from "./pages/MerchantReviews";
import BusinessProfile from "./pages/BusinessProfile";
import MerchantAnalytics from "./pages/MerchantAnalytics";
import MyRoutes from "./pages/MyRoutes";
import WalletPage from "./pages/WalletPage";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isLoggedIn, currentRole, loading, needsRoleSelection } = useAuth();

  // Show nothing while checking session — prevents flash of wrong page
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  if (needsRoleSelection) {
    return <RoleSelector />;
  }

  // Redirect to role-specific home
  const roleHome: Record<string, string> = {
    admin: "/admin",
    comercio: "/comercio",
    creador: "/creador/rutas",
  };

  // Role-guarded routes: users can only access their own role's pages
  const home = roleHome[currentRole];

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Admin routes — only for admin */}
        {currentRole === "admin" && (
          <>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/usuarios" element={<UserManagement />} />
            <Route path="/admin/rutas" element={<RouteModeration />} />
            <Route path="/admin/comercios" element={<BusinessModeration />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </>
        )}

        {/* Merchant routes — only for comercio */}
        {currentRole === "comercio" && (
          <>
            <Route path="/comercio" element={<MerchantDashboard />} />
            <Route path="/comercio/productos" element={<ProductManagement />} />
            <Route path="/comercio/pedidos" element={<OrderManagement />} />
            <Route path="/comercio/reviews" element={<MerchantReviews />} />
            <Route path="/comercio/perfil" element={<BusinessProfile />} />
            <Route path="/comercio/analytics" element={<MerchantAnalytics />} />
          </>
        )}

        {/* Creator routes — only for creador */}
        {currentRole === "creador" && (
          <>
            <Route path="/creador/rutas" element={<MyRoutes />} />
            <Route path="/creador/wallet" element={<WalletPage />} />
            <Route path="/creador/analytics" element={<CreatorAnalytics />} />
          </>
        )}

        {/* Shared */}
        <Route path="/configuracion" element={<SettingsPage />} />
      </Route>

      {/* Any unmatched route → redirect to role home */}
      <Route path="/" element={<Navigate to={home} replace />} />
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
