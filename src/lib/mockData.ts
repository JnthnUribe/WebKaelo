export type Difficulty = 'facil' | 'moderada' | 'dificil' | 'experto';
export type Terrain = 'asfalto' | 'terraceria' | 'mixto';
export type BusinessType = 'restaurante' | 'cafeteria' | 'tienda' | 'taller' | 'hospedaje' | 'mercado';
export type OrderStatus = 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado';
export type RouteStatus = 'borrador' | 'en_revision' | 'publicado' | 'rechazado';
export type CouponStatus = 'disponible' | 'usado' | 'expirado';

export interface RouteData {
  id: string;
  name: string;
  image: string;
  difficulty: Difficulty;
  rating: number;
  ratingCount: number;
  distance: number;
  duration: string;
  elevation: number;
  terrain: Terrain;
  municipality: string;
  price: number;
  description: string;
  creator: { name: string; avatar: string };
  publishDate: string;
  purchaseCount: number;
  viewCount: number;
  waypoints: { type: string; name: string; icon: string }[];
  reviews: ReviewData[];
}

export interface BusinessData {
  id: string;
  name: string;
  type: BusinessType;
  image: string;
  logo: string;
  rating: number;
  ratingCount: number;
  address: string;
  distance: string;
  isOpen: boolean;
  schedule: string;
  acceptsPreOrders: boolean;
  phone: string;
  whatsapp: string;
  products: ProductData[];
}

export interface ReviewData {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AchievementData {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  points: number;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface GoalData {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
  deadline: string;
  reward: number;
}

export interface TransactionData {
  id: string;
  type: 'ingreso' | 'egreso';
  description: string;
  amount: number;
  date: string;
}

export interface CouponData {
  id: string;
  businessName: string;
  businessLogo: string;
  discount: string;
  code: string;
  reason: string;
  expiry: string;
  status: CouponStatus;
}

export interface OrderData {
  id: string;
  customerName: string;
  customerAvatar: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  time: string;
  pickupTime: string;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  available: boolean;
  isSpecialCyclist: boolean;
  image: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'ciclista' | 'creador' | 'comercio';
  registeredDate: string;
  routesCompleted: number;
  status: 'activo' | 'suspendido';
}

export interface MyRouteData {
  id: string;
  name: string;
  status: RouteStatus;
  price: number;
  sales: number;
  rating: number;
  revenue: number;
}

// ─── ROUTES ─────────────────────────────────────────────
export const routes: RouteData[] = [
  {
    id: "1", name: "Ruta de los Cenotes", image: "https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=600&h=400&fit=crop",
    difficulty: "facil", rating: 4.8, ratingCount: 124, distance: 32.5, duration: "1h 45min", elevation: 85,
    terrain: "asfalto", municipality: "Valladolid", price: 85, description: "Recorre los cenotes más espectaculares del oriente de Yucatán en una ruta accesible y llena de naturaleza.",
    creator: { name: "Carlos Méndez", avatar: "https://i.pravatar.cc/40?img=12" }, publishDate: "2025-12-15", purchaseCount: 89, viewCount: 1250,
    waypoints: [
      { type: "inicio", name: "Centro de Valladolid", icon: "🏁" },
      { type: "cenote", name: "Cenote Zací", icon: "💧" },
      { type: "cenote", name: "Cenote Suytun", icon: "💧" },
      { type: "restaurante", name: "Lonchería Doña María", icon: "🍽️" },
      { type: "cenote", name: "Cenote Ik Kil", icon: "💧" },
      { type: "mirador", name: "Mirador El Cedral", icon: "👁️" },
    ],
    reviews: [
      { id: "r1", userName: "Ana García", avatar: "https://i.pravatar.cc/40?img=5", rating: 5, comment: "¡Increíble ruta! Los cenotes son espectaculares y el camino está muy bien señalizado.", date: "2026-02-10" },
      { id: "r2", userName: "Miguel Torres", avatar: "https://i.pravatar.cc/40?img=8", rating: 4, comment: "Muy buena ruta para principiantes. Recomiendo llevar suficiente agua.", date: "2026-02-05" },
    ],
  },
  {
    id: "2", name: "Camino Real Maya", image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&h=400&fit=crop",
    difficulty: "moderada", rating: 4.6, ratingCount: 87, distance: 67, duration: "3h 30min", elevation: 210,
    terrain: "mixto", municipality: "Izamal", price: 150, description: "Sigue los pasos de los antiguos mayas por caminos milenarios entre pirámides y pueblos coloniales.",
    creator: { name: "María López", avatar: "https://i.pravatar.cc/40?img=9" }, publishDate: "2025-11-20", purchaseCount: 56, viewCount: 980,
    waypoints: [
      { type: "inicio", name: "Izamal Centro", icon: "🏁" },
      { type: "arqueologia", name: "Kinich Kakmó", icon: "🏛️" },
      { type: "pueblo", name: "Hoctún", icon: "🏘️" },
      { type: "descanso", name: "Parque Municipal", icon: "🌳" },
    ],
    reviews: [
      { id: "r3", userName: "Roberto Chí", avatar: "https://i.pravatar.cc/40?img=15", rating: 5, comment: "La mejor ruta cultural que he hecho en Yucatán.", date: "2026-01-28" },
    ],
  },
  {
    id: "3", name: "Circuito Mérida-Progreso", image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&h=400&fit=crop",
    difficulty: "facil", rating: 4.9, ratingCount: 203, distance: 45, duration: "2h 15min", elevation: 15,
    terrain: "asfalto", municipality: "Mérida", price: 0, description: "El clásico recorrido de Mérida al puerto de Progreso. Ideal para ciclistas de todos los niveles.",
    creator: { name: "Kaelo Team", avatar: "https://i.pravatar.cc/40?img=3" }, publishDate: "2025-10-01", purchaseCount: 0, viewCount: 3450,
    waypoints: [], reviews: [],
  },
  {
    id: "4", name: "Cenotes del Oriente", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    difficulty: "dificil", rating: 4.5, ratingCount: 45, distance: 78, duration: "4h 20min", elevation: 320,
    terrain: "terraceria", municipality: "Tinum", price: 120, description: "Aventura extrema por los cenotes más remotos y poco explorados del oriente yucateco.",
    creator: { name: "Pedro Canul", avatar: "https://i.pravatar.cc/40?img=11" }, publishDate: "2026-01-10", purchaseCount: 32, viewCount: 650,
    waypoints: [], reviews: [],
  },
  {
    id: "5", name: "Ruta Arqueológica Uxmal", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    difficulty: "moderada", rating: 4.7, ratingCount: 68, distance: 52, duration: "2h 50min", elevation: 180,
    terrain: "mixto", municipality: "Santa Elena", price: 100, description: "Visita la majestuosa Uxmal y las ruinas circundantes en bicicleta.",
    creator: { name: "Laura Pech", avatar: "https://i.pravatar.cc/40?img=20" }, publishDate: "2025-12-05", purchaseCount: 41, viewCount: 890,
    waypoints: [], reviews: [],
  },
  {
    id: "6", name: "Costa Esmeralda", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    difficulty: "dificil", rating: 4.4, ratingCount: 34, distance: 95, duration: "5h 00min", elevation: 45,
    terrain: "asfalto", municipality: "Progreso", price: 85, description: "Recorre la costa norte de Yucatán con vistas al mar Caribe y pueblos pesqueros.",
    creator: { name: "Carlos Méndez", avatar: "https://i.pravatar.cc/40?img=12" }, publishDate: "2026-01-25", purchaseCount: 28, viewCount: 520,
    waypoints: [], reviews: [],
  },
  {
    id: "7", name: "Pueblos Mágicos", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    difficulty: "facil", rating: 4.8, ratingCount: 156, distance: 38, duration: "2h 00min", elevation: 60,
    terrain: "asfalto", municipality: "Izamal", price: 0, description: "Conoce los coloridos pueblos mágicos de Yucatán a tu propio ritmo.",
    creator: { name: "Kaelo Team", avatar: "https://i.pravatar.cc/40?img=3" }, publishDate: "2025-09-15", purchaseCount: 0, viewCount: 4100,
    waypoints: [], reviews: [],
  },
  {
    id: "8", name: "Selva y Haciendas", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    difficulty: "experto", rating: 4.3, ratingCount: 22, distance: 112, duration: "6h 30min", elevation: 450,
    terrain: "terraceria", municipality: "Motul", price: 150, description: "La ruta más desafiante: cruza la selva yucateca pasando por haciendas henequeneras abandonadas.",
    creator: { name: "Pedro Canul", avatar: "https://i.pravatar.cc/40?img=11" }, publishDate: "2026-02-01", purchaseCount: 15, viewCount: 340,
    waypoints: [], reviews: [],
  },
];

// ─── BUSINESSES ─────────────────────────────────────────
export const businesses: BusinessData[] = [
  {
    id: "b1", name: "Café Cenote", type: "cafeteria", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
    logo: "☕", rating: 4.8, ratingCount: 67, address: "Calle 60 #482, Centro, Mérida", distance: "1.2 km",
    isOpen: true, schedule: "7:00 AM - 9:00 PM", acceptsPreOrders: true, phone: "+52 999 123 4567", whatsapp: "+52 999 123 4567",
    products: [
      { id: "p1", name: "Café de Olla", category: "Bebidas", price: 45, stock: 50, available: true, isSpecialCyclist: true, image: "☕" },
      { id: "p2", name: "Horchata con Coco", category: "Bebidas", price: 55, stock: 30, available: true, isSpecialCyclist: false, image: "🥥" },
      { id: "p3", name: "Pan de Cazón", category: "Alimentos", price: 95, stock: 20, available: true, isSpecialCyclist: false, image: "🐟" },
      { id: "p4", name: "Kit Energético Ciclista", category: "Snacks", price: 120, stock: 15, available: true, isSpecialCyclist: true, image: "⚡" },
    ],
  },
  {
    id: "b2", name: "Bici-Taller Maya", type: "taller", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop",
    logo: "🔧", rating: 4.9, ratingCount: 45, address: "Av. Itzáes #234, Mérida", distance: "0.8 km",
    isOpen: true, schedule: "8:00 AM - 6:00 PM", acceptsPreOrders: false, phone: "+52 999 234 5678", whatsapp: "+52 999 234 5678",
    products: [
      { id: "p5", name: "Ajuste General", category: "Servicios", price: 150, stock: 99, available: true, isSpecialCyclist: true, image: "🔧" },
      { id: "p6", name: "Parche de Llanta", category: "Reparaciones", price: 50, stock: 99, available: true, isSpecialCyclist: false, image: "🛞" },
      { id: "p7", name: "Cámara 700c", category: "Refacciones", price: 180, stock: 12, available: true, isSpecialCyclist: false, image: "🔵" },
    ],
  },
  {
    id: "b3", name: "Hacienda Restaurante", type: "restaurante", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    logo: "🏛️", rating: 4.6, ratingCount: 89, address: "Carretera Mérida-Uxmal Km 12", distance: "12.5 km",
    isOpen: false, schedule: "12:00 PM - 10:00 PM", acceptsPreOrders: true, phone: "+52 999 345 6789", whatsapp: "+52 999 345 6789",
    products: [
      { id: "p8", name: "Cochinita Pibil", category: "Alimentos", price: 165, stock: 25, available: true, isSpecialCyclist: false, image: "🐷" },
      { id: "p9", name: "Sopa de Lima", category: "Alimentos", price: 95, stock: 30, available: true, isSpecialCyclist: false, image: "🍲" },
    ],
  },
  {
    id: "b4", name: "Tienda Ruta Sur", type: "tienda", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    logo: "🛒", rating: 4.5, ratingCount: 32, address: "Calle 65 #301, Mérida", distance: "2.1 km",
    isOpen: true, schedule: "9:00 AM - 8:00 PM", acceptsPreOrders: true, phone: "+52 999 456 7890", whatsapp: "+52 999 456 7890",
    products: [
      { id: "p10", name: "Jersey Kaelo", category: "Accesorios", price: 450, stock: 8, available: true, isSpecialCyclist: true, image: "👕" },
      { id: "p11", name: "Bidón 750ml", category: "Accesorios", price: 180, stock: 20, available: true, isSpecialCyclist: true, image: "🍶" },
    ],
  },
  {
    id: "b5", name: "Hostal del Ciclista", type: "hospedaje", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    logo: "🏨", rating: 4.7, ratingCount: 54, address: "Calle 70 #112, Valladolid", distance: "45.0 km",
    isOpen: true, schedule: "24 horas", acceptsPreOrders: true, phone: "+52 985 678 1234", whatsapp: "+52 985 678 1234",
    products: [
      { id: "p12", name: "Habitación Ciclista", category: "Servicios", price: 350, stock: 5, available: true, isSpecialCyclist: true, image: "🛏️" },
    ],
  },
  {
    id: "b6", name: "Mercado Local Tixkokob", type: "mercado", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    logo: "🏪", rating: 4.4, ratingCount: 28, address: "Plaza Principal, Tixkokob", distance: "18.3 km",
    isOpen: true, schedule: "6:00 AM - 3:00 PM", acceptsPreOrders: false, phone: "+52 991 789 0123", whatsapp: "+52 991 789 0123",
    products: [],
  },
];

// ─── ACHIEVEMENTS ───────────────────────────────────────
export const achievements: AchievementData[] = [
  { id: "a1", name: "Primer Pedaleo", description: "Completa tu primera ruta", icon: "🚲", progress: 1, target: 1, points: 50, unlocked: true, unlockedDate: "2025-08-15" },
  { id: "a2", name: "Explorador", description: "Completa 10 rutas diferentes", icon: "🧭", progress: 7, target: 10, points: 200, unlocked: false },
  { id: "a3", name: "Centurión", description: "Recorre 100 km en un mes", icon: "💯", progress: 85, target: 100, points: 300, unlocked: false },
  { id: "a4", name: "Madrugador", description: "Completa 5 rutas antes de las 7am", icon: "🌅", progress: 3, target: 5, points: 150, unlocked: false },
  { id: "a5", name: "Rey de la Montaña", description: "Acumula 1000m de elevación", icon: "⛰️", progress: 620, target: 1000, points: 500, unlocked: false },
  { id: "a6", name: "Foodie Ciclista", description: "Visita 10 comercios diferentes", icon: "🍔", progress: 4, target: 10, points: 200, unlocked: false },
  { id: "a7", name: "Coleccionista", description: "Compra 5 rutas premium", icon: "💎", progress: 2, target: 5, points: 250, unlocked: false },
  { id: "a8", name: "Leyenda Maya", description: "Completa todas las rutas nivel experto", icon: "🏆", progress: 0, target: 3, points: 1000, unlocked: false },
];

// ─── GOALS ──────────────────────────────────────────────
export const goals: GoalData[] = [
  { id: "g1", title: "500 km en febrero", progress: 245, target: 500, unit: "km", deadline: "2026-02-28", reward: 500 },
  { id: "g2", title: "15 rutas este mes", progress: 8, target: 15, unit: "rutas", deadline: "2026-02-28", reward: 300 },
];

// ─── TRANSACTIONS ───────────────────────────────────────
export const transactions: TransactionData[] = [
  { id: "t1", type: "ingreso", description: "Venta: Ruta de los Cenotes", amount: 72.25, date: "2026-02-16" },
  { id: "t2", type: "ingreso", description: "Venta: Camino Real Maya", amount: 127.5, date: "2026-02-13" },
  { id: "t3", type: "egreso", description: "Compra: Costa Esmeralda", amount: 85, date: "2026-02-11" },
  { id: "t4", type: "ingreso", description: "Venta: Ruta de los Cenotes", amount: 72.25, date: "2026-02-08" },
  { id: "t5", type: "ingreso", description: "Venta: Cenotes del Oriente", amount: 102, date: "2026-02-05" },
];

// ─── COUPONS ────────────────────────────────────────────
export const coupons: CouponData[] = [
  { id: "c1", businessName: "Café Cenote", businessLogo: "☕", discount: "20% OFF", code: "RUTA20", reason: "Ruta completada", expiry: "2026-03-15", status: "disponible" },
  { id: "c2", businessName: "Bici-Taller Maya", businessLogo: "🔧", discount: "$50 MXN", code: "BICI50", reason: "Primer pedido", expiry: "2026-03-01", status: "disponible" },
  { id: "c3", businessName: "Tienda Ruta Sur", businessLogo: "🛒", discount: "15% OFF", code: "CICLISTA15", reason: "Logro desbloqueado", expiry: "2026-04-01", status: "disponible" },
  { id: "c4", businessName: "Hacienda Restaurante", businessLogo: "🏛️", discount: "10% OFF", code: "HAC10", reason: "Ruta completada", expiry: "2026-01-30", status: "usado" },
  { id: "c5", businessName: "Hostal del Ciclista", businessLogo: "🏨", discount: "$100 MXN", code: "HOSTAL100", reason: "Primer pedido", expiry: "2025-12-31", status: "expirado" },
];

// ─── ORDERS ─────────────────────────────────────────────
export const orders: OrderData[] = [
  { id: "ORD-2026-001", customerName: "Ana García", customerAvatar: "https://i.pravatar.cc/40?img=5", items: [{ name: "Café de Olla", qty: 2, price: 45 }, { name: "Kit Energético", qty: 1, price: 120 }], total: 210, status: "pendiente", time: "2026-02-18 08:30", pickupTime: "09:00" },
  { id: "ORD-2026-002", customerName: "Miguel Torres", customerAvatar: "https://i.pravatar.cc/40?img=8", items: [{ name: "Horchata con Coco", qty: 3, price: 55 }], total: 165, status: "confirmado", time: "2026-02-18 09:15", pickupTime: "10:00" },
  { id: "ORD-2026-003", customerName: "Roberto Chí", customerAvatar: "https://i.pravatar.cc/40?img=15", items: [{ name: "Pan de Cazón", qty: 2, price: 95 }], total: 190, status: "preparando", time: "2026-02-18 10:00", pickupTime: "10:45" },
  { id: "ORD-2026-004", customerName: "Laura Pech", customerAvatar: "https://i.pravatar.cc/40?img=20", items: [{ name: "Kit Energético", qty: 2, price: 120 }], total: 240, status: "listo", time: "2026-02-18 07:45", pickupTime: "08:30" },
  { id: "ORD-2026-005", customerName: "Diego Balam", customerAvatar: "https://i.pravatar.cc/40?img=33", items: [{ name: "Café de Olla", qty: 1, price: 45 }], total: 45, status: "entregado", time: "2026-02-17 16:20", pickupTime: "17:00" },
];

// ─── MY ROUTES ──────────────────────────────────────────
export const myRoutes: MyRouteData[] = [
  { id: "1", name: "Ruta de los Cenotes", status: "publicado", price: 85, sales: 89, rating: 4.8, revenue: 6412.5 },
  { id: "2", name: "Costa Esmeralda", status: "publicado", price: 85, sales: 28, revenue: 2023, rating: 4.4 },
  { id: "mr3", name: "Haciendas del Norte", status: "en_revision", price: 100, sales: 0, rating: 0, revenue: 0 },
  { id: "mr4", name: "Cenotes Secretos", status: "borrador", price: 75, sales: 0, rating: 0, revenue: 0 },
];

// ─── USERS (Admin) ──────────────────────────────────────
export const users: UserData[] = [
  { id: "u1", name: "Jonathan Balam", email: "jonathan@kaelo.mx", avatar: "https://i.pravatar.cc/40?img=12", role: "creador", registeredDate: "2025-06-15", routesCompleted: 47, status: "activo" },
  { id: "u2", name: "Ana García", email: "ana@gmail.com", avatar: "https://i.pravatar.cc/40?img=5", role: "ciclista", registeredDate: "2025-08-20", routesCompleted: 23, status: "activo" },
  { id: "u3", name: "Miguel Torres", email: "miguel@outlook.com", avatar: "https://i.pravatar.cc/40?img=8", role: "ciclista", registeredDate: "2025-09-10", routesCompleted: 15, status: "activo" },
  { id: "u4", name: "Roberto Chí", email: "roberto@kaelo.mx", avatar: "https://i.pravatar.cc/40?img=15", role: "comercio", registeredDate: "2025-07-01", routesCompleted: 8, status: "activo" },
  { id: "u5", name: "Laura Pech", email: "laura@gmail.com", avatar: "https://i.pravatar.cc/40?img=20", role: "creador", registeredDate: "2025-10-05", routesCompleted: 31, status: "activo" },
  { id: "u6", name: "Diego Balam", email: "diego@hotmail.com", avatar: "https://i.pravatar.cc/40?img=33", role: "ciclista", registeredDate: "2025-11-12", routesCompleted: 5, status: "suspendido" },
  { id: "u7", name: "Sofía Canul", email: "sofia@kaelo.mx", avatar: "https://i.pravatar.cc/40?img=25", role: "comercio", registeredDate: "2025-12-01", routesCompleted: 12, status: "activo" },
  { id: "u8", name: "Pedro Canul", email: "pedro@gmail.com", avatar: "https://i.pravatar.cc/40?img=11", role: "creador", registeredDate: "2025-07-20", routesCompleted: 62, status: "activo" },
];

// ─── CHART DATA ─────────────────────────────────────────
export const weeklyActivity = [
  { week: "Sem 1", km: 45 }, { week: "Sem 2", km: 32 }, { week: "Sem 3", km: 58 },
  { week: "Sem 4", km: 41 }, { week: "Sem 5", km: 67 }, { week: "Sem 6", km: 53 },
  { week: "Sem 7", km: 72 }, { week: "Sem 8", km: 61 },
];

export const monthlyDistance = [
  { month: "Sep", km: 180 }, { month: "Oct", km: 210 }, { month: "Nov", km: 195 },
  { month: "Dic", km: 230 }, { month: "Ene", km: 255 }, { month: "Feb", km: 245 },
];

export const dailyOrders = [
  { day: "Lun", orders: 5 }, { day: "Mar", orders: 8 }, { day: "Mié", orders: 3 },
  { day: "Jue", orders: 7 }, { day: "Vie", orders: 12 }, { day: "Sáb", orders: 15 },
  { day: "Dom", orders: 9 },
];

export const adminGrowth = [
  { month: "Sep", users: 120 }, { month: "Oct", users: 185 }, { month: "Nov", users: 240 },
  { month: "Dic", users: 310 }, { month: "Ene", users: 420 }, { month: "Feb", users: 538 },
];

export const adminRevenue = [
  { month: "Sep", revenue: 12500 }, { month: "Oct", revenue: 18900 }, { month: "Nov", revenue: 22100 },
  { month: "Dic", revenue: 28500 }, { month: "Ene", revenue: 34200 }, { month: "Feb", revenue: 31800 },
];

// ─── ACTIVITIES TIMELINE ────────────────────────────────
export const activities = [
  { id: "act1", text: "Completaste Ruta de los Cenotes — 32.5 km en 1h 45min", icon: "🚴", time: "Hace 2 días" },
  { id: "act2", text: "Nuevo récord personal en Circuito Mérida-Progreso — 28:30 min", icon: "🏅", time: "Hace 4 días" },
  { id: "act3", text: "Desbloqueaste logro: Explorador de Cenotes", icon: "🏆", time: "Hace 5 días" },
  { id: "act4", text: "Pre-pedido entregado en Café Cenote", icon: "☕", time: "Hace 1 semana" },
];

// ─── PENDING MODERATION ─────────────────────────────────
export const pendingRoutes = [
  { id: "pr1", name: "Ruta del Flamenco", creator: "Sofía Canul", distance: 42, difficulty: "moderada" as Difficulty, date: "2026-02-15" },
  { id: "pr2", name: "Camino de las Haciendas", creator: "Diego Balam", distance: 65, difficulty: "dificil" as Difficulty, date: "2026-02-14" },
  { id: "pr3", name: "Tour Cenote Xlacah", creator: "Ana García", distance: 18, difficulty: "facil" as Difficulty, date: "2026-02-12" },
];

export const pendingBusinesses = [
  { id: "pb1", name: "Taquería Don Pepe", type: "restaurante" as BusinessType, owner: "José Pérez", location: "Motul", date: "2026-02-16" },
  { id: "pb2", name: "Ciclo-Accesorios Yucatán", type: "tienda" as BusinessType, owner: "Carmen Uc", location: "Mérida", date: "2026-02-13" },
];

// ─── HELPERS ────────────────────────────────────────────
export function formatMXN(amount: number): string {
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('es-MX');
}

export const personalStats = {
  totalKm: 1245,
  routesCompleted: 47,
  achievementsUnlocked: 15,
  achievementsTotal: 32,
  caloriesBurned: 45230,
  monthKm: 245.5,
  monthKmChange: 15.2,
  monthCalories: 9560,
  monthCaloriesChange: 14.9,
  monthSpeed: 23.8,
  monthSpeedChange: 5.8,
  monthAchievements: 4,
};

export const merchantStats = {
  ordersToday: 3,
  monthRevenue: 4520,
  rating: 4.7,
  totalReviews: 23,
};

export const adminStats = {
  totalUsers: 538,
  totalRoutes: 24,
  totalBusinesses: 12,
  totalRevenue: 148000,
};
