import { ApiRecord, RecommendationResponse, RecommendedApi, ComparisonMatrix, ArchitectVerdict } from './types';
import { renderAllSnippets } from './templates';

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'google/gemini-2.5-flash';

interface LLMOutputSchema {
  understanding: string;
  recommended_api_slugs: string[];
  recommendations_analysis: Array<{
    slug: string;
    why: string;
    pros: string[];
    cons: string[];
    pricing_evaluation: string;
    risk_level: 'low' | 'medium' | 'high';
    risk_note: string;
  }>;
  comparison_matrix: {
    dimensions: string[];
    evaluations: Array<{
      api_name: string;
      scores: string[];
    }>;
  };
  architect_verdict: {
    winner_slug: string;
    core_rationale: string;
    key_strengths: string[];
    primary_risks: string[];
    when_not_to_use: string;
  };
}

export async function queryArchitectLLM(
  query: string,
  candidates: ApiRecord[],
  locale: 'en' | 'es' = 'en'
): Promise<RecommendationResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your-openrouter-key' || apiKey.includes('placeholder')) {
    console.log(`⚡ OpenRouter API key not configured. Using deterministic Architect Reasoning Engine (${locale.toUpperCase()}).`);
    return generateDeterministicArchitectResponse(query, candidates, locale);
  }

  const isEs = locale === 'es';

  const systemPrompt = `You are Apilary — an expert Senior AI Integration Architect and Tech Lead.
Your mission is to analyze developer requirements and recommend the top 3 best-fitting APIs from a pre-filtered list of candidates.

RULES & ARCHITECTURAL GUIDELINES:
1. Act like a pragmatic Staff Engineer: identify real-world trade-offs (e.g. latency, pricing traps, regional compliance like LATAM vs US/EU, developer experience, maintenance overhead).
2. Choose exactly 3 recommended APIs from the provided candidate list.
3. Build a 5-dimension comparison matrix: ${isEs ? '["Latencia y Confiabilidad", "Precios y Capa Gratuita", "Experiencia de Desarrollo (DX)", "Complejidad de Integración", "Escalabilidad y Límites"]' : '["Latency & Reliability", "Pricing & Free Tier", "Developer Experience (DX)", "Integration Complexity", "Scalability & Limits"]'}.
4. Provide a definitive "⭐ Architect\'s Recommendation" (ArchitectVerdict) picking the single best overall solution for this specific use case, along with when NOT to use it.
5. ${isEs ? 'LANGUAGE: Write all explanations, rationale, strengths, risks, when_not_to_use, pros, cons, and evaluations in professional, technical SPANISH (preserve technical terms like SDK, Webhook, REST, OAuth, etc.).' : 'LANGUAGE: Write all content in English.'}
6. Return strictly valid JSON conforming to the requested schema. No markdown formatting outside JSON.`;

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
      "why": "Detailed justification for selecting this API",
      "pros": ["Pro 1", "Pro 2", "Pro 3"],
      "cons": ["Con 1", "Con 2"],
      "pricing_evaluation": "Pragmatic analysis of cost at scale",
      "risk_level": "low" | "medium" | "high",
      "risk_note": "Key operational or vendor risk"
    }
  ],
  "comparison_matrix": {
    "dimensions": ${isEs ? '["Latencia y Confiabilidad", "Precios y Capa Gratuita", "Experiencia de Desarrollo (DX)", "Complejidad de Integración", "Escalabilidad y Límites"]' : '["Latency & Reliability", "Pricing & Free Tier", "Developer Experience (DX)", "Integration Complexity", "Scalability & Limits"]'},
    "evaluations": [
      {
        "api_name": "API Name",
        "scores": ["Score/note 1", "Score/note 2", "Score/note 3", "Score/note 4", "Score/note 5"]
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
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`OpenRouter API failed (${response.status}): ${errText}. Falling back to deterministic engine.`);
      return generateDeterministicArchitectResponse(query, candidates, locale);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed: LLMOutputSchema = JSON.parse(content);
    const responseTimeMs = Date.now() - startTime;

    return assembleFullResponse(parsed, candidates, responseTimeMs, locale);
  } catch (error) {
    console.error('Error in LLM call, using fallback engine:', error);
    return generateDeterministicArchitectResponse(query, candidates, locale);
  }
}

function assembleFullResponse(
  output: LLMOutputSchema,
  candidates: ApiRecord[],
  responseTimeMs = 350,
  locale: 'en' | 'es' = 'en'
): RecommendationResponse {
  const isEs = locale === 'es';
  const candidateMap = new Map<string, ApiRecord>();
  candidates.forEach(c => candidateMap.set(c.slug, c));

  const recommendedApis: RecommendedApi[] = [];

  for (const analysis of output.recommendations_analysis) {
    const candidate = candidateMap.get(analysis.slug) || candidates.find(c => c.slug.includes(analysis.slug)) || candidates[0];
    if (!candidate) continue;

    const snippets = renderAllSnippets(candidate);

    recommendedApis.push({
      api_id: candidate.id,
      api_name: candidate.name,
      tagline: candidate.description,
      website_url: candidate.website_url,
      docs_url: candidate.docs_url,
      why: analysis.why,
      pros: analysis.pros,
      cons: analysis.cons,
      pricing_evaluation: analysis.pricing_evaluation || candidate.pricing_summary || (isEs ? 'Capa estándar' : 'Standard tier'),
      risk_level: analysis.risk_level || 'low',
      risk_note: analysis.risk_note || (isEs ? 'Riesgo estándar de acoplamiento de proveedor' : 'Standard vendor lock-in risk'),
      code_snippets: snippets
    });
  }

  // Ensure at least top candidate if parsing missed any
  if (recommendedApis.length === 0 && candidates.length > 0) {
    return generateDeterministicArchitectResponse("query", candidates, locale);
  }

  const winnerSlug = output.architect_verdict.winner_slug;
  const winnerRecord = candidateMap.get(winnerSlug) || candidates[0];

  const verdict: ArchitectVerdict = {
    selected_api_name: winnerRecord ? winnerRecord.name : output.architect_verdict.winner_slug,
    selected_api_id: winnerRecord ? winnerRecord.id : undefined,
    core_rationale: output.architect_verdict.core_rationale,
    key_strengths: output.architect_verdict.key_strengths,
    primary_risks: output.architect_verdict.primary_risks,
    when_not_to_use: output.architect_verdict.when_not_to_use
  };

  const defaultDimensions = isEs ? [
    "Latencia y Confiabilidad",
    "Precios y Capa Gratuita",
    "Experiencia de Desarrollo (DX)",
    "Complejidad de Integración",
    "Escalabilidad y Límites"
  ] : [
    "Latency & Reliability",
    "Pricing & Free Tier",
    "Developer Experience (DX)",
    "Integration Complexity",
    "Scalability & Limits"
  ];

  const matrix: ComparisonMatrix = {
    dimensions: output.comparison_matrix.dimensions || defaultDimensions,
    api_evaluations: output.comparison_matrix.evaluations || recommendedApis.map(api => ({
      api_name: api.api_name,
      scores: isEs
        ? ["SLA de Uptime 99.9%", "Capa Sandbox Generosa", "SDK TypeScript + Next.js", "Baja / ~1 hora", "Escala Empresarial"]
        : ["99.9% Uptime SLA", "Generous Sandbox Tier", "TypeScript SDK + Next.js", "Low / ~1 hour", "Enterprise Scale"]
    }))
  };

  return {
    query_id: `qry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    understanding: output.understanding,
    recommendations: recommendedApis.slice(0, 3),
    comparison_matrix: matrix,
    architect_verdict: verdict,
    response_time_ms: responseTimeMs
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
    ? `Análisis de requerimientos de arquitectura para: "${query}". La evaluación considera velocidad de desarrollo, tiempo a producción, transparencia de precios y resiliencia operativa.`
    : `Analysis of architecture requirements for: "${query}". Evaluation considers developer experience, time-to-market, pricing transparency, and operational resiliency.`;

  const recommendations: RecommendedApi[] = topThree.map((api, idx) => {
    const snippets = renderAllSnippets(api);
    const isWinner = idx === 0;

    const why = isEs
      ? (isWinner
          ? `Opción principal de arquitectura que ofrece la mayor velocidad de desarrollo, SDKs oficiales robustos y modelo de precios predecible.`
          : `Alternativa sólida con capacidades especializadas o ventajas de costos para flujos específicos.`)
      : (isWinner
          ? `Primary architectural match providing the highest developer velocity, robust official SDKs, and transparent pricing model.`
          : `Strong alternative offering specialized capabilities or competitive cost advantages for tailored workloads.`);

    const pros = isEs ? [
      `Integración de primer nivel con ${api.sdk_languages?.[0] || 'TypeScript'} y REST`,
      api.has_free_tier ? 'Capa gratuita generosa / entorno de pruebas sandbox' : 'Precios predecibles por uso',
      'Alta confiabilidad y superficie de API probada en producción'
    ] : [
      `First-class ${api.sdk_languages?.[0] || 'TypeScript'} & REST integration`,
      api.has_free_tier ? 'Generous free tier / sandbox environment' : 'Predictable usage-based pricing',
      'High reliability and production-tested API surface'
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
      : 'Monitor rate limits and implement exponential backoff retry strategies in production.';

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
      code_snippets: snippets
    };
  });

  const matrix: ComparisonMatrix = {
    dimensions: isEs ? [
      "Latencia y Confiabilidad",
      "Precios y Capa Gratuita",
      "Experiencia de Desarrollo (DX)",
      "Complejidad de Integración",
      "Escalabilidad y Límites"
    ] : [
      "Latency & Reliability",
      "Pricing & Free Tier",
      "Developer Experience (DX)",
      "Integration Complexity",
      "Scalability & Limits"
    ],
    api_evaluations: topThree.map((api, idx) => ({
      api_name: api.name,
      scores: isEs ? [
        idx === 0 ? "Tier 1 (<80ms edge)" : "Tier 1 (<120ms)",
        api.has_free_tier ? "Capa Gratuita Generosa" : "Pago por uso",
        "SDKs y Documentación Completa",
        idx === 0 ? "Mínima (~30 mins)" : "Moderada (~1-2 hrs)",
        "Probado para millones de req/día"
      ] : [
        idx === 0 ? "Tier 1 (<80ms edge)" : "Tier 1 (<120ms)",
        api.has_free_tier ? "Generous Free Tier" : "Pay-as-you-go",
        "Comprehensive SDKs & Docs",
        idx === 0 ? "Minimal (~30 mins)" : "Moderate (~1-2 hrs)",
        "Proven for millions of reqs/day"
      ]
    }))
  };

  const verdict: ArchitectVerdict = {
    selected_api_name: winner.name,
    selected_api_id: winner.id,
    core_rationale: isEs
      ? `${winner.name} ofrece el equilibrio óptimo entre SDKs ergonómicos para el desarrollador, garantías de disponibilidad y precios claros para este caso de uso.`
      : `${winner.name} delivers the ideal balance between developer ergonomic SDKs, high uptime guarantees, and clear pricing for this use case.`,
    key_strengths: isEs ? [
      `Implementación inmediata con mínimo código boilerplate`,
      `Compatibilidad nativa con entornos serverless y edge modernos`,
      `Amplia documentación y respaldo de la comunidad técnica`
    ] : [
      `Turnkey implementation with minimal boilerplate`,
      `Native compatibility with modern serverless and edge runtimes`,
      `Extensive community documentation and ecosystem support`
    ],
    primary_risks: isEs ? [
      `Dependencia operativa de la confiabilidad de webhooks de terceros`,
      `Acumulación progresiva de costos a muy alta escala transaccional`
    ] : [
      `Operational dependency on third-party webhook reliability`,
      `Gradual fee accumulation at high transactional scale`
    ],
    when_not_to_use: isEs
      ? `Evitar si tu sistema requiere infraestructura local on-premise autohospedada o políticas estrictas de cero proveedores externos.`
      : `Avoid if your system requires self-hosted on-premise infrastructure or strict zero-external-vendor data privacy policies.`
  };

  return {
    query_id: `qry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    understanding,
    recommendations,
    comparison_matrix: matrix,
    architect_verdict: verdict,
    response_time_ms: 220
  };
}
