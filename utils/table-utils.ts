// utils/table-utils.ts

import { ColumnDef } from '@tanstack/react-table'
import { UsuarioRead } from '@/schemas/seguridad/usuario-schema'

// Función para filtrar columnas según permisos del usuario
export function getFilteredColumns(
  baseColumns: ColumnDef<UsuarioRead>[], 
  userPermissions: {
    canViewSecurityInfo?: boolean
    isAdmin?: boolean
  }
): ColumnDef<UsuarioRead>[] {
  
  return baseColumns.filter(column => {
    // Ocultar columnas sensibles para usuarios no autorizados
    if (column.accessorKey === 'intentos_fallidos' && !userPermissions.canViewSecurityInfo) {
      return false
    }
    
    if (column.accessorKey === 'bloqueado_hasta' && !userPermissions.isAdmin) {
      return false
    }
    
    return true
  })
}

// Hook para obtener columnas según el usuario actual
export function useUserColumns(baseColumns: ColumnDef<UsuarioRead>[]) {
  // Aquí usarías tu hook de permisos
  // const { isSuperAdmin, canViewSecurityInfo } = usePermissions()
  
  // Por ahora, simulamos permisos (después integras con tu sistema de auth)
  const userPermissions = {
    canViewSecurityInfo: true, // Solo SUPERADMIN
    isAdmin: true // SUPERADMIN o ALCALDE
  }
  
  return getFilteredColumns(baseColumns, userPermissions)
}