import { pendingRoutes } from "@/lib/mockData";
import DifficultyBadge from "@/components/DifficultyBadge";
import { toast } from "sonner";
import { useState } from "react";

export default function RouteModeration() {
  const [routes, setRoutes] = useState(pendingRoutes);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setRoutes(prev => prev.filter(r => r.id !== id));
    toast.success(action === "approve" ? "✅ Ruta aprobada" : "❌ Ruta rechazada");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold">📝 Moderación de Rutas</h1>
      {routes.length === 0 ? (
        <div className="text-center py-16"><p className="text-4xl mb-3">✅</p><p className="text-muted-foreground">No hay rutas pendientes de revisión</p></div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Creador</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Distancia</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Dificultad</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.creator}</td>
                  <td className="px-4 py-3 text-right">{r.distance} km</td>
                  <td className="px-4 py-3"><DifficultyBadge difficulty={r.difficulty} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleAction(r.id, "approve")} className="px-3 py-1 rounded-lg text-xs font-medium bg-success/15 text-success hover:bg-success/25 transition-colors">Aprobar</button>
                    <button onClick={() => handleAction(r.id, "reject")} className="px-3 py-1 rounded-lg text-xs font-medium bg-error/15 text-error hover:bg-error/25 transition-colors">Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
