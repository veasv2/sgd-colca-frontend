import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Rutas que requieren autenticación
    const protectedPaths = ['/dashboard', '/admin', '/documentos', '/sesiones', '/usuarios','/seguridad']

    // Rutas públicas (no requieren autenticación)
    const publicPaths = ['/sign-in', '/sign-up', '/'] // ← Agregada '/' como pública

    const { pathname } = request.nextUrl

    // Verificar si la ruta actual requiere autenticación
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
    const isPublicPath = publicPaths.includes(pathname)

    // Obtener el token de autenticación de las cookies
    const authToken = request.cookies.get('sgd_user')?.value

    // Si es una ruta protegida y no hay token, redirigir al sign-in
    if (isProtectedPath && !authToken) {
        const signInUrl = new URL('/sign-in', request.url) // ← Cambiado a /sign-in
        signInUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(signInUrl)
    }

    // Si el usuario está autenticado y trata de acceder al sign-in, redirigir al dashboard
    if (authToken && (pathname === '/sign-in' || pathname === '/sign-up')) { // ← Cambiado
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Si accede a la raíz y está autenticado, redirigir al dashboard
    if (authToken && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // ← REMOVIDO: Ya no redirige '/' a login cuando no hay token
    // La página '/' ahora es pública y manejará la lógica internamente

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}