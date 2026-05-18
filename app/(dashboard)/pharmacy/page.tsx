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
import { Plus, Search, Edit2, Trash2, Pill, AlertCircle } from 'lucide-react'

interface Medicine {
  id: string
  drugName: string
  generic: string
  category: string
  quantity: number
  price: number
  expiryDate: string
  manufacturer: string
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
}

const mockMedicines: Medicine[] = [
  {
    id: '1',
    drugName: 'Paracetamol 500mg',
    generic: 'Acetaminophen',
    category: 'Analgesic',
    quantity: 450,
    price: 2.5,
    expiryDate: '2027-06-30',
    manufacturer: 'PharmaCorp',
    stockStatus: 'IN_STOCK',
  },
  {
    id: '2',
    drugName: 'Amoxicillin 250mg',
    generic: 'Amoxicillin',
    category: 'Antibiotic',
    quantity: 120,
    price: 5.0,
    expiryDate: '2026-12-31',
    manufacturer: 'MediCare Labs',
    stockStatus: 'LOW_STOCK',
  },
  {
    id: '3',
    drugName: 'Ibuprofen 200mg',
    generic: 'Ibuprofen',
    category: 'NSAID',
    quantity: 0,
    price: 3.0,
    expiryDate: '2026-08-15',
    manufacturer: 'GenericMed',
    stockStatus: 'OUT_OF_STOCK',
  },
]

const statusColors: Record<string, string> = {
  IN_STOCK: 'bg-green-500/10 text-green-600',
  LOW_STOCK: 'bg-yellow-500/10 text-yellow-600',
  OUT_OF_STOCK: 'bg-red-500/10 text-red-600',
}

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Medicine>>({})

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.generic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddMedicine = () => {
    if (!formData.drugName || !formData.generic || !formData.category) {
      return
    }
    if (editingId) {
      setMedicines((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...formData } : m))
      )
      setEditingId(null)
    } else {
      const newMedicine: Medicine = {
        id: Date.now().toString(),
        drugName: formData.drugName || '',
        generic: formData.generic || '',
        category: formData.category || '',
        quantity: formData.quantity || 0,
        price: formData.price || 0,
        expiryDate: formData.expiryDate || '',
        manufacturer: formData.manufacturer || '',
        stockStatus: (formData.quantity || 0) > 100 ? 'IN_STOCK' : 'LOW_STOCK',
      }
      setMedicines((prev) => [newMedicine, ...prev])
    }
    setFormData({})
    setIsDialogOpen(false)
  }

  const handleEdit = (medicine: Medicine) => {
    setEditingId(medicine.id)
    setFormData(medicine)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id))
    setDeleteId(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pharmacy Management</h1>
            <p className="text-muted-foreground mt-1">Manage medicines and inventory</p>
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
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Medicine' : 'Add New Medicine'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update medicine details'
                    : 'Add a new medicine to the pharmacy inventory'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Drug Name</label>
                  <Input
                    placeholder="e.g., Paracetamol 500mg"
                    value={formData.drugName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, drugName: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Generic Name</label>
                    <Input
                      placeholder="e.g., Acetaminophen"
                      value={formData.generic || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, generic: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      placeholder="e.g., Analgesic"
                      value={formData.category || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.quantity || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input
                      type="date"
                      value={formData.expiryDate || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Manufacturer</label>
                    <Input
                      placeholder="e.g., PharmaCorp"
                      value={formData.manufacturer || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, manufacturer: e.target.value })
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
                  <Button onClick={handleAddMedicine}>
                    {editingId ? 'Update' : 'Add'}
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
                placeholder="Search by drug name, generic name, or category..."
                className="border-0 bg-transparent outline-none w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-muted-foreground/20">
                    <TableHead className="font-semibold">Drug Name</TableHead>
                    <TableHead className="font-semibold">Generic</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Expiry Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine) => (
                    <TableRow key={medicine.id} className="border-muted-foreground/20">
                      <TableCell className="font-medium">{medicine.drugName}</TableCell>
                      <TableCell className="text-sm">{medicine.generic}</TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>{medicine.quantity}</TableCell>
                      <TableCell>${medicine.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[medicine.stockStatus]}>
                          {medicine.stockStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(medicine)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(medicine.id)}
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
            {filteredMedicines.length === 0 && (
              <div className="text-center py-12">
                <Pill className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No medicines found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the medicine from inventory.
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
