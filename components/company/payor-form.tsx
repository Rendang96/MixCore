"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit, Search, Filter } from "lucide-react"

interface PayorData {
  id: number
  name: string
  code: string
  type: string
  status: string
}

interface PayorFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: PayorData[]
  onSaveData: (data: PayorData[]) => void
}

interface StoredPayor {
  id: string
  name: string
  code: string
  type: string
  status: string
}

export function PayorForm({ onNext, onBack, initialData = [], onSaveData }: PayorFormProps) {
  // Form state for current payor being added/edited
  const [currentPayor, setCurrentPayor] = useState<PayorData>({
    id: 0,
    name: "",
    code: "",
    type: "insurer",
    status: "",
  })

  // List of saved payors
  const [savedPayors, setSavedPayors] = useState<PayorData[]>(initialData)

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Auto-suggest state
  const [payorSuggestions, setPayorSuggestions] = useState<StoredPayor[]>([])
  const [showSuggestions, setShowSuggestions] = useState<{ [key: string]: boolean }>({})
  const [allStoredPayors, setAllStoredPayors] = useState<StoredPayor[]>([])

  // Search state for listing
  const [searchTerm, setSearchTerm] = useState("")

  // Refs for handling outside clicks
  const nameInputRef = useRef<HTMLDivElement>(null)
  const codeInputRef = useRef<HTMLDivElement>(null)

  // Load stored payors on component mount
  useEffect(() => {
    const loadStoredPayors = () => {
      try {
        const stored = localStorage.getItem("payors")
        if (stored) {
          const parsedPayors = JSON.parse(stored)
          setAllStoredPayors(parsedPayors)
        } else {
          // Default payors if none exist
          const defaultPayors: StoredPayor[] = [
            {
              id: "1",
              name: "Great Eastern Life Assurance (Malaysia) Berhad",
              code: "GELAM",
              type: "insurer",
              status: "active",
            },
            {
              id: "2",
              name: "Allianz Malaysia Berhad",
              code: "ALLMB",
              type: "insurer",
              status: "active",
            },
            {
              id: "3",
              name: "AIA Bhd.",
              code: "AIABHD",
              type: "insurer",
              status: "active",
            },
            {
              id: "4",
              name: "Prudential Assurance Malaysia Berhad",
              code: "PAMB",
              type: "insurer",
              status: "active",
            },
            {
              id: "5",
              name: "Zurich General Insurance Malaysia Berhad",
              code: "ZGIMB",
              type: "insurer",
              status: "active",
            },
            {
              id: "6",
              name: "PMCare Sdn Bhd",
              code: "PMC001",
              type: "insurer",
              status: "active",
            },
          ]
          setAllStoredPayors(defaultPayors)
          localStorage.setItem("payors", JSON.stringify(defaultPayors))
        }
      } catch (error) {
        console.error("Error loading payors:", error)
      }
    }

    loadStoredPayors()
  }, [])

  // Update parent component when saved payors change
  useEffect(() => {
    onSaveData(savedPayors)
  }, [savedPayors, onSaveData])

  // Function to search for payors
  const searchPayors = (query: string, field: "name" | "code") => {
    if (query.length >= 1) {
      const filteredPayors = allStoredPayors.filter((payor) =>
        field === "name"
          ? payor.name.toLowerCase().includes(query.toLowerCase())
          : payor.code.toLowerCase().includes(query.toLowerCase()),
      )
      setPayorSuggestions(filteredPayors)
      setShowSuggestions((prev) => ({ ...prev, [field]: true }))
    } else {
      setPayorSuggestions([])
      setShowSuggestions((prev) => ({ ...prev, [field]: false }))
    }
  }

  // Handle selecting a payor from suggestions
  const handleSelectPayor = (payor: StoredPayor) => {
    setCurrentPayor({
      ...currentPayor,
      name: payor.name,
      code: payor.code,
      type: payor.type === "insurer" ? "insurer" : "self-funded",
      status: payor.status,
    })
    setShowSuggestions({})
  }

  // Handle form field changes
  const handleNameChange = (name: string) => {
    setCurrentPayor({
      ...currentPayor,
      name,
      // Don't clear code if we're just typing in the name field
    })

    searchPayors(name, "name")
  }

  const handleCodeChange = (code: string) => {
    setCurrentPayor({
      ...currentPayor,
      code,
      // Don't clear name if we're just typing in the code field
    })

    searchPayors(code, "code")
  }

  const handleTypeChange = (type: string) => {
    setCurrentPayor({
      ...currentPayor,
      type,
    })
  }

  // Save payor to listing
  const handleSavePayor = () => {
    // Check if the payor exists in stored payors
    const payorExists = allStoredPayors.some(
      (p) =>
        p.name.toLowerCase() === currentPayor.name.toLowerCase() &&
        p.code.toLowerCase() === currentPayor.code.toLowerCase(),
    )

    if (!payorExists) {
      alert("Please select a valid payor from the suggestions")
      return
    }

    if (!currentPayor.name || !currentPayor.code) {
      alert("Please select a payor")
      return
    }

    if (isEditing && editingId !== null) {
      // Update existing payor
      setSavedPayors((prev) =>
        prev.map((payor) => (payor.id === editingId ? { ...currentPayor, id: editingId } : payor)),
      )
      setIsEditing(false)
      setEditingId(null)
    } else {
      // Add new payor
      const newId = savedPayors.length > 0 ? Math.max(...savedPayors.map((p) => p.id)) + 1 : 1
      setSavedPayors((prev) => [...prev, { ...currentPayor, id: newId }])
    }

    // Reset form
    setCurrentPayor({
      id: 0,
      name: "",
      code: "",
      type: "insurer",
      status: "",
    })
  }

  // Reset form
  const handleResetForm = () => {
    setCurrentPayor({
      id: 0,
      name: "",
      code: "",
      type: "insurer",
      status: "",
    })
    setIsEditing(false)
    setEditingId(null)
    setShowSuggestions({})
  }

  // Edit payor
  const handleEditPayor = (payor: PayorData) => {
    setCurrentPayor(payor)
    setIsEditing(true)
    setEditingId(payor.id)
  }

  // Delete payor
  const handleDeletePayor = (id: number) => {
    setSavedPayors((prev) => prev.filter((payor) => payor.id !== id))
  }

  // Filter payors based on search
  const filteredPayors = savedPayors.filter(
    (payor) =>
      payor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payor.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        nameInputRef.current &&
        !nameInputRef.current.contains(event.target as Node) &&
        codeInputRef.current &&
        !codeInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div>
      <h3 className="text-2xl font-semibold text-slate-800 mb-6">Payor Information</h3>

      {/* Payor Form */}
      <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 shadow-sm mb-6">
        <h4 className="text-lg font-medium text-slate-700 mb-4">{isEditing ? "Edit Payor" : "Payor Details"}</h4>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-2 relative" ref={nameInputRef}>
            <label htmlFor="payor-name" className="text-sm font-medium text-slate-700">
              Payor Name
            </label>
            <Input
              id="payor-name"
              value={currentPayor.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Type to search payors..."
              className="w-full"
            />
            {showSuggestions.name && payorSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {payorSuggestions.map((suggestedPayor) => (
                  <div
                    key={suggestedPayor.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectPayor(suggestedPayor)}
                  >
                    <div className="font-medium text-sm">{suggestedPayor.name}</div>
                    <div className="text-xs text-gray-500">Code: {suggestedPayor.code}</div>
                  </div>
                ))}
              </div>
            )}
            {currentPayor.name &&
              !payorSuggestions.some((p) => p.name.toLowerCase() === currentPayor.name.toLowerCase()) && (
                <div className="text-xs text-amber-600 mt-1">Please select a payor from the suggestions</div>
              )}
          </div>

          <div className="space-y-2 relative" ref={codeInputRef}>
            <label htmlFor="payor-code" className="text-sm font-medium text-slate-700">
              Payor Code
            </label>
            <Input
              id="payor-code"
              value={currentPayor.code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Type to search by code..."
              className="w-full"
            />
            {showSuggestions.code && payorSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {payorSuggestions.map((suggestedPayor) => (
                  <div
                    key={suggestedPayor.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectPayor(suggestedPayor)}
                  >
                    <div className="font-medium text-sm">{suggestedPayor.code}</div>
                    <div className="text-xs text-gray-500">Name: {suggestedPayor.name}</div>
                  </div>
                ))}
              </div>
            )}
            {currentPayor.code &&
              !payorSuggestions.some((p) => p.code.toLowerCase() === currentPayor.code.toLowerCase()) && (
                <div className="text-xs text-amber-600 mt-1">Please select a payor from the suggestions</div>
              )}
          </div>

          <div className="space-y-2">
            <label htmlFor="payor-status" className="text-sm font-medium text-slate-700">
              Payor Status
            </label>
            <Input
              id="payor-status"
              value={currentPayor.status}
              readOnly
              placeholder="Status will appear when payor is selected"
              className="w-full bg-gray-50"
            />
          </div>

          <div className="space-y-2 col-span-3">
            <label className="text-sm font-medium text-slate-700">Payor Type</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payor-type"
                  value="insurer"
                  checked={currentPayor.type === "insurer"}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">Insurer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payor-type"
                  value="self-funded"
                  checked={currentPayor.type === "self-funded"}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">Self-funded/Non-Insurer</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button onClick={handleSavePayor} className="bg-sky-600 hover:bg-sky-700">
            {isEditing ? "Update" : "Save"}
          </Button>
          <Button variant="outline" onClick={handleResetForm}>
            Reset
          </Button>
        </div>
      </div>

      {/* Payor Listing */}
      <div className="bg-white">
        <div className="py-2">
          <h4 className="text-lg font-medium text-slate-700">Payor Listing</h4>
        </div>

        {/* Search and Filter Row */}
        <div className="flex items-center gap-4 pr-4 py-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search payors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
              <option value="">Filter by type</option>
              <option value="insurer">Insurer</option>
              <option value="self-funded">Self-funded/Non-Insurer</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border border-gray-200">
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payor Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {savedPayors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 border border-gray-200">
                    No payors saved yet. Please fill out the payor form above and click Save.
                  </td>
                </tr>
              ) : (
                filteredPayors.map((payor, index) => (
                  <tr key={payor.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payor.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payor.type === "insurer" ? "Insurer" : "Self-funded/Non-Insurer"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payor.status?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : payor.status?.toLowerCase() === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {payor.status ? payor.status.charAt(0).toUpperCase() + payor.status.slice(1) : "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPayor(payor)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePayor(payor.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3 flex items-center justify-end">
          <div className="text-sm text-gray-500">
            Showing {filteredPayors.length > 0 ? "1" : "0"}-{filteredPayors.length} of {savedPayors.length} payors
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  )
}
