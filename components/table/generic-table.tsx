"use client"

import {
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/table/table-pagination'
import { GenericTableToolbar } from './generic-table-toolbar'
import { GenericTableBarButtons } from './generic-table-bar-buttons'
import { useGenericTable } from '@/hooks/useGenericTable'
import { TableConfig } from '@/types/table'

import { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
  }
}

interface GenericTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  config?: TableConfig<T>
  tableConfig?: {
    initialPageSize?: number
    enableRowSelection?: boolean
  }
}

export function GenericTable<T>({ 
  columns, 
  data, 
  config,
  tableConfig 
}: GenericTableProps<T>) {
  const { table } = useGenericTable({ 
    data, 
    columns, 
    config: tableConfig 
  })

  return (
    <div className='space-y-4'>
      {config?.buttons && (
        <div className='flex justify-end'>
          <GenericTableBarButtons buttons={config.buttons} />
        </div>
      )}
      
      <GenericTableToolbar table={table} config={config} />
      
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}