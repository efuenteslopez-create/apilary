import { ApiRecord } from './types';
import { supabase, isSupabaseConfigured } from './supabase';
import { getLocalCatalog } from './catalog-local';

const CATEGORY_MAP: Record<string, string[]> = {
  payments: ['payment', 'payments', 'pago', 'pagos', 'checkout', 'stripe', 'fintoc', 'transbank', 'mercadopago', 'billing', 'subscription', 'suscripcion', 'tarjeta', 'credit-card', 'a2a', 'transferencia', 'pac', 'mor'],
  'sms-notifications': ['sms', 'otp', 'notification', 'notifications', 'notificacion', 'notificaciones', 'push', 'twilio', 'whatsapp', '2fa', 'telefonia', 'phone', 'mensaje', 'mensajes'],
  email: ['email', 'correo', 'correos', 'resend', 'sendgrid', 'postmark', 'smtp', 'newsletter', 'transaccional', 'deliverability'],
  'ai-ml': ['ai', 'ia', 'llm', 'transcription', 'transcripcion', 'speech', 'voice', 'audio', 'whisper', 'vision', 'ocr', 'embeddings', 'rag', 'openai', 'claude', 'gemini', 'deepgram', 'elevenlabs', 'deepseek', 'groq'],
  'maps-geo': ['map', 'maps', 'mapa', 'mapas', 'geo', 'geocoding', 'geolocalizacion', 'geolocalización', 'location', 'gps', 'places', 'radar', 'google maps', 'routing', 'ip', 'ipinfo'],
  'auth-identity': ['auth', 'autenticacion', 'autenticación', 'login', 'clerk', 'auth0', 'sso', 'saml', 'passkey', 'passkeys', 'session', 'jwt', 'users', 'usuarios', 'oauth'],
  'storage-media': ['storage', 'almacenamiento', 's3', 'upload', 'uploads', 'archivos', 'files', 'images', 'imagenes', 'videos', 'cloudinary', 'uploadthing', 'cdn'],
  databases: ['database', 'db', 'base de datos', 'postgres', 'sql', 'redis', 'cache', 'sqlite', 'neon', 'turso', 'pinecone', 'qdrant', 'vector'],
  'monitoring-analytics': ['monitoring', 'analytics', 'monitoreo', 'analitica', 'analítica', 'sentry', 'posthog', 'errors', 'errores', 'logs', 'uptime', 'metrics'],
  'scraping-data': ['scraping', 'scrape', 'crawler', 'crawling', 'extraer', 'spider', 'scrapingbee', 'apify', 'firecrawl', 'serp'],
  'weather-environment': ['weather', 'clima', 'tiempo', 'temperatura', 'pronostico', 'pronóstico', 'forecast', 'meteo'],
  'communication-social': ['slack', 'discord', 'telegram', 'github', 'twitter', 'social', 'bot', 'bots', 'chat', 'comunidad'],
  'finance-crypto': ['crypto', 'bitcoin', 'crypto', 'stocks', 'bolsa', 'acciones', 'forex', 'divisas', 'tipo de cambio', 'dolar', 'dólar', 'coingecko'],
  'devtools-productivity': ['devtools', 'deploy', 'vercel', 'cloudflare', 'linear', 'notion', 'airtable', 'productivity']
};

export function extractKeywordsAndCategory(query: string): {
  detectedCategory: string | null;
  extractedKeywords: string[];
} {
  const normalized = query.toLowerCase();
  const words = normalized.replace(/[^a-z0-9áéíóúñ\s-]/gi, ' ').split(/\s+/).filter(Boolean);
  
  let bestCategory: string | null = null;
  let maxCatMatches = 0;

  for (const [cat, triggerWords] of Object.entries(CATEGORY_MAP)) {
    let matches = 0;
    for (const tw of triggerWords) {
      if (normalized.includes(tw)) {
        matches += 2;
      }
    }
    if (matches > maxCatMatches) {
      maxCatMatches = matches;
      bestCategory = cat;
    }
  }

  const extractedKeywords = Array.from(new Set(words.filter(w => w.length > 2)));

  return {
    detectedCategory: bestCategory,
    extractedKeywords
  };
}

export function rankCatalogLocally(query: string, catalog: ApiRecord[], limit = 20): ApiRecord[] {
  const { detectedCategory, extractedKeywords } = extractKeywordsAndCategory(query);
  const normalizedQuery = query.toLowerCase();

  const scored = catalog.map(api => {
    let score = 0;

    // 1. Direct Category Match
    if (detectedCategory && api.category.toLowerCase() === detectedCategory.toLowerCase()) {
      score += 15;
    }

    // 2. Keyword Matches
    if (Array.isArray(api.keywords)) {
      for (const kw of api.keywords) {
        const kwLower = kw.toLowerCase();
        if (normalizedQuery.includes(kwLower)) {
          score += 6;
        }
        for (const userKw of extractedKeywords) {
          if (kwLower.includes(userKw) || userKw.includes(kwLower)) {
            score += 3;
          }
        }
      }
    }

    // 3. Name Match
    const apiNameLower = api.name.toLowerCase();
    if (normalizedQuery.includes(apiNameLower)) {
      score += 20;
    }

    // 4. Description Substring Matches
    const descLower = api.description.toLowerCase();
    for (const userKw of extractedKeywords) {
      if (descLower.includes(userKw)) {
        score += 2;
      }
    }

    return { api, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // If top scores are 0 (very generic query), return top items from detected category or default
  const topCandidates = scored.slice(0, limit).map(item => item.api);
  return topCandidates;
}

export async function prefilterApis(query: string, limit = 20): Promise<ApiRecord[]> {
  const { detectedCategory, extractedKeywords } = extractKeywordsAndCategory(query);

  if (isSupabaseConfigured()) {
    try {
      let queryBuilder = supabase.from('apis').select('*');

      if (detectedCategory) {
        queryBuilder = queryBuilder.eq('category', detectedCategory);
      }

      if (extractedKeywords.length > 0) {
        queryBuilder = queryBuilder.overlaps('keywords', extractedKeywords);
      }

      const { data, error } = await queryBuilder.limit(limit);

      if (!error && data && data.length >= 3) {
        return data as ApiRecord[];
      }
    } catch (e) {
      console.warn('Supabase prefiltering failed, falling back to in-memory ranker:', e);
    }
  }

  // Fallback to in-memory local catalog
  const localCatalog = getLocalCatalog();
  return rankCatalogLocally(query, localCatalog, limit);
}
