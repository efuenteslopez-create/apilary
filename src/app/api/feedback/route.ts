import { NextRequest, NextResponse } from 'next/server';
import { FeedbackPayload } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackPayload = await req.json();

    if (!body || typeof body.is_useful !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid feedback payload. is_useful boolean is required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured() && body.query_id && !body.query_id.startsWith('qry_')) {
      try {
        await supabaseAdmin.from('feedback').insert({
          query_id: body.query_id,
          is_useful: body.is_useful,
          comment: body.comment || null
        });
      } catch (dbErr) {
        console.warn('Feedback logging to Supabase failed:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! It helps improve the Architect recommendations.'
    });
  } catch (error: unknown) {
    console.error('Error in /api/feedback:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
