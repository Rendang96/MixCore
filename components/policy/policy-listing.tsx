"use client"

import { useState } from "react"
import { Search, FileText, Download, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import type { CompletePolicy } from "@/lib/policy/policy-storage"

interface PolicyListingProps {
  policies: CompletePolicy[]
  onView: (policy: CompletePolicy) => void
  onEdit: (policy: CompletePolicy) => void
  onDelete: (policyId: string) => void
}

export function PolicyListing({ policies, onView, onEdit, onDelete }: PolicyListingProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null)

  // Filter policies based on search term
  const filteredPolicies = policies.filter(
    (policy) =>
      policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle delete confirmation
  const handleDeleteClick = (policyId: string) => {
    setPolicyToDelete(policyId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (policyToDelete) {
      onDelete(policyToDelete)
      setPolicyToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  // Function to get status class based on status value
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700"
      case "inactive":
        return "bg-gray-100 text-gray-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "expired":
        return "bg-red-100 text-red-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Policy Listing</h2>
      <Card className="rounded-lg border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {filteredPolicies.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Policy Effective Date</TableHead>
                    <TableHead>Policy Expiry Date</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Services Type</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((policy, index) => (
                    <TableRow key={policy.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{policy.policyNumber}</TableCell>
                      <TableCell>{policy.policyName}</TableCell>
                      <TableCell>{policy.effectiveDate}</TableCell>
                      <TableCell>{policy.expiryDate}</TableCell>
                      <TableCell>
                        {policy.policyName === "Prudential Enhanced Medical Care"
                          ? "HP, SG, MT"
                          : policy.serviceType?.serviceTypes?.length > 0
                            ? policy.serviceType.serviceTypes.map((st) => st.code).join(", ")
                            : "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(policy.status || "Active")}`}
                        >
                          {policy.status || "Active"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => onView(policy)} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onEdit(policy)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(policy.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>No policy has been created.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the policy.
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
