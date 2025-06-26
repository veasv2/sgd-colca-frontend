// lib/auth.ts

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    email: string
    name: string
  }
  error?: string
}

// ← FUNCIÓN ACTUAL: Validación interna
async function loginInternal(credentials: LoginCredentials): Promise<LoginResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const validEmail = 'veas.v2@gmail.com'
  const validPassword = 'd$s1gDA1'
  
  if (credentials.email === validEmail && credentials.password === validPassword) {
    return {
      success: true,
      token: 'fake_token_' + Date.now(),
      user: {
        id: '1',
        email: validEmail,
        name: 'Victor'
      }
    }
  } else {
    return {
      success: false,
      error: 'Email o contraseña incorrectos'
    }
  }
}

// ← FUNCIÓN FUTURA: Llamada a API real
async function loginAPI(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    const data = await response.json()
    
    if (response.ok) {
      return {
        success: true,
        token: data.token,
        user: data.user
      }
    } else {
      return {
        success: false,
        error: data.message || 'Error al iniciar sesión'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error de conexión'
    }
  }
}

// ← FUNCIÓN PRINCIPAL: Cambiar aquí para usar API real
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // Para usar validación interna:
  return loginInternal(credentials)
  
  // Para cambiar a API real, comentar arriba y descomentar abajo:
  // return loginAPI(credentials)
}

// Función para guardar sesión
export function saveSession(token: string) {
  document.cookie = `sgd_user=${token}; path=/; max-age=86400` // 24 horas
}

// Función para limpiar sesión
export function clearSession() {
  document.cookie = 'sgd_user=; path=/; max-age=0'
}