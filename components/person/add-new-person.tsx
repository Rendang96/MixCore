"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trash2, CalendarIcon, PlusCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

import { getPersons, addPerson, initializeSampleData, addPersonRelationship } from "@/lib/person/person-storage"
import type { Person, Address } from "@/lib/person/person-types"

interface DependentRecord extends Person {
  relationshipToPrimary: string // e.g., "Spouse", "Child"
}

const ALLERGY_OPTIONS = ["Food", "Medicine", "Others"]

export function AddNewPerson({ onBack }: { onBack: () => void }) {
  const initialAddress: Address = { street: "", postcode: "", city: "", state: "", country: "", type: "Home" }

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
    // New fields
    email: "",
    phoneNo: "",
    salutation: "",
    addresses: [initialAddress], // Updated to new Address structure
    // Health Info fields
    disabilityStatus: "",
    specifyDisability: "",
    allergiesType: [] as string[], // Initialize as empty array for multi-select
    allergiesDetails: {} as Record<string, string>,
    smoker: false,
    alcoholConsumption: false,
  })
  const [showExistingPersonAlert, setShowExistingPersonAlert] = useState(false)
  const [existingPersonData, setExistingPersonData] = useState<typeof formData | null>(null)
  const [showDuplicateIcAlert, setShowDuplicateIcAlert] = useState(false)
  const [duplicateIcValue, setDuplicateIcValue] = useState("")
  const [duplicatePersonData, setDuplicatePersonData] = useState<Person | null>(null)
  const [showPossibleMatchesAlert, setShowPossibleMatchesAlert] = useState(false)

  const [showDependentForm, setShowDependentForm] = useState(false)
  const [dependentFormData, setDependentFormData] = useState({
    name: "",
    personId: "",
    idNo: "",
    personType: "", // This will be the relationship type (e.g., "Spouse", "Child")
    employeeName: "",
    employeeIdNo: "",
    idType: "",
    dateOfBirth: undefined as Date | undefined,
    gender: "",
    nationality: "",
    issuedCountry: "",
    issueDate: undefined as Date | undefined,
    expiryDate: undefined as Date | undefined,
    email: "",
    phoneNo: "",
    salutation: "",
    addresses: [initialAddress], // Updated to new Address structure
    // Health Info fields
    disabilityStatus: "",
    specifyDisability: "",
    allergiesType: [] as string[],
    allergiesDetails: {} as Record<string, string>,
    smoker: false,
    alcoholConsumption: false,
  })
  const [addedDependents, setAddedDependents] = useState<DependentRecord[]>([])
  const [dependentDuplicateIcAlert, setDependentDuplicateIcAlert] = useState(false)
  const [dependentDuplicatePersonData, setDependentDuplicatePersonData] = useState<Person | null>(null)

  const [possibleMatches, setPossibleMatches] = useState<Person[]>([])
  const [showPossibleMatches, setShowPossibleMatches] = useState(false)
  const [sameAsPrimary, setSameAsPrimary] = useState(false)

  // Initialize sample data when component mounts
  useEffect(() => {
    initializeSampleData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    if (id === "idNo" && value.trim() !== "") {
      const persons = getPersons()
      const duplicatePerson = persons.find((person) => person.idNo.toLowerCase() === value.toLowerCase())

      if (duplicatePerson) {
        setDuplicateIcValue(value)
        setDuplicatePersonData(duplicatePerson)
        setShowDuplicateIcAlert(true)
        return
      } else {
        setShowDuplicateIcAlert(false)
        setDuplicatePersonData(null)
      }

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
      const uniqueNumber = maxPerNumber + 1 + Math.floor(timestamp % 1000)
      const newPersonId = `PER-2025-${uniqueNumber.toString().padStart(3, "0")}`
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        personId: newPersonId,
      }))
    } else if (id === "idNo" && value.trim() === "") {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        personId: "",
      }))
      setShowDuplicateIcAlert(false)
    }

    if (id === "idNo" && formData.idType === "IC No." && value.trim() !== "") {
      checkForIcMatches(value)
    } else if (id === "idNo" && formData.idType === "Passport No.") {
      setShowPossibleMatchesAlert(false)
      setPossibleMatches([])
    }

    if (id === "name" && formData.idType === "Passport No.") {
      setTimeout(() => {
        const updatedFormData = { ...formData, [id]: value }
        checkForPossibleMatchesWithData(updatedFormData)
      }, 100)
    }
  }

  const handleCheckboxChange = (checked: boolean, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const handleAllergiesTypeChange = (option: string, checked: boolean) => {
    setFormData((prev) => {
      const currentTypes = prev.allergiesType || []
      const newAllergiesDetails = { ...prev.allergiesDetails }

      if (checked) {
        return { ...prev, allergiesType: [...currentTypes, option] }
      } else {
        delete newAllergiesDetails[option]
        return {
          ...prev,
          allergiesType: currentTypes.filter((item) => item !== option),
          allergiesDetails: newAllergiesDetails,
        }
      }
    })
  }

  const handleAllergyDetailChange = (type: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      allergiesDetails: {
        ...prev.allergiesDetails,
        [type]: value,
      },
    }))
  }

  const checkForPossibleMatches = () => {
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
      const nameMatch = person.name.toLowerCase() === formData.name.toLowerCase()

      let dobMatch = false
      if (person.dateOfBirth && formData.dateOfBirth) {
        const personDOB = new Date(person.dateOfBirth)
        const formDOB = formData.dateOfBirth
        dobMatch = personDOB.toDateString() === formDOB.toDateString()
      }

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

    if (field === "disabilityStatus" && value === "No") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        specifyDisability: "",
      }))
    }

    if (field === "idType") {
      if (value === "IC No." && formData.idNo.trim() !== "") {
        checkForIcMatches(formData.idNo)
      } else if (value === "Passport No.") {
        setShowPossibleMatchesAlert(false)
        setPossibleMatches([])
        setTimeout(() => {
          const updatedFormData = { ...formData, [field]: value }
          checkForPossibleMatchesWithData(updatedFormData)
        }, 100)
      } else {
        setShowPossibleMatchesAlert(false)
      }
    }

    if (field === "idType" && formData.idNo.trim() !== "") {
      const persons = getPersons()
      const duplicatePerson = persons.find((person) => person.idNo.toLowerCase() === formData.idNo.toLowerCase())

      if (duplicatePerson) {
        setDuplicateIcValue(formData.idNo)
        setDuplicatePersonData(duplicatePerson)
        setShowDuplicateIcAlert(true)
        return
      }
    }

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

    if (id === "idNo" && value.trim() !== "") {
      const persons = getPersons()
      const duplicatePerson = persons.find((person) => person.idNo.toLowerCase() === value.toLowerCase())

      if (duplicatePerson) {
        setDependentDuplicatePersonData(duplicatePerson)
        setDependentDuplicateIcAlert(true)
        return
      }

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

    if (id === "name" && dependentFormData.idType === "Passport No.") {
      setTimeout(() => {
        const updatedFormData = { ...dependentFormData, [id]: value }
        checkForDependentPossibleMatches(updatedFormData)
      }, 100)
    }
  }

  const handleDependentCheckboxChange = (checked: boolean, field: string) => {
    setDependentFormData((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const handleDependentAllergiesTypeChange = (option: string, checked: boolean) => {
    setDependentFormData((prev) => {
      const currentTypes = prev.allergiesType || []
      const newAllergiesDetails = { ...prev.allergiesDetails }

      if (checked) {
        return { ...prev, allergiesType: [...currentTypes, option] }
      } else {
        delete newAllergiesDetails[option]
        return {
          ...prev,
          allergiesType: currentTypes.filter((item) => item !== option),
          allergiesDetails: newAllergiesDetails,
        }
      }
    })
  }

  const handleDependentAllergyDetailChange = (type: string, value: string) => {
    setDependentFormData((prev) => ({
      ...prev,
      allergiesDetails: {
        ...prev.allergiesDetails,
        [type]: value,
      },
    }))
  }

  const handleDependentSelectChange = (value: string, field: string) => {
    setDependentFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (field === "disabilityStatus" && value === "No") {
      setDependentFormData((prev) => ({
        ...prev,
        [field]: value,
        specifyDisability: "",
      }))
    }

    if (field === "idType" && value === "IC No.") {
      setDependentFormData((prev) => ({
        ...prev,
        [field]: value,
        issuedCountry: "",
        issueDate: undefined,
        expiryDate: undefined,
      }))
    }

    if (field === "idType" && dependentFormData.idNo.trim() !== "") {
      const persons = getPersons()
      const duplicatePerson = persons.find(
        (person) => person.idNo.toLowerCase() === dependentFormData.idNo.toLowerCase(),
      )

      if (duplicatePerson) {
        setDependentDuplicatePersonData(duplicatePerson)
        setDependentDuplicateIcAlert(true)
        return
      }
    }

    if (field === "nationality" && dependentFormData.idType === "Passport No.") {
      setTimeout(() => {
        const updatedFormData = { ...dependentFormData, [field]: value }
        checkForDependentPossibleMatches(updatedFormData)
      }, 100)
    }
  }

  const handleDependentDateChange = (date: Date | undefined, field: string) => {
    setDependentFormData((prev) => ({
      ...prev,
      [field]: date,
    }))

    if (field === "dateOfBirth" && dependentFormData.idType === "Passport No.") {
      setTimeout(() => {
        const updatedFormData = { ...dependentFormData, [field]: date }
        checkForDependentPossibleMatches(updatedFormData)
      }, 100)
    }
  }

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, initialAddress],
    }))
  }

  const handleRemoveAddress = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }))
  }

  const handleAddressChange = (index: number, field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr)),
    }))
  }

  const handleDependentAddAddress = () => {
    setDependentFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, initialAddress],
    }))
  }

  const handleDependentRemoveAddress = (index: number) => {
    setDependentFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }))
  }

  const handleDependentAddressChange = (index: number, field: keyof Address, value: string) => {
    setDependentFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr)),
    }))
  }

  const handleAddDependentToList = () => {
    if (
      !dependentFormData.idNo ||
      !dependentFormData.name ||
      !dependentFormData.dateOfBirth ||
      !dependentFormData.gender ||
      !dependentFormData.nationality ||
      !dependentFormData.personType
    ) {
      alert("Please fill in all required fields for the family member.")
      return
    }

    if (
      dependentFormData.idType === "Passport No." &&
      (!dependentFormData.issuedCountry || !dependentFormData.issueDate || !dependentFormData.expiryDate)
    ) {
      alert("Please fill in all required passport information fields for the family member.")
      return
    }

    const newDependent: DependentRecord = {
      ...dependentFormData,
      id: `person-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      personId: dependentFormData.personId || `PER-2025-${Date.now() % 10000}`,
      status: "Active",
      relationshipToPrimary: dependentFormData.personType,
      dateOfBirth: dependentFormData.dateOfBirth ? dependentFormData.dateOfBirth.toISOString() : undefined,
      issueDate: dependentFormData.issueDate ? dependentFormData.issueDate.toISOString() : undefined,
      expiryDate: dependentFormData.expiryDate ? dependentFormData.expiryDate.toISOString() : undefined,
      allergies: Object.entries(dependentFormData.allergiesDetails)
        .filter(([, value]) => value.trim() !== "")
        .map(([type, value]) => `${type}: ${value}`)
        .join("; "),
    }

    setAddedDependents((prev) => [...prev, newDependent])
    setDependentFormData({
      name: "",
      personId: "",
      idNo: "",
      personType: "",
      employeeName: "",
      employeeIdNo: "",
      idType: "",
      dateOfBirth: undefined,
      gender: "",
      nationality: "",
      issuedCountry: "",
      issueDate: undefined,
      expiryDate: undefined,
      email: "",
      phoneNo: "",
      salutation: "",
      addresses: [initialAddress],
      disabilityStatus: "",
      specifyDisability: "",
      allergiesType: [],
      allergiesDetails: {},
      smoker: false,
      alcoholConsumption: false,
    })
    setShowDependentForm(false)
    setDependentDuplicateIcAlert(false)
  }

  const handleRemoveDependent = (idToRemove: string) => {
    setAddedDependents((prev) => prev.filter((dep) => dep.id !== idToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.idNo || !formData.name || !formData.dateOfBirth || !formData.gender || !formData.nationality) {
      alert("Please fill in all required fields for the primary person.")
      return
    }

    if (
      formData.idType === "Passport No." &&
      (!formData.issuedCountry || !formData.issueDate || !formData.expiryDate)
    ) {
      alert("Please fill in all required passport information fields for the primary person.")
      return
    }

    const newPrimaryPerson: Person = {
      ...formData,
      id: `person-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      personId: formData.personId || `PER-2025-${Date.now() % 10000}`,
      status: "Active",
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : undefined,
      issueDate: formData.issueDate ? formData.issueDate.toISOString() : undefined,
      expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : undefined,
      allergies: Object.entries(formData.allergiesDetails)
        .filter(([, value]) => value.trim() !== "")
        .map(([type, value]) => `${type}: ${value}`)
        .join("; "),
    }

    const savedPrimaryPerson = addPerson(newPrimaryPerson)

    addedDependents.forEach((dependent) => {
      const savedDependent = addPerson(dependent)
      addPersonRelationship({
        id: `rel-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        personId1: savedPrimaryPerson.id,
        personId2: savedDependent.id,
        relationshipType: dependent.relationshipToPrimary,
        relationshipDirection: "directional",
        status: "Active",
      })
    })

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
      email: "",
      phoneNo: "",
      salutation: "",
      addresses: [initialAddress],
      disabilityStatus: "",
      specifyDisability: "",
      allergiesType: [],
      allergiesDetails: {},
      smoker: false,
      alcoholConsumption: false,
    })
    setAddedDependents([])
    setShowDependentForm(false)

    setPossibleMatches([])
    setShowPossibleMatches(false)

    onBack()
  }

  const checkForPossibleMatchesWithData = (data: typeof formData) => {
    if (data.idType !== "Passport No." || !data.name || !data.dateOfBirth || !data.nationality) {
      setPossibleMatches([])
      setShowPossibleMatches(false)
      setShowPossibleMatchesAlert(false)
      return
    }

    const persons = getPersons()
    console.log("Checking for passport matches with:", {
      name: data.name,
      dob: data.dateOfBirth,
      nationality: data.nationality,
      totalPersons: persons.length,
    })

    const matches = persons.filter((person) => {
      const nameMatch = person.name.toLowerCase() === data.name.toLowerCase()

      let dobMatch = false
      if (person.dateOfBirth && data.dateOfBirth) {
        const personDOB = new Date(person.dateOfBirth)
        const formDOB = data.dateOfBirth
        dobMatch = personDOB.toDateString() === formDOB.toDateString()
      }

      const nationalityMatch = person.nationality?.toLowerCase() === data.nationality.toLowerCase()

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

    console.log("Found passport matches:", matches.length)

    if (matches.length > 0) {
      setPossibleMatches(matches)
      setShowPossibleMatches(true)
      setShowPossibleMatchesAlert(true)
    } else {
      setPossibleMatches([])
      setShowPossibleMatches(false)
      setShowPossibleMatchesAlert(false)
    }
  }

  const checkForDependentPossibleMatches = (data: typeof dependentFormData) => {
    if (data.idType !== "Passport No." || !data.name || !data.dateOfBirth || !data.nationality) {
      return
    }

    const persons = getPersons()
    const matches = persons.filter((person) => {
      const nameMatch = person.name.toLowerCase() === data.name.toLowerCase()

      let dobMatch = false
      if (person.dateOfBirth && data.dateOfBirth) {
        const personDOB = new Date(person.dateOfBirth)
        const formDOB = data.dateOfBirth
        dobMatch = personDOB.toDateString() === formDOB.toDateString()
      }

      const nationalityMatch = person.nationality?.toLowerCase() === data.nationality.toLowerCase()

      return nameMatch && dobMatch && nationalityMatch
    })

    if (matches.length > 0) {
      console.warn("Possible duplicate dependent found:", matches)
    }
  }

  const checkForIcMatches = (idNo: string) => {
    if (!idNo.trim()) {
      setShowPossibleMatchesAlert(false)
      return
    }

    const persons = getPersons()
    const icMatches = persons.filter(
      (person) => person.idNo.toLowerCase() === idNo.toLowerCase() && person.idType === "IC No.",
    )

    if (icMatches.length > 0) {
      setPossibleMatches(icMatches)
      setShowPossibleMatchesAlert(true)
    } else {
      setShowPossibleMatchesAlert(false)
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
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Primary Person Information</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Salutation</Label>
              <Select value={formData.salutation} onValueChange={(value) => handleSelectChange(value, "salutation")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Salutation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Miss">Miss</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                  <SelectItem value="Dato'">Dato'</SelectItem>
                  <SelectItem value="Datuk">Datuk</SelectItem>
                  <SelectItem value="Tan Sri">Tan Sri</SelectItem>
                  <SelectItem value="Tun">Tun</SelectItem>
                  <SelectItem value="Master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              {showDuplicateIcAlert && (
                <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 mt-2">
                  <AlertDescription>
                    Duplicate ID No. found: {duplicateIcValue}. Person: {duplicatePersonData?.name} (
                    {duplicatePersonData?.personId}).
                  </AlertDescription>
                </Alert>
              )}
              {showPossibleMatchesAlert && possibleMatches.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50 text-orange-800 mt-2">
                  <AlertDescription>
                    <div className="font-semibold mb-2">⚠️ Possible Match Found!</div>
                    <div className="text-sm space-y-1">
                      {possibleMatches.map((match, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                          <div>
                            <span className="font-medium">{match.name}</span>
                            <span className="text-gray-600 ml-2">({match.personId})</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {match.idType}: {match.idNo}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs mt-2 text-orange-700">
                      Please verify this is not a duplicate before proceeding.
                    </div>
                  </AlertDescription>
                </Alert>
              )}
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

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email Address"
                className="w-full"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNo" className="text-sm font-medium text-slate-700">
                Phone No.
              </Label>
              <Input
                id="phoneNo"
                placeholder="Enter Phone Number"
                className="w-full"
                value={formData.phoneNo}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {formData.idType === "Passport No." && (
            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Passport Information</h3>
                <div className="grid gap-6 md:grid-cols-3">
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
                </div>
              </div>
            </div>
          )}

          {/* Address Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Addresses</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAddress}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                + Add Address
              </Button>
            </div>
            {formData.addresses.map((addressItem, index) => (
              <Card key={index} className="p-4 border-dashed border-gray-200 bg-gray-50">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`address-street-${index}`} className="text-sm font-medium text-slate-700">
                      Street Address
                    </Label>
                    <Input
                      id={`address-street-${index}`}
                      placeholder="Enter Street Address"
                      value={addressItem.street}
                      onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`address-postcode-${index}`} className="text-sm font-medium text-slate-700">
                      Postcode
                    </Label>
                    <Input
                      id={`address-postcode-${index}`}
                      placeholder="Enter Postcode"
                      value={addressItem.postcode}
                      onChange={(e) => handleAddressChange(index, "postcode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`address-city-${index}`} className="text-sm font-medium text-slate-700">
                      City
                    </Label>
                    <Input
                      id={`address-city-${index}`}
                      placeholder="Enter City"
                      value={addressItem.city}
                      onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`address-state-${index}`} className="text-sm font-medium text-slate-700">
                      State
                    </Label>
                    <Input
                      id={`address-state-${index}`}
                      placeholder="Enter State"
                      value={addressItem.state}
                      onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Country</Label>
                    <Select
                      value={addressItem.country}
                      onValueChange={(value) => handleAddressChange(index, "country", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Country" />
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
                    <Label className="text-sm font-medium text-slate-700">Address Type</Label>
                    <Select
                      value={addressItem.type}
                      onValueChange={(value) => handleAddressChange(index, "type", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Work">Work</SelectItem>
                        <SelectItem value="Mailing">Mailing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.addresses.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAddress(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove Address
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Health Info Section */}
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold text-slate-800">Health Info</h3>
            <Card className="p-6 border-dashed border-gray-200 bg-gray-50">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Disability Status</Label>
                  <Select
                    value={formData.disabilityStatus}
                    onValueChange={(value) => handleSelectChange(value, "disabilityStatus")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Disability Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.disabilityStatus === "Yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="specifyDisability" className="text-sm font-medium text-slate-700">
                      Specify Disability
                    </Label>
                    <Input
                      id="specifyDisability"
                      placeholder="Enter Disability Details"
                      className="w-full"
                      value={formData.specifyDisability}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Allergies Type</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {formData.allergiesType.length > 0
                          ? formData.allergiesType.join(", ")
                          : "Select allergy types"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex flex-col p-2">
                        {ALLERGY_OPTIONS.map((option) => (
                          <div key={option} className="flex items-center space-x-2 p-1">
                            <Checkbox
                              id={`allergy-${option}`}
                              checked={formData.allergiesType.includes(option)}
                              onCheckedChange={(checked) => handleAllergiesTypeChange(option, checked as boolean)}
                            />
                            <label
                              htmlFor={`allergy-${option}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {formData.allergiesType.length > 0 && (
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Specify Allergies</Label>
                    {formData.allergiesType.map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Label htmlFor={`allergy-detail-${type}`} className="text-sm font-medium text-slate-600 w-24">
                          {type}:
                        </Label>
                        <Input
                          id={`allergy-detail-${type}`}
                          placeholder={`Specify ${type} allergy`}
                          className="flex-1"
                          value={formData.allergiesDetails[type] || ""}
                          onChange={(e) => handleAllergyDetailChange(type, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smoker"
                    checked={formData.smoker}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "smoker")}
                  />
                  <Label htmlFor="smoker" className="text-sm font-medium text-slate-700">
                    Smoker
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alcoholConsumption"
                    checked={formData.alcoholConsumption}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "alcoholConsumption")}
                  />
                  <Label htmlFor="alcoholConsumption" className="text-sm font-medium text-slate-700">
                    Alcohol Consumption
                  </Label>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Family Members</h3>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => setShowDependentForm(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Add Family Member
              </Button>
            </div>

            {showDependentForm && (
              <Card className="p-6 border-2 border-dashed border-gray-300 bg-gray-50">
                <h4 className="text-lg font-semibold text-slate-700 mb-4">Add New Family Member</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Salutation</Label>
                    <Select
                      value={dependentFormData.salutation}
                      onValueChange={(value) => handleDependentSelectChange(value, "salutation")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Salutation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Dato'">Dato'</SelectItem>
                        <SelectItem value="Datuk">Datuk</SelectItem>
                        <SelectItem value="Tan Sri">Tan Sri</SelectItem>
                        <SelectItem value="Tun">Tun</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Relationship to Primary <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={dependentFormData.personType}
                      onValueChange={(value) => handleDependentSelectChange(value, "personType")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Other Dependent">Other Dependent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      ID Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={dependentFormData.idType}
                      onValueChange={(value) => handleDependentSelectChange(value, "idType")}
                    >
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
                    <Label htmlFor="dependentIdNo" className="text-sm font-medium text-slate-700">
                      ID No. <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="idNo"
                      placeholder="Enter ID Number"
                      className="w-full"
                      value={dependentFormData.idNo}
                      onChange={handleDependentInputChange}
                      required
                    />
                    {dependentDuplicateIcAlert && (
                      <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 mt-2">
                        <AlertDescription>
                          Duplicate ID No. found: {dependentFormData.idNo}. Person: {dependentDuplicatePersonData?.name}{" "}
                          ({dependentDuplicatePersonData?.personId}).
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dependentName" className="text-sm font-medium text-slate-700">
                      Name <span className="text-red-500">*</span>
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
                    <Label htmlFor="dependentPersonId" className="text-sm font-medium text-slate-700">
                      Person ID
                    </Label>
                    <Input
                      id="personId"
                      placeholder="Auto-generated"
                      className="w-full bg-gray-50"
                      value={dependentFormData.personId}
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
                            !dependentFormData.dateOfBirth && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dependentFormData.dateOfBirth
                            ? format(dependentFormData.dateOfBirth, "PPP")
                            : "Select date of birth"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dependentFormData.dateOfBirth}
                          onSelect={(date) => handleDependentDateChange(date, "dateOfBirth")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={dependentFormData.gender}
                      onValueChange={(value) => handleDependentSelectChange(value, "gender")}
                    >
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
                    <Select
                      value={dependentFormData.nationality}
                      onValueChange={(value) => handleDependentSelectChange(value, "nationality")}
                    >
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

                  <div className="space-y-2">
                    <Label htmlFor="dependentEmail" className="text-sm font-medium text-slate-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email Address"
                      className="w-full"
                      value={dependentFormData.email}
                      onChange={handleDependentInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dependentPhoneNo" className="text-sm font-medium text-slate-700">
                      Phone No.
                    </Label>
                    <Input
                      id="phoneNo"
                      placeholder="Enter Phone Number"
                      className="w-full"
                      value={dependentFormData.phoneNo}
                      onChange={handleDependentInputChange}
                    />
                  </div>

                  {/* Dependent Health Info Section */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-lg font-semibold text-slate-700">Health Info</h4>
                    <Card className="p-6 border-dashed border-gray-200 bg-gray-50">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Disability Status</Label>
                          <Select
                            value={dependentFormData.disabilityStatus}
                            onValueChange={(value) => handleDependentSelectChange(value, "disabilityStatus")}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Disability Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {dependentFormData.disabilityStatus === "Yes" && (
                          <div className="space-y-2">
                            <Label htmlFor="dependentSpecifyDisability" className="text-sm font-medium text-slate-700">
                              Specify Disability
                            </Label>
                            <Input
                              id="specifyDisability"
                              placeholder="Enter Disability Details"
                              className="w-full"
                              value={dependentFormData.specifyDisability}
                              onChange={handleDependentInputChange}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Allergies Type</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                {dependentFormData.allergiesType.length > 0
                                  ? dependentFormData.allergiesType.join(", ")
                                  : "Select allergy types"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <div className="flex flex-col p-2">
                                {ALLERGY_OPTIONS.map((option) => (
                                  <div key={option} className="flex items-center space-x-2 p-1">
                                    <Checkbox
                                      id={`dependent-allergy-${option}`}
                                      checked={dependentFormData.allergiesType.includes(option)}
                                      onCheckedChange={(checked) =>
                                        handleDependentAllergiesTypeChange(option, checked as boolean)
                                      }
                                    />
                                    <label
                                      htmlFor={`dependent-allergy-${option}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        {dependentFormData.allergiesType.length > 0 && (
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Specify Allergies</Label>
                            {dependentFormData.allergiesType.map((type) => (
                              <div key={type} className="flex items-center gap-2">
                                <Label htmlFor={`dependent-allergy-detail-${type}`} className="text-sm font-medium text-slate-600 w-24">
                                  {type}:
                                </Label>
                                <Input
                                  id={`dependent-allergy-detail-${type}`}
                                  placeholder={`Specify ${type} allergy`}
                                  className="flex-1"
                                  value={dependentFormData.allergiesDetails[type] || ""}
                                  onChange={(e) => handleDependentAllergyDetailChange(type, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dependentSmoker"
                            checked={dependentFormData.smoker}
                            onCheckedChange={(checked) => handleDependentCheckboxChange(checked as boolean, "smoker")}
                          />
                          <Label htmlFor="dependentSmoker" className="text-sm font-medium text-slate-700">
                            Smoker
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dependentAlcoholConsumption"
                            checked={dependentFormData.alcoholConsumption}
                            onCheckedChange={(checked) =>
                              handleDependentCheckboxChange(checked as boolean, "alcoholConsumption")
                            }
                          />
                          <Label htmlFor="dependentAlcoholConsumption" className="text-sm font-medium text-slate-700">
                            Alcohol Consumption
                          </Label>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {dependentFormData.idType === "Passport No." && (
                    <div className="mt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Passport Information</h3>
                        <div className="grid gap-6 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                              Issued Country <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={dependentFormData.issuedCountry}
                              onValueChange={(value) => handleDependentSelectChange(value, "issuedCountry")}
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
                                    !dependentFormData.issueDate && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dependentFormData.issueDate
                                    ? format(dependentFormData.issueDate, "PPP")
                                    : "Select issue date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dependentFormData.issueDate}
                                  onSelect={(date) => handleDependentDateChange(date, "issueDate")}
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
                                    !dependentFormData.expiryDate && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dependentFormData.expiryDate
                                    ? format(dependentFormData.expiryDate, "PPP")
                                    : "Select expiry date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dependentFormData.expiryDate}
                                  onSelect={(date) => handleDependentDateChange(date, "expiryDate")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowDependentForm(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleAddDependentToList}>
                      Add to List
                    </Button>
                  </div>
                </Card>
              )}

            {addedDependents.length > 0 && (
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-slate-700 mb-4">Added Family Members</h4>
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Relationship
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID No.
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Person ID
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {addedDependents.map((dependent) => (
                          <tr key={dependent.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {dependent.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {dependent.relationshipToPrimary}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{dependent.idNo}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{dependent.personId}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDependent(dependent.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                Save All
              </Button>
            </div>
          </form>
        </Card>
      </div>
  )
}
