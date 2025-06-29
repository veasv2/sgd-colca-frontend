// context/auth-context.tsx

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { UsuarioRead } from '@/schemas/seguridad/usuario-schema'

interface AuthContextType {
  user: UsuarioRead | null
  token: string | null
  login: (token: string, user: UsuarioRead) => void
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UsuarioRead | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!token

  // Cargar datos del storage al inicializar
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        logout()
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: UsuarioRead) => {
    setToken(newToken)
    setUser(newUser)
    
    // Guardar en localStorage
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    
    // Limpiar storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    sessionStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isLoading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook para verificar permisos
export function usePermissions() {
  const { user } = useAuth()
  
  const canManageUsers = user?.tipo_usuario === 'SUPERADMIN'
  const canEditProfile = !!user
  const isAdmin = user?.tipo_usuario === 'SUPERADMIN' || user?.tipo_usuario === 'ALCALDE'
  
  return {
    canManageUsers,
    canEditProfile,
    isAdmin,
    userType: user?.tipo_usuario
  }
}