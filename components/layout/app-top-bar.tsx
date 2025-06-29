// components/top-bar.tsx
"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/context/theme-context"
import { useSidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { 
  Sun, 
  Moon, 
  Monitor, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Check,
  PanelLeft,
  Loader2
} from "lucide-react"

export function AppTopBar() {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useSidebar()
  const router = useRouter()
  
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  // ✅ Fallback simple si no hay usuario (edge case)
  if (!user) {
    return (
      <div className="flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 pr-2">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">SGD Colca</h1>
        </div>
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  // ✅ Datos del usuario simplificados
  const currentUser = {
    name: `${user.nombres} ${user.apellidos}`,
    email: user.email,
    avatar: undefined
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />
      case 'dark': return <Moon className="h-4 w-4" />
      case 'system': return <Monitor className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 pr-2">
      {/* Lado izquierdo - Botón de sidebar y título */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <h1 className="text-lg font-semibold">SGD Colca</h1>
      </div>

      {/* Centro - Barra de búsqueda */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar documentos..."
            className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Lado derecho - Acciones */}
      <div className="flex items-center space-x-2">
        {/* Notificaciones */}
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificaciones</span>
        </Button>

        {/* Toggle de tema */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {getThemeIcon()}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tema</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setTheme("light")}
              className={theme === "light" ? "bg-accent text-accent-foreground" : ""}
            >
              <Sun className="mr-2 h-4 w-4" />
              Claro
              {theme === "light" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("dark")}
              className={theme === "dark" ? "bg-accent text-accent-foreground" : ""}
            >
              <Moon className="mr-2 h-4 w-4" />
              Oscuro
              {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("system")}
              className={theme === "system" ? "bg-accent text-accent-foreground" : ""}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Sistema
              {theme === "system" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menú de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {user.tipo_usuario.toLowerCase()}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={handleLogout}
              disabled={isLoggingOut}
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
      </div>
    </div>
  )
}