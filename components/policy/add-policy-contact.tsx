"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

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

interface AddPolicyContactProps {
  onBack: () => void
  onSave: (contact: Contact) => void
  contactCount: number
}

export function AddPolicyContact({ onBack, onSave, contactCount }: AddPolicyContactProps) {
  const [contact, setContact] = useState<Contact>({
    id: uuidv4(),
    no: contactCount + 1,
    name: "",
    category: "",
    designation: "",
    email: "",
    mobileNo: "",
    officeNo: "",
    extNo: "",
    status: "Active",
    remarks: "",
  })

  const handleInputChange = (field: keyof Contact, value: string) => {
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Basic validation
    if (!contact.name.trim()) {
      alert("Please enter a contact name")
      return
    }

    onSave(contact)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold">Add New Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
                Contact Name
              </label>
              <Input
                id="contact-name"
                placeholder="Enter Contact Name"
                value={contact.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-category" className="text-sm font-medium text-slate-700">
                Contact Category
              </label>
              <Select value={contact.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger id="contact-category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Payor POC">Payor POC</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="designation" className="text-sm font-medium text-slate-700">
                Designation
              </label>
              <Input
                id="designation"
                placeholder="Enter Designation"
                value={contact.designation}
                onChange={(e) => handleInputChange("designation", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={contact.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mobile-no" className="text-sm font-medium text-slate-700">
                Mobile No.
              </label>
              <Input
                id="mobile-no"
                placeholder="Enter Mobile No."
                value={contact.mobileNo}
                onChange={(e) => handleInputChange("mobileNo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="office-no" className="text-sm font-medium text-slate-700">
                Office No.
              </label>
              <Input
                id="office-no"
                placeholder="Enter Office No."
                value={contact.officeNo}
                onChange={(e) => handleInputChange("officeNo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="ext-no" className="text-sm font-medium text-slate-700">
                Ext. No.
              </label>
              <Input
                id="ext-no"
                placeholder="Enter Ext. No."
                value={contact.extNo}
                onChange={(e) => handleInputChange("extNo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-slate-700">
                Status
              </label>
              <Select value={contact.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor="remarks" className="text-sm font-medium text-slate-700">
                Remarks
              </label>
              <Textarea
                id="remarks"
                placeholder="Enter Remarks"
                value={contact.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="destructive" onClick={onBack}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
