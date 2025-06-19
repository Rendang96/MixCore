"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Info } from "lucide-react"
import { ChevronDown, ChevronRight, Layers, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getPersons, getPersonRelationships, updatePersonProfile } from "@/lib/person/person-storage"
import {
  getPersonMembershipsFromOnboarding,
  getPersonEmploymentFromOnboarding,
  getPersonFamilyMembersFromOnboarding,
  generateOnboardingMembershipNo,
  generateFamilyMemberMembershipNo,
  initializeOnboardingSampleData,
  getSpecialTagByPlanCode,
  saveUpdatedMembershipOrder,
  type OnboardingMembership,
  type OnboardingEmploymentInfo,
  type OnboardingFamilyMember,
} from "@/lib/integration/person-onboarding-integration"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Edit, Save, X, CheckCircle, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

// Add service type mapping to convert full names to codes
const serviceTypeMapping: { [key: string]: string } = {
  Outpatient: "GP",
  Dental: "DT",
  Optical: "OC",
  Inpatient: "HP",
  Specialist: "SP",
  Maternity: "MT",
}

const ALLERGY_OPTIONS = ["Food", "Medicine", "Others"]

interface Person {
  id: string
  name: string
  personId: string
  membershipNo?: string // Made optional as not all persons might have it
  idNo: string
  companyName?: string // Made optional
  companyCode?: string // Made optional
  policyNo?: string // Made optional
  status: string
  groupId?: string
  groupName?: string
  dateCreated: string
  dateModified: string
  createdBy: string
  modifiedBy: string
  dateOfBirth?: Date | string
  gender?: string
  nationality?: string
  idType?: string
  issuedCountry?: string
  issueDate?: Date | string
  expiryDate?: Date | string
  addresses?: { streetAddress: string; postcode: string; city: string; state: string; country: string; type: string }[]
  email?: string
  phoneNo?: string
  salutation?: string
  disabilityStatus?: string
  specifyDisability?: string
  allergiesType?: string[] // e.g., ["Food", "Medicine"]
  allergiesDetails?: Record<string, string> // e.g., { "Food": "Peanuts", "Medicine": "Penicillin" }
  smoker?: boolean
  alcoholConsumption?: boolean
}

interface FamilyMember {
  name: string
  idNo: string
  personId: string
  relationship: string
  status: string
}

interface VisitRecord {
  date: string
  provider: string
  serviceType: string
  amount: string
  status: string
}

interface UtilizationRecord {
  serviceType: string
  utilized: string
  limit: string
  remaining: string
}

interface JourneyRecord {
  date: string
  event: string
  description: string
}

interface BankInfo {
  bankName: string
  accountNumber: string
  accountHolder: string
  branchCode: string
}

interface PersonDetailsProps {
  person: Person
  onBack: () => void
  onNavigateToFamilyMember?: (personId: string) => void
  onPersonUpdate?: (updatedPerson: Person) => void
}

export function PersonDetails({ person, onBack, onNavigateToFamilyMember, onPersonUpdate }: PersonDetailsProps) {
  const [activeTab, setActiveTab] = useState("membership")
  const [activePersonTab, setActivePersonTab] = useState("personInfo")
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>("")
  const [orderedMembershipList, setOrderedMembershipList] = useState<OnboardingMembership[]>([])
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [saveOrderSuccess, setSaveOrderSuccess] = useState(false)
  const [saveOrderError, setSaveOrderError] = useState<string | null>(null)
  const [selectedMembership, setSelectedMembership] = useState<OnboardingMembership | null>(null)

  // Define priority levels
  const PRIORITY_LEVELS = [
    "Primary",
    "Secondary",
    "Tertiary",
    "Quaternary",
    "Quinary",
    "Senary",
    "Septenary",
    "Octonary",
    "Nonary",
    "Decenary",
  ]
  // Add new state for controlling the view within the tab
  const [showMultiLevelView, setShowMultiLevelView] = useState(false)
  const [viewMode, setViewMode] = useState<"unified" | "separated">("unified")
  const [showFlatLimitsExpanded, setShowFlatLimitsExpanded] = useState(true)
  const [limitStructure, setLimitStructure] = useState([
    // Nested limit example
    {
      id: "nested-1",
      name: "Combined Medical Limit",
      serviceTypes: ["GP", "SP", "OC", "DT"],
      limit: "RM 10,000.00",
      utilized: "RM 1,150.00",
      remaining: "RM 8,850.00",
      percentage: 11.5,
      limitType: "nested",
      description: "Primary limit covering all medical services with nested sub-limits",
      expanded: true,
      level: 0,
      children: [
        {
          id: "nested-1-1",
          name: "Optical & Dental Limit",
          serviceTypes: ["OC", "DT"],
          limit: "RM 1,800.00",
          utilized: "RM 220.00",
          remaining: "RM 1,580.00",
          percentage: 12.2,
          limitType: "nested",
          description: "Sub-limit for optical and dental services",
          expanded: true,
          level: 1,
          children: [
            {
              id: "nested-1-1-1",
              name: "Optical Specific Limit",
              serviceTypes: ["OC"],
              limit: "RM 800.00",
              utilized: "RM 0.00",
              remaining: "RM 800.00",
              percentage: 0,
              limitType: "nested",
              description: "Specific limit for optical services only",
              level: 2,
            },
          ],
        },
      ],
    },
    // Flat limits examples
    {
      id: "flat-1",
      name: "Maternity Benefit",
      serviceTypes: ["MT"],
      limit: "RM 3,000.00",
      utilized: "RM 0.00",
      remaining: "RM 3,000.00",
      percentage: 0,
      limitType: "flat",
      description: "Standalone maternity coverage limit",
    },
    {
      id: "flat-2",
      name: "Emergency Services",
      serviceTypes: ["EM"],
      limit: "RM 5,000.00",
      utilized: "RM 750.00",
      remaining: "RM 4,250.00",
      percentage: 15,
      limitType: "flat",
      description: "Emergency medical services coverage",
    },
  ])

  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [currentPerson, setCurrentPerson] = useState(person)
  const [editFormData, setEditFormData] = useState({
    name: person.name,
    salutation: person.salutation || "", // Use person.salutation directly, default to empty string
    gender: person.gender || "", // Use person.gender directly, default to empty string
    email: person.email || "", // Use person.email directly, default to empty string
    phoneNo: person.phoneNo || "", // Use person.phoneNo directly, default to empty string
    idType: person.idType || "",
    dateOfBirth: person.dateOfBirth ? new Date(person.dateOfBirth) : undefined,
    nationality: person.nationality || "", // Use person.nationality directly, default to empty string
    idNo: person.idNo,
    issuedCountry: person.issuedCountry || "",
    issueDate: person.issueDate ? new Date(person.issueDate) : undefined,
    expiryDate: person.expiryDate ? new Date(person.expiryDate) : undefined,
    disabilityStatus: person.disabilityStatus || "No",
    specifyDisability: person.specifyDisability || "",
    allergiesType: person.allergiesType || ([] as string[]),
    allergiesDetails: person.allergiesDetails || ({} as Record<string, string>),
    smoker: person.smoker || false,
    alcoholConsumption: person.alcoholConsumption || false,
    status: person.status,
    addresses: person.addresses || [], // Use person.addresses directly, default to empty array
  })

  const [isMembershipEditMode, setIsMembershipEditMode] = useState(false)
  const [isMembershipSaving, setIsMembershipSaving] = useState(false)
  const [membershipSaveSuccess, setMembershipSaveSuccess] = useState(false)
  const [membershipSaveError, setMembershipSaveError] = useState<string | null>(null)
  const [editMembershipData, setEditMembershipData] = useState({
    planName: "",
    planCode: "",
    effectiveDate: "",
    expiryDate: "",
    membershipNo: "",
    company: "",
    personType: "",
    policyNo: "",
    membershipStatus: "Active",
    limitType: "Annual",
    limitAmount: "10,000",
    priority: "",
  })

  // Get employment data from onboarding integration
  const employmentInfo: OnboardingEmploymentInfo | null = getPersonEmploymentFromOnboarding(currentPerson.personId)

  // Get family members from onboarding integration
  const onboardingFamilyMembers: OnboardingFamilyMember[] = getPersonFamilyMembersFromOnboarding(currentPerson.personId)

  // Initialize onboarding sample data on component mount
  useEffect(() => {
    initializeOnboardingSampleData()
  }, [])

  // Initialize orderedMembershipList and selectedMembership when the current person changes
  useEffect(() => {
    const initialList = getPersonMembershipsFromOnboarding(currentPerson.personId)
    // Assign priorities based on initial order and ensure specialTag is set based on plan code
    const listWithPriorities = initialList.map((item, index) => ({
      ...item,
      priority: PRIORITY_LEVELS[index] || "Other",
      specialTag: item.specialTag || getSpecialTagByPlanCode(item.planCode), // Ensure specialTag is set
    }))
    setOrderedMembershipList(listWithPriorities)

    // Also set the initial selected membership here
    if (listWithPriorities.length > 0) {
      setSelectedMembership(listWithPriorities[0])
    } else {
      setSelectedMembership(null)
    }
  }, [currentPerson.personId])

  // Update form data when person prop changes
  useEffect(() => {
    setCurrentPerson(person)
    setEditFormData({
      name: person.name,
      salutation: person.salutation || "", // Use person.salutation directly
      gender: person.gender || "", // Use person.gender directly
      email: person.email || "", // Use person.email directly
      phoneNo: person.phoneNo || "", // Use person.phoneNo directly
      idType: person.idType || "",
      dateOfBirth: person.dateOfBirth ? new Date(person.dateOfBirth) : undefined,
      nationality: person.nationality || "", // Use person.nationality directly
      idNo: person.idNo,
      issuedCountry: person.issuedCountry || "",
      issueDate: person.issueDate ? new Date(person.issueDate) : undefined,
      expiryDate: person.expiryDate ? new Date(person.expiryDate) : undefined,
      disabilityStatus: person.disabilityStatus || "No",
      specifyDisability: person.specifyDisability || "",
      allergiesType: person.allergiesType || [],
      allergiesDetails: person.allergiesDetails || {},
      smoker: person.smoker || false,
      alcoholConsumption: person.alcoholConsumption || false,
      status: person.status,
      addresses: person.addresses || [], // Use person.addresses directly
    })
  }, [person])

  // Clear success/error messages after a delay
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  useEffect(() => {
    if (saveError) {
      const timer = setTimeout(() => setSaveError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [saveError])

  // Update membership form data when selectedMembership changes
  useEffect(() => {
    if (selectedMembership) {
      setEditMembershipData({
        planName: selectedMembership.planName || "",
        planCode: selectedMembership.planCode || "",
        effectiveDate: selectedMembership.effectiveDate || "",
        expiryDate: selectedMembership.expiryDate || "",
        membershipNo: generateOnboardingMembershipNo(selectedMembership, 0),
        company: selectedMembership.companyName || "",
        personType: selectedMembership.personType || "",
        policyNo: selectedMembership.policyNo || "",
        membershipStatus: "Active",
        limitType: "Annual",
        limitAmount: "10,000",
        priority: selectedMembership.priority || "",
      })
    }
  }, [selectedMembership])

  // Clear membership success/error messages after a delay
  useEffect(() => {
    if (membershipSaveSuccess) {
      const timer = setTimeout(() => setMembershipSaveSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [membershipSaveSuccess])

  useEffect(() => {
    if (membershipSaveError) {
      const timer = setTimeout(() => setMembershipSaveError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [membershipSaveError])

  useEffect(() => {
    if (saveOrderSuccess) {
      const timer = setTimeout(() => setSaveOrderSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveOrderSuccess])

  useEffect(() => {
    if (saveOrderError) {
      const timer = setTimeout(() => setSaveOrderError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [saveOrderError])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handlePersonTabChange = (value: string) => {
    setActivePersonTab(value)
  }

  const handleMembershipSelect = (membership: OnboardingMembership) => {
    setSelectedMembership(membership)
  }

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, position: number) => {
    dragItem.current = position
  }

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, position: number) => {
    dragOverItem.current = position
  }

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return

    const newOrderedList = [...orderedMembershipList]
    const draggedItemContent = newOrderedList[dragItem.current]

    newOrderedList.splice(dragItem.current, 1)
    newOrderedList.splice(dragOverItem.current, 0, draggedItemContent)

    // Only update priority based on new order, keep specialTag unchanged
    const updatedListWithPriorities = newOrderedList.map((item, index) => ({
      ...item,
      priority: PRIORITY_LEVELS[index] || "Other", // Only update priority, specialTag remains from plan code
    }))

    dragItem.current = null
    dragOverItem.current = null
    setOrderedMembershipList(updatedListWithPriorities)
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault() // Necessary to allow dropping
  }

  const handleSaveOrder = async () => {
    setIsSavingOrder(true)
    setSaveOrderError(null)
    try {
      // Simulate API call to update priorities
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save the updated order to storage
      saveUpdatedMembershipOrder(currentPerson.personId, orderedMembershipList)

      console.log("Saving new order:", orderedMembershipList)

      setSaveOrderSuccess(true)
    } catch (error) {
      console.error("Error saving order:", error)
      setSaveOrderError("Failed to save new order. Please try again.")
    } finally {
      setIsSavingOrder(false)
    }
  }

  const serviceTypeCoverages = ["Inpatient", "Outpatient", "Dental", "Optical"]

  // Get dependents for this person - Updated to show ALL registered family members
  const getFamilyMembers = () => {
    // Use the new relationship-based approach to get ALL family members
    const allRelationships = getPersonRelationships()
    const allPersons = getPersons()
    const familyMembers: any[] = []

    allRelationships.forEach((rel) => {
      if (rel.status === "Active") {
        if (rel.personId1 === currentPerson.id) {
          const relatedPerson = allPersons.find((p) => p.id === rel.personId2)
          if (relatedPerson) {
            // For directional relationships from person1 to person2, show the relationship as-is
            // For example: Ahmad Farid (Father) -> Ahmad Danial (Child) should show "Child" for Ahmad Danial
            const relationshipToMain =
              rel.relationshipType === "Father"
                ? "Child"
                : rel.relationshipType === "Mother"
                  ? "Child"
                  : rel.relationshipType
            familyMembers.push({
              ...relatedPerson,
              relationshipToMain: relationshipToMain,
            })
          }
        } else if (rel.personId2 === currentPerson.id && rel.relationshipDirection === "bidirectional") {
          const relatedPerson = allPersons.find((p) => p.id === rel.personId1)
          if (relatedPerson) {
            // For bidirectional relationships, show the reverse relationship
            const reverseRelationshipMap: { [key: string]: string } = {
              Spouse: "Spouse",
              Sibling: "Sibling",
            }
            familyMembers.push({
              ...relatedPerson,
              relationshipToMain: reverseRelationshipMap[rel.relationshipType] || rel.relationshipType,
            })
          }
        } else if (rel.personId2 === currentPerson.id && rel.relationshipDirection === "directional") {
          const relatedPerson = allPersons.find((p) => p.id === rel.personId1)
          if (relatedPerson) {
            // For directional relationships where current person is person2, show the reverse relationship
            // For example: Siti Aishah (Mother) -> Ahmad Farid should show "Mother" for Siti Aishah from Ahmad Farid's view
            const reverseRelationshipMap: { [key: string]: string } = {
              Father: "Father", // If someone is father to current person, they are "Father" from current person's view
              Mother: "Mother", // If someone is mother to current person, they are "Mother" from current person's view
            }
            familyMembers.push({
              ...relatedPerson,
              relationshipToMain: reverseRelationshipMap[rel.relationshipType] || rel.relationshipType,
            })
          }
        }
      }
    })

    // Remove duplicates based on person ID
    const uniqueFamilyMembers = familyMembers.filter(
      (member, index, self) => index === self.findIndex((m) => m.id === member.id),
    )

    return uniqueFamilyMembers
  }

  const familyMembers = getFamilyMembers()

  const handleFamilyMemberClick = (familyMember: OnboardingFamilyMember) => {
    if (onNavigateToFamilyMember) {
      onNavigateToFamilyMember(familyMember.personId)
    }
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleEditSelectChange = (value: string, field: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditDateChange = (date: Date | undefined, field: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: date,
    }))
  }

  const handleEditCheckboxChange = (checked: boolean, field: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const handleEditAllergiesTypeChange = (option: string, checked: boolean) => {
    setEditFormData((prev) => {
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

  const handleEditAllergyDetailChange = (type: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      allergiesDetails: {
        ...prev.allergiesDetails,
        [type]: value,
      },
    }))
  }

  const validateFormData = () => {
    const errors: string[] = []

    // Required field validations
    if (!editFormData.name.trim()) {
      errors.push("Name is required")
    }

    if (!editFormData.idNo.trim()) {
      errors.push("ID Number is required")
    }

    if (!editFormData.idType) {
      errors.push("ID Type is required")
    }

    // Email validation
    if (editFormData.email && editFormData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(editFormData.email)) {
        errors.push("Please enter a valid email address")
      }
    }

    // Phone number validation (basic)
    if (editFormData.phoneNo && editFormData.phoneNo.trim()) {
      const phoneRegex = /^[+]?[0-9\-$$$$\s]+$/
      if (!phoneRegex.test(editFormData.phoneNo)) {
        errors.push("Please enter a valid phone number")
      }
    }

    // Passport specific validations
    if (editFormData.idType === "Passport No.") {
      if (!editFormData.issuedCountry) {
        errors.push("Issued Country is required for passport")
      }
      if (!editFormData.issueDate) {
        errors.push("Issue Date is required for passport")
      }
      if (!editFormData.expiryDate) {
        errors.push("Expiry Date is required for passport")
      }
      if (editFormData.issueDate && editFormData.expiryDate && editFormData.issueDate >= editFormData.expiryDate) {
        errors.push("Expiry Date must be after Issue Date")
      }
    }

    // Disability status validation
    if (editFormData.disabilityStatus === "Yes" && !editFormData.specifyDisability.trim()) {
      errors.push("Please specify the disability when status is Yes")
    }

    return errors
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)

      // Validate form data
      const validationErrors = validateFormData()
      if (validationErrors.length > 0) {
        setSaveError(validationErrors.join(", "))
        return
      }

      // Prepare update data
      const updateData = {
        name: editFormData.name.trim(),
        salutation: editFormData.salutation,
        gender: editFormData.gender,
        email: editFormData.email.trim(),
        phoneNo: editFormData.phoneNo.trim(),
        idType: editFormData.idType,
        dateOfBirth: editFormData.dateOfBirth,
        nationality: editFormData.nationality,
        issuedCountry: editFormData.issuedCountry,
        issueDate: editFormData.issueDate,
        expiryDate: editFormData.expiryDate,
        disabilityStatus: editFormData.disabilityStatus,
        specifyDisability: editFormData.disabilityStatus === "Yes" ? editFormData.specifyDisability.trim() : "",
        allergiesType: editFormData.allergiesType,
        allergiesDetails: editFormData.allergiesDetails,
        smoker: editFormData.smoker,
        alcoholConsumption: editFormData.alcoholConsumption,
        status: editFormData.status,
        addresses: editFormData.addresses || [],
      }

      // Update person in storage
      const updatedPersonProfile = updatePersonProfile(currentPerson.id, updateData)

      if (updatedPersonProfile) {
        // Update current person state with the saved data
        const updatedPerson = {
          ...currentPerson,
          ...updateData,
          dateOfBirth: updateData.dateOfBirth ? updateData.dateOfBirth.toISOString() : currentPerson.dateOfBirth,
          issueDate: updateData.issueDate ? updateData.issueDate.toISOString() : currentPerson.issueDate,
          expiryDate: updateData.expiryDate ? updateData.expiryDate.toISOString() : currentPerson.expiryDate,
        }

        setCurrentPerson(updatedPerson)

        // Notify parent component of the update
        if (onPersonUpdate) {
          onPersonUpdate(updatedPerson)
        }

        setIsEditMode(false)
        setSaveSuccess(true)
      } else {
        setSaveError("Failed to save changes. Please try again.")
      }
    } catch (error) {
      console.error("Error saving person data:", error)
      setSaveError("An unexpected error occurred while saving. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddAddress = () => {
    setEditFormData((prev) => ({
      ...prev,
      addresses: [
        ...(prev.addresses || []),
        { streetAddress: "", postcode: "", city: "", state: "", country: "", type: "Home" },
      ],
    }))
  }

  const handleRemoveAddress = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      addresses: (prev.addresses || []).filter((_, i) => i !== index),
    }))
  }

  const handleAddressChange = (index: number, field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      addresses: (prev.addresses || []).map((addr, i) => (i === index ? { ...addr, [field]: value } : addr)),
    }))
  }

  const handleCancelEdit = () => {
    setEditFormData({
      name: currentPerson.name,
      salutation: currentPerson.salutation || "", // Use currentPerson.salutation directly
      gender: currentPerson.gender || "", // Use currentPerson.gender directly
      email: currentPerson.email || "", // Use currentPerson.email directly
      phoneNo: currentPerson.phoneNo || "", // Use currentPerson.phoneNo directly
      idType: currentPerson.idType || "",
      dateOfBirth: currentPerson.dateOfBirth ? new Date(currentPerson.dateOfBirth) : undefined,
      nationality: currentPerson.nationality || "", // Use currentPerson.nationality directly
      idNo: currentPerson.idNo,
      issuedCountry: currentPerson.issuedCountry || "",
      issueDate: currentPerson.issueDate ? new Date(currentPerson.issueDate) : undefined,
      expiryDate: currentPerson.expiryDate ? new Date(currentPerson.expiryDate) : undefined,
      disabilityStatus: currentPerson.disabilityStatus || "No",
      specifyDisability: currentPerson.specifyDisability || "",
      allergiesType: currentPerson.allergiesType || [],
      allergiesDetails: currentPerson.allergiesDetails || {},
      smoker: currentPerson.smoker || false,
      alcoholConsumption: currentPerson.alcoholConsumption || false,
      status: currentPerson.status,
      addresses: currentPerson.addresses || [], // Use currentPerson.addresses directly
    })
    setIsEditMode(false)
    setSaveError(null)
  }

  const handleMembershipInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setEditMembershipData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleMembershipSelectChange = (value: string, field: string) => {
    setEditMembershipData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateMembershipData = () => {
    const errors: string[] = []

    if (!editMembershipData.planName.trim()) {
      errors.push("Plan Name is required")
    }
    if (!editMembershipData.planCode.trim()) {
      errors.push("Plan Code is required")
    }
    if (!editMembershipData.effectiveDate.trim()) {
      errors.push("Effective Date is required")
    }
    if (!editMembershipData.expiryDate.trim()) {
      errors.push("Expiry Date is required")
    }
    if (!editMembershipData.company.trim()) {
      errors.push("Company is required")
    }
    if (!editMembershipData.personType.trim()) {
      errors.push("Person Type is required")
    }
    if (!editMembershipData.policyNo.trim()) {
      errors.push("Policy No. is required")
    }

    // Date validation
    if (editMembershipData.effectiveDate && editMembershipData.expiryDate) {
      const effectiveDate = new Date(editMembershipData.effectiveDate)
      const expiryDate = new Date(editMembershipData.expiryDate)
      if (effectiveDate >= expiryDate) {
        errors.push("Expiry Date must be after Effective Date")
      }
    }

    return errors
  }

  const handleSaveMembershipChanges = async () => {
    try {
      setIsMembershipSaving(true)
      setMembershipSaveError(null)

      // Validate membership data
      const validationErrors = validateMembershipData()
      if (validationErrors.length > 0) {
        setMembershipSaveError(validationErrors.join(", "))
        return
      }

      // Simulate saving membership data (in a real app, this would call an API)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the selected membership with new data
      if (selectedMembership) {
        const updatedMembership = {
          ...selectedMembership,
          planName: editMembershipData.planName,
          planCode: editMembershipData.planCode,
          effectiveDate: editMembershipData.effectiveDate,
          expiryDate: editMembershipData.expiryDate,
          companyName: editMembershipData.company,
          personType: editMembershipData.personType,
          policyNo: editMembershipData.policyNo,
          priority: editMembershipData.priority,
        }
        setSelectedMembership(updatedMembership)
      }

      setIsMembershipEditMode(false)
      setMembershipSaveSuccess(true)
    } catch (error) {
      console.error("Error saving membership data:", error)
      setMembershipSaveError("An unexpected error occurred while saving membership data. Please try again.")
    } finally {
      setIsMembershipSaving(false)
    }
  }

  const handleCancelMembershipEdit = () => {
    // Reset form data to selected membership values
    if (selectedMembership) {
      setEditMembershipData({
        planName: selectedMembership.planName || "",
        planCode: selectedMembership.planCode || "",
        effectiveDate: selectedMembership.effectiveDate || "",
        expiryDate: selectedMembership.expiryDate || "",
        membershipNo: generateOnboardingMembershipNo(selectedMembership, 0),
        company: selectedMembership.companyName || "",
        personType: selectedMembership.personType || "",
        policyNo: selectedMembership.policyNo || "",
        membershipStatus: "Active",
        limitType: "Annual",
        limitAmount: "10,000",
        priority: selectedMembership.priority || "",
      })
    }
    setIsMembershipEditMode(false)
    setMembershipSaveError(null)
  }

  // Update the handleViewMultiLevelUtilization function
  const handleViewMultiLevelUtilization = (planCode: string) => {
    setSelectedPlanCode(planCode)
    setShowMultiLevelView(true)
    setActiveTab("visitHistoryUtilization")
  }

  // Add a back handler for the multi-level view
  const handleBackFromMultiLevel = () => {
    setShowMultiLevelView(false)
  }

  const toggleNestedLimit = (limitId: string, limits: any[]): any[] => {
    return limits.map((limit) => {
      if (limit.id === limitId && limit.limitType === "nested") {
        return { ...limit, expanded: !limit.expanded }
      }
      if (limit.limitType === "nested" && limit.children) {
        return { ...limit, children: toggleNestedLimit(limitId, limit.children) }
      }
      return limit
    })
  }

  const handleToggleExpanded = (limitId: string) => {
    setLimitStructure((prev) => toggleNestedLimit(limitId, prev))
  }

  const renderFlatLimit = (limit: any) => (
    <div key={limit.id} className="mb-4">
      <div className="relative rounded-xl border-2 border-gray-300 p-6 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200 hover:shadow-lg">
        <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white">
          STANDALONE LIMIT
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <h3 className="text-lg font-bold text-gray-800">{limit.name}</h3>
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{limit.description}</p>
                  <p>Service Types: {limit.serviceTypes.join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex space-x-1">
            {limit.serviceTypes.map((st: string) => (
              <div key={st} className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
                <div className={`h-2 w-2 rounded-full ${getServiceTypeColor(st)} mr-1`}></div>
                <span className="text-xs font-medium text-gray-700">{st}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Utilization Progress</span>
            <span className="text-sm font-bold text-gray-800">{limit.percentage.toFixed(1)}% Used</span>
          </div>
          <Progress value={limit.percentage} className="h-3 [&>div]:bg-gray-500" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Limit</div>
            <div className="text-sm font-bold text-gray-800 mt-1">{limit.limit}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Utilized</div>
            <div className="text-sm font-bold text-red-600 mt-1">{limit.utilized}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Remaining</div>
            <div className="text-sm font-bold text-green-600 mt-1">{limit.remaining}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNestedLimit = (limit: any, level = 0) => (
    <div key={limit.id} className="mb-6">
      <div className={`relative ${level > 0 ? "ml-8" : ""}`}>
        {level > 0 && (
          <>
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 to-transparent"></div>
            <div className="absolute -left-8 top-6 w-7 h-px bg-blue-300"></div>
          </>
        )}
        <div
          className={`relative rounded-xl border-2 p-6 bg-gradient-to-br transition-all duration-200 hover:shadow-lg ${
            level === 0
              ? "border-blue-500 from-blue-50 to-blue-100 shadow-md"
              : level === 1
                ? "border-purple-400 from-purple-50 to-purple-100"
                : "border-green-400 from-green-50 to-green-100"
          }`}
        >
          <div
            className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
              level === 0
                ? "bg-blue-500 text-white"
                : level === 1
                  ? "bg-purple-500 text-white"
                  : "bg-green-500 text-white"
            }`}
          >
            {level === 0 ? "PRIMARY LIMIT" : level === 1 ? "NESTED LIMIT" : "INNER LIMIT"}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {limit.children && limit.children.length > 0 && (
                <button
                  onClick={() => handleToggleExpanded(limit.id)}
                  className="mr-2 hover:bg-white hover:bg-opacity-50 rounded p-1"
                >
                  {limit.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              )}
              <div
                className={`w-3 h-3 rounded-full ${
                  level === 0 ? "bg-blue-500" : level === 1 ? "bg-purple-500" : "bg-green-500"
                }`}
              ></div>
              <h3 className="text-lg font-bold text-gray-800">{limit.name}</h3>
              <Layers className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex space-x-1">
              {limit.serviceTypes.map((st: string) => (
                <div key={st} className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
                  <div className={`h-2 w-2 rounded-full ${getServiceTypeColor(st)} mr-1`}></div>
                  <span className="text-xs font-medium text-gray-700">{st}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Utilization Progress</span>
              <span className="text-sm font-bold text-gray-800">{limit.percentage.toFixed(1)}% Used</span>
            </div>
            <Progress
              value={limit.percentage}
              className={`h-3 ${
                level === 0 ? "[&>div]:bg-blue-500" : level === 1 ? "[&>div]:bg-purple-500" : "[&>div]:bg-green-500"
              }`}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Limit</div>
              <div className="text-sm font-bold text-gray-800 mt-1">{limit.limit}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Utilized</div>
              <div className="text-sm font-bold text-red-600 mt-1">{limit.utilized}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Remaining</div>
              <div className="text-sm font-bold text-green-600 mt-1">{limit.remaining}</div>
            </div>
          </div>
        </div>
      </div>
      {limit.expanded && limit.children && limit.children.length > 0 && (
        <div className="mt-6">{limit.children.map((child: any) => renderNestedLimit(child, level + 1))}</div>
      )}
    </div>
  )

  // Update the hasMultiLevelLimits function to be more specific about which plans have multi-level limits
  const hasMultiLevelLimits = (planCode: string, personId: string): boolean => {
    // Only TPH-2024 (Thailand Premium Health Plan) has multi-level limits
    if (personId === "PER-2025-123" && planCode === "TPH-2024") {
      return true
    }
    return false
  }

  // Add a new function to determine if a plan has special flat limits structure
  const hasSpecialFlatLimits = (planCode: string, personId: string): boolean => {
    // TEE-2024 (Thailand Executive Extension Plan) has special flat limits
    if (personId === "PER-2025-123" && planCode === "TEE-2024") {
      return true
    }
    return false
  }

  // Add a new function to determine if a plan has international coverage
  const hasInternationalCoverage = (planCode: string, personId: string): boolean => {
    // TIC-2024 (Thailand International Coverage Plan) has international coverage
    if (personId === "PER-2025-123" && planCode === "TIC-2024") {
      return true
    }
    return false
  }

  // Add a function to get plan-specific limit structure
  const getPlanLimitStructure = (planCode: string): any[] => {
    switch (planCode) {
      case "TPH-2024":
        return [
          // Premium Health Plan - Multi-level nested structure
          {
            id: "nested-1",
            name: "Combined Medical Limit",
            serviceTypes: ["GP", "SP", "OC", "DT"],
            limit: "RM 20,000.00",
            utilized: "RM 1,150.00",
            remaining: "RM 18,850.00",
            percentage: 5.75,
            limitType: "nested",
            description: "Primary limit covering all medical services with nested sub-limits",
            expanded: true,
            level: 0,
            children: [
              {
                id: "nested-1-1",
                name: "Outpatient Services",
                serviceTypes: ["GP", "SP"],
                limit: "RM 8,000.00",
                utilized: "RM 930.00",
                remaining: "RM 7,070.00",
                percentage: 11.6,
                limitType: "nested",
                description: "Sub-limit for all outpatient services",
                expanded: true,
                children: [
                  {
                    id: "nested-1-1-1",
                    name: "Specialist Consultations",
                    serviceTypes: ["SP"],
                    limit: "RM 3,000.00",
                    utilized: "RM 580.00",
                    remaining: "RM 2,420.00",
                    percentage: 19.3,
                    limitType: "nested",
                    description: "Specific limit for specialist consultations only",
                    level: 2,
                  },
                ],
              },
              {
                id: "nested-1-2",
                name: "Optical & Dental Limit",
                serviceTypes: ["OC", "DT"],
                limit: "RM 2,500.00",
                utilized: "RM 220.00",
                remaining: "RM 2,280.00",
                percentage: 8.8,
                limitType: "nested",
                description: "Sub-limit for optical and dental services",
                expanded: true,
                level: 1,
                children: [
                  {
                    id: "nested-1-2-1",
                    name: "Optical Specific Limit",
                    serviceTypes: ["OC"],
                    limit: "RM 1,000.00",
                    utilized: "RM 0.00",
                    remaining: "RM 1,000.00",
                    percentage: 0,
                    limitType: "nested",
                    description: "Specific limit for optical services only",
                    level: 2,
                  },
                  {
                    id: "nested-1-2-2",
                    name: "Dental Specific Limit",
                    serviceTypes: ["DT"],
                    limit: "RM 1,500.00",
                    utilized: "RM 220.00",
                    remaining: "RM 1,280.00",
                    percentage: 14.7,
                    limitType: "nested",
                    description: "Specific limit for dental services only",
                    level: 2,
                  },
                ],
              },
            ],
          },
          // Standalone limits for Premium Health Plan
          {
            id: "flat-1",
            name: "Maternity Benefit",
            serviceTypes: ["MT"],
            limit: "RM 5,000.00",
            utilized: "RM 0.00",
            remaining: "RM 5,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Standalone maternity coverage limit",
          },
          {
            id: "flat-2",
            name: "Emergency Services",
            serviceTypes: ["EM"],
            limit: "RM 10,000.00",
            utilized: "RM 0.00",
            remaining: "RM 10,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Emergency medical services coverage",
          },
        ]
      case "TEE-2024":
        return [
          // Executive Extension Plan - Enhanced flat limits
          {
            id: "exec-flat-1",
            name: "Executive Health Screening",
            serviceTypes: ["EHS"],
            limit: "RM 3,000.00",
            utilized: "RM 580.00",
            remaining: "RM 2,420.00",
            percentage: 19.3,
            limitType: "flat",
            description: "Annual executive health screening benefit",
          },
          {
            id: "exec-flat-2",
            name: "Specialist Consultations",
            serviceTypes: ["SP"],
            limit: "RM 15,000.00",
            utilized: "RM 0.00",
            remaining: "RM 15,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Specialist consultations with direct billing",
          },
          {
            id: "exec-flat-3",
            name: "Hospitalization",
            serviceTypes: ["HP"],
            limit: "RM 50,000.00",
            utilized: "RM 0.00",
            remaining: "RM 50,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Premium hospital room and board coverage",
          },
          {
            id: "exec-flat-4",
            name: "Wellness Program",
            serviceTypes: ["WP"],
            limit: "RM 2,000.00",
            utilized: "RM 0.00",
            remaining: "RM 2,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Wellness and preventive care program",
          },
          {
            id: "exec-flat-5",
            name: "Alternative Medicine",
            serviceTypes: ["AM"],
            limit: "RM 3,000.00",
            utilized: "RM 0.00",
            remaining: "RM 3,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Alternative and complementary medicine coverage",
          },
        ]
      case "TIC-2024":
        return [
          // International Coverage Plan - Global coverage limits
          {
            id: "intl-flat-1",
            name: "International Inpatient",
            serviceTypes: ["IIP"],
            limit: "RM 100,000.00",
            utilized: "RM 0.00",
            remaining: "RM 100,000.00",
            percentage: 0,
            limitType: "flat",
            description: "International hospitalization coverage",
          },
          {
            id: "intl-flat-2",
            name: "International Outpatient",
            serviceTypes: ["IOP"],
            limit: "RM 30,000.00",
            utilized: "RM 0.00",
            remaining: "RM 30,000.00",
            percentage: 0,
            limitType: "flat",
            description: "International outpatient services",
          },
          {
            id: "intl-flat-3",
            name: "Emergency Evacuation",
            serviceTypes: ["EE"],
            limit: "RM 50,000.00",
            utilized: "RM 0.00",
            remaining: "RM 50,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Emergency medical evacuation services",
          },
          {
            id: "intl-flat-4",
            name: "Repatriation",
            serviceTypes: ["RP"],
            limit: "RM 30,000.00",
            utilized: "RM 0.00",
            remaining: "RM 30,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Repatriation of mortal remains",
          },
        ]
      // Enhanced traditional plans for other persons
      case "MYS-BASIC-2024":
        return [
          {
            id: "basic-flat-1",
            name: "General Practitioner",
            serviceTypes: ["GP"],
            limit: "RM 3,000.00",
            utilized: "RM 450.00",
            remaining: "RM 2,550.00",
            percentage: 15,
            limitType: "flat",
            description: "General practitioner consultations and treatments",
          },
          {
            id: "basic-flat-2",
            name: "Specialist Consultations",
            serviceTypes: ["SP"],
            limit: "RM 8,000.00",
            utilized: "RM 1,200.00",
            remaining: "RM 6,800.00",
            percentage: 15,
            limitType: "flat",
            description: "Specialist doctor consultations",
          },
          {
            id: "basic-flat-3",
            name: "Hospitalization",
            serviceTypes: ["HP"],
            limit: "RM 25,000.00",
            utilized: "RM 0.00",
            remaining: "RM 25,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Inpatient hospital room and board",
          },
          {
            id: "basic-flat-4",
            name: "Dental Services",
            serviceTypes: ["DT"],
            limit: "RM 1,500.00",
            utilized: "RM 320.00",
            remaining: "RM 1,180.00",
            percentage: 21.3,
            limitType: "flat",
            description: "Dental treatments and procedures",
          },
          {
            id: "basic-flat-5",
            name: "Optical Services",
            serviceTypes: ["OC"],
            limit: "RM 800.00",
            utilized: "RM 0.00",
            remaining: "RM 800.00",
            percentage: 0,
            limitType: "flat",
            description: "Eye examinations and optical aids",
          },
          {
            id: "basic-flat-6",
            name: "Emergency Services",
            serviceTypes: ["EM"],
            limit: "RM 5,000.00",
            utilized: "RM 0.00",
            remaining: "RM 5,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Emergency medical treatments",
          },
        ]
      case "MYS-PREMIUM-2024":
        return [
          {
            id: "premium-flat-1",
            name: "General Practitioner",
            serviceTypes: ["GP"],
            limit: "RM 5,000.00",
            utilized: "RM 680.00",
            remaining: "RM 4,320.00",
            percentage: 13.6,
            limitType: "flat",
            description: "Enhanced general practitioner coverage",
          },
          {
            id: "premium-flat-2",
            name: "Specialist Consultations",
            serviceTypes: ["SP"],
            limit: "RM 15,000.00",
            utilized: "RM 2,400.00",
            remaining: "RM 12,600.00",
            percentage: 16,
            limitType: "flat",
            description: "Premium specialist consultations with direct billing",
          },
          {
            id: "premium-flat-3",
            name: "Hospitalization",
            serviceTypes: ["HP"],
            limit: "RM 50,000.00",
            utilized: "RM 0.00",
            remaining: "RM 50,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Premium hospital room and comprehensive coverage",
          },
          {
            id: "premium-flat-4",
            name: "Dental Services",
            serviceTypes: ["DT"],
            limit: "RM 2,500.00",
            utilized: "RM 450.00",
            remaining: "RM 2,050.00",
            percentage: 18,
            limitType: "flat",
            description: "Comprehensive dental care including cosmetic procedures",
          },
          {
            id: "premium-flat-5",
            name: "Optical Services",
            serviceTypes: ["OC"],
            limit: "RM 1,500.00",
            utilized: "RM 0.00",
            remaining: "RM 1,500.00",
            percentage: 0,
            limitType: "flat",
            description: "Premium optical care including designer frames",
          },
          {
            id: "premium-flat-6",
            name: "Maternity Benefits",
            serviceTypes: ["MT"],
            limit: "RM 8,000.00",
            utilized: "RM 0.00",
            remaining: "RM 8,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Comprehensive maternity and newborn care",
          },
          {
            id: "premium-flat-7",
            name: "Wellness Program",
            serviceTypes: ["WP"],
            limit: "RM 2,000.00",
            utilized: "RM 350.00",
            remaining: "RM 1,650.00",
            percentage: 17.5,
            limitType: "flat",
            description: "Annual health screening and wellness activities",
          },
          {
            id: "premium-flat-8",
            name: "Emergency Services",
            serviceTypes: ["EM"],
            limit: "RM 10,000.00",
            utilized: "RM 0.00",
            remaining: "RM 10,000.00",
            percentage: 0,
            limitType: "flat",
            description: "24/7 emergency medical services",
          },
          {
            id: "premium-flat-8",
            name: "Emergency Services",
            serviceTypes: ["EM"],
            limit: "RM 10,000.00",
            utilized: "RM 0.00",
            remaining: "RM 10,000.00",
            percentage: 0,
            limitType: "flat",
            description: "24/7 emergency medical services",
          },
        ]
      case "CORP-STANDARD-2024":
        return [
          {
            id: "corp-flat-1",
            name: "Outpatient Services",
            serviceTypes: ["GP", "SP"],
            limit: "RM 6,000.00",
            utilized: "RM 890.00",
            remaining: "RM 5,110.00",
            percentage: 14.8,
            limitType: "flat",
            description: "Combined outpatient GP and specialist services",
          },
          {
            id: "corp-flat-2",
            name: "Hospitalization",
            serviceTypes: ["HP"],
            limit: "RM 30,000.00",
            utilized: "RM 0.00",
            remaining: "RM 30,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Corporate hospitalization coverage",
          },
          {
            id: "corp-flat-3",
            name: "Dental & Optical",
            serviceTypes: ["DT", "OC"],
            limit: "RM 2,000.00",
            utilized: "RM 280.00",
            remaining: "RM 1,720.00",
            percentage: 14,
            limitType: "flat",
            description: "Combined dental and optical services",
          },
          {
            id: "corp-flat-4",
            name: "Annual Health Screening",
            serviceTypes: ["AHS"],
            limit: "RM 1,000.00",
            utilized: "RM 0.00",
            remaining: "RM 1,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Mandatory annual health screening for employees",
          },
          {
            id: "corp-flat-5",
            name: "Emergency Services",
            serviceTypes: ["EM"],
            limit: "RM 8,000.00",
            utilized: "RM 0.00",
            remaining: "RM 8,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Corporate emergency medical coverage",
          },
        ]
      default:
        return [
          {
            id: "default-flat-1",
            name: "General Practitioner",
            serviceTypes: ["GP"],
            limit: "RM 2,500.00",
            utilized: "RM 350.00",
            remaining: "RM 2,150.00",
            percentage: 14,
            limitType: "flat",
            description: "General practitioner consultations and basic treatments",
          },
          {
            id: "default-flat-2",
            name: "Specialist Consultations",
            serviceTypes: ["SP"],
            limit: "RM 6,000.00",
            utilized: "RM 0.00",
            remaining: "RM 6,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Specialist doctor consultations",
          },
          {
            id: "default-flat-3",
            name: "Hospitalization",
            serviceTypes: ["HP"],
            limit: "RM 20,000.00",
            utilized: "RM 0.00",
            remaining: "RM 20,000.00",
            percentage: 0,
            limitType: "flat",
            description: "Basic hospitalization coverage",
          },
          {
            id: "default-flat-4",
            name: "Dental Services",
            serviceTypes: ["DT"],
            limit: "RM 1,000.00",
            utilized: "RM 220.00",
            remaining: "RM 780.00",
            percentage: 22,
            limitType: "flat",
            description: "Basic dental treatments",
          },
          {
            id: "default-flat-5",
            name: "Optical Services",
            serviceTypes: ["OC"],
            limit: "RM 600.00",
            utilized: "RM 0.00",
            remaining: "RM 600.00",
            percentage: 0,
            limitType: "flat",
            description: "Basic optical services and eyewear",
          },
        ]
    }
  }

  // Update the getServiceTypeColor function to include more service types
  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "GP":
        return "bg-blue-500" // General Practitioner
      case "SP":
        return "bg-purple-500" // Specialist
      case "OC":
        return "bg-green-500" // Optical
      case "DT":
        return "bg-yellow-500" // Dental
      case "MT":
        return "bg-pink-500" // Maternity
      case "EM":
        return "bg-red-500" // Emergency
      case "WP":
        return "bg-teal-500" // Wellness Program
      case "HP":
        return "bg-indigo-500" // Hospitalization
      case "EHS":
        return "bg-amber-500" // Executive Health Screening
      case "AM":
        return "bg-lime-500" // Alternative Medicine
      case "IIP":
        return "bg-sky-500" // International Inpatient
      case "IOP":
        return "bg-cyan-500" // International Outpatient
      case "EE":
        return "bg-rose-500" // Emergency Evacuation
      case "RP":
        return "bg-fuchsia-500" // Repatriation
      case "AHS":
        return "bg-orange-500" // Annual Health Screening
      default:
        return "bg-gray-500"
    }
  }

  // Update the getServiceTypeName function to include more service types
  const getServiceTypeName = (serviceType: string) => {
    switch (serviceType) {
      case "GP":
        return "General Practitioner"
      case "SP":
        return "Specialist"
      case "OC":
        return "Optical"
      case "DT":
        return "Dental"
      case "MT":
        return "Maternity"
      case "EM":
        return "Emergency"
      case "WP":
        return "Wellness Program"
      case "HP":
        return "Hospitalization"
      case "EHS":
        return "Executive Health Screening"
      case "AM":
        return "Alternative Medicine"
      case "IIP":
        return "International Inpatient"
      case "IOP":
        return "International Outpatient"
      case "EE":
        return "Emergency Evacuation"
      case "RP":
        return "Repatriation"
      case "AHS":
        return "Annual Health Screening"
      default:
        return "Other"
    }
  }

  const [multiLevelStructure, setMultiLevelStructure] = useState([
    {
      id: "tier-1",
      serviceTypes: ["GP", "SP", "OC", "DT"],
      limit: "RM 1,500.00",
      utilized: "RM 150.00",
      remaining: "RM 1,350.00",
      percentage: 10,
      expanded: true,
      children: [
        {
          id: "tier-2",
          serviceTypes: ["OC", "DT"],
          limit: "RM 500.00",
          utilized: "RM 50.00",
          remaining: "RM 450.00",
          percentage: 10,
          expanded: true,
          children: [
            {
              id: "tier-3",
              serviceTypes: ["DT"],
              limit: "RM 200.00",
              utilized: "RM 0.00",
              remaining: "RM 200.00",
              percentage: 0,
              expanded: true,
            },
          ],
        },
      ],
    },
  ])

  const toggleMultiLevelExpanded = (limitId: string, limits: any[]): any[] => {
    return limits.map((limit) => {
      if (limit.id === limitId) {
        return { ...limit, expanded: !limit.expanded }
      }
      if (limit.children) {
        return { ...limit, children: toggleMultiLevelExpanded(limitId, limit.children) }
      }
      return limit
    })
  }

  const handleToggleMultiLevelExpanded = (limitId: string) => {
    setMultiLevelStructure((prev) => toggleMultiLevelExpanded(limitId, prev))
  }

  const expandAllMultiLevel = (limits: any[]): any[] => {
    return limits.map((limit) => ({
      ...limit,
      expanded: true,
      children: limit.children ? expandAllMultiLevel(limit.children) : limit.children,
    }))
  }

  const collapseAllMultiLevel = (limits: any[]): any[] => {
    return limits.map((limit) => ({
      ...limit,
      expanded: false,
      children: limit.children ? collapseAllMultiLevel(limit.children) : limit.children,
    }))
  }

  const handleExpandCollapseAllMultiLevel = (expand: boolean) => {
    setMultiLevelStructure((prev) => (expand ? expandAllMultiLevel(prev) : collapseAllMultiLevel(prev)))
  }

  const expandAllFlatLimits = (limits: any[]): any[] => {
    return limits.map((limit) => ({
      ...limit,
      expanded: true,
      children: limit.children ? expandAllFlatLimits(limit.children) : limit.children,
    }))
  }

  const collapseAllFlatLimits = (limits: any[]): any[] => {
    return limits.map((limit) => ({
      ...limit,
      expanded: false,
      children: limit.children ? collapseAllFlatLimits(limit.children) : limit.children,
    }))
  }

  const handleExpandCollapseAllFlat = (expand: boolean) => {
    setShowFlatLimitsExpanded(expand)
    setLimitStructure((prev) => (expand ? expandAllFlatLimits(prev) : collapseAllFlatLimits(prev)))
  }

  const renderMultiLevelStructure = (limits: any[], level = 0) => {
    return limits.map((limit) => (
      <div key={limit.id} className="mb-4">
        {/* Indentation wrapper */}
        <div
          style={{
            marginLeft: level === 0 ? "0px" : level === 1 ? "40px" : "80px",
          }}
        >
          {/* Multi-level card design - Compact version */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 relative shadow-sm hover:shadow-md transition-all duration-200">
            {/* Tier label at the top - Compact size */}
            <div
              className={`
          inline-block px-3 py-1 rounded-lg text-sm font-bold text-white shadow-md mb-3
          ${level === 0 ? "bg-blue-600" : ""}
          ${level === 1 ? "bg-purple-600" : ""}
          ${level === 2 ? "bg-green-600" : ""}
        `}
            >
              {level === 0 ? "1st Tier" : level === 1 ? "2nd Tier" : "3rd Tier"}
            </div>

            {/* Top row with service types and main limit amount - Compact spacing */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {limit.children && limit.children.length > 0 && (
                  <button
                    onClick={() => handleToggleMultiLevelExpanded(limit.id)}
                    className="hover:bg-white hover:bg-opacity-50 rounded p-1 transition-colors"
                  >
                    {limit.expanded !== false ? (
                      <ChevronDown className="h-4 w-4 text-gray-700" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-700" />
                    )}
                  </button>
                )}
                <span className="text-lg font-bold text-gray-800">{limit.serviceTypes.join(", ")}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{limit.limit}</div>
                <div className="text-sm text-gray-600 font-medium">
                  {level === 0 ? "1st Tier Limit" : level === 1 ? "2nd Tier Limit" : "3rd Tier Limit"}
                </div>
                <div className="text-sm text-gray-500">
                  {level === 0 ? "Combine limit" : level === 1 ? "Nested limit" : "Inner limit"}
                </div>
              </div>
            </div>

            {/* Bottom row with utilized and remaining - Compact typography */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-base text-gray-700">
                <span className="font-medium text-gray-600">Utilized:</span>{" "}
                <span className="font-bold text-gray-900">{limit.utilized}</span>
              </div>
              <div className="text-base text-gray-700">
                <span className="font-medium text-gray-600">Remaining:</span>{" "}
                <span className="font-bold text-green-600">{limit.remaining}</span>
              </div>
            </div>

            {/* Progress bar - Standard thickness */}
            <div className="w-full bg-blue-200 rounded-full h-3 shadow-inner mb-2">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${limit.percentage}%` }}
              ></div>
            </div>

            {/* Usage percentage indicator - Compact */}
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">{limit.percentage.toFixed(1)}% utilized</span>
            </div>
          </div>
        </div>

        {/* Render children - only if expanded */}
        {limit.expanded !== false && limit.children && limit.children.length > 0 && (
          <div className="mt-4">{renderMultiLevelStructure(limit.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Person Details</h2>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Person information has been successfully updated.
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{saveError}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activePersonTab} onValueChange={handlePersonTabChange}>
        <TabsList>
          <TabsTrigger value="personInfo">Person Information</TabsTrigger>
          <TabsTrigger value="familyMemberInfo">Family Member Information</TabsTrigger>
          <TabsTrigger value="membershipList">Membership List</TabsTrigger>
        </TabsList>
        <TabsContent value="personInfo">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Person Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                {!isEditMode ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    {isEditMode ? (
                      <Input id="name" value={editFormData.name} onChange={handleEditInputChange} />
                    ) : (
                      <Input id="name" value={currentPerson.name} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="salutation">Salutation</Label>
                    {isEditMode ? (
                      <Select
                        value={editFormData.salutation}
                        onValueChange={(value) => handleEditSelectChange(value, "salutation")}
                      >
                        <SelectTrigger>
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
                    ) : (
                      <Input id="salutation" value={currentPerson.salutation || "N/A"} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    {isEditMode ? (
                      <Select
                        value={editFormData.gender}
                        onValueChange={(value) => handleEditSelectChange(value, "gender")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="gender" value={currentPerson.gender || "N/A"} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditMode ? (
                      <Input id="email" type="email" value={editFormData.email} onChange={handleEditInputChange} />
                    ) : (
                      <Input id="email" value={currentPerson.email || "N/A"} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="idType">ID Type</Label>
                    {isEditMode ? (
                      <Select
                        value={editFormData.idType}
                        onValueChange={(value) => handleEditSelectChange(value, "idType")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IC No.">IC No.</SelectItem>
                          <SelectItem value="Passport No.">Passport No.</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="idType" value={currentPerson.idType || "N/A"} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    {isEditMode ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !editFormData.dateOfBirth && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editFormData.dateOfBirth
                              ? format(editFormData.dateOfBirth, "PPP")
                              : "Select date of birth"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={editFormData.dateOfBirth}
                            onSelect={(date) => handleEditDateChange(date, "dateOfBirth")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Input
                        id="dateOfBirth"
                        value={
                          currentPerson.dateOfBirth ? new Date(currentPerson.dateOfBirth).toLocaleDateString() : "N/A"
                        }
                        readOnly
                      />
                    )}
                  </div>
                  {(currentPerson.idType === "Passport No." || editFormData.idType === "Passport No.") && (
                    <div>
                      <Label htmlFor="issueDate">Issue Date</Label>
                      {isEditMode ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !editFormData.issueDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editFormData.issueDate ? format(editFormData.issueDate, "PPP") : "Select issue date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={editFormData.issueDate}
                              onSelect={(date) => handleEditDateChange(date, "issueDate")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Input
                          id="issueDate"
                          value={
                            currentPerson.issueDate ? new Date(currentPerson.issueDate).toLocaleDateString() : "N/A"
                          }
                          readOnly
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    {isEditMode ? (
                      <Select
                        value={editFormData.status}
                        onValueChange={(value) => handleEditSelectChange(value, "status")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="status" value={currentPerson.status} readOnly />
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="personId">Person ID</Label>
                    <Input id="personId" value={currentPerson.personId} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="phoneNo">Phone No.</Label>
                    {isEditMode ? (
                      <Input id="phoneNo" value={editFormData.phoneNo} onChange={handleEditInputChange} />
                    ) : (
                      <Input id="phoneNo" value={currentPerson.phoneNo || "N/A"} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    {isEditMode ? (
                      <Select
                        value={editFormData.nationality}
                        onValueChange={(value) => handleEditSelectChange(value, "nationality")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Malaysian">Malaysian</SelectItem>
                          <SelectItem value="Singaporean">Singaporean</SelectItem>
                          <SelectItem value="Indonesian">Indonesian</SelectItem>
                          <SelectItem value="Thai">Thai</SelectItem>
                          <SelectItem value="Filipino">Filipino</SelectItem>
                          <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                          <SelectItem value="Myanmar">Myanmar</SelectItem>
                          <SelectItem value="Cambodian">Cambodian</SelectItem>
                          <SelectItem value="Laotian">Laotian</SelectItem>
                          <SelectItem value="Bruneian">Bruneian</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
                          <SelectItem value="Indian">Indian</SelectItem>
                          <SelectItem value="Bangladeshi">Bangladeshi</SelectItem>
                          <SelectItem value="Pakistani">Pakistani</SelectItem>
                          <SelectItem value="Sri Lankan">Sri Lankan</SelectItem>
                          <SelectItem value="Nepalese">Nepalese</SelectItem>
                          <SelectItem value="American">American</SelectItem>
                          <SelectItem value="British">British</SelectItem>
                          <SelectItem value="Australian">Australian</SelectItem>
                          <SelectItem value="Canadian">Canadian</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="nationality" value={currentPerson.nationality || "N/A"} readOnly />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="idNo">ID No.</Label>
                    <Input id="idNo" value={currentPerson.idNo} readOnly className="bg-gray-50" />
                  </div>
                  {(currentPerson.idType === "Passport No." || editFormData.idType === "Passport No.") && (
                    <>
                      <div>
                        <Label htmlFor="issuedCountry">Issued Country</Label>
                        {isEditMode ? (
                          <Select
                            value={editFormData.issuedCountry}
                            onValueChange={(value) => handleEditSelectChange(value, "issuedCountry")}
                          >
                            <SelectTrigger>
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
                        ) : (
                          <Input id="issuedCountry" value={currentPerson.issuedCountry || "N/A"} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        {isEditMode ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !editFormData.expiryDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editFormData.expiryDate
                                  ? format(editFormData.expiryDate, "PPP")
                                  : "Select expiry date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={editFormData.expiryDate}
                                onSelect={(date) => handleEditDateChange(date, "expiryDate")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Input
                            id="expiryDate"
                            value={
                              currentPerson.expiryDate ? new Date(currentPerson.expiryDate).toLocaleDateString() : "N/A"
                            }
                            readOnly
                          />
                        )}
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="disabilityStatus">Disability Status</Label>
                    {isEditMode ? (
                      <Select
                        value={editFormData.disabilityStatus}
                        onValueChange={(value) => handleEditSelectChange(value, "disabilityStatus")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Disability Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="disabilityStatus" value={currentPerson.disabilityStatus || "N/A"} readOnly />
                    )}
                  </div>
                  {(currentPerson.disabilityStatus === "Yes" || editFormData.disabilityStatus === "Yes") && (
                    <div>
                      <Label htmlFor="specifyDisability">Specify Disability</Label>
                      {isEditMode ? (
                        <Input
                          id="specifyDisability"
                          value={editFormData.specifyDisability}
                          onChange={handleEditInputChange}
                        />
                      ) : (
                        <Input id="specifyDisability" value={currentPerson.specifyDisability || "N/A"} readOnly />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {editFormData.addresses && editFormData.addresses.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">Addresses</Label>
                    {isEditMode && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddAddress}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        + Add Address
                      </Button>
                    )}
                  </div>
                  {editFormData.addresses.map((addressItem, index) => (
                    <Card key={index} className="p-4 border-dashed border-gray-200 bg-gray-50">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Street Address</Label>
                          {isEditMode ? (
                            <Input
                              placeholder="Enter Street Address"
                              value={addressItem.streetAddress}
                              onChange={(e) => handleAddressChange(index, "streetAddress", e.target.value)}
                            />
                          ) : (
                            <Input value={addressItem.streetAddress || "N/A"} readOnly />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Postcode</Label>
                          {isEditMode ? (
                            <Input
                              placeholder="Enter Postcode"
                              value={addressItem.postcode}
                              onChange={(e) => handleAddressChange(index, "postcode", e.target.value)}
                            />
                          ) : (
                            <Input value={addressItem.postcode || "N/A"} readOnly />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">City</Label>
                          {isEditMode ? (
                            <Input
                              placeholder="Enter City"
                              value={addressItem.city}
                              onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                            />
                          ) : (
                            <Input value={addressItem.city || "N/A"} readOnly />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">State</Label>
                          {isEditMode ? (
                            <Input
                              placeholder="Enter State"
                              value={addressItem.state}
                              onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                            />
                          ) : (
                            <Input value={addressItem.state || "N/A"} readOnly />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Country</Label>
                          {isEditMode ? (
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
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input value={addressItem.country || "N/A"} readOnly />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Address Type</Label>
                          {isEditMode ? (
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
                          ) : (
                            <Input value={addressItem.type || "N/A"} readOnly />
                          )}
                        </div>
                      </div>
                      {isEditMode && editFormData.addresses && editFormData.addresses.length > 1 && (
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
              )}

              {/* Health Info Section */}
              <div className="mt-6 space-y-4">
                <h3 className="text-xl font-semibold text-slate-800">Health Info</h3>
                <Card className="p-6 border-dashed border-gray-200 bg-gray-50">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Disability Status</Label>
                      {isEditMode ? (
                        <Select
                          value={editFormData.disabilityStatus}
                          onValueChange={(value) => handleEditSelectChange(value, "disabilityStatus")}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Disability Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input id="disabilityStatus" value={currentPerson.disabilityStatus || "N/A"} readOnly />
                      )}
                    </div>

                    {(currentPerson.disabilityStatus === "Yes" || editFormData.disabilityStatus === "Yes") && (
                      <div className="space-y-2">
                        <Label htmlFor="specifyDisability" className="text-sm font-medium text-slate-700">
                          Specify Disability
                        </Label>
                        {isEditMode ? (
                          <Input
                            id="specifyDisability"
                            placeholder="Enter Disability Details"
                            className="w-full"
                            value={editFormData.specifyDisability}
                            onChange={handleEditInputChange}
                          />
                        ) : (
                          <Input id="specifyDisability" value={currentPerson.specifyDisability || "N/A"} readOnly />
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Allergies Type</Label>
                      {isEditMode ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {editFormData.allergiesType && editFormData.allergiesType.length > 0
                                ? editFormData.allergiesType.join(", ")
                                : "Select allergy types"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <div className="flex flex-col p-2">
                              {ALLERGY_OPTIONS.map((option) => (
                                <div key={option} className="flex items-center space-x-2 p-1">
                                  <Checkbox
                                    id={`allergy-${option}`}
                                    checked={editFormData.allergiesType?.includes(option)}
                                    onCheckedChange={(checked) =>
                                      handleEditAllergiesTypeChange(option, checked as boolean)
                                    }
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
                      ) : (
                        <Input
                          id="allergiesType"
                          value={
                            currentPerson.allergiesType && currentPerson.allergiesType.length > 0
                              ? currentPerson.allergiesType.join(", ")
                              : "N/A"
                          }
                          readOnly
                        />
                      )}
                    </div>
                    {(currentPerson.allergiesType && currentPerson.allergiesType.length > 0) ||
                    (editFormData.allergiesType && editFormData.allergiesType.length > 0) ? (
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Specify Allergies</Label>
                        {(isEditMode ? editFormData.allergiesType : currentPerson.allergiesType)?.map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <Label
                              htmlFor={`allergy-detail-${type}`}
                              className="text-sm font-medium text-slate-600 w-24"
                            >
                              {type}:
                            </Label>
                            {isEditMode ? (
                              <Input
                                id={`allergy-detail-${type}`}
                                placeholder={`Specify ${type} allergy`}
                                className="flex-1"
                                value={editFormData.allergiesDetails?.[type] || ""}
                                onChange={(e) => handleEditAllergyDetailChange(type, e.target.value)}
                              />
                            ) : (
                              <Input value={currentPerson.allergiesDetails?.[type] || "N/A"} readOnly />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center space-x-2">
                      {isEditMode ? (
                        <Checkbox
                          id="smoker"
                          checked={editFormData.smoker}
                          onCheckedChange={(checked) => handleEditCheckboxChange(checked as boolean, "smoker")}
                        />
                      ) : (
                        <Checkbox id="smoker" checked={currentPerson.smoker} disabled />
                      )}
                      <Label htmlFor="smoker" className="text-sm font-medium text-slate-700">
                        Smoker
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isEditMode ? (
                        <Checkbox
                          id="alcoholConsumption"
                          checked={editFormData.alcoholConsumption}
                          onCheckedChange={(checked) =>
                            handleEditCheckboxChange(checked as boolean, "alcoholConsumption")
                          }
                        />
                      ) : (
                        <Checkbox id="alcoholConsumption" checked={currentPerson.alcoholConsumption} disabled />
                      )}
                      <Label htmlFor="alcoholConsumption" className="text-sm font-medium text-slate-700">
                        Alcohol Consumption
                      </Label>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="familyMemberInfo">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Family Member Information</CardTitle>
            </CardHeader>
            <CardContent>
              {familyMembers.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {familyMembers.length} family member{familyMembers.length > 1 ? "s" : ""} found
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID No.</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Person ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Relationship</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {familyMembers.map((familyMember, index) => (
                          <tr key={familyMember.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{familyMember.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{familyMember.idNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{familyMember.personId}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">{familyMember.relationshipToMain}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant={familyMember.status === "Active" ? "default" : "secondary"}>
                                {familyMember.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No family member information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="membershipList">
          <div className="space-y-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Membership List</CardTitle>
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveOrder}
                    disabled={isSavingOrder}
                    className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Save className="h-4 w-4" />
                    {isSavingOrder ? "Saving Order..." : "Save Order"}
                  </Button>
                </div>

                {saveOrderSuccess && (
                  <Alert className="border-green-200 bg-green-50 mb-4">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Membership order has been successfully updated.
                    </AlertDescription>
                  </Alert>
                )}

                {saveOrderError && (
                  <Alert className="border-red-200 bg-red-50 mb-4">
                    <AlertDescription className="text-red-800">{saveOrderError}</AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                {orderedMembershipList.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">No</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Special Tag</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Membership No.</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Plan Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Plan Code</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Effective Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Expiry Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Person Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Priority</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orderedMembershipList.map((membership, index) => (
                          <tr
                            key={membership.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragEnd={handleDrop}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={`hover:bg-gray-50 cursor-grab ${
                              selectedMembership && selectedMembership.id === membership.id ? "bg-gray-100" : ""
                            } ${dragOverItem.current === index ? "border-2 border-blue-500" : ""}`}
                            onClick={() => handleMembershipSelect(membership)}
                          >
                            <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">{membership.specialTag}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {generateOnboardingMembershipNo(membership, index)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{membership.planName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{membership.planCode}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{membership.effectiveDate}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{membership.expiryDate}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">{membership.personType}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{membership.priority}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{membership.companyName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No membership information available for this person.</p>
                )}
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="dependent">Family Member</TabsTrigger>
                <TabsTrigger value="visitHistoryUtilization">Utilization</TabsTrigger>
                <TabsTrigger value="visitHistory">Visit History</TabsTrigger>
                <TabsTrigger value="personJourney">Person Journey</TabsTrigger>
                <TabsTrigger value="bankInfo">Bank Info</TabsTrigger>
                <TabsTrigger value="employmentInfo">Employment Info</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="membership">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Success/Error Messages for Membership */}
                    {membershipSaveSuccess && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Membership information has been successfully updated.
                        </AlertDescription>
                      </Alert>
                    )}

                    {membershipSaveError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{membershipSaveError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="planName">Plan Name</Label>
                        {isMembershipEditMode ? (
                          <Input
                            id="planName"
                            value={editMembershipData.planName}
                            onChange={handleMembershipInputChange}
                          />
                        ) : (
                          <Input id="planName" value={selectedMembership?.planName || ""} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="planCode">Plan Code</Label>
                        {isMembershipEditMode ? (
                          <Input
                            id="planCode"
                            value={editMembershipData.planCode}
                            onChange={handleMembershipInputChange}
                          />
                        ) : (
                          <Input id="planCode" value={selectedMembership?.planCode || ""} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        {isMembershipEditMode ? (
                          <Input
                            id="effectiveDate"
                            type="date"
                            value={editMembershipData.effectiveDate}
                            onChange={handleMembershipInputChange}
                          />
                        ) : (
                          <Input id="effectiveDate" value={selectedMembership?.effectiveDate || ""} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        {isMembershipEditMode ? (
                          <Input
                            id="expiryDate"
                            type="date"
                            value={editMembershipData.expiryDate}
                            onChange={handleMembershipInputChange}
                          />
                        ) : (
                          <Input id="expiryDate" value={selectedMembership?.expiryDate || ""} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="membershipNo">Membership No.</Label>
                        <Input
                          id="membershipNo"
                          value={selectedMembership ? generateOnboardingMembershipNo(selectedMembership, 0) : ""}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        {isMembershipEditMode ? (
                          <Input
                            id="company"
                            value={editMembershipData.company}
                            onChange={handleMembershipInputChange}
                          />
                        ) : (
                          <Input id="company" value={selectedMembership?.companyName || ""} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="personType">Person Type</Label>
                        {isMembershipEditMode ? (
                          <Select
                            value={editMembershipData.personType}
                            onValueChange={(value) => handleMembershipSelectChange(value, "personType")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Person Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Employee">Employee</SelectItem>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Child">Child</SelectItem>
                              <SelectItem value="Parent">Parent</SelectItem>
                              <SelectItem value="Dependent">Dependent</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input id="personType" value={selectedMembership?.personType || ""} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="policyNo">Policy No.</Label>
                        {isMembershipEditMode ? (
                          <Input
                            id="policyNo"
                            value={editMembershipData.policyNo}
                            onChange={handleMembershipInputChange}
                          />
                        ) : (
                          <Input id="policyNo" value={selectedMembership?.policyNo || ""} readOnly />
                        )}
                      </div>
                      {/* Add the Priority field here */}
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        {isMembershipEditMode ? (
                          <Select
                            value={editMembershipData.priority}
                            onValueChange={(value) => handleMembershipSelectChange(value, "priority")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Primary">Primary</SelectItem>
                              <SelectItem value="Secondary">Secondary</SelectItem>
                              <SelectItem value="Tertiary">Tertiary</SelectItem>
                              <SelectItem value="Quaternary">Quaternary</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input id="priority" value={selectedMembership?.priority || "N/A"} readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="membershipStatus">Membership Status</Label>
                        {isMembershipEditMode ? (
                          <Select
                            value={editMembershipData.membershipStatus}
                            onValueChange={(value) => handleMembershipSelectChange(value, "membershipStatus")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Suspended">Suspended</SelectItem>
                              <SelectItem value="Terminated">Terminated</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input id="membershipStatus" value="Active" readOnly />
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Service Type Coverage</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {serviceTypeCoverages.map((serviceType) => (
                          <Badge key={serviceType} variant="secondary">
                            {serviceTypeMapping[serviceType] || serviceType}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Service Type Combinations</Label>
                      <p className="text-sm text-muted-foreground">No combinations available.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="limitType">Limit Type</Label>
                        {isMembershipEditMode ? (
                          <Select
                            value={editMembershipData.limitType}
                            onValueChange={(value) => handleMembershipSelectChange(value, "limitType")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Limit Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Annual">Annual</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Per Visit">Per Visit</SelectItem>
                              <SelectItem value="Lifetime">Lifetime</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input id="limitType" value="Annual" readOnly />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="limitAmount">Limit Amount</Label>
                        {isMembershipEditMode ? (
                          <Input
                            id="limitAmount"
                            value={editMembershipData.limitAmount}
                            onChange={handleMembershipInputChange}
                          />
                        ) : (
                          <Input id="limitAmount" value="10,000" readOnly />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dependent">
                <Card>
                  <CardHeader>
                    <CardTitle>Family Member Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMembership && selectedMembership.familyMembers.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {selectedMembership.familyMembers.length} family member
                          {selectedMembership.familyMembers.length > 1 ? "s" : ""} covered under this membership
                        </p>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID No.</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Person ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Relationship</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                  Membership No.
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedMembership.familyMembers.map((familyMember, index) => (
                                <tr
                                  key={familyMember.personId}
                                  className="hover:bg-gray-50 cursor-pointer"
                                  onClick={() => handleFamilyMemberClick(familyMember)}
                                >
                                  <td className="px-4 py-3 text-sm text-gray-900">{familyMember.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{familyMember.idNo}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{familyMember.personId}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <Badge variant="outline">{familyMember.relationship}</Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <Badge variant={familyMember.status === "Active" ? "default" : "secondary"}>
                                      {familyMember.status}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {selectedMembership
                                      ? generateFamilyMemberMembershipNo(selectedMembership, 0, index)
                                      : "N/A"}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{selectedMembership.companyName}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No family member information available for this membership.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="visitHistoryUtilization">
                <Card>
                  <CardHeader>
                    <CardTitle>Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Provider</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Service Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">2024-01-15</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Sunway Medical Centre</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">GP</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">RM 150.00</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="default">Approved</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">2024-01-10</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Dental Clinic KL</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">DT</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">RM 220.00</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="default">Approved</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">2024-01-05</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Optical Shop</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">OC</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">RM 50.00</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="default">Approved</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="personJourney">
                <Card>
                  <CardHeader>
                    <CardTitle>Person Journey</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="text-sm text-gray-600">2024-01-01</div>
                        <div className="font-medium">Policy Activation</div>
                        <div className="text-sm text-gray-700">Policy activated for {currentPerson.name}</div>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <div className="text-sm text-gray-600">2024-01-15</div>
                        <div className="font-medium">First Medical Visit</div>
                        <div className="text-sm text-gray-700">Visited Sunway Medical Centre for GP consultation</div>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-4">
                        <div className="text-sm text-gray-600">2024-01-20</div>
                        <div className="font-medium">Claim Processed</div>
                        <div className="text-sm text-gray-700">Claim for RM 150.00 approved and processed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="bankInfo">
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" value="Maybank" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" value="1234567890" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="accountHolder">Account Holder</Label>
                        <Input id="accountHolder" value={currentPerson.name} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="branchCode">Branch Code</Label>
                        <Input id="branchCode" value="MBB001" readOnly />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="employmentInfo">
                <Card>
                  <CardHeader>
                    <CardTitle>Employment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Create dummy employment data for Ahmad Farid */}
                    {currentPerson.name === "Ahmad Farid bin Abdullah" ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="designation">Designation</Label>
                          <Input id="designation" value="Senior Software Engineer" readOnly />
                        </div>
                        <div>
                          <Label htmlFor="jobGrade">Job Grade</Label>
                          <Input id="jobGrade" value="Grade 7" readOnly />
                        </div>
                        <div>
                          <Label htmlFor="employmentType">Employment Type</Label>
                          <Input id="employmentType" value="Permanent" readOnly />
                        </div>
                        <div>
                          <Label htmlFor="staffCategory">Staff Category</Label>
                          <Input id="staffCategory" value="Technical" readOnly />
                        </div>
                        <div>
                          <Label htmlFor="workingStatus">Working Status</Label>
                          <Input id="workingStatus" value="Active" readOnly />
                        </div>
                      </div>
                    ) : employmentInfo ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="designation">Designation</Label>
                          <Input id="designation" value={employmentInfo.position || "N/A"} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="jobGrade">Job Grade</Label>
                          <Input id="jobGrade" value={employmentInfo.jobGrade || "N/A"} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="employmentType">Employment Type</Label>
                          <Input id="employmentType" value={employmentInfo.status || "N/A"} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="staffCategory">Staff Category</Label>
                          <Input id="staffCategory" value={employmentInfo.department || "N/A"} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="workingStatus">Working Status</Label>
                          <Input id="workingStatus" value={employmentInfo.workingStatus || "Active"} readOnly />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No employment information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Person Overview</h3>
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <span className="text-sm text-gray-600">Name:</span>
                            <p className="font-medium">{currentPerson.name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Person ID:</span>
                            <p className="font-medium">{currentPerson.personId}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Status:</span>
                            <Badge variant={currentPerson.status === "Active" ? "default" : "secondary"}>
                              {currentPerson.status}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Person Type:</span>
                            <p className="font-medium">{currentPerson.personType}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Membership Summary</h3>
                        <p className="text-sm text-gray-600 mb-2">Total Memberships: {orderedMembershipList.length}</p>
                        {orderedMembershipList.length > 0 && (
                          <div className="space-y-2">
                            {orderedMembershipList.map((membership, index) => (
                              <div key={membership.id} className="border rounded p-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{membership.planName}</p>
                                    <p className="text-sm text-gray-600">{membership.planCode}</p>
                                  </div>
                                  <Badge variant="outline">{membership.personType}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Family Members</h3>
                        <p className="text-sm text-gray-600 mb-2">Total Family Members: {familyMembers.length}</p>
                        {familyMembers.length > 0 && (
                          <div className="space-y-2">
                            {familyMembers.map((familyMember) => (
                              <div key={familyMember.id} className="border rounded p-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{familyMember.name}</p>
                                    <p className="text-sm text-gray-600">{familyMember.personId}</p>
                                  </div>
                                  <Badge variant="outline">{familyMember.relationshipToMain}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
