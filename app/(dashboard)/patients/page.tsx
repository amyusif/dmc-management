'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react'
import { PatientSchema, type PatientInput } from '@/lib/schemas'
import type { Patient } from '@prisma/client'
import { RowActions } from '@/components/row-actions'

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    try {
      const url = searchTerm
        ? `/api/patients?search=${encodeURIComponent(searchTerm)}`
        : '/api/patients'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPatients(data)
    } catch {
      setError('Failed to load patients')
      setPatients([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const form = useForm<PatientInput>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'OTHER',
      bloodType: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContact: '',
    },
  })

  const openAdd = () => {
    form.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'OTHER',
      bloodType: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContact: '',
    })
    setError('')
    setIsAddOpen(true)
  }

  const openEdit = (patient: Patient) => {
    setEditingPatient(patient)
    form.reset({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth.toISOString().slice(0, 10),
      gender: patient.gender as 'MALE' | 'FEMALE' | 'OTHER',
      bloodType: patient.bloodType ?? '',
      address: patient.address ?? '',
      city: patient.city ?? '',
      state: patient.state ?? '',
      zipCode: patient.zipCode ?? '',
      emergencyContact: patient.emergencyContact ?? '',
    })
    setError('')
  }

  const closeEdit = () => {
    setEditingPatient(null)
  }

  const onSubmit = async (data: PatientInput) => {
    setSubmitting(true)
    setError('')
    try {
      if (editingPatient) {
        const res = await fetch(`/api/patients/${editingPatient.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || 'Update failed')
        await fetchPatients()
        closeEdit()
      } else {
        const res = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || 'Create failed')
        await fetchPatients()
        setIsAddOpen(false)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const onDelete = async (id: string) => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchPatients()
      setDeleteId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setSubmitting(false)
    }
  }

  const formFields = (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="First Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="Phone Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bloodType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blood Type (optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g. O+" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="emergencyContact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact (optional)</FormLabel>
            <FormControl>
              <Input placeholder="Emergency contact" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patients</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all patient records
            </p>
          </div>
          <Button className="gap-2" onClick={openAdd}>
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Card>
          <div className="overflow-x-auto">
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
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Blood Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Age
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin inline" />
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => {
                    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                    return (
                      <tr
                        key={patient.id}
                        className="border-b border-border hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-3 px-4 text-muted-foreground text-sm font-mono">
                          {patient.id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-foreground font-medium">
                          {patient.firstName} {patient.lastName}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {patient.email}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {patient.phone}
                        </td>
                        <td className="py-3 px-4">
                          {patient.bloodType ? (
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                              {patient.bloodType}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{age}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end">
                            <RowActions
                              id={patient.id}
                              actions={[
                                {
                                  label: 'Edit',
                                  icon: <Edit2 className="w-4 h-4" />,
                                  onClick: () => openEdit(patient),
                                },
                                {
                                  label: 'Delete',
                                  icon: <Trash2 className="w-4 h-4" />,
                                  variant: 'destructive',
                                  onClick: () => setDeleteId(patient.id),
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient information below
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              {formFields}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Add Patient
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={!!editingPatient} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update the patient information below
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              {formFields}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={closeEdit}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete patient?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this patient and their records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && onDelete(deleteId)}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
