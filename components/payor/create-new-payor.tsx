"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PayorContactDetails } from "@/components/payor/payor-contact-details"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { v4 as uuidv4 } from "uuid"
import { PayorStorage } from "@/lib/payor/payor-storage"
import type { Payor, PayorContact } from "@/lib/payor/payor-storage"

type TabType = "basic-info" | "contact-details"

interface CreateNewPayorProps {
  onBack: () => void
  onSave?: (payor: Payor, shouldNavigateBack?: boolean) => void
  initialPayor?: Payor
}

export function CreateNewPayor({ onBack, onSave, initialPayor }: CreateNewPayorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic-info")
  const [payorData, setPayorData] = useState<Payor>(
    initialPayor || {
      id: uuidv4(),
      name: "",
      code: "",
      address: "",
      city: "",
      postcode: "",
      state: "",
      country: "",
      remarks: "",
      status: "Active",
      contacts: [],
    },
  )
  const [generatedCode, setGeneratedCode] = useState<string>("Auto-generated")
  const [isBasicInfoSaved, setIsBasicInfoSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(!!initialPayor)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Breadcrumb items for Create/Edit Payor
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Payor",
      onClick: onBack,
    },
    { label: isEditing ? "Edit Payor" : "Create New Payor" },
  ]

  // Check for editing payor in localStorage
  useEffect(() => {
    const editingPayor = localStorage.getItem("editingPayor")
    if (editingPayor && !initialPayor) {
      const parsedPayor = JSON.parse(editingPayor)
      setPayorData(parsedPayor)
      setGeneratedCode(parsedPayor.code)
      setIsBasicInfoSaved(true)
      setIsEditing(true)
      // Clear the editing payor from localStorage
      localStorage.removeItem("editingPayor")
    } else if (initialPayor) {
      setIsEditing(true)
      setGeneratedCode(initialPayor.code)
    }
  }, [initialPayor])

  // Generate payor code based on payor name - always update when name changes
  useEffect(() => {
    if (payorData.name && !isEditing) {
      // Create code from first 3 letters of payor name + random 3 digits
      const prefix = payorData.name.substring(0, 3).toUpperCase()
      const randomDigits = Math.floor(Math.random() * 900) + 100 // Random 3-digit number
      const newCode = `${prefix}-${randomDigits}`

      // Always update the generated code when name changes
      setGeneratedCode(newCode)

      // Update the payor data with the generated code
      setPayorData((prev) => ({
        ...prev,
        code: newCode,
      }))
    } else if (!payorData.name && !isEditing) {
      setGeneratedCode("Auto-generated")

      // Clear the code in payor data when name is empty
      setPayorData((prev) => ({
        ...prev,
        code: "",
      }))
    }
  }, [payorData.name, isEditing]) // Only depend on name to ensure it updates whenever name changes

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [payorData])

  // Auto-save form data every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && payorData.name.trim()) {
        PayorStorage.autoSavePayor(payorData)
        console.log("Auto-saved payor data")
      }
    }, 30000)

    return () => clearInterval(autoSaveInterval)
  }, [hasUnsavedChanges, payorData])

  // Load auto-saved data on component mount
  useEffect(() => {
    if (!initialPayor && !isEditing) {
      const autoSavedPayors = PayorStorage.getAllAutoSavedPayors()

      if (autoSavedPayors.length > 0) {
        const mostRecent = autoSavedPayors[0]

        if (mostRecent.data.name) {
          const shouldRestore = confirm(
            `Found unsaved payor data for "${mostRecent.data.name}". Would you like to restore it?`,
          )

          if (shouldRestore) {
            setPayorData(mostRecent.data)
            setGeneratedCode(mostRecent.data.code)
            setHasUnsavedChanges(true)
          }

          PayorStorage.clearAutoSavedPayor(mostRecent.data.id)
        }
      }
    }
  }, [])

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
  }

  const handleInputChange = (field: keyof Payor, value: string) => {
    setPayorData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)
  }

  const handleSaveBasicInfo = () => {
    if (!payorData.name.trim()) {
      alert("Please enter a Payor Name")
      return
    }

    // Check if payor can be safely updated (if editing)
    if (isEditing) {
      const relationshipStats = PayorStorage.getPayorRelationshipStats(payorData.id)
      if (relationshipStats.productCount > 0) {
        const confirmUpdate = confirm(
          `This payor has ${relationshipStats.productCount} associated product(s) and ${relationshipStats.policyCount} policy/policies. ` +
            "Updating payor information will affect all related records. Do you want to continue?",
        )
        if (!confirmUpdate) return
      }
    }

    try {
      setIsBasicInfoSaved(true)
      setHasUnsavedChanges(false)

      PayorStorage.clearAutoSavedPayor(payorData.id)

      if (onSave) {
        onSave(payorData, false)
      }

      alert(
        "Payor information saved successfully! You can now add contact details or go back to search for this payor.",
      )
    } catch (error) {
      console.error("Error saving payor:", error)
      alert("Error saving payor data. Please try again.")
    }
  }

  const handleAddContact = (contact: PayorContact) => {
    try {
      const success = PayorStorage.addContactToPayor(payorData.id, contact)

      if (success) {
        const updatedPayor = PayorStorage.getPayorById(payorData.id)
        if (updatedPayor) {
          setPayorData(updatedPayor)
          if (onSave) {
            onSave(updatedPayor, false)
          }
        }
        console.log("Contact added and saved to storage")
      } else {
        throw new Error("Failed to add contact")
      }
    } catch (error) {
      console.error("Error adding contact:", error)
      alert("Error adding contact. Please try again.")
    }
  }

  const handleUpdateContact = (updatedContact: PayorContact) => {
    try {
      const success = PayorStorage.updateContactInPayor(payorData.id, updatedContact)

      if (success) {
        const updatedPayor = PayorStorage.getPayorById(payorData.id)
        if (updatedPayor) {
          setPayorData(updatedPayor)
          if (onSave) {
            onSave(updatedPayor, false)
          }
        }
        console.log("Contact updated and saved to storage")
      } else {
        throw new Error("Failed to update contact")
      }
    } catch (error) {
      console.error("Error updating contact:", error)
      alert("Error updating contact. Please try again.")
    }
  }

  const handleDeleteContact = (contactId: string) => {
    try {
      const success = PayorStorage.deleteContactFromPayor(payorData.id, contactId)

      if (success) {
        const updatedPayor = PayorStorage.getPayorById(payorData.id)
        if (updatedPayor) {
          setPayorData(updatedPayor)
          if (onSave) {
            onSave(updatedPayor, false)
          }
        }
        console.log("Contact deleted and changes saved to storage")
      } else {
        throw new Error("Failed to delete contact")
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
      alert("Error deleting contact. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{isEditing ? "Edit Payor" : "Create New Payor"}</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "basic-info"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => handleTabClick("basic-info")}
        >
          Basic Information
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "contact-details"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => handleTabClick("contact-details")}
        >
          Contact Details
        </button>
      </div>

      {activeTab === "basic-info" ? (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="payor-name" className="text-sm font-medium text-slate-700">
                Payor Name
              </label>
              <Input
                id="payor-name"
                placeholder="Enter Payor Name"
                className="w-full"
                value={payorData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="payor-code" className="text-sm font-medium text-slate-700">
                Payor Code
              </label>
              <Input
                id="payor-code"
                placeholder="Auto-generated"
                className="w-full bg-slate-50"
                value={generatedCode}
                disabled
              />
              <p className="text-xs text-slate-500">Auto-generated based on payor name</p>
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-slate-700">
                Address
              </label>
              <Input
                id="address"
                placeholder="Enter Address"
                className="w-full"
                value={payorData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="postcode" className="text-sm font-medium text-slate-700">
                Postcode
              </label>
              <Input
                id="postcode"
                placeholder="Enter Postcode"
                className="w-full"
                value={payorData.postcode}
                onChange={(e) => handleInputChange("postcode", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-slate-700">
                City
              </label>
              <Select value={payorData.city} onValueChange={(value) => handleInputChange("city", value)}>
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="penang">Penang</SelectItem>
                  <SelectItem value="johor-bahru">Johor Bahru</SelectItem>
                  <SelectItem value="ipoh">Ipoh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-slate-700">
                State
              </label>
              <Select value={payorData.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger id="state" className="w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selangor">Selangor</SelectItem>
                  <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="penang">Penang</SelectItem>
                  <SelectItem value="johor">Johor</SelectItem>
                  <SelectItem value="perak">Perak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-slate-700">
                Country
              </label>
              <Select value={payorData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger id="country" className="w-full">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malaysia">Malaysia</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="thailand">Thailand</SelectItem>
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
                value={payorData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="destructive" onClick={onBack}>
              Cancel
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSaveBasicInfo}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <PayorContactDetails
            contacts={payorData.contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
            onBack={onBack}
          />
          {/* The "Back to Basic Info" and "Submit" buttons that were here have been removed */}
        </div>
      )}
    </div>
  )
}
