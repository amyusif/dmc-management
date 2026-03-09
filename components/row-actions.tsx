'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react'

interface RowAction {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'destructive'
}

interface RowActionsProps {
  actions: RowAction[]
  id: string
}

export function RowActions({ actions, id }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label={`Actions for row ${id}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {actions.map((action, index) => (
          <div key={`${id}-action-${index}`}>
            <DropdownMenuItem
              onClick={action.onClick}
              className={
                action.variant === 'destructive'
                  ? 'text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950'
                  : ''
              }
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </DropdownMenuItem>
            {index < actions.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
