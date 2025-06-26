import { NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/lib/validations/auth-schema"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    // Aquí va tu lógica de autenticación
    // Ejemplo básico:
    if (email === "test@test.com" && password === "123456") {
      return NextResponse.json({ 
        success: true,
        token: "fake-token" 
      })
    }
    
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    )
  }
}