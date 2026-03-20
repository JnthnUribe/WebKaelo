import { useState, useEffect } from "react";
import { Plus, X, Loader2, Trash2 } from "lucide-react";
import { businesses, formatMXN } from "@/lib/mockData";
import { fetchProducts, addProduct, toggleProductAvailability, deleteProduct } from "@/lib/supabaseService";
import { useAuth } from "@/contexts/AuthContext";
import PendingApproval from "@/components/PendingApproval";
import { toast } from "sonner";

const categories = [
  { value: "Bebidas", emoji: "🥤" },
  { value: "Alimentos", emoji: "🍽️" },
  { value: "Snacks", emoji: "🍪" },
  { value: "Hidratación", emoji: "💧" },
  { value: "Energéticos", emoji: "⚡" },
  { value: "Otro", emoji: "📦" },
];

export default function ProductManagement() {
  const { userBusiness, isDemoMode } = useAuth();
  const businessId = userBusiness?.id;

  const [productList, setProductList] = useState(isDemoMode ? businesses[0].products : []);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Bebidas");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [isCyclistSpecial, setIsCyclistSpecial] = useState(false);
  const [emoji, setEmoji] = useState("🥤");

  useEffect(() => {
    if (userBusiness?.status === 'pendiente' && !isDemoMode) return;
    fetchProducts(businessId, isDemoMode).then(setProductList);
  }, [businessId, isDemoMode]);

  if (userBusiness?.status === 'pendiente' && !isDemoMode) {
    return <PendingApproval businessName={userBusiness?.name} />;
  }

  const resetForm = () => {
    setName(""); setPrice(""); setCategory("Bebidas"); setStock("");
    setDescription(""); setIsCyclistSpecial(false); setEmoji("🥤");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error("Nombre y precio son obligatorios");
      return;
    }

    setSaving(true);
    const result = await addProduct({
      businessId: businessId || "demo-business-001",
      name,
      price: parseFloat(price),
      category,
      description: description || undefined,
      stockQuantity: stock ? parseInt(stock) : 0,
      isCyclistSpecial,
      imageEmoji: emoji,
    });
    setSaving(false);

    if (result.error) {
      // If Supabase fails (e.g. demo mode), add locally for the demo
      const localProduct = {
        id: `local-${Date.now()}`,
        name,
        category,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        available: true,
        isSpecialCyclist: isCyclistSpecial,
        image: emoji,
      };
      setProductList(prev => [localProduct, ...prev]);
      toast.success("✅ Producto agregado (modo demo)");
    } else if (result.product) {
      setProductList(prev => [result.product!, ...prev]);
      toast.success("✅ Producto guardado en Supabase");
    }

    resetForm();
    setShowForm(false);
  };

  const toggleAvailable = async (id: string) => {
    const product = productList.find(p => p.id === id);
    if (!product) return;

    setProductList(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));

    const result = await toggleProductAvailability(id, !product.available);
    if (result.error) {
      toast.error("Error al actualizar disponibilidad");
    } else {
      toast.success("✅ Disponibilidad actualizada");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;

    setProductList(prev => prev.filter(p => p.id !== id));
    const result = await deleteProduct(id);
    if (result.error) {
      // Reload list on error
      fetchProducts(businessId).then(setProductList);
      toast.error(`Error al eliminar: ${result.error}`);
    } else {
      toast.success("Producto eliminado");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📦 Gestión de Productos</h1>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors">
          <Plus className="h-4 w-4" /> Agregar Producto
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
            <button onClick={() => { setShowForm(false); resetForm(); }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors">
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-bold mb-4">➕ Nuevo Producto</h2>

            <form onSubmit={handleAddProduct} className="space-y-3">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nombre *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Café de Olla" required
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Precio (MXN) *</label>
                  <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                    placeholder="45.00" required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock</label>
                  <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Categoría</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <button key={c.value} type="button" onClick={() => { setCategory(c.value); setEmoji(c.emoji); }}
                      className={`px-2 py-2 rounded-lg text-center transition-all text-xs font-medium ${category === c.value
                          ? "bg-primary/15 border-primary/50 border text-primary"
                          : "bg-muted/50 border border-transparent hover:bg-muted"
                        }`}>
                      {c.emoji} {c.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Descripción</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción opcional del producto..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none" />
              </div>

              {/* Cyclist Special */}
              <label className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <button type="button" onClick={() => setIsCyclistSpecial(!isCyclistSpecial)}
                  className={`w-10 h-5 rounded-full transition-colors ${isCyclistSpecial ? "bg-accent" : "bg-muted"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isCyclistSpecial ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm">🚴 Especial para ciclistas</span>
              </label>

              {/* Submit */}
              <button type="submit" disabled={saving}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-60">
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                ) : (
                  <><Plus className="h-4 w-4" /> Agregar Producto</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productList.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 shadow-card card-hover">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{p.image}</span>
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <span className="px-2 py-0.5 rounded-pill text-[10px] font-medium bg-muted text-muted-foreground">{p.category}</span>
              </div>
            </div>
            {p.isSpecialCyclist && <span className="inline-flex px-2 py-0.5 rounded-pill text-[10px] font-bold bg-accent/15 text-accent mb-2">Especial Ciclista 🚴</span>}
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="font-bold text-accent">{formatMXN(p.price)}</span>
              <span className="text-muted-foreground">Stock: {p.stock}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Disponible</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(p.id, p.name)}
                  className="p-1.5 rounded-lg text-error/60 hover:text-error hover:bg-error/10 transition-colors" title="Eliminar producto">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => toggleAvailable(p.id)} className={`w-10 h-5 rounded-full transition-colors ${p.available ? "bg-primary" : "bg-muted"}`}>
                  <div className={`w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform ${p.available ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productList.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-2">📦</p>
          <p className="text-sm">No hay productos aún. ¡Agrega tu primer producto!</p>
        </div>
      )}
    </div>
  );
}
