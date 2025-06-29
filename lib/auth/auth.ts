// lib/auth/auth.ts

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface User {
  id: number
  username: string
  email: string
  nombres: string
  apellidos: string
  tipo_usuario: string
  estado: string
  puesto_id?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  data?: {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    user: User
  }
  error?: string
}

// ============================================================================
// FUNCIONES DE GESTIÓN DE COOKIES Y STORAGE
// ============================================================================

/**
 * Guardar token de autenticación en cookies y localStorage
 */
export const saveAuthSession = (token: string, refreshToken: string, user: User, expiresIn: number): void => {
  try {
    // Guardar en cookie para que el middleware lo pueda leer
    document.cookie = `sgd_user=${token}; path=/; max-age=${expiresIn}; secure; samesite=strict`
    
    // Guardar en localStorage para uso del cliente
    localStorage.setItem('access_token', token)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    
    console.log('Sesión guardada exitosamente')
  } catch (error) {
    console.error('Error al guardar sesión:', error)
    throw new Error('Error al guardar la sesión')
  }
}

/**
 * Limpiar sesión completa
 */
export const clearAuthSession = (): void => {
  try {
    // Eliminar cookie
    document.cookie = 'sgd_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict'
    
    // Limpiar localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    
    console.log('Sesión limpiada exitosamente')
  } catch (error) {
    console.error('Error al limpiar sesión:', error)
  }
}

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    // Verificar token en localStorage
    const token = localStorage.getItem('access_token')
    
    // Verificar cookie
    const cookieExists = document.cookie.includes('sgd_user=')
    
    return !!(token && cookieExists)
  } catch (error) {
    console.error('Error verificando autenticación:', error)
    return false
  }
}

/**
 * Obtener usuario actual del localStorage
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    return null
  }
}

/**
 * Obtener token actual
 */
export const getCurrentToken = (): string | null => {
  if (typeof window === 'undefined') return null
  
  return localStorage.getItem('access_token')
}

// ============================================================================
// FUNCIONES DE LOGIN
// ============================================================================

/**
 * Realizar login con email y contraseña
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })

    const result = await response.json()

    if (result.success && result.data) {
      // Guardar sesión automáticamente
      saveAuthSession(
        result.data.access_token,
        result.data.refresh_token,
        result.data.user,
        result.data.expires_in
      )
      
      return result
    } else {
      return {
        success: false,
        error: result.error || 'Error al iniciar sesión'
      }
    }
  } catch (error) {
    console.error('Error en login:', error)
    return {
      success: false,
      error: 'Error de conexión. Verifica que el servidor esté funcionando.'
    }
  }
}

/**
 * Login silencioso usando token almacenado (para verificar si sigue válido)
 */
export const silentLogin = async (): Promise<boolean> => {
  try {
    const token = getCurrentToken()
    if (!token) return false

    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return response.ok
  } catch (error) {
    console.error('Error en login silencioso:', error)
    return false
  }
}

// ============================================================================
// FUNCIONES DE LOGOUT
// ============================================================================

/**
 * Cerrar sesión (logout)
 */
export const logout = async (callBackend: boolean = true): Promise<void> => {
  try {
    // Notificar al backend si se requiere
    if (callBackend) {
      const token = getCurrentToken()
      
      if (token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        } catch (error) {
          console.warn('Error al notificar logout al servidor:', error)
          // No bloqueamos el logout local si falla el servidor
        }
      }
    }

    // Limpiar sesión local
    clearAuthSession()
    
    console.log('Logout exitoso')
  } catch (error) {
    console.error('Error durante logout:', error)
    // Aún así limpiamos los datos locales
    clearAuthSession()
  }
}

/**
 * Cerrar sesión y redirigir
 */
export const logoutAndRedirect = async (redirectTo: string = '/sign-in'): Promise<void> => {
  await logout()
  window.location.href = redirectTo
}

// ============================================================================
// FUNCIONES DE REFRESH TOKEN
// ============================================================================

/**
 * Renovar token usando refresh token
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return false

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    })

    if (response.ok) {
      const result = await response.json()
      
      if (result.success && result.data) {
        // Actualizar solo el access token
        localStorage.setItem('access_token', result.data.access_token)
        document.cookie = `sgd_user=${result.data.access_token}; path=/; max-age=${result.data.expires_in}; secure; samesite=strict`
        
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('Error renovando token:', error)
    return false
  }
}

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================

/**
 * Verificar si el usuario tiene un rol específico
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser()
  return user?.tipo_usuario === role
}

/**
 * Verificar si el usuario es SUPERADMIN
 */
export const isSuperAdmin = (): boolean => {
  return hasRole('SUPERADMIN')
}

/**
 * Obtener nombre completo del usuario
 */
export const getUserFullName = (): string => {
  const user = getCurrentUser()
  return user ? `${user.nombres} ${user.apellidos}` : ''
}

/**
 * Verificar estado de la sesión (para debugging)
 */
export const getSessionInfo = () => {
  return {
    isAuthenticated: isAuthenticated(),
    user: getCurrentUser(),
    token: getCurrentToken() ? 'Present' : 'Not found',
    cookie: document.cookie.includes('sgd_user=') ? 'Present' : 'Not found'
  }
}