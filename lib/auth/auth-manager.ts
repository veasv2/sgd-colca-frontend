// lib/auth/auth-manager.ts

import { UsuarioRead, LoginForm } from '@/schemas/seguridad/usuario-schema'

// Configuración
const AUTH_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const TOKEN_KEY = 'sgd_user' // Manteniendo tu convención
const USER_KEY = 'sgd_user_data'
const REFRESH_KEY = 'sgd_refresh_token'

interface LoginResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  user: UsuarioRead
}

export class AuthManager {
  // Verificar si está autenticado
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem(TOKEN_KEY)
    const user = localStorage.getItem(USER_KEY)
    
    if (!token || !user) return false
    
    try {
      // Verificar que el token no esté expirado (opcional)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      
      if (isExpired) {
        this.clearAuth()
        return false
      }
      
      return true
    } catch {
      // Si no puede parsear el JWT, asumir que es válido
      // (esto permite tokens opacos también)
      return true
    }
  }

  // Obtener usuario actual
  static getCurrentUser(): UsuarioRead | null {
    if (typeof window === 'undefined') return null
    
    try {
      const userData = localStorage.getItem(USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  // Obtener token actual
  static getCurrentToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  }

  // Login
  static async login(credentials: LoginForm): Promise<UsuarioRead> {
    try {
      console.log('🚀 Attempting login with:', { username_or_email: credentials.username_or_email })
      
      const response = await fetch(`${AUTH_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username_or_email: credentials.username_or_email,
          password: credentials.password
        }),
      })

      console.log('📡 Login response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`
        
        try {
          const errorData = await response.json()
          console.log('❌ Login error data:', errorData)
          
          // Manejar diferentes formatos de error de FastAPI
          if (errorData.detail) {
            errorMessage = typeof errorData.detail === 'string' 
              ? errorData.detail 
              : JSON.stringify(errorData.detail)
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else {
            errorMessage = JSON.stringify(errorData)
          }
        } catch (parseError) {
          console.log('❌ Error parsing response:', parseError)
          const errorText = await response.text()
          errorMessage = errorText || `Error ${response.status}: ${response.statusText}`
        }

        // Mensajes específicos según el código de estado
        if (response.status === 401) {
          throw new Error('Usuario o contraseña incorrectos')
        } else if (response.status === 422) {
          throw new Error(`Datos inválidos: ${errorMessage}`)
        } else if (response.status === 500) {
          throw new Error('Error interno del servidor')
        } else if (response.status === 404) {
          throw new Error('Endpoint de login no encontrado. Verifica la configuración del servidor.')
        }
        
        throw new Error(errorMessage)
      }

      const data: LoginResponse = await response.json()
      console.log('✅ Login successful:', { 
        hasToken: !!data.access_token, 
        user: data.user?.username 
      })
      
      // Guardar en localStorage y cookies
      this.saveAuth(data.access_token, data.user, data.refresh_token)
      
      return data.user
    } catch (error) {
      console.error('💥 Login error:', error)
      
      // Si es un error de red/conexión
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica que el servidor esté funcionando.')
      }
      
      // Si ya es un Error con mensaje, re-lanzarlo
      if (error instanceof Error) {
        throw error
      }
      
      // Para cualquier otro tipo de error
      throw new Error('Error inesperado durante el login')
    }
  }

  // Logout
  static async logout(): Promise<void> {
    const token = this.getCurrentToken()
    
    // Intentar notificar al servidor
    if (token) {
      try {
        await fetch(`${AUTH_API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      } catch {
        // Si falla, continuar con logout local
      }
    }
    
    this.clearAuth()
  }

  // Refresh token
  static async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    
    if (!refreshToken) return false
    
    try {
      const response = await fetch(`${AUTH_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${refreshToken}` }
      })
      
      if (!response.ok) return false
      
      const data: LoginResponse = await response.json()
      this.saveAuth(data.access_token, data.user, data.refresh_token)
      
      return true
    } catch {
      return false
    }
  }

  // Guardar autenticación
  private static saveAuth(token: string, user: UsuarioRead, refreshToken?: string) {
    // LocalStorage
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    if (refreshToken) {
      localStorage.setItem(REFRESH_KEY, refreshToken)
    }
    
    // Cookie para middleware (httpOnly sería mejor en producción)
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`
  }

  // Limpiar autenticación
  private static clearAuth() {
    // LocalStorage
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REFRESH_KEY)
    
    // Cookies
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }

  // Actualizar datos del usuario
  static updateUser(userData: Partial<UsuarioRead>): void {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return
    
    const updatedUser = { ...currentUser, ...userData }
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  }

  // Verificar permisos
  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    if (!user || user.estado !== 'ACTIVO') return false
    
    const permissions = {
      SUPERADMIN: ['*'], // Acceso a todo
      ALCALDE: ['usuarios.read', 'usuarios.update', 'reports.municipal'],
      FUNCIONARIO: ['usuarios.read', 'profile.update']
    }
    
    const userPermissions = permissions[user.tipo_usuario] || []
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }

  // Verificar roles
  static hasRole(roles: string | string[]): boolean {
    const user = this.getCurrentUser()
    if (!user) return false
    
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.tipo_usuario)
  }
}

// Exportar funciones para compatibilidad con tu código existente
export const isAuthenticated = () => AuthManager.isAuthenticated()
export const getCurrentUser = () => AuthManager.getCurrentUser()
export const getCurrentToken = () => AuthManager.getCurrentToken()
export const login = (credentials: LoginForm) => AuthManager.login(credentials)
export const logout = () => AuthManager.logout()
export const updateUser = (userData: Partial<UsuarioRead>) => AuthManager.updateUser(userData)
export const hasPermission = (permission: string) => AuthManager.hasPermission(permission)
export const hasRole = (roles: string | string[]) => AuthManager.hasRole(roles)

// Tipo para compatibilidad
export type User = UsuarioRead