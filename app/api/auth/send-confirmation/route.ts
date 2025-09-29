import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, siteOrigin } = await req.json()
    if (!email || !password || !siteOrigin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate signup link - Supabase will send email if SMTP is configured
    const supabaseAdmin = getSupabaseAdmin()
    const { error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        data: full_name ? { full_name } : undefined,
        redirectTo: `${siteOrigin}/auth/confirm`,
      },
    })
    if (linkErr) return NextResponse.json({ error: linkErr.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}


