"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Temporary type definition for MemberEntry and DependentInfo
// This should ideally be updated in contexts/corporate-client-form-context.tsx
interface DependentInfo {
  name?: string
  nricPassport?: string
  relationship?: string
  dateOfBirth?: Date
  gender?: string
  isDisabled?: boolean
  address?: string
  postcode?: string
  city?: string
  state?: string
  country?: string
  phoneNo?: string
  email?: string
}

interface MemberEntry {
  id: string
  personId: string
  personName: string
  idNumber: string
  membershipId: string
  staffId: string
  personType: string
  employeePersonId: string
  designation: string
  jobGrade: string
  employmentType: string
  staffCategory: string
  joinedDate?: Date
  startDate?: Date
  endDate?: Date
  setupProvider: string
  specialTags: string[]
  medicalProviders: Array<{
    id: string
    serviceTypes: string[]
    panelship: string
    providerTypes: string[]
  }>
  planName: string
  planCode: string
  planEffectiveDate?: Date
  planExpiryDate?: Date
  dependentCovered: string
  selectedDependents: string[]
  remarks: string
  // New fields added for mapping
  dateOfBirth?: Date
  gender?: string
  isDisabled?: boolean
  email?: string
  phoneNo?: string
  address?: string
  postcode?: string
  city?: string
  state?: string
  country?: string
  unit?: string
  department?: string
  memberEmploymentStatus?: string // Renamed to avoid conflict with employmentType
  dependentInfo?: DependentInfo // For single dependent details
}

interface ExpectedField {
  value: string
  label: string
  required?: boolean
}

interface FieldMappingModalProps {
  csvHeaders: string[]
  csvPreviewData: string[][]
  expectedFields: ExpectedField[]
  onConfirm: (mappedData: MemberEntry[]) => void
  onClose: () => void
  csvRawData: string[][]
}

export function MemberBulkMappingModal({
  csvHeaders,
  csvPreviewData,
  expectedFields,
  onConfirm,
  onClose,
  csvRawData,
}: FieldMappingModalProps) {
  // columnMappings now maps expectedField.value to csvHeader
  const [columnMappings, setColumnMappings] = useState<{ [key: string]: string }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    // Initialize mappings with best guesses or empty strings
    const initialMappings: { [key: string]: string } = {}
    expectedFields.forEach((field) => {
      const matchedHeader = csvHeaders.find(
        (header) =>
          header.toLowerCase() === field.label.toLowerCase() ||
          header.toLowerCase() === field.value.toLowerCase().replace(/ /g, ""),
      )
      initialMappings[field.value] = matchedHeader || ""
    })
    setColumnMappings(initialMappings)
  }, [csvHeaders, expectedFields])

  const handleMappingChange = (targetField: string, csvHeader: string) => {
    setColumnMappings((prev) => ({ ...prev, [targetField]: csvHeader }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[targetField] // Clear error when user changes mapping
      return newErrors
    })
  }

  const validateMappings = () => {
    const newErrors: { [key: string]: string } = {}
    // Filter out 'do_not_map' and 'column_not_found' from mappedCsvHeaders for duplicate check
    const mappedCsvHeaders = Object.values(columnMappings).filter(
      (value) => value && value !== "do_not_map" && value !== "column_not_found",
    )

    // Check for duplicate mappings (a CSV header mapped to multiple target fields)
    const duplicates = mappedCsvHeaders.filter((item, index) => mappedCsvHeaders.indexOf(item) !== index)
    if (duplicates.length > 0) {
      duplicates.forEach((dupHeader) => {
        const targetFieldsForDup = Object.keys(columnMappings).filter((key) => columnMappings[key] === dupHeader)
        targetFieldsForDup.forEach((targetField) => {
          newErrors[targetField] = `Duplicate mapping: CSV column '${dupHeader}' is mapped to multiple fields.`
        })
      })
    }

    // Check for required fields
    expectedFields.forEach((field) => {
      if (
        field.required &&
        (!columnMappings[field.value] ||
          columnMappings[field.value] === "do_not_map" ||
          columnMappings[field.value] === "column_not_found")
      ) {
        newErrors[field.value] = `Required field '${field.label}' is not mapped.`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const processData = () => {
    if (!validateMappings()) {
      toast({
        title: "Mapping Error",
        description: "Please correct the mapping errors before proceeding.",
        variant: "destructive",
      })
      return
    }

    const processedMembers: MemberEntry[] = []
    const headerIndexMap = new Map(csvHeaders.map((header, index) => [header, index]))

    // Skip header row
    for (let i = 1; i < csvRawData.length; i++) {
      const row = csvRawData[i]
      const newMember: Partial<MemberEntry> = {
        id: `bulk-member-${Date.now()}-${i}`, // Generate unique ID
        membershipId: "",
        medicalProviders: [
          { id: `medical-provider-${Date.now()}-${i}-1`, serviceTypes: [], panelship: "", providerTypes: [] },
        ],
        specialTags: [],
        selectedDependents: [],
        dependentInfo: {},
      }

      for (const field of expectedFields) {
        const csvHeaderToMap = columnMappings[field.value]
        // Add 'column_not_found' to the condition
        if (csvHeaderToMap && csvHeaderToMap !== "do_not_map" && csvHeaderToMap !== "column_not_found") {
          const colIndex = headerIndexMap.get(csvHeaderToMap)
          if (colIndex !== undefined && row[colIndex] !== undefined) {
            const value = row[colIndex].trim()

            // Handle nested dependentInfo fields
            if (field.value.startsWith("dependentInfo.")) {
              const dependentField = field.value.split(".")[1] as keyof DependentInfo
              if (newMember.dependentInfo) {
                if (dependentField.includes("DateOfBirth")) {
                  newMember.dependentInfo[dependentField] = value ? new Date(value) : undefined
                } else if (dependentField.includes("isDisabled")) {
                  newMember.dependentInfo[dependentField] = value.toLowerCase() === "yes"
                } else {
                  newMember.dependentInfo[dependentField] = value as any
                }
              }
            } else {
              // Handle top-level fields
              switch (field.value) {
                case "joinedDate":
                case "startDate":
                case "endDate":
                case "dateOfBirth": // New field
                  newMember[field.value] = value ? new Date(value) : undefined
                  break
                case "isDisabled": // New field
                  newMember[field.value] = value.toLowerCase() === "yes"
                  break
                case "specialTags":
                  newMember[field.value] = value
                    ? value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : []
                  break
                case "medicalProviderServiceTypes":
                  if (newMember.medicalProviders && newMember.medicalProviders[0]) {
                    newMember.medicalProviders[0].serviceTypes = value
                      ? value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : []
                  }
                  break
                case "medicalProviderPanelship":
                  if (newMember.medicalProviders && newMember.medicalProviders[0]) {
                    newMember.medicalProviders[0].panelship = value
                  }
                  break
                case "medicalProviderProviderTypes":
                  if (newMember.medicalProviders && newMember.medicalProviders[0]) {
                    newMember.medicalProviders[0].providerTypes = value
                      ? value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : []
                  }
                  break
                default:
                  newMember[field.value as keyof MemberEntry] = value as any
                  break
              }
            }
          }
        }
      }
      // Generate membershipId if personName and idNumber are available
      if (newMember.personName && newMember.idNumber) {
        const nameParts = newMember.personName.split(" ")
        const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("")
        const idSuffix = newMember.idNumber.slice(-4)
        newMember.membershipId = `CM-${initials}-${idSuffix}-I`
      } else if (newMember.personName && newMember.personId) {
        const nameParts = newMember.personName.split(" ")
        const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("")
        const idSuffix = newMember.personId.slice(-4)
        newMember.membershipId = `CM-${initials}-${idSuffix}-I`
      }

      processedMembers.push(newMember as MemberEntry)
    }
    onConfirm(processedMembers)
  }

  const sectionFields: { [key: string]: string[] } = {
    "Member Information": [
      "personName",
      "idNumber",
      "dateOfBirth",
      "gender",
      "isDisabled",
      "email",
      "phoneNo",
      "address",
      "postcode",
      "city",
      "state",
      "country",
    ],
    "Employment Information": [
      "staffId",
      "personType",
      "employeePersonId",
      "designation",
      "jobGrade",
      "employmentType",
      "staffCategory",
      "joinedDate",
      "startDate",
      "endDate",
      "unit",
      "department",
      "memberEmploymentStatus",
    ],
    "Dependent Information": [
      "dependentInfo.name",
      "dependentInfo.nricPassport",
      "dependentInfo.relationship",
      "dependentInfo.dateOfBirth",
      "dependentInfo.gender",
      "dependentInfo.isDisabled",
      "dependentInfo.address",
      "dependentInfo.postcode",
      "dependentInfo.city",
      "dependentInfo.state",
      "dependentInfo.country",
      "dependentInfo.phoneNo",
      "dependentInfo.email",
    ],
    "Provider Information": [
      "setupProvider",
      "medicalProviderServiceTypes",
      "medicalProviderPanelship",
      "medicalProviderProviderTypes",
    ],
    "Plan Information": ["planName", "planCode"],
    Remarks: ["remarks"],
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b flex-shrink-0 relative">
          <h2 className="text-xl font-semibold mb-2">Map CSV Columns to Member Fields</h2>
          <p className="text-gray-600 text-sm">
            Match the columns from your CSV file to the corresponding fields for member information.
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-medium mb-4">Column Mapping</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Label className="font-bold">Field to Map</Label>
            <Label className="font-bold">CSV Column Header</Label>
          </div>
          {Object.entries(sectionFields).map(([sectionName, fieldValues]) => (
            <div key={sectionName} className="mb-8">
              <h4 className="text-md font-semibold mb-4 border-b pb-2">{sectionName}</h4>
              {fieldValues
                .map((fieldValue) => expectedFields.find((f) => f.value === fieldValue))
                .filter(
                  (field): field is ExpectedField =>
                    field !== undefined &&
                    !["planEffectiveDate", "planExpiryDate", "dependentCovered", "selectedDependents"].includes(
                      field.value,
                    ),
                )
                .map((field) => (
                  <div key={field.value} className="grid grid-cols-2 gap-4 items-center mb-3">
                    <div className="font-medium text-gray-800">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    <div>
                      <Select
                        value={columnMappings[field.value] || ""}
                        onValueChange={(value) => handleMappingChange(field.value, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select CSV column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="do_not_map">Do Not Map</SelectItem>
                          <SelectItem value="column_not_found">Column Not Found</SelectItem>
                          {csvHeaders.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[field.value] && <p className="text-red-500 text-xs mt-1">{errors[field.value]}</p>}
                    </div>
                  </div>
                ))}
            </div>
          ))}

          <h3 className="text-lg font-medium mt-8 mb-4">
            Data Preview (First {csvPreviewData.length > 0 ? csvPreviewData.length - 1 : 0} Rows)
          </h3>
          {csvPreviewData.length > 1 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {csvHeaders.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvPreviewData.slice(1, 6).map(
                      (
                        row,
                        rowIndex, // Show up to 5 data rows
                      ) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No preview data available or CSV is empty.</p>
          )}
        </div>

        <div className="p-4 border-t flex justify-end space-x-4 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={processData} className="bg-blue-600 hover:bg-blue-700">
            Confirm Mapping & Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
