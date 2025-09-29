import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) {
      console.error('send-reset: missing email', { hasEmail: !!email })
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    // Get production URL from environment variable
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hci-sable-six.vercel.app'

    // Use Supabase's built-in password reset functionality
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/update-password`,
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


