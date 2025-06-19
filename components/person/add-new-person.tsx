"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertCircle, Trash2, CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { getPersons, addPerson, initializeSampleData } from "@/lib/person/person-storage"
import type { Person } from "@/lib/person/person-types"

interface DependentRecord {
  id: string
  name: string
  personId: string
  idNo: string
  personType: string
}

export function AddNewPerson({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    personId: "",
    idNo: "",
    personType: "Employee", // Default to Employee since Person Type field is removed
    employeeName: "",
    employeeIdNo: "",
    dateOfBirth: undefined as Date | undefined,
    gender: "",
    nationality: "",
    idType: "", // Add this new field
    // Passport specific fields
    issuedCountry: "",
    issueDate: undefined as Date | undefined,
    expiryDate: undefined as Date | undefined,
  })
  const [showExistingPersonAlert, setShowExistingPersonAlert] = useState(false)
  const [existingPersonData, setExistingPersonData] = useState<typeof formData | null>(null)
  const [showDuplicateIcAlert, setShowDuplicateIcAlert] = useState(false)
  const [duplicateIcValue, setDuplicateIcValue] = useState("")
  const [showDependentForm, setShowDependentForm] = useState(false)
  const [dependentFormData, setDependentFormData] = useState({
    name: "",
    personId: "",
    idNo: "",
    personType: "", // Changed to empty string to require selection
    employeeName: "",
    employeeIdNo: "",
  })
  const [addedDependents, setAddedDependents] = useState<DependentRecord[]>([])
  const [possibleMatches, setPossibleMatches] = useState<Person[]>([])
  const [showPossibleMatches, setShowPossibleMatches] = useState(false)

  // Initialize sample data when component mounts
  useEffect(() => {
    initializeSampleData()
  }, [])

  // Auto-generate Person ID when component mounts
  // Remove this entire useEffect block

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Check if ID No. is 88888888
    if (id === "idNo" && value === "88888888") {
      // Override with existing person data
      const partialData = {
        ...formData,
        idNo: "88888888",
        name: "Muhammad Alif bin Rahman",
        personId: "PER-2025-001", // Override the auto-generated Person ID
      }

      setExistingPersonData(partialData)
      setFormData(partialData)
      setShowExistingPersonAlert(true)
    } else if (id === "idNo" && value !== "88888888" && value.trim() !== "") {
      // Check for duplicate ID No. when ID Type is IC No.
      if (formData.idType === "IC No." && value.trim() !== "") {
        const persons = getPersons()
        const duplicateFound = persons.some(
          (person) => person.idNo.toLowerCase() === value.toLowerCase() && person.idType === "IC No.",
        )

        if (duplicateFound) {
          setDuplicateIcValue(value)
          setShowDuplicateIcAlert(true)
          return // Don't update the form data
        }
      }

      // Auto-generate Person ID for new records with unique running number
      const persons = getPersons()
      // Find the highest existing EMP number and add current timestamp to ensure uniqueness
      let maxEmpNumber = 0
      persons.forEach((person) => {
        if (person.personId && person.personId.startsWith("PER-2025-")) {
          const empNumber = Number.parseInt(person.personId.split("-")[2])
          if (!isNaN(empNumber) && empNumber > maxEmpNumber) {
            maxEmpNumber = empNumber
          }
        }
      })
      // Use timestamp to ensure uniqueness for each form entry
      const uniqueNumber = maxEmpNumber + (Date.now() % 1000) + 1
      const newPersonId = `PER-2025-${uniqueNumber.toString().padStart(3, "0")}`
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        personId: newPersonId,
      }))
    } else if (id === "idNo" && value.trim() === "") {
      // Clear Person ID if ID No. is empty
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        personId: "",
      }))
    } else if (id === "idNo" && value !== "88888888" && formData.idNo === "88888888") {
      // If changing from 88888888 to something else, auto-generate new Person ID with unique number
      const persons = getPersons()
      // Find the highest existing EMP number and add timestamp for uniqueness
      let maxEmpNumber = 0
      persons.forEach((person) => {
        if (person.personId && person.personId.startsWith("PER-2025-")) {
          const empNumber = Number.parseInt(person.personId.split("-")[2])
          if (!isNaN(empNumber) && empNumber > maxEmpNumber) {
            maxEmpNumber = empNumber
          }
        }
      })
      // Use timestamp to ensure uniqueness for each form entry
      const uniqueNumber = maxEmpNumber + (Date.now() % 1000) + 1
      const newPersonId = `PER-2025-${uniqueNumber.toString().padStart(3, "0")}`
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        personId: newPersonId,
        name: "",
      }))
    }

    // Check for possible matches when name changes for passport type
    if (id === "name" && formData.idType === "Passport No.") {
      setTimeout(() => {
        const updatedFormData = { ...formData, [id]: value }
        checkForPossibleMatchesWithData(updatedFormData)
      }, 100)
    }
  }

  const checkForPossibleMatches = () => {
    // Only check for passport type forms
    if (formData.idType !== "Passport No." || !formData.name || !formData.dateOfBirth || !formData.nationality) {
      setPossibleMatches([])
      setShowPossibleMatches(false)
      return
    }

    const persons = getPersons()
    console.log("Checking for matches with:", {
      name: formData.name,
      dob: formData.dateOfBirth,
      nationality: formData.nationality,
      totalPersons: persons.length,
    })

    const matches = persons.filter((person) => {
      // Check if name matches (case-insensitive)
      const nameMatch = person.name.toLowerCase() === formData.name.toLowerCase()

      // Check if DOB matches
      let dobMatch = false
      if (person.dateOfBirth && formData.dateOfBirth) {
        const personDOB = new Date(person.dateOfBirth)
        const formDOB = formData.dateOfBirth
        dobMatch = personDOB.toDateString() === formDOB.toDateString()
      }

      // Check if nationality matches
      const nationalityMatch = person.nationality?.toLowerCase() === formData.nationality.toLowerCase()

      console.log("Checking person:", {
        personName: person.name,
        personDOB: person.dateOfBirth,
        personNationality: person.nationality,
        nameMatch,
        dobMatch,
        nationalityMatch,
      })

      return nameMatch && dobMatch && nationalityMatch
    })

    console.log("Found matches:", matches.length)

    if (matches.length > 0) {
      setPossibleMatches(matches)
      setShowPossibleMatches(true)
    } else {
      setPossibleMatches([])
      setShowPossibleMatches(false)
    }
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear passport-specific fields when switching to IC No.
    if (field === "idType" && value === "IC No.") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        issuedCountry: "",
        issueDate: undefined,
        expiryDate: undefined,
      }))
      setPossibleMatches([])
      setShowPossibleMatches(false)
    }

    // Check for duplicate when switching to IC No. with existing ID No.
    if (field === "idType" && value === "IC No." && formData.idNo.trim() !== "") {
      const persons = getPersons()
      const duplicateFound = persons.some(
        (person) => person.idNo.toLowerCase() === formData.idNo.toLowerCase() && person.idType === "IC No.",
      )

      if (duplicateFound) {
        setDuplicateIcValue(formData.idNo)
        setShowDuplicateIcAlert(true)
        return
      }
    }

    // Check for possible matches when nationality is selected for passport type
    if (field === "nationality" && formData.idType === "Passport No.") {
      setTimeout(() => {
        const updatedFormData = { ...formData, [field]: value }
        checkForPossibleMatchesWithData(updatedFormData)
      }, 100)
    }
  }

  const handleDateChange = (date: Date | undefined, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }))

    // Check for possible matches when DOB is selected for passport type
    if (field === "dateOfBirth" && formData.idType === "Passport No.") {
      setTimeout(() => {
        const updatedFormData = { ...formData, [field]: date }
        checkForPossibleMatchesWithData(updatedFormData)
      }, 100)
    }
  }

  const handleDependentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setDependentFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Auto-generate Person ID for dependent when ID No. is entered
    if (id === "idNo" && value.trim() !== "") {
      const persons = getPersons()
      let maxEmpNumber = 0
      persons.forEach((person) => {
        if (person.personId && person.personId.startsWith("PER-2025-")) {
          const empNumber = Number.parseInt(person.personId.split("-")[2])
          if (!isNaN(empNumber) && empNumber > maxEmpNumber) {
            maxEmpNumber = empNumber
          }
        }
      })
      const uniqueNumber = maxEmpNumber + (Date.now() % 1000) + 1
      const newPersonId = `PER-2025-${uniqueNumber.toString().padStart(3, "0")}`
      setDependentFormData((prev) => ({
        ...prev,
        [id]: value,
        personId: newPersonId,
      }))
    } else if (id === "idNo" && value.trim() === "") {
      setDependentFormData((prev) => ({
        ...prev,
        [id]: value,
        personId: "",
      }))
    }
  }

  const handleDependentSelectChange = (value: string, field: string) => {
    setDependentFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddDependentClick = () => {
    setShowDependentForm(true)
    // Auto-populate employee details from main form (but won't show in UI)
    setDependentFormData((prev) => ({
      ...prev,
      employeeName: formData.name,
      employeeIdNo: formData.idNo,
    }))
  }

  const handleSaveDependentOnly = () => {
    if (!dependentFormData.name || !dependentFormData.idNo || !dependentFormData.personType) {
      alert("Please fill in all required fields for dependent")
      return
    }

    try {
      let personId = dependentFormData.personId
      if (!personId) {
        const persons = getPersons()
        personId = `PER-${new Date().getFullYear()}-${(persons.length + 1).toString().padStart(3, "0")}`
      }

      const newDependent = addPerson({
        name: dependentFormData.name,
        personId: personId,
        idNo: dependentFormData.idNo,
        personType: dependentFormData.personType,
        status: "Active",
        employeeName: formData.name, // Use main form data for employee details
        employeeIdNo: formData.idNo, // Use main form data for employee details
      })

      console.log("Dependent added successfully:", newDependent)

      // Add to local dependent list for display
      const dependentRecord: DependentRecord = {
        id: newDependent.id,
        name: dependentFormData.name,
        personId: personId,
        idNo: dependentFormData.idNo,
        personType: dependentFormData.personType,
      }
      setAddedDependents((prev) => [...prev, dependentRecord])

      alert("Dependent added successfully!")

      // Reset dependent form for next entry while keeping employee details
      setDependentFormData({
        name: "",
        personId: "",
        idNo: "",
        personType: "",
        employeeName: formData.name,
        employeeIdNo: formData.idNo,
      })

      // Close the form after saving
      setShowDependentForm(false)
    } catch (error) {
      console.error("Error adding dependent:", error)
      alert("Error adding dependent. Please try again.")
    }
  }

  const handleRemoveDependent = (dependentId: string) => {
    setAddedDependents((prev) => prev.filter((dep) => dep.id !== dependentId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields based on ID type
    const baseValidation = !formData.idType || !formData.dateOfBirth || !formData.gender || !formData.nationality
    const passportValidation =
      formData.idType === "Passport No." && (!formData.issuedCountry || !formData.issueDate || !formData.expiryDate)

    if (baseValidation || passportValidation) {
      let missingFields = "Please fill in all required fields"
      if (formData.idType === "Passport No.") {
        missingFields += " including Issued Country, Issue Date, and Expiry Date"
      }
      alert(missingFields)
      return
    }

    try {
      // Auto-generate Person ID if not already set (for new records)
      let personId = formData.personId
      if (!personId) {
        const persons = getPersons()
        personId = `PER-${new Date().getFullYear()}-${(persons.length + 1).toString().padStart(3, "0")}`
      }

      // Add person using storage function
      const newPerson = addPerson({
        name: formData.name,
        personId: personId,
        idNo: formData.idNo,
        personType: formData.personType,
        status: "Active",
        employeeName: formData.employeeName,
        employeeIdNo: formData.employeeIdNo,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        idType: formData.idType,
        // Include passport fields if applicable
        ...(formData.idType === "Passport No." && {
          issuedCountry: formData.issuedCountry,
          issueDate: formData.issueDate,
          expiryDate: formData.expiryDate,
        }),
      })

      console.log("Person added successfully:", newPerson)
      alert("Person added successfully!")
      onBack()
    } catch (error) {
      console.error("Error adding person:", error)
      alert("Error adding person. Please try again.")
    }
  }

  const handleCancelExistingPerson = () => {
    setShowExistingPersonAlert(false)
    // Reset form data without pre-populating Person ID
    setFormData({
      name: "",
      personId: "",
      idNo: "",
      personType: "Employee",
      employeeName: "",
      employeeIdNo: "",
      dateOfBirth: undefined,
      gender: "",
      nationality: "",
      idType: "",
      issuedCountry: "",
      issueDate: undefined,
      expiryDate: undefined,
    })
  }

  const handleContinueWithExistingPerson = () => {
    setShowExistingPersonAlert(false)
    // Keep the existing data in the form
  }

  const handleCancelDuplicateIc = () => {
    setShowDuplicateIcAlert(false)
    // Reset the ID No. field
    setFormData((prev) => ({
      ...prev,
      idNo: "",
      personId: "",
    }))
  }

  const handleContinueWithDuplicateIc = () => {
    setShowDuplicateIcAlert(false)
    // Continue with the duplicate IC No. and auto-generate Person ID
    const persons = getPersons()
    let maxEmpNumber = 0
    persons.forEach((person) => {
      if (person.personId && person.personId.startsWith("PER-2025-")) {
        const empNumber = Number.parseInt(person.personId.split("-")[2])
        if (!isNaN(empNumber) && empNumber > maxEmpNumber) {
          maxEmpNumber = empNumber
        }
      }
    })
    const uniqueNumber = maxEmpNumber + (Date.now() % 1000) + 1
    const newPersonId = `PER-2025-${uniqueNumber.toString().padStart(3, "0")}`
    setFormData((prev) => ({
      ...prev,
      idNo: duplicateIcValue,
      personId: newPersonId,
    }))
  }

  const handleCloseDependentForm = () => {
    setShowDependentForm(false)
  }

  const checkForPossibleMatchesWithData = (updatedFormData: any) => {
    // Only check for passport type forms
    if (
      updatedFormData.idType !== "Passport No." ||
      !updatedFormData.name ||
      !updatedFormData.dateOfBirth ||
      !updatedFormData.nationality
    ) {
      setPossibleMatches([])
      setShowPossibleMatches(false)
      return
    }

    const persons = getPersons()
    console.log("Checking for matches with:", {
      name: updatedFormData.name,
      dob: updatedFormData.dateOfBirth,
      nationality: updatedFormData.nationality,
      totalPersons: persons.length,
    })

    const matches = persons.filter((person) => {
      // Check if name matches (case-insensitive)
      const nameMatch = person.name.toLowerCase() === updatedFormData.name.toLowerCase()

      // Check if DOB matches
      let dobMatch = false
      if (person.dateOfBirth && updatedFormData.dateOfBirth) {
        const personDOB = new Date(person.dateOfBirth)
        const formDOB = updatedFormData.dateOfBirth
        dobMatch = personDOB.toDateString() === formDOB.toDateString()
      }

      // Check if nationality matches
      const nationalityMatch = person.nationality?.toLowerCase() === updatedFormData.nationality.toLowerCase()

      console.log("Checking person:", {
        personName: person.name,
        personDOB: person.dateOfBirth,
        personNationality: person.nationality,
        nameMatch,
        dobMatch,
        nationalityMatch,
      })

      return nameMatch && dobMatch && nationalityMatch
    })

    console.log("Found matches:", matches.length)

    if (matches.length > 0) {
      setPossibleMatches(matches)
      setShowPossibleMatches(true)
    } else {
      setPossibleMatches([])
      setShowPossibleMatches(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Add New Person</h2>
        <Button variant="outline" className="flex items-center gap-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                ID Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.idType} onValueChange={(value) => handleSelectChange(value, "idType")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select ID Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IC No.">IC No.</SelectItem>
                  <SelectItem value="Passport No.">Passport No.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNo" className="text-sm font-medium text-slate-700">
                ID No. <span className="text-red-500">*</span>
              </Label>
              <Input
                id="idNo"
                placeholder="Enter ID Number"
                className="w-full"
                value={formData.idNo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter Person Name"
                className="w-full"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personId" className="text-sm font-medium text-slate-700">
                Person ID
              </Label>
              <Input
                id="personId"
                placeholder="Enter Person ID"
                className="w-full bg-gray-50"
                value={formData.personId}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfBirth && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Select date of birth"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => handleDateChange(date, "dateOfBirth")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange(value, "gender")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Nationality <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.nationality} onValueChange={(value) => handleSelectChange(value, "nationality")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Country of Citizenship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                  <SelectItem value="Thailand">Thailand</SelectItem>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  <SelectItem value="Vietnam">Vietnam</SelectItem>
                  <SelectItem value="Myanmar">Myanmar</SelectItem>
                  <SelectItem value="Cambodia">Cambodia</SelectItem>
                  <SelectItem value="Laos">Laos</SelectItem>
                  <SelectItem value="Brunei">Brunei</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                  <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                  <SelectItem value="Nepal">Nepal</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Passport-specific fields - only show when Passport No. is selected */}
            {formData.idType === "Passport No." && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Issued Country <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.issuedCountry}
                    onValueChange={(value) => handleSelectChange(value, "issuedCountry")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Issued Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Malaysia">Malaysia</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Thailand">Thailand</SelectItem>
                      <SelectItem value="Philippines">Philippines</SelectItem>
                      <SelectItem value="Vietnam">Vietnam</SelectItem>
                      <SelectItem value="Myanmar">Myanmar</SelectItem>
                      <SelectItem value="Cambodia">Cambodia</SelectItem>
                      <SelectItem value="Laos">Laos</SelectItem>
                      <SelectItem value="Brunei">Brunei</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="Pakistan">Pakistan</SelectItem>
                      <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                      <SelectItem value="Nepal">Nepal</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Issue Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.issueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.issueDate ? format(formData.issueDate, "PPP") : "Select issue date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.issueDate}
                        onSelect={(date) => handleDateChange(date, "issueDate")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Expiry Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.expiryDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Select expiry date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.expiryDate}
                        onSelect={(date) => handleDateChange(date, "expiryDate")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {/* Person Type field removed as requested */}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
              Save
            </Button>
          </div>
        </form>
      </Card>

      {/* Add Dependant Button - always available to click */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddDependentClick}
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          Add Family Member
        </Button>
        {addedDependents.length > 0 && (
          <span className="text-sm text-green-600 font-medium">
            {addedDependents.length} dependent{addedDependents.length > 1 ? "s" : ""} added
          </span>
        )}
      </div>

      {/* Dependents List */}
      {addedDependents.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Added Dependents</h3>
          <div className="space-y-3">
            {addedDependents.map((dependent, index) => (
              <div key={dependent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <div className="text-gray-900">{dependent.name}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">ID No:</span>
                      <div className="text-gray-900">{dependent.idNo}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Person ID:</span>
                      <div className="text-gray-900">{dependent.personId}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <div className="text-gray-900">{dependent.personType}</div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDependent(dependent.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Dependent Form Section */}
      {showDependentForm && (
        <Card className="p-6 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Add Family Member {addedDependents.length > 0 && `(${addedDependents.length + 1})`}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseDependentForm}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dependent-idNo" className="text-sm font-medium text-slate-700">
                  Family Member ID No. <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="idNo"
                  placeholder="Enter Family Member ID Number"
                  className="w-full"
                  value={dependentFormData.idNo}
                  onChange={handleDependentInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependent-name" className="text-sm font-medium text-slate-700">
                  Family Member Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter Family Member Name"
                  className="w-full"
                  value={dependentFormData.name}
                  onChange={handleDependentInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependent-personId" className="text-sm font-medium text-slate-700">
                  Family Member Person ID
                </Label>
                <Input
                  id="personId"
                  placeholder="Enter Family Member Person ID"
                  className="w-full bg-gray-50"
                  value={dependentFormData.personId}
                  onChange={handleDependentInputChange}
                  disabled={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependent-personType" className="text-sm font-medium text-slate-700">
                  Family Member Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={dependentFormData.personType}
                  onValueChange={(value) => handleDependentSelectChange(value, "personType")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Family Member Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Husband">Husband</SelectItem>
                    <SelectItem value="Wife">Wife</SelectItem>
                    <SelectItem value="Child">Child</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="In Law">In Law</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employee Name and Employee ID No. fields removed as requested */}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={handleCloseDependentForm}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveDependentOnly} className="bg-green-600 hover:bg-green-700">
                Save Family Member
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Alert Dialog for Existing Person */}
      <AlertDialog open={showExistingPersonAlert} onOpenChange={setShowExistingPersonAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Person Already Exists
            </AlertDialogTitle>
            <AlertDialogDescription>
              This person already exists in the system. Would you like to continue adding this record?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelExistingPerson}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinueWithExistingPerson} className="bg-sky-600 hover:bg-sky-700">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for Duplicate IC No. */}
      <AlertDialog open={showDuplicateIcAlert} onOpenChange={setShowDuplicateIcAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Duplicate IC Number Found
            </AlertDialogTitle>
            <AlertDialogDescription>
              This IC number already exists in the system. Would you like to continue adding this record with the same
              IC number?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDuplicateIc}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinueWithDuplicateIc} className="bg-sky-600 hover:bg-sky-700">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Dialog for Possible Matches */}
      <AlertDialog open={showPossibleMatches} onOpenChange={setShowPossibleMatches}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Possible Match Found
            </AlertDialogTitle>
            <AlertDialogDescription>
              Found {possibleMatches.length} existing record(s) with matching Name + DOB + Nationality. Please verify if
              this is the same person before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {possibleMatches.map((match) => (
                <div key={match.id} className="bg-gray-50 rounded border p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <div className="text-gray-900">{match.name}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Person ID:</span>
                      <div className="text-gray-900">{match.personId}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">DOB:</span>
                      <div className="text-gray-900">
                        {match.dateOfBirth ? format(new Date(match.dateOfBirth), "dd/MM/yyyy") : "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Nationality:</span>
                      <div className="text-gray-900">{match.nationality || "N/A"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPossibleMatches(false)} className="bg-sky-600 hover:bg-sky-700">
              Continue Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
