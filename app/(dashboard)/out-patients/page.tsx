'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Search, Edit2, Trash2, Users, Calendar, Clock } from 'lucide-react'

interface OutPatient {
  id: string
  patientName: string
  email: string
  phone: string
  visitDate: string
  visitTime: string
  reason: string
  doctor: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
}

const mockOutPatients: OutPatient[] = [
  {
    id: '1',
    patientName: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-1234',
    visitDate: '2026-05-20',
    visitTime: '10:00 AM',
    reason: 'General checkup',
    doctor: 'Dr. Brown',
    status: 'SCHEDULED',
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    email: 'michael@example.com',
    phone: '555-5678',
    visitDate: '2026-05-18',
    visitTime: '2:00 PM',
    reason: 'Follow-up consultation',
    doctor: 'Dr. Williams',
    status: 'COMPLETED',
  },
  {
    id: '3',
    patientName: 'Sarah Davis',
    email: 'sarah@example.com',
    phone: '555-9012',
    visitDate: '2026-05-19',
    visitTime: '3:30 PM',
    reason: 'Lab results review',
    doctor: 'Dr. Martinez',
    status: 'SCHEDULED',
  },
]

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/10 text-blue-600',
  COMPLETED: 'bg-green-500/10 text-green-600',
  CANCELLED: 'bg-red-500/10 text-red-600',
  NO_SHOW: 'bg-orange-500/10 text-orange-600',
}

export default function OutPatientsPage() {
  const [patients, setPatients] = useState<OutPatient[]>(mockOutPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<OutPatient>>({})

  const filteredPatients = patients.filter((patient) =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const handleAddPatient = () => {
    if (!formData.patientName || !formData.email || !formData.visitDate) {
      return
    }
    if (editingId) {
      setPatients((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
      )
      setEditingId(null)
    } else {
      const newPatient: OutPatient = {
        id: Date.now().toString(),
        patientName: formData.patientName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        visitDate: formData.visitDate || '',
        visitTime: formData.visitTime || '',
        reason: formData.reason || '',
        doctor: formData.doctor || '',
        status: 'SCHEDULED',
      }
      setPatients((prev) => [newPatient, ...prev])
    }
    setFormData({})
    setIsDialogOpen(false)
  }

  const handleEdit = (patient: OutPatient) => {
    setEditingId(patient.id)
    setFormData(patient)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id))
    setDeleteId(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Out-Patient Management</h1>
            <p className="text-muted-foreground mt-1">Manage outpatient visits and appointments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingId(null)
                  setFormData({})
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Patient Visit' : 'Schedule New Visit'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update patient visit details'
                    : 'Schedule a new outpatient visit'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Patient Name</label>
                  <Input
                    placeholder="Enter patient name"
                    value={formData.patientName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="555-1234"
                      value={formData.phone || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Reason for Visit</label>
                  <Input
                    placeholder="e.g., General checkup"
                    value={formData.reason || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Visit Date</label>
                    <Input
                      type="date"
                      value={formData.visitDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, visitDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Visit Time</label>
                    <Input
                      type="time"
                      value={formData.visitTime || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, visitTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Assigned Doctor</label>
                  <Input
                    placeholder="e.g., Dr. Smith"
                    value={formData.doctor || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, doctor: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddPatient}>
                    {editingId ? 'Update' : 'Schedule'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 bg-muted px-3 py-2 rounded-lg w-fit">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, email, or phone..."
                className="border-0 bg-transparent outline-none w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-muted-foreground/20">
                    <TableHead className="font-semibold">Patient Name</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Visit Date</TableHead>
                    <TableHead className="font-semibold">Time</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold">Doctor</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="border-muted-foreground/20">
                      <TableCell className="font-medium">{patient.patientName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{patient.email}</div>
                          <div className="text-muted-foreground">{patient.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(patient.visitDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{patient.visitTime}</TableCell>
                      <TableCell>{patient.reason}</TableCell>
                      <TableCell>{patient.doctor}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[patient.status]}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(patient)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(patient.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No outpatients found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Visit</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove the patient visit from the schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
