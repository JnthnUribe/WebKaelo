import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type UserRole = "admin" | "comercio" | "creador";

interface AuthUser {
    id?: string;
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
}

interface UserBusiness {
    id: string;
    name: string;
    status: string;
}

interface AuthContextType {
    user: AuthUser;
    supabaseUser: User | null;
    userBusiness: UserBusiness | null;
    currentRole: UserRole;
    setCurrentRole: (role: UserRole) => void;
    isLoggedIn: boolean;
    isDemoMode: boolean;
    needsRoleSelection: boolean;
    availableRoles: UserRole[];
    selectRole: (role: UserRole) => void;
    login: (role: UserRole) => void;
    loginWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
    loginWithGoogle: () => Promise<{ error: string | null }>;
    logout: () => void;
    loading: boolean;
}

// Demo profiles for presentation mode
const roleProfiles: Record<UserRole, AuthUser> = {
    admin: {
        name: "Jonathan Balam",
        email: "jonathan@kaelo.mx",
        avatar: "https://i.pravatar.cc/40?img=12",
        role: "admin",
    },
    comercio: {
        name: "Roberto Chí",
        email: "roberto@cafecenote.mx",
        avatar: "https://i.pravatar.cc/40?img=15",
        role: "comercio",
    },
    creador: {
        name: "Carlos Méndez",
        email: "carlos@kaelo.mx",
        avatar: "https://i.pravatar.cc/40?img=11",
        role: "creador",
    },
};

const AuthContext = createContext<AuthContextType | null>(null);

// Module-level flag to suppress auth state changes during business registration
let _suppressAuthChange = false;
export function setSuppressAuth(val: boolean) { _suppressAuthChange = val; }

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentRole, setCurrentRole] = useState<UserRole>("admin");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
    const [realProfile, setRealProfile] = useState<AuthUser | null>(null);
    const [userBusiness, setUserBusiness] = useState<UserBusiness | null>(null);
    const [loading, setLoading] = useState(true);
    const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
    const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

    // Listen for Supabase auth changes
    useEffect(() => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        // Safety timeout — never stay loading forever (3s max)
        const timeout = setTimeout(() => setLoading(false), 3000);

        // Check existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(timeout);
            if (session?.user) {
                setSupabaseUser(session.user);
                setIsLoggedIn(true);
                setIsDemoMode(false);
                loadProfile(session.user);
            }
            setLoading(false);
        }).catch(() => {
            clearTimeout(timeout);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                // Skip auth events during business registration
                if (_suppressAuthChange) return;

                if (event === 'SIGNED_IN' && session?.user) {
                    setSupabaseUser(session.user);
                    setIsLoggedIn(true);
                    setIsDemoMode(false);
                    await loadProfile(session.user);
                } else if (event === 'SIGNED_OUT') {
                    setSupabaseUser(null);
                    setRealProfile(null);
                    setIsLoggedIn(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    function fallbackProfile(user: User): AuthUser {
        const role: UserRole = user.email?.endsWith('@kaelo.mx') ? 'admin' : 'creador';
        return {
            id: user.id,
            name: user.email || 'Usuario',
            email: user.email || '',
            avatar: `https://i.pravatar.cc/40?u=${user.id}`,
            role,
        };
    }

    async function loadProfile(user: User) {
        try {
            // Race the profile query against a 4-second timeout
            const result = await Promise.race([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
            ]);

            const data = result && 'data' in result ? result.data : null;

            if (data) {
                let role: UserRole = 'creador';

                if (user.email?.endsWith('@kaelo.mx')) {
                    role = 'admin';
                } else if (data.is_business_owner && data.is_creator) {
                    // Dual-role user: let them choose
                    const roles: UserRole[] = ['comercio', 'creador'];
                    setAvailableRoles(roles);
                    setNeedsRoleSelection(true);
                    role = 'comercio'; // default while they choose
                } else if (data.is_business_owner) {
                    role = 'comercio';
                }

                const profile: AuthUser = {
                    id: data.id,
                    name: data.full_name || user.email || 'Usuario',
                    email: data.email || user.email || '',
                    avatar: data.avatar_url || `https://i.pravatar.cc/40?u=${data.id}`,
                    role,
                };

                setRealProfile(profile);
                setCurrentRole(role);

                // Load business data (non-blocking)
                if (role === 'comercio') {
                    supabase
                        .from('businesses')
                        .select('id, name, status')
                        .eq('owner_id', user.id)
                        .single()
                        .then(({ data: biz }) => {
                            if (biz) {
                                setUserBusiness({ id: biz.id, name: biz.name, status: biz.status || 'pendiente' });
                            }
                        });
                }
            } else {
                // No profile or timeout — use fallback
                const fb = fallbackProfile(user);
                setRealProfile(fb);
                setCurrentRole(fb.role);
            }
        } catch (err) {
            console.warn('Could not load profile:', err);
            const fb = fallbackProfile(user);
            setRealProfile(fb);
            setCurrentRole(fb.role);
        }
    }

    const selectRole = (role: UserRole) => {
        setCurrentRole(role);
        setNeedsRoleSelection(false);
    };

    // Demo login (instant, no real auth)
    const login = (role: UserRole) => {
        setCurrentRole(role);
        setIsLoggedIn(true);
        setIsDemoMode(true);
        setSupabaseUser(null);
        setRealProfile(null);
        setUserBusiness(null);
    };

    // Real Supabase login
    const loginWithEmail = async (email: string, password: string) => {
        if (!isSupabaseConfigured) {
            return { error: 'Supabase no configurado. Usa el modo demo.' };
        }

        setLoading(true);
        // Safety: never stay loading longer than 5 seconds
        const safetyTimeout = setTimeout(() => setLoading(false), 5000);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                clearTimeout(safetyTimeout);
                setLoading(false);
                return { error: error.message };
            }

            if (data.user) {
                setSupabaseUser(data.user);
                setIsLoggedIn(true);
                setIsDemoMode(false);
                await loadProfile(data.user);
            }

            clearTimeout(safetyTimeout);
            setLoading(false);
            return { error: null };
        } catch (err: any) {
            clearTimeout(safetyTimeout);
            setLoading(false);
            return { error: err.message || 'Error de conexión' };
        }
    };

    // Google OAuth login
    const loginWithGoogle = async () => {
        if (!isSupabaseConfigured) {
            return { error: 'Supabase no configurado. Usa el modo demo.' };
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}`,
                },
            });

            if (error) {
                return { error: error.message };
            }

            return { error: null };
        } catch (err: any) {
            return { error: err.message || 'Error al conectar con Google' };
        }
    };

    const logout = () => {
        // Clear React state
        setIsLoggedIn(false);
        setIsDemoMode(false);
        setSupabaseUser(null);
        setRealProfile(null);
        setUserBusiness(null);
        setCurrentRole('creador');
        setNeedsRoleSelection(false);
        setAvailableRoles([]);

        // Clear Supabase session from localStorage
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('sb-') || key.includes('supabase')) {
                localStorage.removeItem(key);
            }
        });

        // Fire-and-forget signOut (page will reload anyway)
        if (isSupabaseConfigured) {
            supabase.auth.signOut().catch(() => {});
        }
    };

    // Use real profile if available, otherwise demo profile
    const currentUser = isDemoMode || !realProfile
        ? roleProfiles[currentRole]
        : realProfile;

    return (
        <AuthContext.Provider
            value={{
                user: currentUser,
                supabaseUser,
                userBusiness,
                currentRole,
                setCurrentRole: (role) => { setCurrentRole(role); },
                isLoggedIn,
                isDemoMode,
                needsRoleSelection,
                availableRoles,
                selectRole,
                login,
                loginWithEmail,
                loginWithGoogle,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
