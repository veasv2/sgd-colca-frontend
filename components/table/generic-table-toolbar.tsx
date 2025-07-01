"use client"

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/table/table-faceted-filter'
import { DataTableViewOptions } from '@/components/table/table-view-options'
import { TableConfig } from '@/types/table'

interface GenericTableToolbarProps<TData> {
  table: Table<TData>
  config?: TableConfig<TData>
}

export function GenericTableToolbar<TData>({
  table,
  config,
}: GenericTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {config?.searchColumn && (
          <Input
            placeholder={config.searchPlaceholder || `Filter ${config.entity}...`}
            value={
              (table.getColumn(config.searchColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(config.searchColumn!)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        
        {config?.filters && (
          <div className='flex gap-x-2'>
            {config.filters.map((filter) => {
              const column = table.getColumn(filter.columnKey)
              return column ? (
                <DataTableFacetedFilter
                  key={filter.columnKey}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              ) : null
            })}
          </div>
        )}
        
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}