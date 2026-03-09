'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RowActions } from '@/components/row-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react'
import type { Staff } from '@prisma/client'

interface StaffWithUser extends Staff {
  user: {
    id: string
    username: string
    name: string
    email: string | null
    role: string
    avatar: string | null
    active: boolean
  }
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    try {
      const url = searchTerm
        ? `/api/staff?search=${encodeURIComponent(searchTerm)}`
        : '/api/staff'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setStaff(data)
      setError('')
    } catch {
      setError('Failed to load staff')
      setStaff([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setStaff((prev) => prev.filter((item) => item.id !== id))
      setDeleteId(null)
    } catch {
      setError('Failed to delete staff member')
    }
  }

  const filteredStaff = staff

  return (
    <DashboardLayout>
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage hospital staff and team members
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Enter the staff information below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Full Name" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Phone Number" />
                <Input placeholder="Department" />
                <Input placeholder="Position" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsOpen(false)}>Add Staff</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search staff by name, email, phone, position, or department..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No staff members found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Position
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Department
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4 text-muted-foreground text-sm font-mono">
                        {member.id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {member.user?.name || 'Unknown'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded bg-accent/10 text-accent text-xs font-semibold">
                          {member.user?.role || 'STAFF'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {member.user?.email || '-'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {member.phone || '-'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {member.position || '-'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {member.department || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end">
                          <RowActions
                            id={member.id}
                            actions={[
                              {
                                label: 'Edit',
                                icon: <Edit2 className="w-4 h-4" />,
                                onClick: () => {
                                  // Handle edit
                                  console.log('Edit:', member.id)
                                },
                              },
                              {
                                label: 'Delete',
                                icon: <Trash2 className="w-4 h-4" />,
                                variant: 'destructive',
                                onClick: () => setDeleteId(member.id),
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
