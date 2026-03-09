import { ReactNode } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UserProvider } from '@/contexts/user-context'
import { DashboardLayoutClient } from '@/components/dashboard-layout-client'

export default async function DashboardGroupLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <UserProvider user={user}>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </UserProvider>
  )
}
