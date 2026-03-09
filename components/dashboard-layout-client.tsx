'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { useUser } from '@/contexts/user-context'

interface DashboardLayoutClientProps {
  children: ReactNode
}

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const user = useUser()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role} />

      {/* Main content */}
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="min-h-screen p-4 md:p-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
