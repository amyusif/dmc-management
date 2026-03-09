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
import type { MedicalRecord, Patient, Doctor, User } from '@prisma/client'

interface RecordWithRelations extends MedicalRecord {
  patient: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'email'>
  doctor: Doctor & {
    user: Pick<User, 'id' | 'name'>
  }
}

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const url = searchTerm
        ? `/api/records?search=${encodeURIComponent(searchTerm)}`
        : '/api/records'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRecords(data)
      setError('')
    } catch {
      setError('Failed to load medical records')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/records/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setRecords((prev) => prev.filter((item) => item.id !== id))
      setDeleteId(null)
    } catch {
      setError('Failed to delete medical record')
    }
  }

  return (
    <DashboardLayout>
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medical Record</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the medical record.
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
            <h1 className="text-3xl font-bold text-foreground">Medical Records</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view patient medical records
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Medical Record</DialogTitle>
                <DialogDescription>
                  Enter the record information below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Patient ID" />
                <Input placeholder="Doctor ID" />
                <Input placeholder="Diagnosis" />
                <Input placeholder="Prescription" />
                <Input placeholder="Notes" />
                <Input placeholder="Record Date" type="date" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsOpen(false)}>Create Record</Button>
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
            placeholder="Search records by patient, doctor, or diagnosis..."
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
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No medical records found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Diagnosis
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4 text-muted-foreground text-sm font-mono">
                        {record.id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {record.patient.firstName} {record.patient.lastName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {record.doctor.user.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                        {record.diagnosis}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(record.recordDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end">
                          <RowActions
                            id={record.id}
                            actions={[
                              {
                                label: 'Edit',
                                icon: <Edit2 className="w-4 h-4" />,
                                onClick: () => {
                                  // Handle edit
                                  console.log('Edit:', record.id)
                                },
                              },
                              {
                                label: 'Delete',
                                icon: <Trash2 className="w-4 h-4" />,
                                variant: 'destructive',
                                onClick: () => setDeleteId(record.id),
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
