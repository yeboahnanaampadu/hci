import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, siteOrigin } = await req.json()
    if (!email || !password || !siteOrigin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create the user - Supabase will automatically send confirmation email if SMTP is configured
    const supabaseAdmin = getSupabaseAdmin()
    const { data: userCreate, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Will send confirmation email
      user_metadata: full_name ? { full_name } : undefined,
    })
    if (createErr) return NextResponse.json({ error: createErr.message }, { status: 400 })

    return NextResponse.json({ ok: true, userId: userCreate.user.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}


