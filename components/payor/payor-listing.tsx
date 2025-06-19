"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react"
import { PayorStorage } from "@/lib/payor/payor-storage"
import type { Payor } from "@/lib/payor/payor-storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PayorListingProps {
  payors: Payor[]
  onAddNew: () => void
  onEditPayor: (payor: Payor) => void
  onViewPayor: (payor: Payor) => void
  onUpdatePayors: (payors: Payor[]) => void
}

export function PayorListing({ payors, onAddNew, onEditPayor, onViewPayor, onUpdatePayors }: PayorListingProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPayor, setSelectedPayor] = useState<Payor | null>(null)

  const handleView = (payor: Payor) => {
    onViewPayor(payor)
  }

  const handleEdit = (payor: Payor) => {
    onEditPayor(payor)
  }

  const handleDelete = (payor: Payor) => {
    setSelectedPayor(payor)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (selectedPayor) {
      const success = PayorStorage.deletePayor(selectedPayor.id)

      if (success) {
        const updatedPayors = PayorStorage.getAllPayors()
        onUpdatePayors(updatedPayors)
      } else {
        alert("Error deleting payor. Please try again.")
      }
    }
    setShowDeleteDialog(false)
    setSelectedPayor(null)
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm font-medium text-slate-500">
              <th className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">No.</div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  Payor Name
                  <ArrowUpDown className="ml-1 h-4 w-4 cursor-pointer" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  Payor Code
                  <ArrowUpDown className="ml-1 h-4 w-4 cursor-pointer" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-1 h-4 w-4 cursor-pointer" />
                </div>
              </th>
              <th className="py-3 px-4 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {payors.map((payor, index) => (
              <tr key={payor.id} className="text-slate-700">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{payor.name}</td>
                <td className="py-3 px-4">{payor.code}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      payor.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {payor.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(payor)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(payor)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(payor)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this payor?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the payor
              {selectedPayor && <span className="font-medium"> "{selectedPayor.name}"</span>} and remove their data from
              the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
