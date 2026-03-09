'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Heart,
  FolderOpen,
  UserCircle,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavLink {
  type: 'link'
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

interface NavGroup {
  type: 'group'
  label: string
  icon: React.ReactNode
  roles: string[]
  children: { label: string; href: string; icon: React.ReactNode; roles: string[] }[]
}

type NavItem = NavLink | NavGroup

const navItems: NavItem[] = [
  {
    type: 'link',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'STAFF'],
  },
  {
    type: 'group',
    label: 'Record',
    icon: <FolderOpen className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
    children: [
      {
        label: 'Staff',
        href: '/staff',
        icon: <Users className="w-5 h-5" />,
        roles: ['ADMIN', 'RECEPTIONIST'],
      },
      {
        label: 'Patients',
        href: '/patients',
        icon: <Users className="w-5 h-5" />,
        roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
      },
      {
        label: 'Medical Records',
        href: '/records',
        icon: <FileText className="w-5 h-5" />,
        roles: ['ADMIN', 'DOCTOR', 'NURSE'],
      },
      {
        label: 'Personal Data',
        href: '/personal-data',
        icon: <UserCircle className="w-5 h-5" />,
        roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
      },
    ],
  },
  {
    type: 'link',
    label: 'Appointments',
    href: '/appointments',
    icon: <Calendar className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
  },
  {
    type: 'link',
    label: 'Messages',
    href: '/messages',
    icon: <MessageSquare className="w-5 h-5" />,
    roles: ['ADMIN', 'RECEPTIONIST', 'STAFF'],
  },
  {
    type: 'link',
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'STAFF'],
  },
]

const recordHrefs = ['/staff', '/patients', '/records', '/personal-data']

export function Sidebar({ userRole = 'STAFF' }: { userRole?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [recordOpen, setRecordOpen] = useState(
    () => recordHrefs.some((href) => pathname === href || pathname.startsWith(href + '/'))
  )

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 md:z-0',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">MediCare</h1>
            <p className="text-xs text-muted-foreground">Hospital System</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            if (item.type === 'link') {
              const link = item as NavLink
              if (!link.roles.includes(userRole)) return null
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span className="font-medium">{link.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              )
            }

            const group = item as NavGroup
            if (!group.roles.includes(userRole)) return null
            const filteredChildren = group.children.filter((child) =>
              child.roles.includes(userRole)
            )
            if (filteredChildren.length === 0) return null

            const isOpen = recordOpen
            return (
              <Collapsible
                key={group.label}
                open={isOpen}
                onOpenChange={setRecordOpen}
              >
                <CollapsibleTrigger
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent/10',
                    recordHrefs.some(
                      (href) =>
                        pathname === href || pathname.startsWith(href + '/')
                    ) && 'bg-sidebar-accent/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {group.icon}
                    <span className="font-medium">{group.label}</span>
                  </div>
                  <ChevronDown
                    className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pl-4 pt-1 space-y-1 border-l border-sidebar-border ml-4 mt-1">
                    {filteredChildren.map((child) => {
                      const isActive =
                        pathname === child.href ||
                        pathname.startsWith(child.href + '/')
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200',
                            isActive
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                          )}
                        >
                          {child.icon}
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="flex items-center justify-between gap-2 px-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
