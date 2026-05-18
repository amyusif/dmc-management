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
import { Plus, Search, Edit2, Trash2, DollarSign, Eye, FileText } from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  patientName: string
  amount: number
  date: string
  dueDate: string
  services: string
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED'
  insuranceProvider?: string
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    patientName: 'John Doe',
    amount: 1500.0,
    date: '2026-05-10',
    dueDate: '2026-05-25',
    services: 'Surgery, Anesthesia, Hospital stay (3 days)',
    status: 'PAID',
    insuranceProvider: 'MediCare Insurance',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    patientName: 'Jane Smith',
    amount: 850.0,
    date: '2026-05-12',
    dueDate: '2026-05-27',
    services: 'Consultation, CT Scan, Lab tests',
    status: 'PENDING',
    insuranceProvider: 'HealthPlus',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    patientName: 'Robert Wilson',
    amount: 2200.0,
    date: '2026-04-28',
    dueDate: '2026-05-13',
    services: 'ICU stay (5 days), Cardiac monitoring, Medications',
    status: 'OVERDUE',
    insuranceProvider: 'Prime Health',
  },
]

const statusColors: Record<string, string> = {
  PAID: 'bg-green-500/10 text-green-600',
  PENDING: 'bg-blue-500/10 text-blue-600',
  OVERDUE: 'bg-red-500/10 text-red-600',
  CANCELLED: 'bg-gray-500/10 text-gray-600',
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Invoice>>({})

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.services.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const totalPending = invoices
    .filter((inv) => inv.status === 'PENDING' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const handleAddInvoice = () => {
    if (!formData.patientName || !formData.amount || !formData.invoiceNumber) {
      return
    }
    if (editingId) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === editingId ? { ...inv, ...formData } : inv))
      )
      setEditingId(null)
    } else {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: formData.invoiceNumber || '',
        patientName: formData.patientName || '',
        amount: formData.amount || 0,
        date: formData.date || new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate || '',
        services: formData.services || '',
        status: 'PENDING',
        insuranceProvider: formData.insuranceProvider,
      }
      setInvoices((prev) => [newInvoice, ...prev])
    }
    setFormData({})
    setIsDialogOpen(false)
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingId(invoice.id)
    setFormData(invoice)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
    setDeleteId(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Billing Management</h1>
            <p className="text-muted-foreground mt-1">Manage invoices and patient billing</p>
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
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Invoice' : 'Create New Invoice'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update invoice details'
                    : 'Create a new patient invoice'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Invoice Number</label>
                    <Input
                      placeholder="e.g., INV-001"
                      value={formData.invoiceNumber || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          invoiceNumber: e.target.value,
                        })
                      }
                    />
                  </div>
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
                </div>
                <div>
                  <label className="text-sm font-medium">Services</label>
                  <Input
                    placeholder="e.g., Consultation, Lab tests, Surgery"
                    value={formData.services || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, services: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Amount ($)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.amount || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Insurance Provider</label>
                    <Input
                      placeholder="Optional"
                      value={formData.insuranceProvider || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          insuranceProvider: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Invoice Date</label>
                    <Input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={formData.dueDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddInvoice}>
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="border-0 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="border-0 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending/Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  ${totalPending.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-500/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 bg-muted px-3 py-2 rounded-lg w-fit">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, invoice number, or services..."
                className="border-0 bg-transparent outline-none w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-muted-foreground/20">
                    <TableHead className="font-semibold">Invoice #</TableHead>
                    <TableHead className="font-semibold">Patient Name</TableHead>
                    <TableHead className="font-semibold">Services</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="border-muted-foreground/20">
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {invoice.services}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${invoice.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[invoice.status]}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(invoice)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(invoice.id)}
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
            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No invoices found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the invoice record.
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
