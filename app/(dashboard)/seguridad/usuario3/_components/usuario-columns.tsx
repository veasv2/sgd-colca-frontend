import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/schemas/seguridad/usuario2-schema'
import {
  createSelectColumn,
  createTextColumn,
  createEmailColumn,
  createPhoneColumn,
  createStatusColumn,
  createIconTextColumn,
  createFullNameColumn,
  createActionsColumn
} from '@/utils/column-factories'
import { callTypes, userTypes } from '../data/usuario-data'

// Columnas usando factories - ¡Mucho más simple!
export const usuarioColumns: ColumnDef<User>[] = [
  // Columna de selección
  createSelectColumn<User>(),
  
  // Username (sticky)
  createTextColumn<User>('username', 'Username', {
    sticky: true,
    enableHiding: false,
    maxWidth: 'max-w-36'
  }),
  
  // Nombre completo
  createFullNameColumn<User>('firstName', 'lastName'),
  
  // Email
  createEmailColumn<User>(),
  
  // Teléfono
  createPhoneColumn<User>(),
  
  // Status con badges
  createStatusColumn<User>(callTypes),
  
  // Role con iconos
  createIconTextColumn<User>('role', 'Role', userTypes),
  
  // Las acciones se agregan automáticamente por el GenericTable
]