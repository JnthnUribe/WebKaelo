import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { myRoutes as mockMyRoutes, formatMXN } from "@/lib/mockData";
import { fetchMyRoutes } from "@/lib/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  borrador: "bg-muted text-muted-foreground",
  en_revision: "bg-warning/15 text-warning",
  publicado: "bg-success/15 text-success",
  rechazado: "bg-error/15 text-error",
};
const statusLabels: Record<string, string> = { borrador: "Borrador", en_revision: "En revisión", publicado: "Publicado", rechazado: "Rechazado" };

export default function MyRoutes() {
  const { user } = useAuth();
  const [routeList, setRouteList] = useState(mockMyRoutes);

  useEffect(() => {
    fetchMyRoutes(user?.id).then(setRouteList);
  }, [user?.id]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">✏️ Mis Rutas Creadas</h1>
        <button onClick={() => toast.info("🚧 Editor de rutas próximamente")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors">
          <Plus className="h-4 w-4" /> Crear Nueva Ruta
        </button>
      </div>
      <div className="bg-card border border-border rounded-lg shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Precio</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ventas</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Rating</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {routeList.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-pill text-xs font-bold ${statusStyles[r.status]}`}>{statusLabels[r.status]}</span>
                </td>
                <td className="px-4 py-3 text-right">{r.price > 0 ? formatMXN(r.price) : "Gratis"}</td>
                <td className="px-4 py-3 text-right">{r.sales}</td>
                <td className="px-4 py-3 text-right">{r.rating > 0 ? `${r.rating} ⭐` : "—"}</td>
                <td className="px-4 py-3 text-right font-medium text-success">{r.revenue > 0 ? formatMXN(r.revenue) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
