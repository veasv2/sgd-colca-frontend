// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuración de rutas
const PROTECTED_PATHS = [
  '/dashboard', 
  '/admin', 
  '/documentos', 
  '/sesiones', 
  '/usuarios',
  '/seguridad'
]

const PUBLIC_PATHS = ['/sign-in', '/sign-up', '/']

const AUTH_PATHS = ['/sign-in', '/sign-up']

const TOKEN_COOKIE = 'sgd_user'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get(TOKEN_COOKIE)?.value

  // Verificar si la ruta requiere autenticación
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path))
  const isPublicPath = PUBLIC_PATHS.includes(pathname)
  const isAuthPath = AUTH_PATHS.includes(pathname)

  // Debug en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ Middleware:', {
      pathname,
      hasToken: !!authToken,
      isProtectedPath,
      isPublicPath,
      isAuthPath
    })
  }

  // Validar token básico (opcional: verificar expiración)
  const isValidToken = authToken && authToken.length > 10

  // **Proteger rutas que requieren autenticación**
  if (isProtectedPath && !isValidToken) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    signInUrl.searchParams.set('reason', 'auth_required')
    
    console.log('❌ Redirecting to sign-in:', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // **Redirigir usuarios autenticados que intentan acceder a auth pages**
  if (isValidToken && isAuthPath) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard'
    console.log('✅ Redirecting authenticated user to:', redirectTo)
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // **Redirigir usuarios autenticados desde home a dashboard**
  if (isValidToken && pathname === '/') {
    console.log('🏠 Redirecting from home to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // **Agregar headers de seguridad**
  const response = NextResponse.next()
  
  // Headers de seguridad
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Agregar info del usuario autenticado al request (opcional)
  if (isValidToken) {
    response.headers.set('X-User-Authenticated', 'true')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - API routes (/api)
     * - Archivos estáticos (_next/static)
     * - Imágenes (_next/image)
     * - Favicon y otros archivos públicos
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}