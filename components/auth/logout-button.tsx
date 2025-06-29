"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconLogout, IconLoader2 } from '@tabler/icons-react'
import { logoutAndRedirect } from '@/lib/auth/auth' // ✅ Import del archivo unificado

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  redirectTo?: string
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = 'ghost',
  size = 'default',
  redirectTo = '/sign-in',
  className = '',
  showIcon = true,
  children 
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    
    try {
      await logoutAndRedirect(redirectTo)
    } catch (error) {
      console.error('Error durante logout:', error)
      // En caso de error, aún así redirigir
      window.location.href = redirectTo
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? (
        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        showIcon && <IconLogout className="h-4 w-4 mr-2" />
      )}
      {isLoggingOut ? 'Cerrando sesión...' : (children || 'Cerrar sesión')}
    </Button>
  )
}

// Versión simple sin icono
export function SimpleLogoutButton({ className = '' }: { className?: string }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logoutAndRedirect()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`text-red-600 hover:text-red-800 disabled:opacity-50 ${className}`}
    >
      {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  )
}

// Para usar en un dropdown menu
export function LogoutMenuItem() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logoutAndRedirect()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 disabled:opacity-50"
    >
      {isLoggingOut ? (
        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <IconLogout className="h-4 w-4 mr-2" />
      )}
      {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  )
}