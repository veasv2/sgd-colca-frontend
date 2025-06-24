"use client"

import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react'
import { DataTableRowActions, RowAction } from '@/components/table/table-row-actions'
import { useUsers } from '../_context/usuario-context'
import { User } from '@/schemas/seguridad/usuario-schema'

interface UsuarioRowActionsProps {
  row: Row<User>
}

export function UsuarioRowActions({ row }: UsuarioRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()

  const actions: RowAction<User>[] = [
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
      separator: true // Agregar separador después
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
  ]

  return <DataTableRowActions row={row} actions={actions} />
}