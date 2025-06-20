"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

interface Structure {
  id: number
  name: string
  code: string
  type: string
  status: string
  parentStructure: string
  address: string
  postcode: string
  city: string
  state: string
  country: string
  remarks: string
}

interface OperationalSegmentationFormProps {
  onNext: () => void
  onBack: () => void
  structures?: Structure[]
  onSaveData?: (data: Structure[]) => void
}

export function OperationalSegmentationForm({
  onNext,
  onBack,
  structures = [],
  onSaveData,
}: OperationalSegmentationFormProps) {
  // Form state for current structure being entered
  const [currentStructure, setCurrentStructure] = useState<Structure>({
    id: 1,
    name: "",
    code: "",
    type: "",
    status: "active",
    parentStructure: "",
    address: "",
    postcode: "",
    city: "",
    state: "",
    country: "",
    remarks: "",
  })

  // Saved structures that appear in the listing table
  const [savedStructures, setSavedStructures] = useState<Structure[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Initialize saved structures from props or localStorage only once
  useEffect(() => {
    if (isInitialized) return

    let initialStructures = []

    // First try to use props data
    if (structures && structures.length > 0) {
      initialStructures = structures
    } else {
      // If no props data, try to load from localStorage
      try {
        const savedData = localStorage.getItem("operational_structures")
        if (savedData) {
          const parsedStructures = JSON.parse(savedData)
          if (Array.isArray(parsedStructures)) {
            initialStructures = parsedStructures
          }
        }
      } catch (error) {
        console.error("Error loading saved operational structures:", error)
      }
    }

    if (initialStructures.length > 0) {
      setSavedStructures(initialStructures)
      // Set next ID based on existing structures
      const maxId = Math.max(...initialStructures.map((s) => s.id), 0)
      setCurrentStructure((prev) => ({ ...prev, id: maxId + 1 }))
    }

    setIsInitialized(true)
  }, [structures, isInitialized])

  const handleInputChange = (field: keyof Structure, value: string) => {
    setCurrentStructure((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveStructure = useCallback(() => {
    // Add current structure to saved structures
    setSavedStructures((prev) => {
      const newStructures = [...prev, currentStructure]

      // Save to localStorage immediately
      try {
        localStorage.setItem("operational_structures", JSON.stringify(newStructures))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      return newStructures
    })

    // Reset form for next structure
    const nextId = currentStructure.id + 1
    setCurrentStructure({
      id: nextId,
      name: "",
      code: "",
      type: "",
      status: "active",
      parentStructure: "",
      address: "",
      postcode: "",
      city: "",
      type: "",
      state: "",
      country: "",
      remarks: "",
    })

    // Reset to first page if needed
    setCurrentPage(1)
  }, [currentStructure])

  const handleResetStructure = () => {
    setCurrentStructure((prev) => ({
      ...prev,
      name: "",
      code: "",
      type: "",
      status: "active",
      parentStructure: "",
      address: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
      remarks: "",
    }))
  }

  const handleEditStructure = useCallback((structure: Structure) => {
    setCurrentStructure(structure)
    // Remove from saved structures temporarily while editing
    setSavedStructures((prev) => {
      const newStructures = prev.filter((s) => s.id !== structure.id)

      // Save to localStorage immediately
      try {
        localStorage.setItem("operational_structures", JSON.stringify(newStructures))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      return newStructures
    })
  }, [])

  const handleDeleteStructure = useCallback(
    (id: number) => {
      setSavedStructures((prev) => {
        const newStructures = prev.filter((structure) => structure.id !== id)

        // Save to localStorage immediately
        try {
          localStorage.setItem("operational_structures", JSON.stringify(newStructures))
        } catch (error) {
          console.error("Error saving to localStorage:", error)
        }

        return newStructures
      })

      // Reset pagination if needed
      const newTotal = savedStructures.length - 1
      const maxPage = Math.ceil(newTotal / itemsPerPage)
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage)
      }
    },
    [savedStructures.length, currentPage, itemsPerPage],
  )

  // Filter and search logic
  const filteredStructures = savedStructures.filter((structure) => {
    const matchesSearch =
      searchTerm === "" ||
      structure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.state.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "" || filterType === "all" || structure.type === filterType

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredStructures.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStructures = filteredStructures.slice(startIndex, endIndex)

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterType])

  const handleSave = useCallback(() => {
    // Save all structures to local storage and parent component
    try {
      const existingData = localStorage.getItem("company_form_draft")
      const parsedData = existingData ? JSON.parse(existingData) : {}

      // Save the structures data
      parsedData.operationalSegmentation = savedStructures
      localStorage.setItem("company_form_draft", JSON.stringify(parsedData))

      // Also save separately for backup
      localStorage.setItem("operational_structures", JSON.stringify(savedStructures))

      console.log("Operational segmentation data saved:", savedStructures)
    } catch (error) {
      console.error("Error saving operational segmentation data:", error)
    }

    // Pass data to parent component only when explicitly saving
    if (onSaveData) {
      onSaveData(savedStructures)
    }

    // Navigate to next step
    onNext()
  }, [savedStructures, onSaveData, onNext])

  // Generate parent structure options from saved structures
  const getParentStructureOptions = () => {
    return savedStructures
      .filter((structure) => structure.name)
      .map((structure) => ({
        value: structure.id.toString(),
        label: structure.name,
      }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Operational Segmentation Structure</h2>

      {/* Single Structure Form */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Structure Details</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <Input
              id="name"
              value={currentStructure.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="structure-code" className="text-sm font-medium text-slate-700">
              Structure Code
            </label>
            <Input
              id="structure-code"
              value={currentStructure.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="structure-type" className="text-sm font-medium text-slate-700">
              Structure Type
            </label>
            <Select onValueChange={(value) => handleInputChange("type", value)} value={currentStructure.type}>
              <SelectTrigger id="structure-type" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cost-center">Cost Center</SelectItem>
                <SelectItem value="branch">Branch</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="division">Division</SelectItem>
                <SelectItem value="unit">Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              Status
            </label>
            <Select
              onValueChange={(value) => handleInputChange("status", value)}
              value={currentStructure.status}
              defaultValue="active"
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="parent-structure" className="text-sm font-medium text-slate-700">
              Parent Structure
            </label>
            <Select
              onValueChange={(value) => handleInputChange("parentStructure", value)}
              value={currentStructure.parentStructure}
            >
              <SelectTrigger id="parent-structure" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {getParentStructureOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-4">
            <label htmlFor="address" className="text-sm font-medium text-slate-700">
              Address
            </label>
            <Input
              id="address"
              value={currentStructure.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="postcode" className="text-sm font-medium text-slate-700">
              Postcode
            </label>
            <Input
              id="postcode"
              value={currentStructure.postcode}
              onChange={(e) => handleInputChange("postcode", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium text-slate-700">
              City
            </label>
            <Select onValueChange={(value) => handleInputChange("city", value)} value={currentStructure.city}>
              <SelectTrigger id="city" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                <SelectItem value="penang">Penang</SelectItem>
                <SelectItem value="johor-bahru">Johor Bahru</SelectItem>
                <SelectItem value="ipoh">Ipoh</SelectItem>
                <SelectItem value="kuching">Kuching</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium text-slate-700">
              State
            </label>
            <Select onValueChange={(value) => handleInputChange("state", value)} value={currentStructure.state}>
              <SelectTrigger id="state" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selangor">Selangor</SelectItem>
                <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                <SelectItem value="penang">Penang</SelectItem>
                <SelectItem value="johor">Johor</SelectItem>
                <SelectItem value="perak">Perak</SelectItem>
                <SelectItem value="sarawak">Sarawak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-slate-700">
              Country
            </label>
            <Select onValueChange={(value) => handleInputChange("country", value)} value={currentStructure.country}>
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="malaysia">Malaysia</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
                <SelectItem value="thailand">Thailand</SelectItem>
                <SelectItem value="philippines">Philippines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-4">
            <label htmlFor="remarks" className="text-sm font-medium text-slate-700">
              Remarks
            </label>
            <Textarea
              id="remarks"
              value={currentStructure.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Save and Reset buttons for individual structure */}
        <div className="flex gap-3 mt-6">
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSaveStructure}>
            Save
          </Button>
          <Button variant="outline" onClick={handleResetStructure}>
            Reset
          </Button>
        </div>
      </div>

      {/* Structure Listing Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Structure Listing</h3>

        {/* Search and Filter Controls */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cost-center">Cost Center</SelectItem>
                <SelectItem value="branch">Branch</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="division">Division</SelectItem>
                <SelectItem value="unit">Unit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Structure Table */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStructures.length > 0 ? (
                  currentStructures.map((structure, index) => (
                    <tr key={structure.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{startIndex + index + 1}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-blue-600 font-medium">{structure.name || "-"}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{structure.code || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{structure.type || "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            structure.status === "active"
                              ? "bg-green-100 text-green-800"
                              : structure.status === "inactive"
                                ? "bg-red-100 text-red-800"
                                : structure.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {structure.status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{structure.address || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{structure.city || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{structure.state || "-"}</td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        <button
                          onClick={() => handleEditStructure(structure)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStructure(structure.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      {savedStructures.length === 0
                        ? "No structures saved yet. Please fill out the structure form above and click Save."
                        : "No structures match your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count and Pagination */}
        {filteredStructures.length > 0 && (
          <>
            <div className="text-sm text-gray-600 text-right">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredStructures.length)} of {filteredStructures.length}{" "}
              structures
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Main Save and Back buttons */}
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
