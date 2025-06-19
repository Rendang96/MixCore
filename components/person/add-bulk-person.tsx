"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Upload, Download, FileText, AlertCircle, CheckCircle2, X, AlertTriangle } from "lucide-react"
import * as XLSX from "xlsx"
import {
  getPersons,
  addBulkPersons,
  addPerson,
  registerFamilyRelationship,
  getPersonGroups,
  type PersonProfile,
} from "@/lib/person/person-storage"
import { ColumnMapping } from "./column-mapping"

interface AddBulkPersonProps {
  onBack: () => void
}

// Define interfaces for parsed data
interface PersonData {
  name: string
  idNumber: string
  idType: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  status: string
  issuedCountry?: string
  issueDate?: string
  expiryDate?: string
  disabilityStatus: string
  specifyDisability?: string
  salutation?: string
  email?: string
  phoneNo?: string
  address?: string
  rowIndex: number // Track original row for removal
}

interface FamilyMemberData {
  primaryPersonName: string
  primaryPersonIdNumber: string
  name: string
  idNumber: string
  idType: string
  relationshipType: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  status: string
  issuedCountry?: string
  issueDate?: string
  expiryDate?: string
  // New fields for family members
  disabilityStatus: string
  specifyDisability?: string
  salutation?: string
  email?: string
  phoneNo?: string
  address?: string
  notes?: string
  rowIndex: number // Track original row for removal
}

interface DuplicateMatch {
  type: "internal" | "external"
  field: "idNumber" | "name"
  value: string
  records: Array<{
    sheet: "Person Registration" | "Family Member Registration"
    rowIndex: number
    data: PersonData | FamilyMemberData
  }>
  existingRecord?: any // For external matches
}

interface UploadSummary {
  totalPersons: number
  totalFamilyMembers: number
  validPersons: number
  validFamilyMembers: number
  invalidPersons: number
  invalidFamilyMembers: number
  duplicates: DuplicateMatch[]
  errors: Array<{ sheet: string; row: number; message: string }>
}

// Add new interface for sheet columns
interface SheetColumn {
  sheetName: string
  columnName: string
  displayName: string // "SheetName - ColumnName"
}

// Component implementation
function AddBulkPerson({ onBack }: AddBulkPersonProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<{
    persons: PersonData[]
    familyMembers: FamilyMemberData[]
  } | null>(null)
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [removedRecords, setRemovedRecords] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showColumnMapping, setShowColumnMapping] = useState(false)
  const [allSheetColumns, setAllSheetColumns] = useState<SheetColumn[]>([])
  const [columnMapping, setColumnMapping] = useState<{
    person: Record<string, SheetColumn | null>
    family: Record<string, SheetColumn | null>
  }>({ person: {}, family: {} })
  const [recordFilter, setRecordFilter] = useState<"all" | "matched" | "unmatched">("all")
  const [showMatchedOnly, setShowMatchedOnly] = useState(false)
  const correctedFileInputRef = useRef<HTMLInputElement>(null)

  // Define required and optional fields for person and family
  const personRequiredFields = ["Person Name*", "ID Number*", "ID Type*", "Status*", "Disability Status*"]
  const personOptionalFields = [
    "Date of Birth (YYYY-MM-DD)",
    "Gender",
    "Nationality",
    "Issued Country",
    "Issue Date (YYYY-MM-DD)",
    "Expiry Date (YYYY-MM-DD)",
    "Specify Disability",
    "Salutation",
    "Email",
    "Phone No.",
    "Address",
  ]

  const familyRequiredFields = [
    "Primary Person Name*",
    "Primary Person ID no.*",
    "Family Member Name*",
    "Family Member ID Number*",
    "Family Member ID Type*",
    "Relationship Type*",
    "Status*",
    "Family Member Disability Status*",
  ]

  const familyOptionalFields = [
    "Date of Birth (YYYY-MM-DD)",
    "Gender",
    "Nationality",
    "Issued Country",
    "Issue Date (YYYY-MM-DD)",
    "Expiry Date (YYYY-MM-DD)",
    "Family Member Specify Disability",
    "Family Member Salutation",
    "Family Member Email",
    "Family Member Phone No.",
    "Family Member Address",
    "Notes",
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadError(null)
      setUploadSummary(null)
      setParsedData(null)
      setShowPreview(false)
      setRemovedRecords(new Set())
      parseExcelFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadError(null)
      setUploadSummary(null)
      setParsedData(null)
      setShowPreview(false)
      setRemovedRecords(new Set())
      parseExcelFile(file)
    }
  }

  const handleMappingComplete = (mapping: {
    person: Record<string, SheetColumn | null>
    family: Record<string, SheetColumn | null>
  }) => {
    console.log("🔄 Applying new column mapping...")

    // Clear previous state
    setUploadError(null)
    setUploadSummary(null)
    setParsedData(null)
    setShowPreview(false)
    setRemovedRecords(new Set())

    // Set new mapping
    setColumnMapping(mapping)
    setShowColumnMapping(false)

    // Show processing message immediately
    setIsUploading(true)

    // Add this line right before processFileWithMapping() in handleMappingComplete
    setTimeout(() => {
      // Process the file with the new mapping
      if (selectedFile) {
        debugColumnMapping()
        processFileWithMapping()
      } else {
        setIsUploading(false)
        setUploadError("No file selected. Please upload a file first.")
      }
    }, 100)
  }

  const detectDuplicates = (persons: PersonData[], familyMembers: FamilyMemberData[]): DuplicateMatch[] => {
    const duplicates: DuplicateMatch[] = []
    const existingPersons = getPersons()

    // Combine all records for internal duplicate checking
    const allRecords = [
      ...persons.map((p) => ({ sheet: "Person Registration" as const, rowIndex: p.rowIndex, data: p })),
      ...familyMembers.map((f) => ({ sheet: "Family Member Registration" as const, rowIndex: f.rowIndex, data: f })),
    ]

    console.log(
      `🔍 Starting duplicate detection for ${allRecords.length} records against ${existingPersons.length} existing persons`,
    )

    // Enhanced duplicate detection based on ID Type
    const icNumberGroups = new Map<string, typeof allRecords>()
    const passportMatchGroups = new Map<string, typeof allRecords>()

    // Process each record for duplicate detection
    allRecords.forEach((record, index) => {
      const idType = record.data.idType?.toLowerCase().trim()
      console.log(
        `Processing record ${index + 1}: ${record.data.name} (${record.data.idType}: ${record.data.idNumber})`,
      )

      if (idType === "ic no." || idType === "ic no") {
        // For IC No.: Check ID Number only
        const idNumber = record.data.idNumber.toLowerCase().trim()
        if (idNumber) {
          if (!icNumberGroups.has(idNumber)) {
            icNumberGroups.set(idNumber, [])
          }
          icNumberGroups.get(idNumber)!.push(record)
          console.log(`  ✓ Added to IC group: ${idNumber}`)
        }
      } else if (idType === "passport no." || idType === "passport no" || idType === "passport") {
        // For Passport No.: Check Name + DOB + Nationality combination
        const name = record.data.name.toLowerCase().trim()
        const dob = record.data.dateOfBirth || ""
        const nationality = record.data.nationality?.toLowerCase().trim() || ""

        if (name && dob && nationality) {
          const passportKey = `${name}|${dob}|${nationality}`
          if (!passportMatchGroups.has(passportKey)) {
            passportMatchGroups.set(passportKey, [])
          }
          passportMatchGroups.get(passportKey)!.push(record)
          console.log(`  ✓ Added to Passport group: ${name} (${dob}, ${nationality})`)
        } else {
          console.log(`  ⚠️ Incomplete passport data: Name=${name}, DOB=${dob}, Nationality=${nationality}`)
        }
      }
    })

    // Find internal IC Number duplicates
    icNumberGroups.forEach((records, idNumber) => {
      if (records.length > 1) {
        console.log(`🔴 Found internal IC duplicate: ${idNumber} (${records.length} records)`)
        duplicates.push({
          type: "internal",
          field: "idNumber",
          value: `IC No: ${idNumber}`,
          records: records,
        })
      }
    })

    // Find internal Passport duplicates (Name + DOB + Nationality)
    passportMatchGroups.forEach((records, passportKey) => {
      if (records.length > 1) {
        const [name, dob, nationality] = passportKey.split("|")
        console.log(
          `🔴 Found internal passport duplicate: ${name} (${dob}, ${nationality}) - ${records.length} records`,
        )
        duplicates.push({
          type: "internal",
          field: "name",
          value: `Passport Match: ${name} (${dob}, ${nationality})`,
          records: records,
        })
      }
    })

    // Check for external duplicates against existing system data
    console.log(`🔍 Checking against ${existingPersons.length} existing system records...`)

    allRecords.forEach((record) => {
      const idType = record.data.idType?.toLowerCase().trim()

      if (idType === "ic no." || idType === "ic no") {
        // For IC No.: Check against existing ID Numbers
        const matchingExisting = existingPersons.find(
          (existing) => existing.idNo.toLowerCase().trim() === record.data.idNumber.toLowerCase().trim(),
        )

        if (matchingExisting) {
          console.log(
            `🔴 Found external IC match: ${record.data.idNumber} matches existing person ${matchingExisting.name}`,
          )
          duplicates.push({
            type: "external",
            field: "idNumber",
            value: `IC No: ${record.data.idNumber}`,
            records: [record],
            existingRecord: matchingExisting,
          })
        }
      } else if (idType === "passport no." || idType === "passport no" || idType === "passport") {
        // For Passport No.: Check Name + DOB + Nationality against existing records
        const recordName = record.data.name.toLowerCase().trim()
        const recordDob = record.data.dateOfBirth
        const recordNationality = record.data.nationality?.toLowerCase().trim()

        if (recordName && recordDob && recordNationality) {
          const matchingExisting = existingPersons.find((existing) => {
            const existingName = existing.name.toLowerCase().trim()
            const existingNationality = existing.nationality?.toLowerCase().trim()

            // Check if DOB matches
            let dobMatch = false
            if (existing.dateOfBirth && recordDob) {
              try {
                const existingDOB = new Date(existing.dateOfBirth)
                const recordDOBDate = new Date(recordDob)
                dobMatch = existingDOB.toDateString() === recordDOBDate.toDateString()
              } catch (error) {
                console.warn(`Date parsing error for ${recordName}: ${error}`)
              }
            }

            const nameMatch = existingName === recordName
            const nationalityMatch = existingNationality === recordNationality

            return nameMatch && dobMatch && nationalityMatch
          })

          if (matchingExisting) {
            console.log(
              `🔴 Found external passport match: ${recordName} (${recordDob}, ${recordNationality}) matches existing person ${matchingExisting.name}`,
            )
            duplicates.push({
              type: "external",
              field: "name",
              value: `Passport Match: ${recordName} (${recordDob}, ${recordNationality})`,
              records: [record],
              existingRecord: matchingExisting,
            })
          }
        }
      }
    })

    console.log(`✅ Duplicate detection complete: Found ${duplicates.length} potential duplicates`)
    return duplicates
  }

  const parseExcelFile = async (file: File) => {
    setIsUploading(true)
    try {
      // Check file type
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls") && !file.name.endsWith(".csv")) {
        throw new Error("Invalid file format. Please upload an Excel (.xlsx, .xls) or CSV file.")
      }

      // Read file
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)

      // Extract headers from ALL sheets
      const allColumns: SheetColumn[] = []

      // Handle CSV files (single sheet)
      if (file.name.endsWith(".csv")) {
        const csvSheet = workbook.Sheets[workbook.SheetNames[0]]
        const headerRow = XLSX.utils.sheet_to_json<any>(csvSheet, { header: 1 })[0] || []

        headerRow.forEach((columnName: string) => {
          if (columnName && columnName.trim()) {
            allColumns.push({
              sheetName: "CSV Data",
              columnName: columnName.trim(),
              displayName: `CSV Data - ${columnName.trim()}`,
            })
          }
        })
      } else {
        // Handle Excel files (multiple sheets)
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          const headerRow = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 })[0] || []

          headerRow.forEach((columnName: string) => {
            if (columnName && columnName.trim()) {
              allColumns.push({
                sheetName: sheetName,
                columnName: columnName.trim(),
                displayName: `${sheetName} - ${columnName.trim()}`,
              })
            }
          })
        })
      }

      // Store all sheet columns for column mapping
      setAllSheetColumns(allColumns)

      // Show column mapping interface
      setShowColumnMapping(true)
      setIsUploading(false)
    } catch (error) {
      console.error("Error parsing Excel file:", error)
      setUploadError(error instanceof Error ? error.message : "An unknown error occurred while parsing the file.")
      setIsUploading(false)
    }
  }

  // Add this function after parseExcelFile but before processFileWithMapping
  const debugColumnMapping = () => {
    if (!selectedFile) return

    console.log("🔍 DEBUG: Current Column Mapping:", columnMapping)

    // Read file and log sheet structure
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = e.target?.result
        if (!data) return

        const workbook = XLSX.read(data)
        console.log("📊 DEBUG: Available sheets:", workbook.SheetNames)

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          const sheetData = XLSX.utils.sheet_to_json(sheet)
          console.log(`📑 DEBUG: Sheet "${sheetName}" data sample:`, sheetData.length > 0 ? sheetData[0] : "No data")

          if (sheetData.length > 0) {
            console.log(`🔑 DEBUG: Available columns in "${sheetName}":`, Object.keys(sheetData[0]))
          }
        })

        // Check if mapped columns actually exist in the file
        const personMappingIssues = []
        const familyMappingIssues = []

        Object.entries(columnMapping.person).forEach(([field, column]) => {
          if (column) {
            const sheetExists = workbook.SheetNames.includes(column.sheetName)
            if (!sheetExists) {
              personMappingIssues.push(`Sheet "${column.sheetName}" not found for field "${field}"`)
            } else {
              const sheet = workbook.Sheets[column.sheetName]
              const sheetData = XLSX.utils.sheet_to_json(sheet)
              if (sheetData.length > 0 && !Object.keys(sheetData[0]).includes(column.columnName)) {
                personMappingIssues.push(
                  `Column "${column.columnName}" not found in sheet "${column.sheetName}" for field "${field}"`,
                )
              }
            }
          }
        })

        Object.entries(columnMapping.family).forEach(([field, column]) => {
          if (column) {
            const sheetExists = workbook.SheetNames.includes(column.sheetName)
            if (!sheetExists) {
              familyMappingIssues.push(`Sheet "${column.sheetName}" not found for field "${field}"`)
            } else {
              const sheet = workbook.Sheets[column.sheetName]
              const sheetData = XLSX.utils.sheet_to_json(sheet)
              if (sheetData.length > 0 && !Object.keys(sheetData[0]).includes(column.columnName)) {
                familyMappingIssues.push(
                  `Column "${column.columnName}" not found in sheet "${column.sheetName}" for field "${field}"`,
                )
              }
            }
          }
        })

        if (personMappingIssues.length > 0) {
          console.warn("⚠️ DEBUG: Person mapping issues:", personMappingIssues)
        }

        if (familyMappingIssues.length > 0) {
          console.warn("⚠️ DEBUG: Family mapping issues:", familyMappingIssues)
        }
      } catch (error) {
        console.error("💥 DEBUG: Error analyzing file:", error)
      }
    }

    reader.readAsArrayBuffer(selectedFile)
  }

  const processFileWithMapping = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError(null)

    try {
      console.log("🔄 Starting file processing with mapping...")
      console.log("📋 Column Mapping:", columnMapping)

      // Read file
      const data = await selectedFile.arrayBuffer()
      const workbook = XLSX.read(data)

      // Create a map of sheet data for easy access
      const sheetDataMap = new Map<string, any[]>()

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName]
        const sheetData = XLSX.utils.sheet_to_json<any>(sheet)
        sheetDataMap.set(sheetName, sheetData)
        console.log(`📊 Loaded sheet "${sheetName}" with ${sheetData.length} rows`)

        // Log first few rows for debugging
        if (sheetData.length > 0) {
          console.log(`📝 Sample data from "${sheetName}":`, sheetData.slice(0, 2))
          console.log(`🔑 Available columns in "${sheetName}":`, Object.keys(sheetData[0] || {}))
        }
      })

      // Process Person Registration data
      const persons: PersonData[] = []
      const errors: Array<{ sheet: string; row: number; message: string }> = []

      // Determine which sheets contain person data based on mapping
      const personSheets = new Set<string>()
      Object.values(columnMapping.person).forEach((sheetColumn) => {
        if (sheetColumn) {
          personSheets.add(sheetColumn.sheetName)
        }
      })

      console.log(`👥 Processing person data from sheets: ${Array.from(personSheets).join(", ")}`)

      // Process person data from all relevant sheets
      personSheets.forEach((sheetName) => {
        const sheetData = sheetDataMap.get(sheetName) || []
        console.log(`🔍 Processing ${sheetData.length} rows from sheet "${sheetName}"`)

        for (let i = 0; i < sheetData.length; i++) {
          const row = sheetData[i]
          if (!row) continue

          console.log(`📝 Processing person row ${i + 2}:`, row)

          // Map fields using column mapping
          const mappedPerson: PersonData = {
            rowIndex: i + 2, // +2 because 0-based index and header row
            name: "",
            idNumber: "",
            idType: "",
            status: "",
            disabilityStatus: "",
          }

          // Enhanced validation for required fields with detailed feedback
          let hasRequiredFields = true
          const missingFields: string[] = []

          for (const field of personRequiredFields) {
            const mappedColumn = columnMapping.person[field]
            if (!mappedColumn || mappedColumn.sheetName !== sheetName) {
              continue
            }

            console.log(`🔗 Mapping field "${field}" to column "${mappedColumn.columnName}"`)

            const cellValue = row[mappedColumn.columnName]
            console.log(`📊 Cell value for "${field}":`, cellValue, `(type: ${typeof cellValue})`)

            // Enhanced validation - check for null, undefined, empty string, or whitespace-only
            if (cellValue === null || cellValue === undefined || cellValue.toString().trim() === "") {
              const errorMsg = `Missing required field: ${field} (mapped to column "${mappedColumn.columnName}") - Value is empty or contains only whitespace`
              console.log(`❌ ${errorMsg}`)
              errors.push({
                sheet: sheetName,
                row: i + 2,
                message: errorMsg,
              })
              missingFields.push(field)
              hasRequiredFields = false
              continue
            }

            // Set the value based on field name
            const trimmedValue = cellValue.toString().trim()
            console.log(`✅ Trimmed value: "${trimmedValue}"`)

            if (field === "Person Name*") {
              mappedPerson.name = trimmedValue
              console.log(`✅ Set person name: "${trimmedValue}"`)
            } else if (field === "ID Number*") {
              mappedPerson.idNumber = trimmedValue
              console.log(`✅ Set ID number: "${trimmedValue}"`)
            } else if (field === "ID Type*") {
              mappedPerson.idType = trimmedValue
              console.log(`✅ Set ID type: "${trimmedValue}"`)
            } else if (field === "Status*") {
              mappedPerson.status = trimmedValue
              console.log(`✅ Set status: "${trimmedValue}"`)
            } else if (field === "Disability Status*") {
              mappedPerson.disabilityStatus = trimmedValue
              console.log(`✅ Set disability status: "${trimmedValue}"`)
            }
          }

          if (!hasRequiredFields) {
            console.log(`❌ Skipping person row ${i + 2} due to missing required fields: ${missingFields.join(", ")}`)
            continue
          }

          // Additional validation for specific field values
          const validIdTypes = ["IC No.", "Passport No.", "Birth Certificate", "Other"]
          const validStatuses = ["Active", "Inactive", "Suspended"]
          const validDisabilityStatuses = ["Yes", "No"]

          if (!validIdTypes.includes(mappedPerson.idType)) {
            const errorMsg = `Invalid ID Type: "${mappedPerson.idType}". Must be one of: ${validIdTypes.join(", ")}`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: sheetName,
              row: i + 2,
              message: errorMsg,
            })
            continue
          }

          if (!validStatuses.includes(mappedPerson.status)) {
            const errorMsg = `Invalid Status: "${mappedPerson.status}". Must be one of: ${validStatuses.join(", ")}`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: sheetName,
              row: i + 2,
              message: errorMsg,
            })
            continue
          }

          if (!validDisabilityStatuses.includes(mappedPerson.disabilityStatus)) {
            const errorMsg = `Invalid Disability Status: "${mappedPerson.disabilityStatus}". Must be one of: ${validDisabilityStatuses.join(", ")}`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: sheetName,
              row: i + 2,
              message: errorMsg,
            })
            continue
          }

          // Map optional fields
          for (const field of personOptionalFields) {
            const mappedColumn = columnMapping.person[field]
            if (mappedColumn && mappedColumn.sheetName === sheetName && row[mappedColumn.columnName] !== undefined) {
              const cellValue = row[mappedColumn.columnName]
              if (cellValue && cellValue.toString().trim() !== "") {
                const trimmedValue = cellValue.toString().trim()
                if (field === "Date of Birth (YYYY-MM-DD)") mappedPerson.dateOfBirth = trimmedValue
                else if (field === "Gender") mappedPerson.gender = trimmedValue
                else if (field === "Nationality") mappedPerson.nationality = trimmedValue
                else if (field === "Issued Country") mappedPerson.issuedCountry = trimmedValue
                else if (field === "Issue Date (YYYY-MM-DD)") mappedPerson.issueDate = trimmedValue
                else if (field === "Expiry Date (YYYY-MM-DD)") mappedPerson.expiryDate = trimmedValue
                else if (field === "Specify Disability") mappedPerson.specifyDisability = trimmedValue
                else if (field === "Salutation") mappedPerson.salutation = trimmedValue
                else if (field === "Email") mappedPerson.email = trimmedValue
                else if (field === "Phone No.") mappedPerson.phoneNo = trimmedValue
                else if (field === "Address") mappedPerson.address = trimmedValue

                console.log(`✅ Set optional field "${field}": ${trimmedValue}`)
              }
            }
          }

          console.log(`✅ Successfully mapped person:`, mappedPerson)
          persons.push(mappedPerson)
        }
      })

      console.log(`✅ Processed ${persons.length} person records`)

      // Process Family Member Registration data
      const familyMembers: FamilyMemberData[] = []

      // Determine which sheets contain family data based on mapping
      const familySheets = new Set<string>()
      Object.values(columnMapping.family).forEach((sheetColumn) => {
        if (sheetColumn) {
          familySheets.add(sheetColumn.sheetName)
        }
      })

      console.log(`👨‍👩‍👧‍👦 Processing family data from sheets: ${Array.from(familySheets).join(", ")}`)

      // Process family data from all relevant sheets
      familySheets.forEach((sheetName) => {
        const sheetData = sheetDataMap.get(sheetName) || []
        console.log(`🔍 Processing ${sheetData.length} family rows from sheet "${sheetName}"`)

        for (let i = 0; i < sheetData.length; i++) {
          const row = sheetData[i]
          if (!row) continue

          console.log(`📝 Processing family row ${i + 2}:`, row)

          // Map fields using column mapping
          const mappedFamily: FamilyMemberData = {
            rowIndex: i + 2, // +2 because 0-based index and header row
            primaryPersonName: "",
            primaryPersonIdNumber: "",
            name: "",
            idNumber: "",
            idType: "",
            relationshipType: "",
            status: "",
            disabilityStatus: "",
          }

          // Enhanced validation for family required fields with detailed feedback
          let hasRequiredFields = true
          const missingFields: string[] = []

          for (const field of familyRequiredFields) {
            const mappedColumn = columnMapping.family[field]
            if (!mappedColumn || mappedColumn.sheetName !== sheetName) {
              continue
            }

            console.log(`🔗 Mapping family field "${field}" to column "${mappedColumn.columnName}"`)

            const cellValue = row[mappedColumn.columnName]
            console.log(`📊 Cell value for "${field}":`, cellValue, `(type: ${typeof cellValue})`)

            // Enhanced validation - check for null, undefined, empty string, or whitespace-only
            if (cellValue === null || cellValue === undefined || cellValue.toString().trim() === "") {
              const errorMsg = `Missing required field: ${field} (mapped to column "${mappedColumn.columnName}") - Value is empty or contains only whitespace`
              console.log(`❌ ${errorMsg}`)
              errors.push({
                sheet: sheetName,
                row: i + 2,
                message: errorMsg,
              })
              missingFields.push(field)
              hasRequiredFields = false
              continue
            }

            // Set the value based on field name
            const trimmedValue = cellValue.toString().trim()
            console.log(`✅ Trimmed value: "${trimmedValue}"`)

            if (field === "Primary Person Name*") {
              mappedFamily.primaryPersonName = trimmedValue
              console.log(`✅ Set primary person name: "${trimmedValue}"`)
            } else if (field === "Primary Person ID no.*") {
              mappedFamily.primaryPersonIdNumber = trimmedValue
              console.log(`✅ Set primary person ID: "${trimmedValue}"`)
            } else if (field === "Family Member Name*") {
              mappedFamily.name = trimmedValue
              console.log(`✅ Set family member name: "${trimmedValue}"`)
            } else if (field === "Family Member ID Number*") {
              mappedFamily.idNumber = trimmedValue
              console.log(`✅ Set family member ID: "${trimmedValue}"`)
            } else if (field === "Family Member ID Type*") {
              mappedFamily.idType = trimmedValue
              console.log(`✅ Set family member ID type: "${trimmedValue}"`)
            } else if (field === "Relationship Type*") {
              mappedFamily.relationshipType = trimmedValue
              console.log(`✅ Set relationship type: "${trimmedValue}"`)
            } else if (field === "Status*") {
              mappedFamily.status = trimmedValue
              console.log(`✅ Set family status: "${trimmedValue}"`)
            } else if (field === "Family Member Disability Status*") {
              mappedFamily.disabilityStatus = trimmedValue
              console.log(`✅ Set family member disability status: "${trimmedValue}"`)
            }
          }

          if (!hasRequiredFields) {
            console.log(`❌ Skipping family row ${i + 2} due to missing required fields: ${missingFields.join(", ")}`)
            continue
          }

          // Additional validation for specific field values
          const validIdTypes = ["IC No.", "Passport No.", "Birth Certificate", "Other"]
          const validStatuses = ["Active", "Inactive", "Suspended"]
          const validDisabilityStatuses = ["Yes", "No"]
          const validRelationshipTypes = [
            "Spouse",
            "Father",
            "Mother",
            "Son",
            "Daughter",
            "Brother",
            "Sister",
            "Husband",
            "Wife",
          ]

          if (!validIdTypes.includes(mappedFamily.idType)) {
            const errorMsg = `Invalid ID Type: "${mappedFamily.idType}". Must be one of: ${validIdTypes.join(", ")}`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: sheetName,
              row: i + 2,
              message: errorMsg,
            })
            continue
          }

          if (!validStatuses.includes(mappedFamily.status)) {
            const errorMsg = `Invalid Status: "${mappedFamily.status}". Must be one of: ${validStatuses.join(", ")}`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: sheetName,
              row: i + 2,
              message: errorMsg,
            })
            continue
          }

          if (!validDisabilityStatuses.includes(mappedFamily.disabilityStatus)) {
            const errorMsg = `Invalid Family Member Disability Status: "${mappedFamily.disabilityStatus}". Must be one of: ${validDisabilityStatuses.join(", ")}`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: sheetName,
              row: i + 2,
              message: errorMsg,
            })
            continue
          }

          if (!validRelationshipTypes.includes(mappedFamily.relationshipType)) {
            const errorMsg = `Invalid Relationship Type: "${mappedFamily.relationshipType}". Must be one of: ${validRelationshipTypes.join(", ")}`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: sheetName,
              row: i + 2,
              message: errorMsg,
            })
            continue
          }

          // Map optional fields
          for (const field of familyOptionalFields) {
            const mappedColumn = columnMapping.family[field]
            if (mappedColumn && mappedColumn.sheetName === sheetName && row[mappedColumn.columnName] !== undefined) {
              const cellValue = row[mappedColumn.columnName]
              if (cellValue && cellValue.toString().trim() !== "") {
                const trimmedValue = cellValue.toString().trim()
                if (field === "Date of Birth (YYYY-MM-DD)") mappedFamily.dateOfBirth = trimmedValue
                else if (field === "Gender") mappedFamily.gender = trimmedValue
                else if (field === "Nationality") mappedFamily.nationality = trimmedValue
                else if (field === "Issued Country") mappedFamily.issuedCountry = trimmedValue
                else if (field === "Issue Date (YYYY-MM-DD)") mappedFamily.issueDate = trimmedValue
                else if (field === "Expiry Date (YYYY-MM-DD)") mappedFamily.expiryDate = trimmedValue
                else if (field === "Family Member Specify Disability") mappedFamily.specifyDisability = trimmedValue
                else if (field === "Family Member Salutation") mappedFamily.salutation = trimmedValue
                else if (field === "Family Member Email") mappedFamily.email = trimmedValue
                else if (field === "Family Member Phone No.") mappedFamily.phoneNo = trimmedValue
                else if (field === "Family Member Address") mappedFamily.address = trimmedValue
                else if (field === "Notes") mappedFamily.notes = trimmedValue

                console.log(`✅ Set optional family field "${field}": ${trimmedValue}`)
              }
            }
          }

          console.log(`✅ Successfully mapped family member:`, mappedFamily)
          familyMembers.push(mappedFamily)
        }
      })

      console.log(`✅ Processed ${familyMembers.length} family member records`)

      // Enhanced validation for primary person references
      for (const familyMember of familyMembers) {
        // First check if primary person exists in the uploaded file
        const primaryPersonExists = persons.some(
          (p) => p.name === familyMember.primaryPersonName && p.idNumber === familyMember.primaryPersonIdNumber,
        )

        // If not found in uploaded file, check if primary person exists in the system
        if (!primaryPersonExists) {
          const existingPersons = getPersons()
          const existingPrimaryPerson = existingPersons.find(
            (p) =>
              // Check by ID number (most reliable)
              p.idNo === familyMember.primaryPersonIdNumber ||
              // Also check by name as a fallback
              p.name === familyMember.primaryPersonName,
          )

          if (!existingPrimaryPerson) {
            const errorMsg = `Primary person "${familyMember.primaryPersonName}" with ID "${familyMember.primaryPersonIdNumber}" not found in Person Registration sheet or existing system records`
            console.log(`❌ ${errorMsg}`)
            errors.push({
              sheet: "Family Member Registration",
              row: familyMember.rowIndex,
              message: errorMsg,
            })
          } else {
            console.log(
              `✅ Found existing primary person: ${existingPrimaryPerson.name} (${existingPrimaryPerson.idNo})`,
            )
          }
        } else {
          console.log(`✅ Found primary person in uploaded data: ${familyMember.primaryPersonName}`)
        }
      }

      console.log("🔍 Starting duplicate detection...")
      // Detect duplicates
      const duplicates = detectDuplicates(persons, familyMembers)

      // Set parsed data
      setParsedData({ persons, familyMembers })

      // Set upload summary
      setUploadSummary({
        totalPersons: persons.length,
        totalFamilyMembers: familyMembers.length,
        validPersons: persons.length - errors.filter((e) => e.sheet.includes("Person")).length,
        validFamilyMembers: familyMembers.length - errors.filter((e) => e.sheet.includes("Family")).length,
        invalidPersons: errors.filter((e) => e.sheet.includes("Person")).length,
        invalidFamilyMembers: errors.filter((e) => e.sheet.includes("Family")).length,
        duplicates,
        errors,
      })

      console.log(
        `✅ Processing complete: ${persons.length} persons, ${familyMembers.length} family members, ${duplicates.length} duplicates, ${errors.length} errors`,
      )

      // Enhanced success feedback
      if (errors.length === 0 && (persons.length > 0 || familyMembers.length > 0)) {
        console.log(`🎉 VALIDATION SUCCESSFUL! All data is valid and ready for processing.`)
        console.log(`📊 Summary: ${persons.length} persons, ${familyMembers.length} family members`)

        // Show success message in UI
        setUploadError(null) // Clear any previous errors
      }

      // Detailed error reporting
      if (errors.length > 0) {
        console.log("❌ Detailed error breakdown:")
        errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.sheet} Row ${error.row}: ${error.message}`)
        })
      }

      // Check if we have any data at all in the file
      if (persons.length === 0 && familyMembers.length === 0) {
        // If we have errors, show them with a more specific message
        if (errors.length > 0) {
          setUploadSummary({
            totalPersons: 0,
            totalFamilyMembers: 0,
            validPersons: 0,
            validFamilyMembers: 0,
            invalidPersons: errors.filter((e) => e.sheet.includes("Person")).length,
            invalidFamilyMembers: errors.filter((e) => e.sheet.includes("Family")).length,
            duplicates: [],
            errors: errors,
          })
          setShowPreview(true)
          setUploadError(
            `No valid records found. Found ${errors.length} validation errors. Check the browser console for detailed debugging information.`,
          )
        } else {
          // If no data and no errors, check if we have any sheet data at all
          let hasAnyData = false
          sheetDataMap.forEach((sheetData) => {
            if (sheetData && sheetData.length > 0) {
              hasAnyData = true
            }
          })

          if (hasAnyData) {
            setUploadError(
              "No valid data could be extracted with the current column mapping. Please check that your column mappings match the data in your file. Try downloading the template for reference.",
            )
          } else {
            setUploadError(
              "No data found in the file. The file may be empty or have an incorrect format. Please check your column mapping or download the template for reference.",
            )
          }
          setShowPreview(false)
        }
      } else {
        // We have some data, show the preview
        setShowPreview(true)
      }
    } catch (error) {
      console.error("💥 Error processing file with mapping:", error)
      setUploadError(
        error instanceof Error
          ? `Error processing file: ${error.message}. Check the browser console for detailed debugging information.`
          : "An unknown error occurred while processing the file. Please check your column mapping and try again. Check the browser console for detailed debugging information.",
      )
      setShowPreview(false)
    } finally {
      setIsUploading(false)
    }
  }

  const handleReuploadCorrectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("🔄 Re-uploading corrected file:", file.name)
      setSelectedFile(file)
      setUploadError(null)
      setUploadSummary(null)
      setParsedData(null)
      setShowPreview(false)
      setRemovedRecords(new Set())

      // Keep existing column mapping and process directly
      setIsUploading(true)

      // Process with existing mapping after a short delay
      setTimeout(() => {
        debugColumnMapping() // Add debugging
        processFileWithMapping()
      }, 100)
    }
  }

  const removeRecord = (sheet: string, rowIndex: number) => {
    const recordKey = `${sheet}-${rowIndex}`
    setRemovedRecords((prev) => new Set([...prev, recordKey]))
  }

  const restoreRecord = (sheet: string, rowIndex: number) => {
    const recordKey = `${sheet}-${rowIndex}`
    setRemovedRecords((prev) => {
      const newSet = new Set(prev)
      newSet.delete(recordKey)
      return newSet
    })
  }

  const isRecordRemoved = (sheet: string, rowIndex: number) => {
    return removedRecords.has(`${sheet}-${rowIndex}`)
  }

  const getFilteredData = () => {
    if (!parsedData) return { persons: [], familyMembers: [] }

    return {
      persons: parsedData.persons.filter((p) => !isRecordRemoved("Person Registration", p.rowIndex)),
      familyMembers: parsedData.familyMembers.filter((f) => !isRecordRemoved("Family Member Registration", f.rowIndex)),
    }
  }

  const handleSubmit = () => {
    // Process the filtered data (excluding removed records)
    const filteredData = getFilteredData()

    if (filteredData.persons.length === 0 && filteredData.familyMembers.length === 0) {
      alert("No records to process. Please ensure you have valid data that hasn't been removed.")
      return
    }

    try {
      // Step 1: Create primary persons first
      const personsForInsertion = filteredData.persons.map((person) => ({
        name: person.name,
        personId: "", // Will be auto-generated
        idNo: person.idNumber,
        idType: person.idType,
        dateOfBirth: person.dateOfBirth,
        gender: person.gender,
        nationality: person.nationality,
        status: person.status,
        issuedCountry: person.issuedCountry,
        issueDate: person.issueDate,
        expiryDate: person.expiryDate,
        // New fields
        salutation: person.salutation,
        email: person.email,
        phoneNo: person.phoneNo,
        address: person.address,
        addresses: person.address ? [{ address: person.address, type: "Home" }] : [{ address: "", type: "Home" }],
        disabilityStatus: person.disabilityStatus,
        specifyDisability: person.specifyDisability,
      }))

      // Create group data
      const groupData = {
        groupName: `Bulk Upload ${new Date().toLocaleDateString()}`,
        dateUpload: new Date().toISOString().split("T")[0],
        uploadStatus: "Complete",
        uploadedBy: "System User",
        companyName: "Mixed Companies", // Could be extracted from data if consistent
        companyCode: "BULK",
        policyNo: "BULK-UPLOAD",
      }

      // Process the bulk upload for primary persons
      const newGroup = addBulkPersons(groupData, personsForInsertion)

      // Step 2: Create family members as individual persons and establish relationships
      const createdPersons = getPersons() // Get updated list including newly created persons
      let familyMembersCreated = 0
      let relationshipsCreated = 0
      const familyMemberPersons: PersonProfile[] = [] // Track created family members

      filteredData.familyMembers.forEach((familyMember) => {
        try {
          // Find the primary person - first check in newly created persons
          let primaryPerson = createdPersons.find(
            (p) =>
              // Check by ID number (most reliable)
              p.idNo === familyMember.primaryPersonIdNumber ||
              // Also check by name as a fallback
              p.name === familyMember.primaryPersonName,
          )

          // If not found in newly created persons, check existing system records
          if (!primaryPerson) {
            const existingPersons = getPersons()
            primaryPerson = existingPersons.find(
              (p) =>
                // Check by ID number (most reliable)
                p.idNo === familyMember.primaryPersonIdNumber ||
                // Also check by name as a fallback
                p.name === familyMember.primaryPersonName,
            )
          }

          if (!primaryPerson) {
            console.warn(
              `Primary person not found: ${familyMember.primaryPersonName} (${familyMember.primaryPersonIdNumber}). Available IDs: ${createdPersons.map((p) => p.idNo).join(", ")}`,
            )
          }

          if (primaryPerson) {
            // Check if family member already exists as a person
            let familyMemberPerson = createdPersons.find((p) => p.idNo === familyMember.idNumber)

            // If family member doesn't exist, create them as a new person
            if (!familyMemberPerson) {
              // Generate Person ID using the same pattern as single entry
              const persons = getPersons()
              const timestamp = Date.now()
              let maxPerNumber = 0
              persons.forEach((person) => {
                if (person.personId && person.personId.startsWith("PER-2025-")) {
                  const perNumber = Number.parseInt(person.personId.split("-")[2])
                  if (!isNaN(perNumber) && perNumber > maxPerNumber) {
                    maxPerNumber = perNumber
                  }
                }
              })
              const uniqueNumber = maxPerNumber + 1 + Math.floor(timestamp % 1000) + Math.floor(Math.random() * 100)
              const generatedPersonId = `PER-2025-${uniqueNumber.toString().padStart(3, "0")}`

              const familyMemberPersonData = {
                name: familyMember.name,
                personId: generatedPersonId, // Use the same pattern as single entry
                idNo: familyMember.idNumber,
                idType: familyMember.idType,
                dateOfBirth: familyMember.dateOfBirth,
                gender: familyMember.gender,
                nationality: familyMember.nationality,
                status: familyMember.status,
                issuedCountry: familyMember.issuedCountry,
                issueDate: familyMember.issueDate,
                expiryDate: familyMember.expiryDate,
                // New fields for family members
                salutation: familyMember.salutation,
                email: familyMember.email,
                phoneNo: familyMember.phoneNo,
                address: familyMember.address,
                addresses: familyMember.address
                  ? [{ address: familyMember.address, type: "Home" }]
                  : [{ address: "", type: "Home" }],
                disabilityStatus: familyMember.disabilityStatus,
                specifyDisability: familyMember.specifyDisability,
              }

              familyMemberPerson = addPerson(familyMemberPersonData)
              familyMembersCreated++

              // Add to our tracking array
              if (familyMemberPerson) {
                familyMemberPersons.push(familyMemberPerson)
              }
            }

            // Establish family relationship - FIXED: Register relationship in correct direction
            if (familyMemberPerson) {
              // IMPORTANT: The relationship type in Excel describes what the family member IS to the primary person
              // So if Excel says "Father", it means the family member IS the Father of the primary person
              // Therefore: familyMemberPerson (Father) -> primaryPerson (Child)

              // Determine relationship direction
              const relationshipDirection = ["Spouse", "Sibling"].includes(familyMember.relationshipType)
                ? "bidirectional"
                : "directional"

              // Register the relationship correctly:
              // familyMemberPerson has the relationshipType TO the primaryPerson
              registerFamilyRelationship(
                familyMemberPerson.id, // The family member (who has the relationship)
                primaryPerson.id, // The primary person (who the relationship is to)
                familyMember.relationshipType, // The exact relationship as entered (Father, Mother, etc.)
                relationshipDirection,
                familyMember.notes,
              )
              relationshipsCreated++
            }
          } else {
            console.warn(
              `Primary person not found: ${familyMember.primaryPersonName} (${familyMember.primaryPersonIdNumber})`,
            )
          }
        } catch (error) {
          console.error(`Error processing family member ${familyMember.name}:`, error)
        }
      })

      // Step 3: Update the group to include family members
      if (familyMemberPersons.length > 0) {
        const groups = getPersonGroups()
        const groupIndex = groups.findIndex((g) => g.groupId === newGroup.groupId)

        if (groupIndex !== -1) {
          // Add family members to the group's persons array
          groups[groupIndex].persons.push(...familyMemberPersons)
          groups[groupIndex].totalRecords = groups[groupIndex].persons.length

          // Save updated groups back to storage
          if (typeof window !== "undefined") {
            localStorage.setItem("person_groups", JSON.stringify(groups))
          }
        }
      }

      // Show comprehensive success message
      const successMessage = [
        `Successfully processed bulk upload!`,
        ``,
        `Group ID: ${newGroup.groupId}`,
        `Group Name: ${newGroup.groupName}`,
        ``,
        `Summary:`,
        `• ${filteredData.persons.length} primary persons created`,
        `• ${familyMembersCreated} family members created as persons`,
        `• ${relationshipsCreated} family relationships established`,
        `• Total records in group: ${filteredData.persons.length + familyMembersCreated}`,
        ``,
        `All family members are now registered as individual persons and will appear in the Family Member Information tab.`,
        `${filteredData.persons.length === 0 && familyMembersCreated > 0 ? "Family members were registered to existing persons in the system." : ""}`,
      ].join("\n")

      alert(successMessage)

      // Navigate back to search which should now show the new group in bulk view
      onBack()
    } catch (error) {
      console.error("Error processing bulk data:", error)
      alert("An error occurred while processing the bulk data. Please try again.")
    }
  }

  const handleDownloadTemplate = () => {
    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new()

    // Sheet 1: Person Registration Template (Person ID will be auto-generated)
    const personHeaders = [
      "Person Name*",
      "ID Number*",
      "ID Type*",
      "Date of Birth (YYYY-MM-DD)",
      "Gender",
      "Nationality",
      "Status*",
      "Disability Status*",
      "Specify Disability",
      "Salutation",
      "Email",
      "Phone No.",
      "Address",
      "Issued Country",
      "Issue Date (YYYY-MM-DD)",
      "Expiry Date (YYYY-MM-DD)",
    ]

    // Sample data for person registration
    const personSampleData = [
      [
        "Ahmad Farid bin Abdullah",
        "A12345678",
        "Passport No.",
        "1985-01-01",
        "Male",
        "Malaysian",
        "Active",
        "No",
        "",
        "Mr.",
        "ahmad.farid@email.com",
        "+60123456789",
        "123 Jalan Bukit Bintang, 55100 Kuala Lumpur, Malaysia",
        "Malaysia",
        "2020-03-15",
        "2030-03-14",
      ],
      [
        "Siti Nurhaliza binti Hassan",
        "850102-14-1001",
        "IC No.",
        "1985-01-02",
        "Female",
        "Malaysian",
        "Active",
        "Yes",
        "Hearing impairment",
        "Ms.",
        "siti.nurhaliza@email.com",
        "+60123456790",
        "PMCare Building, Kuala Lumpur, Malaysia",
        "",
        "",
        "",
      ],
    ]

    // Create person registration sheet
    const personData = [personHeaders, ...personSampleData]
    const personSheet = XLSX.utils.aoa_to_sheet(personData)

    // Set column widths for person sheet
    const personColWidths = personHeaders.map(() => ({ wch: 20 }))
    personSheet["!cols"] = personColWidths

    // Sheet 2: Family Member Registration Template - Updated with new fields
    const familyHeaders = [
      "Primary Person Name*",
      "Primary Person ID no.*",
      "Family Member Name*",
      "Family Member ID Number*",
      "Family Member ID Type*",
      "Relationship Type*",
      "Date of Birth (YYYY-MM-DD)",
      "Gender",
      "Nationality",
      "Status*",
      "Family Member Disability Status*",
      "Family Member Specify Disability",
      "Family Member Salutation",
      "Family Member Email",
      "Family Member Phone No.",
      "Family Member Address",
      "Issued Country",
      "Issue Date (YYYY-MM-DD)",
      "Expiry Date (YYYY-MM-DD)",
      "Notes",
    ]

    // Sample data for family member registration - Updated with new fields
    const familySampleData = [
      [
        "Ahmad Farid bin Abdullah",
        "A12345678",
        "Siti Aishah binti Ahmad",
        "870505-14-5678",
        "IC No.",
        "Spouse",
        "1987-05-05",
        "Female",
        "Malaysian",
        "Active",
        "No",
        "",
        "Mrs.",
        "siti.aishah@email.com",
        "+60123456791",
        "123 Jalan Bukit Bintang, 55100 Kuala Lumpur, Malaysia",
        "",
        "",
        "",
        "Marriage date",
      ],
      [
        "Ahmad Farid bin Abdullah",
        "A12345678",
        "Ahmad Danial bin Ahmad Farid",
        "120315-14-1234",
        "IC No.",
        "Son",
        "2012-03-15",
        "Male",
        "Malaysian",
        "Active",
        "Yes",
        "Learning disability",
        "Master",
        "",
        "",
        "123 Jalan Bukit Bintang, 55100 Kuala Lumpur, Malaysia",
        "",
        "",
        "",
        "Birth date",
      ],
      [
        "Siti Nurhaliza binti Hassan",
        "850102-14-1001",
        "Lim Wei Ming",
        "850103-14-1002",
        "IC No.",
        "Spouse",
        "1985-01-03",
        "Male",
        "Malaysian",
        "Active",
        "No",
        "",
        "Mr.",
        "lim.weiming@email.com",
        "+60123456792",
        "PMCare Building, Kuala Lumpur, Malaysia",
        "",
        "",
        "",
        "Marriage date",
      ],
    ]

    // Create family member registration sheet
    const familyData = [familyHeaders, ...familySampleData]
    const familySheet = XLSX.utils.aoa_to_sheet(familyData)

    // Set column widths for family sheet
    const familyColWidths = familyHeaders.map(() => ({ wch: 20 }))
    familySheet["!cols"] = familyColWidths

    // Sheet 3: Instructions and Guidelines - Updated with new field information
    const instructionsData = [
      ["BULK PERSON AND FAMILY REGISTRATION TEMPLATE"],
      [""],
      ["INSTRUCTIONS:"],
      ["1. Fill in the Person Registration sheet first with all primary persons"],
      ["2. Fill in the Family Member Registration sheet with family relationships"],
      ["3. System IDs for both persons and family members will be automatically generated"],
      ["4. ID Number refers to identification documents (IC, Passport, etc.), not system-generated IDs"],
      ["5. Use Primary Person Name and ID Number to link family members to the correct person"],
      ["6. Fields marked with * are mandatory"],
      ["7. Use the exact format specified for dates (YYYY-MM-DD)"],
      ["8. Save the file and upload it through the bulk entry interface"],
      [""],
      ["IMPORTANT NOTES:"],
      ["- Family members will be created as individual persons in the system"],
      ["- Family relationships will be automatically established between primary persons and family members"],
      ["- All family members will appear in the Family Member Information tab"],
      ["- Family members can be searched individually in the person search"],
      ["- Relationship Type describes what the family member IS to the primary person"],
      ["- Example: If you enter 'Father', it means the family member is the Father of the primary person"],
      ["- Family members now have their own contact information, disability status, and address fields"],
      [""],
      ["VALID VALUES:"],
      [""],
      ["ID Type:"],
      ["- IC No."],
      ["- Passport No."],
      ["- Birth Certificate"],
      ["- Other"],
      [""],
      ["Gender:"],
      ["- Male"],
      ["- Female"],
      [""],
      ["Status:"],
      ["- Active"],
      ["- Inactive"],
      ["- Suspended"],
      [""],
      ["Disability Status (Both Person and Family Member):"],
      ["- Yes"],
      ["- No"],
      [""],
      ["Salutation (Both Person and Family Member):"],
      ["- Mr."],
      ["- Mrs."],
      ["- Ms."],
      ["- Miss"],
      ["- Dr."],
      ["- Prof."],
      ["- Dato'"],
      ["- Datuk"],
      ["- Tan Sri"],
      ["- Tun"],
      ["- Master"],
      [""],
      ["Relationship Type (What the family member IS to the primary person):"],
      ["- Spouse (bidirectional)"],
      ["- Father (family member is the father of primary person)"],
      ["- Mother (family member is the mother of primary person)"],
      ["- Son (family member is the son of primary person)"],
      ["- Daughter (family member is the daughter of primary person)"],
      ["- Brother (family member is the brother of primary person)"],
      ["- Sister (family member is the sister of primary person)"],
      ["- Husband (family member is the husband of primary person)"],
      ["- Wife (family member is the wife of primary person)"],
      [""],
      ["PROCESSING DETAILS:"],
      ["- System IDs for both persons and family members are automatically generated"],
      ["- ID Number refers to identification documents (IC, Passport, etc.), not system-generated IDs"],
      ["- Primary Person Name and ID Number must match exactly with Person Registration sheet"],
      ["- ID Numbers must be unique across all persons and family members"],
      ["- Family members are created as individual persons with their own profiles"],
      ["- Family relationships are bidirectional for spouses and siblings"],
      ["- All family members will appear in search results and can be managed individually"],
      ["- Family members now have their own contact information, disability status, and address fields"],
      ["- Email and Phone No. fields are optional but recommended for better contact management"],
      ["- Address field allows for detailed address information for each family member"],
      ["- Notes field can be used for additional information about the family relationship"],
      [""],
      ["EXAMPLE SCENARIOS:"],
      [""],
      ["Scenario 1: Adding a spouse"],
      ["- Primary Person: Ahmad Farid bin Abdullah (A12345678)"],
      ["- Family Member: Siti Aishah binti Ahmad (870505-14-5678)"],
      ["- Relationship Type: Spouse"],
      ["- Result: Both persons can search for each other as spouse"],
      [""],
      ["Scenario 2: Adding children"],
      ["- Primary Person: Ahmad Farid bin Abdullah (A12345678)"],
      ["- Family Member: Ahmad Danial bin Ahmad Farid (120315-14-1234)"],
      ["- Relationship Type: Son"],
      ["- Result: Ahmad Danial appears as son of Ahmad Farid"],
      [""],
      ["Scenario 3: Adding parents"],
      ["- Primary Person: Ahmad Farid bin Abdullah (A12345678)"],
      ["- Family Member: Abdullah bin Hassan (550101-14-0001)"],
      ["- Relationship Type: Father"],
      ["- Result: Abdullah appears as father of Ahmad Farid"],
    ]

    const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData)

    // Set column width for instructions
    instructionsSheet["!cols"] = [{ wch: 80 }]

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, personSheet, "Person Registration")
    XLSX.utils.book_append_sheet(workbook, familySheet, "Family Member Registration")
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions")

    // Generate file data and create download link (browser-compatible)
    const fileName = `Person_Family_Registration_Template_${new Date().toISOString().split("T")[0]}.xlsx`

    try {
      // Write workbook to array buffer
      const workbookData = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Create blob and download link
      const blob = new Blob([workbookData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)

      // Create temporary download link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log(`✅ Template downloaded successfully: ${fileName}`)
    } catch (error) {
      console.error("❌ Error generating template:", error)
      alert("Error generating template file. Please try again.")
    }
  }

  const renderDuplicateDetails = (duplicate: DuplicateMatch) => {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-2">
              {duplicate.type === "internal" ? "Internal Duplicate" : "External Duplicate"}: {duplicate.value}
            </h4>

            {duplicate.type === "external" && duplicate.existingRecord && (
              <div className="mb-3 p-3 bg-yellow-100 rounded border">
                <p className="text-sm text-yellow-700 font-medium mb-1">Matches existing system record:</p>
                <p className="text-sm text-yellow-800">
                  {duplicate.existingRecord.name} ({duplicate.existingRecord.idNo})
                </p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-yellow-700 font-medium">Affected records:</p>
              {duplicate.records.map((record, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div className="text-sm">
                    <span className="font-medium">{record.sheet}</span> - Row {record.rowIndex}:{" "}
                    <span className="text-gray-700">
                      {record.data.name} ({record.data.idNumber})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {!isRecordRemoved(record.sheet, record.rowIndex) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeRecord(record.sheet, record.rowIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restoreRecord(record.sheet, record.rowIndex)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPreview = () => {
    if (!parsedData || !uploadSummary) return null

    const filteredData = getFilteredData()

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredData.persons.length}</div>
              <div className="text-sm text-gray-600">Valid Persons</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredData.familyMembers.length}</div>
              <div className="text-sm text-gray-600">Valid Family Members</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{uploadSummary.duplicates.length}</div>
              <div className="text-sm text-gray-600">Duplicates Found</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{uploadSummary.errors.length}</div>
              <div className="text-sm text-gray-600">Validation Errors</div>
            </div>
          </Card>
        </div>

        {/* Duplicates Section */}
        {uploadSummary.duplicates.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Duplicate Records Found ({uploadSummary.duplicates.length})
            </h3>
            <div className="space-y-4">
              {uploadSummary.duplicates.map((duplicate, index) => renderDuplicateDetails(duplicate))}
            </div>
          </div>
        )}

        {/* Errors Section */}
        {uploadSummary.errors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Validation Errors ({uploadSummary.errors.length})
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {uploadSummary.errors.map((error, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-red-800">{error.sheet}</span>
                    <span className="text-red-600"> - Row {error.row}: </span>
                    <span className="text-red-700">{error.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data Preview */}
        {(filteredData.persons.length > 0 || filteredData.familyMembers.length > 0) && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Preview</h3>

            {/* Person Registration Preview */}
            {filteredData.persons.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Person Registration ({filteredData.persons.length} records)</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-auto">
                  <div className="space-y-2">
                    {filteredData.persons.slice(0, 5).map((person, index) => (
                      <div key={index} className="text-sm bg-white p-2 rounded border">
                        <div className="font-medium">{person.name}</div>
                        <div className="text-gray-600">
                          {person.idType}: {person.idNumber} | Status: {person.status} | Disability:{" "}
                          {person.disabilityStatus}
                          {person.email && ` | Email: ${person.email}`}
                          {person.phoneNo && ` | Phone: ${person.phoneNo}`}
                        </div>
                      </div>
                    ))}
                    {filteredData.persons.length > 5 && (
                      <div className="text-sm text-gray-500 text-center py-2">
                        ... and {filteredData.persons.length - 5} more records
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Family Member Registration Preview */}
            {filteredData.familyMembers.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">
                  Family Member Registration ({filteredData.familyMembers.length} records)
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-auto">
                  <div className="space-y-2">
                    {filteredData.familyMembers.slice(0, 5).map((member, index) => (
                      <div key={index} className="text-sm bg-white p-2 rounded border">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-gray-600">
                          {member.relationshipType} of {member.primaryPersonName} | {member.idType}: {member.idNumber} |
                          Disability: {member.disabilityStatus}
                          {member.email && ` | Email: ${member.email}`}
                          {member.phoneNo && ` | Phone: ${member.phoneNo}`}
                        </div>
                      </div>
                    ))}
                    {filteredData.familyMembers.length > 5 && (
                      <div className="text-sm text-gray-500 text-center py-2">
                        ... and {filteredData.familyMembers.length - 5} more records
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={filteredData.persons.length === 0 && filteredData.familyMembers.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Process {filteredData.persons.length + filteredData.familyMembers.length} Records
          </Button>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={correctedFileInputRef}
              onChange={handleReuploadCorrectedFile}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => correctedFileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Corrected File
            </Button>
          </div>

          <Button variant="outline" onClick={() => setShowColumnMapping(true)}>
            Edit Column Mapping
          </Button>
        </div>
      </div>
    )
  }

  if (showColumnMapping) {
    return (
      <ColumnMapping
        allSheetColumns={allSheetColumns}
        personRequiredFields={personRequiredFields}
        personOptionalFields={personOptionalFields}
        familyRequiredFields={familyRequiredFields}
        familyOptionalFields={familyOptionalFields}
        onMappingComplete={handleMappingComplete}
        onCancel={() => setShowColumnMapping(false)}
        initialMapping={columnMapping}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Bulk Person Registration</h1>
          <p className="text-gray-600">Upload Excel file to register multiple persons and family members</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upload File</h2>
            <Button variant="outline" onClick={handleDownloadTemplate} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>

              <div>
                <p className="text-lg font-medium">Drop your Excel file here</p>
                <p className="text-gray-600">or click to browse</p>
              </div>

              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>

              <p className="text-sm text-gray-500">Supports .xlsx, .xls, and .csv files</p>
            </div>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{selectedFile.name}</p>
                  <p className="text-sm text-blue-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || "Unknown type"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isUploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-blue-900">Processing file...</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-900">Upload Error</p>
                  <p className="text-red-700 mt-1">{uploadError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Preview Section */}
      {showPreview && renderPreview()}
    </div>
  )
}

export { AddBulkPerson }
