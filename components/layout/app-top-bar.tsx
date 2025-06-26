// components/top-bar.tsx
"use client"

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
import { useRouter } from "next/navigation" // ← NUEVO: Importar router
import { clearSession } from "@/lib/auth/auth" // ← NUEVO: Importar función de logout
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
  Menu,
  PanelLeft
} from "lucide-react"

interface TopBarProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function AppTopBar({ user }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useSidebar()
  const router = useRouter() // ← NUEVO: Hook de router

  // Usuario por defecto si no se pasa
  const currentUser = user || {
    name: "Juan Pérez",
    email: "juan@sgdcolca.com",
    avatar: undefined
  }

  // ← NUEVO: Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar sesión (elimina la cookie sgd_user)
    clearSession()
    
    // Redirigir al login
    router.push('/')
  }

  // Obtener iniciales del nombre
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
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" /> // Fallback
    }
  }

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 pr-2">
      {/* Lado izquierdo - Botón de sidebar y título */}
      <div className="flex items-center space-x-4">
        {/* Botón para colapsar sidebar */}
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

      {/* Centro - Barra de búsqueda (opcional) */}
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
              {theme === "light" && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("dark")}
              className={theme === "dark" ? "bg-accent text-accent-foreground" : ""}
            >
              <Moon className="mr-2 h-4 w-4" />
              Oscuro
              {theme === "dark" && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme("system")}
              className={theme === "system" ? "bg-accent text-accent-foreground" : ""}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Sistema
              {theme === "system" && (
                <Check className="ml-auto h-4 w-4" />
              )}
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
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={handleLogout} // ← NUEVO: Conectar función de logout
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}