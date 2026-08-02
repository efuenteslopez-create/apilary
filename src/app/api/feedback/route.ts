import { NextRequest, NextResponse } from 'next/server';
import { FeedbackPayload } from '@/lib/types';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  try {
    let body: FeedbackPayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    if (!body || typeof body.is_useful !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid feedback payload. is_useful boolean is required.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured() && body.query_id) {
      // Validate that query_id is a valid UUID
      if (UUID_REGEX.test(body.query_id)) {
        try {
          const { error } = await supabaseAdmin.from('feedback').insert({
            query_id: body.query_id,
            is_useful: body.is_useful,
            comment: typeof body.comment === 'string' ? body.comment.trim().slice(0, 1000) : null
          });

          if (error) {
            console.warn('Feedback insert error in Supabase:', error.message);
          }
        } catch (dbErr) {
          console.warn('Feedback logging to Supabase failed:', dbErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!'
    });
  } catch (error: unknown) {
    console.error('Error in /api/feedback:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving feedback.' },
      { status: 500 }
    );
  }
}
