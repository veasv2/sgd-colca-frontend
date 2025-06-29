"use client"

import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/ui/long-text'
import {
  estadoUsuarioTypes,
  tipoUsuarioTypes,
} from '../data/usuario-data'
import { UsuarioRead } from '@/schemas/seguridad/usuario-schema'
import { DataTableColumnHeader } from '@/components/table/table-column-header'
import { UsuarioRowActions } from './usuario-table-row-action'

// Función helper para formatear fechas
const formatDate = (dateString: string, includeTime = false) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }
  return date.toLocaleDateString('es-PE', options)
}

export const columns: ColumnDef<UsuarioRead>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todos'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar fila'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: cn(
        'sticky left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'w-12 px-3'
      ),
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>
        {row.getValue('username')}
      </LongText>
    ),
    enableHiding: false,
    meta: {
      className: cn(
        'sticky left-12 z-10',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'min-w-[140px] px-3'
      ),
    },
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const { nombres, apellidos } = row.original
      const fullName = `${nombres} ${apellidos}`
      return <LongText className='max-w-36'>{fullName}</LongText>
    },
    meta: {
      className: 'min-w-[150px] px-3',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap text-sm text-blue-600 hover:text-blue-800'>
        {row.getValue('email')}
      </div>
    ),
    meta: {
      className: 'min-w-[180px] px-3',
    },
  },
  {
    accessorKey: 'telefono',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => (
      <div className='text-sm'>{row.getValue('telefono') || 'N/A'}</div>
    ),
    enableSorting: false,
    enableHiding: true,
    meta: {
      className: 'min-w-[120px] px-3',
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { estado } = row.original
      const status = estado.toLowerCase()
      const colorMap: Record<string, string> = {
        activo: 'bg-green-100 text-green-800 border-green-200',
        inactivo: 'bg-gray-100 text-gray-800 border-gray-200',
        suspendido: 'bg-red-100 text-red-800 border-red-200',
        invitado: 'bg-blue-100 text-blue-800 border-blue-200',
      }
      const className =
        colorMap[status] || 'bg-muted text-muted-foreground border-muted'
      return (
        <Badge variant='secondary' className={cn('capitalize font-medium', className)}>
          {estado}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'min-w-[100px] px-3',
    },
  },
  {
    accessorKey: 'tipo_usuario',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const tipo = row.original.tipo_usuario?.toLowerCase()
      const colorMap: Record<string, string> = {
        superadmin: 'bg-purple-100 text-purple-800',
        admin: 'bg-orange-100 text-orange-800',
        usuario: 'bg-blue-100 text-blue-800',
        cajero: 'bg-blue-100 text-blue-800',
        manager: 'bg-green-100 text-green-800',
      }

      const color = colorMap[tipo] || 'bg-gray-100 text-gray-800'

      return (
        <div className='flex items-center gap-2'>
          <div className={cn('w-2.5 h-2.5 rounded-full', color)} />
          <span className='text-sm font-medium capitalize'>{tipo}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'min-w-[120px] px-3',
    },
  },
  {
    id: 'actions',
    cell: UsuarioRowActions,
    meta: {
      className: 'w-12 px-3',
    },
  },
]
