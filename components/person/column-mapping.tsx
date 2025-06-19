"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, HelpCircle, FileText } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface SheetColumn {
  sheetName: string
  columnName: string
  displayName: string // "SheetName - ColumnName"
}

interface ColumnMappingProps {
  allSheetColumns: SheetColumn[]
  personRequiredFields: string[]
  personOptionalFields: string[]
  familyRequiredFields: string[]
  familyOptionalFields: string[]
  onMappingComplete: (mapping: {
    person: Record<string, SheetColumn | null>
    family: Record<string, SheetColumn | null>
  }) => void
  onCancel: () => void
}

export function ColumnMapping({
  allSheetColumns,
  personRequiredFields,
  personOptionalFields,
  familyRequiredFields,
  familyOptionalFields,
  onMappingComplete,
  onCancel,
}: ColumnMappingProps) {
  const [activeTab, setActiveTab] = useState("person")
  const [personMapping, setPersonMapping] = useState<Record<string, SheetColumn | null>>({})
  const [familyMapping, setFamilyMapping] = useState<Record<string, SheetColumn | null>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Get unique sheet names for display
  const sheetNames = Array.from(new Set(allSheetColumns.map((col) => col.sheetName)))

  // Initialize mappings with empty values and attempt auto-mapping
  useEffect(() => {
    const initialPersonMapping: Record<string, SheetColumn | null> = {}
    const initialFamilyMapping: Record<string, SheetColumn | null> = {}

    // Try to auto-map fields based on similar names
    allSheetColumns.forEach((sheetColumn) => {
      const normalizedColumnName = sheetColumn.columnName.toLowerCase().trim()

      // Auto-map person fields
      ;[...personRequiredFields, ...personOptionalFields].forEach((field) => {
        const normalizedField = field.toLowerCase().replace(/[*]/g, "").trim()

        // Check for exact match or partial match
        if (
          normalizedColumnName === normalizedField ||
          normalizedColumnName.includes(normalizedField) ||
          normalizedField.includes(normalizedColumnName)
        ) {
          // Only auto-map if not already mapped
          if (!initialPersonMapping[field]) {
            initialPersonMapping[field] = sheetColumn
          }
        }
      })

      // Auto-map family fields
      ;[...familyRequiredFields, ...familyOptionalFields].forEach((field) => {
        const normalizedField = field.toLowerCase().replace(/[*]/g, "").trim()

        // Check for exact match or partial match
        if (
          normalizedColumnName === normalizedField ||
          normalizedColumnName.includes(normalizedField) ||
          normalizedField.includes(normalizedColumnName)
        ) {
          // Only auto-map if not already mapped
          if (!initialFamilyMapping[field]) {
            initialFamilyMapping[field] = sheetColumn
          }
        }
      })
    })

    setPersonMapping(initialPersonMapping)
    setFamilyMapping(initialFamilyMapping)
  }, [allSheetColumns, personRequiredFields, personOptionalFields, familyRequiredFields, familyOptionalFields])

  const handlePersonMappingChange = (field: string, value: string) => {
    const selectedColumn = allSheetColumns.find((col) => col.displayName === value) || null

    setPersonMapping((prev) => ({
      ...prev,
      [field]: selectedColumn,
    }))

    // Clear validation error immediately when a value is changed
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`person-${field}`]

      // Also clear any errors for other fields that might have been using the same column
      if (selectedColumn) {
        Object.keys(newErrors).forEach((errorKey) => {
          if (newErrors[errorKey].includes(`Column "${selectedColumn.displayName}"`)) {
            delete newErrors[errorKey]
          }
        })
      }

      return newErrors
    })
  }

  const handleFamilyMappingChange = (field: string, value: string) => {
    const selectedColumn = allSheetColumns.find((col) => col.displayName === value) || null

    setFamilyMapping((prev) => ({
      ...prev,
      [field]: selectedColumn,
    }))

    // Clear validation error immediately when a value is changed
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`family-${field}`]

      // Also clear any errors for other fields that might have been using the same column
      if (selectedColumn) {
        Object.keys(newErrors).forEach((errorKey) => {
          if (newErrors[errorKey].includes(`Column "${selectedColumn.displayName}"`)) {
            delete newErrors[errorKey]
          }
        })
      }

      return newErrors
    })
  }

  const validateMapping = () => {
    const errors: Record<string, string> = {}
    const mappedColumnToField = new Map<string, string>() // Maps displayName to the first field it was mapped to

    // Clear all existing errors first
    setValidationErrors({})

    // Validate required person fields and check for duplicates
    ;[...personRequiredFields, ...personOptionalFields].forEach((field) => {
      const mappedColumn = personMapping[field]
      if (personRequiredFields.includes(field) && !mappedColumn) {
        errors[`person-${field}`] = `${field.replace(/\*/g, "")} is required`
      }
      if (mappedColumn) {
        if (mappedColumnToField.has(mappedColumn.displayName)) {
          const originalField = mappedColumnToField.get(mappedColumn.displayName)
          errors[`person-${field}`] =
            `Column "${mappedColumn.displayName}" is already mapped to "${originalField?.replace(/\*/g, "")}"`
        } else {
          mappedColumnToField.set(mappedColumn.displayName, field)
        }
      }
    })

    // Validate required family fields and check for duplicates
    ;[...familyRequiredFields, ...familyOptionalFields].forEach((field) => {
      const mappedColumn = familyMapping[field]
      if (familyRequiredFields.includes(field) && !mappedColumn) {
        errors[`family-${field}`] = `${field.replace(/\*/g, "")} is required`
      }
      if (mappedColumn) {
        if (mappedColumnToField.has(mappedColumn.displayName)) {
          const originalField = mappedColumnToField.get(mappedColumn.displayName)
          errors[`family-${field}`] =
            `Column "${mappedColumn.displayName}" is already mapped to "${originalField?.replace(/\*/g, "")}"`
        } else {
          mappedColumnToField.set(mappedColumn.displayName, field)
        }
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add this useEffect to validate in real-time as user makes changes
  useEffect(() => {
    // Only validate if we have some mappings set up
    const hasPersonMappings = Object.values(personMapping).some(Boolean)
    const hasFamilyMappings = Object.values(familyMapping).some(Boolean)

    if (hasPersonMappings || hasFamilyMappings) {
      // Run validation but don't show errors immediately, just clear resolved ones
      const errors: Record<string, string> = {}
      const mappedColumnToField = new Map<string, string>()

      // Check person mappings
      ;[...personRequiredFields, ...personOptionalFields].forEach((field) => {
        const mappedColumn = personMapping[field]
        if (mappedColumn) {
          if (mappedColumnToField.has(mappedColumn.displayName)) {
            const originalField = mappedColumnToField.get(mappedColumn.displayName)
            errors[`person-${field}`] =
              `Column "${mappedColumn.displayName}" is already mapped to "${originalField?.replace(/\*/g, "")}"`
          } else {
            mappedColumnToField.set(mappedColumn.displayName, field)
          }
        }
      })

      // Check family mappings
      ;[...familyRequiredFields, ...familyOptionalFields].forEach((field) => {
        const mappedColumn = familyMapping[field]
        if (mappedColumn) {
          if (mappedColumnToField.has(mappedColumn.displayName)) {
            const originalField = mappedColumnToField.get(mappedColumn.displayName)
            errors[`family-${field}`] =
              `Column "${mappedColumn.displayName}" is already mapped to "${originalField?.replace(/\*/g, "")}"`
          } else {
            mappedColumnToField.set(mappedColumn.displayName, field)
          }
        }
      })

      // Only update validation errors, don't add new ones for missing required fields yet
      setValidationErrors((prev) => {
        const newErrors = { ...prev }

        // Clear errors that are no longer valid
        Object.keys(newErrors).forEach((errorKey) => {
          if (!errors[errorKey]) {
            delete newErrors[errorKey]
          }
        })

        // Add new duplicate mapping errors
        Object.keys(errors).forEach((errorKey) => {
          newErrors[errorKey] = errors[errorKey]
        })

        return newErrors
      })
    }
  }, [
    personMapping,
    familyMapping,
    personRequiredFields,
    personOptionalFields,
    familyRequiredFields,
    familyOptionalFields,
  ])

  const handleComplete = () => {
    if (validateMapping()) {
      onMappingComplete({
        person: personMapping,
        family: familyMapping,
      })
    } else {
      // Switch to the tab with errors if needed
      const hasPersonErrors = Object.keys(validationErrors).some((key) => key.startsWith("person-"))
      const hasFamilyErrors = Object.keys(validationErrors).some((key) => key.startsWith("family-"))

      if (hasPersonErrors && activeTab !== "person") {
        setActiveTab("person")
      } else if (hasFamilyErrors && activeTab !== "family") {
        setActiveTab("family")
      }
    }
  }

  const renderFieldMapping = (
    field: string,
    isRequired: boolean,
    mapping: Record<string, SheetColumn | null>,
    onChange: (field: string, value: string) => void,
    tabPrefix: string,
  ) => {
    const errorKey = `${tabPrefix}-${field}`
    const hasError = !!validationErrors[errorKey]
    const fieldLabel = field.replace(/\*/g, "")
    const currentValue = mapping[field]?.displayName || ""

    return (
      <div key={field} className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <span className="text-sm font-medium text-slate-700">
            {fieldLabel}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
            {hasError && <AlertCircle className="h-4 w-4 text-red-500 inline-block ml-1" />}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Map this field to a column from any sheet in your file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <Select value={currentValue} onValueChange={(value) => onChange(field, value)}>
            <SelectTrigger className={`w-full ${hasError ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select a column from any sheet" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="none" className="text-slate-500 italic">
                -- Not mapped --
              </SelectItem>
              {sheetNames.map((sheetName) => (
                <div key={sheetName}>
                  <div className="px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 border-b border-slate-200 sticky top-0 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-600" />📊 Sheet: {sheetName}
                  </div>
                  {allSheetColumns
                    .filter((col) => col.sheetName === sheetName)
                    .map((sheetColumn) => (
                      <SelectItem
                        key={sheetColumn.displayName}
                        value={sheetColumn.displayName}
                        className="pl-6 py-2 hover:bg-blue-50"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                            <span className="font-medium text-slate-800">{sheetColumn.columnName}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 ml-2">
                            {sheetColumn.sheetName}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  {/* Add separator between sheets */}
                  <div className="h-px bg-slate-200 my-1"></div>
                </div>
              ))}
            </SelectContent>
          </Select>
          {hasError && <p className="text-xs text-red-500 mt-1">{validationErrors[errorKey]}</p>}
          {currentValue && (
            <p className="text-xs text-slate-500 mt-1">
              Mapped to: <span className="font-medium">{currentValue}</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  // Get mapping statistics
  const personMappedCount = Object.values(personMapping).filter(Boolean).length
  const familyMappedCount = Object.values(familyMapping).filter(Boolean).length
  const totalPersonFields = personRequiredFields.length + personOptionalFields.length
  const totalFamilyFields = familyRequiredFields.length + familyOptionalFields.length

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Column Mapping</h3>
        <p className="text-sm text-slate-600">Map columns from your file to the appropriate fields in the system</p>

        {/* Sheet Information */}
        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Your Uploaded File Contains:
          </p>
          <div className="space-y-2">
            {sheetNames.map((sheetName) => {
              const columnCount = allSheetColumns.filter((col) => col.sheetName === sheetName).length
              const columns = allSheetColumns.filter((col) => col.sheetName === sheetName)
              return (
                <div key={sheetName} className="bg-white p-3 rounded-md border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-sm font-medium bg-blue-100 text-blue-800 border-blue-200">
                      📊 {sheetName}
                    </Badge>
                    <span className="text-xs text-slate-500">{columnCount} columns</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {columns.slice(0, 6).map((col) => (
                      <span key={col.columnName} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {col.columnName}
                      </span>
                    ))}
                    {columns.length > 6 && (
                      <span className="text-xs text-slate-500 px-2 py-1">+{columns.length - 6} more...</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="person" className="relative">
            Person Information ({personMappedCount}/{totalPersonFields})
            {Object.keys(validationErrors).some((key) => key.startsWith("person-")) && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                !
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="family" className="relative">
            Family Information ({familyMappedCount}/{totalFamilyFields})
            {Object.keys(validationErrors).some((key) => key.startsWith("family-")) && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                !
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="person" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Person Information Mapping</p>
              <p className="text-sm">
                Map columns from any sheet in your file to person fields. Fields marked with * are required.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700">Required Fields</h4>
            {personRequiredFields.map((field) =>
              renderFieldMapping(field, true, personMapping, handlePersonMappingChange, "person"),
            )}
          </div>

          <div className="space-y-2 mt-6">
            <h4 className="text-sm font-medium text-slate-700">Optional Fields</h4>
            {personOptionalFields.map((field) =>
              renderFieldMapping(field, false, personMapping, handlePersonMappingChange, "person"),
            )}
          </div>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-start mb-4">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Family Information Mapping</p>
              <p className="text-sm">
                Map columns from any sheet in your file to family member fields. Fields marked with * are required.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700">Required Fields</h4>
            {familyRequiredFields.map((field) =>
              renderFieldMapping(field, true, familyMapping, handleFamilyMappingChange, "family"),
            )}
          </div>

          <div className="space-y-2 mt-6">
            <h4 className="text-sm font-medium text-slate-700">Optional Fields</h4>
            {familyOptionalFields.map((field) =>
              renderFieldMapping(field, false, familyMapping, handleFamilyMappingChange, "family"),
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6 pt-4 border-t">
        <div>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setPersonMapping({})
              setFamilyMapping({})
              setValidationErrors({})
            }}
          >
            Clear All
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleComplete}>
            Apply Mapping
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Export as default as well for compatibility
export default ColumnMapping
