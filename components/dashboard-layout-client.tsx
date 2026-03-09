'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import { useUser } from '@/contexts/user-context'

interface DashboardLayoutClientProps {
  children: ReactNode
}

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const user = useUser()

  return (
    <>
      <Sidebar userRole={user?.role} />
      <TopBar />

      {/* Main content with sidebar offset on desktop */}
      <main className="md:ml-64 pt-24 pb-8 min-h-screen overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </>
  )
}
