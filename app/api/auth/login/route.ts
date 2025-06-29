// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/schemas/seguridad/auth-schema"

// URL de tu API de FastAPI
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada con Zod
    const validationResult = loginSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Datos de entrada inválidos",
          details: validationResult.error.errors,
          success: false 
        },
        { status: 400 }
      )
    }
    
    const { email, password } = validationResult.data
    
    // Llamar a tu API de FastAPI
    const fastApiResponse = await fetch(`${BACKEND_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username_or_email: email, // Tu API acepta username o email
        password: password
      })
    })
    
    // Verificar si la respuesta es exitosa
    if (!fastApiResponse.ok) {
      const errorData = await fastApiResponse.json()
      
      return NextResponse.json(
        { 
          error: errorData.detail || "Credenciales inválidas",
          success: false 
        },
        { status: fastApiResponse.status }
      )
    }
    
    // Obtener datos del usuario autenticado
    const authData = await fastApiResponse.json()
    
    // Respuesta exitosa con los datos de tu FastAPI
    return NextResponse.json({
      success: true,
      message: "Login exitoso",
      data: {
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
        token_type: authData.token_type,
        expires_in: authData.expires_in,
        user: {
          id: authData.user.id,
          username: authData.user.username,
          email: authData.user.email,
          nombres: authData.user.nombres,
          apellidos: authData.user.apellidos,
          tipo_usuario: authData.user.tipo_usuario,
          estado: authData.user.estado
        }
      }
    })
    
  } catch (error: unknown) {
    console.error("Error en login:", error)
    
    // Type guard para errores
    const getErrorMessage = (error: unknown): string => {
      if (error instanceof Error) {
        return error.message
      }
      if (typeof error === 'string') {
        return error
      }
      return 'Error desconocido'
    }
    
    // Error de conexión con FastAPI
    if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { 
          error: "Error de conexión con el servidor. Asegúrate de que FastAPI esté corriendo.",
          success: false 
        },
        { status: 503 }
      )
    }
    
    // Error de fetch
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { 
          error: "No se pudo conectar con el servidor de autenticación",
          success: false 
        },
        { status: 503 }
      )
    }
    
    // Error genérico
    return NextResponse.json(
      { 
        error: `Error interno del servidor: ${getErrorMessage(error)}`,
        success: false 
      },
      { status: 500 }
    )
  }
}