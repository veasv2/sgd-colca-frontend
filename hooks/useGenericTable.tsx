import { useState } from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnDef,
} from '@tanstack/react-table'

interface UseGenericTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  config?: {
    initialPageSize?: number
    enableRowSelection?: boolean
  }
}

export function useGenericTable<T>({ 
  data, 
  columns, 
  config = {} 
}: UseGenericTableProps<T>) {
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
    enableRowSelection: config.enableRowSelection ?? true,
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
    initialState: {
      pagination: {
        pageSize: config.initialPageSize ?? 10,
      },
    },
  })

  return {
    table,
    state: {
      rowSelection,
      columnVisibility,
      columnFilters,
      sorting,
    },
  }
}