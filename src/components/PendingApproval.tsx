import { Clock, Store } from "lucide-react";

export default function PendingApproval({ businessName }: { businessName?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex p-4 rounded-full bg-warning/10 mb-4">
          <Clock className="h-12 w-12 text-warning" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Solicitud en revision</h1>
        <p className="text-muted-foreground mb-4">
          {businessName ? (
            <>Tu negocio <strong>{businessName}</strong> esta pendiente de aprobacion por el equipo de Kaelo.</>
          ) : (
            <>Tu solicitud de negocio esta pendiente de aprobacion por el equipo de Kaelo.</>
          )}
        </p>
        <div className="bg-card border border-border rounded-xl p-4 shadow-card space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Store className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium">Estado: Pendiente</p>
              <p className="text-xs text-muted-foreground">Revisaremos tu solicitud en 24-48 horas</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground border-t border-border pt-3">
            Cuando tu negocio sea aprobado, podras acceder a tu dashboard, agregar productos y gestionar pedidos.
          </div>
        </div>
      </div>
    </div>
  );
}
