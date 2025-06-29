// lib/api/seguridad/usuarios.ts

import { 
  UsuarioRead, 
  UsuarioCreate, 
  UsuarioUpdate, 
  usuarioListSchema,
  usuarioReadSchema 
} from '@/schemas/seguridad/usuario-schema'
import { getCurrentToken } from '@/lib/auth/auth-manager' // Usar el token desde AuthManager

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export class UsuariosAPI {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = `${baseUrl}/usuarios`
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = getCurrentToken()
    
    // Debug mejorado
    console.log('🔍 API Request Details:', {
      fullUrl: url,
      baseUrl: this.baseUrl,
      endpoint,
      hasToken: !!token,
      method: options.method || 'GET'
    })
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Debug de respuesta
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Si la respuesta es exitosa, devolver el JSON
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API Success:', data)
        return data
      }

      // Manejar diferentes tipos de errores
      let errorMessage = `Error ${response.status}`
      
      try {
        // Intentar obtener el mensaje de error del servidor
        const errorData = await response.json()
        console.log('❌ API Error Data:', errorData)
        errorMessage = errorData.detail || errorData.message || errorMessage
      } catch {
        // Si no se puede parsear como JSON, obtener como texto
        try {
          const errorText = await response.text()
          console.log('❌ API Error Text:', errorText)
          errorMessage = errorText || errorMessage
        } catch {
          // Si todo falla, usar mensaje por defecto
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
      }
      
      // Manejar casos específicos
      if (response.status === 401) {
        // Disparar evento para que AuthManager maneje el logout
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
      }
      
      if (response.status === 403) {
        throw new Error('No tienes permisos para realizar esta acción.')
      }

      if (response.status === 404) {
        // Mensaje más específico para 404
        throw new Error(`Endpoint no encontrado: ${url}. Verifica que tu FastAPI esté corriendo y la URL sea correcta.`)
      }

      if (response.status === 422) {
        throw new Error(`Datos inválidos: ${errorMessage}`)
      }

      if (response.status >= 500) {
        throw new Error('Error interno del servidor. Intenta nuevamente.')
      }
      
      throw new Error(errorMessage)

    } catch (error) {
      console.error('💥 API Request failed:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Error de conexión con el servidor')
    }
  }

  // GET /usuarios - Obtener lista de usuarios
  async getUsuarios(skip: number = 0, limit: number = 100): Promise<UsuarioRead[]> {
    const data = await this.request<UsuarioRead[]>(`?skip=${skip}&limit=${limit}`)
    return usuarioListSchema.parse(data)
  }

  // GET /usuarios/{usuario_id} - Obtener usuario por ID
  async getUsuario(usuarioId: number): Promise<UsuarioRead> {
    const data = await this.request<UsuarioRead>(`/${usuarioId}`)
    return usuarioReadSchema.parse(data)
  }

  // GET /usuarios/username/{username} - Obtener usuario por username
  async getUsuarioByUsername(username: string): Promise<UsuarioRead> {
    const data = await this.request<UsuarioRead>(`/username/${username}`)
    return usuarioReadSchema.parse(data)
  }

  // POST /usuarios - Crear nuevo usuario
  async createUsuario(usuarioData: UsuarioCreate): Promise<UsuarioRead> {
    const data = await this.request<UsuarioRead>('', {
      method: 'POST',
      body: JSON.stringify(usuarioData),
    })
    return usuarioReadSchema.parse(data)
  }

  // PUT /usuarios/{usuario_id} - Actualizar usuario
  async updateUsuario(usuarioId: number, usuarioData: UsuarioUpdate): Promise<UsuarioRead> {
    const data = await this.request<UsuarioRead>(`/${usuarioId}`, {
      method: 'PUT',
      body: JSON.stringify(usuarioData),
    })
    return usuarioReadSchema.parse(data)
  }

  // DELETE /usuarios/{usuario_id} - Eliminar usuario
  async deleteUsuario(usuarioId: number): Promise<UsuarioRead> {
    const data = await this.request<UsuarioRead>(`/${usuarioId}`, {
      method: 'DELETE',
    })
    return usuarioReadSchema.parse(data)
  }

  // PATCH /usuarios/{usuario_id}/change-password - Cambiar contraseña
  async changePassword(
    usuarioId: number, 
    passwordData: ChangePasswordRequest
  ): Promise<UsuarioRead> {
    const data = await this.request<UsuarioRead>(`/${usuarioId}/change-password`, {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    })
    return usuarioReadSchema.parse(data)
  }
}

// Instancia singleton del cliente API
export const usuariosAPI = new UsuariosAPI()

// Funciones de conveniencia con mejor manejo de errores
export const getUsuarios = async (skip?: number, limit?: number): Promise<UsuarioRead[]> => {
  try {
    return await usuariosAPI.getUsuarios(skip, limit)
  } catch (error) {
    console.error('Error fetching usuarios:', error)
    throw error
  }
}

export const getUsuario = async (usuarioId: number): Promise<UsuarioRead> => {
  try {
    return await usuariosAPI.getUsuario(usuarioId)
  } catch (error) {
    console.error('Error fetching usuario:', error)
    throw error
  }
}

export const getUsuarioByUsername = (username: string) => 
  usuariosAPI.getUsuarioByUsername(username)

export const createUsuario = (usuarioData: UsuarioCreate) => 
  usuariosAPI.createUsuario(usuarioData)

export const updateUsuario = (usuarioId: number, usuarioData: UsuarioUpdate) => 
  usuariosAPI.updateUsuario(usuarioId, usuarioData)

export const deleteUsuario = (usuarioId: number) => 
  usuariosAPI.deleteUsuario(usuarioId)

export const changePassword = (usuarioId: number, passwordData: ChangePasswordRequest) => 
  usuariosAPI.changePassword(usuarioId, passwordData)