import { NextRequest, NextResponse } from 'next/server';
import { prefilterApis } from '@/lib/prefilter';
import { queryArchitectLLM } from '@/lib/llm';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const queryText = (body?.query || '').trim();
    const locale = (body?.locale === 'es' ? 'es' : 'en') as 'en' | 'es';

    if (!queryText || queryText.length < 3) {
      return NextResponse.json(
        { error: locale === 'es' ? 'Por favor ingresa una consulta válida describiendo tu requerimiento de integración (mínimo 3 caracteres).' : 'Please provide a valid query describing your integration requirement (min 3 characters).' },
        { status: 400 }
      );
    }

    // Step 1: Pre-filtering
    const candidates = await prefilterApis(queryText, 20);

    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: locale === 'es' ? 'No se encontraron APIs coincidentes en el catálogo curado. Prueba ampliando tu consulta.' : 'No matching APIs found in the curated catalog. Try broadening your query.' },
        { status: 404 }
      );
    }

    // Step 2: Architect LLM Reasoning & Snippet generation
    const response = await queryArchitectLLM(queryText, candidates, locale);

    // Step 3: Optional async logging to Supabase (non-blocking)
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          await supabaseAdmin.from('queries').insert({
            query_text: queryText,
            selected_category: candidates[0]?.category,
            candidate_ids: candidates.map(c => c.id).filter(id => !id.startsWith('local-')),
            recommended_ids: response.recommendations.map(r => r.api_id).filter(id => !id.startsWith('local-')),
            architect_pick_id: response.architect_verdict.selected_api_id && !response.architect_verdict.selected_api_id.startsWith('local-')
              ? response.architect_verdict.selected_api_id
              : null,
            response_payload: response,
            response_time_ms: response.response_time_ms
          });
        } catch (dbErr) {
          console.warn('Logging to Supabase queries table skipped:', dbErr);
        }
      })();
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('Error in /api/recommend:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
