"use client"

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UsuarioRead } from '@/schemas/seguridad/usuario-schema'
import { DataTablePagination } from '@/components/table/table-pagination'
import { DataTableToolbar } from './usuario-table-toolbar'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

interface DataTableProps {
  columns: ColumnDef<UsuarioRead>[]
  data: UsuarioRead[]
}

export function UsersTable({ columns, data }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />

      <div className='rounded-md border'>
        <div className='overflow-x-auto'>
          <Table className='min-w-full'>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className='group/row bg-muted/50 hover:bg-muted/50 border-b border-muted'
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`
                        ${header.column.columnDef.meta?.className ?? ''}
                        text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide py-1.5 h-9 whitespace-nowrap
                      `}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`
                      group/row border-b border-muted/20
                      transition-colors duration-150
                      ${row.getIsSelected() ? 'bg-blue-50/50' : ''}
                      ${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`
                          ${cell.column.columnDef.meta?.className ?? ''}
                          py-2 text-sm text-foreground border-b-0 whitespace-nowrap
                        `}
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
                    className='h-24 text-center text-muted-foreground'
                  >
                    <div className='flex flex-col items-center justify-center space-y-2'>
                      <div className='text-4xl text-gray-300'>📋</div>
                      <div className='text-lg font-medium'>No users found</div>
                      <div className='text-sm text-gray-400'>Try adjusting your search or filter criteria</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
