import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, siteOrigin } = await req.json()
    if (!email || !siteOrigin) {
      console.error('send-reset: missing fields', { hasEmail: !!email, hasSiteOrigin: !!siteOrigin })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use Supabase's built-in password reset functionality
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteOrigin}/auth/update-password`,
    })

    if (error) {
      console.error('send-reset: resetPasswordForEmail error', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('send-reset: unexpected error', err)
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}


