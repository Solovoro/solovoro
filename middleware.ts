import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED = new Set(['en', 'fr'])

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const seg = pathname.split('/')[1]
  if (SUPPORTED.has(seg)) return NextResponse.next()
  // redirect root or non-localized path to default locale
  if (pathname === '/' || !SUPPORTED.has(seg)) {
    const url = req.nextUrl.clone()
    url.pathname = `/en${pathname === '/' ? '/' : pathname}`
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|static|.*\\..*).*)'],
}
