import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get site URL for email confirmation redirect
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hci-sable-six.vercel.app'

    // Create user with email confirmation required
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || null,
        },
        emailRedirectTo: `${siteUrl}/auth/confirm`
      }
    })

    if (error) {
      console.error('send-confirmation: signup error', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user && !data.user.email_confirmed_at) {
      return NextResponse.json({
        ok: true,
        message: 'Please check your email for a confirmation link to complete your registration.',
        needsConfirmation: true
      })
    }

    return NextResponse.json({
      ok: true,
      message: 'Account created successfully - you can now sign in',
      user: data.user
    })
  } catch (err: any) {
    console.error('send-confirmation: unexpected error', err)
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}


