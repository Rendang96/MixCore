"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import React from "react"

export interface Contact {
  id: number
  name: string
  function: string
  designation: string
  email: string
  officeNo: string
  mobileNo: string
  remarks: string
}

interface ContactDetailsFormProps {
  onNext: () => void
  onBack: () => void
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
}

export function ContactDetailsForm({ onNext, onBack, contacts, setContacts }: ContactDetailsFormProps) {
  // Ensure we have at least one contact
  React.useEffect(() => {
    if (contacts.length === 0) {
      setContacts([
        {
          id: 1,
          name: "",
          function: "",
          designation: "",
          email: "",
          officeNo: "",
          mobileNo: "",
          remarks: "",
        },
      ])
    }
  }, [contacts, setContacts])

  const handleAddContact = () => {
    if (contacts.length < 3) {
      const newContact = {
        id: contacts.length + 1,
        name: "",
        function: "",
        designation: "",
        email: "",
        officeNo: "",
        mobileNo: "",
        remarks: "",
      }
      // Add new contact at the beginning of the array
      setContacts([newContact, ...contacts])
    }
  }

  const handleRemoveContact = (contactId: number) => {
    // Don't allow removing if only one contact remains
    if (contacts.length > 1) {
      setContacts(contacts.filter((contact) => contact.id !== contactId))
    }
  }

  const handleInputChange = (id: number, field: keyof Contact, value: string) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, [field]: value } : contact)))
  }

  const handleSave = () => {
    // The contacts are already saved in the parent component's state
    // Just navigate to the next screen
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Header with Add New button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-slate-800">Contact Information</h3>
        {contacts.length < 3 && (
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleAddContact}>
            Add New
          </Button>
        )}
      </div>

      {contacts.map((contact, index) => (
        <div key={contact.id} className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Contact {contact.id}</h3>
            {contacts.length > 1 && (
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Remove contact"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={`contact-name-${contact.id}`} className="text-sm font-medium text-slate-700">
                Contact Name
              </label>
              <Input
                id={`contact-name-${contact.id}`}
                value={contact.name}
                onChange={(e) => handleInputChange(contact.id, "name", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`contact-function-${contact.id}`} className="text-sm font-medium text-slate-700">
                Contact Function
              </label>
              <Select
                onValueChange={(value) => handleInputChange(contact.id, "function", value)}
                value={contact.function}
              >
                <SelectTrigger id={`contact-function-${contact.id}`} className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor={`designation-${contact.id}`} className="text-sm font-medium text-slate-700">
                Designation
              </label>
              <Input
                id={`designation-${contact.id}`}
                value={contact.designation}
                onChange={(e) => handleInputChange(contact.id, "designation", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`email-${contact.id}`} className="text-sm font-medium text-slate-700">
                E-mail
              </label>
              <Input
                id={`email-${contact.id}`}
                type="email"
                value={contact.email}
                onChange={(e) => handleInputChange(contact.id, "email", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`office-no-${contact.id}`} className="text-sm font-medium text-slate-700">
                Office No.
              </label>
              <Input
                id={`office-no-${contact.id}`}
                value={contact.officeNo}
                onChange={(e) => handleInputChange(contact.id, "officeNo", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`mobile-no-${contact.id}`} className="text-sm font-medium text-slate-700">
                Mobile No.
              </label>
              <Input
                id={`mobile-no-${contact.id}`}
                value={contact.mobileNo}
                onChange={(e) => handleInputChange(contact.id, "mobileNo", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor={`remarks-${contact.id}`} className="text-sm font-medium text-slate-700">
                Remarks
              </label>
              <Textarea
                id={`remarks-${contact.id}`}
                value={contact.remarks}
                onChange={(e) => handleInputChange(contact.id, "remarks", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {index < contacts.length - 1 && <div className="mt-6 border-b border-slate-200"></div>}
        </div>
      ))}

      <div className="flex gap-3">
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  )
}
