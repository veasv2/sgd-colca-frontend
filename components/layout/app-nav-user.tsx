"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Settings,
  LogOut,
  User,
  Loader2,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'

export function AppNavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  
  // ✅ Usar hook en lugar de props
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // ✅ Función de logout mejorada
  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    
    try {
      await logout('/sign-in')
    } catch (error) {
      console.error('Error durante logout:', error)
      window.location.href = '/sign-in'
    }
  }

  // ✅ Fallback si no hay usuario (edge case)
  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // ✅ Datos del usuario desde el hook
  const currentUser = {
    name: `${user.nombres} ${user.apellidos}`,
    email: user.email,
    avatar: undefined // Agregar si tienes avatars
  }

  // ✅ Función para obtener iniciales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentUser.name}</span>
                <span className="truncate text-xs">{currentUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{currentUser.name}</span>
                  <span className="truncate text-xs">{currentUser.email}</span>
                  {/* ✅ Mostrar tipo de usuario */}
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {user.tipo_usuario.toLowerCase()}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* ✅ Opciones relevantes para tu sistema */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* ✅ Opciones solo para SUPERADMIN */}
            {user.tipo_usuario === 'SUPERADMIN' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Panel Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/admin/users')}>
                    <User className="mr-2 h-4 w-4" />
                    Gestionar Usuarios
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />
            
            {/* ✅ Logout mejorado */}
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 focus:text-red-600"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}