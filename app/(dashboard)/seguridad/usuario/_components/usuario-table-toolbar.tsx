// app/(dashboard)/seguridad/usuario/_components/usuario-table-toolbar.tsx
"use client"

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { tipoUsuarioOptions, estadoOptions } from '../data/usuario-data'
import { DataTableFacetedFilter } from '@/components/table/table-faceted-filter'
import { DataTableViewOptions } from '@/components/table/table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Buscar usuarios...'
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('username')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('estado') && (
            <DataTableFacetedFilter
              column={table.getColumn('estado')}
              title='Estado'
              options={estadoOptions.map((estado) => ({
                label: estado.label,
                value: estado.value,
              }))}
            />
          )}
          {table.getColumn('tipo_usuario') && (
            <DataTableFacetedFilter
              column={table.getColumn('tipo_usuario')}
              title='Tipo de Usuario'
              options={tipoUsuarioOptions.map((tipo) => ({
                label: tipo.label,
                value: tipo.value,
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Limpiar Filtros
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}