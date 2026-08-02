import { prefilterApis } from '../src/lib/prefilter';
import { queryArchitectLLM } from '../src/lib/llm';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SMOKE_TEST_CASES = [
  {
    id: 1,
    title: 'SaaS Payments in Chile (PAC / Bank Debit)',
    query: 'Cobros recurrentes con débito bancario en Chile (PAC)',
    locale: 'es' as const,
    expectedKeywords: ['fintoc', 'transbank', 'stripe']
  },
  {
    id: 2,
    title: 'Real-Time Speech-to-Text Transcription',
    query: 'Reconocimiento y transcripción de voz en tiempo real con baja latencia',
    locale: 'es' as const,
    expectedKeywords: ['deepgram', 'assemblyai', 'google-gemini']
  },
  {
    id: 3,
    title: 'SMS OTP Verification & Failover',
    query: 'Envío de códigos OTP por SMS con alta entregabilidad y failover',
    locale: 'es' as const,
    expectedKeywords: ['twilio', 'vonage', 'sinapi-sms', 'messagebird']
  },
  {
    id: 4,
    title: 'Serverless Postgres with Branching',
    query: 'Base de datos PostgreSQL serverless con soporte de branching para preview environments',
    locale: 'es' as const,
    expectedKeywords: ['neon', 'supabase-db']
  },
  {
    id: 5,
    title: 'Transactional Email with React Email',
    query: 'Servicio de email transaccional para Next.js con componentes React Email',
    locale: 'es' as const,
    expectedKeywords: ['resend', 'postmark']
  },
  {
    id: 6,
    title: 'Global Geocoding & Mapping',
    query: 'Geocodificación y búsqueda de lugares con API de mapas global',
    locale: 'es' as const,
    expectedKeywords: ['google-maps', 'mapbox', 'opencage']
  },
  {
    id: 7,
    title: 'User Authentication with Passkeys & Next.js',
    query: 'Autenticación de usuarios y gestión de sesiones para app Next.js con Passkeys',
    locale: 'es' as const,
    expectedKeywords: ['clerk', 'supabase-auth', 'auth0']
  },
  {
    id: 8,
    title: 'Zero-Egress S3 Object Storage',
    query: 'Almacenamiento de objetos S3 compatible sin costo de egress',
    locale: 'es' as const,
    expectedKeywords: ['cloudflare-r2', 'backblaze-b2', 'aws-s3']
  },
  {
    id: 9,
    title: 'Web Scraping with Headless Chrome & Proxies',
    query: 'Web scraping con renderizado de JavaScript y rotación de proxies',
    locale: 'es' as const,
    expectedKeywords: ['scrapingbee', 'apify', 'firecrawl']
  },
  {
    id: 10,
    title: 'Application Error Tracking & Observability',
    query: 'Tracking de errores, métricas de rendimiento y monitoreo de producción',
    locale: 'es' as const,
    expectedKeywords: ['sentry', 'posthog', 'better-stack']
  }
];

async function runSmokeTests() {
  console.log('🧪 Starting Apilary 10-Scenario Smoke Test Suite...\n');
  let passedCount = 0;

  for (const testCase of SMOKE_TEST_CASES) {
    const startTime = Date.now();
    console.log(`[Test ${testCase.id}/10] ${testCase.title}`);
    console.log(`  Query: "${testCase.query}" (${testCase.locale})`);

    // 1. Prefilter
    const candidates = await prefilterApis(testCase.query, 20);
    if (!candidates || candidates.length === 0) {
      console.error(`  ❌ FAILED: Pre-filter returned 0 candidates`);
      continue;
    }

    // 2. Architect Reasoning
    const result = await queryArchitectLLM(testCase.query, candidates, testCase.locale);
    const duration = Date.now() - startTime;

    // 3. Strict Hardening Assertions
    const hasValidUuid = UUID_REGEX.test(result.query_id);
    const has3Recs = result.recommendations.length === 3;
    const hasNoDuplicates = new Set(result.recommendations.map(r => r.api_id)).size === 3;
    const allFromCandidates = result.recommendations.every(r => candidates.some(c => c.id === r.api_id));
    const winnerIsInTop3 = result.recommendations.some(r => r.api_name === result.architect_verdict.selected_api_name);
    const hasVerdict = Boolean(result.architect_verdict?.selected_api_name && result.architect_verdict?.core_rationale);
    const hasMatrix = result.comparison_matrix?.dimensions?.length === 5 && result.comparison_matrix?.api_evaluations?.length === 3;
    const hasCodeSnippets = result.recommendations.every(
      r => r.code_snippets?.typescript && r.code_snippets?.python && r.code_snippets?.curl
    );

    const allValidationsPassed = hasValidUuid &&
      has3Recs &&
      hasNoDuplicates &&
      allFromCandidates &&
      winnerIsInTop3 &&
      hasVerdict &&
      hasMatrix &&
      hasCodeSnippets;

    if (allValidationsPassed) {
      console.log(`  ✅ PASSED (${duration}ms)`);
      console.log(`     🔑 Query UUID: ${result.query_id}`);
      console.log(`     ⭐ Architect's Pick: ${result.architect_verdict.selected_api_name}`);
      console.log(`     Top 3: ${result.recommendations.map(r => r.api_name).join(', ')}`);
      passedCount++;
    } else {
      console.error(`  ❌ FAILED validations:`, {
        hasValidUuid,
        has3Recs,
        hasNoDuplicates,
        allFromCandidates,
        winnerIsInTop3,
        hasVerdict,
        hasMatrix,
        hasCodeSnippets
      });
    }
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Smoke Test Results: ${passedCount}/${SMOKE_TEST_CASES.length} scenarios passed.`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (passedCount < SMOKE_TEST_CASES.length) {
    process.exit(1);
  }
}

runSmokeTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
