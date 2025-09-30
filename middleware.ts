
import { NextResponse } from 'next/server'

export async function middleware(req: Request) {
  // No authentication required - allow all access
  return NextResponse.next()
}

export const config = {
  matcher: []
}
