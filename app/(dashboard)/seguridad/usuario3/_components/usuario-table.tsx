// app/(dashboard)/seguridad/usuario2/_components/usuario-table-refactored.tsx
"use client"

import { IconEdit, IconTrash, IconEye, IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { GenericTable } from '@/components/table/generic-table'
import { useUsers } from '../_context/usuario-context'
import { User } from '@/schemas/seguridad/usuario2-schema'
import { TableConfig } from '@/types/table'
import { usuarioColumns } from './usuario-columns'

interface UsuarioTableProps {
  data: User[]
}

export function UsuarioTable({ data }: UsuarioTableProps) {
  const { setOpen, setCurrentRow } = useUsers()

  // Configuración de la tabla
  const tableConfig: TableConfig<User> = {
    entity: 'usuarios',
    searchColumn: 'username',
    searchPlaceholder: 'Filter users...',
    
    // Filtros
    filters: [
      {
        columnKey: 'status',
        title: 'Status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Invited', value: 'invited' },
          { label: 'Suspended', value: 'suspended' },
        ]
      },
      {
        columnKey: 'role',
        title: 'Role',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
          { label: 'Editor', value: 'editor' },
          // Mapear desde tu userTypes existente
        ]
      }
    ],
    
    // Acciones de fila
    actions: [
      {
        label: 'Ver detalles',
        icon: IconEye,
        onClick: (user) => {
          setCurrentRow(user)
          setOpen('view')
        }
      },
      {
        label: 'Editar',
        icon: IconEdit,
        onClick: (user) => {
          setCurrentRow(user)
          setOpen('edit')
        },
        separator: true
      },
      {
        label: 'Eliminar',
        icon: IconTrash,
        onClick: (user) => {
          setCurrentRow(user)
          setOpen('delete')
        },
        variant: 'destructive'
      }
    ],
    
    // Botones superiores
    buttons: [
      {
        label: 'Invite User',
        icon: IconMailPlus,
        variant: 'outline',
        onClick: () => setOpen('invite')
      },
      {
        label: 'Add User',
        icon: IconUserPlus,
        onClick: () => setOpen('add')
      }
    ]
  }

  return (
    <GenericTable
      columns={usuarioColumns}
      data={data}
      config={tableConfig}
      tableConfig={{
        initialPageSize: 10,
        enableRowSelection: true
      }}
    />
  )
}
