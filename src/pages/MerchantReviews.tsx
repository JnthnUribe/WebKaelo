import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchReviews } from "@/lib/supabaseService";
import PendingApproval from "@/components/PendingApproval";

const defaultReviews = [
  { id: "mr1", userName: "Ana Garcia", avatar: "https://i.pravatar.cc/40?img=5", rating: 5, comment: "Excelente cafe y atencion al ciclista. Los kits energeticos son lo mejor.", date: "2026-02-16" },
  { id: "mr2", userName: "Miguel Torres", avatar: "https://i.pravatar.cc/40?img=8", rating: 4, comment: "Buen lugar para descansar durante la ruta. Precios accesibles.", date: "2026-02-12" },
  { id: "mr3", userName: "Laura Pech", avatar: "https://i.pravatar.cc/40?img=20", rating: 5, comment: "Mi parada favorita! La horchata con coco es increible.", date: "2026-02-08" },
  { id: "mr4", userName: "Pedro Canul", avatar: "https://i.pravatar.cc/40?img=11", rating: 4, comment: "Recomendado para ciclistas. Tienen estacionamiento para bicis.", date: "2026-02-03" },
  { id: "mr5", userName: "Diego Balam", avatar: "https://i.pravatar.cc/40?img=33", rating: 3, comment: "Buena comida pero el servicio fue un poco lento.", date: "2026-01-28" },
];

export default function MerchantReviews() {
  const { userBusiness, isDemoMode } = useAuth();
  const [reviews, setReviews] = useState(isDemoMode ? defaultReviews : []);

  useEffect(() => {
    if (isDemoMode) { setReviews(defaultReviews); return; }
    if (!userBusiness?.id) return;
    fetchReviews(userBusiness.id).then(setReviews);
  }, [userBusiness?.id, isDemoMode]);

  if (userBusiness?.status === 'pendiente' && !isDemoMode) {
    return <PendingApproval businessName={userBusiness?.name} />;
  }

  const total = reviews.length;
  const avg = total > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;

  // Calculate distribution
  const counts = [5, 4, 3, 2, 1].map(stars => reviews.filter(r => r.rating === stars).length);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold">Reviews del Comercio</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-card text-center">
          <p className="text-4xl font-bold">{avg}</p>
          <div className="flex justify-center gap-0.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.round(avg) ? "fill-rating text-rating" : "text-muted"}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{total} reviews</p>
        </div>
        <div className="md:col-span-2 bg-card border border-border rounded-lg p-5 shadow-card space-y-2">
          {[5, 4, 3, 2, 1].map((stars, i) => (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right">{stars}</span>
              <Star className="h-3 w-3 fill-rating text-rating" />
              <div className="flex-1 h-2 bg-muted rounded-full">
                <div className="h-2 bg-rating rounded-full transition-all" style={{ width: `${total > 0 ? (counts[i] / total) * 100 : 0}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{counts[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-card border border-border rounded-lg p-4 shadow-card space-y-2">
            <div className="flex items-center gap-2">
              <img src={r.avatar} alt={r.userName} className="h-8 w-8 rounded-full" />
              <div>
                <p className="text-sm font-medium">{r.userName}</p>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-rating text-rating" : "text-muted"}`} />
                ))}</div>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
