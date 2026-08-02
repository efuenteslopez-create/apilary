# Apilary — Guía Oficial de Construcción (IMPLEMENTATION.md)

> **Proyecto:** Apilary (*Your AI Integration Architect*)  
> **Propósito del Documento:** Guía secuencial de construcción para agentes de IA y desarrolladores.  
> **Regla de Ejecución:** Cada tarea es atómica, autocontenida, se completa en 30–90 minutos y equivale a **1 commit de Git**. No avanzar a la siguiente tarea sin haber validado los criterios de aceptación y las pruebas de la tarea actual.

---

## Índice de Tareas

- [Fase 0: Setup y Fundamentos](#fase-0-setup-y-fundamentos)
  - [Tarea 01: Inicialización del Proyecto Next.js y Configuración Base](#tarea-01-inicialización-del-proyecto-nextjs-y-configuración-base)
  - [Tarea 02: Design System Vanilla CSS y Estilos Globales Dark-Mode](#tarea-02-design-system-vanilla-css-y-estilos-globales-dark-mode)
  - [Tarea 03: Tipos TypeScript y Contratos de Datos](#tarea-03-tipos-typescript-y-contratos-de-datos)
- [Fase 1: Capa de Datos y Catálogo](#fase-1-capa-de-datos-y-catálogo)
  - [Tarea 04: Cliente Supabase y Migración SQL](#tarea-04-cliente-supabase-y-migración-sql)
  - [Tarea 05: Dataset Curado de 200 APIs con Keywords](#tarea-05-dataset-curado-de-200-apis-con-keywords)
  - [Tarea 06: Script de Ingesta y Carga a Supabase](#tarea-06-script-de-ingesta-y-carga-a-supabase)
  - [Tarea 07: Módulo de Prefiltrado SQL por Keywords y Categorías](#tarea-07-módulo-de-prefiltrado-sql-por-keywords-y-categorías)
- [Fase 2: Motor de Integración, Plantillas y LLM](#fase-2-motor-de-integración-plantillas-y-llm)
  - [Tarea 08: Motor de Plantillas de Código (TypeScript, Python, cURL)](#tarea-08-motor-de-plantillas-de-código-typescript-python-curl)
  - [Tarea 09: Cliente OpenRouter y Prompting Estructurado de Gemini Flash](#tarea-09-cliente-openrouter-y-prompting-estructurado-de-gemini-flash)
  - [Tarea 10: Endpoint `POST /api/recommend`](#tarea-10-endpoint-post-apirecommend)
  - [Tarea 11: Endpoint `POST /api/feedback`](#tarea-11-endpoint-post-apifeedback)
- [Fase 3: Componentes de Interfaz de Usuario (UI)](#fase-3-componentes-de-interfaz-de-usuario-ui)
  - [Tarea 12: Componentes `Header` y `SearchHero`](#tarea-12-componentes-header-y-searchhero)
  - [Tarea 13: Componente `ArchitectureBrief` y `ArchitectVerdict`](#tarea-13-componente-architecturebrief-y-architectverdict)
  - [Tarea 14: Componentes `ResultCard` y `CodeBlock` con Pestañas](#tarea-14-componentes-resultcard-y-codeblock-con-pestañas)
  - [Tarea 15: Componente `ComparisonMatrix`](#tarea-15-componente-comparisonmatrix)
  - [Tarea 16: Componentes `FeedbackWidget` y `LoadingSkeleton`](#tarea-16-componentes-feedbackwidget-y-loadingskeleton)
  - [Tarea 17: Ensamblado de Página Principal (`page.tsx`) y Manejo de Estado](#tarea-17-ensamblado-de-página-principal-pagetsx-y-manejo-de-estado)
- [Fase 4: Validación y Despliegue](#fase-4-validación-y-despliegue)
  - [Tarea 18: Suite de Pruebas de Humo con 10 Casos Reales](#tarea-18-suite-de-pruebas-de-humo-con-10-casos-reales)
  - [Tarea 19: Configuración de Despliegue en Vercel y Documentación Final](#tarea-19-configuración-de-despliegue-en-vercel-y-documentación-final)

---

# Fase 0: Setup y Fundamentos

---

### Tarea 01: Inicialización del Proyecto Next.js y Configuración Base
- **Objetivo:** Inicializar la estructura limpia del proyecto Next.js 15 con TypeScript, App Router, sin frameworks CSS pesados.
- **Contexto:** Base limpia de la aplicación sobre la cual se construirán todas las rutas y componentes.
- **Archivos a crear/modificar:**
  - `package.json`
  - `tsconfig.json`
  - `next.config.ts`
  - `.gitignore`
  - `.env.example`
  - `.env.local`
- **Dependencias:** Node.js 20+. Instalar únicamente dependencias core (`next`, `react`, `react-dom`, `@supabase/supabase-js`, `typescript`, `@types/node`, `@types/react`).
- **Pasos de implementación:**
  1. Ejecutar `npx create-next-app@latest ./ --typescript --app --eslint --src-dir --tailwind=false --import-alias="@/*"` en modo no interactivo.
  2. Instalar `@supabase/supabase-js`.
  3. Crear `.env.example` con las variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=
     NEXT_PUBLIC_SUPABASE_ANON_KEY=
     SUPABASE_SERVICE_ROLE_KEY=
     OPENROUTER_API_KEY=
     ```
  4. Crear `.env.local` con valores temporales o reales.
- **Criterios de aceptación:**
  - `npm run build` compila sin errores.
  - `npm run dev` inicia el servidor local en el puerto 3000.
- **Cómo probar:**
  - Ejecutar `npm run build` y verificar salida limpia con código de retorno 0.
- **Qué NO debe modificarse:** No agregar Tailwind, no instalar librerías de UI externas (MUI, Radix, Chakra).
- **Mensaje de Commit sugerido:** `chore: initialize next.js 15 typescript project with supabase`

---

### Tarea 02: Design System Vanilla CSS y Estilos Globales Dark-Mode
- **Objetivo:** Implementar el sistema de diseño completo en CSS nativo (variables de color, tipografía *Inter* / *JetBrains Mono*, utilidades de layout, animaciones y dark-mode por defecto).
- **Contexto:** La interfaz debe proyectar calidad premium para desarrolladores sin sobrecarga de runtime.
- **Archivos a crear/modificar:**
  - `src/app/globals.css`
  - `src/app/layout.tsx`
- **Dependencias:** Tarea 01 completada.
- **Pasos de implementación:**
  1. Configurar variables CSS en `:root`:
     - `--bg-primary: #09090b;`
     - `--bg-secondary: #18181b;`
     - `--bg-card: rgba(24, 24, 27, 0.65);`
     - `--border-subtle: rgba(255, 255, 255, 0.08);`
     - `--border-highlight: rgba(99, 102, 241, 0.3);`
     - `--text-primary: #f4f4f5;`
     - `--text-secondary: #a1a1aa;`
     - `--text-muted: #71717a;`
     - `--accent-blue: #3b82f6;`
     - `--accent-purple: #8b5cf6;`
     - `--accent-gold: #f59e0b;`
     - `--accent-green: #10b981;`
     - `--accent-red: #ef4444;`
     - Gradientes, sombras y blur para glassmorphism.
  2. Importar Google Fonts en `layout.tsx` (*Inter* para texto general y *JetBrains Mono* para código).
  3. Definir metadatos SEO globales (`title: "Apilary — Your AI Integration Architect"`, `description`, OpenGraph tags).
- **Criterios de aceptación:**
  - El fondo de la aplicación es oscuro (`#09090b`), el texto es legible y de alto contraste.
  - Los estilos responsivos aplican a resoluciones móviles (<768px) y desktop (>1024px).
- **Cómo probar:**
  - Abrir `http://localhost:3000` y verificar en el inspector del navegador las variables CSS aplicadas y fuentes cargadas.
- **Qué NO debe modificarse:** No modificar la estructura de directorios de Next.js.
- **Mensaje de Commit sugerido:** `feat(ui): setup dark-mode design system and layout typography`

---

### Tarea 03: Tipos TypeScript y Contratos de Datos
- **Objetivo:** Definir las interfaces TypeScript que modelan el catálogo de APIs, las respuestas del LLM, los contratos de API y el estado de la aplicación.
- **Contexto:** Garantizar tipado estricto extremo a lo largo de toda la aplicación (DB -> Backend -> LLM -> Frontend).
- **Archivos a crear/modificar:**
  - `src/lib/types.ts`
- **Dependencias:** Tarea 01.
- **Pasos de implementación:**
  1. Definir interfaces:
     - `ApiRecord`: Representación exacta de la tabla `apis` en Supabase.
     - `CodeVariables`: Variables inyectadas en las plantillas de código.
     - `RecommendedApi`: Card individual con pros, contras, riesgos y código renderizado.
     - `ComparisonMatrix`: Estructura para la tabla comparativa de 5 dimensiones.
     - `ArchitectVerdict`: Estructura de la ⭐ Recomendación del Arquitecto.
     - `RecommendationResponse`: Respuesta completa que devuelve `POST /api/recommend`.
     - `FeedbackPayload`: Datos recibidos por `POST /api/feedback`.
- **Criterios de aceptación:**
  - Archivo sin errores sintácticos ni advertencias de TypeScript.
- **Cómo probar:**
  - Ejecutar `npx tsc --noEmit` y confirmar que no hay errores de tipo.
- **Qué NO debe modificarse:** No mezclar tipos de UI transitorios con contratos de API.
- **Mensaje de Commit sugerido:** `feat(types): declare complete domain and contract types`

---

# Fase 1: Capa de Datos y Catálogo

---

### Tarea 04: Cliente Supabase y Migración SQL
- **Objetivo:** Configurar el cliente singleton de Supabase y generar el archivo SQL con las tablas `apis`, `queries` y `feedback` con sus respectivos índices.
- **Contexto:** Base de datos relacional que aloja el catálogo curado y almacena métricas de consulta y feedback.
- **Archivos a crear/modificar:**
  - `src/lib/supabase.ts`
  - `supabase/migrations/20260802_init.sql`
- **Dependencias:** Tarea 01 y 03.
- **Pasos de implementación:**
  1. Crear `supabase/migrations/20260802_init.sql` con:
     - `CREATE TABLE apis (... keywords TEXT[] NOT NULL ...)`
     - Índices `idx_apis_category` e `idx_apis_keywords` (GIN index).
     - `CREATE TABLE queries (...)`
     - `CREATE TABLE feedback (...)`
     - Políticas RLS seguras (lectura anónima de `apis`, inserción anónima controlada en `queries` y `feedback`).
  2. Implementar `src/lib/supabase.ts` instanciando `createClient` con manejo de fallback si faltan variables en desarrollo local.
- **Criterios de aceptación:**
  - El script SQL es compatible con PostgreSQL 15+ y la instancia de Supabase.
  - El cliente Supabase expone funciones auxiliares fuertemente tipadas.
- **Cómo probar:**
  - Ejecutar el script SQL en el SQL Editor de Supabase y validar la creación de tablas e índices.
- **Qué NO debe modificarse:** No crear tablas adicionales fuera de las 3 especificadas.
- **Mensaje de Commit sugerido:** `feat(db): configure supabase client and database schema migration`

---

### Tarea 05: Dataset Curado de 200 APIs con Keywords
- **Objetivo:** Construir el archivo JSON estático `data/apis_seed.json` con exactamente 200 APIs curadas, completas con categorías, keywords técnicas, pricing summaries y base URLs.
- **Contexto:** Catálogo base de alta calidad que garantiza que el prefiltrado SQL y el recomendador tengan opciones sólidas para casos de uso reales (pagos, sms, IA, mapas, emails, auth, storage, databases, etc.).
- **Archivos a crear/modificar:**
  - `data/apis_seed.json`
- **Dependencias:** Tarea 03.
- **Pasos de implementación:**
  1. Crear el dataset JSON con 200 objetos estructurados respetando la interfaz `ApiRecord`.
  2. Cubrir categorías clave:
     - `payments`: Stripe, Fintoc, Mercado Pago, PayPal, Plaid, Square, Lemonsqueezy, Paddle.
     - `sms-notifications`: Twilio, Vonage, MessageBird, Infobip, Resend, SendGrid, Postmark, Novu.
     - `ai-ml`: OpenAI, Anthropic, Google Gemini, Groq, Mistral, AssemblyAI, ElevenLabs, DeepL, Replicate.
     - `maps-geo`: Google Maps, Mapbox, Radar, Nominatim, OpenCage, Here.
     - `auth-identity`: Auth0, Clerk, Supabase Auth, Firebase Auth, Stytch, Kinde.
     - `storage-media`: AWS S3, Cloudinary, Uploadthing, Imgix, Backblaze.
     - `databases`: Neon, Supabase, Upstash Redis, PlanetScale, Turso, Pinecone, Qdrant.
     - `monitoring-analytics`: Sentry, PostHog, Mixpanel, BetterStack, Axiom, Datadog.
     - `scraping-data`: ScrapingBee, Apify, Firecrawl, Tavily, SerpApi.
     - Otras categorías de utilidad general.
  3. Asegurar que cada entrada tenga entre 5 y 10 `keywords` técnicas precisas en minúsculas.
- **Criterios de aceptación:**
  - El JSON tiene 200 entradas válidas.
  - Todas las entradas incluyen `name`, `slug`, `category`, `keywords`, `description`, `pricing_summary`, `base_url` y `auth_type`.
- **Cómo probar:**
  - Ejecutar un script de validación `node -e "const data = require('./data/apis_seed.json'); console.log(data.length);"` y verificar que devuelva 200.
- **Qué NO debe modificarse:** No incluir APIs deprecadas o inactivas.
- **Mensaje de Commit sugerido:** `data: create curated seed dataset with 200 apis and keywords`

---

### Tarea 06: Script de Ingesta y Carga a Supabase
- **Objetivo:** Crear un script ejecutable en Node/TypeScript (`scripts/seed.ts`) que inserte o actualice idempotentemente (UPSERT por `slug`) las 200 APIs en la base de datos de Supabase.
- **Contexto:** Permitir sembrar la base de datos de producción o desarrollo en un solo comando.
- **Archivos a crear/modificar:**
  - `scripts/seed.ts`
  - `package.json` (agregar script `"seed": "tsx scripts/seed.ts"`)
- **Dependencias:** Tarea 04 y 05. Instalar `tsx` como `devDependencies`.
- **Pasos de implementación:**
  1. Instalar `tsx` (`npm install -D tsx`).
  2. Implementar `scripts/seed.ts`:
     - Leer `data/apis_seed.json`.
     - Conectar a Supabase usando `SUPABASE_SERVICE_ROLE_KEY` o `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
     - Ejecutar `supabase.from('apis').upsert(data, { onConflict: 'slug' })`.
     - Mostrar log con el total de registros insertados y tiempo de ejecución.
- **Criterios de aceptación:**
  - Ejecutar `npm run seed` inserta exitosamente las 200 filas en Supabase sin duplicados.
- **Cómo probar:**
  - Ejecutar `npm run seed` en consola y verificar mediante consulta a Supabase que `SELECT count(*) FROM apis;` retorna 200.
- **Qué NO debe modificarse:** No alterar esquemas de base de datos existentes.
- **Mensaje de Commit sugerido:** `feat(scripts): add automated database seed script for apis catalog`

---

### Tarea 07: Módulo de Prefiltrado SQL por Keywords y Categorías
- **Objetivo:** Implementar la función de servidor `searchCandidateApis(userQuery: string)` que analiza el texto del usuario, extrae tokens clave y ejecuta la consulta SQL en Supabase para obtener ~20 APIs candidatas.
- **Contexto:** Corazón del Paso 2 del Flujo Oficial: reduce el espacio de búsqueda deterministamente antes de llamar al LLM.
- **Archivos a crear/modificar:**
  - `src/lib/api-matcher.ts`
- **Dependencias:** Tarea 04 y 05.
- **Pasos de implementación:**
  1. Implementar parser de tokens de lenguaje natural:
     - Normalizar a minúsculas, remover signos de puntuación y stop-words comunes en español e inglés.
     - Detectar categorías candidatas por coincidencia temática (ej. `"cobrar"`, `"pagos"`, `"checkout"` -> categoría `payments`).
  2. Construir la consulta a Supabase:
     - Si hay categoría detectada, filtrar por `category = detectedCategory`.
     - Coincidencia de keywords mediante operador de contención o ILIKE (`keywords ?| array[...]` o búsqueda textual sobre `description` y `name`).
     - Si la búsqueda produce menos de 10 resultados, complementar con las APIs más populares de la categoría o catálogo general para garantizar entre 15 y 25 candidatas.
  3. Retornar array tipado `ApiRecord[]` limitado a máximo 20-25 registros con solo los campos necesarios.
- **Criterios de aceptación:**
  - Para `"Necesito cobrar suscripciones en Chile"`, retorna entre 10 y 25 APIs relacionadas con pagos y fintech (Stripe, Fintoc, Mercado Pago, etc.).
  - Para consultas ambiguas, retorna un set de respaldo variado y relevante.
- **Cómo probar:**
  - Crear un test unitario rápido o script de ejecución y verificar que retorna un array de 15 a 25 APIs pertinentes.
- **Qué NO debe modificarse:** No usar vector embeddings ni pgvector.
- **Mensaje de Commit sugerido:** `feat(search): implement sql-based keyword and category pre-filter`

---

# Fase 2: Motor de Integración, Plantillas y LLM

---

### Tarea 08: Motor de Plantillas de Código (TypeScript, Python, cURL)
- **Objetivo:** Implementar el motor determinista de renderizado de plantillas de código `renderIntegrationCode(...)`.
- **Contexto:** Garantiza código libre de errores sintácticos inyectando las variables provistas por el LLM en plantillas de producción.
- **Archivos a crear/modificar:**
  - `src/lib/code-templates.ts`
- **Dependencias:** Tarea 03.
- **Pasos de implementación:**
  1. Definir plantillas en string literals para:
     - `typescript`: Fetch moderno con tipado TypeScript completo e interfaces.
     - `python`: `requests` estructurado con manejo de excepciones `RequestException`.
     - `curl`: Comando de terminal formateado con headers y payload JSON.
  2. Implementar la función `renderCodeSnippets(apiName: string, useCase: string, variables: CodeVariables)` que reemplaza los placeholders `{{ENDPOINT_URL}}`, `{{HTTP_METHOD}}`, `{{AUTH_HEADER_*}}`, `{{PAYLOAD}}`, etc.
  3. Incluir sanitización básica para evitar inyecciones de código inválidas.
- **Criterios de aceptación:**
  - La función genera strings con código limpio, bien indentado y sintácticamente válido para los 3 lenguajes.
- **Cómo probar:**
  - Ejecutar una prueba con variables de ejemplo (ej. Stripe checkout) y verificar que los 3 snippets generados no contengan placeholders sin resolver (`{{...}}`).
- **Qué NO debe modificarse:** No invocar LLMs en este módulo; es un generador puramente determinista.
- **Mensaje de Commit sugerido:** `feat(templates): create deterministic code snippet generator for ts py and curl`

---

### Tarea 09: Cliente OpenRouter y Prompting Estructurado de Gemini Flash
- **Objetivo:** Implementar la integración con OpenRouter para invocar `google/gemini-2.5-flash` con esquema de salida JSON estricto para el rol de **Arquitecto de Integraciones**.
- **Contexto:** Ejecuta el razonamiento técnico profundo, selecciona el Top 3, la matriz comparativa y la ⭐ Recomendación del Arquitecto.
- **Archivos a crear/modificar:**
  - `src/lib/openrouter.ts`
- **Dependencias:** Tarea 03 y 08.
- **Pasos de implementación:**
  1. Implementar la función `callArchitectLLM(userQuery: string, candidateApis: ApiRecord[])`.
  2. Diseñar el System Prompt:
     - Rol: *Senior Software Architect & Integration Specialist*.
     - Instrucción: Evaluar las candidatas según la necesidad exacta del usuario.
     - Restricción: Solo recomendar APIs presentes en el listado de candidatas.
     - Obligación: Generar una sección `architect_verdict` eligiendo UNA sola API y detallando por qué, fortalezas clave, riesgos primarios y escenarios precisos donde **NO** se debe usar.
     - Generar variables para el motor de plantillas de código.
  3. Configurar la llamada `fetch` a `https://openrouter.ai/api/v1/chat/completions`:
     - `model: "google/gemini-2.5-flash"`
     - `response_format: { type: "json_object" }`
     - `temperature: 0.3`
     - Headers: `Authorization`, `HTTP-Referer`, `X-Title: Apilary`.
  4. Parsear y validar el JSON devuelto.
- **Criterios de aceptación:**
  - El retorno se adhiere 100% a la interfaz `RecommendationResponse`.
  - Contiene las 3 recomendaciones, matriz comparativa y la ⭐ Recomendación del Arquitecto.
- **Cómo probar:**
  - Probar con una llamada de prueba mockeando `candidateApis` y verificar que el JSON parsea sin excepciones.
- **Qué NO debe modificarse:** No usar librerías externas de LLM (LangChain, LlamaIndex).
- **Mensaje de Commit sugerido:** `feat(ai): integrate openrouter gemini 2.5 flash architect prompting`

---

### Tarea 10: Endpoint `POST /api/recommend`
- **Objetivo:** Construir la API Route principal de Next.js que orquesta todo el flujo (validación de entrada -> prefiltrado SQL -> consulta a Gemini Flash -> renderizado de código -> guardado en tabla `queries` -> respuesta).
- **Contexto:** Endpoint backend que consume la interfaz de usuario.
- **Archivos a crear/modificar:**
  - `src/app/api/recommend/route.ts`
- **Dependencias:** Tarea 04, 07, 08, 09.
- **Pasos de implementación:**
  1. Validar cuerpo de la petición (`{ query: string }`). Si está vacío o tiene menos de 3 caracteres, retornar status 400.
  2. Iniciar cronómetro de tiempo de respuesta (`performance.now()`).
  3. Obtener candidatos con `searchCandidateApis(query)`.
  4. Invocar `callArchitectLLM(query, candidates)`.
  5. Enriquecer las 3 recomendaciones inyectando los snippets de código generados mediante `renderCodeSnippets`.
  6. Guardar en background la consulta en la tabla `queries` de Supabase (con `query_text`, `candidate_ids`, `recommended_ids`, `architect_pick_id`, `response_time_ms`, etc.).
  7. Retornar el payload final con status 200.
  8. Manejar timeouts y errores con mensajes amigables y status 500.
- **Criterios de aceptación:**
  - Responder en menos de 5 segundos con JSON estructurado completo.
  - El registro queda grabado en Supabase con su `query_id` para trazabilidad de feedback.
- **Cómo probar:**
  - Enviar una petición POST vía `curl` o Postman a `http://localhost:3000/api/recommend` con `{"query": "I need an API to send SMS in Chile"}` y validar la respuesta.
- **Qué NO debe modificarse:** No bloquear la respuesta del usuario si el insert en la tabla `queries` falla (usar try/catch silencioso para analítica).
- **Mensaje de Commit sugerido:** `feat(api): implement post /api/recommend orchestration route`

---

### Tarea 11: Endpoint `POST /api/feedback`
- **Objetivo:** Construir la API Route para registrar el feedback de los usuarios (calificación binaria de utilidad y comentarios cualitativos).
- **Contexto:** Permite medir el Criterio de Validación V1 (≥65% de feedback positivo).
- **Archivos a crear/modificar:**
  - `src/app/api/feedback/route.ts`
- **Dependencias:** Tarea 04.
- **Pasos de implementación:**
  1. Validar cuerpo `{ query_id: string, is_useful: boolean, comment?: string }`.
  2. Insertar en la tabla `feedback` de Supabase.
  3. Retornar `{ success: true }` con status 201.
- **Criterios de aceptación:**
  - Inserta correctamente en la tabla y valida que `is_useful` sea booleano.
- **Cómo probar:**
  - Enviar POST a `http://localhost:3000/api/feedback` con un payload de prueba y comprobar el registro en Supabase.
- **Qué NO debe modificarse:** No requerir autenticación para el feedback.
- **Mensaje de Commit sugerido:** `feat(api): implement post /api/feedback route`

---

# Fase 3: Componentes de Interfaz de Usuario (UI)

---

### Tarea 12: Componentes `Header` y `SearchHero`
- **Objetivo:** Crear el encabezado de marca de Apilary y la sección principal de búsqueda con campo de texto expansible, placeholder interactivo y sugerencias rápidas.
- **Contexto:** Primer punto de contacto visual del usuario; debe comunicar inmediatamente la propuesta de valor (*Your AI Integration Architect*).
- **Archivos a crear/modificar:**
  - `src/components/Header.tsx`
  - `src/components/SearchHero.tsx`
  - `src/components/SearchHero.module.css`
- **Dependencias:** Tarea 02.
- **Pasos de implementación:**
  1. `Header.tsx`: Logo minimalista con isotipo de rayo/conexión, nombre **Apilary**, badge "AI Architect" y enlace a GitHub/Docs.
  2. `SearchHero.tsx`:
     - Título H1: *"Tell me what you're building. I'll architect your API integrations."*
     - Subtítulo explicativo enfocado en decisiones de arquitectura.
     - Textarea de entrada con ajuste automático o tamaño cómodo (3 líneas).
     - Botón principal de acción *"Architect My Stack ➤"* con efecto de resplandor sutil (glow).
     - Lista de chips clickeables de ejemplo: *"Subscriptions in LATAM"*, *"OCR for Invoices"*, *"SMS Verification with OTP"*, *"AI Agent Memory"*.
     - Al hacer clic en un chip, rellenar el textarea y enfocarlo.
- **Criterios de aceptación:**
  - El formulario previene envíos vacíos.
  - Diseño responsivo y visualmente pulido en desktop y móvil.
- **Cómo probar:**
  - Renderizar en la página principal, hacer clic en los chips y verificar que el texto se escribe correctamente en el campo.
- **Qué NO debe modificarse:** No agregar dependencias de componentes UI de terceros.
- **Mensaje de Commit sugerido:** `feat(ui): create header and search hero components with prompt chips`

---

### Tarea 13: Componente `ArchitectureBrief` y `ArchitectVerdict`
- **Objetivo:** Construir los componentes que muestran la comprensión técnica del problema y la sección destacada de la ⭐ **Recomendación del Arquitecto**.
- **Contexto:** Elemento diferenciador clave de Apilary: entrega el veredicto directo con defensas y exclusiones claras.
- **Archivos a crear/modificar:**
  - `src/components/ArchitectureBrief.tsx`
  - `src/components/ArchitectVerdict.tsx`
  - `src/components/ArchitectVerdict.module.css`
- **Dependencias:** Tarea 02 y 03.
- **Pasos de implementación:**
  1. `ArchitectureBrief.tsx`: Callout con borde izquierdo azul/violeta que resume el entendimiento técnico del proyecto y los requerimientos críticos detectados.
  2. `ArchitectVerdict.tsx`:
     - Card destacada con borde dorado/púrpura (`--accent-gold` / `--border-highlight`).
     - Badge superior: *"⭐ ARCHITECT'S OFFICIAL RECOMMENDATION"*.
     - Nombre de la API ganadora y justificación central (`core_rationale`).
     - Sección de *"Fortalezas Clave"* con íconos de check verdes.
     - Sección de *"Riesgos Principales a Monitorear"* con íconos de advertencia ámbar.
     - Sección crítica destacada: *"🚫 CUÁNDO NO USAR ESTA API"* en caja con borde rojizo sutil para advertir límites de escalabilidad o geografía.
- **Criterios de aceptación:**
  - La sección resalta visualmente sobre las demás cards como la recomendación de máxima autoridad técnica.
- **Cómo probar:**
  - Pasar props mockeadas y verificar que todos los bloques de información y exclusión se rendericen con tipografía clara y contrastada.
- **Qué NO debe modificarse:** No omitir la sección de "Cuándo no usar esta API".
- **Mensaje de Commit sugerido:** `feat(ui): create architecture brief and architect verdict components`

---

### Tarea 14: Componentes `ResultCard` y `CodeBlock` con Pestañas
- **Objetivo:** Construir las cards de las 3 APIs evaluadas con selector de pestañas para código (TypeScript, Python, cURL) y botón de copia con un solo clic.
- **Contexto:** Permite al desarrollador examinar las opciones alternativas y obtener código de integración inmediato sin salir de la página.
- **Archivos a crear/modificar:**
  - `src/components/ResultCard.tsx`
  - `src/components/CodeBlock.tsx`
  - `src/components/ResultCard.module.css`
- **Dependencias:** Tarea 02 y 03.
- **Pasos de implementación:**
  1. `ResultCard.tsx`:
     - Medalla de ranking (🥇 #1, 🥈 #2, 🥉 #3).
     - Nombre de la API, badge de pricing (`Free tier`, `Pay-as-you-go`), badge de riesgo (`Low`, `Medium`, `High`).
     - Párrafo *"Por qué elegirla"* (`why`).
     - Lista de pros (verde) y contras (rojo/gris).
     - Enlace externo a documentación oficial.
  2. `CodeBlock.tsx`:
     - Barra superior de pestañas: `TypeScript`, `Python`, `cURL`.
     - Botón `Copy Code` que cambia a `✓ Copied!` por 2 segundos tras copiar al portapapeles (`navigator.clipboard.writeText`).
     - Bloque `<pre><code>` estilizado con fuente *JetBrains Mono*, scroll horizontal suave y fondo contrastado.
- **Criterios de aceptación:**
  - El botón de copiar funciona en todos los navegadores modernos.
  - El cambio de pestañas es instantáneo sin recargas de layout.
- **Cómo probar:**
  - Hacer clic en cada pestaña de lenguaje y en el botón de copiar; pegar en un editor y comprobar el contenido.
- **Qué NO debe modificarse:** No usar librerías de resaltado sintáctico pesadas en bundle de cliente.
- **Mensaje de Commit sugerido:** `feat(ui): create result card and interactive code block with language tabs`

---

### Tarea 15: Componente `ComparisonMatrix`
- **Objetivo:** Crear la tabla comparativa técnica side-by-side de las 3 APIs recomendadas evaluadas en 5 dimensiones clave.
- **Contexto:** Facilita la toma de decisión técnica rápida para el desarrollador.
- **Archivos a crear/modificar:**
  - `src/components/ComparisonMatrix.tsx`
  - `src/components/ComparisonMatrix.module.css`
- **Dependencias:** Tarea 02 y 03.
- **Pasos de implementación:**
  1. Renderizar tabla semántica HTML (`<table>`, `<thead>`, `<tbody>`) con diseño responsivo (scroll horizontal en pantallas móviles).
  2. Filas para cada dimensión evaluada (Dificultad de Integración, Costo en Escala, Soporte Regional, Calidad de SDKs, Riesgo de Lock-in).
  3. Columnas con los nombres de las 3 APIs y sus respectivas evaluaciones con etiquetas visuales según el nivel.
- **Criterios de aceptación:**
  - La tabla se adapta correctamente a pantallas pequeñas mediante contenedor con `overflow-x: auto`.
- **Cómo probar:**
  - Redimensionar la ventana a 375px de ancho y verificar legibilidad y scroll horizontal sin romper el layout global.
- **Qué NO debe modificarse:** No omitir ninguna de las 3 APIs en la matriz.
- **Mensaje de Commit sugerido:** `feat(ui): create technical comparison matrix table component`

---

### Tarea 16: Componentes `FeedbackWidget` y `LoadingSkeleton`
- **Objetivo:** Implementar el widget de retroalimentación interactivo y el estado de carga con skeletons animados durante el procesamiento de la consulta.
- **Contexto:** Mantiene una experiencia fluida durante los ~3 segundos de inferencia del LLM y recolecta métricas de validación.
- **Archivos a crear/modificar:**
  - `src/components/FeedbackWidget.tsx`
  - `src/components/LoadingSkeleton.tsx`
  - `src/components/FeedbackWidget.module.css`
- **Dependencias:** Tarea 02 y 11.
- **Pasos de implementación:**
  1. `LoadingSkeleton.tsx`:
     - Indicador animado: *"Analyzing integration requirements & evaluating candidate APIs..."*.
     - 3 bloques de skeleton con animación `pulse` simulando las cards de resultados.
  2. `FeedbackWidget.tsx`:
     - Pregunta: *"Was this architectural recommendation helpful?"*.
     - Botones `👍 Yes` y `👎 No`.
     - Al seleccionar una opción, desplegar un input opcional para comentarios (*"Add a note for our architects..."*) y botón *"Submit Feedback"*.
     - Tras el envío a `/api/feedback`, mostrar mensaje de agradecimiento: *"Thank you! Your feedback helps refine our architecture models."*.
- **Criterios de aceptación:**
  - El feedback se envía exitosamente a la API Route `/api/feedback` vinculando el `query_id`.
- **Cómo probar:**
  - Hacer clic en 👍, escribir un comentario, presionar enviar y validar la llamada en la pestaña Network del inspector.
- **Qué NO debe modificarse:** No bloquear la navegación si el feedback falla.
- **Mensaje de Commit sugerido:** `feat(ui): create feedback widget and animated loading skeleton`

---

### Tarea 17: Ensamblado de Página Principal (`page.tsx`) y Manejo de Estado
- **Objetivo:** Unificar todos los componentes en `src/app/page.tsx`, gestionando los estados de `idle`, `loading`, `success` y `error`.
- **Contexto:** Página única que orquesta la experiencia completa del usuario de extremo a extremo.
- **Archivos a crear/modificar:**
  - `src/app/page.tsx`
  - `src/app/page.module.css`
- **Dependencias:** Tareas 10 a 16.
- **Pasos de implementación:**
  1. Implementar estado con `useState`:
     - `query`: string ingresado.
     - `status`: `'idle' | 'loading' | 'success' | 'error'`.
     - `result`: `RecommendationResponse | null`.
     - `errorMessage`: string.
  2. Conectar el submit de `SearchHero` con llamada `fetch('/api/recommend', { method: 'POST', body: JSON.stringify({ query }) })`.
  3. Renderizar condicionalmente:
     - En `loading`: `LoadingSkeleton`.
     - En `error`: Mensaje amigable con botón de reintentar.
     - En `success`:
       1. `ArchitectureBrief`
       2. `ArchitectVerdict` (⭐ Recomendación Oficial)
       3. Grid de 3 `ResultCard` con código
       4. `ComparisonMatrix`
       5. `FeedbackWidget`
  4. Scroll suave automático a los resultados cuando se completa la consulta.
- **Criterios de aceptación:**
  - Flujo completo 100% funcional sin errores de consola ni recargas de página.
- **Cómo probar:**
  - Ingresar una consulta real, presionar Enter y verificar la transición fluida de estados y renderizado de todos los módulos.
- **Qué NO debe modificarse:** No crear múltiples páginas o rutas innecesarias.
- **Mensaje de Commit sugerido:** `feat(app): assemble main application flow and state orchestration`

---

# Fase 4: Validación y Despliegue

---

### Tarea 18: Suite de Pruebas de Humo con 10 Casos Reales
- **Objetivo:** Ejecutar y documentar una batería de pruebas sobre 10 casos de uso diversos para certificar la estabilidad, precisión del prefiltrado y calidad del veredicto del arquitecto.
- **Contexto:** Verificación final previa al lanzamiento a usuarios reales.
- **Archivos a crear/modificar:**
  - `scripts/test-scenarios.ts`
- **Dependencias:** Tarea 17.
- **Pasos de implementación:**
  1. Crear script con las 10 consultas de validación:
     1. *"Necesito cobrar suscripciones recurrentes en Chile"* (Esperado: Fintoc / Stripe / Mercado Pago).
     2. *"API para extraer texto de facturas en PDF con OCR"* (Esperado: Mindee / OCR.space / Google Cloud Vision).
     3. *"Need a cheap SMS OTP verification service"* (Esperado: Twilio / MessageBird / Vonage).
     4. *"Recomiéndame una base de datos vectorial serverless para un bot de IA"* (Esperado: Pinecone / Qdrant / Supabase).
     5. *"API para geocodificar direcciones de clientes con capa gratuita"* (Esperado: Google Maps / Mapbox / OpenCage).
     6. *"I want to send transactional emails with high deliverability"* (Esperado: Resend / Postmark / SendGrid).
     7. *"Autenticación para Next.js con soporte de Passkeys y Social Login"* (Esperado: Clerk / Auth0 / Supabase Auth).
     8. *"API de transcripción de audio a texto rápida y económica"* (Esperado: Deepgram / Whisper / AssemblyAI).
     9. *"Need an API to generate dynamic social media preview images"* (Esperado: Cloudinary / Bannerbear / Imgproxy).
     10. *"API para consultar clima por coordenadas GPS"* (Esperado: Open-Meteo / OpenWeather / WeatherAPI).
  2. Ejecutar las pruebas contra `/api/recommend` y verificar que el 100% retorna JSON válido y que las 3 opciones son coherentes.
- **Criterios de aceptación:**
  - 10 de 10 escenarios generan recomendaciones relevantes y código sin placeholders rotos.
- **Cómo probar:**
  - Ejecutar `npx tsx scripts/test-scenarios.ts` y verificar que todos los casos pasen con status 200.
- **Qué NO debe modificarse:** No alterar la lógica de negocio para hardcodear respuestas específicas.
- **Mensaje de Commit sugerido:** `test(e2e): add automated smoke test suite for 10 realistic use-cases`

---

### Tarea 19: Configuración de Despliegue en Vercel y Documentación Final
- **Objetivo:** Desplegar el proyecto en Vercel Free, configurar variables de entorno en producción y redactar el archivo `README.md` oficial del repositorio.
- **Contexto:** Poner la aplicación a disposición de los usuarios y cerrar el ciclo de construcción.
- **Archivos a crear/modificar:**
  - `README.md`
  - `vercel.json` (opcional si se requieren headers de seguridad)
- **Dependencias:** Tarea 18.
- **Pasos de implementación:**
  1. Redactar `README.md` con:
     - Descripción de Apilary (*Your AI Integration Architect*).
     - Arquitectura y Stack técnico.
     - Instrucciones de configuración local (`.env.local`, `npm run seed`, `npm run dev`).
     - Métricas de validación y objetivos del MVP.
  2. Desplegar en Vercel (`vercel deploy --prod` o vinculación directa con repositorio de GitHub).
  3. Configurar variables de entorno en Vercel Project Settings (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`).
  4. Realizar prueba de humo en la URL de producción (`https://apilary.vercel.app`).
- **Criterios de aceptación:**
  - La URL pública responde en menos de 4 segundos y procesa consultas de forma idéntica a local.
- **Cómo probar:**
  - Abrir la URL pública en navegador en modo incógnito, realizar una consulta y verificar el registro en Supabase.
- **Qué NO debe modificarse:** No activar planes de pago en Vercel ni Supabase.
- **Mensaje de Commit sugerido:** `docs: add comprehensive readme and finalize production deployment configuration`
