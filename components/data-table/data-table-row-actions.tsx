"use client"

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Definir tipos para las acciones
export interface RowAction<TData> {
  label: string
  icon?: React.ComponentType<{ size?: number }>
  onClick: (row: TData) => void
  variant?: 'default' | 'destructive'
  shortcut?: string
  separator?: boolean // Para agregar separador después
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: RowAction<TData>[]
  className?: string
}

export function DataTableRowActions<TData>({ 
  row, 
  actions,
  className 
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {actions.map((action, index) => (
          <div key={index}>
            <DropdownMenuItem
              onClick={() => action.onClick(row.original)}
              className={action.variant === 'destructive' ? 'text-red-500' : ''}
            >
              {action.label}
              {action.icon && (
                <DropdownMenuShortcut>
                  <action.icon size={16} />
                </DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            {action.separator && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}