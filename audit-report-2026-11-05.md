# Informe de la noche: clúster "deep clean / move-out" + auditoría SEO y GEO

Preparado para Andrés Tobón, para la llamada de la mañana. Sitio: https://chabodcleaningservices.com
Fecha de trabajo: 4 de noviembre de 2026 (noche). Archivo: `audit-report-2026-11-05.md`.

---

## 0. Resumen para decir por teléfono (6 líneas)

1. Publiqué los **8 posts de hoy** y están en vivo, con imagen, enlaces internos y sitemap. Los otros **5 quedaron programados** para el 10, 12, 17, 19 y 24 de noviembre a las 8:00 AM (hora de San Antonio).
2. Nada se rompió: las 13 piezas pasaron todas las validaciones (enlaces, imágenes, título, categoría, fecha).
3. **Las IAs (ChatGPT, Perplexity, Claude, Google, Bing, Apple) pueden leer el sitio completo.** No hay bloqueo en robots.txt ni en las pruebas desde 16 "bots" distintos.
4. La velocidad en celular es buena (88–98 de 100 en las 3 páginas medidas).
5. Lo que más conviene arreglar: **títulos y descripciones demasiado largos** en casi todos los posts, **falta la fecha de actualización y los horarios en los datos para Google**, y **la página de limpieza residencial no menciona mudanzas** aunque los posts nuevos mandan gente allá.
6. No pude verificar: llamadas, formularios y clientes en GHL, Google Business Profile, estadísticas de Cloudflare/GA4. Abajo está lo que necesito para poder hacerlo.

---

## 1. Fase A: lo que se publicó

### Publicados ahora (8) — listos para enviar a Google Search Console

Todos con 200 OK, canonical a sí mismos, imagen con texto alternativo y dentro del sitemap.

| # | URL |
|---|-----|
| 1 | https://chabodcleaningservices.com/blog/thanksgiving-kitchen-deep-clean-checklist-san-antonio |
| 2 | https://chabodcleaningservices.com/blog/after-the-party-cleaning-checklist-san-antonio |
| 3 | https://chabodcleaningservices.com/blog/deep-cleaning-checklist-what-should-be-included-san-antonio |
| 4 | https://chabodcleaningservices.com/blog/move-out-cleaning-checklist-texas-renters-san-antonio |
| 5 | https://chabodcleaningservices.com/blog/deep-clean-vs-move-out-clean-san-antonio |
| 6 | https://chabodcleaningservices.com/blog/can-texas-landlord-charge-cleaning-security-deposit-san-antonio |
| 7 | https://chabodcleaningservices.com/blog/what-move-out-cleaning-does-not-include-san-antonio |
| 8 | https://chabodcleaningservices.com/blog/questions-to-ask-before-hiring-move-out-cleaning-san-antonio |

### Programados (5) — NO enviar todavía a Search Console

Se abren solos a las 8:00 AM hora de San Antonio. Hasta esa hora la URL responde "no encontrado" y **no aparecen** en el sitemap. Cuando se abren, el sitemap los incluye automáticamente (no hay que hacer nada).

| Fecha | Post |
|-------|------|
| Martes 10 nov, 8:00 AM | compare-two-cleaning-quotes-same-checklist-san-antonio |
| Jueves 12 nov, 8:00 AM | move-in-cleaning-checklist-san-antonio |
| Martes 17 nov, 8:00 AM | inside-oven-fridge-cabinets-behind-appliances-deep-clean-san-antonio |
| Jueves 19 nov, 8:00 AM | window-tracks-baseboards-move-out-clean-details-san-antonio |
| Martes 24 nov, 8:00 AM | carpet-cleaning-at-move-out-lease-requirement-san-antonio |

(Todos bajo `https://chabodcleaningservices.com/blog/`. Hay otros 6 posts de la tanda anterior que siguen su propio calendario: 6, 9, 11, 13, 16 y 18 de noviembre.)

### Otras páginas para pedir "Inspeccionar URL → Solicitar indexación"

Porque ahora enlazan a los posts nuevos o cambiaron:

- https://chabodcleaningservices.com/
- https://chabodcleaningservices.com/residential-cleaning
- https://chabodcleaningservices.com/commercial-cleaning
- https://chabodcleaningservices.com/str-cleaning
- Sitemap (Sitemaps → ya enviado; solo verificar que diga "Correcto"): https://chabodcleaningservices.com/sitemap.xml

Las 5 páginas con `noindex` (privacy-policy, terms-conditions, service-terms, sms-terms, before-we-arrive) **son intencionales**. No las envíes, y no están en el sitemap.

### Cambios que hice

- Subí 26 imágenes (13 `.webp` + 13 `.jpg`) a `public/blog/images/` (commit `cbd2f4e`, ya en producción).
- Escribí los 13 posts y el índice del blog en el almacenamiento del blog (KV). El índice pasó de 26 a 39 entradas; las 26 entradas anteriores quedaron **idénticas** (comprobado).
- No toqué: Cloudflare, DNS, robots.txt, posts existentes, schema, ni envié nada a Search Console.
- No hizo falta ninguna corrección "segura" (texto alternativo, canonical, sitemap, enlace roto): todo salió bien a la primera.

---

## 2. Fase B: auditoría SEO + GEO (resultados)

### 2.1 Lo que está bien

- **Acceso de IAs: sin problema.** Probé 16 user-agents (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot, Claude-User, Applebot, CCBot, Bytespider, Amazonbot, meta-externalagent, DuckDuckBot) sobre 12 páginas. Todos reciben 200 con el texto completo. No hay reglas `Disallow` que bloqueen el blog ni a ningún bot de IA. `Google-Extended` y `Applebot-Extended` no son bots reales (solo marcas en robots.txt): no hay reglas contra ellos.
- **Sin duplicados**: ningún título repetido, ninguna descripción repetida, un solo H1 por página, canonical correcto en todas.
- **Sitemap limpio**: 36 URLs, todas con fecha, ninguna con noindex, ningún post programado "filtrado" antes de tiempo, ninguna página indexable fuera del sitemap.
- **Datos estructurados**: los 28 posts tienen `BlogPosting` válido. Las páginas de servicio tienen FAQ. Sin errores de JSON-LD.
- **Imágenes**: todos los posts con imagen destacada, texto alternativo y `og:image` absoluto.
- **Velocidad (celular, Lighthouse, 2 corridas cada una)**:

| Página | Puntaje | LCP | CLS | TBT |
|--------|---------|-----|-----|-----|
| Inicio | 88 y 95 | 3.0–3.1 s | 0 | 30–150 ms |
| /residential-cleaning | 94 y 90 | 3.0 s | 0 | 20–50 ms |
| Un post | 98 y 98 | 2.0–2.1 s | 0–0.02 | 110–130 ms |

  Lo único marcado: tiempo de respuesta del servidor ~270 ms en el post (aceptable). La variación entre corridas es normal.

### 2.2 Para arreglar (ordenado por impacto)

**Alto**

1. **Títulos demasiado largos.** 26 de 28 posts, más `/commercial-cleaning` (79) y `/tools/fee-calculator` (66), pasan de 65 caracteres; los 8 posts nuevos van de 89 a 132. Google los corta en los resultados y a veces los reescribe. Lo bueno: el sistema ya permite un título SEO aparte del título que se ve en el post (`seo_title`). **Recomendación:** definir títulos de ~55–60 caracteres para los 8 nuevos y los más viejos. No lo cambié porque el runbook pedía no tocar texto.
2. **Descripciones largas** en 9 posts (171–207 caracteres) y en `/commercial-cleaning` (192). Ideal: 120–155.
3. **La página `/residential-cleaning` no menciona "move-out" ni "move-in"**, pero todos los posts del clúster terminan con un botón que lleva a esa página. Quien llega buscando limpieza de mudanza no ve su caso ahí. **Recomendación:** agregar una sección corta "Limpieza de mudanza (move-out / move-in)" con enlaces a los posts del clúster. Esto también arregla enlaces internos (ver 2.4).
4. **Los formularios.** El único formulario del sitio es el de la calculadora. Las páginas de servicio dependen solo de teléfono y SMS. Si alguien prefiere escribir antes que llamar, no tiene un lugar claro. Ver sección 4.

**Medio**

5. **`dateModified` falta en los 28 posts.** Google y las IAs lo usan para saber si el contenido está al día. Se puede agregar en el Worker usando la fecha de publicación como valor inicial.
6. **LocalBusiness sin horarios, sin `sameAs` (Facebook, Instagram, Google Business) y sin `geo`.** Son los datos que más ayudan a que Google y las IAs conecten el sitio con el perfil de empresa.
7. **Dirección en el texto vs. GHL:** en el sitio aparece "White Cyn" en un lugar y en GHL aparece "White Canyon". Hay que decidir cuál es la correcta y dejar **una sola forma** en todas partes (sitio, GHL, Google Business Profile, directorios). Las diferencias pequeñas confunden a Google.
8. **Respuesta directa al inicio.** Revisé 12 posts. Los 8 nuevos y 2 más (vrbo-12-percent y halloween) tienen una frase "Direct answer:" en los primeros párrafos, bien para IAs. Los que **no** la tienen: `why-we-report-problems-san-antonio` (empieza bien pero sin la respuesta marcada) y `airbnb-house-rules-checkout-chores-november-2026` (abre con una nota de fecha; la respuesta queda más abajo). Son candidatos para reescribir la apertura.

**Bajo**

9. Primer-contenido en la pantalla del celular: LCP de ~3 s en inicio y residencial; se mejoraría con una imagen principal más liviana. No urgente.
10. GA4 se carga después de la primera interacción o a los 5 s (por consentimiento), así que **las visitas que se van rápido no se cuentan**. Los números de GA4 serán menores que la realidad.

### 2.3 Tabla de posts (28 en vivo)

Palabras = texto visible. Entrantes = otras páginas que enlazan dentro del contenido (sin contar el menú ni `/blog`). Salientes = enlaces a otros posts.

| Post | Categoría | Fecha | Palabras | Entrantes | Salientes |
|------|-----------|-------|----------|-----------|-----------|
| commercial-deep-cleaning-vs-janitorial-service | Commercial Cleaning | 2026-11-04 | 1349 | 6 | 3 |
| after-the-party-cleaning-checklist | Residential Tips | 2026-11-04 | 1009 | 13 | 5 |
| can-texas-landlord-charge-cleaning-security-deposit | Residential Tips | 2026-11-04 | 1098 | 11 | 5 |
| deep-clean-vs-move-out-clean | Residential Tips | 2026-11-04 | 733 | 10 | 5 |
| deep-cleaning-checklist-what-should-be-included | Residential Tips | 2026-11-04 | 1280 | 6 | 7 |
| move-out-cleaning-checklist-texas-renters | Residential Tips | 2026-11-04 | 943 | 4 | 6 |
| questions-to-ask-before-hiring-move-out-cleaning | Residential Tips | 2026-11-04 | 934 | 3 | 6 |
| thanksgiving-kitchen-deep-clean-checklist | Residential Tips | 2026-11-04 | 1178 | **1** | 4 |
| what-move-out-cleaning-does-not-include | Residential Tips | 2026-11-04 | 957 | 4 | 6 |
| commercial-cleaning-cost-per-visit-vs-per-month | Commercial Cleaning | 2026-11-02 | 1421 | 3 | 3 |
| commercial-cleaning-scope-of-work-checklist | Commercial Cleaning | 2026-10-30 | 1602 | 3 | 4 |
| airbnb-amenity-listing-inventory-audit | STR & Airbnb Hosts | 2026-10-29 | 924 | 9 | 3 |
| airbnb-grocery-delivery-fridge-handoff | STR & Airbnb Hosts | 2026-10-27 | 899 | 9 | 4 |
| halloween-cleanup-routine-vs-quote | Residential Tips | 2026-10-22 | 862 | **1** | 3 |
| airbnb-house-rules-checkout-chores-november-2026 | STR & Airbnb Hosts | 2026-10-22 | 2417 | 9 | 6 |
| hildebrand-construction-cleaning-access | Residential Tips | 2026-10-20 | 921 | **0** | 3 |
| dia-de-los-muertos-downtown-cleaner-access | STR & Airbnb Hosts | 2026-10-16 | 884 | 3 | 3 |
| airbnb-laundry-responsibility | STR & Airbnb Hosts | 2026-10-15 | 1100 | **0** | 4 |
| commercial-facility-deep-cleaning-employee-care | Commercial Cleaning | 2026-10-06 | 1711 | 3 | 3 |
| vrbo-12-percent-commission | STR & Airbnb Hosts | 2026-10-04 | 2048 | **0** | 5 |
| san-antonio-str-permit-fee-increase-october-2026 | San Antonio Local | 2026-10-02 | 1927 | **1** | 3 |
| airbnb-turnover-cleaning-cost | STR & Airbnb Hosts | 2026-09-17 | 1592 | 4 | 6 |
| airbnb-payout-change-september-2026 | STR & Airbnb Hosts | 2026-09-11 | 2678 | **1** | 4 |
| what-guests-notice-first-5-minutes-airbnb | STR & Airbnb Hosts | 2026-09-04 | 1883 | **1** | 4 |
| why-we-report-problems | Behind the Scenes | 2026-09-03 | 1279 | **1** | 3 |
| deep-clean-vs-regular-clean | Residential Tips | 2026-09-01 | 1530 | 6 | 3 |
| trapped-cleaning-contract | Behind the Scenes | 2026-08-28 | 1320 | 6 | 3 |
| superhost-status-cleaning-company | STR & Airbnb Hosts | 2026-08-25 | 1078 | **0** | 4 |

(Todos los slugs terminan en `-san-antonio`; recortados aquí por espacio.)

### 2.4 Enlaces internos (solo recomendación, no cambié nada)

- **10 posts con menos de 2 enlaces entrantes** (en negrita arriba). Los más aislados, con 0: hildebrand-construction…, airbnb-laundry-responsibility, vrbo-12-percent-commission, superhost-status….
- Los 5 posts programados añadirán enlaces entrantes al clúster cuando se abran. Los del clúster viejo (`deep-clean-vs-regular-clean-san-antonio`, `halloween-cleanup…`) deberían enlazar a `deep-clean-vs-move-out-clean-san-antonio` como "siguiente lectura".
- **Posible canibalización** (dos posts que compiten por la misma búsqueda):
  - `deep-clean-vs-regular-clean-san-antonio` (1 sep) y `deep-clean-vs-move-out-clean-san-antonio` (hoy): comparaciones distintas, pero ambas tienen "deep clean vs" en el título. Dejarlas, pero que se enlacen entre sí con texto claro.
  - `deep-cleaning-checklist-what-should-be-included` y `move-out-cleaning-checklist-texas-renters`: ambas son listas. La diferencia (casa ocupada vs. unidad vacía) debe verse en el título SEO.
  - En el lado de Airbnb: `airbnb-turnover-cleaning-cost-san-antonio` y los posts de comisiones no compiten entre sí.
- Agregar en la home y en `/residential-cleaning` un bloque "Guías para mudanzas" con 3–4 enlaces al clúster.

---

## 3. GEO (visibilidad en IAs)

- **Acceso:** correcto (ver 2.1). `llms.txt` existe y responde 200.
- **Estructura:** los posts tienen respuesta directa al inicio, encabezados claros, y el post de la ley de depósitos (`can-texas-landlord-charge…`) advierte que no es asesoría legal.
- **Para mejorar:** horarios, `sameAs` y una sola dirección en todo lado (2.2, puntos 6–7); `dateModified` (punto 5); y que el perfil de Google Business tenga la misma información que el sitio.
- **Lo que no puedo medir desde aquí:** si ChatGPT, Perplexity o Google ya te citan. Eso se prueba a mano: preguntar "cleaning company San Antonio move-out" en cada una en 2–4 semanas y anotar si aparece Chabod.

---

## 4. Llamadas, formularios, leads y la calculadora

- **Lo único que puedo confirmar:** el único formulario del sitio es la calculadora de tarifas (`/tools/fee-calculator`). Las demás páginas usan enlaces de teléfono y SMS. No hay un formulario de cotización eliminado recientemente (revisé el historial de cambios desde el 25 de septiembre).
- **No pude revisar** las llamadas ni los leads en GHL: la lectura de contactos fue bloqueada por la configuración de seguridad (contiene datos de clientes). Tampoco vi las citas ni las conversaciones. La cuenta de GHL tiene fecha de creación del 12 de octubre, así que cualquier comparación con meses anteriores no es posible desde ahí.
- **No hice la prueba del formulario.** Hubiera creado un contacto de prueba en tu CRM real y una fila en Supabase. Si quieres que la haga, dímelo y uso el nombre "ZZ AUDIT TEST - DELETE", teléfono 2105550123, y te digo exactamente qué contacto borrar (y borro yo la fila de Supabase).
- **Para la parte de captura de leads, lo que necesito:** el ID del formulario de GHL y las URLs finales de privacidad y términos SMS (`/privacy-policy` y `/sms-terms` ya existen). Con eso se puede agregar un formulario corto de cotización en `/residential-cleaning` y `/commercial-cleaning` con casilla de consentimiento.

---

## 5. Lo que necesito que confirmes (Andrés)

1. **¿Cuál es la dirección correcta: "White Cyn" o "White Canyon"?**
2. ¿Quieres que acorte los títulos y descripciones de los 8 posts nuevos y de los demás (propongo ~55–60 caracteres)?
3. ¿Agrego a `/residential-cleaning` una sección de limpieza de mudanza con enlaces al clúster?
4. ¿Cuáles son tus **horarios de atención** (días y horas) y tus **enlaces** de Facebook, Instagram y Google Business, para ponerlos en los datos de la empresa?
5. ¿Hago la prueba del formulario de la calculadora (punto 4)?
6. ¿Quieres un formulario corto de cotización en las páginas de servicio? Si sí: necesito el ID del formulario en GHL.
7. ¿Aprobamos añadir "fecha de actualización" (`dateModified`) en los posts?

---

## 6. Lo que no pude verificar y qué acceso hace falta

| Tema | Por qué no | Qué hace falta |
|------|-----------|----------------|
| Llamadas, leads, citas en GHL | La lectura de contactos fue bloqueada por seguridad | Un reporte exportado de GHL (llamadas y formularios, últimos 30 días), o permiso explícito para leer solo recuentos |
| Google Business Profile (reseñas, horarios, categorías, publicaciones) | Sin acceso | Captura de pantalla del perfil, o acceso de lectura |
| Search Console (clics, impresiones, consultas) | Sin acceso | Exportar el informe de rendimiento (últimos 28 días) |
| GA4 / Cloudflare Analytics | Sin acceso | Capturas o exportación del mismo periodo |
| Configuración de Cloudflare (reglas de bots, "AI Crawl Control", WAF) | Sin acceso | Captura de Seguridad → Bots y de Reglas |
| Errores 5xx en logs | Sin acceso a logs de producción | `wrangler tail` desde tu equipo o acceso a Workers Logs |
| Resultados de ChatGPT/Perplexity/Google AI | No se pueden medir desde aquí | Prueba manual en 2–4 semanas |

---

## 7. Siguientes pasos (si estás de acuerdo)

1. Enviar a Search Console los 8 posts y las 4 páginas de la sección 1 (tú, a mano).
2. Contestar las 7 preguntas de la sección 5.
3. Yo: títulos SEO + descripciones, sección de mudanza en `/residential-cleaning`, `dateModified`, horarios y `sameAs`.
4. Revisar en 7 días en Search Console qué posts quedaron indexados.
