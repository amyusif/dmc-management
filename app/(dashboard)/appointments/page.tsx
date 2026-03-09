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
import { Plus, Search, Edit2, Trash2, Calendar, Clock, Loader2 } from 'lucide-react'
import type { Appointment, Patient, Doctor, User } from '@prisma/client'

interface AppointmentWithRelations extends Appointment {
  patient: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>
  doctor: Doctor & {
    user: Pick<User, 'id' | 'name' | 'email'>
  }
}

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/10 text-blue-600',
  COMPLETED: 'bg-green-500/10 text-green-600',
  CANCELLED: 'bg-red-500/10 text-red-600',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const url = searchTerm
        ? `/api/appointments?search=${encodeURIComponent(searchTerm)}`
        : '/api/appointments'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAppointments(data)
      setError('')
    } catch {
      setError('Failed to load appointments')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setAppointments((prev) => prev.filter((item) => item.id !== id))
      setDeleteId(null)
    } catch {
      setError('Failed to delete appointment')
    }
  }

  return (
    <DashboardLayout>
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment.
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
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground mt-2">
              Schedule and manage patient appointments
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Enter the appointment details below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Patient ID" />
                <Input placeholder="Doctor ID" />
                <Input placeholder="Appointment Date" type="date" />
                <Input placeholder="Appointment Time" type="time" />
                <Input placeholder="Reason for Visit" />
                <Input placeholder="Notes" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsOpen(false)}>Schedule</Button>
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
            placeholder="Search appointments by patient, doctor, or reason..."
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
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No appointments found
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
                      Date & Time
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Reason
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4 text-muted-foreground text-sm font-mono">
                        {apt.id.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {apt.patient.firstName} {apt.patient.lastName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {apt.doctor.user.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                          <Clock className="w-4 h-4 ml-2" />
                          {new Date(apt.appointmentDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {apt.reason || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[apt.status] || 'bg-gray-500/10 text-gray-600'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end">
                          <RowActions
                            id={apt.id}
                            actions={[
                              {
                                label: 'Edit',
                                icon: <Edit2 className="w-4 h-4" />,
                                onClick: () => {
                                  // Handle edit
                                  console.log('Edit:', apt.id)
                                },
                              },
                              {
                                label: 'Delete',
                                icon: <Trash2 className="w-4 h-4" />,
                                variant: 'destructive',
                                onClick: () => setDeleteId(apt.id),
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
