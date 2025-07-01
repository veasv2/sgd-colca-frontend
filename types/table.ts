import { Row } from '@tanstack/react-table'
import { LucideIcon } from 'lucide-react'

export interface TableAction<T = any> {
  label: string
  icon: LucideIcon
  onClick: (item: T) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  separator?: boolean
  disabled?: (item: T) => boolean
}

export interface TableButton {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export interface FilterOption {
  label: string
  value: string
  icon?: LucideIcon
}

export interface TableFilter {
  columnKey: string
  title: string
  options: FilterOption[]
}

export interface TableConfig<T = any> {
  entity: string
  searchColumn?: string
  searchPlaceholder?: string
  filters?: TableFilter[]
  actions?: TableAction<T>[]
  buttons?: TableButton[]
}