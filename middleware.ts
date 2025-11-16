import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não está autenticado e tenta acessar área protegida, redireciona para login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Se está autenticado e tenta acessar login/cadastro, redireciona para dashboard
  if (session && (
    req.nextUrl.pathname.startsWith('/auth/login') || 
    req.nextUrl.pathname.startsWith('/auth/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}
