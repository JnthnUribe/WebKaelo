# Plan: Notifications Dropdown Funcional

## Contexto
El botón Bell en el header era decorativo (dot rojo estático, sin handler). La tabla `notifications` ya existe en Supabase con los campos necesarios. El plan conecta el botón a esa tabla con un dropdown que sigue el mismo patrón del menú de avatar ya existente.

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/lib/supabaseService.ts` | + interface `NotificationItem` + `fetchNotifications` + `markNotificationsRead` |
| `src/components/Layout.tsx` | Reemplazar bloque Bell + agregar estado, handlers, dropdown JSX |

---

## 1. `src/lib/supabaseService.ts` — añadir al final

```ts
// ─── NOTIFICATIONS ────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  notification_type: string; // "order" | "route" | "review" | "business" | "system"
  is_read: boolean;
  created_at: string | null;
  related_business_id: string | null;
  related_order_id: string | null;
  related_route_id: string | null;
}

export async function fetchNotifications(userId: string): Promise<NotificationItem[]> {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, body, notification_type, is_read, created_at, related_business_id, related_order_id, related_route_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error || !data) return [];
    return data.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      notification_type: n.notification_type,
      is_read: n.is_read ?? false,
      created_at: n.created_at,
      related_business_id: n.related_business_id,
      related_order_id: n.related_order_id,
      related_route_id: n.related_route_id,
    }));
  } catch { return []; }
}

export async function markNotificationsRead(userId: string): Promise<void> {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
  } catch { /* silent */ }
}
```

---

## 2. `src/components/Layout.tsx` — cambios por sección

### Imports
- Añadir a lucide-react: `ShoppingBag, Map, Star, Store`
- Nueva línea:
  ```ts
  import { fetchNotifications, markNotificationsRead, type NotificationItem } from "@/lib/supabaseService";
  ```

### `useAuth()` destructure (línea 37)
Agregar `isDemoMode` y `supabaseUser`:
```ts
const { user, currentRole, logout, isDemoMode, supabaseUser } = useAuth();
```

### Antes del componente — constante de mocks por rol
```ts
const DEMO_NOTIFICATIONS: Record<string, NotificationItem[]> = {
  admin: [
    { id: "d1", title: "Negocios pendientes", body: "2 negocios pendientes de aprobación", notification_type: "business", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
    { id: "d2", title: "Ruta para moderar", body: "1 ruta en revisión esperando moderación", notification_type: "route", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
  ],
  comercio: [
    { id: "d3", title: "Nuevo pedido", body: "Nuevo pedido #0042 recibido", notification_type: "order", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
    { id: "d4", title: "Nueva reseña", body: "Nueva reseña ⭐⭐⭐⭐⭐ de un cliente", notification_type: "review", is_read: false, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
  ],
  creador: [
    { id: "d5", title: "Ruta aprobada", body: "Tu ruta 'Ruta Cenotes' fue aprobada", notification_type: "route", is_read: true, created_at: new Date().toISOString(), related_business_id: null, related_order_id: null, related_route_id: null },
  ],
};

function notificationIcon(type: string) {
  switch (type) {
    case "order":    return <ShoppingBag className="h-3.5 w-3.5 text-primary" />;
    case "route":    return <Map className="h-3.5 w-3.5 text-primary" />;
    case "review":   return <Star className="h-3.5 w-3.5 text-primary" />;
    case "business": return <Store className="h-3.5 w-3.5 text-primary" />;
    default:         return <Bell className="h-3.5 w-3.5 text-primary" />;
  }
}
```

### Dentro del componente — estado y ref (después del estado existente)
```ts
const [notifOpen, setNotifOpen] = useState(false);
const [notifications, setNotifications] = useState<NotificationItem[]>([]);
const [notifLoading, setNotifLoading] = useState(false);
const notifRef = useRef<HTMLDivElement>(null);
```

### useEffect de cierre por click fuera (después del useEffect del avatar)
```ts
useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
      setNotifOpen(false);
    }
  };
  if (notifOpen) document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, [notifOpen]);
```

### Handler + unreadCount (después de `handleLogout`)
```ts
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
  const items = await fetchNotifications(supabaseUser.id);
  setNotifications(items);
  setNotifLoading(false);
  markNotificationsRead(supabaseUser.id); // fire-and-forget
};

const unreadCount = notifications.filter((n) => !n.is_read).length;
```

### Reemplazar bloque Bell estático (líneas 107–111) con:
```tsx
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
```

---

## Nota sobre RLS en Supabase
Si `notifications` tiene RLS habilitado, verificar que existan políticas:
- `SELECT WHERE user_id = auth.uid()`
- `UPDATE WHERE user_id = auth.uid()`

Sin ellas, las queries retornan vacío silenciosamente.

---

## Verificación
1. **Demo** (`?demo=true`): abrir Bell con rol admin → ver 2 mocks; cambiar a comercio → ver otros 2
2. **Badge**: aparece con número al primer abrir, desaparece en re-apertura (marked as read)
3. **Click fuera**: cierra el dropdown
4. **Usuario real**: insertar fila en tabla `notifications` con `user_id` del usuario de prueba y verificar que aparece