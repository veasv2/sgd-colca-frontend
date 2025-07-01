import { useCallback } from 'react'
import { TableConfig } from '@/types/table'

interface UseTableConfigProps<T> {
  entity: string
  searchColumn: string
  onView?: (item: T) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onAdd?: () => void
  onInvite?: () => void
  customActions?: Array<{
    label: string
    icon: any
    onClick: (item: T) => void
    variant?: string
  }>
}

export function useTableConfig<T>({
  entity,
  searchColumn,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onInvite,
  customActions = []
}: UseTableConfigProps<T>): TableConfig<T> {
  
  const config = useCallback((): TableConfig<T> => {
    const actions = []
    
    if (onView) {
      actions.push({
        label: 'Ver detalles',
        icon: IconEye,
        onClick: onView
      })
    }
    
    if (onEdit) {
      actions.push({
        label: 'Editar',
        icon: IconEdit,
        onClick: onEdit,
        separator: true
      })
    }
    
    if (onDelete) {
      actions.push({
        label: 'Eliminar',
        icon: IconTrash,
        onClick: onDelete,
        variant: 'destructive' as const
      })
    }
    
    // Agregar acciones personalizadas
    actions.push(...customActions)
    
    const buttons = []
    
    if (onInvite) {
      buttons.push({
        label: `Invite ${entity}`,
        icon: IconMailPlus,
        variant: 'outline' as const,
        onClick: onInvite
      })
    }
    
    if (onAdd) {
      buttons.push({
        label: `Add ${entity}`,
        icon: IconPlus,
        onClick: onAdd
      })
    }
    
    return {
      entity,
      searchColumn,
      searchPlaceholder: `Filter ${entity}...`,
      actions,
      buttons
    }
  }, [entity, searchColumn, onView, onEdit, onDelete, onAdd, onInvite, customActions])
  
  return config()
}