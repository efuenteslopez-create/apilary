export type Locale = 'en' | 'es';

export interface Translations {
  header: {
    architectBadge: string;
    curatedApis: string;
    docsLink: string;
  };
  hero: {
    title: string;
    subtitle: string;
    placeholder: string;
    ctrlEnterTip: string;
    analyzeBtn: string;
    analyzingBtn: string;
    popularScenarios: string;
    presets: Array<{ label: string; query: string }>;
  };
  brief: {
    title: string;
    evaluatedCount: (count: number) => string;
  };
  verdict: {
    badge: string;
    keyStrengths: string;
    operationalRisks: string;
    whenNotToUse: string;
  };
  matrix: {
    title: string;
    subtitle: string;
    dimension: string;
    dimensions: string[];
  };
  results: {
    title: string;
    subtitle: string;
    architecturalFit: string;
    pros: string;
    cons: string;
    pricing: string;
    riskNote: string;
    siteBtn: string;
    docsBtn: string;
    risks: {
      low: string;
      medium: string;
      high: string;
    };
  };
  codeBlock: {
    copy: string;
    copied: string;
  };
  feedback: {
    question: string;
    yes: string;
    no: string;
    placeholder: string;
    submit: string;
    thankYou: string;
  };
  skeleton: {
    evaluating: string;
  };
  errors: {
    unexpected: string;
  };
  footer: {
    tagline: string;
    techStack: string;
    copyright: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    header: {
      architectBadge: 'AI Integration Architect',
      curatedApis: '200+ Curated APIs',
      docsLink: 'Docs & Seed'
    },
    hero: {
      title: 'Your AI Integration Architect',
      subtitle: "Describe what you're building. Apilary evaluates technical trade-offs, delivers the senior architect verdict, and generates starter integration code.",
      placeholder: 'E.g., I need a payment gateway for my SaaS in Chile with recurring direct debit, or an ultra low-latency speech transcription API...',
      ctrlEnterTip: 'to analyze',
      analyzeBtn: 'Get Architect Verdict',
      analyzingBtn: 'Analyzing Architecture...',
      popularScenarios: 'Popular scenarios:',
      presets: [
        { label: '💳 SaaS Subscriptions in Chile (PAC / Bank Debit)', query: 'I am building a B2B SaaS in Chile and need recurring subscriptions with direct bank debit (PAC) and local cards.' },
        { label: '🎙️ Real-time Speech-to-Text (<500ms)', query: 'Looking for ultra low-latency speech-to-text API for live voice assistant agent.' },
        { label: '📱 Multi-carrier SMS OTP with failover', query: 'Need reliable SMS phone verification and OTP delivery with high delivery rates.' },
        { label: '🗄️ Serverless Postgres with Branching', query: 'Serverless relational database for Next.js app with instant branch previews and connection pooling.' },
        { label: '🗺️ Privacy-friendly Geocoding & Maps', query: 'Looking for reverse geocoding and address autocomplete with high rate limits and no tracking.' },
        { label: '📧 Transactional React Emails', query: 'Fast transactional email service for Next.js with React Email components support.' }
      ]
    },
    brief: {
      title: 'Architect Analysis',
      evaluatedCount: (count) => `Evaluated ${count} candidates`
    },
    verdict: {
      badge: "Architect's Recommendation",
      keyStrengths: 'Key Architectural Strengths',
      operationalRisks: 'Operational Risks & Custody',
      whenNotToUse: 'When NOT to use'
    },
    matrix: {
      title: '5-Dimension Architectural Matrix',
      subtitle: 'Direct comparison across key operational criteria',
      dimension: 'Dimension',
      dimensions: [
        'Latency & Reliability',
        'Pricing & Free Tier',
        'Developer Experience (DX)',
        'Integration Complexity',
        'Scalability & Limits'
      ]
    },
    results: {
      title: 'Top Recommended APIs & Integration Snippets',
      subtitle: 'Starter TypeScript, Python, and cURL integration templates',
      architecturalFit: 'Architectural Fit',
      pros: 'Pros',
      cons: 'Trade-offs / Cons',
      pricing: 'Pricing:',
      riskNote: 'Risk note:',
      siteBtn: 'Site',
      docsBtn: 'Docs',
      risks: {
        low: 'Low Risk',
        medium: 'Moderate Risk',
        high: 'High Risk'
      }
    },
    codeBlock: {
      copy: 'Copy Code',
      copied: 'Copied!'
    },
    feedback: {
      question: 'Was this recommendation helpful for your architecture decision?',
      yes: 'Yes, very helpful',
      no: 'Could be better',
      placeholder: 'Optional: What other API were you hoping to see?',
      submit: 'Submit',
      thankYou: '✨ Thank you! Your feedback helps calibrate the AI Architect for future queries.'
    },
    skeleton: {
      evaluating: 'Evaluating 20 candidate APIs & calculating trade-offs...'
    },
    errors: {
      unexpected: 'An unexpected error occurred while analyzing the architecture.'
    },
    footer: {
      tagline: 'Your AI Integration Architect',
      techStack: 'Built with Next.js 15, TypeScript, Supabase, Vanilla CSS & OpenRouter Gemini Flash. Zero-budget engineering.',
      copyright: 'Apilary. Curated with ❤️ for developers worldwide.'
    }
  },
  es: {
    header: {
      architectBadge: 'Arquitecto de Integración IA',
      curatedApis: '200+ APIs Verificadas',
      docsLink: 'Docs y Semilla'
    },
    hero: {
      title: 'Tu Arquitecto de Integración IA',
      subtitle: 'Describe lo que estás construyendo. Apilary evalúa trade-offs técnicos, entrega el veredicto de un Staff Engineer y genera el código de integración inicial (starter).',
      placeholder: 'Ej: Necesito una pasarela de pago para mi SaaS en Chile con suscripción y débito bancario recurrente (PAC), o una API de transcripción de voz con bajísima latencia...',
      ctrlEnterTip: 'para analizar',
      analyzeBtn: 'Obtener Veredicto de Arquitectura',
      analyzingBtn: 'Analizando Arquitectura...',
      popularScenarios: 'Casos de uso populares:',
      presets: [
        { label: '💳 Suscripciones SaaS en Chile (PAC / Débito Bancario)', query: 'Estoy construyendo un SaaS B2B en Chile y necesito suscripciones recurrentes con débito bancario automático (PAC) y tarjetas locales.' },
        { label: '🎙️ Transcripción de Voz en Tiempo Real (<500ms)', query: 'Busco una API de Speech-to-Text de ultra baja latencia para un agente asistente de voz en vivo.' },
        { label: '📱 Códigos OTP por SMS con Failover', query: 'Necesito verificación telefónica por SMS y entrega confiable de OTP con alta tasa de entrega.' },
        { label: '🗄️ Postgres Serverless con Branching', query: 'Base de datos relacional serverless para Next.js con previsualizaciones instantáneas por ramas (branching) y pool de conexiones.' },
        { label: '🗺️ Geocodificación y Mapas Privados', query: 'Busco geocodificación inversa y autocompletado de direcciones con altos límites de tasa y sin rastreo.' },
        { label: '📧 Emails Transaccionales con React', query: 'Servicio rápido de emails transaccionales para Next.js con soporte de componentes React Email.' }
      ]
    },
    brief: {
      title: 'Análisis de Arquitectura',
      evaluatedCount: (count) => `Evaluó ${count} candidatos`
    },
    verdict: {
      badge: 'Recomendación del Arquitecto',
      keyStrengths: 'Fortalezas Clave de Arquitectura',
      operationalRisks: 'Riesgos Operativos y Custodia',
      whenNotToUse: 'Cuándo NO utilizar'
    },
    matrix: {
      title: 'Matriz Arquitectónica en 5 Dimensiones',
      subtitle: 'Comparación directa de criterios operativos clave',
      dimension: 'Dimensión',
      dimensions: [
        'Latencia y Confiabilidad',
        'Precios y Capa Gratuita',
        'Experiencia de Desarrollo (DX)',
        'Complejidad de Integración',
        'Escalabilidad y Límites'
      ]
    },
    results: {
      title: 'APIs Recomendadas y Código de Integración',
      subtitle: 'Plantillas de integración inicial en TypeScript, Python y cURL',
      architecturalFit: 'Ajuste de Arquitectura',
      pros: 'Ventajas',
      cons: 'Compromisos / Desventajas',
      pricing: 'Precios:',
      riskNote: 'Nota de riesgo:',
      siteBtn: 'Sitio',
      docsBtn: 'Docs',
      risks: {
        low: 'Riesgo Bajo',
        medium: 'Riesgo Moderado',
        high: 'Riesgo Alto'
      }
    },
    codeBlock: {
      copy: 'Copiar Código',
      copied: '¡Copiado!'
    },
    feedback: {
      question: '¿Te resultó útil esta recomendación para tu decisión de arquitectura?',
      yes: 'Sí, muy útil',
      no: 'Podría mejorar',
      placeholder: 'Opcional: ¿Qué otra API esperabas ver recomendada?',
      submit: 'Enviar',
      thankYou: '✨ ¡Muchas gracias! Tu opinión ayuda a calibrar el Arquitecto de IA para futuras consultas.'
    },
    skeleton: {
      evaluating: 'Evaluando 20 APIs candidatas y calculando trade-offs...'
    },
    errors: {
      unexpected: 'Ocurrió un error inesperado al analizar la arquitectura.'
    },
    footer: {
      tagline: 'Tu Arquitecto de Integración IA',
      techStack: 'Construido con Next.js 15, TypeScript, Supabase, Vanilla CSS y OpenRouter Gemini Flash. Presupuesto cero.',
      copyright: 'Apilary. Creado con ❤️ para desarrolladores de todo el mundo.'
    }
  }
};
