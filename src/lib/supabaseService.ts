/**
 * Supabase Data Service Layer
 * Tries to fetch real data from Supabase, falls back to mock data if unavailable.
 * This ensures the demo always works, even if the DB is empty.
 */
import { supabase, isSupabaseConfigured } from './supabase';
import * as mock from './mockData';

// ─── ROUTES ────────────────────────────────────────────────────
export async function fetchRoutes(): Promise<mock.RouteData[]> {
    if (!isSupabaseConfigured) return mock.routes;

    try {
        const { data, error } = await supabase
            .from('routes')
            .select(`
        *,
        creator:profiles!routes_creator_id_fkey(full_name, avatar_url),
        route_waypoints(*)
      `)
            .eq('status', 'publicado')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            console.log('📦 Using mock routes (DB empty or error)');
            return mock.routes;
        }

        return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            image: r.cover_image_url || 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=600&h=400&fit=crop',
            difficulty: r.difficulty || 'moderada',
            rating: Number(r.average_rating) || 0,
            ratingCount: r.total_reviews || 0,
            distance: Number(r.distance_km),
            duration: `${Math.floor((r.estimated_duration_min || 60) / 60)}h ${(r.estimated_duration_min || 0) % 60}min`,
            elevation: r.elevation_gain_m || 0,
            terrain: r.terrain_type || 'asfalto',
            municipality: r.municipality || 'Yucatán',
            price: Number(r.price) || 0,
            description: r.description || '',
            creator: {
                name: r.creator?.full_name || 'Kaelo Team',
                avatar: r.creator?.avatar_url || 'https://i.pravatar.cc/40?img=3',
            },
            publishDate: r.published_at || r.created_at || '',
            purchaseCount: r.purchase_count || 0,
            viewCount: r.view_count || 0,
            waypoints: (r.route_waypoints || []).map((w: any) => ({
                type: w.waypoint_type,
                name: w.name,
                icon: getWaypointIcon(w.waypoint_type),
            })),
            reviews: [],
        }));
    } catch (err) {
        console.warn('⚠️ Supabase fetch failed, using mock routes:', err);
        return mock.routes;
    }
}

// ─── BUSINESSES ────────────────────────────────────────────────
export async function fetchBusinesses(): Promise<mock.BusinessData[]> {
    if (!isSupabaseConfigured) return mock.businesses;

    try {
        const { data, error } = await supabase
            .from('businesses')
            .select(`*, products(*)`)
            .eq('status', 'activo')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            console.log('📦 Using mock businesses');
            return mock.businesses;
        }

        return data.map((b: any) => ({
            id: b.id,
            name: b.name,
            type: b.business_type || 'tienda',
            image: b.cover_image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
            logo: b.logo_url || getBusinessEmoji(b.business_type),
            rating: Number(b.average_rating) || 0,
            ratingCount: b.total_reviews || 0,
            address: b.address,
            distance: '—',
            isOpen: true,
            schedule: formatBusinessHours(b.business_hours),
            acceptsPreOrders: b.accepts_advance_orders ?? true,
            phone: b.phone || '',
            whatsapp: b.whatsapp || '',
            products: (b.products || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category || 'otro',
                price: Number(p.price),
                stock: p.stock_quantity || 0,
                available: p.is_available ?? true,
                isSpecialCyclist: p.is_cyclist_special ?? false,
                image: p.image_url || '📦',
            })),
        }));
    } catch (err) {
        console.warn('⚠️ Supabase fetch failed, using mock businesses:', err);
        return mock.businesses;
    }
}

// ─── ORDERS ────────────────────────────────────────────────────
export async function fetchOrders(businessId?: string): Promise<mock.OrderData[]> {
    if (!isSupabaseConfigured) return mock.orders;

    try {
        let query = supabase
            .from('orders')
            .select(`
        *,
        customer:profiles!orders_customer_id_fkey(full_name, avatar_url),
        order_items(*, product:products(*))
      `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (businessId) {
            query = query.eq('business_id', businessId);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            console.log('📦 Using mock orders');
            return mock.orders;
        }

        return data.map((o: any) => ({
            id: o.order_number || o.id,
            customerName: o.customer?.full_name || 'Cliente',
            customerAvatar: o.customer?.avatar_url || 'https://i.pravatar.cc/40?img=5',
            items: (o.order_items || []).map((item: any) => ({
                name: item.product?.name || 'Producto',
                qty: item.quantity,
                price: Number(item.unit_price),
            })),
            total: Number(o.total),
            status: o.status || 'pendiente',
            time: o.created_at || '',
            pickupTime: o.estimated_pickup_time || '',
        }));
    } catch (err) {
        console.warn('⚠️ Supabase fetch failed, using mock orders:', err);
        return mock.orders;
    }
}

// ─── PRODUCTS ──────────────────────────────────────────────────
export async function fetchProducts(businessId?: string): Promise<mock.ProductData[]> {
    if (!isSupabaseConfigured) return mock.businesses.flatMap(b => b.products);

    try {
        let query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (businessId) {
            query = query.eq('business_id', businessId);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            console.log('📦 Using mock products');
            return mock.businesses.flatMap(b => b.products);
        }

        return data.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category || 'otro',
            price: Number(p.price),
            stock: p.stock_quantity || 0,
            available: p.is_available ?? true,
            isSpecialCyclist: p.is_cyclist_special ?? false,
            image: p.image_url || '📦',
        }));
    } catch (err) {
        console.warn('⚠️ Supabase fetch failed, using mock products:', err);
        return mock.businesses.flatMap(b => b.products);
    }
}

// ─── USERS (Admin) ─────────────────────────────────────────────
export async function fetchUsers(): Promise<mock.UserData[]> {
    if (!isSupabaseConfigured) return mock.users;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            console.log('📦 Using mock users');
            return mock.users;
        }

        return data.map((u: any) => ({
            id: u.id,
            name: u.full_name || 'Usuario',
            email: u.email,
            avatar: u.avatar_url || `https://i.pravatar.cc/40?u=${u.id}`,
            role: u.is_creator ? 'creador' : u.is_business_owner ? 'comercio' : 'ciclista',
            registeredDate: u.created_at || '',
            routesCompleted: 0,
            status: 'activo' as const,
        }));
    } catch (err) {
        console.warn('⚠️ Supabase fetch failed, using mock users:', err);
        return mock.users;
    }
}

// ─── REVIEWS ───────────────────────────────────────────────────
export async function fetchReviews(businessId?: string): Promise<mock.ReviewData[]> {
    if (!isSupabaseConfigured) return mock.routes.flatMap(r => r.reviews);

    try {
        let query = supabase
            .from('reviews')
            .select(`*, user:profiles!reviews_user_id_fkey(full_name, avatar_url)`)
            .eq('review_type', 'comercio')
            .eq('status', 'aprobado')
            .order('created_at', { ascending: false });

        if (businessId) {
            query = query.eq('business_id', businessId);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            return mock.routes[0]?.reviews || [];
        }

        return data.map((r: any) => ({
            id: r.id,
            userName: r.user?.full_name || 'Usuario',
            avatar: r.user?.avatar_url || 'https://i.pravatar.cc/40',
            rating: r.rating,
            comment: r.comment || '',
            date: r.created_at || '',
        }));
    } catch (err) {
        return mock.routes[0]?.reviews || [];
    }
}

// ─── MY ROUTES (Creator) ──────────────────────────────────────
export async function fetchMyRoutes(creatorId?: string): Promise<mock.MyRouteData[]> {
    if (!isSupabaseConfigured || !creatorId) return mock.myRoutes;

    try {
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .eq('creator_id', creatorId)
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            console.log('📦 Using mock routes (creator)');
            return mock.myRoutes;
        }

        return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            status: r.status || 'borrador',
            price: Number(r.price) || 0,
            sales: r.purchase_count || 0,
            rating: Number(r.average_rating) || 0,
            revenue: (r.purchase_count || 0) * Number(r.price || 0) * 0.85,
        }));
    } catch (err) {
        return mock.myRoutes;
    }
}

// ─── STATS ─────────────────────────────────────────────────────
export async function fetchAdminStats() {
    if (!isSupabaseConfigured) return mock.adminStats;

    try {
        const [usersRes, routesRes, businessRes] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('routes').select('id', { count: 'exact', head: true }).eq('status', 'publicado'),
            supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'activo'),
        ]);

        const totalUsers = usersRes.count || 0;
        const totalRoutes = routesRes.count || 0;
        const totalBusinesses = businessRes.count || 0;

        if (totalUsers === 0 && totalRoutes === 0 && totalBusinesses === 0) {
            return mock.adminStats;
        }

        return {
            totalUsers,
            totalRoutes,
            totalBusinesses,
            totalRevenue: mock.adminStats.totalRevenue, // This needs an aggregation query
        };
    } catch {
        return mock.adminStats;
    }
}

export async function fetchMerchantStats(businessId?: string) {
    if (!isSupabaseConfigured || !businessId) return mock.merchantStats;

    try {
        const [ordersRes, reviewsRes] = await Promise.all([
            supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId),
            supabase.from('reviews').select('rating').eq('business_id', businessId).eq('status', 'aprobado'),
        ]);

        const totalOrders = ordersRes.count || 0;
        const reviews = reviewsRes.data || [];
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
            : 0;

        if (totalOrders === 0) return mock.merchantStats;

        return {
            ordersToday: totalOrders,
            monthRevenue: mock.merchantStats.monthRevenue,
            rating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length,
        };
    } catch {
        return mock.merchantStats;
    }
}

// ─── ADD PRODUCT ───────────────────────────────────────────────

interface AddProductInput {
    businessId: string;
    name: string;
    price: number;
    category?: string;
    description?: string;
    stockQuantity?: number;
    isCyclistSpecial?: boolean;
    imageEmoji?: string;
}

export async function addProduct(input: AddProductInput): Promise<{ error: string | null; product?: mock.ProductData }> {
    if (!isSupabaseConfigured) {
        return { error: 'Supabase no configurado. Usa el modo demo.' };
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .insert({
                business_id: input.businessId,
                name: input.name,
                price: input.price,
                category: input.category || 'otro',
                description: input.description || null,
                stock_quantity: input.stockQuantity ?? 0,
                is_cyclist_special: input.isCyclistSpecial ?? false,
                is_available: true,
                image_url: input.imageEmoji || '📦',
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding product:', error);
            return { error: error.message };
        }

        return {
            error: null,
            product: {
                id: data.id,
                name: data.name,
                category: data.category || 'otro',
                price: Number(data.price),
                stock: data.stock_quantity || 0,
                available: data.is_available ?? true,
                isSpecialCyclist: data.is_cyclist_special ?? false,
                image: data.image_url || '📦',
            },
        };
    } catch (err: any) {
        return { error: err.message || 'Error al agregar producto' };
    }
}

export async function toggleProductAvailability(productId: string, available: boolean): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null }; // Silent no-op in demo

    try {
        const { error } = await supabase
            .from('products')
            .update({ is_available: available })
            .eq('id', productId);

        if (error) return { error: error.message };
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}

// ─── REGISTER BUSINESS ─────────────────────────────────────────

interface RegisterBusinessInput {
    // Owner info
    ownerName: string;
    email: string;
    password: string;
    phone?: string;
    // Business info
    businessName: string;
    businessType: string;
    address: string;
    schedule?: string;
}

export async function registerBusiness(input: RegisterBusinessInput): Promise<{ error: string | null; businessId?: string }> {
    if (!isSupabaseConfigured) {
        return { error: 'Supabase no configurado. Usa el modo demo.' };
    }

    // ── Frontend validations ──
    if (input.password.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres.' };
    }
    if (!input.email.includes('@')) {
        return { error: 'El email no es válido.' };
    }

    try {
        let userId: string;

        // ── Step 1: Get or create auth user ──
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: input.email,
            password: input.password,
            options: {
                data: {
                    full_name: input.ownerName,
                    is_business_owner: true,
                },
            },
        });

        if (authError) {
            // If already registered, try to sign in instead
            if (authError.message.includes('already registered') ||
                authError.message.includes('User already registered')) {
                console.log('User already exists, trying sign in...');
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: input.email,
                    password: input.password,
                });
                if (signInError) {
                    return { error: 'Este email ya está registrado. Verifica tu contraseña o inicia sesión.' };
                }
                userId = signInData.user.id;
            } else if (authError.message.includes('rate') || authError.message.includes('429')) {
                return { error: 'Demasiados intentos. Espera 1 minuto e intenta de nuevo.' };
            } else {
                return { error: authError.message };
            }
        } else if (authData?.user) {
            userId = authData.user.id;
        } else {
            // Supabase may return a fake user when email exists (no error, no session)
            // Try to sign in
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: input.email,
                password: input.password,
            });
            if (signInError) {
                return { error: 'No se pudo crear la cuenta. Intenta con otro email.' };
            }
            userId = signInData.user.id;
        }

        // ── Step 2: Ensure profile exists ──
        // Wait briefly for the DB trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1500));

        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (!existingProfile) {
            // Profile doesn't exist yet — create it manually
            console.log('Profile not found, creating manually...');
            const { error: profileInsertErr } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    email: input.email,
                    full_name: input.ownerName,
                    phone: input.phone || null,
                    is_business_owner: true,
                    is_creator: false,
                });

            if (profileInsertErr) {
                // Maybe trigger just created it, try once more
                await new Promise(resolve => setTimeout(resolve, 2000));
                const { data: retryCheck } = await supabase
                    .from('profiles').select('id').eq('id', userId).single();
                if (!retryCheck) {
                    return { error: 'Error creando perfil. Vuelve a intentar en unos segundos.' };
                }
            }
        }

        // Update profile with business owner flag
        await supabase
            .from('profiles')
            .update({
                full_name: input.ownerName,
                phone: input.phone || null,
                is_business_owner: true,
            })
            .eq('id', userId);

        // ── Step 3: Check if business already exists for this user ──
        const { data: existingBiz } = await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', userId)
            .single();

        if (existingBiz) {
            // Business already exists from a previous attempt
            return { error: null, businessId: existingBiz.id };
        }

        // ── Step 4: Create business ──
        const slug = input.businessName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        const { data: bizData, error: bizError } = await supabase
            .from('businesses')
            .insert({
                owner_id: userId,
                name: input.businessName,
                slug: slug + '-' + Date.now().toString(36),
                business_type: input.businessType,
                address: input.address,
                location: `POINT(-89.6 20.97)`,
                status: 'pendiente',
                business_hours: input.schedule ? { general: input.schedule } : null,
                phone: input.phone || null,
                accepts_advance_orders: true,
                commission_rate: 10,
            })
            .select('id')
            .single();

        if (bizError) {
            console.error('Business creation error:', bizError);
            return { error: `Error al registrar negocio: ${bizError.message}` };
        }

        return { error: null, businessId: bizData?.id };
    } catch (err: any) {
        console.error('Registration error:', err);
        return { error: err.message || 'Error inesperado. Intenta de nuevo.' };
    }
}

// ─── HELPERS ───────────────────────────────────────────────────

function getWaypointIcon(type: string): string {
    const icons: Record<string, string> = {
        inicio: '🏁', fin: '🏁', cenote: '💧', zona_arqueologica: '🏛️',
        mirador: '👁️', restaurante: '🍽️', tienda: '🛒', taller_bicicletas: '🔧',
        descanso: '🌳', punto_agua: '💧', peligro: '⚠️', foto: '📸', otro: '📍',
    };
    return icons[type] || '📍';
}

function getBusinessEmoji(type: string): string {
    const emojis: Record<string, string> = {
        restaurante: '🍽️', cafeteria: '☕', tienda: '🛒', taller_bicicletas: '🔧',
        hospedaje: '🏨', tienda_conveniencia: '🏪', mercado: '🏪', otro: '🏢',
    };
    return emojis[type] || '🏢';
}

function formatBusinessHours(hours: any): string {
    if (!hours || typeof hours !== 'object') return 'Horario no disponible';
    // Try to get a representative schedule
    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    for (const day of days) {
        if (hours[day]) return hours[day];
    }
    return 'Horario no disponible';
}
