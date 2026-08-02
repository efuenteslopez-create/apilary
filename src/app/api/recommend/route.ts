import { NextRequest, NextResponse } from 'next/server';
import { prefilterApis } from '@/lib/prefilter';
import { queryArchitectLLM } from '@/lib/llm';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

const MAX_QUERY_LENGTH = 500;
const MIN_QUERY_LENGTH = 3;

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const queryRaw = typeof body.query === 'string' ? body.query : '';
    const queryText = queryRaw.trim();
    const locale = (body.locale === 'es' ? 'es' : 'en') as 'en' | 'es';

    if (queryText.length < MIN_QUERY_LENGTH) {
      return NextResponse.json(
        {
          error: locale === 'es'
            ? 'Por favor ingresa una consulta válida describiendo tu requerimiento técnico (mínimo 3 caracteres).'
            : 'Please provide a valid query describing your technical integration requirement (min 3 characters).'
        },
        { status: 400 }
      );
    }

    if (queryText.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        {
          error: locale === 'es'
            ? `La consulta excede la longitud máxima permitida de ${MAX_QUERY_LENGTH} caracteres. Por favor sé más conciso.`
            : `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters. Please be more concise.`
        },
        { status: 400 }
      );
    }

    // Step 1: Pre-filtering
    const candidates = await prefilterApis(queryText, 20);

    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        {
          error: locale === 'es'
            ? 'No se encontraron APIs candidatas en el catálogo. Prueba reformulando tu consulta.'
            : 'No candidate APIs found in the catalog. Try broadening your query.'
        },
        { status: 404 }
      );
    }

    // Step 2: Architect LLM Reasoning & Snippet generation
    const response = await queryArchitectLLM(queryText, candidates, locale);

    // Step 3: Server-side logging to Supabase queries table (Service Role)
    if (isSupabaseConfigured()) {
      try {
        // Check if candidate IDs are valid UUIDs for Postgres UUID columns
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const candidateUuids = candidates.map(c => c.id).filter(id => uuidRegex.test(id));
        const recommendedUuids = response.recommendations.map(r => r.api_id).filter(id => uuidRegex.test(id));
        const architectPickUuid = response.architect_verdict.selected_api_id && uuidRegex.test(response.architect_verdict.selected_api_id)
          ? response.architect_verdict.selected_api_id
          : null;

        await supabaseAdmin.from('queries').insert({
          id: response.query_id,
          query_text: queryText,
          selected_category: candidates[0]?.category || null,
          candidate_ids: candidateUuids.length > 0 ? candidateUuids : null,
          recommended_ids: recommendedUuids.length > 0 ? recommendedUuids : null,
          architect_pick_id: architectPickUuid,
          response_payload: response,
          response_time_ms: response.response_time_ms
        });
      } catch (dbErr) {
        console.warn('Logging to Supabase queries table skipped:', dbErr);
      }
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('Error in /api/recommend:', error);
    // Safe error message without exposing internal details
    return NextResponse.json(
      { error: 'An error occurred while evaluating API recommendations. Please try again.' },
      { status: 500 }
    );
  }
}
