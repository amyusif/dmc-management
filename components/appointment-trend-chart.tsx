'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type AppointmentTrendData = {
  date: string
  appointments: number
}[]

interface AppointmentTrendChartProps {
  data: AppointmentTrendData
}

export function AppointmentTrendChart({ data }: AppointmentTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-card)',
            border: `1px solid var(--color-border)`,
            borderRadius: '0.5rem',
          }}
        />
        <Line
          type="monotone"
          dataKey="appointments"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-primary)', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
