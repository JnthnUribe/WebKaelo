import { useState } from "react";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { registerBusiness } from "@/lib/supabaseService";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bike, ArrowRight, ArrowLeft, Eye, EyeOff,
    Shield, Store, PenSquare, Mail, Lock, User, MapPin, Clock, Phone, CheckCircle
} from "lucide-react";
import { toast } from "sonner";

type View = "welcome" | "login" | "register" | "register-step2" | "register-success";

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const roles: { key: UserRole; label: string; shortLabel: string; icon: React.ElementType; color: string }[] = [
    { key: "admin", label: "Administrador", shortLabel: "Admin", icon: Shield, color: "bg-violet-500" },
    { key: "comercio", label: "Mi Negocio", shortLabel: "Comercio", icon: Store, color: "bg-accent" },
    { key: "creador", label: "Creador de Rutas", shortLabel: "Creador", icon: PenSquare, color: "bg-primary" },
];

const businessTypes = [
    { value: "restaurante", label: "🍽️ Restaurante" },
    { value: "cafeteria", label: "☕ Cafetería" },
    { value: "taller", label: "🔧 Taller Bicicletas" },
    { value: "tienda", label: "🛒 Tienda" },
    { value: "hospedaje", label: "🏨 Hospedaje" },
    { value: "mercado", label: "🏪 Mercado" },
];

const bgImages = [
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1920&h=1080&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&h=1080&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=1920&h=1080&fit=crop&q=80",
];

const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
};

export default function LoginPage() {
    const { login, loginWithEmail, loading: authLoading } = useAuth();
    const [view, setView] = useState<View>("welcome");
    const [loginLoading, setLoginLoading] = useState(false);
    const [regLoading, setRegLoading] = useState(false);
    const [direction, setDirection] = useState(0);
    const [showPw, setShowPw] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Demo mode only visible via ?demo=true in URL
    const showDemoButtons = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true';
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [bizName, setBizName] = useState("");
    const [bizType, setBizType] = useState("");
    const [bizAddress, setBizAddress] = useState("");
    const [bizSchedule, setBizSchedule] = useState("");

    const nav = (to: View) => {
        const order: View[] = ["welcome", "login", "register", "register-step2", "register-success"];
        setDirection(order.indexOf(to) > order.indexOf(view) ? 1 : -1);
        setView(to);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { toast.error("Completa todos los campos"); return; }

        setLoginLoading(true);
        const result = await loginWithEmail(email, password);
        setLoginLoading(false);

        if (result.error) {
            toast.error(`Error: ${result.error}`, {
                description: "Verifica tus credenciales e intenta de nuevo.",
                duration: 5000,
            });
        } else {
            toast.success("✅ Sesión iniciada correctamente");
        }
    };

    const handleGoogle = () => { toast.info("Google Sign-In próximamente. Usa tu email y contraseña."); };

    const handleRegStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (!regName || !regEmail || !regPassword) { toast.error("Completa los campos obligatorios"); return; }
        nav("register-step2");
    };

    const handleRegSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bizName || !bizType || !bizAddress) { toast.error("Completa la información del negocio"); return; }

        setRegLoading(true);
        const result = await registerBusiness({
            ownerName: regName,
            email: regEmail,
            password: regPassword,
            phone: regPhone || undefined,
            businessName: bizName,
            businessType: bizType,
            address: bizAddress,
            schedule: bizSchedule || undefined,
        });
        setRegLoading(false);

        if (result.error) {
            toast.error(`Error: ${result.error}`);
        } else {
            toast.success("¡Negocio registrado! Inicia sesion para continuar.");
            nav("register-success");
        }
    };

    /* Shared input style */
    const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-black/30 border border-white/30 dark:border-white/10 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 backdrop-blur-sm transition-all";
    const inputCls2 = inputCls.replace("focus:ring-primary/50 focus:border-primary/40", "focus:ring-accent/50 focus:border-accent/40");

    return (
        <div className="min-h-screen h-screen w-full relative flex overflow-hidden">
            {/* ── Background image ──────────────────────── */}
            <div className="absolute inset-0">
                <img src={bgImages[0]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
            </div>

            {/* ── Left branding (hidden on small screens) ── */}
            <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-between p-12">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 rounded-xl bg-primary shadow-lg shadow-primary/30">
                            <Bike className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">Kaelo</span>
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-3">
                        Gestiona tu negocio
                        <br />
                        <span className="text-primary">ciclista desde aquí</span>
                    </h1>
                    <p className="text-white/60 max-w-sm text-base leading-relaxed">
                        Administra pedidos, analiza ventas, modera rutas y monetiza tu contenido desde la plataforma web de Kaelo.
                    </p>
                    <div className="flex gap-8 mt-8">
                        {[{ n: "538", l: "Usuarios" }, { n: "24", l: "Rutas" }, { n: "$148K", l: "Revenue" }].map((s) => (
                            <div key={s.l}>
                                <p className="text-2xl font-bold text-white">{s.n}</p>
                                <p className="text-xs text-white/40">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-white/20 text-xs">Kaelo v1.0 · Yucatán, México</p>
            </div>

            {/* ── Right panel (form card) ────────────────── */}
            <div className="relative z-10 w-full lg:w-[440px] xl:w-[460px] flex items-center justify-center p-4 sm:p-6 lg:p-0">
                <div className="w-full max-w-[400px] lg:max-w-none lg:h-full lg:flex lg:items-center lg:px-10">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-5 lg:hidden">
                        <div className="p-2 rounded-lg bg-primary">
                            <Bike className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Kaelo</span>
                    </div>

                    <div className="w-full">
                        <AnimatePresence mode="wait" custom={direction}>

                            {/* ════════ WELCOME ════════ */}
                            {view === "welcome" && (
                                <motion.div key="welcome" custom={direction} variants={slideVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                                    <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                                        <div className="text-center mb-5">
                                            <h2 className="text-xl font-bold">Bienvenido a Kaelo</h2>
                                            <p className="text-muted-foreground text-sm mt-0.5">¿Qué deseas hacer?</p>
                                        </div>

                                        <div className="space-y-2.5 mb-5">
                                            <button onClick={() => nav("login")}
                                                className="w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all">
                                                <div className="p-2 rounded-lg bg-primary shadow-sm">
                                                    <Lock className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-sm">Iniciar Sesión</p>
                                                    <p className="text-[11px] text-muted-foreground">Email, contraseña o Google</p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                            </button>

                                            <button onClick={() => nav("register")}
                                                className="w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all">
                                                <div className="p-2 rounded-lg bg-accent shadow-sm">
                                                    <Store className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-sm">Registrar mi Negocio</p>
                                                    <p className="text-[11px] text-muted-foreground">Crea una cuenta para tu comercio</p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                            </button>
                                        </div>

                                        {/* Who uses the web */}
                                        <div className="border-t pt-4 mb-4">
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">¿Quién usa la web?</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { icon: Shield, label: "Admin", desc: "Plataforma", c: "text-violet-500 bg-violet-500/10" },
                                                    { icon: Store, label: "Comercio", desc: "Ventas", c: "text-accent bg-accent/10" },
                                                    { icon: PenSquare, label: "Creador", desc: "Rutas", c: "text-primary bg-primary/10" },
                                                ].map((r) => (
                                                    <div key={r.label} className="text-center p-2.5 rounded-lg bg-muted/50">
                                                        <div className={`inline-flex p-1.5 rounded-lg ${r.c} mb-1`}>
                                                            <r.icon className="h-3.5 w-3.5" />
                                                        </div>
                                                        <p className="text-xs font-medium">{r.label}</p>
                                                        <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Demo - only visible via ?demo=true */}
                                        {showDemoButtons && (
                                        <div className="border-t pt-4">
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Demo · acceso rápido</p>
                                            <div className="flex gap-1.5">
                                                {roles.map((r) => (
                                                    <button key={r.key} onClick={() => login(r.key)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-muted/60 hover:bg-muted transition-colors group">
                                                        <div className={`p-0.5 rounded ${r.color}`}><div className="h-2.5 w-2.5" /></div>
                                                        <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{r.shortLabel}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ════════ LOGIN ════════ */}
                            {view === "login" && (
                                <motion.div key="login" custom={direction} variants={slideVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                                    <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                                        <button onClick={() => nav("welcome")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                                            <ArrowLeft className="h-3.5 w-3.5" /> Volver
                                        </button>

                                        <h2 className="text-xl font-bold mb-0.5">Iniciar Sesión</h2>
                                        <p className="text-muted-foreground text-sm mb-5">Usa tus credenciales de Kaelo</p>

                                        {/* Google */}
                                        <button onClick={handleGoogle}
                                            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-border hover:bg-muted/50 transition-colors font-medium text-sm shadow-sm mb-3">
                                            <GoogleIcon /> Continuar con Google
                                        </button>

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex-1 h-px bg-border" />
                                            <span className="text-[11px] text-muted-foreground">o con email</span>
                                            <div className="flex-1 h-px bg-border" />
                                        </div>

                                        <form onSubmit={handleLogin} className="space-y-3">
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="tu@email.com" className={inputCls} />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••" className={inputCls + " pr-10"} />
                                                <button type="button" onClick={() => setShowPw(!showPw)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <label className="flex items-center gap-1.5 text-muted-foreground">
                                                    <input type="checkbox" className="rounded border-border" /> Recordarme
                                                </label>
                                                <button type="button" className="text-primary hover:text-primary-hover text-xs font-medium transition-colors">
                                                    ¿Olvidaste tu contraseña?
                                                </button>
                                            </div>

                                            <button type="submit" disabled={loginLoading}
                                                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-60">
                                                {loginLoading ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin" /> Conectando...</>
                                                ) : (
                                                    <>Iniciar Sesión <ArrowRight className="h-4 w-4" /></>
                                                )}
                                            </button>
                                        </form>

                                        {/* Mobile link */}
                                        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                                            <div className="flex items-start gap-2">
                                                <Bike className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-medium text-primary">¿Ya usas Kaelo en tu celular?</p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                                        Inicia sesión con las mismas credenciales. Tu cuenta se vincula automáticamente.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-center text-sm text-muted-foreground mt-4">
                                            ¿Tienes un negocio?{" "}
                                            <button onClick={() => nav("register")} className="text-accent hover:text-accent/80 font-medium transition-colors">
                                                Regístralo aquí
                                            </button>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ════════ REGISTER STEP 1 ════════ */}
                            {view === "register" && (
                                <motion.div key="register" custom={direction} variants={slideVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                                    <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                                        <button onClick={() => nav("welcome")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                                            <ArrowLeft className="h-3.5 w-3.5" /> Volver
                                        </button>

                                        {/* Steps */}
                                        <div className="flex items-center gap-2 mb-5">
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-7 w-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">1</div>
                                                <span className="text-xs font-medium">Tu cuenta</span>
                                            </div>
                                            <div className="flex-1 h-px bg-border" />
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</div>
                                                <span className="text-xs">Negocio</span>
                                            </div>
                                        </div>

                                        <h2 className="text-lg font-bold mb-0.5">Registra tu Negocio</h2>
                                        <p className="text-muted-foreground text-sm mb-4">Paso 1: Tu información personal</p>

                                        <form onSubmit={handleRegStep1} className="space-y-3">
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                                                    placeholder="Nombre completo *" className={inputCls2} />
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                                                    placeholder="Email *" className={inputCls2} />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                                                    placeholder="Contraseña (mín. 8 caracteres) *" className={inputCls2} />
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                                                    placeholder="WhatsApp (opcional)" className={inputCls2} />
                                            </div>

                                            <button type="submit"
                                                className="w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-accent/20">
                                                Siguiente: Mi Negocio <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </form>

                                        <p className="text-center text-sm text-muted-foreground mt-4">
                                            ¿Ya tienes cuenta?{" "}
                                            <button onClick={() => nav("login")} className="text-primary font-medium hover:text-primary-hover transition-colors">Inicia sesión</button>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ════════ REGISTER STEP 2 ════════ */}
                            {view === "register-step2" && (
                                <motion.div key="reg2" custom={direction} variants={slideVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                                    <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
                                        <button onClick={() => nav("register")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                                            <ArrowLeft className="h-3.5 w-3.5" /> Paso anterior
                                        </button>

                                        {/* Steps */}
                                        <div className="flex items-center gap-2 mb-5">
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-7 w-7 rounded-full bg-success text-white flex items-center justify-center"><CheckCircle className="h-3.5 w-3.5" /></div>
                                                <span className="text-xs text-success font-medium">Cuenta</span>
                                            </div>
                                            <div className="flex-1 h-px bg-accent/30" />
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-7 w-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">2</div>
                                                <span className="text-xs font-medium">Negocio</span>
                                            </div>
                                        </div>

                                        <h2 className="text-lg font-bold mb-0.5">Tu Negocio</h2>
                                        <p className="text-muted-foreground text-sm mb-4">Paso 2: Información del comercio</p>

                                        <form onSubmit={handleRegSubmit} className="space-y-3">
                                            <div className="relative">
                                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)}
                                                    placeholder="Nombre del negocio *" className={inputCls2} />
                                            </div>

                                            {/* Business type grid */}
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground mb-2">Tipo de negocio *</p>
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    {businessTypes.map((t) => (
                                                        <button key={t.value} type="button" onClick={() => setBizType(t.value)}
                                                            className={`px-2 py-2 rounded-lg text-center transition-all text-xs font-medium ${bizType === t.value
                                                                ? "bg-accent/15 border-accent/50 border text-accent"
                                                                : "bg-muted/50 border border-transparent hover:bg-muted"
                                                                }`}>
                                                            {t.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="text" value={bizAddress} onChange={(e) => setBizAddress(e.target.value)}
                                                    placeholder="Dirección completa *" className={inputCls2} />
                                            </div>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                <input type="text" value={bizSchedule} onChange={(e) => setBizSchedule(e.target.value)}
                                                    placeholder="Horario (ej: Lun-Vie 8am-6pm)" className={inputCls2} />
                                            </div>

                                            <button type="submit" disabled={regLoading}
                                                className="w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-accent/20 disabled:opacity-60">
                                                {regLoading ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin" /> Registrando negocio...</>
                                                ) : (
                                                    <>Enviar Solicitud <ArrowRight className="h-4 w-4" /></>
                                                )}
                                            </button>
                                        </form>

                                        <p className="mt-3 text-[11px] text-muted-foreground text-center">
                                            ⏱️ Tu solicitud será revisada en 24-48 horas
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ════════ REGISTER SUCCESS ════════ */}
                            {view === "register-success" && (
                                <motion.div key="success" custom={direction} variants={slideVariants}
                                    initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                                    <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 text-center">
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.15 }}
                                            className="inline-flex p-3 rounded-full bg-success/10 mb-3">
                                            <CheckCircle className="h-10 w-10 text-success" />
                                        </motion.div>

                                        <h2 className="text-xl font-bold mb-1">¡Solicitud Enviada!</h2>
                                        <p className="text-muted-foreground text-sm mb-5 max-w-[280px] mx-auto">
                                            <strong>{bizName || "Tu negocio"}</strong> está pendiente de aprobación. Te notificaremos por email.
                                        </p>

                                        <div className="bg-muted/50 rounded-xl p-3.5 mb-5 text-left text-sm space-y-1.5">
                                            <div className="flex justify-between"><span className="text-muted-foreground">Negocio</span><span className="font-medium">{bizName || "—"}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className="font-medium capitalize">{bizType || "—"}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Propietario</span><span className="font-medium">{regName || "—"}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Estado</span><span className="text-warning font-medium">⏳ Pendiente</span></div>
                                        </div>

                                        <button onClick={() => nav("login")}
                                            className="w-full py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-all shadow-md shadow-accent/20 mb-2">
                                            Iniciar Sesión →
                                        </button>
                                        <button onClick={() => nav("welcome")}
                                            className="w-full py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                                            Volver al inicio
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
