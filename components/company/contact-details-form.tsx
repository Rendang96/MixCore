"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react"
import React from "react"

export interface Contact {
  id: number
  title: string[] // Array of titles
  name: string
  function: string
  status: string
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
  // Initialize saved contacts from props (persisted data)
  const [savedContacts, setSavedContacts] = React.useState<Contact[]>(contacts || [])
  const [currentContact, setCurrentContact] = React.useState<Contact>({
    id: 1,
    title: [], // Array of titles
    name: "",
    function: "",
    status: "active",
    designation: "",
    email: "",
    officeNo: "",
    mobileNo: "",
    remarks: "",
  })
  const [nextContactId, setNextContactId] = React.useState(
    contacts && contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 2,
  )

  // State for title dropdown
  const [titleDropdownOpen, setTitleDropdownOpen] = React.useState(false)
  const [selectedTitle, setSelectedTitle] = React.useState("")

  // Search and filter states
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterFunction, setFilterFunction] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage] = React.useState(5)

  // List of all available titles
  const availableTitles = [
    "Mr.",
    "Mrs.",
    "Miss",
    "Ms.",
    "Mdm.",
    "Dr.",
    "Prof.",
    "Assoc. Prof.",
    "Ir.",
    "Ts.",
    "Sr.",
    "Ar.",
    "Engr.",
    "Tan Sri",
    "Tun",
    "Dato'",
    "Datuk",
    "Datin",
    "Datin Seri",
    "Datin Paduka",
    "Tunku",
    "Yang Berbahagia",
    "Yang Amat Berhormat",
    "Yang Berhormat",
    "Capt.",
    "Lt.",
    "Major",
    "Col.",
    "ACP",
    "Ustaz",
    "Ustazah",
    "Sheikh",
    "Haji",
    "Hajah",
    "Rev.",
    "Pastor",
    "Father",
    "Bishop",
  ]

  // Load existing contacts on component mount
  React.useEffect(() => {
    if (contacts && contacts.length > 0) {
      setSavedContacts(contacts)
      setNextContactId(Math.max(...contacts.map((c) => c.id)) + 1)
    }
  }, [contacts])

  const handleInputChange = (field: keyof Contact, value: string | string[]) => {
    setCurrentContact((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTitle = (title: string) => {
    if (title && !currentContact.title.includes(title)) {
      handleInputChange("title", [...currentContact.title, title])
    }
    setSelectedTitle("")
  }

  const handleRemoveTitle = (titleToRemove: string) => {
    handleInputChange(
      "title",
      currentContact.title.filter((t) => t !== titleToRemove),
    )
  }

  const handleSaveContact = () => {
    // Add current contact to saved contacts
    const newSavedContacts = [...savedContacts, { ...currentContact }]
    setSavedContacts(newSavedContacts)

    // Also update the parent component's contacts state immediately
    setContacts(newSavedContacts)

    // Reset form for next contact
    setCurrentContact({
      id: nextContactId,
      title: [],
      name: "",
      function: "",
      status: "active",
      designation: "",
      email: "",
      officeNo: "",
      mobileNo: "",
      remarks: "",
    })
    setNextContactId(nextContactId + 1)
  }

  const handleResetContact = () => {
    // Reset current contact form
    setCurrentContact({
      ...currentContact,
      title: [],
      name: "",
      function: "",
      designation: "",
      email: "",
      officeNo: "",
      mobileNo: "",
      remarks: "",
    })
  }

  const handleRemoveSavedContact = (contactId: number) => {
    const newSavedContacts = savedContacts.filter((contact) => contact.id !== contactId)
    setSavedContacts(newSavedContacts)
    // Also remove from parent component's contacts state immediately
    setContacts(newSavedContacts)
  }

  const handleEditSavedContact = (contactId: number) => {
    const contactToEdit = savedContacts.find((contact) => contact.id === contactId)
    if (contactToEdit) {
      // Load the saved contact data into the current form
      setCurrentContact({ ...contactToEdit })

      // Remove from saved contacts since it's being edited
      const newSavedContacts = savedContacts.filter((contact) => contact.id !== contactId)
      setSavedContacts(newSavedContacts)
      setContacts(newSavedContacts)
    }
  }

  // Filter and search logic
  const filteredContacts = React.useMemo(() => {
    let filtered = savedContacts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.officeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.mobileNo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply function filter
    if (filterFunction && filterFunction !== "all") {
      filtered = filtered.filter((contact) => contact.function === filterFunction)
    }

    return filtered
  }, [savedContacts, searchTerm, filterFunction])

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterFunction])

  const handleSave = () => {
    // Ensure all saved contacts are persisted to parent component
    setContacts(savedContacts)
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-slate-800">Contact Information</h3>
      </div>

      {/* Single Contact Form */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Contact Details</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
              Contact Name
            </label>
            <Input
              id="contact-name"
              value={currentContact.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Multi-select Title field */}
          <div className="space-y-2">
            <label htmlFor="contact-title" className="text-sm font-medium text-slate-700">
              Title *
            </label>
            <div className="relative">
              <div
                className="flex items-center w-full border rounded-md px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500"
                onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
              >
                <input
                  type="text"
                  placeholder="Select title"
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="flex-grow outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && selectedTitle) {
                      e.preventDefault()
                      handleAddTitle(selectedTitle)
                    }
                  }}
                />
                <button
                  type="button"
                  className="ml-2 text-gray-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    setTitleDropdownOpen(!titleDropdownOpen)
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {titleDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {availableTitles
                    .filter((title) => title.toLowerCase().includes(selectedTitle.toLowerCase()))
                    .map((title) => (
                      <div
                        key={title}
                        className="px-3 py-2 hover:bg-sky-50 cursor-pointer"
                        onClick={() => {
                          handleAddTitle(title)
                          setTitleDropdownOpen(false)
                        }}
                      >
                        {title}
                      </div>
                    ))}
                </div>
              )}

              {/* Selected titles as tags */}
              {currentContact.title.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentContact.title.map((title) => (
                    <div key={title} className="flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm">
                      {title}
                      <button
                        type="button"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => handleRemoveTitle(title)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-function" className="text-sm font-medium text-slate-700">
              Contact Function
            </label>
            <Select onValueChange={(value) => handleInputChange("function", value)} value={currentContact.function}>
              <SelectTrigger id="contact-function" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="pmcare-account-manager">PMCare Account Manager</SelectItem>
                <SelectItem value="pmcare-sales">PMCare Sales</SelectItem>
                <SelectItem value="company-pic">Company PIC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-status" className="text-sm font-medium text-slate-700">
              Status
            </label>
            <Select onValueChange={(value) => handleInputChange("status", value)} value={currentContact.status}>
              <SelectTrigger id="contact-status" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="designation" className="text-sm font-medium text-slate-700">
              Designation
            </label>
            <Input
              id="designation"
              value={currentContact.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={currentContact.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="office-no" className="text-sm font-medium text-slate-700">
              Office No.
            </label>
            <Input
              id="office-no"
              value={currentContact.officeNo}
              onChange={(e) => handleInputChange("officeNo", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="mobile-no" className="text-sm font-medium text-slate-700">
              Mobile No.
            </label>
            <Input
              id="mobile-no"
              value={currentContact.mobileNo}
              onChange={(e) => handleInputChange("mobileNo", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2 col-span-3">
            <label htmlFor="remarks" className="text-sm font-medium text-slate-700">
              Remarks
            </label>
            <Textarea
              id="remarks"
              value={currentContact.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Save and Reset buttons for the contact form */}
          <div className="col-span-3 flex gap-3 mt-4">
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSaveContact}>
              Save
            </Button>
            <Button variant="outline" onClick={handleResetContact}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Listing Section */}
      <div className="mt-8">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-slate-800">Contact Listing</h4>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={filterFunction} onValueChange={(value) => setFilterFunction(value === "all" ? "" : value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by function" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Functions</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="pmcare-account-manager">PMCare Account Manager</SelectItem>
                <SelectItem value="pmcare-sales">PMCare Sales</SelectItem>
                <SelectItem value="company-pic">Company PIC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">No.</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Title</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Function</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Designation</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">E-mail</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Office No.</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Mobile No.</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Remarks</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.length > 0 ? (
                  paginatedContacts.map((contact, index) => (
                    <tr key={contact.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-800">{startIndex + index + 1}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">
                        {contact.title && contact.title.length > 0 ? contact.title.join(", ") : "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-blue-600 font-medium">{contact.name || "-"}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">{contact.function || "-"}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contact.status === "active"
                              ? "bg-green-100 text-green-800"
                              : contact.status === "inactive"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {contact.status ? contact.status.charAt(0).toUpperCase() + contact.status.slice(1) : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-800">{contact.designation || "-"}</td>
                      <td className="py-3 px-4 text-sm text-amber-600">{contact.email || "-"}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">{contact.officeNo || "-"}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">{contact.mobileNo || "-"}</td>
                      <td className="py-3 px-4 text-sm text-slate-800">{contact.remarks || "-"}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSavedContact(contact.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveSavedContact(contact.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="py-8 px-4 text-center text-slate-500">
                      {savedContacts.length === 0
                        ? "No contacts saved yet. Please fill out the contact form above and click Save."
                        : "No contacts match your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact count display */}
        <div className="mt-4 text-right">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length} contacts
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

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
