"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ArrowUpDown, Download, Pencil, Trash2 } from "lucide-react"
import { AddPolicyContact } from "./add-policy-contact"
import { saveContactInfo } from "@/lib/policy/policy-storage"

interface ContactInformationTabProps {
  policyId: string
  onSave: () => void
  onCancel: () => void
  initialData?: any
}

interface Contact {
  id: string
  no: number
  name: string
  category: string
  designation: string
  email: string
  mobileNo: string
  officeNo: string
  extNo: string
  status: string
  remarks: string
}

export function ContactInformationTab({ policyId, onSave, onCancel, initialData }: ContactInformationTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showAddContact, setShowAddContact] = useState(false)

  // Load initial data if available
  useEffect(() => {
    if (initialData && initialData.contacts && initialData.contacts.length > 0) {
      setContacts(initialData.contacts)
    }
  }, [initialData])

  const handleAddNew = () => {
    setShowAddContact(true)
  }

  const handleSaveContact = (contact: Contact) => {
    setContacts((prev) => [...prev, contact])
    setShowAddContact(false)
  }

  const handleExport = () => {
    console.log("Export contacts clicked")
  }

  const handleEditContact = (id: string) => {
    console.log("Edit contact", id)
  }

  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContacts((prev) => prev.filter((contact) => contact.id !== id))
    }
  }

  const handleSaveAll = () => {
    // Save contacts to local storage
    saveContactInfo(policyId, { contacts })

    // Show a success message or notification here if needed
    alert("Contact information saved successfully!")
  }

  const getSortIcon = () => {
    return <ArrowUpDown className="h-4 w-4 ml-1" />
  }

  return (
    <>
      <Card className="rounded-lg border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Contact Listing</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[240px]"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                Add New
              </Button>
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[60px]">No.</TableHead>
                  <TableHead className="w-[150px]">
                    <div className="flex items-center">
                      Contact Name
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <div className="flex items-center">
                      Contact Category
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <div className="flex items-center">
                      Designation
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[180px]">
                    <div className="flex items-center">
                      Email
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center">
                      Mobile No.
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center">
                      Office No.
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]">
                    <div className="flex items-center">
                      Ext. No.
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center">
                      Status
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <div className="flex items-center">
                      Remarks
                      {getSortIcon()}
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length > 0 ? (
                  contacts.map((contact, index) => (
                    <TableRow key={contact.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.category}</TableCell>
                      <TableCell>{contact.designation}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.mobileNo}</TableCell>
                      <TableCell>{contact.officeNo}</TableCell>
                      <TableCell>{contact.extNo}</TableCell>
                      <TableCell>{contact.status}</TableCell>
                      <TableCell>{contact.remarks}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditContact(contact.id)}
                          >
                            <span className="sr-only">Edit</span>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <span className="sr-only">Delete</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-gray-500">
                      No contacts found. Click "Add New" to add a contact.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={onCancel} variant="destructive">
              Cancel
            </Button>
            <Button onClick={handleSaveAll} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {showAddContact && (
        <AddPolicyContact
          onBack={() => setShowAddContact(false)}
          onSave={handleSaveContact}
          contactCount={contacts.length}
        />
      )}
    </>
  )
}
