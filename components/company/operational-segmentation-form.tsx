"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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

// Update the props interface
interface OperationalSegmentationFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: Structure[] // Add this prop to receive existing data
  onSaveData?: (data: Structure[]) => void // Add this prop to send data back
}

// Update the component to use these props
export function OperationalSegmentationForm({
  onNext,
  onBack,
  initialData,
  onSaveData,
}: OperationalSegmentationFormProps) {
  // Initialize with provided data or default
  const [structures, setStructures] = useState<Structure[]>(
    initialData && initialData.length > 0
      ? initialData
      : [
          {
            id: 1,
            name: "",
            code: "",
            type: "",
            status: "",
            parentStructure: "",
            address: "",
            postcode: "",
            city: "",
            state: "",
            country: "",
            remarks: "",
          },
        ],
  )

  const handleAddStructure = () => {
    if (structures.length < 5) {
      const newStructure = {
        id: Math.max(...structures.map((s) => s.id)) + 1,
        name: "",
        code: "",
        type: "",
        status: "",
        parentStructure: "",
        address: "",
        postcode: "",
        city: "",
        state: "",
        country: "",
        remarks: "",
      }
      setStructures([newStructure, ...structures])
    }
  }

  const handleRemoveStructure = (id: number) => {
    if (structures.length > 1) {
      setStructures(structures.filter((structure) => structure.id !== id))
    }
  }

  const handleInputChange = (id: number, field: keyof Structure, value: string) => {
    setStructures(structures.map((structure) => (structure.id === id ? { ...structure, [field]: value } : structure)))
  }

  // Update the handleSave function to pass data back to parent
  const handleSave = () => {
    // Save the operational segmentation data to local storage
    try {
      const existingData = localStorage.getItem("company_form_draft")
      const parsedData = existingData ? JSON.parse(existingData) : {}

      // Update the operational segmentation data in the draft
      parsedData.operationalSegmentation = structures

      // Save back to local storage
      localStorage.setItem("company_form_draft", JSON.stringify(parsedData))

      // Log to confirm data is saved
      console.log("Operational segmentation data saved:", structures)
    } catch (error) {
      console.error("Error saving operational segmentation data:", error)
    }

    // Pass data back to parent component if callback is provided
    if (onSaveData) {
      onSaveData(structures)
    }

    // Continue with the next step
    onNext()
  }

  // Generate parent structure options
  const getParentStructureOptions = (currentId: number) => {
    // Filter out the current structure and create options from the remaining structures
    return structures
      .filter((structure) => structure.id !== currentId && structure.name)
      .map((structure) => ({
        value: structure.id.toString(),
        label: structure.name || `Structure ${structure.id}`,
      }))
  }

  return (
    <div className="space-y-6">
      {/* Header with Add New button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Operational Segmentation Structure</h2>
        {structures.length < 5 && (
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleAddStructure}>
            Add New
          </Button>
        )}
      </div>

      {structures.map((structure, index) => (
        <div key={structure.id} className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Level {structure.id}</h3>
            {structures.length > 1 && (
              <button
                onClick={() => handleRemoveStructure(structure.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* All existing form fields remain the same */}
            <div className="space-y-2">
              <label htmlFor={`name-${structure.id}`} className="text-sm font-medium text-slate-700">
                Name
              </label>
              <Input
                id={`name-${structure.id}`}
                value={structure.name}
                onChange={(e) => handleInputChange(structure.id, "name", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`structure-code-${structure.id}`} className="text-sm font-medium text-slate-700">
                Structure Code
              </label>
              <Input
                id={`structure-code-${structure.id}`}
                value={structure.code}
                onChange={(e) => handleInputChange(structure.id, "code", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`structure-type-${structure.id}`} className="text-sm font-medium text-slate-700">
                Structure Type
              </label>
              <Select onValueChange={(value) => handleInputChange(structure.id, "type", value)} value={structure.type}>
                <SelectTrigger id={`structure-type-${structure.id}`} className="w-full">
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
              <label htmlFor={`status-${structure.id}`} className="text-sm font-medium text-slate-700">
                Status
              </label>
              <Select
                onValueChange={(value) => handleInputChange(structure.id, "status", value)}
                value={structure.status}
              >
                <SelectTrigger id={`status-${structure.id}`} className="w-full">
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
              <label htmlFor={`parent-structure-${structure.id}`} className="text-sm font-medium text-slate-700">
                Parent Structure
              </label>
              <Select
                onValueChange={(value) => handleInputChange(structure.id, "parentStructure", value)}
                value={structure.parentStructure}
              >
                <SelectTrigger id={`parent-structure-${structure.id}`} className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="cost-center">Cost Center</SelectItem>
                  <SelectItem value="regional-office">Regional Office</SelectItem>
                  <SelectItem value="branch-office">Branch Office</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="division">Division</SelectItem>
                  {getParentStructureOptions(structure.id).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor={`address-${structure.id}`} className="text-sm font-medium text-slate-700">
                Address
              </label>
              <Input
                id={`address-${structure.id}`}
                value={structure.address}
                onChange={(e) => handleInputChange(structure.id, "address", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`postcode-${structure.id}`} className="text-sm font-medium text-slate-700">
                Postcode
              </label>
              <Input
                id={`postcode-${structure.id}`}
                value={structure.postcode}
                onChange={(e) => handleInputChange(structure.id, "postcode", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`city-${structure.id}`} className="text-sm font-medium text-slate-700">
                City
              </label>
              <Select onValueChange={(value) => handleInputChange(structure.id, "city", value)} value={structure.city}>
                <SelectTrigger id={`city-${structure.id}`} className="w-full">
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
              <label htmlFor={`state-${structure.id}`} className="text-sm font-medium text-slate-700">
                State
              </label>
              <Select
                onValueChange={(value) => handleInputChange(structure.id, "state", value)}
                value={structure.state}
              >
                <SelectTrigger id={`state-${structure.id}`} className="w-full">
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
              <label htmlFor={`country-${structure.id}`} className="text-sm font-medium text-slate-700">
                Country
              </label>
              <Select
                onValueChange={(value) => handleInputChange(structure.id, "country", value)}
                value={structure.country}
              >
                <SelectTrigger id={`country-${structure.id}`} className="w-full">
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

            <div className="space-y-2 col-span-2">
              <label htmlFor={`remarks-${structure.id}`} className="text-sm font-medium text-slate-700">
                Remarks
              </label>
              <Textarea
                id={`remarks-${structure.id}`}
                value={structure.remarks}
                onChange={(e) => handleInputChange(structure.id, "remarks", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {index < structures.length - 1 && <div className="mt-6 border-b border-slate-200"></div>}
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
