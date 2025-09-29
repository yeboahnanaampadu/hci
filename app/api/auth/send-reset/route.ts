import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { email, siteOrigin } = await req.json()
    if (!email || !siteOrigin) {
      console.error('send-reset: missing fields', { hasEmail: !!email, hasSiteOrigin: !!siteOrigin })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate password recovery link - Supabase will send email if SMTP is configured
    const supabaseAdmin = getSupabaseAdmin()
    const { error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${siteOrigin}/auth/update-password` },
    })

    if (linkErr) {
      console.error('send-reset: generateLink error', linkErr)
      return NextResponse.json({ error: linkErr.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}


