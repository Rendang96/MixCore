"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Download, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPersons, updatePerson } from "@/lib/person/person-storage"
import type { PersonProfile } from "@/lib/person/person-storage"

interface BulkEditPersonProps {
  onBack: () => void
}

interface UpdateRecord {
  id: string
  personId: string
  idNo: string
  name: string
  field: string
  currentValue: string
  newValue: string
  status: "pending" | "success" | "error"
  errorMessage?: string
}

interface ColumnOption {
  id: string
  label: string
  category: "person" | "membership"
  required?: boolean
}

interface ParsedFileData {
  [key: string]: string
}

export function BulkEditPerson({ onBack }: BulkEditPersonProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(["idNo"]) // ID No is always selected
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [updateRecords, setUpdateRecords] = useState<UpdateRecord[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "completed" | "error">("idle")

  const availableColumns: ColumnOption[] = [
    // Person Information Fields
    { id: "idNo", label: "ID No", category: "person", required: true },
    { id: "personId", label: "Person ID", category: "person" },
    { id: "name", label: "Name", category: "person" },
    { id: "gender", label: "Gender", category: "person" },
    { id: "nationality", label: "Nationality", category: "person" },
    { id: "idType", label: "ID Type", category: "person" },
    { id: "dateOfBirth", label: "Date of Birth", category: "person" },
    { id: "issuedCountry", label: "Issued Country", category: "person" },
    { id: "issueDate", label: "Issue Date", category: "person" },
    { id: "expiryDate", label: "Expiry Date", category: "person" },
    { id: "status", label: "Status", category: "person" },

    // Membership Information Fields
    { id: "membershipNo", label: "Membership No", category: "membership" },
    { id: "planName", label: "Plan Name", category: "membership" },
    { id: "planCode", label: "Plan Code", category: "membership" },
    { id: "membershipEffectiveDate", label: "Membership Effective Date", category: "membership" },
    { id: "membershipExpiryDate", label: "Membership Expiry Date", category: "membership" },
    { id: "personType", label: "Person Type", category: "membership" },
    { id: "priority", label: "Priority", category: "membership" },
    { id: "companyName", label: "Company Name", category: "membership" },
    { id: "policyNo", label: "Policy No", category: "membership" },
    { id: "membershipStatus", label: "Membership Status", category: "membership" },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setShowPreview(false)
      setUpdateRecords([])
    }
  }

  const handleColumnSelection = (columnId: string, checked: boolean) => {
    if (columnId === "idNo") return // ID No cannot be deselected

    if (checked) {
      setSelectedColumns([...selectedColumns, columnId])
    } else {
      setSelectedColumns(selectedColumns.filter((id) => id !== columnId))
    }
  }

  const getColumnLabel = (columnId: string): string => {
    const column = availableColumns.find((col) => col.id === columnId)
    return column?.label || columnId
  }

  const parseCSVFile = (file: File): Promise<ParsedFileData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split("\n").filter((line) => line.trim())
          if (lines.length < 2) {
            reject(new Error("File must contain at least a header row and one data row"))
            return
          }

          const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
          const data: ParsedFileData[] = []

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
            const row: ParsedFileData = {}

            headers.forEach((header, index) => {
              row[header] = values[index] || ""
            })

            data.push(row)
          }

          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const findPersonByIdNo = (idNo: string): PersonProfile | null => {
    const persons = getPersons()
    return persons.find((person) => person.idNo === idNo) || null
  }

  const getCurrentValue = (person: PersonProfile, field: string): string => {
    switch (field) {
      case "ID No":
      case "idNo":
        return person.idNo
      case "Person ID":
      case "personId":
        return person.personId
      case "Name":
      case "name":
        return person.name
      case "Gender":
      case "gender":
        return person.gender || ""
      case "Nationality":
      case "nationality":
        return person.nationality || ""
      case "ID Type":
      case "idType":
        return person.idType || ""
      case "Date of Birth":
      case "dateOfBirth":
        return person.dateOfBirth ? new Date(person.dateOfBirth).toISOString().split("T")[0] : ""
      case "Issued Country":
      case "issuedCountry":
        return person.issuedCountry || ""
      case "Issue Date":
      case "issueDate":
        return person.issueDate ? new Date(person.issueDate).toISOString().split("T")[0] : ""
      case "Expiry Date":
      case "expiryDate":
        return person.expiryDate ? new Date(person.expiryDate).toISOString().split("T")[0] : ""
      case "Status":
      case "status":
        return person.status
      default:
        return ""
    }
  }

  const processFileData = async (fileData: ParsedFileData[]): Promise<UpdateRecord[]> => {
    const records: UpdateRecord[] = []
    let recordId = 1

    for (const row of fileData) {
      const idNo = row["ID No"] || row["idNo"] || ""

      if (!idNo) {
        records.push({
          id: recordId.toString(),
          personId: "",
          idNo: "",
          name: "Unknown",
          field: "ID No",
          currentValue: "",
          newValue: "",
          status: "error",
          errorMessage: "ID No is required",
        })
        recordId++
        continue
      }

      const person = findPersonByIdNo(idNo)

      if (!person) {
        records.push({
          id: recordId.toString(),
          personId: "",
          idNo: idNo,
          name: "Not Found",
          field: "Person",
          currentValue: "",
          newValue: "",
          status: "error",
          errorMessage: "Person with this ID No not found",
        })
        recordId++
        continue
      }

      // Process each field in the row (except ID No)
      Object.keys(row).forEach((fieldName) => {
        if (fieldName.toLowerCase() === "id no" || fieldName.toLowerCase() === "idno") return

        const newValue = row[fieldName]
        if (!newValue) return // Skip empty values

        const currentValue = getCurrentValue(person, fieldName)

        // Only create record if value is different
        if (currentValue !== newValue) {
          records.push({
            id: recordId.toString(),
            personId: person.personId,
            idNo: person.idNo,
            name: person.name,
            field: fieldName,
            currentValue: currentValue,
            newValue: newValue,
            status: "pending",
          })
          recordId++
        }
      })
    }

    return records
  }

  const generateCustomTemplate = (): string => {
    // Create header row with selected columns
    const headers = selectedColumns.map((columnId) => getColumnLabel(columnId))

    // Create sample data rows based on selected columns
    const sampleRows = [
      selectedColumns.map((columnId) => {
        switch (columnId) {
          case "idNo":
            return "123456-78-9012"
          case "personId":
            return "P001234"
          case "name":
            return "John Doe"
          case "gender":
            return "Male"
          case "nationality":
            return "Malaysian"
          case "idType":
            return "IC No."
          case "dateOfBirth":
            return "1990-01-15"
          case "issuedCountry":
            return ""
          case "issueDate":
            return ""
          case "expiryDate":
            return ""
          case "status":
            return "Active"
          case "membershipNo":
            return "MEM-001-2024"
          case "planName":
            return "Basic Health Plan"
          case "planCode":
            return "BHP-2024"
          case "membershipEffectiveDate":
            return "2024-01-01"
          case "membershipExpiryDate":
            return "2024-12-31"
          case "personType":
            return "Employee"
          case "priority":
            return "Primary"
          case "companyName":
            return "ABC Company"
          case "policyNo":
            return "POL-ABC-001"
          case "membershipStatus":
            return "Active"
          default:
            return ""
        }
      }),
      selectedColumns.map((columnId) => {
        switch (columnId) {
          case "idNo":
            return "A12345678"
          case "personId":
            return "P001235"
          case "name":
            return "Jane Smith"
          case "gender":
            return "Female"
          case "nationality":
            return "Malaysian"
          case "idType":
            return "Passport No."
          case "dateOfBirth":
            return "1985-05-20"
          case "issuedCountry":
            return "Malaysia"
          case "issueDate":
            return "2020-03-15"
          case "expiryDate":
            return "2030-03-14"
          case "status":
            return "Active"
          case "membershipNo":
            return "MEM-002-2024"
          case "planName":
            return "Premium Health Plan"
          case "planCode":
            return "PHP-2024"
          case "membershipEffectiveDate":
            return "2024-01-01"
          case "membershipExpiryDate":
            return "2024-12-31"
          case "personType":
            return "Employee"
          case "priority":
            return "Primary"
          case "companyName":
            return "XYZ Corporation"
          case "policyNo":
            return "POL-XYZ-002"
          case "membershipStatus":
            return "Active"
          default:
            return ""
        }
      }),
    ]

    return [headers.join(","), ...sampleRows.map((row) => row.join(","))].join("\n")
  }

  const handleDownloadTemplate = () => {
    const csvContent = generateCustomTemplate()

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bulk_edit_template_custom.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handlePreviewData = async () => {
    if (!selectedFile) return

    setIsProcessing(true)

    try {
      const fileData = await parseCSVFile(selectedFile)
      const processedRecords = await processFileData(fileData)

      setUpdateRecords(processedRecords)
      setShowPreview(true)
    } catch (error) {
      console.error("Error processing file:", error)
      setUpdateRecords([
        {
          id: "1",
          personId: "",
          idNo: "",
          name: "Error",
          field: "File Processing",
          currentValue: "",
          newValue: "",
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Failed to process file",
        },
      ])
      setShowPreview(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const applyPersonUpdate = (person: PersonProfile, field: string, newValue: string): Partial<PersonProfile> => {
    const updates: Partial<PersonProfile> = {}

    switch (field.toLowerCase()) {
      case "name":
        updates.name = newValue
        break
      case "gender":
        updates.gender = newValue
        break
      case "nationality":
        updates.nationality = newValue
        break
      case "id type":
      case "idtype":
        updates.idType = newValue
        break
      case "date of birth":
      case "dateofbirth":
        updates.dateOfBirth = newValue
        break
      case "issued country":
      case "issuedcountry":
        updates.issuedCountry = newValue
        break
      case "issue date":
      case "issuedate":
        updates.issueDate = newValue
        break
      case "expiry date":
      case "expirydate":
        updates.expiryDate = newValue
        break
      case "status":
        updates.status = newValue
        break
    }

    return updates
  }

  const handleApplyUpdates = async () => {
    setUploadStatus("processing")

    try {
      const updatedRecords = [...updateRecords]

      for (let i = 0; i < updatedRecords.length; i++) {
        const record = updatedRecords[i]

        if (record.status === "error") continue

        try {
          const person = findPersonByIdNo(record.idNo)
          if (!person) {
            updatedRecords[i] = { ...record, status: "error", errorMessage: "Person not found" }
            continue
          }

          // Apply the update
          const updates = applyPersonUpdate(person, record.field, record.newValue)

          if (Object.keys(updates).length > 0) {
            const result = updatePerson(person.id, updates)
            if (result) {
              updatedRecords[i] = { ...record, status: "success" }
            } else {
              updatedRecords[i] = { ...record, status: "error", errorMessage: "Failed to update person" }
            }
          } else {
            updatedRecords[i] = { ...record, status: "error", errorMessage: "Invalid field for update" }
          }
        } catch (error) {
          updatedRecords[i] = {
            ...record,
            status: "error",
            errorMessage: error instanceof Error ? error.message : "Update failed",
          }
        }
      }

      setUpdateRecords(updatedRecords)
      setUploadStatus("completed")
    } catch (error) {
      console.error("Error applying updates:", error)
      setUploadStatus("error")
    }
  }

  const removeRecord = (id: string) => {
    setUpdateRecords(updateRecords.filter((record) => record.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const personColumns = availableColumns.filter((col) => col.category === "person")
  const membershipColumns = availableColumns.filter((col) => col.category === "membership")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bulk Update Person Records</h2>
          <p className="text-slate-600">Upload a file to update specific fields for multiple person records</p>
        </div>
      </div>

      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Instructions:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Select the columns you want to update</li>
            <li>Download the template file for the selected columns</li>
            <li>Fill in your data following the template format</li>
            <li>Upload your completed file and preview the changes</li>
            <li>Review and apply the updates</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Update Type Selection - Fixed to Custom Template */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Select Update Type</Label>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-sm text-slate-700">Custom Template (Select Columns)</span>
            </div>
          </div>

          {/* Column Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700">Select Columns to Update</Label>
              <p className="text-xs text-slate-500 mt-1">
                ID No is mandatory and will always be included in the template
              </p>
            </div>

            {/* Person Information Columns */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Person Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {personColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={(checked) => handleColumnSelection(column.id, checked as boolean)}
                      disabled={column.required}
                    />
                    <Label
                      htmlFor={column.id}
                      className={`text-sm ${column.required ? "font-medium text-slate-800" : "text-slate-600"}`}
                    >
                      {column.label} {column.required && <span className="text-red-500">*</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership Information Columns */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Membership Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {membershipColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={(checked) => handleColumnSelection(column.id, checked as boolean)}
                    />
                    <Label htmlFor={column.id} className="text-sm text-slate-600">
                      {column.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {selectedColumns.length > 1 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Selected columns ({selectedColumns.length}):</strong>{" "}
                  {selectedColumns.map((id) => getColumnLabel(id)).join(", ")}
                </p>
              </div>
            )}
          </div>

          {selectedColumns.length > 1 && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* File Upload */}
      {selectedColumns.length > 1 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="file" className="text-sm font-medium text-slate-700">
                Upload Update File
              </Label>
              <div className="mt-2">
                <Input id="file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="w-full" />
              </div>
              {selectedFile && (
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {selectedFile && !showPreview && (
              <Button onClick={handlePreviewData} disabled={isProcessing} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isProcessing ? "Processing..." : "Preview Updates"}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Preview Updates */}
      {showPreview && updateRecords.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Preview Updates</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  disabled={uploadStatus === "processing"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyUpdates}
                  disabled={
                    uploadStatus === "processing" || updateRecords.filter((r) => r.status !== "error").length === 0
                  }
                  className="flex items-center gap-2"
                >
                  {uploadStatus === "processing" ? "Applying..." : "Apply Updates"}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700">
                      Status
                    </th>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700">
                      ID No
                    </th>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700">
                      Name
                    </th>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700">
                      Field
                    </th>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700">
                      Current Value
                    </th>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700">
                      New Value
                    </th>
                    <th className="border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {updateRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="border border-slate-200 px-4 py-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          {record.status === "error" && record.errorMessage && (
                            <span className="text-xs text-red-600">{record.errorMessage}</span>
                          )}
                        </div>
                      </td>
                      <td className="border border-slate-200 px-4 py-2 text-sm">{record.idNo}</td>
                      <td className="border border-slate-200 px-4 py-2 text-sm">{record.name}</td>
                      <td className="border border-slate-200 px-4 py-2 text-sm">{record.field}</td>
                      <td className="border border-slate-200 px-4 py-2 text-sm">{record.currentValue}</td>
                      <td className="border border-slate-200 px-4 py-2 text-sm font-medium">{record.newValue}</td>
                      <td className="border border-slate-200 px-4 py-2">
                        {uploadStatus === "idle" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeRecord(record.id)}
                            className="flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Remove
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {uploadStatus === "completed" && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Bulk update completed successfully! {updateRecords.filter((r) => r.status === "success").length}{" "}
                  records updated, {updateRecords.filter((r) => r.status === "error").length} errors.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      )}

      {/* Help Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">File Format Requirements</h3>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              <strong>Supported formats:</strong> CSV, Excel (.xlsx, .xls)
            </p>
            <p>
              <strong>Required columns:</strong> ID No (mandatory for all templates)
            </p>
            <p>
              <strong>Maximum file size:</strong> 10 MB
            </p>
            <p>
              <strong>Maximum records:</strong> 1,000 per upload
            </p>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-slate-700 mb-2">How to Use:</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>
                <strong>Step 1:</strong> Select the columns you want to update using the checkboxes above
              </li>
              <li>
                <strong>Step 2:</strong> Download the template file with your selected columns
              </li>
              <li>
                <strong>Step 3:</strong> Fill in the template with your data (ID No is required for matching)
              </li>
              <li>
                <strong>Step 4:</strong> Upload the completed file and preview the changes
              </li>
              <li>
                <strong>Step 5:</strong> Review and apply the updates to your person records
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
