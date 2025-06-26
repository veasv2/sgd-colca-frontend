'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { clearSession } from '@/lib/auth/auth'

interface LogoutButtonProps {
  children?: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
}

export function LogoutButton({ children = 'Cerrar Sesión', variant = 'outline' }: LogoutButtonProps) {
  const router = useRouter()
  
  const handleLogout = () => {
    // Limpiar sesión
    clearSession()
    
    // Redirigir al login
    router.push('/sign-in')
  }
  
  return (
    <Button variant={variant} onClick={handleLogout}>
      {children}
    </Button>
  )
}