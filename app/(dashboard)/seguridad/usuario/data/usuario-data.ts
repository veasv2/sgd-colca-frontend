// app/(dashboard)/seguridad/usuario/data/usuario-data.ts

import {
  IconShield,
  IconUserShield,
  IconUsers,
  IconCrown,
} from '@tabler/icons-react'
import { EstadoUsuario, TipoUsuario } from '@/schemas/seguridad/usuario-schema'

// Mapeo de estados de usuario con sus respectivos estilos
export const estadoUsuarioTypes = new Map<EstadoUsuario, string>([
  ['ACTIVO', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVO', 'bg-neutral-300/40 border-neutral-300 text-neutral-600'],
  ['SUSPENDIDO', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

// Tipos de usuario con iconos y etiquetas
export const tipoUsuarioTypes = [
  {
    label: 'Super Admin',
    value: 'SUPERADMIN' as TipoUsuario,
    icon: IconShield,
    description: 'Acceso completo al sistema',
  },
  {
    label: 'Alcalde',
    value: 'ALCALDE' as TipoUsuario,
    icon: IconCrown,
    description: 'Mayor autoridad municipal',
  },
  {
    label: 'Funcionario',
    value: 'FUNCIONARIO' as TipoUsuario,
    icon: IconUsers,
    description: 'Personal municipal',
  },
] as const

// Opciones para filtros de estado
export const estadoOptions = [
  {
    label: 'Activo',
    value: 'ACTIVO' as EstadoUsuario,
    color: 'text-teal-600',
  },
  {
    label: 'Inactivo',
    value: 'INACTIVO' as EstadoUsuario,
    color: 'text-neutral-600',
  },
  {
    label: 'Suspendido',
    value: 'SUSPENDIDO' as EstadoUsuario,
    color: 'text-red-600',
  },
] as const

// Opciones para filtros de tipo de usuario
export const tipoUsuarioOptions = [
  {
    label: 'Super Admin',
    value: 'SUPERADMIN' as TipoUsuario,
    color: 'text-blue-600',
  },
  {
    label: 'Alcalde',
    value: 'ALCALDE' as TipoUsuario,
    color: 'text-purple-600',
  },
  {
    label: 'Funcionario',
    value: 'FUNCIONARIO' as TipoUsuario,
    color: 'text-green-600',
  },
] as const

// Helper functions para obtener información de tipos
export const getTipoUsuarioInfo = (tipo: TipoUsuario) => {
  return tipoUsuarioTypes.find(t => t.value === tipo)
}

export const getEstadoUsuarioColor = (estado: EstadoUsuario) => {
  return estadoUsuarioTypes.get(estado) || 'bg-neutral-300/40 border-neutral-300'
}

// Configuración para badges de intentos fallidos
export const intentosFallidosConfig = {
  low: { threshold: 0, color: 'bg-green-100 text-green-800 border-green-200' },
  medium: { threshold: 3, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  high: { threshold: 5, color: 'bg-red-100 text-red-800 border-red-200' },
}

export const getIntentosFallidosColor = (intentos: number) => {
  if (intentos === 0) return intentosFallidosConfig.low.color
  if (intentos < intentosFallidosConfig.medium.threshold) return intentosFallidosConfig.medium.color
  return intentosFallidosConfig.high.color
}