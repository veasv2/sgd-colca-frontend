"use client"

import { Button } from '@/components/ui/button'
import { TableButton } from '@/types/table'

interface GenericTableBarButtonsProps {
  buttons: TableButton[]
}

export function GenericTableBarButtons({ buttons }: GenericTableBarButtonsProps) {
  return (
    <div className='flex gap-2'>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant || 'default'}
          className='space-x-1'
          onClick={button.onClick}
        >
          <span>{button.label}</span>
          <button.icon size={18} />
        </Button>
      ))}
    </div>
  )
}