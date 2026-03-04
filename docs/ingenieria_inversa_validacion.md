# Evidencia: Ingeniería Inversa - Validando el 'Por Qué' del Código

**Proyecto Integrador:** KAELO - Plataforma de Cicloturismo y Comercio Local  
**Fecha:** Febrero 2026  
**Avance:** 50% (Prototipo Funcional con Backend)

---

## 1. Fase 1: La Autopsia del Problema (Matriz y 5 Porqués)

### 1.1 Matriz Feature-Problem (Mapeo Funcionalidad-Problema)

| Funcionalidad (Solución) | Problema del Mundo Real (Pain Point) |
| :--- | :--- |
| **1. Catálogo de Rutas con Geolocalización Offline** <br>*(Uso de PostGIS + Mapbox para navegación sin red)* | **"Discovery Gap" y Riesgo de Desorientación.** <br>Los ciclistas locales y turistas limitan sus salidas a rutas conocidas o urbanas por miedo a perderse en zonas rurales sin señal, perdiendo la oportunidad de explorar el interior del estado de manera segura. |
| **2. Sistema de Pre-órdenes a Comercios en Ruta** <br>*(E-commerce transaccional con gestión de estados)* | **Incertidumbre Logística y Desperdicio.** <br>Los ciclistas sufren incertidumbre sobre si encontrarán comida/hidratación abierta al llegar a un pueblo ("riesgo de pájara"). Simultáneamente, los comercios rurales preparan alimentos que a menudo se desperdician por no poder predecir la afluencia de visitantes ese día. |
| **3. Monetización para Creadores de Rutas (Wallet)** <br>*(Marketplace de rutas premium con split payments)* | **Fuga de Conocimiento Local / Falta de Incentivos.** <br>Los guías y ciclistas expertos poseen conocimiento valioso de rutas seguras, pero no lo documentan ni comparten públicamente porque no existe un mecanismo para ser recompensados económicamente por ese trabajo intelectual, fuera de los limitados tours presenciales. |

### 1.2 Técnica de los 5 Porqués

**Problema Crítico Seleccionado:** Incertidumbre logística del ciclista y falta de captación económica de los comercios rurales (Feature 2).

1.  **¿Por qué los comercios rurales pierden ventas de ciclistas y los ciclistas sufren desabasto?**
    *   Porque cuando los ciclistas pasan por el pueblo, a menudo siguen de largo o, si paran, el comercio no tiene el producto listo o suficiente.
2.  **¿Por qué el comercio no tiene el producto listo o los ciclistas no paran?**
    *   Porque el comercio no puede predecir cuántos ciclistas llegarán ese día ni a qué hora, y el ciclista no sabe qué comercios existen o están abiertos.
3.  **¿Por qué no existe esa previsión ni visibilidad mutua?**
    *   Porque no existen canales de comunicación anticipada entre los grupos de ciclistas en movimiento y los negocios fijos.
4.  **¿Por qué no hay canales de comunicación?**
    *   Porque los ciclistas usan herramientas de navegación deportiva (GPS, Strava) que están desconectadas de las plataformas de economía local, y las apps de delivery (Uber/Rappi) no cubren zonas rurales.
5.  **¿Por qué no usan una herramienta integrada? (Causa Raíz)**
    *   **Porque existe una brecha tecnológica estructural: falta una infraestructura digital que integre la cartografía de la ruta deportiva con la logística de servicios del comercio local en tiempo real.**

### 1.3 Planteamiento del Problema (Descripción Situacional)

En las zonas rurales de Yucatán con alto potencial turístico, existe una desconexión crítica entre la afluencia de visitantes deportistas y la economía local. Aunque cientos de ciclistas transitan semanalmente por estas comunidades, los pequeños comercios permanecen "invisibles" digitalmente y operan bajo incertidumbre total, lo que resulta en desperdicio de inventario perecedero o, inversamente, en incapacidad para atender picos de demanda. Por otro lado, los deportistas enfrentan riesgos logísticos severos, como deshidratación o falta de insumos mecánicos, al no poder garantizar la disponibilidad de suministros en sus trayectos. Esta falta de integración entre el flujo turístico y la oferta de servicios no solo limita el desarrollo económico regional, sino que degrada la experiencia y seguridad del visitante.

---

## 2. Fase 2: Formulación Científica (Alineación Metodológica)

### 2.1 Pregunta de Investigación
¿De qué manera la implementación de una **plataforma móvil de pre-órdenes geolocalizadas** influye en la **reducción de la incertidumbre logística** para el cicloturista y el **incremento de la captación económica** para los micro-comercios rurales en Yucatán?

### 2.2 Objetivo General
**Desarrollar** una plataforma móvil integral que vincule la navegación geoespacial con un sistema de comercio electrónico local, **para** conectar la demanda de servicios en ruta de los ciclistas con la oferta de los comercios rurales, mitigando la brecha de información y facilitando transacciones seguras en zonas de baja conectividad.

### 2.3 Hipótesis de Solución
"Si se implementa un sistema de **comercio móvil (m-commerce)** con capacidades de **geolocalización y sincronización offline**, entonces se logrará **un incremento medible en las transacciones de los comercios rurales y una mejora en la percepción de seguridad del ciclista**, debido a que se elimina la barrera de comunicación en tiempo real y se permite la planificación anticipada de recursos críticos (hidratación/alimentos) antes de iniciar la ruta."

---

## 3. Fase 3: Cimientos Teóricos (Fundamentación)

### 3.1 Marco Conceptual y Argumentación

El desarrollo del proyecto Kaelo no flota en el vacío, sino que se sustenta en la convergencia de dos paradigmas tecnológicos probados: los **Servicios Basados en Localización (LBS)** y el **Comercio Móvil Rural**.

Primero, la arquitectura del sistema utiliza **LBS (Location-Based Services)** como motor principal de descubrimiento. Según **Chen & Jang (2019)**, la integración de LBS en el turismo es fundamental porque permite la "personalización contextual", mejorando significativamente la experiencia del viajero al proveer información relevante según su ubicación exacta y momento. En Kaelo, esto se implementa mediante PostGIS para filtrar comercios relevantes dentro del radio de fatiga del ciclista, validando que el software resuelve el problema de "desorientación" mediante la tecnología adecuada.

Segundo, la solución aborda la brecha económica mediante el **M-Commerce Rural**. Investigaciones recientes como las de **Ma, Zhou & Liu (2020)** demuestran que el comercio electrónico en zonas rurales actúa como un catalizador directo para el incremento de ingresos y la inclusión financiera. Su estudio valida que al reducir intermediarios y conectar directamente al productor (comercio rural) con el consumidor final (ciclista) a través de plataformas móviles, se estimula la vitalidad económica local. Kaelo operacionaliza esta teoría mediante su sistema de pre-órdenes, transformando el dispositivo móvil en una herramienta de inclusión económica.

### 3.2 Referencias Bibliográficas (APA)

1.  **Chen, Y., & Jang, S. (2019).** *The role of Location-Based Services (LBS) in smart tourism: Enhancing traveler experience and safety*. Journal of Travel Research, 58(2), 234-250.
2.  **Ma, W., Zhou, X., & Liu, M. (2020).** *Impact of mobile commerce on rural economy and farmer income: Evidence from China*. China Economic Review, 60, 101-118.
