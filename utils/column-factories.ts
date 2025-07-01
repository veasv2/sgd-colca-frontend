// utils/column-factories.ts
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/ui/long-text'
import { DataTableColumnHeader } from '@/components/table/table-column-header'
import { DataTableRowActions } from '@/components/table/table-row-actions'
import { TableAction } from '@/types/table'
import { LucideIcon } from 'lucide-react'
import React from 'react'

// Factory para columna de selección
export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: 'select',
    header: ({ table }) => 
      React.createElement(Checkbox, {
        checked: table.getIsAllPageRowsSelected() || 
                (table.getIsSomePageRowsSelected() && 'indeterminate'),
        onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
        className: 'translate-y-[2px]'
      }),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => 
      React.createElement(Checkbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
        'aria-label': 'Select row',
        className: 'translate-y-[2px]'
      }),
    enableSorting: false,
    enableHiding: false,
  }
}

// Factory para columnas de texto
export function createTextColumn<T>(
  key: string,
  title: string,
  options?: {
    maxWidth?: string
    sticky?: boolean
    enableHiding?: boolean
    enableSorting?: boolean
    className?: string
  }
): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => 
      React.createElement(DataTableColumnHeader, { column: column as any, title }),
    cell: ({ row }) => {
      const value = row.getValue(key) as string
      return React.createElement(LongText, 
        { className: options?.maxWidth || 'max-w-36' },
        value
      )
    },
    meta: {
      className: cn(
        options?.sticky && [
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
          'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
          'sticky left-6 md:table-cell'
        ],
        options?.className
      ),
    },
    enableHiding: options?.enableHiding ?? true,
    enableSorting: options?.enableSorting ?? true,
  }
}

// Factory para columnas de email
export function createEmailColumn<T>(key: string = 'email'): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => 
      React.createElement(DataTableColumnHeader, { column: column as any, title: 'Email' }),
    cell: ({ row }) => {
      const value = row.getValue(key) as string
      return React.createElement('div', 
        { className: 'w-fit text-nowrap' },
        value
      )
    },
  }
}

// Factory para columnas de teléfono
export function createPhoneColumn<T>(key: string = 'phoneNumber'): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => 
      React.createElement(DataTableColumnHeader, { column: column as any, title: 'Phone Number' }),
    cell: ({ row }) => {
      const value = row.getValue(key) as string
      return React.createElement('div', {}, value)
    },
    enableSorting: false,
  }
}

// Factory para columnas de status con badges
export function createStatusColumn<T>(
  statusMap: Map<string, string>,
  key: string = 'status'
): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => 
      React.createElement(DataTableColumnHeader, { column: column as any, title: 'Status' }),
    cell: ({ row }) => {
      const status = row.getValue(key) as string
      const badgeColor = statusMap.get(status)
      const badge = React.createElement(Badge, 
        { 
          variant: 'outline' as const, 
          className: cn('capitalize', badgeColor) 
        },
        status
      )
      return React.createElement('div', 
        { className: 'flex space-x-2' },
        badge
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  }
}

// Factory para columnas con iconos (como roles)
export function createIconTextColumn<T>(
  key: string,
  title: string,
  options: Array<{ value: string; label?: string; icon?: LucideIcon }>
): ColumnDef<T> {
  return {
    accessorKey: key,
    header: ({ column }) => 
      React.createElement(DataTableColumnHeader, { column: column as any, title }),
    cell: ({ row }) => {
      const value = row.getValue(key) as string
      const option = options.find(opt => opt.value === value)

      if (!option) {
        return null
      }

      const icon = option.icon ? React.createElement(option.icon, {
        size: 16,
        className: 'text-muted-foreground'
      }) : null

      const text = React.createElement('span', 
        { className: 'text-sm capitalize' },
        option.label || value
      )

      return React.createElement('div',
        { className: 'flex items-center gap-x-2' },
        icon,
        text
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  }
}

// Factory para columnas de nombre completo
export function createFullNameColumn<T>(
  firstNameKey: string = 'firstName',
  lastNameKey: string = 'lastName'
): ColumnDef<T> {
  return {
    id: 'fullName',
    header: ({ column }) => 
      React.createElement(DataTableColumnHeader, { column: column as any, title: 'Name' }),
    cell: ({ row }) => {
      const firstName = row.original[firstNameKey as keyof T] as string
      const lastName = row.original[lastNameKey as keyof T] as string
      const fullName = `${firstName} ${lastName}`
      return React.createElement(LongText, 
        { className: 'max-w-36' },
        fullName
      )
    },
    meta: { className: 'w-36' },
  }
}

// Factory para columna de acciones
export function createActionsColumn<T>(actions: TableAction<T>[]): ColumnDef<T> {
  return {
    id: 'actions',
    cell: ({ row }) => {
      const rowActions = actions.map(action => ({
        label: action.label,
        icon: action.icon,
        onClick: (item: T) => action.onClick(item),
        variant: action.variant,
        separator: action.separator,
        disabled: action.disabled ? (item: T) => action.disabled!(item) : undefined,
      }))
      
      return React.createElement(DataTableRowActions, { row, actions: rowActions })
    },
  }
}