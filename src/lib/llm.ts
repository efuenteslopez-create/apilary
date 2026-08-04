import { ApiRecord, RecommendationResponse, RecommendedApi, ComparisonMatrix, ArchitectVerdict } from './types';
import { renderAllSnippets } from './templates';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'google/gemini-2.5-flash';
const REQUEST_TIMEOUT_MS = 30000;

interface LLMOutputSchema {
  understanding?: string;
  recommended_api_slugs?: string[];
  recommendations_analysis?: Array<{
    slug?: string;
    api_name?: string;
    why?: string;
    pros?: string[];
    cons?: string[];
    pricing_evaluation?: string;
    risk_level?: 'low' | 'medium' | 'high';
    risk_note?: string;
  }>;
  comparison_matrix?: {
    dimensions?: string[];
    evaluations?: Array<{
      api_name?: string;
      scores?: string[];
    }>;
  };
  architect_verdict?: {
    winner_slug?: string;
    selected_api_name?: string;
    core_rationale?: string;
    key_strengths?: string[];
    primary_risks?: string[];
    when_not_to_use?: string;
  };
}

export async function queryArchitectLLM(
  query: string,
  candidates: ApiRecord[],
  locale: 'en' | 'es' = 'en'
): Promise<RecommendationResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your-openrouter-key' || apiKey.includes('placeholder')) {
    return generateDeterministicArchitectResponse(query, candidates, locale);
  }

  const isEs = locale === 'es';

  const systemPrompt = `You are Apilary — an expert Senior AI Integration Architect and Tech Lead.
Your mission is to analyze developer requirements and recommend exactly 3 APIs from the provided pre-filtered candidate list.

STRICT ARCHITECTURAL RULES:
1. Act like a pragmatic Staff Engineer: identify real-world architectural trade-offs (authentication overhead, SDK ergonomics, pricing models, ecosystem fit, and regional suitability).
2. Choose EXACTLY 3 DISTINCT APIs from the provided candidate list. Never invent or hallucinate API slugs outside the candidate list.
3. Build a 5-dimension comparison matrix: ${isEs ? '["Protocolo y Confiabilidad", "Precios y Capa Gratuita", "Experiencia de Desarrollo (DX)", "Complejidad de Integración", "Escalabilidad y Límites"]' : '["Protocol & Reliability", "Pricing & Free Tier", "Developer Experience (DX)", "Integration Complexity", "Scalability & Limits"]'}.
4. Provide a definitive "⭐ Architect\'s Recommendation" (ArchitectVerdict) picking the single best overall solution for this specific use case from the 3 chosen APIs.
5. Do NOT invent unverified metrics (do not fabricate specific millisecond latencies, uptime SLAs, or fake traffic numbers). Base evaluations solely on technical specs and official documentation.
6. ${isEs ? 'LANGUAGE: Write all explanations, rationale, strengths, risks, when_not_to_use, pros, cons, and evaluations in professional, technical SPANISH (preserve technical terms like SDK, Webhook, REST, OAuth, etc.).' : 'LANGUAGE: Write all content in English.'}
7. Return strictly valid JSON conforming to the requested schema. No markdown formatting outside JSON.`;

  const promptContent = `User Request: "${query}"

Available Pre-Filtered API Candidates:
${JSON.stringify(
  candidates.map(c => ({
    name: c.name,
    slug: c.slug,
    category: c.category,
    description: c.description,
    pricing_summary: c.pricing_summary,
    has_free_tier: c.has_free_tier,
    auth_type: c.auth_type,
    base_url: c.base_url
  })),
  null,
  2
)}

Output JSON schema:
{
  "understanding": "Clear summary of user architectural needs and trade-offs",
  "recommended_api_slugs": ["slug1", "slug2", "slug3"],
  "recommendations_analysis": [
    {
      "slug": "slug1",
      "why": "Detailed technical justification for selecting this API",
      "pros": ["Pro 1", "Pro 2", "Pro 3"],
      "cons": ["Con 1", "Con 2"],
      "pricing_evaluation": "Factual analysis of cost and free tier",
      "risk_level": "low",
      "risk_note": "Key operational or vendor dependency risk"
    }
  ],
  "comparison_matrix": {
    "dimensions": ${isEs ? '["Protocolo y Confiabilidad", "Precios y Capa Gratuita", "Experiencia de Desarrollo (DX)", "Complejidad de Integración", "Escalabilidad y Límites"]' : '["Protocol & Reliability", "Pricing & Free Tier", "Developer Experience (DX)", "Integration Complexity", "Scalability & Limits"]'},
    "evaluations": [
      {
        "api_name": "API Name",
        "scores": ["Factual note 1", "Factual note 2", "Factual note 3", "Factual note 4", "Factual note 5"]
      }
    ]
  },
  "architect_verdict": {
    "winner_slug": "slug1",
    "core_rationale": "Why this API is the definitive #1 architectural choice",
    "key_strengths": ["Strength 1", "Strength 2"],
    "primary_risks": ["Risk 1", "Risk 2"],
    "when_not_to_use": "Specific scenarios where an alternative should be preferred"
  }
}`;

  try {
    const startTime = Date.now();
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://apilary.dev',
        'X-Title': 'Apilary Integration Architect'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptContent }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 3000
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    if (!response.ok) {
      console.warn(`OpenRouter API responded with ${response.status}. Using deterministic engine.`);
      return generateDeterministicArchitectResponse(query, candidates, locale);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return generateDeterministicArchitectResponse(query, candidates, locale);
    }

    const parsed: LLMOutputSchema = JSON.parse(content);
    const responseTimeMs = Date.now() - startTime;

    return assembleAndValidateResponse(query, parsed, candidates, responseTimeMs, locale);
  } catch (error) {
    console.warn('LLM call error or timeout, falling back to deterministic response:', error instanceof Error ? error.message : error);
    return generateDeterministicArchitectResponse(query, candidates, locale);
  }
}

/**
 * Validates and repairs the LLM output before delivering to frontend:
 * - Exactly 3 APIs
 * - No duplicates
 * - All belong to prefiltered candidates
 * - Winner is strictly one of the 3 recommended
 * - If invalid, auto-repairs into a fully compliant response
 */
function assembleAndValidateResponse(
  query: string,
  output: LLMOutputSchema,
  candidates: ApiRecord[],
  responseTimeMs = 350,
  locale: 'en' | 'es' = 'en'
): RecommendationResponse {
  const isEs = locale === 'es';

  // Build candidate lookup indices
  const candidateBySlug = new Map<string, ApiRecord>();
  const candidateByName = new Map<string, ApiRecord>();
  const candidateById = new Map<string, ApiRecord>();

  for (const c of candidates) {
    candidateBySlug.set(c.slug.toLowerCase(), c);
    candidateByName.set(c.name.toLowerCase(), c);
    candidateById.set(c.id, c);
  }

  function resolveCandidate(identifier?: string): ApiRecord | null {
    if (!identifier) return null;
    const lower = identifier.trim().toLowerCase();
    return candidateBySlug.get(lower) ||
      candidateByName.get(lower) ||
      candidateById.get(identifier) ||
      candidates.find(c => c.slug.toLowerCase().includes(lower) || lower.includes(c.slug.toLowerCase())) ||
      null;
  }

  const validRecommendedApis: RecommendedApi[] = [];
  const seenApiSlugs = new Set<string>();

  // 1. Process analysis items from LLM
  if (Array.isArray(output.recommendations_analysis)) {
    for (const analysis of output.recommendations_analysis) {
      if (validRecommendedApis.length >= 3) break;
      const candidate = resolveCandidate(analysis.slug) || resolveCandidate(analysis.api_name);
      if (!candidate || seenApiSlugs.has(candidate.slug)) continue;

      seenApiSlugs.add(candidate.slug);
      validRecommendedApis.push({
        api_id: candidate.id,
        api_name: candidate.name,
        tagline: candidate.description,
        website_url: candidate.website_url,
        docs_url: candidate.docs_url,
        why: analysis.why || (isEs ? 'Recomendación adaptada al caso de uso técnico especificado.' : 'Tailored recommendation matching the specified architecture criteria.'),
        pros: Array.isArray(analysis.pros) && analysis.pros.length > 0 ? analysis.pros : [
          isEs ? `Soporte de integración con ${candidate.sdk_languages?.[0] || 'TypeScript'}` : `Integration support with ${candidate.sdk_languages?.[0] || 'TypeScript'}`,
          candidate.has_free_tier ? (isEs ? 'Capa gratuita disponible' : 'Free tier available') : (isEs ? 'Precios transparentes por consumo' : 'Transparent usage-based pricing')
        ],
        cons: Array.isArray(analysis.cons) && analysis.cons.length > 0 ? analysis.cons : [
          isEs ? 'Requiere gestión de credenciales y límites de tasa' : 'Requires API key management and rate limit handling'
        ],
        pricing_evaluation: analysis.pricing_evaluation || candidate.pricing_summary || (isEs ? 'Precios según uso' : 'Usage-based pricing'),
        risk_level: analysis.risk_level === 'high' || analysis.risk_level === 'medium' ? analysis.risk_level : 'low',
        risk_note: analysis.risk_note || (isEs ? 'Implementar reintentos con backoff exponencial y monitoreo de cuotas.' : 'Implement exponential backoff retries and quota monitoring.'),
        code_snippets: renderAllSnippets(candidate)
      });
    }
  }

  // 2. Check recommended_api_slugs if we still have fewer than 3
  if (validRecommendedApis.length < 3 && Array.isArray(output.recommended_api_slugs)) {
    for (const slug of output.recommended_api_slugs) {
      if (validRecommendedApis.length >= 3) break;
      const candidate = resolveCandidate(slug);
      if (!candidate || seenApiSlugs.has(candidate.slug)) continue;

      seenApiSlugs.add(candidate.slug);
      validRecommendedApis.push(buildRecommendedApiFromRecord(candidate, isEs));
    }
  }

  // 3. Fill any remaining slots from the prefiltered candidates to guarantee EXACTLY 3 APIs
  for (const candidate of candidates) {
    if (validRecommendedApis.length >= 3) break;
    if (!seenApiSlugs.has(candidate.slug)) {
      seenApiSlugs.add(candidate.slug);
      validRecommendedApis.push(buildRecommendedApiFromRecord(candidate, isEs));
    }
  }

  // If even with fill we have less than 3, fallback deterministically
  if (validRecommendedApis.length < 3) {
    return generateDeterministicArchitectResponse(query, candidates, locale);
  }

  // 4. Validate winner / Architect Verdict: winner MUST belong to the top 3 recommended APIs
  let winnerCandidate: RecommendedApi = validRecommendedApis[0];

  const suggestedWinnerSlug = output.architect_verdict?.winner_slug || output.architect_verdict?.selected_api_name;
  if (suggestedWinnerSlug) {
    const resolvedWinner = resolveCandidate(suggestedWinnerSlug);
    if (resolvedWinner) {
      const matchInTop3 = validRecommendedApis.find(a => a.api_id === resolvedWinner.id || a.api_name.toLowerCase() === resolvedWinner.name.toLowerCase());
      if (matchInTop3) {
        winnerCandidate = matchInTop3;
      }
    }
  }

  const verdict: ArchitectVerdict = {
    selected_api_name: winnerCandidate.api_name,
    selected_api_id: winnerCandidate.api_id,
    core_rationale: output.architect_verdict?.core_rationale || (
      isEs
        ? `${winnerCandidate.api_name} destaca como la mejor opción de arquitectura por su equilibrio entre facilidad de integración, documentación y modelo operativo.`
        : `${winnerCandidate.api_name} represents the best architectural fit due to its balance of integration ergonomics, documentation, and operational model.`
    ),
    key_strengths: Array.isArray(output.architect_verdict?.key_strengths) && output.architect_verdict.key_strengths.length > 0
      ? output.architect_verdict.key_strengths
      : [
        isEs ? 'Integración directa con código limpio y sin dependencias pesadas' : 'Direct integration with clean code and no heavy dependencies',
        isEs ? 'Documentación clara y soporte de estándares REST / JSON' : 'Clear documentation and support for standard REST / JSON specifications'
      ],
    primary_risks: Array.isArray(output.architect_verdict?.primary_risks) && output.architect_verdict.primary_risks.length > 0
      ? output.architect_verdict.primary_risks
      : [
        isEs ? 'Dependencia operativa del servicio del proveedor' : 'Operational dependency on third-party service availability'
      ],
    when_not_to_use: output.architect_verdict?.when_not_to_use || (
      isEs
        ? 'No recomendado si se requiere una infraestructura 100% autohospedada (on-premise) o sin conexión a internet.'
        : 'Not recommended if a 100% self-hosted on-premise infrastructure or air-gapped deployment is required.'
    )
  };

  // 5. Build 5-Dimension Comparison Matrix
  const defaultDimensions = isEs ? [
    "Protocolo y Confiabilidad",
    "Precios y Capa Gratuita",
    "Experiencia de Desarrollo (DX)",
    "Complejidad de Integración",
    "Escalabilidad y Límites"
  ] : [
    "Protocol & Reliability",
    "Pricing & Free Tier",
    "Developer Experience (DX)",
    "Integration Complexity",
    "Scalability & Limits"
  ];

  const evaluations = validRecommendedApis.map(recApi => {
    const matchingCandidate = candidateBySlug.get(recApi.api_name.toLowerCase()) || candidates.find(c => c.name === recApi.api_name) || candidates[0];
    
    // Check if LLM gave valid 5 evaluations for this API
    const llmEval = output.comparison_matrix?.evaluations?.find(e => 
      e.api_name?.toLowerCase() === recApi.api_name.toLowerCase()
    );

    if (llmEval && Array.isArray(llmEval.scores) && llmEval.scores.length === 5) {
      return {
        api_name: recApi.api_name,
        scores: llmEval.scores
      };
    }

    // Factual evaluation fallback without fabricated numbers
    return {
      api_name: recApi.api_name,
      scores: isEs ? [
        `${matchingCandidate?.api_type || 'REST'} vía HTTPS`,
        matchingCandidate?.has_free_tier ? 'Capa gratuita disponible' : (matchingCandidate?.pricing_summary || 'Pago por consumo'),
        matchingCandidate?.sdk_languages?.length ? `SDKs: ${matchingCandidate.sdk_languages.slice(0, 3).join(', ')}` : 'Documentación y cURL',
        matchingCandidate?.auth_type === 'apiKey' ? 'API Key en Headers' : matchingCandidate?.auth_type === 'OAuth2' ? 'Flujo OAuth2' : 'Autenticación estándar',
        'Gestión estándar de cuotas y rate limits'
      ] : [
        `${matchingCandidate?.api_type || 'REST'} over HTTPS`,
        matchingCandidate?.has_free_tier ? 'Free tier available' : (matchingCandidate?.pricing_summary || 'Usage-based pricing'),
        matchingCandidate?.sdk_languages?.length ? `SDKs: ${matchingCandidate.sdk_languages.slice(0, 3).join(', ')}` : 'Documentation & cURL',
        matchingCandidate?.auth_type === 'apiKey' ? 'API Key in Headers' : matchingCandidate?.auth_type === 'OAuth2' ? 'OAuth2 Flow' : 'Standard authentication',
        'Standard quota & rate limit management'
      ]
    };
  });

  const matrix: ComparisonMatrix = {
    dimensions: defaultDimensions,
    api_evaluations: evaluations
  };

  return {
    query_id: crypto.randomUUID(),
    understanding: output.understanding || (
      isEs
        ? `Evaluación técnica para: "${query}". Se analizan 3 alternativas principales considerando compatibilidad, costos y ergonomía de desarrollo.`
        : `Technical evaluation for: "${query}". Analyzing 3 primary alternatives balancing compatibility, costs, and developer experience.`
    ),
    recommendations: validRecommendedApis,
    comparison_matrix: matrix,
    architect_verdict: verdict,
    response_time_ms: responseTimeMs
  };
}

function buildRecommendedApiFromRecord(api: ApiRecord, isEs: boolean): RecommendedApi {
  return {
    api_id: api.id,
    api_name: api.name,
    tagline: api.description,
    website_url: api.website_url,
    docs_url: api.docs_url,
    why: isEs
      ? `Recomendación sólida basada en especificaciones técnicas de ${api.category} y soporte para ${api.sdk_languages?.[0] || 'TypeScript'}.`
      : `Solid candidate matching technical requirements for ${api.category} with support for ${api.sdk_languages?.[0] || 'TypeScript'}.`,
    pros: isEs ? [
      `Soporte nativo para ${api.sdk_languages?.[0] || 'TypeScript'} y REST`,
      api.has_free_tier ? 'Capa gratuita disponible para desarrollo y pruebas' : 'Modelo de facturación predecible',
      'Arquitectura de API moderna y mantenida'
    ] : [
      `Native support for ${api.sdk_languages?.[0] || 'TypeScript'} & REST`,
      api.has_free_tier ? 'Free tier available for development & testing' : 'Predictable billing model',
      'Modern and well-maintained API architecture'
    ],
    cons: isEs ? [
      'Acoplamiento a los contratos de datos del proveedor',
      api.auth_type === 'OAuth2' ? 'Requiere gestión del ciclo de vida de tokens OAuth' : 'Requiere custodia segura de API Keys en el servidor'
    ] : [
      'Coupling to provider data contracts',
      api.auth_type === 'OAuth2' ? 'Requires OAuth token lifecycle management' : 'Requires secure server-side API key custody'
    ],
    pricing_evaluation: api.pricing_summary || (isEs ? 'Pago por uso según consumo' : 'Usage-based pricing'),
    risk_level: 'low',
    risk_note: isEs
      ? 'Monitorear los límites de peticiones (rate limits) e implementar reintentos con backoff exponencial.'
      : 'Monitor rate limits and implement exponential backoff retry strategies.',
    code_snippets: renderAllSnippets(api)
  };
}

export function generateDeterministicArchitectResponse(
  query: string,
  candidates: ApiRecord[],
  locale: 'en' | 'es' = 'en'
): RecommendationResponse {
  const topThree = candidates.slice(0, 3);
  if (topThree.length === 0) {
    throw new Error('No candidate APIs found for query');
  }

  const isEs = locale === 'es';
  const winner = topThree[0];

  const understanding = isEs
    ? `Análisis de requerimientos de arquitectura para: "${query}". La evaluación considera velocidad de desarrollo, claridad de integración, transparencia de precios y resiliencia operativa.`
    : `Analysis of architecture requirements for: "${query}". Evaluation considers developer velocity, integration clarity, pricing transparency, and operational resiliency.`;

  const recommendations: RecommendedApi[] = topThree.map((api, idx) => {
    const isWinner = idx === 0;

    const why = isEs
      ? (isWinner
          ? `Opción principal de arquitectura que ofrece la mayor velocidad de desarrollo, SDKs claros y modelo de precios predecible.`
          : `Alternativa sólida con capacidades especializadas o ventajas de costos para flujos específicos.`)
      : (isWinner
          ? `Primary architectural match providing high developer velocity, clear SDKs, and a predictable pricing model.`
          : `Strong alternative offering specialized capabilities or competitive cost advantages for tailored workloads.`);

    const pros = isEs ? [
      `Integración directa con ${api.sdk_languages?.[0] || 'TypeScript'} y REST`,
      api.has_free_tier ? 'Capa gratuita disponible / entorno de pruebas sandbox' : 'Precios predecibles por uso',
      'Arquitectura de API moderna y mantenida'
    ] : [
      `Direct integration with ${api.sdk_languages?.[0] || 'TypeScript'} & REST`,
      api.has_free_tier ? 'Free tier available / sandbox testing environment' : 'Predictable usage-based pricing',
      'Modern and well-maintained API architecture'
    ];

    const cons = isEs ? [
      `Acoplamiento al ecosistema del proveedor`,
      api.auth_type === 'OAuth2' ? 'Requiere gestión del ciclo de vida de tokens OAuth' : 'Requiere custodia segura de API Keys en el servidor'
    ] : [
      `Vendor ecosystem lock-in`,
      api.auth_type === 'OAuth2' ? 'Requires OAuth token refresh lifecycle management' : 'Requires secure server-side API key custody'
    ];

    const pricing = api.pricing_summary || (isEs ? 'Pago por uso estándar' : 'Standard pay-as-you-go pricing');
    const riskNote = isEs
      ? 'Monitorear los límites de peticiones (rate limits) e implementar reintentos con backoff exponencial.'
      : 'Monitor rate limits and implement exponential backoff retry strategies.';

    return {
      api_id: api.id,
      api_name: api.name,
      tagline: api.description,
      website_url: api.website_url,
      docs_url: api.docs_url,
      why,
      pros,
      cons,
      pricing_evaluation: pricing,
      risk_level: idx === 0 ? 'low' : idx === 1 ? 'medium' : 'low',
      risk_note: riskNote,
      code_snippets: renderAllSnippets(api)
    };
  });

  const matrix: ComparisonMatrix = {
    dimensions: isEs ? [
      "Protocolo y Confiabilidad",
      "Precios y Capa Gratuita",
      "Experiencia de Desarrollo (DX)",
      "Complejidad de Integración",
      "Escalabilidad y Límites"
    ] : [
      "Protocol & Reliability",
      "Pricing & Free Tier",
      "Developer Experience (DX)",
      "Integration Complexity",
      "Scalability & Limits"
    ],
    api_evaluations: topThree.map((api) => ({
      api_name: api.name,
      scores: isEs ? [
        `${api.api_type || 'REST'} vía HTTPS`,
        api.has_free_tier ? "Capa Gratuita Disponible" : (api.pricing_summary || "Pago por uso"),
        api.sdk_languages?.length ? `SDKs: ${api.sdk_languages.slice(0, 3).join(', ')}` : "Documentación y cURL",
        api.auth_type === 'apiKey' ? "API Key en Headers" : api.auth_type === 'OAuth2' ? "Flujo OAuth2" : "Autenticación estándar",
        "Control estándar de cuotas y rate limits"
      ] : [
        `${api.api_type || 'REST'} over HTTPS`,
        api.has_free_tier ? "Free Tier Available" : (api.pricing_summary || "Pay-as-you-go"),
        api.sdk_languages?.length ? `SDKs: ${api.sdk_languages.slice(0, 3).join(', ')}` : "Documentation & cURL",
        api.auth_type === 'apiKey' ? "API Key in Headers" : api.auth_type === 'OAuth2' ? "OAuth2 Flow" : "Standard authentication",
        "Standard quota & rate limit control"
      ]
    }))
  };

  const verdict: ArchitectVerdict = {
    selected_api_name: winner.name,
    selected_api_id: winner.id,
    core_rationale: isEs
      ? `${winner.name} ofrece el equilibrio óptimo entre ergonomía para el desarrollador, diseño de API bien documentado y precios claros para este caso de uso.`
      : `${winner.name} delivers the ideal balance between developer ergonomics, well-documented API design, and clear pricing for this use case.`,
    key_strengths: isEs ? [
      `Implementación inicial directa con mínimo código boilerplate`,
      `Compatibilidad nativa con entornos serverless y edge modernos`,
      `Amplia documentación y respaldo del ecosistema técnico`
    ] : [
      `Turnkey starter implementation with minimal boilerplate`,
      `Native compatibility with modern serverless and edge runtimes`,
      `Extensive documentation and technical ecosystem support`
    ],
    primary_risks: isEs ? [
      `Dependencia operativa de la disponibilidad del proveedor`,
      `Acumulación progresiva de costos a muy alta escala transaccional`
    ] : [
      `Operational dependency on third-party service availability`,
      `Gradual fee accumulation at high transactional scale`
    ],
    when_not_to_use: isEs
      ? `Evitar si tu sistema requiere infraestructura local on-premise autohospedada o políticas estrictas de cero proveedores externos.`
      : `Avoid if your system requires self-hosted on-premise infrastructure or strict zero-external-vendor data privacy policies.`
  };

  return {
    query_id: crypto.randomUUID(),
    understanding,
    recommendations,
    comparison_matrix: matrix,
    architect_verdict: verdict,
    response_time_ms: 220
  };
}
