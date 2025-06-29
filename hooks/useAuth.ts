// hooks/useAuth.ts

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  logout, 
  isAuthenticated, 
  getCurrentUser, 
  getCurrentToken,
  User // ✅ Import del tipo desde el archivo unificado
} from '@/lib/auth/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const authenticated = isAuthenticated()
      const currentUser = getCurrentUser()
      
      setIsLoggedIn(authenticated)
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async (redirectTo: string = '/sign-in') => {
    try {
      await logout()
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

  const refreshUserData = () => {
    checkAuthStatus()
  }

  const getToken = () => {
    return getCurrentToken()
  }

  return {
    user,
    loading,
    isLoggedIn,
    logout: handleLogout,
    refreshUserData,
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