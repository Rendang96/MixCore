"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Upload, CalendarIcon, PlusCircle, MinusCircle, FileText } from "lucide-react"
import { getPersons, initializeSampleData, type Person as StoredPerson } from "@/lib/person/person-storage"
import { useCorporateClientForm, type MemberEntry } from "@/contexts/corporate-client-form-context" // Updated import
import { getPlans, type Plan } from "@/lib/plan/plan-storage"
import { toast } from "@/components/ui/use-toast"
import { MemberBulkMappingModal } from "@/components/onboarding/member-bulk-mapping-modal" // Import the new modal

interface MemberStepProps {
  onNext: () => void
  onPrevious: () => void
  onCancel: () => void
}

// Storage key for localStorage
const STORAGE_KEY = "corporateClientMemberStep"

export function MemberStep({ onNext, onPrevious, onCancel }: MemberStepProps) {
  const { formData, updateFormData } = useCorporateClientForm()
  const [personSuggestions, setPersonSuggestions] = useState<StoredPerson[]>([])
  const [showPersonSuggestions, setShowPersonSuggestions] = useState<{ [key: string]: boolean }>({})
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [currentProviderId, setCurrentProviderId] = useState<string>("")
  const [currentMemberId, setCurrentMemberId] = useState<string>("")
  const [activeProviderTab, setActiveProviderTab] = useState("clinics")
  const [providerSearchQuery, setProviderSearchQuery] = useState("")
  const [memberIsDragging, setMemberIsDragging] = useState(false)
  const personSuggestionsRef = useRef<HTMLDivElement>(null)
  const memberFileInputRef = useRef<HTMLInputElement>(null)

  const [showDependentModal, setShowDependentModal] = useState(false)
  const [currentDependentMemberId, setCurrentDependentMemberId] = useState<string>("")
  const [selectedDependents, setSelectedDependents] = useState<string[]>([])

  const [savedMembers, setSavedMembers] = useState<MemberEntry[]>([])
  const [currentMember, setCurrentMember] = useState<MemberEntry>({
    id: "member-1",
    personId: "",
    personName: "",
    idNumber: "",
    membershipId: "",
    staffId: "",
    personType: "",
    employeePersonId: "",
    designation: "",
    jobGrade: "",
    employmentType: "",
    staffCategory: "",
    joinedDate: undefined,
    startDate: undefined,
    endDate: undefined,
    setupProvider: "",
    specialTags: [],
    medicalProviders: [
      {
        id: "medical-provider-1",
        serviceTypes: [],
        panelship: "",
        providerTypes: [],
      },
    ],
    planName: "",
    planCode: "",
    planEffectiveDate: undefined,
    planExpiryDate: undefined,
    dependentCovered: "",
    selectedDependents: [],
    remarks: "",
    dateOfBirth: undefined,
    gender: "",
    isDisabled: false,
    email: "",
    phoneNo: "",
    address: "",
    postcode: "",
    city: "",
    state: "",
    country: "",
    unit: "",
    department: "",
    memberEmploymentStatus: "",
    dependentInfo: {
      name: "",
      nricPassport: "",
      relationship: "",
      dateOfBirth: undefined,
      gender: "",
      isDisabled: false,
      address: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
      phoneNo: "",
      email: "",
    },
  })
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([])

  const [bulkUploadedMembers, setBulkUploadedMembers] = useState<MemberEntry[]>([])
  const [bulkUploadRecords, setBulkUploadRecords] = useState<
    Array<{
      id: string
      batchId: string
      totalRecords: number
      status: string
      uploadDate: string
    }>
  >([])

  const [viewingBulkRecord, setViewingBulkRecord] = useState<string | null>(null)
  const [viewingBulkMembers, setViewingBulkMembers] = useState<MemberEntry[]>([])

  // Add state for tracking if data has been loaded from localStorage
  const [dataLoaded, setDataLoaded] = useState(false)
  // Use ref to track if we need to save (avoids triggering re-renders)
  const needsSaveRef = useRef(false)
  // Add debounce timer ref for auto-save
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // New states for CSV mapping
  const [showMappingModal, setShowMappingModal] = useState(false)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRawData, setCsvRawData] = useState<string[][]>([])
  const [csvPreviewData, setCsvPreviewData] = useState<string[][]>([])

  // Add a new state variable to control the visibility of the bulk uploaded members section:
  const [showBulkUploadedMembers, setShowBulkUploadedMembers] = useState(true)

  // Dropdown options
  const designationOptions = [
    { value: "business-analyst", label: "Business Analyst" },
    { value: "human-resource", label: "Human Resource" },
    { value: "software-engineer", label: "Software Engineer" },
    { value: "administrative-assistant", label: "Administrative Assistant" },
    { value: "cfo", label: "Chief Financial Officer (CFO)" },
  ]

  const jobGradeOptions = [
    { value: "grade-1", label: "Grade 1" },
    { value: "grade-2", label: "Grade 2" },
    { value: "grade-3", label: "Grade 3" },
    { value: "grade-4", label: "Grade 4" },
    { value: "grade-5", label: "Grade 5" },
  ]

  const employmentTypeOptions = [
    { value: "permanent", label: "Permanent" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "part-time", label: "Part-time" },
  ]

  const staffCategoryOptions = [
    { value: "management", label: "Management" },
    { value: "executive", label: "Executive" },
    { value: "senior-executive", label: "Senior Executive" },
    { value: "non-executive", label: "Non-Executive" },
    { value: "support", label: "Support" },
  ]

  const medicalServiceTypeOptions = [
    { value: "GP", label: "GP" },
    { value: "SP", label: "SP" },
    { value: "OC", label: "OC" },
    { value: "DT", label: "DT" },
    { value: "MT", label: "MT" },
  ]

  const panelshipOptions = [
    { value: "all", label: "All" },
    { value: "panel-only", label: "Panel Only" },
    { value: "select-access", label: "Select Access" },
  ]

  const providerTypeOptions = [
    { value: "all", label: "All" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "corporatized", label: "Corporatized" },
  ]

  const specialTagOptions = [
    { value: "vip", label: "VIP" },
    { value: "preferred-vip", label: "Preferred VIP" },
    { value: "handle-with-care", label: "Handle with Care" },
    { value: "special-approval", label: "Special Approval" },
    { value: "ltm", label: "LTM" },
  ]

  // Expected fields for CSV mapping (updated as per user's request)
  const expectedFields = [
    { value: "personName", label: "Employee Name", required: true },
    { value: "idNumber", label: "NRIC/Passport No.", required: true },
    { value: "dateOfBirth", label: "Date of Birth (YYYY-MM-DD)", required: true },
    { value: "gender", label: "Gender", required: true },
    { value: "isDisabled", label: "Disable? (Yes/No)" },
    { value: "email", label: "Email" },
    { value: "phoneNo", label: "Phone No." },
    { value: "address", label: "Address" },
    { value: "postcode", label: "Postcode" },
    { value: "city", label: "City" },
    { value: "state", label: "State" },
    { value: "country", label: "Country" },
    { value: "staffId", label: "Staff ID" },
    { value: "joinedDate", label: "Joined Date (YYYY-MM-DD)" },
    { value: "designation", label: "Designation", required: false }, // Changed to false
    { value: "employmentType", label: "Employment Type", required: false }, // Changed to false
    { value: "jobGrade", label: "Job Grade", required: false }, // Changed to false
    { value: "staffCategory", label: "Staff Category", required: false }, // Changed to false
    { value: "unit", label: "Unit" },
    { value: "department", label: "Department" },
    { value: "memberEmploymentStatus", label: "Employment Status" },
    { value: "dependentInfo.name", label: "Dependent Name" },
    { value: "dependentInfo.nricPassport", label: "Dependent NRIC/Passport No.", required: true },
    { value: "dependentInfo.relationship", label: "Relationship", required: true },
    { value: "dependentInfo.dateOfBirth", label: "Dependent DOB (YYYY-MM-DD)", required: true },
    { value: "dependentInfo.gender", label: "Dependent Gender", required: true },
    { value: "dependentInfo.isDisabled", label: "Dependent Disable? (Yes/No)", required: true },
    { value: "dependentInfo.address", label: "Dependent Address" },
    { value: "dependentInfo.postcode", label: "Dependent Postcode" },
    { value: "dependentInfo.city", label: "Dependent City" },
    { value: "dependentInfo.state", label: "Dependent State" },
    { value: "dependentInfo.country", label: "Dependent Country" },
    { value: "dependentInfo.phoneNo", label: "Dependent Phone No." },
    { value: "dependentInfo.email", label: "Dependent Email" },
    // Existing fields that are not in the new list but might still be relevant for the template
    { value: "setupProvider", label: "Setup Provider (Yes/No)" },
    { value: "specialTags", label: "Special Tags (comma separated)" },
    { value: "medicalProviderServiceTypes", label: "Medical Provider Service Types (comma separated)" },
    { value: "medicalProviderPanelship", label: "Medical Provider Panelship" },
    { value: "medicalProviderProviderTypes", label: "Medical Provider Provider Types (comma separated)" },
    { value: "planName", label: "Plan Name" },
    { value: "planCode", label: "Plan Code" },
    { value: "planEffectiveDate", label: "Plan Effective Date (YYYY-MM-DD)" },
    { value: "planExpiryDate", label: "Plan Expiry Date (YYYY-MM-DD)" },
    { value: "dependentCovered", label: "Dependent Covered (Yes/No)" },
    { value: "selectedDependents", label: "Selected Dependents (comma separated IDs)" },
    { value: "remarks", label: "Remarks" },
  ]

  // Provider data for the modal
  const providerData = {
    clinics: [
      {
        id: "clinic-1",
        name: "City Medical Clinic",
        code: "CMC001",
        location: "Downtown",
        state: "Kuala Lumpur",
        phone: "+1-555-0101",
        hours: "8AM-6PM",
        status: "Active",
      },
      {
        id: "clinic-2",
        name: "Family Health Center",
        code: "FHC002",
        location: "Suburbs",
        state: "Selangor",
        phone: "+1-555-0102",
        hours: "9AM-5PM",
        status: "Active",
      },
      {
        id: "clinic-3",
        name: "Quick Care Clinic",
        code: "QCC003",
        location: "Mall District",
        state: "Kuala Lumpur",
        phone: "+1-555-0103",
        hours: "10AM-8PM",
        status: "Active",
      },
      {
        id: "clinic-4",
        name: "Community Health Clinic",
        code: "CHC004",
        location: "East Side",
        state: "Johor",
        phone: "+1-555-0104",
        hours: "7AM-7PM",
        status: "Active",
      },
    ],
    hospitals: [
      {
        id: "hospital-1",
        name: "General Hospital",
        code: "GH001",
        location: "Medical District",
        state: "Kuala Lumpur",
        phone: "+1-555-0201",
        hours: "24/7",
        status: "Active",
      },
      {
        id: "hospital-2",
        name: "Regional Medical Center",
        code: "RMC002",
        location: "North Side",
        state: "Penang",
        phone: "+1-555-0202",
        hours: "24/7",
        status: "Active",
      },
    ],
    pharmacies: [
      {
        id: "pharmacy-1",
        name: "Central Pharmacy",
        code: "CP001",
        location: "Main Street",
        state: "Kuala Lumpur",
        phone: "+1-555-0301",
        hours: "8AM-10PM",
        status: "Active",
      },
      {
        id: "pharmacy-2",
        name: "Health Plus Pharmacy",
        code: "HPP002",
        location: "Shopping Center",
        state: "Selangor",
        phone: "+1-555-0302",
        hours: "9AM-9PM",
        status: "Active",
      },
    ],
    dentists: [
      {
        id: "dentist-1",
        name: "Smile Dental Clinic",
        code: "SDC001",
        location: "Business District",
        state: "Kuala Lumpur",
        phone: "+1-555-0401",
        hours: "8AM-5PM",
        status: "Active",
      },
      {
        id: "dentist-2",
        name: "Family Dentistry",
        code: "FD002",
        location: "Residential Area",
        state: "Johor",
        phone: "+1-555-0402",
        hours: "9AM-6PM",
        status: "Active",
      },
    ],
    physiotherapy: [
      {
        id: "physio-1",
        name: "Recovery Center",
        code: "RC001",
        location: "Sports Complex",
        state: "Kuala Lumpur",
        phone: "+1-555-0501",
        hours: "7AM-8PM",
        status: "Active",
      },
      {
        id: "physio-2",
        name: "Wellness Physiotherapy",
        code: "WP002",
        location: "Health Plaza",
        state: "Penang",
        phone: "+1-555-0502",
        hours: "8AM-7PM",
        status: "Active",
      },
    ],
  }

  // Function to save data to localStorage - memoized to prevent recreation
  const saveToLocalStorage = useCallback(() => {
    if (!dataLoaded) return // Don't save until initial data is loaded

    try {
      // NEW:
      const dataToSave = {
        memberEntries: formData.memberEntries, // Save the combined list directly from context
        memberTabValue: formData.memberTabValue,
        selectedProviders: formData.selectedProviders,
        // Keep other internal states if they need to persist for the member step itself
        savedMembers: savedMembers,
        bulkUploadedMembers: bulkUploadedMembers,
        bulkUploadRecords: bulkUploadRecords,
        editingMemberId: editingMemberId,
        searchQuery: searchQuery,
        filterBy: filterBy,
        currentPage: currentPage,
        viewingBulkRecord: viewingBulkRecord,
        viewingBulkMembers: viewingBulkMembers,
        currentMember: currentMember,
        timestamp: new Date().toISOString(),
        showBulkUploadedMembers: showBulkUploadedMembers,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      needsSaveRef.current = false
      console.log("Member data saved to localStorage")
    } catch (error) {
      console.error("Error saving member data to localStorage:", error)
    }
  }, [
    formData.memberEntries,
    formData.memberTabValue,
    formData.selectedProviders,
    savedMembers,
    bulkUploadedMembers,
    bulkUploadRecords,
    editingMemberId,
    searchQuery,
    filterBy,
    currentPage,
    viewingBulkRecord,
    viewingBulkMembers,
    currentMember,
    dataLoaded,
    showBulkUploadedMembers,
  ])

  // Function to mark data as needing save
  const markForSave = useCallback(() => {
    if (!dataLoaded) return
    needsSaveRef.current = true

    // Debounce the save operation
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (needsSaveRef.current) {
        saveToLocalStorage()
      }
    }, 1000) // 1 second debounce
  }, [saveToLocalStorage, dataLoaded])

  // Function to clear localStorage data
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log("Member data cleared from localStorage")
    } catch (error) {
      console.error("Error clearing member data from localStorage:", error)
    }
  }, [])

  // Load data from localStorage on component mount only
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
          const parsedData = JSON.parse(savedData)

          // Restore dates properly
          if (parsedData.savedMembers) {
            parsedData.savedMembers = parsedData.savedMembers.map((member: MemberEntry) => ({
              ...member,
              joinedDate: member.joinedDate ? new Date(member.joinedDate) : undefined,
              startDate: member.startDate ? new Date(member.startDate) : undefined,
              endDate: member.endDate ? new Date(member.endDate) : undefined,
              planEffectiveDate: member.planEffectiveDate ? new Date(member.planEffectiveDate) : undefined,
              planExpiryDate: member.planExpiryDate ? new Date(member.planExpiryDate) : undefined,
              dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
              dependentInfo: member.dependentInfo
                ? {
                    ...member.dependentInfo,
                    dateOfBirth: member.dependentInfo.dateOfBirth
                      ? new Date(member.dependentInfo.dateOfBirth)
                      : undefined,
                  }
                : undefined,
            }))
          }

          if (parsedData.currentMember) {
            parsedData.currentMember = {
              ...parsedData.currentMember,
              joinedDate: parsedData.currentMember.joinedDate
                ? new Date(parsedData.currentMember.joinedDate)
                : undefined,
              startDate: parsedData.currentMember.startDate ? new Date(parsedData.currentMember.startDate) : undefined,
              endDate: parsedData.currentMember.endDate ? new Date(parsedData.currentMember.endDate) : undefined,
              planEffectiveDate: parsedData.currentMember.planEffectiveDate
                ? new Date(parsedData.currentMember.planEffectiveDate)
                : undefined,
              planExpiryDate: parsedData.currentMember.planExpiryDate
                ? new Date(parsedData.currentMember.planExpiryDate)
                : undefined,
              dateOfBirth: parsedData.currentMember.dateOfBirth
                ? new Date(parsedData.currentMember.dateOfBirth)
                : undefined,
              dependentInfo: parsedData.currentMember.dependentInfo
                ? {
                    ...parsedData.currentMember.dependentInfo,
                    dateOfBirth: parsedData.currentMember.dependentInfo.dateOfBirth
                      ? new Date(parsedData.currentMember.dependentInfo.dateOfBirth)
                      : undefined,
                  }
                : undefined,
            }
          }

          if (parsedData.bulkUploadedMembers) {
            parsedData.bulkUploadedMembers = parsedData.bulkUploadedMembers.map((member: MemberEntry) => ({
              ...member,
              joinedDate: member.joinedDate ? new Date(member.joinedDate) : undefined,
              startDate: member.startDate ? new Date(member.startDate) : undefined,
              endDate: member.endDate ? new Date(member.endDate) : undefined,
              planEffectiveDate: member.planEffectiveDate ? new Date(member.planEffectiveDate) : undefined,
              planExpiryDate: member.planExpiryDate ? new Date(member.planExpiryDate) : undefined,
              dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
              dependentInfo: member.dependentInfo
                ? {
                    ...member.dependentInfo,
                    dateOfBirth: member.dependentInfo.dateOfBirth
                      ? new Date(member.dependentInfo.dateOfBirth)
                      : undefined,
                  }
                : undefined,
            }))
          }

          if (parsedData.viewingBulkMembers) {
            parsedData.viewingBulkMembers = parsedData.viewingBulkMembers.map((member: MemberEntry) => ({
              ...member,
              joinedDate: member.joinedDate ? new Date(member.joinedDate) : undefined,
              startDate: member.startDate ? new Date(member.startDate) : undefined,
              endDate: member.endDate ? new Date(member.endDate) : undefined,
              planEffectiveDate: member.planEffectiveDate ? new Date(member.planEffectiveDate) : undefined,
              planExpiryDate: member.planExpiryDate ? new Date(parsedData.currentMember.planExpiryDate) : undefined,
              dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
              dependentInfo: member.dependentInfo
                ? {
                    ...member.dependentInfo,
                    dateOfBirth: member.dependentInfo.dateOfBirth
                      ? new Date(parsedData.currentMember.dependentInfo.dateOfBirth)
                      : undefined,
                  }
                : undefined,
            }))
          }

          // Set all the state variables
          setSavedMembers(parsedData.savedMembers || [])
          setCurrentMember(parsedData.currentMember || currentMember)
          setEditingMemberId(parsedData.editingMemberId || null)
          setSearchQuery(parsedData.searchQuery || "")
          setFilterBy(parsedData.filterBy || "all")
          setCurrentPage(parsedData.currentPage || 1)
          setBulkUploadedMembers(parsedData.bulkUploadedMembers || [])
          setBulkUploadRecords(parsedData.bulkUploadRecords || [])
          setViewingBulkRecord(parsedData.viewingBulkRecord || null)
          setViewingBulkMembers(parsedData.viewingBulkMembers || [])
          setShowBulkUploadedMembers(
            parsedData.showBulkUploadedMembers !== undefined ? parsedData.showBulkUploadedMembers : true,
          )

          // Update form context data
          updateFormData({
            memberTabValue: parsedData.memberTabValue || "single",
            selectedProviders: parsedData.selectedProviders || {},
            memberEntries: parsedData.memberEntries || [],
          })

          console.log("Member data loaded from localStorage")
          return true
        }
        return false
      } catch (error) {
        console.error("Error loading member data from localStorage:", error)
        return false
      }
    }

    // Initialize data
    initializeSampleData()
    const dataWasLoaded = loadFromLocalStorage()

    // Load available plans
    const plans = getPlans()
    setAvailablePlans(plans)

    // Mark as loaded
    setDataLoaded(true)

    // If no data was loaded, initialize with default values
    if (!dataWasLoaded) {
      const newId = `member-${Date.now()}`
      setCurrentMember({
        id: newId,
        personId: "",
        personName: "",
        idNumber: "",
        membershipId: "",
        staffId: "",
        personType: "",
        employeePersonId: "",
        designation: "",
        jobGrade: "",
        employmentType: "",
        staffCategory: "",
        joinedDate: undefined,
        startDate: undefined,
        endDate: undefined,
        setupProvider: "",
        specialTags: [],
        medicalProviders: [
          {
            id: "medical-provider-1",
            serviceTypes: [],
            panelship: "",
            providerTypes: [],
          },
        ],
        planName: "",
        planCode: "",
        planEffectiveDate: undefined,
        planExpiryDate: undefined,
        dependentCovered: "",
        selectedDependents: [],
        remarks: "",
        dateOfBirth: undefined,
        gender: "",
        isDisabled: false,
        email: "",
        phoneNo: "",
        address: "",
        postcode: "",
        city: "",
        state: "",
        country: "",
        unit: "",
        department: "",
        memberEmploymentStatus: "",
        dependentInfo: {
          name: "",
          nricPassport: "",
          relationship: "",
          dateOfBirth: undefined,
          gender: "",
          isDisabled: false,
          address: "",
          postcode: "",
          city: "",
          state: "",
          country: "",
          phoneNo: "",
          email: "",
        },
      })
    }
  }, []) // Empty dependency array - only run on mount

  // Auto-save effect - separate from initial load
  useEffect(() => {
    if (dataLoaded && needsSaveRef.current) {
      markForSave()
    }
  }, [
    savedMembers,
    currentMember,
    editingMemberId,
    searchQuery,
    filterBy,
    currentPage,
    bulkUploadedMembers,
    bulkUploadRecords,
    viewingBulkRecord,
    viewingBulkMembers,
    formData.memberTabValue,
    formData.selectedProviders,
    markForSave,
    dataLoaded,
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personSuggestionsRef.current && !personSuggestionsRef.current.contains(event.target as Node)) {
        setShowPersonSuggestions({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const searchPersons = (query: string, field: "personId" | "personName" | "idNumber", entryId: string) => {
    if (query.length >= 2) {
      const allPersons = getPersons()
      const filteredPersons = allPersons.filter((person) => {
        if (field === "personId") {
          return person.personId.toLowerCase().includes(query.toLowerCase())
        } else if (field === "personName") {
          return person.name.toLowerCase().includes(query.toLowerCase())
        } else if (field === "idNumber") {
          return person.idNo.toLowerCase().includes(query.toLowerCase())
        }
        return false
      })
      setPersonSuggestions(filteredPersons)
      setShowPersonSuggestions((prev) => ({ ...prev, [entryId]: true }))
    } else {
      setPersonSuggestions([])
      setShowPersonSuggestions((prev) => ({ ...prev, [entryId]: false }))
    }
  }

  const handleSelectPerson = (person: StoredPerson, entryId: string) => {
    const generateMembershipId = (person: StoredPerson) => {
      const nameParts = person.name.split(" ")
      const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("")
      const idSuffix = person.idNo.slice(-4) || person.personId.slice(-4)
      return `CM-${initials}-${idSuffix}-I`
    }

    const updatedEntries = formData.memberEntries.map((entry) =>
      entry.id === entryId
        ? {
            ...entry,
            personId: person.personId,
            personName: person.name,
            idNumber: person.idNo,
            membershipId: generateMembershipId(person),
          }
        : entry,
    )
    updateFormData({ memberEntries: updatedEntries })
    setShowPersonSuggestions((prev) => ({ ...prev, [entryId]: false }))
    needsSaveRef.current = true
  }

  const handleMemberInputChange = (id: string, field: string, value: string) => {
    const updatedEntries = formData.memberEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry,
    )
    updateFormData({ memberEntries: updatedEntries })
    needsSaveRef.current = true

    if (field === "personName") {
      searchPersons(value, field as "personId" | "personName" | "idNumber", id)
    }
  }

  const handleMemberEmploymentDateChange = (id: string, field: "startDate" | "endDate", value: Date | undefined) => {
    const updatedEntries = formData.memberEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry,
    )
    updateFormData({ memberEntries: updatedEntries })
    needsSaveRef.current = true
  }

  const handleMemberPlanDateChange = (
    id: string,
    field: "planEffectiveDate" | "planExpiryDate",
    value: Date | undefined,
  ) => {
    const updatedEntries = formData.memberEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry,
    )
    updateFormData({ memberEntries: updatedEntries })
    needsSaveRef.current = true
  }

  const handleSpecialTagChange = (memberId: string, tagValue: string, checked: boolean) => {
    const updatedEntries = formData.memberEntries.map((entry) => {
      if (entry.id === memberId) {
        const updatedTags = checked
          ? [...(entry.specialTags || []), tagValue]
          : (entry.specialTags || []).filter((tag) => tag !== tagValue)
        return { ...entry, specialTags: updatedTags }
      }
      return entry
    })
    updateFormData({ memberEntries: updatedEntries })
    needsSaveRef.current = true
  }

  const addMedicalProviderEntry = (memberId: string) => {
    const updatedEntries = formData.memberEntries.map((entry) => {
      if (entry.id === memberId) {
        const newProviderId = `medical-provider-${entry.medicalProviders.length + 1}`
        return {
          ...entry,
          medicalProviders: [
            ...entry.medicalProviders,
            {
              id: newProviderId,
              serviceTypes: [],
              panelship: "",
              providerTypes: [],
            },
          ],
        }
      }
      return entry
    })
    updateFormData({ memberEntries: updatedEntries })
    needsSaveRef.current = true
  }

  const removeMedicalProviderEntry = (memberId: string, providerId: string) => {
    const updatedEntries = formData.memberEntries.map((entry) => {
      if (entry.id === memberId && entry.medicalProviders.length > 1) {
        return {
          ...entry,
          medicalProviders: entry.medicalProviders.filter((provider) => provider.id !== providerId),
        }
      }
      return entry
    })
    updateFormData({ memberEntries: updatedEntries })
    needsSaveRef.current = true
  }

  const handleMedicalProviderChange = (providerId: string, field: string, value: string | string[]) => {
    if (field === "panelship" && value === "select-access") {
      setCurrentMemberId(currentMember.id)
      setCurrentProviderId(providerId)
      setShowProviderModal(true)
      return
    }

    setCurrentMember((prev) => {
      const updatedProviders = prev.medicalProviders.map((provider) => {
        if (provider.id === providerId) {
          return { ...provider, [field]: value }
        }
        return provider
      })
      return { ...prev, medicalProviders: updatedProviders }
    })
    needsSaveRef.current = true
  }

  const handleProviderSelection = (providerId: string, checked: boolean) => {
    const key = `${currentMemberId}-${currentProviderId}`
    const currentSelected = formData.selectedProviders[key] || []
    const updatedSelected = checked
      ? [...currentSelected, providerId]
      : currentSelected.filter((id) => id !== providerId)

    updateFormData({
      selectedProviders: { ...formData.selectedProviders, [key]: updatedSelected },
    })
    needsSaveRef.current = true
  }

  const handleProviderModalClose = () => {
    setShowProviderModal(false)
    setCurrentMemberId("")
    setCurrentProviderId("")
    setActiveProviderTab("clinics")
    setProviderSearchQuery("")
  }

  const handleProviderModalSave = () => {
    setCurrentMember((prev) => {
      const updatedProviders = prev.medicalProviders.map((provider) => {
        if (provider.id === currentProviderId) {
          return { ...provider, panelship: "select-access" }
        }
        return provider
      })
      return { ...prev, medicalProviders: updatedProviders }
    })
    needsSaveRef.current = true

    const tabs = ["clinics", "hospitals", "pharmacies", "dentists", "physiotherapy"]
    const currentTabIndex = tabs.indexOf(activeProviderTab)

    if (currentTabIndex < tabs.length - 1) {
      setActiveProviderTab(tabs[currentTabIndex + 1])
    } else {
      handleProviderModalClose()
    }
  }

  const handleProviderModalBack = () => {
    const tabs = ["clinics", "hospitals", "pharmacies", "dentists", "physiotherapy"]
    const currentTabIndex = tabs.indexOf(activeProviderTab)

    if (currentTabIndex > 0) {
      setActiveProviderTab(tabs[currentTabIndex - 1])
    } else {
      handleProviderModalClose()
    }
  }

  const getFilteredProviders = (providers: any[]) => {
    if (!providerSearchQuery) return providers

    const query = providerSearchQuery.toLowerCase()
    return providers.filter(
      (provider) =>
        provider.name.toLowerCase().includes(query) ||
        provider.code.toLowerCase().includes(query) ||
        provider.location.toLowerCase().includes(query) ||
        provider.state.toLowerCase().includes(query),
    )
  }

  const getSelectedProvidersForMember = (memberId: string, providerId: string) => {
    const key = `${memberId}-${providerId}`
    const selectedIds = formData.selectedProviders[key] || []

    const selectedByCategory = {
      clinics: [],
      hospitals: [],
      pharmacies: [],
      dentists: [],
      physiotherapy: [],
    }

    Object.entries(providerData).forEach(([category, providers]) => {
      selectedByCategory[category] = providers.filter((provider) => selectedIds.includes(provider.id))
    })

    return selectedByCategory
  }

  const removeProviderFromSelection = (memberId: string, providerId: string, providerToRemoveId: string) => {
    const key = `${memberId}-${providerToRemoveId}`
    const current = formData.selectedProviders[key] || []
    updateFormData({
      selectedProviders: {
        ...formData.selectedProviders,
        [key]: current.filter((id) => id !== providerToRemoveId),
      },
    })
    needsSaveRef.current = true
  }

  const addMemberEntry = () => {
    const newId = `member-${formData.memberEntries.length + 1}`
    const newEntry: MemberEntry = {
      id: newId,
      personId: "",
      personName: "",
      idNumber: "",
      membershipId: "",
      staffId: "",
      personType: "",
      employeePersonId: "",
      designation: "",
      jobGrade: "",
      employmentType: "",
      staffCategory: "",
      joinedDate: undefined,
      startDate: undefined,
      endDate: undefined,
      setupProvider: "",
      specialTags: [],
      medicalProviders: [
        {
          id: "medical-provider-1",
          serviceTypes: [],
          panelship: "",
          providerTypes: [],
        },
      ],
      planName: "",
      planCode: "",
      planEffectiveDate: undefined,
      planExpiryDate: undefined,
      dependentCovered: "",
      selectedDependents: [],
      remarks: "",
      dateOfBirth: undefined,
      gender: "",
      isDisabled: false,
      email: "",
      phoneNo: "",
      address: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
      unit: "",
      department: "",
      memberEmploymentStatus: "",
      dependentInfo: {
        name: "",
        nricPassport: "",
        relationship: "",
        dateOfBirth: undefined,
        gender: "",
        isDisabled: false,
        address: "",
        postcode: "",
        city: "",
        state: "",
        country: "",
        phoneNo: "",
        email: "",
      },
    }
    updateFormData({ memberEntries: [...formData.memberEntries, newEntry] })
    needsSaveRef.current = true
  }

  const removeMemberEntry = (id: string) => {
    if (formData.memberEntries.length > 1) {
      const updatedEntries = formData.memberEntries.filter((entry) => entry.id !== id)
      updateFormData({ memberEntries: updatedEntries })
      needsSaveRef.current = true
    }
  }

  const handleMemberBulkInputChange = (field: string, value: string) => {
    updateFormData({
      memberBulkData: { ...formData.memberBulkData, [field]: value },
    })
    needsSaveRef.current = true
  }

  const handleMemberFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      updateFormData({ memberSelectedFile: file })
      needsSaveRef.current = true

      const reader = new FileReader()
      reader.onload = (event) => {
        const csvText = event.target?.result as string
        const rows = csvText
          .split(/\r?\n/)
          .map((row) => row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))) // Basic CSV parsing

        if (rows.length > 0) {
          setCsvHeaders(rows[0])
          setCsvRawData(rows)
          setCsvPreviewData(rows.slice(0, 6)) // First row is header, plus 5 data rows
          setShowMappingModal(true)
        } else {
          toast({
            title: "File Error",
            description: "The selected CSV file is empty.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const handleMemberFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMemberIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      updateFormData({ memberSelectedFile: file })
      needsSaveRef.current = true

      const reader = new FileReader()
      reader.onload = (event) => {
        const csvText = event.target?.result as string
        const rows = csvText
          .split(/\r?\n/)
          .map((row) => row.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))) // Basic CSV parsing

        if (rows.length > 0) {
          setCsvHeaders(rows[0])
          setCsvRawData(rows)
          setCsvPreviewData(rows.slice(0, 6)) // First row is header, plus 5 data rows
          setShowMappingModal(true)
        } else {
          toast({
            title: "File Error",
            description: "The selected CSV file is empty.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const handleMemberDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMemberIsDragging(true)
  }

  const handleMemberDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setMemberIsDragging(false)
  }

  const handleMemberBulkUpload = () => {
    if (formData.memberSelectedFile) {
      // File already selected and processed by handleMemberFileSelect/Drop
      // The mapping modal should already be open
      console.log("File already selected, waiting for mapping confirmation.")
    } else {
      alert("Please select a file to upload first.")
    }
  }

  const triggerMemberFileInput = () => {
    if (memberFileInputRef.current) {
      memberFileInputRef.current.click()
    }
  }

  const handleSaveMember = () => {
    if (!isFormValid) return

    if (editingMemberId) {
      // Update existing member
      setSavedMembers((prev) => prev.map((member) => (member.id === editingMemberId ? { ...currentMember } : member)))
    } else {
      // Add new member
      setSavedMembers((prev) => [...prev, { ...currentMember }])
    }
    needsSaveRef.current = true

    // Reset form for next entry
    resetCurrentMemberForm()

    // Show success toast
    toast({
      title: "Member saved successfully",
      description: editingMemberId ? "Member has been updated" : "New member has been added",
    })
  }

  const handleEditMember = (member: MemberEntry) => {
    setCurrentMember({ ...member })
    setEditingMemberId(member.id)
    needsSaveRef.current = true
  }

  const handleViewMember = (member: MemberEntry) => {
    // You can implement a view modal here
    console.log("Viewing member:", member)
  }

  const handleDeleteMember = (memberId: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setSavedMembers((prev) => prev.filter((member) => member.id !== memberId))
      needsSaveRef.current = true

      toast({
        title: "Member deleted",
        description: "Member has been removed from the list",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingMemberId(null)
    resetCurrentMemberForm()
  }

  const resetCurrentMemberForm = () => {
    const newId = `member-${Date.now()}`
    setCurrentMember({
      id: newId,
      personId: "",
      personName: "",
      idNumber: "",
      membershipId: "",
      staffId: "",
      personType: "",
      employeePersonId: "",
      designation: "",
      jobGrade: "",
      employmentType: "",
      staffCategory: "",
      joinedDate: undefined,
      startDate: undefined,
      endDate: undefined,
      setupProvider: "",
      specialTags: [],
      medicalProviders: [
        {
          id: "medical-provider-1",
          serviceTypes: [],
          panelship: "",
          providerTypes: [],
        },
      ],
      planName: "",
      planCode: "",
      planEffectiveDate: undefined,
      planExpiryDate: undefined,
      dependentCovered: "",
      selectedDependents: [],
      remarks: "",
      dateOfBirth: undefined,
      gender: "",
      isDisabled: false,
      email: "",
      phoneNo: "",
      address: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
      unit: "",
      department: "",
      memberEmploymentStatus: "",
      dependentInfo: {
        name: "",
        nricPassport: "",
        relationship: "",
        dateOfBirth: undefined,
        gender: "",
        isDisabled: false,
        address: "",
        postcode: "",
        city: "",
        state: "",
        country: "",
        phoneNo: "",
        email: "",
      },
    })
  }

  const validateForm = () => {
    const isValid =
      currentMember.personName.trim() !== "" &&
      currentMember.personId.trim() !== "" &&
      currentMember.designation.trim() !== ""
    setIsFormValid(isValid)
  }

  const autoFillPlanInformation = () => {
    if (availablePlans.length > 0) {
      // Select a random plan from available active plans
      const activePlans = availablePlans.filter((plan) => plan.status === "Active")
      if (activePlans.length > 0) {
        const randomPlan = activePlans[Math.floor(Math.random() * activePlans.length)]

        // Get today's date and add 1 year for expiry
        const today = new Date()
        const expiryDate = new Date(today)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)

        setCurrentMember((prev) => ({
          ...prev,
          planName: randomPlan.name, // Set the actual plan name
          planCode: randomPlan.id, // Using plan ID as code
          planEffectiveDate: today,
          planExpiryDate: expiryDate,
        }))
        needsSaveRef.current = true
      }
    }
  }

  useEffect(() => {
    validateForm()
  }, [currentMember])

  const isEmploymentInfoComplete = () => {
    return (
      currentMember.designation && currentMember.jobGrade && currentMember.employmentType && currentMember.staffCategory
    )
  }

  const handleCurrentMemberInputChange = (field: string, value: string) => {
    setCurrentMember((prev) => ({ ...prev, [field]: value }))
    needsSaveRef.current = true

    if (field === "personName") {
      searchPersons(value, field as "personId" | "personName" | "idNumber", currentMember.id)
    }
  }

  const calculateEmploymentDuration = (joinedDate: Date | undefined): string => {
    if (!joinedDate) return "-"

    const today = new Date()
    const joined = new Date(joinedDate)

    const yearDiff = today.getFullYear() - joined.getFullYear()
    const monthDiff = today.getMonth() - joined.getMonth()

    let years = yearDiff
    let months = monthDiff

    // Adjust if months is negative
    if (months < 0) {
      years--
      months += 12
    }

    // Adjust for day of month
    if (today.getDate() < joined.getDate()) {
      months--
      if (months < 0) {
        years--
        months += 12
      }
    }

    if (years === 0) {
      return months === 1 ? `${months} month` : `${months} months`
    } else if (months === 0) {
      return years === 1 ? `${years} year` : `${years} years`
    } else {
      const yearText = years === 1 ? `${years} year` : `${years} years`
      const monthText = months === 1 ? `${months} month` : `${months} months`
      return `${yearText}, ${monthText}`
    }
  }

  const handleJoinedDateChange = (date: Date | undefined) => {
    setCurrentMember((prev) => ({ ...prev, joinedDate: date }))
    needsSaveRef.current = true
  }

  const renderMemberForm = (member: MemberEntry) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Details Section */}
        <div className="md:col-span-3 space-y-4 border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Person Membership</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor={`personId-${member.id}`} className="text-sm font-medium">
                Person ID
              </label>
              <input
                id={`personId-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter person ID"
                value={member.personId || ""}
                onChange={(e) => handleCurrentMemberInputChange("personId", e.target.value)}
              />
            </div>

            <div className="space-y-2 relative">
              <label htmlFor={`personName-${member.id}`} className="text-sm font-medium">
                Person Name
              </label>
              <input
                id={`personName-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter person name"
                value={member.personName || ""}
                onChange={(e) => handleCurrentMemberInputChange("personName", e.target.value)}
              />
              {showPersonSuggestions[member.id] && personSuggestions.length > 0 && (
                <div
                  ref={personSuggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {personSuggestions.map((person) => (
                    <div
                      key={person.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleSelectPerson(person, member.id)
                        setCurrentMember((prev) => ({
                          ...prev,
                          personId: person.personId,
                          personName: person.name,
                          idNumber: person.idNo,
                          membershipId: `CM-${person.name
                            .split(" ")
                            .map((part) => part.charAt(0).toUpperCase())
                            .join("")}-${person.idNo.slice(-4) || person.personId.slice(-4)}-I`,
                        }))
                      }}
                    >
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-gray-500">ID: {person.personId}</div>
                      <div className="text-sm text-gray-500">ID No: {person.idNo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor={`idNumber-${member.id}`} className="text-sm font-medium">
                ID Number
              </label>
              <input
                id={`idNumber-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ID number"
                value={member.idNumber || ""}
                onChange={(e) => handleCurrentMemberInputChange("idNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`membershipId-${member.id}`} className="text-sm font-medium">
                Membership ID
              </label>
              <input
                id={`membershipId-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Auto-generated when person is selected"
                value={member.membershipId || ""}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="md:col-span-3 space-y-4 border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Employment Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor={`staffId-${member.id}`} className="text-sm font-medium">
                Staff ID
              </label>
              <input
                id={`staffId-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter staff ID"
                value={member.staffId || ""}
                onChange={(e) => handleCurrentMemberInputChange("staffId", e.target.value)}
              />
            </div>

            {/* Joined Date */}
            <div className="space-y-2">
              <label htmlFor={`joinedDate-${member.id}`} className="text-sm font-medium">
                Joined Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                    id={`joinedDate-${member.id}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {member.joinedDate ? format(member.joinedDate, "PPP") : "Select joined date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={member.joinedDate}
                    onSelect={(date) => setCurrentMember((prev) => ({ ...prev, joinedDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Employment Duration */}
            <div className="space-y-2">
              <label htmlFor={`employmentDuration-${member.id}`} className="text-sm font-medium">
                Employment Duration
              </label>
              <input
                id={`employmentDuration-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                value={calculateEmploymentDuration(member.joinedDate)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`designation-${member.id}`} className="text-sm font-medium">
                Designation
              </label>
              <Select
                value={member.designation}
                onValueChange={(value) => handleCurrentMemberInputChange("designation", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor={`jobGrade-${member.id}`} className="text-sm font-medium">
                Job Grade
              </label>
              <Select
                value={member.jobGrade}
                onValueChange={(value) => handleCurrentMemberInputChange("jobGrade", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job grade" />
                </SelectTrigger>
                <SelectContent>
                  {jobGradeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor={`employmentType-${member.id}`} className="text-sm font-medium">
                Employment Type
              </label>
              <Select
                value={member.employmentType}
                onValueChange={(value) => handleCurrentMemberInputChange("employmentType", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor={`staffCategory-${member.id}`} className="text-sm font-medium">
                Staff Category
              </label>
              <Select
                value={member.staffCategory}
                onValueChange={(value) => handleCurrentMemberInputChange("staffCategory", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select staff category" />
                </SelectTrigger>
                <SelectContent>
                  {staffCategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(member.employmentType === "contract" ||
              member.employmentType === "temporary" ||
              member.employmentType === "part-time") && (
              <>
                <div className="space-y-2">
                  <label htmlFor={`startDate-${member.id}`} className="text-sm font-medium">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                        id={`startDate-${member.id}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {member.startDate ? format(member.startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={member.startDate}
                        onSelect={(date) => setCurrentMember((prev) => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label htmlFor={`endDate-${member.id}`} className="text-sm font-medium">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                        id={`endDate-${member.id}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {member.endDate ? format(member.endDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={member.endDate}
                        onSelect={(date) => setCurrentMember((prev) => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Special Tag</label>
              <Select
                value=""
                onValueChange={(value) => {
                  const currentTags = member.specialTags || []
                  if (!currentTags.includes(value)) {
                    setCurrentMember((prev) => ({
                      ...prev,
                      specialTags: [...(prev.specialTags || []), value],
                    }))
                    needsSaveRef.current = true
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select special tags" />
                </SelectTrigger>
                <SelectContent>
                  {specialTagOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={(member.specialTags || []).includes(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(member.specialTags || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(member.specialTags || []).map((tag) => (
                    <div
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded border"
                    >
                      <span>{specialTagOptions.find((opt) => opt.value === tag)?.label || tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentMember((prev) => ({
                            ...prev,
                            specialTags: (prev.specialTags || []).filter((t) => t !== tag),
                          }))
                          needsSaveRef.current = true
                        }}
                        className="text-gray-500 hover:text-gray-700 ml-1"
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plan Information Section */}
        <div className="md:col-span-3 space-y-4 border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Plan Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor={`planName-${member.id}`} className="text-sm font-medium">
                Plan Name
              </label>
              <input
                id={`planName-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Plan will be auto-assigned when you click Assign Plan"
                value={member.planName || ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`planCode-${member.id}`} className="text-sm font-medium">
                Plan Code
              </label>
              <input
                id={`planCode-${member.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Auto-filled when plan is selected"
                value={member.planCode || ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`effectiveDate-${member.id}`} className="text-sm font-medium">
                Effective Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                    id={`effectiveDate-${member.id}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {member.planEffectiveDate ? format(member.planEffectiveDate, "PPP") : "Select effective date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={member.planEffectiveDate}
                    onSelect={(date) => setCurrentMember((prev) => ({ ...prev, planEffectiveDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label htmlFor={`expiryDate-${member.id}`} className="text-sm font-medium">
                Expiry Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                    id={`expiryDate-${member.id}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {member.planExpiryDate ? format(member.planExpiryDate, "PPP") : "Select expiry date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={member.planExpiryDate}
                    onSelect={(date) => setCurrentMember((prev) => ({ ...prev, planExpiryDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Assign Plan Button */}
            <div className="md:col-span-2 flex justify-end pt-4">
              <Button
                type="button"
                onClick={autoFillPlanInformation}
                disabled={!isEmploymentInfoComplete()}
                className={`px-6 py-2 rounded-md text-sm font-medium ${
                  isEmploymentInfoComplete()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Assign Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="md:col-span-3 space-y-4 border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Remarks</h4>
          <div className="space-y-2">
            <label htmlFor={`remarks-${member.id}`} className="text-sm font-medium">
              Additional Remarks
            </label>
            <textarea
              id={`remarks-${member.id}`}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional remarks or notes here..."
              value={member.remarks || ""}
              onChange={(e) => handleCurrentMemberInputChange("remarks", e.target.value)}
            />
          </div>
        </div>

        {/* Dependents Information Section */}
        <div className="md:col-span-3 space-y-4 border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Dependents Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">Dependent Covered?</div>
              <RadioGroup
                value={member.dependentCovered || ""}
                onValueChange={(value) => handleDependentCoveredChange(value)}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id={`dependentCovered-yes-${member.id}`} />
                  <Label htmlFor={`dependentCovered-yes-${member.id}`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id={`dependentCovered-no-${member.id}`} />
                  <Label htmlFor={`dependentCovered-no-${member.id}`}>No</Label>
                </div>
              </RadioGroup>
            </div>

            {member.dependentCovered === "Yes" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Selected Dependents</label>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  {(() => {
                    const selectedDependentIds = member.selectedDependents || []

                    if (selectedDependentIds.length === 0) {
                      return <p className="text-sm text-gray-500">No dependents selected.</p>
                    }

                    // Sample dependent data (same as in modal)
                    const dependentData = [
                      {
                        id: "dep-1",
                        name: "Ahmad Farid bin Ali",
                        nricPassport: "850222-14-2005",
                        personId: "PER-2025-459",
                        relationship: "Employee",
                        status: "Active",
                      },
                      {
                        id: "dep-2",
                        name: "Siti Aishah binti Ahmad",
                        nricPassport: "870505-14-5678",
                        personId: "PER-2025-458",
                        relationship: "Spouse",
                        status: "Active",
                      },
                      {
                        id: "dep-3",
                        name: "Ahmad Danial bin Ahmad Farid",
                        nricPassport: "120315-14-1234",
                        personId: "PER-2025-459",
                        relationship: "Child",
                        status: "Active",
                      },
                      {
                        id: "dep-4",
                        name: "Nur Aisyah binti Ahmad Farid",
                        nricPassport: "140820-14-5678",
                        personId: "PER-2025-460",
                        relationship: "Child",
                        status: "Active",
                      },
                      {
                        id: "dep-5",
                        name: "Ahmad Arif bin Ahmad Farid",
                        nricPassport: "170612-14-9012",
                        personId: "PER-2025-461",
                        relationship: "Child",
                        status: "Active",
                      },
                    ]

                    const selectedDependents = dependentData.filter((dep) => selectedDependentIds.includes(dep.id))

                    return (
                      <div className="space-y-3">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NRIC/Passport
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Age
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Person ID
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Relationship
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedDependents.map((dependent) => (
                                  <tr key={dependent.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {dependent.name}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                                      {dependent.nricPassport}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {calculateAgeFromNRIC(dependent.nricPassport)} years
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {dependent.personId}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {dependent.relationship}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        {dependent.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setCurrentMember((prev) => ({
                                            ...prev,
                                            selectedDependents: (prev.selectedDependents || []).filter(
                                              (id) => id !== dependent.id,
                                            ),
                                          }))
                                        }
                                        className="text-red-500 hover:text-red-700 p-1"
                                        aria-label={`Remove ${dependent.name}`}
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentDependentMemberId(member.id)
                              setSelectedDependents(member.selectedDependents || [])
                              setShowDependentModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Modify Dependent Selection
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="md:col-span-3 space-y-4 border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">Provider Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">Setup Provider</div>
              <RadioGroup
                value={member.setupProvider}
                onValueChange={(value) => setCurrentMember((prev) => ({ ...prev, setupProvider: value }))}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id={`setupProvider-yes-${member.id}`} />
                  <Label htmlFor={`setupProvider-yes-${member.id}`}>Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id={`setupProvider-no-${member.id}`} />
                  <Label htmlFor={`setupProvider-no-${member.id}`}>No</Label>
                </div>
              </RadioGroup>
            </div>

            {member.setupProvider === "Yes" && (
              <div className="space-y-4">
                <h5 className="text-sm font-medium">Medical Provider Information</h5>
                {member.medicalProviders.map((provider, providerIndex) => (
                  <div key={provider.id} className="space-y-4 border border-gray-100 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <h6 className="text-sm font-medium">Provider {providerIndex + 1}</h6>
                      <div className="flex space-x-2">
                        {member.medicalProviders.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentMember((prev) => ({
                                ...prev,
                                medicalProviders: prev.medicalProviders.filter((p) => p.id !== provider.id),
                              }))
                            }
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove medical provider"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </button>
                        )}
                        {providerIndex === member.medicalProviders.length - 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentMember((prev) => ({
                                ...prev,
                                medicalProviders: [
                                  ...prev.medicalProviders,
                                  {
                                    id: `medical-provider-${prev.medicalProviders.length + 1}`,
                                    serviceTypes: [],
                                    panelship: "",
                                    providerTypes: [],
                                  },
                                ],
                              }))
                            }
                            className="text-green-500 hover:text-green-700"
                            aria-label="Add medical provider"
                          >
                            <PlusCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Keep the existing medical provider fields structure */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Provider Type</label>
                        <Select
                          value=""
                          onValueChange={(value) => {
                            const currentTypes = provider.serviceTypes || []
                            if (!currentTypes.includes(value)) {
                              setCurrentMember((prev) => {
                                const updatedProviders = prev.medicalProviders.map((p) => {
                                  if (p.id === provider.id) {
                                    return { ...p, serviceTypes: [...(p.serviceTypes || []), value] }
                                  }
                                  return p
                                })
                                return { ...prev, medicalProviders: updatedProviders }
                              })
                              needsSaveRef.current = true
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select service types" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicalServiceTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={(provider.serviceTypes || []).includes(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {(provider.serviceTypes || []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(provider.serviceTypes || []).map((type) => (
                              <div
                                key={type}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded border"
                              >
                                <span>
                                  {medicalServiceTypeOptions.find((opt) => opt.value === type)?.label || type}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentMember((prev) => {
                                      const updatedProviders = prev.medicalProviders.map((p) => {
                                        if (p.id === provider.id) {
                                          return {
                                            ...p,
                                            serviceTypes: (p.serviceTypes || []).filter((t) => t !== type),
                                          }
                                        }
                                        return p
                                      })
                                      return { ...prev, medicalProviders: updatedProviders }
                                    })
                                    needsSaveRef.current = true
                                  }}
                                  className="text-gray-500 hover:text-gray-700 ml-1"
                                  aria-label={`Remove ${type}`}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Provider Category</label>
                        <Select
                          value=""
                          onValueChange={(value) => {
                            const currentTypes = provider.providerTypes || []
                            if (!currentTypes.includes(value)) {
                              const updatedTypes = [...currentTypes, value]
                              setCurrentMember((prev) => {
                                const updatedProviders = prev.medicalProviders.map((p) => {
                                  if (p.id === provider.id) {
                                    return { ...p, providerTypes: updatedTypes }
                                  }
                                  return p
                                })
                                return { ...prev, medicalProviders: updatedProviders }
                              })
                              needsSaveRef.current = true
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select provider types" />
                          </SelectTrigger>
                          <SelectContent>
                            {providerTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={(provider.providerTypes || []).includes(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {(provider.providerTypes || []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(provider.providerTypes || []).map((type) => (
                              <div
                                key={type}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded border"
                              >
                                <span>{providerTypeOptions.find((opt) => opt.value === type)?.label || type}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentMember((prev) => {
                                      const updatedProviders = prev.medicalProviders.map((p) => {
                                        if (p.id === provider.id) {
                                          return {
                                            ...p,
                                            providerTypes: (p.providerTypes || []).filter((t) => t !== type),
                                          }
                                        }
                                        return p
                                      })
                                      return { ...prev, medicalProviders: updatedProviders }
                                    })
                                    needsSaveRef.current = true
                                  }}
                                  className="text-gray-500 hover:text-gray-700 ml-1"
                                  aria-label={`Remove ${type}`}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Panelship</label>
                        <Select
                          value={provider.panelship}
                          onValueChange={(value) => {
                            if (value === "select-access") {
                              setCurrentMemberId(member.id)
                              setCurrentProviderId(provider.id)
                              setShowProviderModal(true)
                              return
                            }
                            setCurrentMember((prev) => {
                              const updatedProviders = prev.medicalProviders.map((provider) => {
                                if (provider.id === provider.id) {
                                  return { ...provider, panelship: value }
                                }
                                return provider
                              })
                              return { ...prev, medicalProviders: updatedProviders }
                            })
                            needsSaveRef.current = true
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select panelship" />
                          </SelectTrigger>
                          <SelectContent>
                            {panelshipOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Keep the existing selected providers display structure */}
                    {provider.panelship === "select-access" && (
                      <div className="mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Selected Providers</label>
                          <div className="border border-gray-300 rounded-md p-4 bg-gray-50 max-h-60 overflow-y-auto">
                            {(() => {
                              const selectedProviders = getSelectedProvidersForMember(member.id, provider.id)
                              const allSelected = [
                                ...selectedProviders.clinics.map((p) => ({ ...p, category: "CLINICS" })),
                                ...selectedProviders.hospitals.map((p) => ({ ...p, category: "HOSPITALS" })),
                                ...selectedProviders.pharmacies.map((p) => ({ ...p, category: "PHARMACIES" })),
                                ...selectedProviders.dentists.map((p) => ({ ...p, category: "DENTISTS" })),
                                ...selectedProviders.physiotherapy.map((p) => ({
                                  ...p,
                                  category: "PHYSIOTHERAPY",
                                })),
                              ]

                              if (allSelected.length === 0) {
                                return <p className="text-sm text-gray-500">No providers selected.</p>
                              }

                              const groupedProviders = allSelected.reduce((acc, provider) => {
                                if (!acc[provider.category]) acc[provider.category] = []
                                acc[provider.category].push(provider)
                                return acc
                              }, {})

                              return (
                                <div className="space-y-4">
                                  {Object.entries(groupedProviders).map(([category, providers]) => (
                                    <div key={category}>
                                      <h6 className="text-sm font-medium text-blue-600 mb-2">{category}</h6>
                                      <div className="space-y-2">
                                        {providers.map((selectedProvider) => (
                                          <div
                                            key={selectedProvider.id}
                                            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
                                          >
                                            <div>
                                              <h4 className="font-medium text-gray-900">{selectedProvider.name}</h4>
                                              <div className="text-sm text-gray-500">
                                                Code: {selectedProvider.code} • {selectedProvider.location},{" "}
                                                {selectedProvider.state}
                                              </div>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const key = `${member.id}-${provider.id}`
                                                const current = formData.selectedProviders[key] || []
                                                updateFormData({
                                                  selectedProviders: {
                                                    ...formData.selectedProviders,
                                                    [key]: current.filter((id) => id !== selectedProvider.id),
                                                  },
                                                })
                                                needsSaveRef.current = true
                                              }}
                                              className="text-red-500 hover:text-red-700 p-1"
                                              aria-label={`Remove ${selectedProvider.name}`}
                                            >
                                              <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="pt-2 border-t border-gray-200">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCurrentMemberId(member.id)
                                        setCurrentProviderId(provider.id)
                                        setShowProviderModal(true)
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                      Modify Provider Selection
                                    </button>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleMappingConfirmed = (mappedMembers: MemberEntry[]) => {
    setBulkUploadedMembers(mappedMembers)
    setShowMappingModal(false)
    needsSaveRef.current = true
    toast({
      title: "CSV Mapped Successfully",
      description: `${mappedMembers.length} members are ready for bulk upload.`,
    })
  }

  const handleSave = () => {
    let allMembers: MemberEntry[] = []

    // Add members from the single entry table (savedMembers)
    allMembers = [...savedMembers]

    // Add members from the bulk uploaded table (bulkUploadedMembers)
    // Filter out any duplicates if a member was somehow in both (though unlikely with current flow)
    const existingMemberIds = new Set(allMembers.map((m) => m.id))
    const newBulkMembers = bulkUploadedMembers.filter((bm) => !existingMemberIds.has(bm.id))
    allMembers = [...allMembers, ...newBulkMembers]

    // If there's an unsaved currentMember in the single entry form, add it
    if (editingMemberId === null && currentMember.personName.trim() !== "" && currentMember.personId.trim() !== "") {
      allMembers.push({ ...currentMember })
    }

    console.log("MemberStep: allMembers before updateFormData", allMembers) // Debug log
    console.log("MemberStep: savedMembers count:", savedMembers.length)
    console.log("MemberStep: bulkUploadedMembers count:", bulkUploadedMembers.length)
    console.log("MemberStep: currentMember has data:", currentMember.personName.trim() !== "")

    // Update the form context with all member data
    updateFormData({ memberEntries: allMembers })

    // Force save to localStorage with the combined data
    try {
      const dataToSave = {
        memberEntries: allMembers, // Save the combined list
        memberTabValue: formData.memberTabValue,
        selectedProviders: formData.selectedProviders,
        savedMembers: [], // Clear these since they're now in memberEntries
        bulkUploadedMembers: [], // Clear these since they're now in memberEntries
        bulkUploadRecords: bulkUploadRecords,
        editingMemberId: null,
        searchQuery: "",
        filterBy: "all",
        currentPage: 1,
        viewingBulkRecord: null,
        viewingBulkMembers: [],
        currentMember: {
          id: `member-${Date.now()}`,
          personId: "",
          personName: "",
          idNumber: "",
          membershipId: "",
          staffId: "",
          personType: "",
          employeePersonId: "",
          designation: "",
          jobGrade: "",
          employmentType: "",
          staffCategory: "",
          joinedDate: undefined,
          startDate: undefined,
          endDate: undefined,
          setupProvider: "",
          specialTags: [],
          medicalProviders: [
            {
              id: "medical-provider-1",
              serviceTypes: [],
              panelship: "",
              providerTypes: [],
            },
          ],
          planName: "",
          planCode: "",
          planEffectiveDate: undefined,
          planExpiryDate: undefined,
          dependentCovered: "",
          selectedDependents: [],
          remarks: "",
          dateOfBirth: "",
          gender: "",
          isDisabled: false,
          email: "",
          phoneNo: "",
          address: "",
          postcode: "",
          city: "",
          state: "",
          country: "",
          unit: "",
          department: "",
          memberEmploymentStatus: "",
          dependentInfo: {
            name: "",
            nricPassport: "",
            relationship: "",
            dateOfBirth: "",
            gender: "",
            isDisabled: false,
            address: "",
            postcode: "",
            city: "",
            state: "",
            country: "",
            phoneNo: "",
            email: "",
          },
        },
        timestamp: new Date().toISOString(),
        showBulkUploadedMembers: showBulkUploadedMembers,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      console.log("Member data saved to localStorage with combined members:", allMembers.length)
    } catch (error) {
      console.error("Error saving member data to localStorage:", error)
    }

    // Clear the local state since data is now in context
    setSavedMembers([])
    setBulkUploadedMembers([])
    resetCurrentMemberForm()

    console.log("Saving member data:", allMembers)

    toast({
      title: "Member data saved",
      description: `${allMembers.length} member(s) saved successfully`,
    })

    onNext()
  }

  const handleCancel = () => {
    // Clear localStorage when canceling
    clearLocalStorage()

    updateFormData({
      memberEntries: [
        {
          id: "member-1",
          personId: "",
          personName: "",
          idNumber: "",
          membershipId: "",
          staffId: "",
          personType: "",
          employeePersonId: "",
          designation: "",
          jobGrade: "",
          employmentType: "",
          staffCategory: "",
          joinedDate: undefined,
          startDate: undefined,
          endDate: undefined,
          setupProvider: "",
          specialTags: [],
          medicalProviders: [
            {
              id: "medical-provider-1",
              serviceTypes: [],
              panelship: "",
              providerTypes: [],
            },
          ],
          planName: "",
          planCode: "",
          planEffectiveDate: undefined,
          planExpiryDate: undefined,
          dependentCovered: "",
          selectedDependents: [],
          remarks: "",
          dateOfBirth: "",
          gender: "",
          isDisabled: false,
          email: "",
          phoneNo: "",
          address: "",
          postcode: "",
          city: "",
          state: "",
          country: "",
          unit: "",
          department: "",
          memberEmploymentStatus: "",
          dependentInfo: {
            name: "",
            nricPassport: "",
            relationship: "",
            dateOfBirth: "",
            gender: "",
            isDisabled: false,
            address: "",
            postcode: "",
            city: "",
            state: "",
            country: "",
            phoneNo: "",
            email: "",
          },
        },
      ],
      memberBulkData: { groupId: "", remarks: "" }, // Add remarks here
      memberSelectedFile: null,
    })
    onCancel()
  }

  const handleDependentCoveredChange = (value: string) => {
    setCurrentMember((prev) => ({ ...prev, dependentCovered: value }))
    needsSaveRef.current = true

    if (value === "Yes") {
      setCurrentDependentMemberId(currentMember.id)
      // Initialize with existing selected dependents
      setSelectedDependents(currentMember.selectedDependents || [])
      setShowDependentModal(true)
    }
  }

  const handleDependentModalClose = () => {
    setShowDependentModal(false)
    setCurrentDependentMemberId("")
    setSelectedDependents([])
  }

  const handleDependentModalSave = () => {
    // Save selected dependents to the current member
    setCurrentMember((prev) => ({ ...prev, selectedDependents: selectedDependents }))
    needsSaveRef.current = true

    console.log("Selected dependents:", selectedDependents)
    handleDependentModalClose()
  }

  const removeDependentFromSelection = (memberId: string, dependentId: string) => {
    const updatedEntries = formData.memberEntries.map((entry) => {
      if (entry.id === memberId) {
        return {
          ...entry,
          selectedDependents: (entry.selectedDependents || []).filter((id) => id !== dependentId),
        }
      }
      return entry
    })
    updateFormData({ memberEntries: updatedEntries })
    needsSaveRef.current = true
  }

  // Helper function to calculate age from Malaysian NRIC
  const calculateAgeFromNRIC = (nric: string): number => {
    if (!nric || nric.length < 6) return 0

    const dateStr = nric.substring(0, 6) // YYMMDD
    const year = Number.parseInt(dateStr.substring(0, 2))
    const month = Number.parseInt(dateStr.substring(2, 4))
    const day = Number.parseInt(dateStr.substring(4, 6))

    // Determine century (assume 00-30 is 2000s, 31-99 is 1900s)
    const fullYear = year <= 30 ? 2000 + year : 1900 + year

    const birthDate = new Date(fullYear, month - 1, day)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Provider Selection Modal Component
  const ProviderSelectionModal = () => {
    if (!showProviderModal) return null

    const key = `${currentMemberId}-${currentProviderId}`
    const selected = formData.selectedProviders[key] || []

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
          <div className="p-6 border-b flex-shrink-0 relative">
            <h2 className="text-xl font-semibold mb-2">Provider Selection</h2>
            <p className="text-gray-600 text-sm">
              Select healthcare providers for your plan. Choose from clinics, hospitals, pharmacies, dentists, and
              physiotherapy centers.
            </p>
            <button
              onClick={handleProviderModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border-b flex-shrink-0">
            <div className="flex">
              {[
                { key: "clinics", label: "Clinics" },
                { key: "hospitals", label: "Hospitals" },
                { key: "pharmacies", label: "Pharmacies" },
                { key: "dentists", label: "Dentists" },
                { key: "physiotherapy", label: "Physiotherapy" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveProviderTab(tab.key)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    activeProviderTab === tab.key
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-b flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search by name, code, or state...`}
                value={providerSearchQuery}
                onChange={(e) => setProviderSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {getFilteredProviders(providerData[activeProviderTab as keyof typeof providerData] || []).map(
                (provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(provider.id)}
                        onChange={(e) => handleProviderSelection(provider.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{provider.name}</h4>
                        <div className="text-sm text-gray-500 mt-1">Code: {provider.code}</div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {provider.location}, {provider.state}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {provider.phone}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {provider.hours}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {provider.status}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="p-4 border-t flex justify-between flex-shrink-0">
            {activeProviderTab !== "clinics" && (
              <Button variant="outline" onClick={handleProviderModalBack}>
                Back
              </Button>
            )}
            <Button onClick={handleProviderModalSave} className="bg-blue-600 hover:bg-blue-700">
              {activeProviderTab === "physiotherapy" ? "Save" : "Save & Next"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Dependent Modal Component
  const DependentModal = () => {
    if (!showDependentModal) return null

    // Sample dependent data
    const dependentData = [
      {
        id: "dep-1",
        name: "Ahmad Farid bin Ali",
        nricPassport: "850222-14-2005",
        personId: "PER-2025-459",
        relationship: "Employee",
        status: "Active",
      },
      {
        id: "dep-2",
        name: "Siti Aishah binti Ahmad",
        nricPassport: "870505-14-5678",
        personId: "PER-2025-458",
        relationship: "Spouse",
        status: "Active",
      },
      {
        id: "dep-3",
        name: "Ahmad Danial bin Ahmad Farid",
        nricPassport: "120315-14-1234",
        personId: "PER-2025-459",
        relationship: "Child",
        status: "Active",
      },
      {
        id: "dep-4",
        name: "Nur Aisyah binti Ahmad Farid",
        nricPassport: "140820-14-5678",
        personId: "PER-2025-460",
        relationship: "Child",
        status: "Active",
      },
      {
        id: "dep-5",
        name: "Ahmad Arif bin Ahmad Farid",
        nricPassport: "170612-14-9012",
        personId: "PER-2025-461",
        relationship: "Child",
        status: "Active",
      },
    ]

    const handleDependentSelection = (dependentId: string, checked: boolean) => {
      setSelectedDependents((prev) => (checked ? [...prev, dependentId] : prev.filter((id) => id !== dependentId)))
    }

    const handleSelectAllDependents = (checked: boolean) => {
      setSelectedDependents(checked ? dependentData.map((dep) => dep.id) : [])
    }

    const handleDependentModalSave = () => {
      // Save selected dependents to the current member
      setCurrentMember((prev) => ({ ...prev, selectedDependents: selectedDependents }))
      needsSaveRef.current = true

      console.log("Selected dependents:", selectedDependents)
      handleDependentModalClose()
    }

    const handleDependentModalClose = () => {
      setShowDependentModal(false)
      setCurrentDependentMemberId("")
      setSelectedDependents([])
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden">
          <div className="p-6 border-b flex-shrink-0 relative">
            <h2 className="text-xl font-semibold mb-2">Dependent Information</h2>
            <p className="text-gray-600 text-sm">Configure dependent coverage details.</p>
            <button
              onClick={handleDependentModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedDependents.length === dependentData.length}
                          onChange={(e) => handleSelectAllDependents(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NRIC/Passport Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Person ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Relationship
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dependentData.map((dependent) => (
                      <tr key={dependent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedDependents.includes(dependent.id)}
                            onChange={(e) => handleDependentSelection(dependent.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {dependent.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                          {dependent.nricPassport}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {calculateAgeFromNRIC(dependent.nricPassport)} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.personId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dependent.relationship}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {dependent.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedDependents.length > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-t border-gray-200">
                  <p className="text-sm text-blue-700">{selectedDependents.length} dependent(s) selected</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t flex justify-end space-x-4 flex-shrink-0">
            <Button variant="outline" onClick={handleDependentModalClose}>
              Cancel
            </Button>
            <Button onClick={handleDependentModalSave} className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Filter and search logic
  const filteredMembers = savedMembers.filter((member) => {
    const matchesSearch =
      member.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.personId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterBy === "all" || member.jobGrade === filterBy

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    needsSaveRef.current = true
  }

  const handleDownloadTemplate = () => {
    // Create Excel template data with headers and sample row based on new expected fields
    const templateHeaders = expectedFields.map((field) => field.label)
    const sampleRow = expectedFields.map((field) => {
      switch (field.value) {
        case "personName":
          return "John Doe"
        case "idNumber":
          return "850101-14-1234"
        case "dateOfBirth":
          return "1985-01-01"
        case "gender":
          return "Male"
        case "isDisabled":
          return "No"
        case "email":
          return "john.doe@example.com"
        case "phoneNo":
          return "0123456789"
        case "address":
          return "123 Main St"
        case "postcode":
          return "50000"
        case "city":
          return "Kuala Lumpur"
        case "state":
          return "Kuala Lumpur"
        case "country":
          return "Malaysia"
        case "staffId":
          return "STF-001"
        case "joinedDate":
          return "2020-01-01"
        case "designation":
          return "Software Engineer"
        case "employmentType":
          return "Permanent"
        case "jobGrade":
          return "Grade 3"
        case "staffCategory":
          return "Executive"
        case "unit":
          return "IT"
        case "department":
          return "Engineering"
        case "memberEmploymentStatus":
          return "Active"
        case "dependentInfo.name":
          return "Jane Doe"
        case "dependentInfo.nricPassport":
          return "900202-14-5678"
        case "dependentInfo.relationship":
          return "Spouse"
        case "dependentInfo.dateOfBirth":
          return "1990-02-02"
        case "dependentInfo.gender":
          return "Female"
        case "dependentInfo.isDisabled":
          return "No"
        case "dependentInfo.address":
          return "123 Main St"
        case "dependentInfo.postcode":
          return "50000"
        case "dependentInfo.city":
          return "Kuala Lumpur"
        case "dependentInfo.state":
          return "Kuala Lumpur"
        case "dependentInfo.country":
          return "Malaysia"
        case "dependentInfo.phoneNo":
          return "0123456789"
        case "dependentInfo.email":
          return "jane.doe@example.com"
        case "setupProvider":
          return "Yes"
        case "specialTags":
          return "VIP,Handle with Care"
        case "medicalProviderServiceTypes":
          return "GP,SP"
        case "medicalProviderPanelship":
          return "All"
        case "medicalProviderProviderTypes":
          return "Public,Private"
        case "planName":
          return "Premium Health Plan"
        case "planCode":
          return "PL002"
        case "planEffectiveDate":
          return "2025-01-01"
        case "planExpiryDate":
          return "2025-12-31"
        case "dependentCovered":
          return "Yes"
        case "selectedDependents":
          return "dep-1,dep-2"
        case "remarks":
          return "Sample remarks"
        default:
          return ""
      }
    })

    const templateData = [templateHeaders, sampleRow]

    // Convert to CSV format
    const csvContent = templateData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "member_bulk_upload_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSaveBulkUpload = () => {
    if (bulkUploadedMembers.length > 0 && formData.memberBulkData.groupId) {
      const newRecord = {
        id: `bulk-record-${Date.now()}`,
        batchId: formData.memberBulkData.groupId,
        totalRecords: bulkUploadedMembers.length,
        status: "Completed",
        uploadDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      }

      setBulkUploadRecords((prev) => [...prev, newRecord])
      setShowBulkUploadedMembers(false) // Hide the bulk uploaded members section
      needsSaveRef.current = true

      // Show success message
      alert(`Bulk upload "${formData.memberBulkData.groupId}" has been saved successfully!`)
    } else {
      alert("No bulk uploaded members to save or missing Batch ID.")
    }
  }

  const handleViewBulkRecord = (recordId: string) => {
    // Find the record and show its associated members
    const record = bulkUploadRecords.find((r) => r.id === recordId)
    if (record) {
      // In a real application, you would fetch the members for this batch from the backend
      // For now, we'll show the current bulk uploaded members
      setShowBulkUploadedMembers(true)
      setViewingBulkRecord(recordId)
    }
  }

  const handleDeleteBulkRecord = (recordId: string) => {
    if (confirm("Are you sure you want to delete this bulk upload record?")) {
      setBulkUploadRecords((prev) => prev.filter((record) => record.id !== recordId))
      needsSaveRef.current = true

      toast({
        title: "Bulk upload record deleted",
        description: "The bulk upload record has been removed successfully",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Member Information</h2>

      <Tabs
        defaultValue="single"
        value={formData.memberTabValue}
        onValueChange={(value) => {
          updateFormData({ memberTabValue: value })
          needsSaveRef.current = true
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="single">Single Record</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Records</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-0">
          <div className="space-y-6">
            {/* Current Member Form - Now first */}
            <div className="space-y-6 border rounded-lg p-4">
              <h3 className="text-md font-medium">{editingMemberId ? "Edit Member" : "Add New Member"}</h3>

              {/* Render the current member form using the existing structure */}
              {renderMemberForm(currentMember)}

              {/* Save/Update button moved to bottom */}
              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                {editingMemberId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveMember}
                  disabled={!isFormValid}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isFormValid
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  aria-label={editingMemberId ? "Update member" : "Save"}
                >
                  {editingMemberId ? "Update" : "Save"}
                </button>
              </div>
            </div>

            {/* Saved Members Table - Now second */}
            {savedMembers.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Saved Members</h3>
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setCurrentPage(1) // Reset to first page when searching
                          needsSaveRef.current = true
                        }}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                      />
                    </div>

                    {/* Filter */}
                    <Select
                      value={filterBy}
                      onValueChange={(value) => {
                        setFilterBy(value)
                        setCurrentPage(1) // Reset to first page when filtering
                        needsSaveRef.current = true
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Job Grade..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Job Grades</SelectItem>
                        {jobGradeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No.
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Person Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Person ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID Number
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Membership ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Designation
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job Grade
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employment Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Staff Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plan Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plan Code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedMembers.length > 0 ? (
                          paginatedMembers.map((member, index) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {startIndex + index + 1}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {member.personName}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.personId}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.idNumber}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {member.membershipId}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {designationOptions.find((option) => option.value === member.designation)?.label ||
                                  member.designation}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {jobGradeOptions.find((option) => option.value === member.jobGrade)?.label ||
                                  member.jobGrade}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {employmentTypeOptions.find((option) => option.value === member.employmentType)
                                  ?.label || member.employmentType}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {staffCategoryOptions.find((option) => option.value === member.staffCategory)?.label ||
                                  member.staffCategory}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.planName}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.planCode}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleEditMember(member)}
                                  className="text-blue-600 hover:text-blue-800 px-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleViewMember(member)}
                                  className="text-green-600 hover:text-green-800 px-2"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="text-red-600 hover:text-red-800 px-2"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={12}>
                              No members found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-b-lg">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
                          </span>{" "}
                          of <span className="font-medium">{filteredMembers.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Previous</span>
                            {/* Heroicon name: solid/chevron-left */}
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 
0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              aria-current="page"
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Next</span>
                            {/* Heroicon name: solid/chevron-right */}
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="mt-0">
          <div className="space-y-6">
            {/* Bulk Upload Section */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="text-md font-medium">Bulk Upload Members</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Group ID Input */}
                <div className="space-y-2">
                  <label htmlFor="groupId" className="text-sm font-medium">
                    Batch ID
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="groupId"
                      placeholder="Enter Batch ID"
                      value={formData.memberBulkData.groupId || ""}
                      onChange={(e) => handleMemberBulkInputChange("groupId", e.target.value)}
                      className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "")
                        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
                        const batchId = `BATCH-${timestamp}-${randomSuffix}`
                        handleMemberBulkInputChange("groupId", batchId)
                      }}
                      className="h-10 px-4 whitespace-nowrap"
                    >
                      Generate Batch ID
                    </Button>
                  </div>
                </div>

                {/* File Upload - now spans two rows */}
                <div className="space-y-2 row-span-2">
                  <label className="text-sm font-medium">Upload CSV File</label>
                  <div
                    className={`flex justify-center items-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer ${
                      memberIsDragging ? "bg-gray-50" : "bg-white"
                    }`}
                    onDrop={handleMemberFileDrop}
                    onDragOver={handleMemberDragOver}
                    onDragLeave={handleMemberDragLeave}
                    onClick={triggerMemberFileInput}
                  >
                    <div className="text-center">
                      {formData.memberSelectedFile ? (
                        <>
                          <FileText className="mx-auto h-6 w-6 text-blue-500" />
                          <p className="mt-1 text-sm text-gray-500">File: {formData.memberSelectedFile.name}</p>
                        </>
                      ) : (
                        <>
                          <Upload className="mx-auto h-6 w-6 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">Drag 'n' drop a file here, or click to select</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    ref={memberFileInputRef}
                    style={{ display: "none" }}
                    onChange={handleMemberFileSelect}
                  />
                </div>

                {/* Remarks Input - now in the second row, first column */}
                <div className="space-y-2">
                  <label htmlFor="remarks" className="text-sm font-medium">
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    placeholder="Enter any remarks for this bulk upload"
                    value={formData.memberBulkData.remarks || ""}
                    onChange={(e) => handleMemberBulkInputChange("remarks", e.target.value)}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
                  Download Template
                </Button>
                <Button type="button" onClick={handleMemberBulkUpload} disabled={!formData.memberSelectedFile}>
                  Upload
                </Button>
              </div>
            </div>

            {/* Bulk Uploaded Members Table */}
            {bulkUploadedMembers.length > 0 && showBulkUploadedMembers && (
              <div className="space-y-4">
                <h3 className="text-md font-medium">Bulk Uploaded Members</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    {/* Start of the fix: Add <table> here */}
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Emp. NRIC/Passport No.
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Emp. Gender
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Designation
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employment Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dependent Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dep. NRIC/Passport No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Relationship
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkUploadedMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {member.personName}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.idNumber}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{member.gender}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {designationOptions.find((option) => option.value === member.designation)?.label ||
                                member.designation}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {employmentTypeOptions.find((option) => option.value === member.employmentType)?.label ||
                                member.employmentType}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {staffCategoryOptions.find((option) => option.value === member.staffCategory)?.label ||
                                member.staffCategory}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {member.dependentInfo?.name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {member.dependentInfo?.nricPassport}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {member.dependentInfo?.relationship}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* End of the fix: Close <table> here */}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button type="button" onClick={handleSaveBulkUpload}>
                      Save Bulk Upload
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Upload Records Table */}
            {bulkUploadRecords.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-md font-medium">Bulk Upload Records</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Records
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Upload Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkUploadRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {record.batchId}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.totalRecords}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.status}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.uploadDate}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleViewBulkRecord(record.id)}
                                className="text-blue-600 hover:text-blue-800 px-2"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteBulkRecord(record.id)}
                                className="text-red-600 hover:text-red-800 px-2"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ProviderSelectionModal />
      <DependentModal />

      {showMappingModal && (
        <MemberBulkMappingModal
          csvHeaders={csvHeaders}
          csvPreviewData={csvPreviewData}
          csvRawData={csvRawData}
          expectedFields={expectedFields}
          onConfirm={handleMappingConfirmed}
          onClose={() => setShowMappingModal(false)}
        />
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <div className="space-x-2">
          <Button variant="destructive" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save & Next</Button>
        </div>
      </div>
    </div>
  )
}
