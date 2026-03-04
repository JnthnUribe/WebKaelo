# 📋 Documentación Técnica - Base de Datos Avanzada

## Proyecto: KAELO - Plataforma de Cicloturismo y Comercio Local

**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Materia:** Base de Datos Avanzada

---

## 1. IDENTIDAD DEL PROYECTO

### 1.1 Nombre Oficial

**KAELO** - Sistema de Gestión de Rutas Ciclistas y Comercio Local para Yucatán

### 1.2 Objetivo General

Desarrollar e implementar una plataforma móvil integral que permita **conectar ciclistas con rutas documentadas y comercios locales** en la región de Yucatán, facilitando el descubrimiento de trayectos, la pre-ordenación de productos en establecimientos ubicados a lo largo de las rutas, y la monetización de contenido por parte de creadores de rutas, mediante un sistema de base de datos relacional con extensiones geoespaciales que soporte operaciones en tiempo real, sincronización offline y procesamiento de transacciones financieras.

### 1.3 Beneficios Clave

| # | Beneficio | Descripción Técnica |
|---|-----------|---------------------|
| **1** | **Eliminación del Discovery Gap** | Centraliza información de rutas ciclistas en una base de datos geoespacial con PostGIS, permitiendo consultas espaciales eficientes para descubrir rutas cercanas, filtrar por dificultad y calcular distancias con índices GIST optimizados. |
| **2** | **Sistema de Pre-Órdenes Transaccional** | Implementa un sistema de pedidos anticipados con integridad referencial, máquinas de estado para tracking de órdenes, y conciliación automática de pagos con comisiones calculadas mediante triggers y funciones almacenadas. |
| **3** | **Monetización Multi-Actor** | Provee un modelo de datos que soporta tres flujos de ingresos (venta de rutas premium, comisiones por órdenes, segmentos patrocinados) con auditoría completa de transacciones, wallet digital para creadores, y políticas RLS para aislamiento de datos por tenant. |

---

## 2. ALCANCE TÉCNICO

### 2.1 Stack Tecnológico

#### Frontend (Aplicación Móvil)

| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| Framework | React Native | 0.81.5 | Desarrollo cross-platform iOS/Android |
| Plataforma | Expo SDK | 54.0.33 | Build system y OTA updates |
| Navegación | Expo Router | 6.0.23 | File-based routing |
| Estado Global | Zustand | 5.0.11 | Lightweight state management |
| Cache/API | TanStack Query | 5.90.20 | Server state + optimistic updates |
| Mapas | @rnmapbox/maps | 10.2.10 | Mapbox GL Native |
| Validación | Zod | 4.3.6 | Schema validation |
| Storage Offline | AsyncStorage | 2.2.0 | Persistencia local |

#### Backend (Serverless BaaS)

| Componente | Tecnología | Características |
|------------|------------|-----------------|
| Base de Datos | PostgreSQL 15 | RDBMS principal con ACID compliance |
| Extensión Geoespacial | PostGIS | Tipos GEOMETRY, índices GIST, funciones ST_* |
| API REST | Supabase PostgREST | Auto-generated REST API desde schema |
| Autenticación | Supabase Auth | JWT-based, OAuth providers |
| Realtime | Supabase Realtime | WebSocket subscriptions |
| Storage | Supabase Storage | S3-compatible object storage |
| Edge Functions | Deno Runtime | Serverless functions para lógica custom |

#### Servicios Externos

| Servicio | Proveedor | Uso |
|----------|-----------|-----|
| Mapas y Geocoding | Mapbox | Tiles, direcciones, routing |
| Pagos Online | Stripe | Checkout, refunds, payouts |
| Pagos Locales | MercadoPago | Fallback para México |
| Monitoreo | Sentry | Error tracking, performance |
| CI/CD | GitHub Actions + EAS | Builds automatizados |

---

### 2.2 Módulos Principales del Sistema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        KAELO - ARQUITECTURA MODULAR                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   MÓDULO AUTH   │  │  MÓDULO RUTAS   │  │ MÓDULO NEGOCIOS │         │
│  │                 │  │                 │  │                 │         │
│  │ • Login/Logout  │  │ • CRUD Rutas    │  │ • Perfil Negocio│         │
│  │ • Registro      │  │ • Waypoints     │  │ • Inventario    │         │
│  │ • Perfiles      │  │ • Búsqueda Geo  │  │ • Horarios      │         │
│  │ • Sesiones JWT  │  │ • Navegación GPS│  │ • Productos     │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ MÓDULO ÓRDENES  │  │  MÓDULO PAGOS   │  │ MÓDULO WALLET   │         │
│  │                 │  │                 │  │                 │         │
│  │ • Pre-órdenes   │  │ • Stripe/MP     │  │ • Balance       │         │
│  │ • Carrito       │  │ • Comisiones    │  │ • Transacciones │         │
│  │ • Estado orden  │  │ • Refunds       │  │ • Retiros       │         │
│  │ • Historial     │  │ • Split Payment │  │ • Earnings      │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │MÓDULO MÉTRICAS  │  │ MÓDULO REVIEWS  │  │MÓDULO NOTIFICA. │         │
│  │                 │  │                 │  │                 │         │
│  │ • Tracking GPS  │  │ • Calificaciones│  │ • Push Notifs   │         │
│  │ • Achievements  │  │ • Comentarios   │  │ • In-App Alerts │         │
│  │ • Leaderboards  │  │ • Moderación    │  │ • Orden Status  │         │
│  │ • Stats Monthly │  │ • Fotos Reviews │  │ • Realtime      │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐                              │
│  │MÓDULO CUPONES   │  │ MÓDULO CREADOR  │                              │
│  │                 │  │                 │                              │
│  │ • Gamificación  │  │ • Dashboard     │                              │
│  │ • Sponsored Seg │  │ • Analytics     │                              │
│  │ • Unlock Rewards│  │ • Rutas Premium │                              │
│  │ • Descuentos    │  │ • Earnings      │                              │
│  └─────────────────┘  └─────────────────┘                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Descripción de Módulos

| Módulo | Responsabilidad | Tablas Principales |
|--------|-----------------|-------------------|
| **AUTH** | Autenticación, autorización, gestión de perfiles de usuario | `profiles`, `auth.users` |
| **RUTAS** | CRUD de rutas ciclistas, waypoints, búsquedas geoespaciales | `routes`, `route_waypoints`, `saved_routes` |
| **NEGOCIOS** | Perfiles de comercios, inventario de productos, horarios | `businesses`, `products` |
| **ÓRDENES** | Sistema de pre-órdenes, carrito, tracking de estado | `orders`, `order_items` |
| **PAGOS** | Procesamiento de pagos, cálculo de comisiones | `route_purchases`, `orders` |
| **WALLET** | Balance de creadores, historial de transacciones | `profiles.wallet_balance`, triggers |
| **MÉTRICAS** | Tracking de actividad, achievements, estadísticas | `route_completions`, `user_achievements`, `user_stats_monthly` |
| **REVIEWS** | Sistema de calificaciones para rutas y negocios | `reviews` |
| **NOTIFICACIONES** | Alertas en tiempo real, push notifications | `notifications` |
| **CUPONES** | Gamificación, segmentos patrocinados, descuentos | `business_coupons`, `unlocked_coupons`, `sponsored_segments` |
| **CREADOR** | Dashboard de analytics, gestión de rutas premium | `routes`, `route_purchases` |

---

## 3. MODELO DE DATOS

### 3.1 Diagrama Entidad-Relación (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMA ENTIDAD-RELACIÓN                             │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │   PROFILES   │
                                    │──────────────│
                                    │ PK: id       │
                                    │ email        │
                                    │ full_name    │
                                    │ wallet_balance│
                                    │ is_creator   │
                                    └──────┬───────┘
                                           │
           ┌───────────────┬───────────────┼───────────────┬───────────────┐
           │               │               │               │               │
           ▼               ▼               ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
    │   ROUTES   │  │ BUSINESSES │  │   ORDERS   │  │  REVIEWS   │  │USER_ACHIEV.│
    │────────────│  │────────────│  │────────────│  │────────────│  │────────────│
    │ PK: id     │  │ PK: id     │  │ PK: id     │  │ PK: id     │  │ PK: id     │
    │ FK:creator │  │ FK:owner   │  │ FK:customer│  │ FK:user    │  │ FK:user    │
    │ name       │  │ name       │  │ FK:business│  │ FK:route   │  │ type       │
    │ route_path │  │ location   │  │ total      │  │ FK:business│  │ progress   │
    │ price      │  │ status     │  │ status     │  │ rating     │  │ unlocked   │
    └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └────────────┘  └────────────┘
          │               │               │
          │               │               │
          ▼               ▼               ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │ROUTE_WAYPNT │ │  PRODUCTS   │ │ ORDER_ITEMS │
   │─────────────│ │─────────────│ │─────────────│
   │ PK: id      │ │ PK: id      │ │ PK: id      │
   │ FK: route   │ │ FK:business │ │ FK: order   │
   │ location    │ │ name        │ │ FK: product │
   │ waypoint_typ│ │ price       │ │ quantity    │
   └─────────────┘ └─────────────┘ └─────────────┘

   ┌─────────────────────────────────────────────────────────────┐
   │                    TABLAS ADICIONALES                       │
   ├─────────────────────────────────────────────────────────────┤
   │ ROUTE_BUSINESSES    - M:N entre rutas y negocios            │
   │ ROUTE_PURCHASES     - Compras de rutas premium              │
   │ ROUTE_COMPLETIONS   - Tracking de rutas completadas         │
   │ SAVED_ROUTES        - Rutas favoritas                       │
   │ NOTIFICATIONS       - Sistema de notificaciones             │
   │ BUSINESS_COUPONS    - Cupones de descuento                  │
   │ UNLOCKED_COUPONS    - Cupones desbloqueados por usuarios    │
   │ SPONSORED_SEGMENTS  - Segmentos patrocinados                │
   │ USER_GOALS          - Objetivos personales                  │
   │ USER_PERSONAL_RECS  - Récords personales                    │
   │ USER_STATS_MONTHLY  - Estadísticas mensuales agregadas      │
   └─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Lista Completa de Entidades (22 Tablas)

#### 3.2.1 **PROFILES** (Perfiles de Usuario)

> Extiende la tabla `auth.users` de Supabase con información adicional del perfil.

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users | Identificador único del usuario |
| `email` | TEXT | UNIQUE, NOT NULL | Correo electrónico |
| `full_name` | TEXT | NULL | Nombre completo |
| `avatar_url` | TEXT | NULL | URL de foto de perfil |
| `phone` | TEXT | NULL | Teléfono de contacto |
| `bio` | TEXT | NULL | Biografía del usuario |
| `wallet_balance` | NUMERIC(10,2) | DEFAULT 0.00 | Balance del wallet digital |
| `is_creator` | BOOLEAN | DEFAULT FALSE | ¿Es creador de rutas? |
| `is_business_owner` | BOOLEAN | DEFAULT FALSE | ¿Es dueño de negocio? |
| `creator_rating` | NUMERIC(3,2) | DEFAULT 0.00 | Calificación como creador |
| `total_routes_sold` | INTEGER | DEFAULT 0 | Total de rutas vendidas |
| `total_earnings` | NUMERIC(10,2) | DEFAULT 0.00 | Ganancias totales históricas |
| `preferences` | JSONB | DEFAULT '{}' | Preferencias (nivel ciclismo, dieta) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

---

#### 3.2.2 **ROUTES** (Rutas Ciclistas)

> Rutas de ciclismo con datos geoespaciales usando PostGIS.

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identificador único |
| `creator_id` | UUID | REFERENCES profiles(id) | Creador de la ruta |
| `name` | TEXT | NOT NULL | Nombre de la ruta |
| `description` | TEXT | NULL | Descripción detallada |
| `slug` | TEXT | UNIQUE, NOT NULL | URL amigable |
| `route_path` | GEOMETRY(LineString, 4326) | NULL | Trayecto de la ruta (PostGIS) |
| `start_point` | GEOMETRY(Point, 4326) | NULL | Punto de inicio |
| `end_point` | GEOMETRY(Point, 4326) | NULL | Punto de fin |
| `distance_km` | NUMERIC(6,2) | NOT NULL | Distancia en kilómetros |
| `elevation_gain_m` | INTEGER | DEFAULT 0 | Ganancia de elevación en metros |
| `estimated_duration_min` | INTEGER | NULL | Duración estimada en minutos |
| `difficulty` | TEXT | CHECK IN ('facil','moderada','dificil','experto'), DEFAULT 'moderada' | Nivel de dificultad |
| `terrain_type` | TEXT | CHECK IN ('asfalto','terraceria','mixto'), DEFAULT 'asfalto' | Tipo de terreno |
| `status` | TEXT | CHECK IN ('borrador','en_revision','publicado','rechazado','archivado'), DEFAULT 'borrador' | Estado de publicación |
| `price` | NUMERIC(8,2) | DEFAULT 0.00 | Precio (0 = gratis) |
| `is_free` | BOOLEAN | DEFAULT TRUE | ¿Es gratuita? |
| `cover_image_url` | TEXT | NULL | Imagen de portada |
| `photos` | JSONB | DEFAULT '[]' | Array de URLs de fotos |
| `tags` | JSONB | DEFAULT '[]' | Etiquetas (naturaleza, cenotes, etc.) |
| `municipality` | TEXT | NULL | Municipio |
| `purchase_count` | INTEGER | DEFAULT 0 | Número de compras |
| `view_count` | INTEGER | DEFAULT 0 | Número de visualizaciones |
| `average_rating` | NUMERIC(3,2) | DEFAULT 0.00 | Calificación promedio |
| `total_reviews` | INTEGER | DEFAULT 0 | Total de reseñas |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |
| `published_at` | TIMESTAMPTZ | NULL | Fecha de publicación |

---

#### 3.2.3 **ROUTE_WAYPOINTS** (Puntos de Interés en Rutas)

> Waypoints a lo largo de las rutas (cenotes, restaurantes, miradores, etc.).

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `route_id` | UUID | REFERENCES routes(id) ON DELETE CASCADE | Ruta a la que pertenece |
| `location` | GEOMETRY(Point, 4326) | NOT NULL | Ubicación geoespacial |
| `name` | TEXT | NOT NULL | Nombre del punto |
| `description` | TEXT | NULL | Descripción |
| `waypoint_type` | TEXT | CHECK IN ('inicio','fin','cenote','zona_arqueologica','mirador','restaurante','tienda','taller_bicicletas','descanso','punto_agua','peligro','foto','otro'), DEFAULT 'otro' | Tipo de waypoint |
| `image_url` | TEXT | NULL | Imagen del punto |
| `order_index` | INTEGER | DEFAULT 0 | Orden en la ruta |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

---

#### 3.2.4 **BUSINESSES** (Comercios Locales)

> Negocios registrados en la plataforma.

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `owner_id` | UUID | REFERENCES profiles(id) | Propietario del negocio |
| `name` | TEXT | NOT NULL | Nombre del negocio |
| `slug` | TEXT | UNIQUE, NOT NULL | URL amigable |
| `description` | TEXT | NULL | Descripción |
| `location` | GEOMETRY(Point, 4326) | NOT NULL | Ubicación geoespacial |
| `address` | TEXT | NOT NULL | Dirección física |
| `municipality` | TEXT | NULL | Municipio |
| `phone` | TEXT | NULL | Teléfono |
| `email` | TEXT | NULL | Correo electrónico |
| `website` | TEXT | NULL | Sitio web |
| `whatsapp` | TEXT | NULL | WhatsApp |
| `business_hours` | JSONB | DEFAULT '{}' | Horarios por día |
| `business_type` | TEXT | CHECK IN ('restaurante','cafeteria','tienda','taller_bicicletas','hospedaje','tienda_conveniencia','mercado','otro'), DEFAULT 'tienda' | Tipo de negocio |
| `cover_image_url` | TEXT | NULL | Imagen de portada |
| `logo_url` | TEXT | NULL | Logo del negocio |
| `photos` | JSONB | DEFAULT '[]' | Fotos adicionales |
| `status` | TEXT | CHECK IN ('pendiente','activo','pausado','rechazado'), DEFAULT 'pendiente' | Estado del negocio |
| `accepts_advance_orders` | BOOLEAN | DEFAULT TRUE | ¿Acepta pre-órdenes? |
| `minimum_order_amount` | NUMERIC(8,2) | DEFAULT 0.00 | Monto mínimo de orden |
| `advance_order_hours` | INTEGER | DEFAULT 2 | Horas de anticipación requeridas |
| `average_rating` | NUMERIC(3,2) | DEFAULT 0.00 | Calificación promedio |
| `total_reviews` | INTEGER | DEFAULT 0 | Total de reseñas |
| `total_orders` | INTEGER | DEFAULT 0 | Total de órdenes |
| `commission_rate` | NUMERIC(4,2) | DEFAULT 10.00 | Tasa de comisión (%) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

---

#### 3.2.5 **PRODUCTS** (Productos de Comercios)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `business_id` | UUID | REFERENCES businesses(id) ON DELETE CASCADE | Negocio propietario |
| `name` | TEXT | NOT NULL | Nombre del producto |
| `description` | TEXT | NULL | Descripción |
| `price` | NUMERIC(8,2) | NOT NULL, CHECK (price >= 0) | Precio unitario |
| `category` | TEXT | CHECK IN ('bebidas','alimentos','snacks','reparaciones','refacciones','accesorios','servicios','otro'), DEFAULT 'otro' | Categoría |
| `image_url` | TEXT | NULL | Imagen del producto |
| `is_available` | BOOLEAN | DEFAULT TRUE | ¿Está disponible? |
| `stock_quantity` | INTEGER | NULL | Cantidad en stock |
| `is_cyclist_special` | BOOLEAN | DEFAULT FALSE | ¿Es especial para ciclistas? |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

---

#### 3.2.6 **ORDERS** (Órdenes/Pre-Órdenes)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `customer_id` | UUID | REFERENCES profiles(id) | Cliente que ordena |
| `business_id` | UUID | REFERENCES businesses(id) | Negocio receptor |
| `route_id` | UUID | REFERENCES routes(id), NULL | Ruta asociada (opcional) |
| `order_number` | TEXT | UNIQUE, NOT NULL | Número de orden legible |
| `status` | TEXT | CHECK IN ('pendiente','confirmado','preparando','listo','entregado','cancelado'), DEFAULT 'pendiente' | Estado de la orden |
| `subtotal` | NUMERIC(10,2) | NOT NULL | Subtotal antes de comisión |
| `platform_fee` | NUMERIC(10,2) | NOT NULL | Comisión de la plataforma |
| `total` | NUMERIC(10,2) | NOT NULL | Total final |
| `estimated_pickup_time` | TIMESTAMPTZ | NOT NULL | Hora estimada de recogida |
| `actual_pickup_time` | TIMESTAMPTZ | NULL | Hora real de recogida |
| `notes` | TEXT | NULL | Notas del cliente |
| `payment_method` | TEXT | CHECK IN ('tarjeta','efectivo','wallet'), DEFAULT 'efectivo' | Método de pago |
| `payment_status` | TEXT | CHECK IN ('pendiente','pagado','reembolsado','fallido'), DEFAULT 'pendiente' | Estado del pago |
| `stripe_payment_id` | TEXT | NULL | ID de transacción Stripe |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

---

#### 3.2.7 **ORDER_ITEMS** (Líneas de Orden)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `order_id` | UUID | REFERENCES orders(id) ON DELETE CASCADE | Orden padre |
| `product_id` | UUID | REFERENCES products(id) | Producto ordenado |
| `quantity` | INTEGER | NOT NULL, CHECK (quantity > 0) | Cantidad |
| `unit_price` | NUMERIC(8,2) | NOT NULL | Precio unitario al momento |
| `total_price` | NUMERIC(8,2) | NOT NULL | Precio total de la línea |
| `notes` | TEXT | NULL | Notas especiales |

---

#### 3.2.8 **ROUTE_PURCHASES** (Compras de Rutas Premium)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `route_id` | UUID | REFERENCES routes(id) | Ruta comprada |
| `buyer_id` | UUID | REFERENCES profiles(id) | Comprador |
| `amount_paid` | NUMERIC(8,2) | NOT NULL | Monto pagado |
| `creator_earnings` | NUMERIC(8,2) | NOT NULL | Ganancia del creador (85%) |
| `platform_fee` | NUMERIC(8,2) | NOT NULL | Comisión plataforma (15%) |
| `payment_status` | TEXT | CHECK IN ('pendiente','completado','reembolsado','fallido'), DEFAULT 'pendiente' | Estado |
| `stripe_payment_id` | TEXT | NULL | ID de Stripe |
| `refund_requested_at` | TIMESTAMPTZ | NULL | Fecha solicitud reembolso |
| `refund_reason` | TEXT | NULL | Razón del reembolso |
| `refunded_at` | TIMESTAMPTZ | NULL | Fecha de reembolso |
| `purchased_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de compra |

---

#### 3.2.9 **REVIEWS** (Reseñas Unificadas)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Autor de la reseña |
| `route_id` | UUID | REFERENCES routes(id), NULL | Ruta reseñada (opcional) |
| `business_id` | UUID | REFERENCES businesses(id), NULL | Negocio reseñado (opcional) |
| `rating` | INTEGER | NOT NULL, CHECK (rating BETWEEN 1 AND 5) | Calificación 1-5 estrellas |
| `comment` | TEXT | NULL | Comentario |
| `photos` | JSONB | DEFAULT '[]' | Fotos de la reseña |
| `review_type` | TEXT | NOT NULL, CHECK IN ('ruta','comercio') | Tipo de reseña |
| `status` | TEXT | CHECK IN ('pendiente','aprobado','rechazado'), DEFAULT 'aprobado' | Estado moderación |
| `purchase_id` | UUID | REFERENCES route_purchases(id), NULL | Compra verificada |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

---

#### 3.2.10 **ROUTE_BUSINESSES** (Relación Rutas-Negocios)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `route_id` | UUID | REFERENCES routes(id) ON DELETE CASCADE | Ruta |
| `business_id` | UUID | REFERENCES businesses(id) ON DELETE CASCADE | Negocio |
| `distance_from_route_m` | INTEGER | NULL | Distancia del negocio a la ruta en metros |
| `order_index` | INTEGER | DEFAULT 0 | Orden de aparición |
| `notes` | TEXT | NULL | Notas |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| **UNIQUE** | (route_id, business_id) | | Un negocio solo aparece una vez por ruta |

---

#### 3.2.11 **SAVED_ROUTES** (Rutas Guardadas/Favoritas)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Usuario |
| `route_id` | UUID | REFERENCES routes(id) | Ruta guardada |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de guardado |
| **UNIQUE** | (user_id, route_id) | | Evita duplicados |

---

#### 3.2.12 **ROUTE_COMPLETIONS** (Rutas Completadas - Tracking)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Usuario |
| `route_id` | UUID | REFERENCES routes(id) | Ruta realizada |
| `recorded_path` | GEOMETRY(LineString, 4326) | NULL | Track GPS real grabado |
| `duration_min` | INTEGER | NULL | Duración en minutos |
| `started_at` | TIMESTAMPTZ | NOT NULL | Inicio de la actividad |
| `completed_at` | TIMESTAMPTZ | NULL | Fin de la actividad |
| `status` | TEXT | CHECK IN ('en_progreso','completado','abandonado'), DEFAULT 'en_progreso' | Estado |
| `notes` | TEXT | NULL | Notas del usuario |
| `distance_actual_km` | NUMERIC(6,2) | NULL | Distancia real recorrida |
| `avg_speed_kmh` | NUMERIC(4,1) | NULL | Velocidad promedio |
| `max_speed_kmh` | NUMERIC(4,1) | NULL | Velocidad máxima |
| `calories_burned` | INTEGER | NULL | Calorías quemadas |
| `elevation_gain_actual_m` | INTEGER | NULL | Elevación ganada real |
| `weather_conditions` | JSONB | DEFAULT '{}' | Condiciones climáticas |
| `device_info` | JSONB | DEFAULT '{}' | Info del dispositivo |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

---

#### 3.2.13 **NOTIFICATIONS** (Notificaciones)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Destinatario |
| `title` | TEXT | NOT NULL | Título |
| `body` | TEXT | NOT NULL | Contenido |
| `notification_type` | TEXT | NOT NULL, CHECK IN ('orden_recibida','orden_lista','ruta_comprada','ruta_vendida','nueva_resena','pago_recibido','comercio_aprobado','ruta_aprobada','sistema') | Tipo |
| `related_route_id` | UUID | REFERENCES routes(id), NULL | Ruta relacionada |
| `related_order_id` | UUID | REFERENCES orders(id), NULL | Orden relacionada |
| `related_business_id` | UUID | REFERENCES businesses(id), NULL | Negocio relacionado |
| `is_read` | BOOLEAN | DEFAULT FALSE | ¿Leída? |
| `read_at` | TIMESTAMPTZ | NULL | Fecha de lectura |
| `data` | JSONB | DEFAULT '{}' | Payload adicional |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

---

#### 3.2.14 **BUSINESS_COUPONS** (Cupones de Negocio)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `business_id` | UUID | REFERENCES businesses(id) | Negocio emisor |
| `code` | TEXT | NOT NULL | Código del cupón |
| `description` | TEXT | NULL | Descripción |
| `discount_type` | TEXT | NOT NULL, CHECK IN ('porcentaje','monto_fijo') | Tipo de descuento |
| `discount_value` | NUMERIC(8,2) | NOT NULL | Valor del descuento |
| `minimum_purchase` | NUMERIC(8,2) | DEFAULT 0 | Compra mínima requerida |
| `max_uses` | INTEGER | NULL | Máximo de usos totales |
| `current_uses` | INTEGER | DEFAULT 0 | Usos actuales |
| `starts_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de inicio |
| `expires_at` | TIMESTAMPTZ | NULL | Fecha de expiración |
| `is_active` | BOOLEAN | DEFAULT TRUE | ¿Activo? |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

---

#### 3.2.15 **UNLOCKED_COUPONS** (Cupones Desbloqueados)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Usuario |
| `coupon_id` | UUID | REFERENCES business_coupons(id) | Cupón desbloqueado |
| `unlock_reason` | TEXT | NOT NULL, CHECK IN ('ruta_completada','segmento_completado','primer_pedido','referido','promocion') | Razón de desbloqueo |
| `route_completion_id` | UUID | REFERENCES route_completions(id), NULL | Completion que desbloqueó |
| `is_used` | BOOLEAN | DEFAULT FALSE | ¿Usado? |
| `used_at` | TIMESTAMPTZ | NULL | Fecha de uso |
| `used_in_order_id` | UUID | REFERENCES orders(id), NULL | Orden donde se usó |
| `unlocked_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de desbloqueo |
| `expires_at` | TIMESTAMPTZ | NULL | Fecha de expiración |

---

#### 3.2.16 **SPONSORED_SEGMENTS** (Segmentos Patrocinados)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `business_id` | UUID | REFERENCES businesses(id) | Negocio patrocinador |
| `route_id` | UUID | REFERENCES routes(id) | Ruta donde aparece |
| `segment_start_index` | INTEGER | NOT NULL | Índice de inicio del segmento |
| `segment_end_index` | INTEGER | NOT NULL | Índice de fin del segmento |
| `segment_path` | GEOMETRY(LineString, 4326) | NULL | Trayecto del segmento |
| `coupon_id` | UUID | REFERENCES business_coupons(id), NULL | Cupón asociado |
| `reward_message` | TEXT | NULL | Mensaje de recompensa |
| `is_active` | BOOLEAN | DEFAULT TRUE | ¿Activo? |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `expires_at` | TIMESTAMPTZ | NULL | Fecha de expiración |

---

#### 3.2.17 **USER_ACHIEVEMENTS** (Logros de Usuario)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Usuario |
| `achievement_type` | TEXT | NOT NULL | Tipo de logro |
| `progress_current` | INTEGER | DEFAULT 0 | Progreso actual |
| `progress_target` | INTEGER | NOT NULL | Meta para desbloquear |
| `is_unlocked` | BOOLEAN | DEFAULT FALSE | ¿Desbloqueado? |
| `points_awarded` | INTEGER | DEFAULT 0 | Puntos otorgados |
| `badge_icon` | TEXT | NULL | Icono de la insignia |
| `metadata` | JSONB | DEFAULT '{}' | Datos adicionales |
| `unlocked_at` | TIMESTAMPTZ | NULL | Fecha de desbloqueo |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| **UNIQUE** | (user_id, achievement_type) | | Un logro por tipo por usuario |

---

#### 3.2.18 **USER_GOALS** (Objetivos Personales)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Usuario |
| `goal_type` | TEXT | NOT NULL | Tipo de objetivo |
| `title` | TEXT | NOT NULL | Título del objetivo |
| `description` | TEXT | NULL | Descripción |
| `target_value` | NUMERIC(10,2) | NOT NULL | Valor meta |
| `current_value` | NUMERIC(10,2) | DEFAULT 0 | Valor actual |
| `unit` | TEXT | NOT NULL | Unidad (km, min, etc.) |
| `status` | TEXT | DEFAULT 'active' | Estado del objetivo |
| `deadline` | TIMESTAMPTZ | NULL | Fecha límite |
| `reward_points` | INTEGER | DEFAULT 0 | Puntos de recompensa |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

---

#### 3.2.19 **USER_PERSONAL_RECORDS** (Récords Personales)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) | Usuario |
| `route_id` | UUID | REFERENCES routes(id) | Ruta del récord |
| `completion_id` | UUID | REFERENCES route_completions(id) | Completion que logró el récord |
| `record_type` | TEXT | NOT NULL | Tipo de récord |
| `best_time_min` | INTEGER | NULL | Mejor tiempo |
| `best_avg_speed_kmh` | NUMERIC(4,1) | NULL | Mejor velocidad promedio |
| `best_distance_km` | NUMERIC(6,2) | NULL | Mayor distancia |
| `previous_record_id` | UUID | REFERENCES user_personal_records(id), NULL | Récord anterior superado |
| `improvement_percentage` | NUMERIC(5,2) | NULL | Porcentaje de mejora |
| `achieved_at` | TIMESTAMPTZ | NOT NULL | Fecha del récord |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| **UNIQUE** | (user_id, route_id, record_type) | | Un récord por tipo por ruta por usuario |

---

#### 3.2.20 **USER_STATS_MONTHLY** (Estadísticas Mensuales)

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | REFERENCES profiles(id) ON DELETE CASCADE | Usuario |
| `year` | INTEGER | NOT NULL, CHECK (2026-2100) | Año |
| `month` | INTEGER | NOT NULL, CHECK (1-12) | Mes |
| `total_distance_km` | NUMERIC(10,2) | DEFAULT 0, CHECK >= 0 | Distancia total del mes |
| `total_rides` | INTEGER | DEFAULT 0, CHECK >= 0 | Número de rides |
| `total_duration_min` | INTEGER | DEFAULT 0, CHECK >= 0 | Duración total |
| `total_elevation_gain_m` | INTEGER | DEFAULT 0, CHECK >= 0 | Elevación total |
| `avg_speed_kmh` | NUMERIC(4,1) | CHECK >= 0 | Velocidad promedio |
| `max_speed_kmh` | NUMERIC(4,1) | CHECK >= 0 | Velocidad máxima |
| `avg_distance_per_ride_km` | NUMERIC(6,2) | CHECK >= 0 | Distancia promedio por ride |
| `total_calories_burned` | INTEGER | DEFAULT 0, CHECK >= 0 | Calorías quemadas |
| `routes_completed` | INTEGER | DEFAULT 0, CHECK >= 0 | Rutas completadas |
| `unique_routes_completed` | INTEGER | DEFAULT 0, CHECK >= 0 | Rutas únicas completadas |
| `waypoints_visited` | INTEGER | DEFAULT 0, CHECK >= 0 | Waypoints visitados |
| `businesses_visited` | INTEGER | DEFAULT 0, CHECK >= 0 | Negocios visitados |
| `favorite_route_id` | UUID | REFERENCES routes(id) ON DELETE SET NULL | Ruta favorita del mes |
| `favorite_route_rides` | INTEGER | DEFAULT 0 | Veces en la ruta favorita |
| `achievements_unlocked` | INTEGER | DEFAULT 0, CHECK >= 0 | Logros desbloqueados |
| `total_points_earned` | INTEGER | DEFAULT 0, CHECK >= 0 | Puntos ganados |
| `distance_change_percent` | NUMERIC(5,2) | NULL | Cambio vs mes anterior |
| `rides_change_percent` | NUMERIC(5,2) | NULL | Cambio vs mes anterior |
| `speed_change_percent` | NUMERIC(5,2) | NULL | Cambio vs mes anterior |
| `calculated_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de cálculo |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |
| **UNIQUE** | (user_id, year, month) | | Uno por mes por usuario |

---

### 3.3 Resumen de Relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| `profiles` → `routes` | 1:N | Un usuario crea muchas rutas |
| `profiles` → `businesses` | 1:N | Un usuario puede tener varios negocios |
| `profiles` → `orders` | 1:N | Un usuario realiza muchas órdenes |
| `profiles` → `reviews` | 1:N | Un usuario escribe muchas reseñas |
| `profiles` → `route_purchases` | 1:N | Un usuario compra muchas rutas |
| `profiles` → `saved_routes` | 1:N | Un usuario guarda muchas rutas |
| `profiles` → `route_completions` | 1:N | Un usuario completa muchas rutas |
| `profiles` → `notifications` | 1:N | Un usuario recibe muchas notificaciones |
| `profiles` → `user_achievements` | 1:N | Un usuario tiene muchos logros |
| `profiles` → `user_goals` | 1:N | Un usuario define muchos objetivos |
| `profiles` → `user_personal_records` | 1:N | Un usuario tiene muchos récords |
| `profiles` → `user_stats_monthly` | 1:N | Un usuario tiene estadísticas por mes |
| `routes` → `route_waypoints` | 1:N | Una ruta tiene muchos waypoints |
| `routes` ↔ `businesses` | N:M | Muchas rutas pasan por muchos negocios (via `route_businesses`) |
| `businesses` → `products` | 1:N | Un negocio tiene muchos productos |
| `businesses` → `business_coupons` | 1:N | Un negocio crea muchos cupones |
| `orders` → `order_items` | 1:N | Una orden tiene muchas líneas |
| `orders` → `businesses` | N:1 | Muchas órdenes van a un negocio |
| `route_completions` → `unlocked_coupons` | 1:N | Una actividad desbloquea cupones |
| `route_completions` → `user_personal_records` | 1:N | Una actividad puede lograr récords |

---

## 4. REGLAS DE NEGOCIO Y RESTRICCIONES SQL

### 4.1 Reglas Lógicas de Validación

| # | Regla | Implementación SQL | Tabla Afectada |
|---|-------|-------------------|----------------|
| **1** | El precio de un producto no puede ser negativo | `CHECK (price >= 0)` | `products` |
| **2** | La calificación (rating) debe estar entre 1 y 5 estrellas | `CHECK (rating BETWEEN 1 AND 5)` | `reviews` |
| **3** | La cantidad en una orden debe ser mayor a 0 | `CHECK (quantity > 0)` | `order_items` |
| **4** | La distancia de una ruta debe ser positiva | `NOT NULL` + validación en app | `routes.distance_km` |
| **5** | El año de estadísticas debe ser válido (2026-2100) | `CHECK (year >= 2026 AND year <= 2100)` | `user_stats_monthly` |
| **6** | El mes debe estar entre 1 y 12 | `CHECK (month >= 1 AND month <= 12)` | `user_stats_monthly` |
| **7** | La dificultad solo puede ser valores predefinidos | `CHECK IN ('facil','moderada','dificil','experto')` | `routes.difficulty` |
| **8** | El estado de orden sigue una máquina de estados | `CHECK IN ('pendiente','confirmado','preparando','listo','entregado','cancelado')` | `orders.status` |

---

### 4.2 Restricciones de Unicidad

| Entidad | Campo(s) Único(s) | Descripción |
|---------|-------------------|-------------|
| `profiles` | `email` | El correo electrónico no se puede repetir |
| `routes` | `slug` | La URL amigable de cada ruta es única |
| `businesses` | `slug` | La URL amigable de cada negocio es única |
| `orders` | `order_number` | El número de orden es único globalmente |
| `saved_routes` | `(user_id, route_id)` | Un usuario solo puede guardar una ruta una vez |
| `route_businesses` | `(route_id, business_id)` | Un negocio solo aparece una vez por ruta |
| `user_achievements` | `(user_id, achievement_type)` | Un logro por tipo por usuario |
| `user_personal_records` | `(user_id, route_id, record_type)` | Un récord por tipo por ruta por usuario |
| `user_stats_monthly` | `(user_id, year, month)` | Solo una fila de stats por mes por usuario |

---

### 4.3 Valores por Defecto

| Entidad | Campo | Valor por Defecto | Descripción |
|---------|-------|-------------------|-------------|
| `profiles` | `wallet_balance` | `0.00` | Nuevo usuario empieza con balance cero |
| `profiles` | `is_creator` | `FALSE` | Por defecto no es creador |
| `profiles` | `created_at` | `NOW()` | Fecha del sistema al crear |
| `routes` | `status` | `'borrador'` | Rutas nuevas empiezan como borrador |
| `routes` | `difficulty` | `'moderada'` | Dificultad por defecto |
| `routes` | `is_free` | `TRUE` | Por defecto las rutas son gratuitas |
| `routes` | `price` | `0.00` | Precio cero por defecto |
| `routes` | `view_count` | `0` | Contador inicia en cero |
| `businesses` | `status` | `'pendiente'` | Negocios nuevos están pendientes de aprobación |
| `businesses` | `commission_rate` | `10.00` | Comisión del 10% por defecto |
| `businesses` | `accepts_advance_orders` | `TRUE` | Acepta pre-órdenes por defecto |
| `products` | `is_available` | `TRUE` | Productos disponibles por defecto |
| `orders` | `status` | `'pendiente'` | Órdenes inician como pendientes |
| `orders` | `payment_method` | `'efectivo'` | Pago en efectivo por defecto |
| `orders` | `payment_status` | `'pendiente'` | Estado de pago pendiente |
| `reviews` | `status` | `'aprobado'` | Reseñas se aprueban automáticamente |
| `notifications` | `is_read` | `FALSE` | Notificaciones no leídas por defecto |
| `user_achievements` | `is_unlocked` | `FALSE` | Logros no desbloqueados por defecto |
| `user_achievements` | `progress_current` | `0` | Progreso inicia en cero |

---

## 5. ÍNDICES Y OPTIMIZACIÓN

### 5.1 Índices Geoespaciales (GIST)

```sql
CREATE INDEX idx_routes_path ON routes USING GIST(route_path);
CREATE INDEX idx_routes_start_point ON routes USING GIST(start_point);
CREATE INDEX idx_route_waypoints_location ON route_waypoints USING GIST(location);
CREATE INDEX idx_businesses_location ON businesses USING GIST(location);
CREATE INDEX idx_sponsored_segments_path ON sponsored_segments USING GIST(segment_path);
```

### 5.2 Índices Compuestos y Parciales

```sql
-- Índices parciales (solo datos activos)
CREATE INDEX idx_routes_status ON routes(status) WHERE status = 'publicado';
CREATE INDEX idx_businesses_type ON businesses(business_type) WHERE status = 'activo';
CREATE INDEX idx_products_business ON products(business_id) WHERE is_available = TRUE;
CREATE INDEX idx_sponsored_segments_route ON sponsored_segments(route_id) WHERE is_active = TRUE;

-- Índices compuestos para queries frecuentes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_business ON orders(business_id, status);
CREATE INDEX idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX idx_route_completions_user ON route_completions(user_id, started_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_route_purchases_buyer ON route_purchases(buyer_id);
CREATE INDEX idx_route_purchases_route ON route_purchases(route_id);
CREATE INDEX idx_reviews_route ON reviews(route_id) WHERE route_id IS NOT NULL;
CREATE INDEX idx_reviews_business ON reviews(business_id) WHERE business_id IS NOT NULL;
```

---

## 6. SEGURIDAD (Row Level Security)

El sistema implementa **Row Level Security (RLS)** en todas las tablas públicas. Ejemplos:

```sql
-- Los usuarios solo ven sus propios datos sensibles
CREATE POLICY "Users see own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Los creadores solo modifican sus propias rutas
CREATE POLICY "Creators manage own routes" ON routes
    FOR ALL USING (auth.uid() = creator_id);

-- Los negocios solo ven sus propias órdenes
CREATE POLICY "Businesses see own orders" ON orders
    FOR SELECT USING (
        business_id IN (
            SELECT id FROM businesses WHERE owner_id = auth.uid()
        )
    );

-- Las rutas públicas son visibles por todos
CREATE POLICY "Public routes visible" ON routes
    FOR SELECT USING (status = 'publicado');
```

---

## 7. ANEXOS

### 7.1 Extensiones PostgreSQL Requeridas

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- Generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "postgis";         -- Datos geoespaciales
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Búsqueda de texto similar
CREATE EXTENSION IF NOT EXISTS "btree_gist";      -- Índices GIST para tipos básicos
```

### 7.2 Decisiones Técnicas Clave

1. **GEOMETRY vs GEOGRAPHY**: Se usa GEOMETRY (proyección plana) en lugar de GEOGRAPHY (esférica) porque:
   - Mejor rendimiento con índices GIST (2-3x más rápido)
   - Operamos solo en Yucatán (~43,000 km²), donde el error de proyección es <0.5%
   - Compatibilidad total con todas las funciones ST_* de PostGIS

2. **JSONB para Esquemas Flexibles**: Campos como `preferences`, `business_hours`, `photos`, `tags` y `data` usan JSONB para permitir evolución del schema sin migraciones.

3. **Soft Deletes**: En lugar de DELETE, se usan campos `status` e `is_active` para mantener auditoría histórica.

4. **Tabla Unificada de Reviews**: Una sola tabla `reviews` maneja reseñas de rutas Y negocios usando `review_type` como discriminador.

---

**Documento generado para la materia de Base de Datos Avanzada**  
**Proyecto KAELO - Febrero 2026**
