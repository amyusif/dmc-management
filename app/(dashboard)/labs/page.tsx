'use client'

import { useState } from 'react'
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
import { Plus, Search, Edit2, Trash2, Microscope, Download } from 'lucide-react'

interface LabTest {
  id: string
  patientName: string
  testName: string
  orderedBy: string
  orderedDate: string
  resultDate: string
  result: string
  status: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
  notes: string
}

const mockLabTests: LabTest[] = [
  {
    id: '1',
    patientName: 'John Doe',
    testName: 'Complete Blood Count (CBC)',
    orderedBy: 'Dr. Smith',
    orderedDate: '2026-05-15',
    resultDate: '2026-05-17',
    result: 'Normal',
    status: 'COMPLETED',
    notes: 'All parameters within normal range',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    testName: 'Thyroid Function Test',
    orderedBy: 'Dr. Johnson',
    orderedDate: '2026-05-18',
    resultDate: '2026-05-19',
    result: 'Abnormal',
    status: 'COMPLETED',
    notes: 'TSH levels elevated, requires follow-up',
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    testName: 'Liver Function Test',
    orderedBy: 'Dr. Davis',
    orderedDate: '2026-05-18',
    resultDate: '',
    result: '',
    status: 'IN_PROGRESS',
    notes: 'Sample received, processing',
  },
]

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-500/10 text-gray-600',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-600',
  COMPLETED: 'bg-green-500/10 text-green-600',
}

export default function LabsPage() {
  const [tests, setTests] = useState<LabTest[]>(mockLabTests)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<LabTest>>({})

  const filteredTests = tests.filter((test) =>
    test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.orderedBy.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddTest = () => {
    if (!formData.patientName || !formData.testName || !formData.orderedBy) {
      return
    }
    if (editingId) {
      setTests((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...formData } : t))
      )
      setEditingId(null)
    } else {
      const newTest: LabTest = {
        id: Date.now().toString(),
        patientName: formData.patientName || '',
        testName: formData.testName || '',
        orderedBy: formData.orderedBy || '',
        orderedDate: formData.orderedDate || new Date().toISOString().split('T')[0],
        resultDate: formData.resultDate || '',
        result: formData.result || '',
        status: 'PENDING',
        notes: formData.notes || '',
      }
      setTests((prev) => [newTest, ...prev])
    }
    setFormData({})
    setIsDialogOpen(false)
  }

  const handleEdit = (test: LabTest) => {
    setEditingId(test.id)
    setFormData(test)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id))
    setDeleteId(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Laboratory Management</h1>
            <p className="text-muted-foreground mt-1">Manage lab tests and results</p>
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
                Order Test
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Lab Test' : 'Order New Lab Test'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update lab test details'
                    : 'Create a new lab test order'}
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
                <div>
                  <label className="text-sm font-medium">Test Name</label>
                  <Input
                    placeholder="e.g., Complete Blood Count"
                    value={formData.testName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, testName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ordered By (Doctor)</label>
                  <Input
                    placeholder="e.g., Dr. Smith"
                    value={formData.orderedBy || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, orderedBy: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Order Date</label>
                    <Input
                      type="date"
                      value={formData.orderedDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, orderedDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Result Date</label>
                    <Input
                      type="date"
                      value={formData.resultDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, resultDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Result</label>
                  <Input
                    placeholder="e.g., Normal, Abnormal"
                    value={formData.result || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, result: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    placeholder="Additional notes about the test"
                    value={formData.notes || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
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
                  <Button onClick={handleAddTest}>
                    {editingId ? 'Update' : 'Create'}
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
                placeholder="Search by patient, test name, or doctor..."
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
                    <TableHead className="font-semibold">Test Name</TableHead>
                    <TableHead className="font-semibold">Ordered By</TableHead>
                    <TableHead className="font-semibold">Order Date</TableHead>
                    <TableHead className="font-semibold">Result</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.map((test) => (
                    <TableRow key={test.id} className="border-muted-foreground/20">
                      <TableCell className="font-medium">{test.patientName}</TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{test.orderedBy}</TableCell>
                      <TableCell>
                        {new Date(test.orderedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{test.result || '-'}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[test.status]}>
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Download Result"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(test)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(test.id)}
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
            {filteredTests.length === 0 && (
              <div className="text-center py-12">
                <Microscope className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No lab tests found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lab Test</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the lab test record.
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
    </DashboardLayout>
  )
}
