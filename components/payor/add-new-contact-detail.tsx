"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { PayorContact } from "@/components/payor/payor-search"

interface AddNewContactDetailProps {
  onBack: () => void
  onSave: (contact: PayorContact) => void
}

export function AddNewContactDetail({ onBack, onSave }: AddNewContactDetailProps) {
  const [contactData, setContactData] = useState<PayorContact>({
    id: uuidv4(),
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

  const handleInputChange = (field: keyof PayorContact, value: string) => {
    setContactData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Basic validation
    if (!contactData.name.trim()) {
      alert("Please enter a contact name")
      return
    }

    // Save the contact
    onSave(contactData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">Add New Contact Details</h2>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
              Contact Name
            </label>
            <Input
              id="contact-name"
              placeholder="Enter Contact Name"
              className="w-full"
              value={contactData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-category" className="text-sm font-medium text-slate-700">
              Contact Category
            </label>
            <Select value={contactData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger id="contact-category" className="w-full">
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
              className="w-full"
              value={contactData.designation}
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
              className="w-full"
              value={contactData.email}
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
              className="w-full"
              value={contactData.mobileNo}
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
              className="w-full"
              value={contactData.officeNo}
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
              className="w-full"
              value={contactData.extNo}
              onChange={(e) => handleInputChange("extNo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              Status
            </label>
            <Select value={contactData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger id="status" className="w-full">
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
              className="w-full"
              value={contactData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="destructive" onClick={onBack}>
            Cancel
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
