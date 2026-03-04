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

interface AuthContextType {
    user: AuthUser;
    supabaseUser: User | null;
    currentRole: UserRole;
    setCurrentRole: (role: UserRole) => void;
    isLoggedIn: boolean;
    isDemoMode: boolean;
    login: (role: UserRole) => void;
    loginWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentRole, setCurrentRole] = useState<UserRole>("admin");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
    const [realProfile, setRealProfile] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for Supabase auth changes
    useEffect(() => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        // Check existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setSupabaseUser(session.user);
                setIsLoggedIn(true);
                setIsDemoMode(false);
                loadProfile(session.user);
            }
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
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

    async function loadProfile(user: User) {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                // Determine role from profile flags
                let role: UserRole = 'creador'; // default
                if (data.is_business_owner) role = 'comercio';
                // Check for admin (user_type field or specific email)
                if (user.email?.endsWith('@kaelo.mx')) role = 'admin';

                const profile: AuthUser = {
                    id: data.id,
                    name: data.full_name || user.email || 'Usuario',
                    email: data.email || user.email || '',
                    avatar: data.avatar_url || `https://i.pravatar.cc/40?u=${data.id}`,
                    role,
                };

                setRealProfile(profile);
                setCurrentRole(role);
            }
        } catch (err) {
            console.warn('Could not load profile:', err);
        }
    }

    // Demo login (instant, no real auth)
    const login = (role: UserRole) => {
        setCurrentRole(role);
        setIsLoggedIn(true);
        setIsDemoMode(true);
        setSupabaseUser(null);
        setRealProfile(null);
    };

    // Real Supabase login
    const loginWithEmail = async (email: string, password: string) => {
        if (!isSupabaseConfigured) {
            return { error: 'Supabase no configurado. Usa el modo demo.' };
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoading(false);
                return { error: error.message };
            }

            if (data.user) {
                setSupabaseUser(data.user);
                setIsLoggedIn(true);
                setIsDemoMode(false);
                await loadProfile(data.user);
            }

            setLoading(false);
            return { error: null };
        } catch (err: any) {
            setLoading(false);
            return { error: err.message || 'Error de conexión' };
        }
    };

    const logout = async () => {
        if (!isDemoMode && isSupabaseConfigured) {
            await supabase.auth.signOut();
        }
        setIsLoggedIn(false);
        setIsDemoMode(false);
        setSupabaseUser(null);
        setRealProfile(null);
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
                currentRole,
                setCurrentRole: (role) => {
                    setCurrentRole(role);
                },
                isLoggedIn,
                isDemoMode,
                login,
                loginWithEmail,
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
