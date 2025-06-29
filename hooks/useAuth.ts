// hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  AuthManager,
  isAuthenticated, 
  getCurrentUser, 
  getCurrentToken,
  logout as authLogout,
  login as authLogin,
  hasPermission,
  hasRole,
  User
} from '@/lib/auth/auth-manager'
import { LoginForm } from '@/schemas/seguridad/usuario-schema'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  const checkAuthStatus = useCallback(() => {
    try {
      const authenticated = isAuthenticated()
      const currentUser = getCurrentUser()
      
      setIsLoggedIn(authenticated)
      setUser(currentUser)
      
      return { authenticated, user: currentUser }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsLoggedIn(false)
      setUser(null)
      return { authenticated: false, user: null }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
    
    // Auto-refresh del token cada 30 minutos
    const interval = setInterval(async () => {
      if (isAuthenticated()) {
        const refreshed = await AuthManager.refreshToken()
        if (refreshed) {
          checkAuthStatus() // Actualizar estado con nuevos datos
        } else {
          // Si el refresh falla, hacer logout
          handleLogout()
        }
      }
    }, 30 * 60 * 1000)
    
    // Listener para eventos de auth
    const handleStorageChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [checkAuthStatus])

  const handleLogin = async (credentials: LoginForm) => {
    setLoading(true)
    try {
      const userData = await authLogin(credentials)
      setUser(userData)
      setIsLoggedIn(true)
      return userData
    } catch (error) {
      setIsLoggedIn(false)
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async (redirectTo: string = '/sign-in') => {
    try {
      await authLogout()
      setUser(null)
      setIsLoggedIn(false)
      router.push(redirectTo)
    } catch (error) {
      console.error('Error during logout:', error)
      // Forzar logout local y redirect
      setUser(null)
      setIsLoggedIn(false)
      window.location.href = redirectTo
    }
  }

  const refreshUserData = useCallback(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const getToken = useCallback(() => {
    return getCurrentToken()
  }, [])

  const updateUserData = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      AuthManager.updateUser(userData)
      setUser(updatedUser)
    }
  }, [user])

  return {
    user,
    loading,
    isLoggedIn,
    login: handleLogin,
    logout: handleLogout,
    refreshUserData,
    updateUser: updateUserData,
    getToken,
    checkAuthStatus
  }
}

// Hook simplificado solo para verificar autenticación
export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authenticated = isAuthenticated()
    setIsLoggedIn(authenticated)
    setLoading(false)
  }, [])

  return { isLoggedIn, loading }
}

// Hook para permisos (nuevo)
export const usePermissions = () => {
  const { user, isLoggedIn } = useAuth()
  
  return {
    // Verificaciones de permisos
    canManageUsers: isLoggedIn && hasPermission('usuarios.delete'),
    canCreateUsers: isLoggedIn && hasPermission('usuarios.create'),
    canViewReports: isLoggedIn && hasPermission('reports.municipal'),
    
    // Verificaciones de roles
    isSuperAdmin: isLoggedIn && hasRole('SUPERADMIN'),
    isAlcalde: isLoggedIn && hasRole('ALCALDE'),
    isFuncionario: isLoggedIn && hasRole('FUNCIONARIO'),
    isAdminLevel: isLoggedIn && hasRole(['SUPERADMIN', 'ALCALDE']),
    
    // Estado del usuario
    isActive: user?.estado === 'ACTIVO',
    isBlocked: user?.bloqueado_hasta ? new Date(user.bloqueado_hasta) > new Date() : false,
    
    // Funciones helper
    checkPermission: (permission: string) => isLoggedIn && hasPermission(permission),
    checkRole: (roles: string | string[]) => isLoggedIn && hasRole(roles),
    
    // Datos del usuario
    fullName: user ? `${user.nombres} ${user.apellidos}` : null,
    userType: user?.tipo_usuario,
    email: user?.email
  }
}

// Hook para datos del usuario actual (nuevo)
export const useCurrentUser = () => {
  const { user, isLoggedIn, updateUser } = useAuth()
  
  return {
    user,
    isLoggedIn,
    updateUser,
    fullName: user ? `${user.nombres} ${user.apellidos}` : null,
    initials: user ? 
      `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase() : 
      null,
    hasFailedAttempts: (user?.intentos_fallidos || 0) > 0,
    lastAccess: user?.ultimo_acceso ? new Date(user.ultimo_acceso) : null
  }
}