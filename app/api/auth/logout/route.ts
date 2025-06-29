// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server"

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    // Obtener el token del header Authorization
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: "Token de autorización requerido",
          success: false 
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remover "Bearer "

    // Llamar al endpoint de logout de FastAPI (si existe)
    try {
      const fastApiResponse = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })

      // Si FastAPI responde con error, no es crítico para el logout
      if (!fastApiResponse.ok) {
        console.warn('FastAPI logout failed, but continuing with client logout')
      }

    } catch (error) {
      console.warn('Error calling FastAPI logout:', error)
      // No bloqueamos el logout si FastAPI no responde
    }

    // Respuesta exitosa - el cliente se encargará de limpiar las cookies/localStorage
    return NextResponse.json({
      success: true,
      message: "Logout exitoso"
    })
    
  } catch (error) {
    console.error("Error en logout:", error)
    
    // Aún en caso de error, permitimos el logout del cliente
    return NextResponse.json({
      success: true,
      message: "Logout completado (con advertencias)"
    })
  }
}