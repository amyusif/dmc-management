import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              'mt-2 text-sm font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.isPositive ? '+' : '-'}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className="text-primary/20">
          {icon}
        </div>
      </div>
    </Card>
  )
}
