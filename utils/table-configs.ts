import { TableConfig } from '@/types/table'
import { IconEdit, IconTrash, IconEye, IconPlus } from '@tabler/icons-react'

// Configuraciones base que se pueden reutilizar
export const createCRUDConfig = <T>(
  entity: string,
  searchColumn: string,
  onView: (item: T) => void,
  onEdit: (item: T) => void,
  onDelete: (item: T) => void,
  onAdd: () => void
): Partial<TableConfig<T>> => ({
  entity,
  searchColumn,
  searchPlaceholder: `Filter ${entity}...`,
  actions: [
    {
      label: 'Ver detalles',
      icon: IconEye,
      onClick: onView
    },
    {
      label: 'Editar',
      icon: IconEdit,
      onClick: onEdit,
      separator: true
    },
    {
      label: 'Eliminar',
      icon: IconTrash,
      onClick: onDelete,
      variant: 'destructive'
    }
  ],
  buttons: [
    {
      label: `Add ${entity}`,
      icon: IconPlus,
      onClick: onAdd
    }
  ]
})