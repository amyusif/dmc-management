'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Plus, Search, Edit2, Trash2, Bed, Calendar, User, Loader2 } from 'lucide-react'

interface InPatient {
  id: string
  patientName: string
  room: string
  ward: string
  admissionDate: string
  expectedDischargeDate: string
  diagnosis: string
  status: 'ADMITTED' | 'RECOVERING' | 'DISCHARGED'
  doctor: string
}

const mockInPatients: InPatient[] = [
  {
    id: '1',
    patientName: 'John Doe',
    room: '101',
    ward: 'ICU',
    admissionDate: '2026-05-10',
    expectedDischargeDate: '2026-05-25',
    diagnosis: 'Post-operative care',
    status: 'ADMITTED',
    doctor: 'Dr. Smith',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    room: '205',
    ward: 'General',
    admissionDate: '2026-05-12',
    expectedDischargeDate: '2026-05-20',
    diagnosis: 'Appendicitis treatment',
    status: 'RECOVERING',
    doctor: 'Dr. Johnson',
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    room: '302',
    ward: 'Cardiac',
    admissionDate: '2026-05-08',
    expectedDischargeDate: '2026-05-30',
    diagnosis: 'Cardiac intervention',
    status: 'RECOVERING',
    doctor: 'Dr. Davis',
  },
]

const statusColors: Record<string, string> = {
  ADMITTED: 'bg-red-500/10 text-red-600',
  RECOVERING: 'bg-yellow-500/10 text-yellow-600',
  DISCHARGED: 'bg-green-500/10 text-green-600',
}

export default function InPatientPage() {
  const [patients, setPatients] = useState<InPatient[]>(mockInPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<InPatient>>({})

  const filteredPatients = patients.filter((patient) =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.room.includes(searchTerm) ||
    patient.ward.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddPatient = () => {
    if (!formData.patientName || !formData.room || !formData.ward) {
      return
    }
    if (editingId) {
      setPatients((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
      )
      setEditingId(null)
    } else {
      const newPatient: InPatient = {
        id: Date.now().toString(),
        patientName: formData.patientName || '',
        room: formData.room || '',
        ward: formData.ward || '',
        admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
        expectedDischargeDate: formData.expectedDischargeDate || '',
        diagnosis: formData.diagnosis || '',
        status: 'ADMITTED',
        doctor: formData.doctor || '',
      }
      setPatients((prev) => [newPatient, ...prev])
    }
    setFormData({})
    setIsDialogOpen(false)
  }

  const handleEdit = (patient: InPatient) => {
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
            <h1 className="text-3xl font-bold text-foreground">In-Patient Management</h1>
            <p className="text-muted-foreground mt-1">Manage hospitalized patients and their care</p>
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
                Admit Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Patient Admission' : 'Admit New Patient'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update patient admission details'
                    : 'Add a new patient to the hospital'}
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
                    <label className="text-sm font-medium">Room Number</label>
                    <Input
                      placeholder="e.g., 101"
                      value={formData.room || ''}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ward</label>
                    <Input
                      placeholder="e.g., ICU"
                      value={formData.ward || ''}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Diagnosis</label>
                  <Input
                    placeholder="Enter diagnosis"
                    value={formData.diagnosis || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnosis: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Admission Date</label>
                    <Input
                      type="date"
                      value={formData.admissionDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, admissionDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expected Discharge</label>
                    <Input
                      type="date"
                      value={formData.expectedDischargeDate || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedDischargeDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Assigned Doctor</label>
                  <Input
                    placeholder="e.g., Dr. Smith"
                    value={formData.doctor || ''}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
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
                    {editingId ? 'Update' : 'Admit'}
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
                placeholder="Search by patient name, room, or ward..."
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
                    <TableHead className="font-semibold">Room/Ward</TableHead>
                    <TableHead className="font-semibold">Diagnosis</TableHead>
                    <TableHead className="font-semibold">Doctor</TableHead>
                    <TableHead className="font-semibold">Admission Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="border-muted-foreground/20">
                      <TableCell className="font-medium">{patient.patientName}</TableCell>
                      <TableCell>
                        {patient.room} - {patient.ward}
                      </TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                      <TableCell>{patient.doctor}</TableCell>
                      <TableCell>
                        {new Date(patient.admissionDate).toLocaleDateString()}
                      </TableCell>
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
                <Bed className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No in-patients found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Patient</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove the patient from the in-patient list.
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
