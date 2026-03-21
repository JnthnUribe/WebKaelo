# WebKaelo — Dashboard Web

Panel de administración y gestión para la plataforma **Kaelo**, una aplicación de rutas ciclistas y turísticas en Yucatán, México. Conecta administradores, comercios locales y creadores de rutas en una sola interfaz.

---

## Roles y funcionalidades

| Rol | Acceso |
|-----|--------|
| **Admin** | Panel general · Gestión de usuarios · Moderación de rutas y comercios · Analytics |
| **Comercio** | Dashboard · Productos · Pedidos · Reseñas · Perfil del negocio · Analytics |
| **Creador** | Mis rutas · Wallet · Analytics |

---

## Stack tecnológico

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Estilos:** Tailwind CSS + shadcn/ui + Radix UI
- **Backend:** Supabase (Auth, PostgreSQL, RLS, Storage)
- **Estado / Data fetching:** TanStack React Query
- **Animaciones:** Framer Motion
- **Gráficas:** Recharts
- **Formularios:** React Hook Form + Zod
- **Tests:** Vitest + Testing Library

---

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables (Layout, RoleSelector, etc.)
├── contexts/         # AuthContext con RBAC y modo demo
├── lib/              # supabaseService — todas las llamadas a Supabase
├── pages/
│   ├── AdminPanel.tsx
│   ├── AdminAnalytics.tsx
│   ├── UserManagement.tsx
│   ├── RouteModeration.tsx
│   ├── BusinessModeration.tsx
│   ├── MerchantDashboard.tsx
│   ├── ProductManagement.tsx
│   ├── OrderManagement.tsx
│   ├── MerchantReviews.tsx
│   ├── BusinessProfile.tsx
│   ├── MerchantAnalytics.tsx
│   ├── MyRoutes.tsx
│   ├── WalletPage.tsx
│   ├── CreatorAnalytics.tsx
│   └── SettingsPage.tsx
└── App.tsx           # Routing con protección por rol
```

---

## Instalación y desarrollo local

**Requisitos:** Node.js 18+ y pnpm (o npm)

```sh
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd WebKaelo

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Iniciar servidor de desarrollo
pnpm dev
```

La app estará disponible en `http://localhost:5173`.

---

## Variables de entorno

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con hot-reload |
| `pnpm build` | Build de producción |
| `pnpm preview` | Preview del build de producción |
| `pnpm test` | Ejecutar tests |
| `pnpm lint` | Linter (ESLint) |

---

## Autenticación y roles

El sistema usa **Supabase Auth** (email/contraseña + Google OAuth). Tras iniciar sesión, el usuario selecciona su rol activo si tiene acceso a más de uno. Las rutas están completamente protegidas por rol — un comercio no puede acceder a rutas de admin ni de creador.

Se incluye un **modo demo** que permite explorar la interfaz sin conexión a Supabase real.

---

## Deploy

1. Ejecutar `pnpm build` para generar la carpeta `dist/`.
2. Subir `dist/` a cualquier hosting estático: Vercel, Netlify, Cloudflare Pages, etc.
3. Configurar las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en la plataforma de deploy.