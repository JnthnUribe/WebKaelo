import { pendingBusinesses as mockPendingBusinesses } from "@/lib/mockData";
import { fetchPendingBusinesses, approveBusiness, rejectBusiness } from "@/lib/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function BusinessModeration() {
  const { isDemoMode } = useAuth();
  const [items, setItems] = useState<any[]>(isDemoMode ? mockPendingBusinesses : []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) { setItems(mockPendingBusinesses); return; }
    fetchPendingBusinesses().then(setItems);
  }, [isDemoMode]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setLoadingId(id);
    const result = action === "approve" ? await approveBusiness(id) : await rejectBusiness(id);
    setLoadingId(null);

    if (result.error) {
      toast.error(`Error: ${result.error}`);
    } else {
      setItems(prev => prev.filter(b => b.id !== id));
      toast.success(action === "approve" ? "Comercio aprobado y activo" : "Comercio rechazado");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold">Moderacion de Comercios</h1>
      {items.length === 0 ? (
        <div className="text-center py-16"><p className="text-4xl mb-3">✅</p><p className="text-muted-foreground">No hay comercios pendientes</p></div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Dueno</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ubicacion</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 capitalize">{b.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.owner}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {loadingId === b.id ? (
                      <Loader2 className="h-4 w-4 animate-spin inline" />
                    ) : (
                      <>
                        <button onClick={() => handleAction(b.id, "approve")} className="px-3 py-1 rounded-lg text-xs font-medium bg-success/15 text-success hover:bg-success/25 transition-colors">Aprobar</button>
                        <button onClick={() => handleAction(b.id, "reject")} className="px-3 py-1 rounded-lg text-xs font-medium bg-error/15 text-error hover:bg-error/25 transition-colors">Rechazar</button>
                      </>
                    )}
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
