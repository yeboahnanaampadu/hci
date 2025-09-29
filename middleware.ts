
import { NextResponse } from 'next/server'
import { createClient } from './lib/supabase/server'

export async function middleware(req: Request) {
  const url = new URL(req.url)
  if (url.pathname.startsWith('/dashboard')) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.redirect(new URL('/auth/sign-in', url.origin))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
