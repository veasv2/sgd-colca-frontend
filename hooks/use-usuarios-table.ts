// hooks/use-usuarios-table.ts

import { useState } from 'react'
import { ColumnDef, VisibilityState } from '@tanstack/react-table'
import { UsuarioRead } from '@/schemas/seguridad/usuario-schema'

// Configuración de columnas por defecto (ocultas)
const DEFAULT_HIDDEN_COLUMNS: VisibilityState = {
  intentos_fallidos: false, // Oculta por defecto
  ultimo_acceso: false,     // Oculta en móvil/tablet
  fecha_creacion: false,    // Oculta en móvil
  dni: false,               // Oculta en móvil
  telefono: false,          // Oculta en móvil
}

// Hook para manejar la configuración de la tabla
export function useUsuariosTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_HIDDEN_COLUMNS)

  // Función para restaurar visibilidad por defecto
  const resetColumnVisibility = () => {
    setColumnVisibility(DEFAULT_HIDDEN_COLUMNS)
  }

  // Función para mostrar todas las columnas
  const showAllColumns = () => {
    setColumnVisibility({})
  }

  // Función para ocultar columnas sensibles (para usuarios no admin)
  const hideSensitiveColumns = () => {
    setColumnVisibility(prev => ({
      ...prev,
      intentos_fallidos: false,
    }))
  }

  return {
    columnVisibility,
    setColumnVisibility,
    resetColumnVisibility,
    showAllColumns,
    hideSensitiveColumns,
  }
}

// Configuración de la tabla para diferentes tipos de usuario
export function getTableConfigForUser(userType: string) {
  const baseConfig = DEFAULT_HIDDEN_COLUMNS

  switch (userType) {
    case 'SUPERADMIN':
      // Mostrar columnas sensibles para superadmin
      return {
        ...baseConfig,
        intentos_fallidos: true,
      }
    
    case 'ALCALDE':
      // Mostrar algunas columnas para alcalde
      return {
        ...baseConfig,
        fecha_creacion: true,
        ultimo_acceso: true,
      }
    
    case 'FUNCIONARIO':
    default:
      // Configuración mínima para funcionarios
      return baseConfig
  }
}