import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rsvpSchema } from '@/lib/schema';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const guestEmail = session?.user?.email;
    if (!guestEmail) {
      return NextResponse.json({ error: 'Please sign in with Google before sending your RSVP.' }, { status: 401 });
    }

    const payload = rsvpSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: payload.error.issues[0]?.message ?? 'Invalid RSVP.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.info('Authenticated RSVP received in local mode:', { ...payload.data, guestEmail });
      return NextResponse.json({ ok: true, mode: 'local' });
    }

    const { error } = await supabase.from('rsvps').insert({
      guest_email: guestEmail,
      full_name: payload.data.fullName,
      attendance: payload.data.attendance,
      dietary: payload.data.dietary,
      message: payload.data.message || null,
    });

    if (error?.code === '23505') {
      return NextResponse.json({ error: 'This Google account has already sent an RSVP.' }, { status: 409 });
    }
    if (error) {
      console.error('RSVP insert failed:', error);
      return NextResponse.json({
        error: process.env.NODE_ENV === 'development' ? error.message : 'We could not save your RSVP. Please try again.',
      }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('RSVP request failed:', error);
    return NextResponse.json({
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'We could not save your RSVP. Please try again.',
    }, { status: 500 });
  }
}
