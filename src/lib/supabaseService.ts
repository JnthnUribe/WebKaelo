/**
 * Supabase Data Service Layer
 * - demoMode=true → returns mock data (for ?demo=true URL)
 * - demoMode=false → returns real Supabase data or empty arrays
 * - !isSupabaseConfigured → always returns mock data
 */
import { supabase, isSupabaseConfigured } from './supabase';
import { setSuppressAuth } from '@/contexts/AuthContext';
import * as mock from './mockData';

// ─── ROUTES ────────────────────────────────────────────────────
export async function fetchRoutes(demoMode = false): Promise<mock.RouteData[]> {
    if (!isSupabaseConfigured || demoMode) return mock.routes;

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

        if (error || !data) return [];

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
        console.warn('Supabase fetch failed:', err);
        return [];
    }
}

// ─── BUSINESSES ────────────────────────────────────────────────
export async function fetchBusinesses(demoMode = false): Promise<mock.BusinessData[]> {
    if (!isSupabaseConfigured || demoMode) return mock.businesses;

    try {
        const { data, error } = await supabase
            .from('businesses')
            .select(`*, products(*)`)
            .eq('status', 'activo')
            .order('created_at', { ascending: false });

        if (error || !data) return [];

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
        console.warn('Supabase fetch failed:', err);
        return [];
    }
}

// ─── ORDERS ────────────────────────────────────────────────────
export async function fetchOrders(businessId?: string, demoMode = false): Promise<mock.OrderData[]> {
    if (!isSupabaseConfigured || demoMode) return mock.orders;

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

        if (error || !data) return [];

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
        console.warn('Supabase fetch failed:', err);
        return [];
    }
}

// ─── PRODUCTS ──────────────────────────────────────────────────
export async function fetchProducts(businessId?: string, demoMode = false): Promise<mock.ProductData[]> {
    if (!isSupabaseConfigured || demoMode) return mock.businesses.flatMap(b => b.products);

    try {
        let query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (businessId) {
            query = query.eq('business_id', businessId);
        }

        const { data, error } = await query;

        if (error || !data) return [];

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
        console.warn('Supabase fetch failed:', err);
        return [];
    }
}

// ─── USERS (Admin) ─────────────────────────────────────────────
export async function fetchUsers(demoMode = false): Promise<mock.UserData[]> {
    if (!isSupabaseConfigured || demoMode) return mock.users;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error || !data) return [];

        return data.map((u: any) => {
            const prefs = u.preferences as any;
            const isSuspended = prefs?.suspended === true;
            return {
                id: u.id,
                name: u.full_name || 'Usuario',
                email: u.email,
                avatar: u.avatar_url || `https://i.pravatar.cc/40?u=${u.id}`,
                role: u.is_creator ? 'creador' : u.is_business_owner ? 'comercio' : 'ciclista',
                registeredDate: u.created_at || '',
                routesCompleted: 0,
                status: (isSuspended ? 'suspendido' : 'activo') as 'activo' | 'suspendido',
            };
        });
    } catch (err) {
        console.warn('Supabase fetch failed:', err);
        return [];
    }
}

// ─── REVIEWS ───────────────────────────────────────────────────
export async function fetchReviews(businessId?: string, demoMode = false): Promise<mock.ReviewData[]> {
    if (!isSupabaseConfigured || demoMode) return mock.routes.flatMap(r => r.reviews);

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

        if (error || !data) return [];

        return data.map((r: any) => ({
            id: r.id,
            userName: r.user?.full_name || 'Usuario',
            avatar: r.user?.avatar_url || 'https://i.pravatar.cc/40',
            rating: r.rating,
            comment: r.comment || '',
            date: r.created_at || '',
        }));
    } catch (err) {
        return [];
    }
}

// ─── MY ROUTES (Creator) ──────────────────────────────────────
export async function fetchMyRoutes(creatorId?: string, demoMode = false): Promise<mock.MyRouteData[]> {
    if (!isSupabaseConfigured || demoMode) return mock.myRoutes;
    if (!creatorId) return [];

    try {
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .eq('creator_id', creatorId)
            .order('created_at', { ascending: false });

        if (error || !data) return [];

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
        return [];
    }
}

// ─── STATS ─────────────────────────────────────────────────────
export async function fetchAdminStats(demoMode = false) {
    if (!isSupabaseConfigured || demoMode) return mock.adminStats;

    try {
        const [usersRes, routesRes, businessRes] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('routes').select('id', { count: 'exact', head: true }).eq('status', 'publicado'),
            supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'activo'),
        ]);

        return {
            totalUsers: usersRes.count || 0,
            totalRoutes: routesRes.count || 0,
            totalBusinesses: businessRes.count || 0,
            totalRevenue: 0,
        };
    } catch {
        return { totalUsers: 0, totalRoutes: 0, totalBusinesses: 0, totalRevenue: 0 };
    }
}

export async function fetchMerchantStats(businessId?: string, demoMode = false) {
    if (!isSupabaseConfigured || demoMode) return mock.merchantStats;
    if (!businessId) return { ordersToday: 0, monthRevenue: 0, rating: 0, totalReviews: 0 };

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

        return {
            ordersToday: totalOrders,
            monthRevenue: 0,
            rating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length,
        };
    } catch {
        return { ordersToday: 0, monthRevenue: 0, rating: 0, totalReviews: 0 };
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

export async function deleteProduct(productId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    try {
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) return { error: error.message };
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function toggleProductAvailability(productId: string, available: boolean): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };

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
    ownerName: string;
    email: string;
    password: string;
    phone?: string;
    businessName: string;
    businessType: string;
    address: string;
    schedule?: string;
}

export async function registerBusiness(input: RegisterBusinessInput): Promise<{ error: string | null; businessId?: string }> {
    if (!isSupabaseConfigured) {
        return { error: 'Supabase no configurado. Usa el modo demo.' };
    }

    if (input.password.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres.' };
    }
    if (!input.email.includes('@')) {
        return { error: 'El email no es válido.' };
    }

    // Suppress auth state changes so the user doesn't get auto-logged-in mid-registration
    setSuppressAuth(true);

    try {
        let userId: string;

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
            if (authError.message.includes('already registered') ||
                authError.message.includes('User already registered')) {
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
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: input.email,
                password: input.password,
            });
            if (signInError) {
                return { error: 'No se pudo crear la cuenta. Intenta con otro email.' };
            }
            userId = signInData.user.id;
        }

        await new Promise(resolve => setTimeout(resolve, 1500));

        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (!existingProfile) {
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
                await new Promise(resolve => setTimeout(resolve, 2000));
                const { data: retryCheck } = await supabase
                    .from('profiles').select('id').eq('id', userId).single();
                if (!retryCheck) {
                    return { error: 'Error creando perfil. Vuelve a intentar en unos segundos.' };
                }
            }
        }

        await supabase
            .from('profiles')
            .update({
                full_name: input.ownerName,
                phone: input.phone || null,
                is_business_owner: true,
            })
            .eq('id', userId);

        const { data: existingBiz } = await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', userId)
            .single();

        if (existingBiz) {
            return { error: null, businessId: existingBiz.id };
        }

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

        // Sign out so user must log in fresh (prevents auto-login with wrong role)
        await supabase.auth.signOut();
        setSuppressAuth(false);

        return { error: null, businessId: bizData?.id };
    } catch (err: any) {
        console.error('Registration error:', err);
        // Also sign out on error to prevent partial auto-login
        try { await supabase.auth.signOut(); } catch { /* ignore */ }
        setSuppressAuth(false);
        return { error: err.message || 'Error inesperado. Intenta de nuevo.' };
    }
}

// ─── MODERATION ───────────────────────────────────────────────

export async function fetchPendingRoutes() {
    if (!isSupabaseConfigured) return [];
    try {
        const { data, error } = await supabase
            .from('routes')
            .select('*, creator:profiles!routes_creator_id_fkey(full_name)')
            .eq('status', 'en_revision')
            .order('created_at', { ascending: false });
        if (error || !data) return [];
        return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            creator: r.creator?.full_name || 'Desconocido',
            distance: Number(r.distance_km) || 0,
            difficulty: r.difficulty || 'moderada',
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('es-MX') : '',
        }));
    } catch { return []; }
}

export async function fetchPendingBusinesses() {
    if (!isSupabaseConfigured) return [];
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*, owner:profiles!businesses_owner_id_fkey(full_name)')
            .eq('status', 'pendiente')
            .order('created_at', { ascending: false });
        if (error || !data) return [];
        return data.map((b: any) => ({
            id: b.id,
            name: b.name,
            type: b.business_type || 'otro',
            owner: b.owner?.full_name || 'Desconocido',
            location: b.address || 'Sin dirección',
            date: b.created_at ? new Date(b.created_at).toLocaleDateString('es-MX') : '',
        }));
    } catch { return []; }
}

export async function approveRoute(routeId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { data, error } = await supabase.from('routes').update({ status: 'publicado', published_at: new Date().toISOString() }).eq('id', routeId).select('id');
    if (error) return { error: error.message };
    if (!data || data.length === 0) return { error: 'No se pudo actualizar. Revisa los permisos (RLS) en Supabase Dashboard.' };
    return { error: null };
}

export async function rejectRoute(routeId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { data, error } = await supabase.from('routes').update({ status: 'rechazado' }).eq('id', routeId).select('id');
    if (error) return { error: error.message };
    if (!data || data.length === 0) return { error: 'No se pudo actualizar. Revisa los permisos (RLS) en Supabase Dashboard.' };
    return { error: null };
}

export async function approveBusiness(businessId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { data, error } = await supabase.from('businesses').update({ status: 'activo' }).eq('id', businessId).select('id');
    if (error) return { error: error.message };
    if (!data || data.length === 0) return { error: 'No se pudo aprobar. Revisa los permisos (RLS) en Supabase Dashboard > businesses > Policies.' };
    return { error: null };
}

export async function rejectBusiness(businessId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { data, error } = await supabase.from('businesses').update({ status: 'rechazado' }).eq('id', businessId).select('id');
    if (error) return { error: error.message };
    if (!data || data.length === 0) return { error: 'No se pudo rechazar. Revisa los permisos (RLS) en Supabase Dashboard > businesses > Policies.' };
    return { error: null };
}

// ─── ORDER STATUS ─────────────────────────────────────────────

export async function updateOrderStatus(orderId: string, status: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select('id');
    if (error) return { error: error.message };
    if (!data || data.length === 0) return { error: 'No se pudo actualizar el pedido. Revisa permisos RLS.' };
    return { error: null };
}

export function subscribeToOrders(businessId: string, callback: () => void) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };
    const channel = supabase
        .channel(`orders-${businessId}`)
        .on('postgres_changes', {
            event: '*', schema: 'public', table: 'orders',
            filter: `business_id=eq.${businessId}`,
        }, callback)
        .subscribe();
    return { unsubscribe: () => supabase.removeChannel(channel) };
}

// ─── BUSINESS PROFILE ─────────────────────────────────────────

export async function fetchBusinessProfile(businessId: string) {
    if (!isSupabaseConfigured || !businessId) return null;
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', businessId)
            .single();
        if (error || !data) return null;
        return data;
    } catch { return null; }
}

export async function updateBusinessProfile(businessId: string, updates: Record<string, any>): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.from('businesses').update(updates).eq('id', businessId);
    return { error: error?.message || null };
}

// ─── USER MANAGEMENT ──────────────────────────────────────────

export async function updateUserStatus(userId: string, status: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { data, error } = await supabase
        .from('profiles')
        .update({ preferences: { suspended: status === 'suspendido' } as any })
        .eq('id', userId)
        .select('id');
    if (error) return { error: error.message };
    if (!data || data.length === 0) return { error: 'No se pudo actualizar. Revisa los permisos (RLS) en Supabase Dashboard.' };
    return { error: null };
}

// ─── PROFILE SETTINGS ─────────────────────────────────────────

export async function updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string; phone?: string }): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    return { error: error?.message || null };
}

export async function fetchUserPreferences(userId: string): Promise<Record<string, any> | null> {
    if (!isSupabaseConfigured) return null;
    const { data } = await supabase.from('profiles').select('preferences').eq('id', userId).single();
    return (data?.preferences as Record<string, any>) || null;
}

export async function updateUserPreferences(userId: string, preferences: Record<string, any>): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: null };
    const { data: current } = await supabase.from('profiles').select('preferences').eq('id', userId).single();
    const merged = { ...(current?.preferences as object || {}), ...preferences };
    const { error } = await supabase.from('profiles').update({ preferences: merged }).eq('id', userId);
    return { error: error?.message || null };
}

export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured) return { error: 'Supabase no configurado' };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message || null };
}

// ─── WALLET (Creator) ─────────────────────────────────────────

export async function fetchWalletData(creatorId: string) {
    if (!isSupabaseConfigured || !creatorId) return null;
    try {
        const { data: purchases, error } = await supabase
            .from('route_purchases')
            .select('*, route:routes!route_purchases_route_id_fkey(name, price)')
            .eq('route:routes.creator_id', creatorId)
            .order('purchased_at', { ascending: false });

        if (error || !purchases || purchases.length === 0) return null;

        const transactions = purchases.map((p: any) => ({
            id: p.id,
            type: 'ingreso' as const,
            description: `Venta: ${p.route?.name || 'Ruta'}`,
            amount: Number(p.creator_amount || 0),
            date: p.purchased_at ? new Date(p.purchased_at).toLocaleDateString('es-MX') : '',
        }));

        const balance = transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
        return { balance, transactions };
    } catch { return null; }
}

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

export async function fetchNotifications(userId: string, types?: string[]): Promise<NotificationItem[]> {
  if (!isSupabaseConfigured || !userId) return [];
  try {
    let query = supabase
      .from('notifications')
      .select('id, title, body, notification_type, is_read, created_at, related_business_id, related_order_id, related_route_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (types && types.length > 0) {
      query = query.in('notification_type', types);
    }
    const { data, error } = await query;
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
    const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
    for (const day of days) {
        if (hours[day]) return hours[day];
    }
    return 'Horario no disponible';
}
