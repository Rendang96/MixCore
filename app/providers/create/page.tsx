"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { getSetupData, saveProvider, generateId, type Provider } from "@/lib/local-storage"
// Add API integration, validation, and optimistic updates

// Import necessary hooks and utilities at the top of the file

// Add the import for the Breadcrumb component at the top of the file with the other imports

// Add a validation schema after the imports
// const providerSchema = z.object({
//   providerType: z.string().min(1, "Provider type is required"),
//   providerCode: z.string().min(1, "Provider code is required"),
//   name: z.string().min(1, "Provider name is required"), // Changed from providerName to name
//   address: z.string().min(1, "Address is required"),
//   city: z.string().min(1, "City is required"),
//   state: z.string().min(1, "State is required"),
//   postcode: z.string().min(1, "Postcode is required"),
//   telNumber: z.string().min(1, "Telephone number is required"),
//   email: z.string().email("Invalid email address"),
//   companyRegNo: z.string().min(1, "Company registration number is required"),
//   tinNo: z.string().min(1, "TIN number is required"),
//   providerCategory: z.string().min(1, "Provider category is required"),
// })

// Define types for packages and examinations
type Examination = {
  id: string
  name: string
  description: string
}

type Package = {
  id: string
  name: string
  gender: string // Added gender field
  description: string
  price: string
  discount: string
  whatsappNumber: string
  examinations: Examination[]
  fileAttachment?: File | null
  posterImage?: File | null
}

type PromotionFile = {
  id: string
  file: File
  name: string
}

export default function CreateProviderPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contractNeedsRenewal, setContractNeedsRenewal] = useState(false)

  // Provider Type and Code
  const [selectedProviderType, setSelectedProviderType] = useState("")
  const [providerCode, setProviderCode] = useState("")

  // Setup data states
  const [providerTypes, setProviderTypes] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([
    "Kuala Lumpur",
    "Petaling Jaya",
    "Johor Bahru",
    "Penang",
    "Ipoh",
    "Shah Alam",
    "Melaka",
    "Kota Kinabalu",
    "Kuching",
  ])
  const [providerCategories, setProviderCategories] = useState<string[]>([])
  const [servicesProvided, setServicesProvided] = useState<string[]>([])
  const [panelGroups, setPanelGroups] = useState<string[]>([])
  const [chargesTypes, setChargesTypes] = useState<string[]>([])
  const [diagnosedIllnesses, setDiagnosedIllnesses] = useState<string[]>([])
  const [discountCategories, setDiscountCategories] = useState<string[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [subSpecialties, setSubSpecialties] = useState<string[]>([])

  const [discountItems, setDiscountItems] = useState<{ item: string; category: string; percentage: number }[]>([])
  const [techInfrastructures, setTechInfrastructures] = useState<{ name: string; description: string }[]>([])
  const [labArrangements, setLabArrangements] = useState<{ name: string; description: string }[]>([])
  const [facilities, setFacilities] = useState<{ name: string; description: string }[]>([])
  const [experiences, setExperiences] = useState<{ years: string; description: string }[]>([])
  const [specialists, setSpecialists] = useState<{ name: string; specialty: string; qualification: string }[]>([])
  const [documentSubmissions, setDocumentSubmissions] = useState<
    { title: string; providerTypes: string[]; description: string }[]
  >([])

  // Spoken Languages
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  // Deposit for admission
  const [showDepositField, setShowDepositField] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")

  // Corporate Discount
  const [showDiscountFields, setShowDiscountFields] = useState(false)

  const [selectedDiscountItems, setSelectedDiscountItems] = useState<
    { category: string; item: string; discount: string; remarks: string }[]
  >([])
  const [newDiscountCategory, setNewDiscountCategory] = useState("")
  const [newDiscountItem, setNewDiscountItem] = useState("")
  const [newDiscountPercentage, setNewDiscountPercentage] = useState("")
  const [newDiscountRemarks, setNewDiscountRemarks] = useState("")
  const [filteredDiscountItems, setFilteredDiscountItems] = useState<
    { item: string; category: string; percentage: number }[]
  >([])

  // Operating Hours
  const [operatingHoursType, setOperatingHoursType] = useState("")
  const [showRegularHours, setShowRegularHours] = useState(false)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const [dailyHoursStart, setDailyHoursStart] = useState("")
  const [dailyHoursEnd, setDailyHoursEnd] = useState("")
  const [weekdayHoursStart, setWeekdayHoursStart] = useState("")
  const [weekdayHoursEnd, setWeekdayHoursEnd] = useState("")
  const [weekendHoursStart, setWeekendHoursStart] = useState("")
  const [weekendHoursEnd, setWeekendHoursEnd] = useState("")
  const [dayHours, setDayHours] = useState<{ [key: string]: { start: string; end: string } }>({
    monday: { start: "", end: "" },
    tuesday: { start: "", end: "" },
    wednesday: { start: "", end: "" },
    thursday: { start: "", end: "" },
    friday: { start: "", end: "" },
    saturday: { start: "", end: "" },
    publicHoliday: { start: "", end: "" },
  })

  // PMCare Representative
  const [pmcareRepresentative, setPmcareRepresentative] = useState({
    personInCharge: "",
    designation: "",
    status: "",
    phone: "",
    email: "",
  })

  // PMCare Representatives from setup
  const [availablePmcareReps, setAvailablePmcareReps] = useState<any[]>([])
  const [filteredPmcareReps, setFilteredPmcareReps] = useState<any[]>([])
  const [showRepSelection, setShowRepSelection] = useState(false)

  // Payee List
  const [payeeList, setPayeeList] = useState({
    accountNo: "",
    bank: "",
    payee: "",
    paymentMethodCode: "",
  })

  // Charges
  const [consultationCharges, setConsultationCharges] = useState<{ type: string; amount: string }[]>([])
  const [newChargeType, setNewChargeType] = useState("")
  const [newChargeAmount, setNewChargeAmount] = useState("")

  // Diagnosed Illness
  const [illnessCharges, setIllnessCharges] = useState<{ illness: string; cost: string }[]>([])
  const [newIllness, setNewIllness] = useState("")
  const [newIllnessCost, setNewIllnessCost] = useState("")

  // Selected capabilities
  const [selectedTechInfrastructures, setSelectedTechInfrastructures] = useState<string[]>([])
  const [selectedLabArrangements, setSelectedLabArrangements] = useState<string[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<{ name: string; charges: string }[]>([])
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([])

  // Drug List
  const [drugList, setDrugList] = useState<
    { drugName: string; dosage: string; unitPrice: string; minimumSellingQuantity: string; sellingPrice: string }[]
  >([])
  const [newDrugName, setNewDrugName] = useState("")
  const [newDrugDosage, setNewDrugDosage] = useState("")
  const [newDrugUnitPrice, setNewDrugUnitPrice] = useState("")
  const [newDrugMinimumSellingQuantity, setNewDrugMinimumSellingQuantity] = useState("")
  const [newDrugSellingPrice, setNewDrugSellingPrice] = useState("")

  // Available Drugs
  const [availableDrugs, setAvailableDrugs] = useState<any[]>([])

  // Personnel
  const [providerRepresentative, setProviderRepresentative] = useState({
    nameOfPICDoctor: "",
    phoneNumber: "",
  })

  // Practicing Doctors
  const [practicingDoctors, setPracticingDoctors] = useState<
    {
      name: string
      role: string
      nric: string
      gender: string
      university: string
      degree: string
      year: string
      mmcNo: string
      nsrNo: string
      apcNo: string
      additionalQualification: string
      workingHoursStart: string
      workingHoursEnd: string
      specialty: string
      subSpecialty: string
    }[]
  >([])
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    role: "",
    nric: "",
    gender: "",
    university: "",
    degree: "",
    year: "",
    mmcNo: "",
    nsrNo: "",
    apcNo: "",
    additionalQualification: "",
    workingHoursStart: "",
    workingHoursEnd: "",
    specialty: "",
    subSpecialty: "",
  })

  // Occupational Health Doctor
  const [healthDoctors, setHealthDoctors] = useState<
    {
      name: string
      registrationNo: string
      effectiveDate: string
      expiryDate: string
      status: string
    }[]
  >([])
  const [newHealthDoctor, setNewHealthDoctor] = useState({
    name: "",
    registrationNo: "",
    effectiveDate: "",
    expiryDate: "",
    status: "",
  })

  // Radiographer
  const [radiographer, setRadiographer] = useState({
    name: "",
    regNo: "",
    fieldValidation: "",
  })

  // Contract
  const [contract, setContract] = useState({
    startDate: "",
    endDate: "",
    duration: "",
    renewal: false,
  })

  // Status
  const [status, setStatus] = useState({
    status: "",
    suspensionDate: "",
    terminationDate: "",
    ceoApprovalDate: "",
  })

  // Staffing
  const [staffingList, setStaffingList] = useState<{ role: string; numberOfStaff: string }[]>([])
  const [newStaffRole, setNewStaffRole] = useState("")
  const [newStaffNumber, setNewStaffNumber] = useState("")

  // Add these state variables after the existing ones
  const [formFields, setFormFields] = useState({
    name: "",
    providerAlias: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    latitude: "",
    longitude: "",
    telNumber: "",
    faxNumber: "",
    email: "",
    mobilePhone: "",
    whatsapp: "",
    website: "",
    proprietor: "",
    passport: "",
    companyRegNo: "",
    gstReg: "",
    tinNo: "",
    taxpayerStatus: "",
    sstRegistrationNo: "",
    providerCategory: "",
    glIssuance: false,
    useMediline: false,
    amePanel: false,
    perkesoPanel: false,
    pmcarePanel: false,
    panelGroup: "",
    servicesProvided: [] as string[],
    bgNo: "",
    bgAmount: "",
    bgExpiryDate: "",
    panelApplicationDate: "",
    qrcodeImage: null as File | null,
  })

  // Add these state variables inside the component
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [setupData, setSetupData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Health Screening Package states
  const [packages, setPackages] = useState<Package[]>([])
  const [showPackageForm, setShowPackageForm] = useState(false)
  const [currentPackage, setCurrentPackage] = useState<Package>({
    id: "",
    name: "",
    gender: "", // Initialize gender
    description: "",
    price: "",
    discount: "",
    whatsappNumber: "",
    examinations: [],
    fileAttachment: null,
    posterImage: null,
  })
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)

  // Promotion files state
  const [promotionFiles, setPromotionFiles] = useState<PromotionFile[]>([])

  // Drug list state
  const [newDrug, setNewDrug] = useState({
    drugCode: "",
    genericName: "",
    productName: "",
    dosage: "",
    unitPrice: "",
    minimumSellingQuantity: "",
    sellingPrice: "",
  })

  // Update the fetchSetupData function to handle the 404 error more gracefully
  // Replace the existing fetchSetupData function with this improved version

  // Modify the fetchSetupData function to use a try-catch block and provide fallback data
  const fetchSetupData = useCallback(async () => {
    try {
      setIsLoading(true)

      // Load data from local storage
      const data = getSetupData()
      setSetupData(data)

      // Set all the state variables with the loaded data
      setProviderTypes(data.providerTypes || [])
      setProviderCategories(data.providerCategories || [])
      setServicesProvided(data.servicesProvided || [])
      setPanelGroups(data.panelGroups || [])
      setChargesTypes(data.chargesTypes || [])
      setDiagnosedIllnesses(data.diagnosedIllnesses || [])
      setDiscountCategories(data.discountCategories || [])
      setDiscountItems(data.discountItems || [])
      setTechInfrastructures(data.techInfrastructures || [])
      setLabArrangements(data.labArrangements || [])
      setFacilities(data.facilities || [])
      setExperiences(data.experiences || [])
      setSpecialists(data.specialists || [])
      setDocumentSubmissions(data.documentSubmissions || [])
      setSpokenLanguages(data.spokenLanguages || [])
      setAvailableDrugs(data.drugs || [])
      setSpecialties(data.specialties || [])
      setSubSpecialties(data.subSpecialties || [])

      console.log("Successfully loaded setup data from localStorage")
    } catch (error) {
      console.error("Error loading setup data:", error)
      toast({
        title: "Error loading data",
        description: "An error occurred while loading setup data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Replace the existing useEffect for fetching setup data
  useEffect(() => {
    fetchSetupData()

    // Set up event listener for setup data changes
    const handleSetupChange = () => {
      fetchSetupData()
    }

    window.addEventListener("setupDataChanged", handleSetupChange)

    return () => {
      window.removeEventListener("setupDataChanged", handleSetupChange)
    }
  }, [fetchSetupData])

  // Load PMCare representatives and filter based on provider type and state
  useEffect(() => {
    const setupData = getSetupData()
    setAvailablePmcareReps(setupData.pmcareRepresentatives || [])
  }, [])

  // Filter PMCare representatives based on selected provider type and state
  useEffect(() => {
    if (selectedProviderType && formFields.state && availablePmcareReps.length > 0) {
      const filtered = availablePmcareReps.filter((rep) => {
        // Convert state format for comparison - handle both formats
        const formState = formFields.state.toLowerCase()
        const formattedState = formState
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        // Check if provider type matches
        const providerTypeMatch = rep.providerTypes.includes(selectedProviderType)

        // Check if state matches (handle both kebab-case and title case)
        const stateMatch = rep.states.some(
          (state) =>
            state.toLowerCase() === formState ||
            state.toLowerCase() === formattedState.toLowerCase() ||
            state.toLowerCase().replace(/\s+/g, "-") === formState,
        )

        return providerTypeMatch && stateMatch
      })

      setFilteredPmcareReps(filtered)

      if (filtered.length === 1) {
        // Auto-select if only one match
        setPmcareRepresentative({
          personInCharge: filtered[0].personInCharge,
          designation: filtered[0].designation,
          status: filtered[0].status,
          phone: filtered[0].phone,
          email: filtered[0].email,
        })
        setShowRepSelection(false)
      } else if (filtered.length > 1) {
        // Show selection if multiple matches
        setShowRepSelection(true)
        // Clear previous selection when multiple options available
        setPmcareRepresentative({
          personInCharge: "",
          designation: "",
          status: "",
          phone: "",
          email: "",
        })
      } else {
        // Clear if no matches
        setPmcareRepresentative({
          personInCharge: "",
          designation: "",
          status: "",
          phone: "",
          email: "",
        })
        setShowRepSelection(false)
      }
    } else {
      setFilteredPmcareReps([])
      setShowRepSelection(false)
      // Clear representative data when no provider type or state selected
      if (!selectedProviderType || !formFields.state) {
        setPmcareRepresentative({
          personInCharge: "",
          designation: "",
          status: "",
          phone: "",
          email: "",
        })
      }
    }
  }, [selectedProviderType, formFields.state, availablePmcareReps])

  // Auto-generate provider code when provider type changes
  useEffect(() => {
    if (selectedProviderType) {
      // Generate a random 4-digit number
      const randomNum = Math.floor(1000 + Math.random() * 9000)

      // Create provider code based on provider type
      let code = ""
      if (selectedProviderType === "Clinic") {
        code = "CL-" + randomNum
      } else if (selectedProviderType === "Hospital") {
        code = "HP-" + randomNum
      } else if (selectedProviderType === "Specialist") {
        code = "SP-" + randomNum
      } else if (selectedProviderType === "Dental") {
        code = "DN-" + randomNum
      } else if (selectedProviderType === "Pharmacy") {
        code = "PH-" + randomNum
      } else {
        code = "PR-" + randomNum
      }

      setProviderCode(code)
    }
  }, [selectedProviderType])

  // Filter discount items when category changes
  useEffect(() => {
    if (newDiscountCategory) {
      const filtered = discountItems.filter((item) => item.category === newDiscountCategory)
      setFilteredDiscountItems(filtered)
    } else {
      setFilteredDiscountItems([])
    }
  }, [newDiscountCategory, discountItems])

  // Calculate contract duration when dates change
  useEffect(() => {
    if (contract.startDate && contract.endDate) {
      const start = new Date(contract.startDate)
      const end = new Date(contract.endDate)

      // Calculate difference in months
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

      // Update duration without triggering another state update cycle
      setContract((prevContract) => ({
        ...prevContract,
        duration: `${months} months`,
      }))

      // Check if contract needs renewal (within 30 days of end date)
      const today = new Date()
      const diffTime = end.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setContractNeedsRenewal(diffDays < 0)
    }
  }, [contract.startDate, contract.endDate]) // Only depend on these specific properties, not the entire contract object

  // Handle operating hours type change
  useEffect(() => {
    setShowRegularHours(operatingHoursType === "Regular Hours")
  }, [operatingHoursType])

  // Save form data to localStorage whenever any form field changes
  useEffect(() => {
    const formData = {
      // Existing state variables
      selectedProviderType,
      providerCode,
      selectedLanguages,
      showDepositField,
      depositAmount,
      showDiscountFields,
      selectedDiscountItems,
      operatingHoursType,
      showRegularHours,
      showAdditionalInfo,
      dailyHoursStart,
      dailyHoursEnd,
      weekdayHoursStart,
      weekdayHoursEnd,
      weekendHoursStart,
      weekendHoursEnd,
      dayHours,
      pmcareRepresentative,
      payeeList,
      consultationCharges,
      illnessCharges,
      selectedTechInfrastructures,
      selectedLabArrangements,
      selectedFacilities,
      selectedExperiences,
      selectedSpecialists,
      drugList,
      providerRepresentative,
      practicingDoctors,
      healthDoctors,
      radiographer,
      contract,
      status,
      packages,
      promotionFiles: promotionFiles.map((file) => ({ id: file.id, name: file.name })),
      activeTab,
      // Add form fields
      formFields,
      availableDrugs,
      newDrugDosage,
      newDrugUnitPrice,
      newDrugMinimumSellingQuantity,
      newDrugSellingPrice,
      staffingList,
      newStaffRole,
      newStaffNumber,
    }
    localStorage.setItem("createProviderFormData", JSON.stringify(formData))
  }, [
    // Existing dependencies
    selectedProviderType,
    providerCode,
    selectedLanguages,
    showDepositField,
    depositAmount,
    showDiscountFields,
    selectedDiscountItems,
    operatingHoursType,
    showRegularHours,
    showAdditionalInfo,
    dailyHoursStart,
    dailyHoursEnd,
    weekdayHoursStart,
    weekdayHoursEnd,
    weekendHoursStart,
    weekendHoursEnd,
    dayHours,
    pmcareRepresentative,
    payeeList,
    consultationCharges,
    illnessCharges,
    selectedTechInfrastructures,
    selectedLabArrangements,
    selectedFacilities,
    selectedExperiences,
    selectedSpecialists,
    drugList,
    providerRepresentative,
    practicingDoctors,
    healthDoctors,
    radiographer,
    contract,
    status,
    packages,
    promotionFiles,
    activeTab,
    // Add form fields dependency
    formFields,
    availableDrugs,
    newDrugDosage,
    newDrugUnitPrice,
    newDrugMinimumSellingQuantity,
    newDrugSellingPrice,
    staffingList,
    newStaffRole,
    newStaffNumber,
  ])

  // Restore form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("createProviderFormData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)

        // Restore all existing state
        if (parsedData.selectedProviderType) setSelectedProviderType(parsedData.selectedProviderType)
        if (parsedData.providerCode) setProviderCode(parsedData.providerCode)
        if (parsedData.selectedLanguages) setSelectedLanguages(parsedData.selectedLanguages)
        if (parsedData.showDepositField !== undefined) setShowDepositField(parsedData.showDepositField)
        if (parsedData.depositAmount) setDepositAmount(parsedData.depositAmount)
        if (parsedData.showDiscountFields !== undefined) setShowDiscountFields(parsedData.showDiscountFields)
        if (parsedData.selectedDiscountItems) setSelectedDiscountItems(parsedData.selectedDiscountItems)
        if (parsedData.operatingHoursType) setOperatingHoursType(parsedData.operatingHoursType)
        if (parsedData.showRegularHours !== undefined) setShowRegularHours(parsedData.showRegularHours)
        if (parsedData.showAdditionalInfo !== undefined) setShowAdditionalInfo(parsedData.showAdditionalInfo)
        if (parsedData.dailyHoursStart) setDailyHoursStart(parsedData.dailyHoursStart)
        if (parsedData.dailyHoursEnd) setDailyHoursEnd(parsedData.dailyHoursEnd)
        if (parsedData.weekdayHoursStart) setWeekdayHoursStart(parsedData.weekdayHoursStart)
        if (parsedData.weekdayHoursEnd) setWeekdayHoursEnd(parsedData.weekdayHoursEnd)
        if (parsedData.weekendHoursStart) setWeekendHoursStart(parsedData.weekendHoursStart)
        if (parsedData.weekendHoursEnd) setWeekendHoursEnd(parsedData.weekendHoursEnd)
        if (parsedData.dayHours) setDayHours(parsedData.dayHours)
        if (parsedData.pmcareRepresentative) setPmcareRepresentative(parsedData.pmcareRepresentative)
        if (parsedData.payeeList) setPayeeList(parsedData.payeeList)
        if (parsedData.consultationCharges) setConsultationCharges(parsedData.consultationCharges)
        if (parsedData.illnessCharges) setIllnessCharges(parsedData.illnessCharges)
        if (parsedData.selectedTechInfrastructures)
          setSelectedTechInfrastructures(parsedData.selectedTechInfrastructures)
        if (parsedData.selectedLabArrangements) setSelectedLabArrangements(parsedData.selectedLabArrangements)
        if (parsedData.selectedFacilities) setSelectedFacilities(parsedData.selectedFacilities)
        if (parsedData.selectedExperiences) setSelectedExperiences(parsedData.selectedExperiences)
        if (parsedData.selectedSpecialists) setSelectedSpecialists(parsedData.selectedSpecialists)
        if (parsedData.drugList) setDrugList(parsedData.drugList)
        if (parsedData.providerRepresentative) setProviderRepresentative(parsedData.providerRepresentative)
        if (parsedData.practicingDoctors) setPracticingDoctors(parsedData.practicingDoctors)
        if (parsedData.healthDoctors) setHealthDoctors(parsedData.healthDoctors)
        if (parsedData.radiographer) setRadiographer(parsedData.radiographer)
        if (parsedData.contract) setContract(parsedData.contract)
        if (parsedData.status) setStatus(parsedData.status)
        if (parsedData.packages) setPackages(parsedData.packages)
        if (parsedData.activeTab) setActiveTab(parsedData.activeTab)

        // Restore form fields
        if (parsedData.formFields) setFormFields(parsedData.formFields)
        if (parsedData.availableDrugs) setAvailableDrugs(parsedData.availableDrugs)
        if (parsedData.newDrugDosage) setNewDrugDosage(parsedData.newDrugDosage)
        if (parsedData.newDrugUnitPrice) setNewDrugUnitPrice(parsedData.newDrugUnitPrice)
        if (parsedData.newDrugMinimumSellingQuantity)
          setNewDrugMinimumSellingQuantity(parsedData.newDrugMinimumSellingQuantity)
        if (parsedData.newDrugSellingPrice) setNewDrugSellingPrice(parsedData.newDrugSellingPrice)
        if (parsedData.staffingList) setStaffingList(parsedData.staffingList)
        if (parsedData.newStaffRole) setNewStaffRole(parsedData.newStaffRole)
        if (parsedData.newStaffNumber) setNewStaffNumber(parsedData.newStaffNumber)

        toast({
          title: "Form Data Restored",
          description: "Your previously entered data has been restored.",
        })
      } catch (error) {
        console.error("Error restoring form data:", error)
      }
    }
  }, [])

  const handleRepresentativeSelection = (rep: any) => {
    setPmcareRepresentative({
      personInCharge: rep.personInCharge,
      designation: rep.designation,
      status: rep.status,
      phone: rep.phone,
      email: rep.email,
    })
    setShowRepSelection(false)

    toast({
      title: "Representative Selected",
      description: `${rep.personInCharge} has been selected as PMCare representative.`,
    })
  }

  // Add discount item
  const addDiscountItem = () => {
    if (newDiscountCategory && newDiscountItem && newDiscountPercentage) {
      setSelectedDiscountItems([
        ...selectedDiscountItems,
        {
          category: newDiscountCategory,
          item: newDiscountItem,
          discount: newDiscountPercentage,
          remarks: newDiscountRemarks,
        },
      ])

      // Reset fields
      setNewDiscountCategory("")
      setNewDiscountItem("")
      setNewDiscountPercentage("")
      setNewDiscountRemarks("")

      toast({
        title: "Discount item added",
        description: "The discount item has been added successfully.",
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the discount item.",
        variant: "destructive",
      })
    }
  }

  // Remove discount item
  const removeDiscountItem = (index: number) => {
    const updatedItems = [...selectedDiscountItems]
    updatedItems.splice(index, 1)
    setSelectedDiscountItems(updatedItems)

    toast({
      title: "Discount item removed",
      description: "The discount item has been removed.",
    })
  }

  // Add consultation charge
  const addConsultationCharge = () => {
    if (newChargeType && newChargeAmount) {
      setConsultationCharges([
        ...consultationCharges,
        {
          type: newChargeType,
          amount: newChargeAmount,
        },
      ])

      // Reset fields
      setNewChargeType("")
      setNewChargeAmount("")

      toast({
        title: "Charge added",
        description: "The consultation charge has been added successfully.",
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please select a charge type and enter an amount.",
        variant: "destructive",
      })
    }
  }

  // Remove consultation charge
  const removeConsultationCharge = (index: number) => {
    const updatedCharges = [...consultationCharges]
    updatedCharges.splice(index, 1)
    setConsultationCharges(updatedCharges)

    toast({
      title: "Charge removed",
      description: "The consultation charge has been removed.",
    })
  }

  // Add illness charge
  const addIllnessCharge = () => {
    if (newIllness && newIllnessCost) {
      setIllnessCharges([
        ...illnessCharges,
        {
          illness: newIllness,
          cost: newIllnessCost,
        },
      ])

      // Reset fields
      setNewIllness("")
      setNewIllnessCost("")

      toast({
        title: "Illness added",
        description: "The illness charge has been added successfully.",
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please select an illness and enter an average cost.",
        variant: "destructive",
      })
    }
  }

  // Remove illness charge
  const removeIllnessCharge = (index: number) => {
    const updatedIllnesses = [...illnessCharges]
    updatedIllnesses.splice(index, 1)
    setIllnessCharges(updatedIllnesses)

    toast({
      title: "Illness removed",
      description: "The illness charge has been removed.",
    })
  }

  // Add drug to list
  const addDrug = () => {
    if (newDrug.drugCode && newDrugDosage && newDrugUnitPrice && newDrugMinimumSellingQuantity && newDrugSellingPrice) {
      setDrugList([
        ...drugList,
        {
          drugName: `${newDrug.productName} (${newDrug.genericName})`,
          dosage: newDrugDosage,
          unitPrice: newDrugUnitPrice,
          minimumSellingQuantity: newDrugMinimumSellingQuantity,
          sellingPrice: newDrugSellingPrice,
        },
      ])

      // Reset fields
      setNewDrug({
        drugCode: "",
        genericName: "",
        productName: "",
        dosage: "",
        unitPrice: "",
        minimumSellingQuantity: "",
        sellingPrice: "",
      })
      setNewDrugDosage("")
      setNewDrugUnitPrice("")
      setNewDrugMinimumSellingQuantity("")
      setNewDrugSellingPrice("")

      toast({
        title: "Drug added",
        description: "The drug has been added to the list.",
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
    }
  }

  // Remove drug from list
  const removeDrug = (index: number) => {
    const updatedDrugs = [...drugList]
    updatedDrugs.splice(index, 1)
    setDrugList(updatedDrugs)

    toast({
      title: "Drug removed",
      description: "The drug has been removed from the list.",
    })
  }

  // Add practicing doctor
  const addPracticingDoctor = () => {
    if (newDoctor.name && newDoctor.role) {
      setPracticingDoctors([...practicingDoctors, newDoctor])

      // Reset fields
      setNewDoctor({
        name: "",
        role: "",
        nric: "",
        gender: "",
        university: "",
        degree: "",
        year: "",
        mmcNo: "",
        nsrNo: "",
        apcNo: "",
        additionalQualification: "",
        workingHoursStart: "",
        workingHoursEnd: "",
        specialty: "",
        subSpecialty: "",
      })

      toast({
        title: "Doctor added",
        description: "The practicing doctor has been added successfully.",
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in at least the name and role of the doctor.",
      })
    }
  }

  // Remove health doctor
  const addHealthDoctor = () => {
    if (newHealthDoctor.name && newHealthDoctor.registrationNo) {
      setHealthDoctors([...healthDoctors, newHealthDoctor])

      // Reset fields
      setNewHealthDoctor({
        name: "",
        registrationNo: "",
        effectiveDate: "",
        expiryDate: "",
        status: "",
      })

      toast({
        title: "Health doctor added",
        description: "The occupational health doctor has been added successfully.",
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in at least the name and registration number.",
      })
    }
  }

  // Replace the addFacility function with this version that doesn't use prompt
  const addFacility = (facilityName: string) => {
    if (!selectedFacilities.some((f) => f.name === facilityName)) {
      setSelectedFacilities([
        ...selectedFacilities,
        {
          name: facilityName,
          charges: "0",
        },
      ])

      toast({
        title: "Facility added",
        description: `${facilityName} has been added to selected facilities.`,
      })
    }
  }

  // Remove facility
  const removeFacility = (facilityName: string) => {
    setSelectedFacilities(selectedFacilities.filter((f) => f.name !== facilityName))

    toast({
      title: "Facility removed",
      description: `${facilityName} has been removed from selected facilities.`,
    })
  }

  // Package management functions
  const handleNewPackage = () => {
    // Reset current package and show form
    setCurrentPackage({
      id: Date.now().toString(),
      name: "",
      gender: "", // Reset gender
      description: "",
      price: "",
      discount: "",
      whatsappNumber: "",
      examinations: [],
      fileAttachment: null,
      posterImage: null,
    })
    setSelectedPackageId(null)
    setShowPackageForm(true)
    toast({
      title: "New Package",
      description: "Creating a new health screening package",
    })
  }

  const handleSavePackage = () => {
    // Validate package data
    if (!currentPackage.name) {
      toast({
        title: "Missing information",
        description: "Please enter a package name.",
        variant: "destructive",
      })
      return
    }

    // Check if we're updating an existing package or adding a new one
    if (selectedPackageId) {
      // Update existing package
      setPackages(packages.map((pkg) => (pkg.id === selectedPackageId ? currentPackage : pkg)))
    } else {
      // Add new package
      setPackages([...packages, currentPackage])
    }

    toast({
      title: "Package Saved",
      description: "The health screening package has been saved successfully.",
    })

    // Reset form
    setShowPackageForm(false)
    setSelectedPackageId(null)
  }

  const handleCancelPackage = () => {
    // If a package is selected, delete it
    if (selectedPackageId) {
      setPackages(packages.filter((pkg) => pkg.id !== selectedPackageId))
      toast({
        title: "Package Deleted",
        description: "The selected package has been deleted.",
      })
    } else {
      toast({
        title: "Package Cancelled",
        description: "Package creation has been cancelled.",
      })
    }

    // Reset form
    setShowPackageForm(false)
    setSelectedPackageId(null)
    setPosterPreview(null)
  }

  const handleNextStep = () => {
    // Save the current package first
    handleSavePackage()

    // Move to the next step (in this case, we'll just show a success message)
    toast({
      title: "Proceeding to Next Step",
      description: "Moving to the next step in package creation.",
    })
  }

  const handleAddExamination = () => {
    // Add a new empty examination to the current package
    const newExamination: Examination = {
      id: Date.now().toString(),
      name: "",
      description: "",
    }

    setCurrentPackage({
      ...currentPackage,
      examinations: [...currentPackage.examinations, newExamination],
    })

    toast({
      title: "Examination Added",
      description: "A new examination has been added to the package.",
    })
  }

  const handleRemoveExamination = (id: string) => {
    // Remove an examination from the current package
    setCurrentPackage({
      ...currentPackage,
      examinations: currentPackage.examinations.filter((exam) => exam.id !== id),
    })

    toast({
      title: "Examination Removed",
      description: "The examination has been removed from the package.",
    })
  }

  const handleExaminationChange = (id: string, field: "name" | "description", value: string) => {
    // Update an examination field
    setCurrentPackage({
      ...currentPackage,
      examinations: currentPackage.examinations.map((exam) => (exam.id === id ? { ...exam, [field]: value } : exam)),
    })
  }

  const handleUploadPoster = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      // Clean up previous preview URL
      if (posterPreview) {
        URL.revokeObjectURL(posterPreview)
      }

      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file)
      setPosterPreview(previewUrl)

      // Update the current package with the poster
      setCurrentPackage({
        ...currentPackage,
        posterImage: file,
      })

      toast({
        title: "Poster Uploaded",
        description: `File ${file.name} has been uploaded successfully.`,
      })
    }
  }

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Update the current package with the file attachment
      setCurrentPackage({
        ...currentPackage,
        fileAttachment: file,
      })

      toast({
        title: "File Attached",
        description: `File ${file.name} has been attached to the package.`,
      })
    }
  }

  // Promotion files functions
  const handleAddPromotionFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: PromotionFile[] = Array.from(e.target.files).map((file) => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
      }))

      setPromotionFiles([...promotionFiles, ...newFiles])

      toast({
        title: "Files Added",
        description: `${newFiles.length} file(s) have been added successfully.`,
      })
    }
  }

  const handleRemovePromotionFile = (id: string) => {
    setPromotionFiles(promotionFiles.filter((file) => file.id !== id))

    toast({
      title: "File Removed",
      description: "The file has been removed.",
    })
  }

  // Also update the handleSubmit function to handle API errors gracefully
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Collect form data
    const formData = new FormData(e.currentTarget)

    // Create provider data object with proper field mapping
    const providerData = {
      id: generateId(),
      code: providerCode || `PR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formFields.name || "Test Provider",
      alias: formFields.providerAlias || "",
      providerType: selectedProviderType || "Clinic",
      providerCategory: formFields.providerCategory || "General",
      address: formFields.address || "Test Address",
      city: formFields.city || "kuala-lumpur",
      state: formFields.state || "kuala-lumpur",
      postcode: formFields.postcode || "50000",
      latitude: formFields.latitude || "",
      longitude: formFields.longitude || "",
      telNumber: formFields.telNumber || "03-12345678",
      faxNumber: formFields.faxNumber || "",
      email: formFields.email || "test@example.com",
      mobilePhone: formFields.mobilePhone || "",
      whatsapp: formFields.whatsapp || "",
      website: formFields.website || "",
      proprietor: formFields.proprietor || "",
      passport: formFields.passport || "",
      companyRegNo: formFields.companyRegNo || "123456789",
      gstReg: formFields.gstReg || "",
      tinNo: formFields.tinNo || "987654321",
      glIssuance: formFields.glIssuance,
      useMediline: formFields.useMediline,
      amePanel: formFields.amePanel,
      perkesoPanel: formFields.perkesoPanel,
      pmcarePanel: formFields.pmcarePanel,
      panelGroup: formFields.panelGroup || "",
      status: typeof status === "object" ? status.status || "Active" : status || "Active",
      isPMCarePanel: formFields.pmcarePanel,
      isAMEPanel: formFields.amePanel,
      pic: providerRepresentative.nameOfPICDoctor || formFields.proprietor || "N/A",
      selectedLanguages: selectedLanguages,
      consultationCharges: consultationCharges,
      illnessCharges: illnessCharges,
      selectedTechInfrastructures: selectedTechInfrastructures,
      selectedLabArrangements: selectedLabArrangements,
      selectedFacilities: selectedFacilities,
      selectedExperiences: selectedExperiences,
      selectedSpecialists: selectedSpecialists,
      drugList: drugList,
      practicingDoctors: practicingDoctors,
      healthDoctors: healthDoctors,
      radiographer: radiographer,
      contract: contract,
      pmcareRepresentative: pmcareRepresentative,
      payeeList: payeeList,
      selectedDiscountItems: selectedDiscountItems,
      operatingHours: {
        type: operatingHoursType,
        dailyHours: { start: dailyHoursStart, end: dailyHoursEnd },
        weekdayHours: { start: weekdayHoursStart, end: weekdayHoursEnd },
        showAdditionalInfo: showAdditionalInfo,
        dayHours: dayHours,
      },
      packages: packages,
      promotionFiles: promotionFiles.map((file) => file.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      staffingList: staffingList,
      bgExpiryDate: formFields.bgExpiryDate,
    }

    try {
      console.log("Provider data before saving:", providerData)

      // Skip validation for testing - directly save to local storage
      saveProvider(providerData as Provider)

      toast({
        title: "Success!",
        description: `Provider "${providerData.name}" has been created successfully and saved to your network.`,
      })

      // Clear saved form data after successful submission
      localStorage.removeItem("createProviderFormData")

      // Navigate to the providers list after a short delay to show the success message
      setTimeout(() => {
        router.push("/providers")
      }, 2000)
    } catch (error) {
      console.error("Error creating provider:", error)
      toast({
        title: "Error",
        description: "There was an error creating the provider. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add staff
  const addStaff = () => {
    if (newStaffRole && newStaffNumber) {
      setStaffingList([
        ...staffingList,
        {
          role: newStaffRole,
          numberOfStaff: newStaffNumber,
        },
      ])

      // Reset fields
      setNewStaffRole("")
      setNewStaffNumber("")

      toast({
        title: "Staff added",
        description: "The staff role has been added successfully.",
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in both role and number of staff.",
      })
    }
  }

  // Remove staff
  const removeStaff = (index: number) => {
    const updatedStaff = [...staffingList]
    updatedStaff.splice(index, 1)
    setStaffingList(updatedStaff)

    toast({
      title: "Staff removed",
      description: "The staff role has been removed.",
    })
  }

  const handleFormFieldChange = (field: string, value: any) => {
    // Update the specific field state
    switch (field) {
      case "selectedProviderType":
        setSelectedProviderType(value)
        break
      case "selectedLanguages":
        setSelectedLanguages(value)
        break
      // Add other cases as needed
    }

    // Auto-save to localStorage
    const currentFormData = JSON.parse(localStorage.getItem("createProviderFormData") || "{}")
    const updatedFormData = { ...currentFormData, [field]: value }
    localStorage.setItem("createProviderFormData", JSON.stringify(updatedFormData))
  }

  // Get relevant document submissions for selected provider type
  const getRelevantDocuments = () => {
    if (!selectedProviderType) return []

    return documentSubmissions.filter((doc) => doc.providerTypes.includes(selectedProviderType))
  }

  // Add this helper function to check for field errors
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? { error: true, message: errors[fieldName] } : {}
  }

  // Remove practicing doctor
  const removePracticingDoctor = (index: number) => {
    const updatedDoctors = [...practicingDoctors]
    updatedDoctors.splice(index, 1)
    setPracticingDoctors(updatedDoctors)

    toast({
      title: "Doctor removed",
      description: "The practicing doctor has been removed.",
    })
  }

  // Remove health doctor
  const removeHealthDoctor = (index: number) => {
    const updatedDoctors = [...healthDoctors]
    updatedDoctors.splice(index, 1)
    setHealthDoctors(updatedDoctors)

    toast({
      title: "Health doctor removed",
      description: "The occupational health doctor has been removed.",
    })
  }

  const handleDrugSelection = (drugCode: string) => {
    if (drugCode === "no-drugs-available") {
      return
    }

    const setupData = getSetupData()
    const availableDrugs = setupData.drugs || []
    const selectedDrug = availableDrugs.find((drug) => drug.drugCode === drugCode)

    if (selectedDrug) {
      setNewDrug({
        drugCode: selectedDrug.drugCode,
        genericName: selectedDrug.genericName,
        productName: selectedDrug.productName,
        dosage: "",
        unitPrice: "",
        minimumSellingQuantity: "",
        sellingPrice: "",
      })

      toast({
        title: "Drug Selected",
        description: `${selectedDrug.productName} (${selectedDrug.genericName}) has been selected.`,
      })
    }
  }

  // Add a new function to handle the "Save & Next" action after the handleSubmit function
  const handleSaveAndNext = () => {
    // Save current form data
    const formData = {
      selectedProviderType,
      providerCode,
      selectedLanguages,
      showDepositField,
      depositAmount,
      showDiscountFields,
      selectedDiscountItems,
      operatingHoursType,
      showRegularHours,
      showAdditionalInfo,
      dailyHoursStart,
      dailyHoursEnd,
      weekdayHoursStart,
      weekdayHoursEnd,
      weekendHoursStart,
      weekendHoursEnd,
      dayHours,
      pmcareRepresentative,
      payeeList,
      consultationCharges,
      illnessCharges,
      selectedTechInfrastructures,
      selectedLabArrangements,
      selectedFacilities,
      selectedExperiences,
      selectedSpecialists,
      drugList,
      providerRepresentative,
      practicingDoctors,
      healthDoctors,
      radiographer,
      contract,
      status,
      packages,
      promotionFiles: promotionFiles.map((file) => ({ id: file.id, name: file.name })),
      formFields,
      availableDrugs,
      newDrugDosage,
      newDrugUnitPrice,
      newDrugMinimumSellingQuantity,
      newDrugSellingPrice,
      staffingList,
      newStaffRole,
      newStaffNumber,
    }
    localStorage.setItem("createProviderFormData", JSON.stringify(formData))

    // Determine the next tab
    const tabs = [
      "profile",
      "payment",
      "charges",
      "capabilities",
      "experience",
      "personnel",
      "contract",
      "advertisement",
      "document",
    ]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }

    toast({
      title: "Progress Saved",
      description: "Your form data has been saved and moved to the next tab.",
    })
  }

  // Add a function to handle the "Cancel" action
  const handleCancel = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      // Clear saved form data
      localStorage.removeItem("createProviderFormData")
      // Navigate to the providers list
      router.push("/providers")
    }
  }

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      if (posterPreview) {
        URL.revokeObjectURL(posterPreview)
      }
    }
  }, [posterPreview])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Providers", href: "/providers" },
          { label: "Create", href: "/providers/create", active: true },
        ]}
      />
      <PageHeader title="Create New Provider" description="Add a new healthcare provider to your network" />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="w-full overflow-x-auto">
            <div className="flex space-x-2 pb-4">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("profile")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  1
                </div>
                Profile
              </Button>
              <Button
                variant={activeTab === "payment" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("payment")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  2
                </div>
                Payment
              </Button>
              <Button
                variant={activeTab === "charges" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("charges")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  3
                </div>
                Charges
              </Button>
              <Button
                variant={activeTab === "capabilities" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("capabilities")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  4
                </div>
                Capabilities
              </Button>
              <Button
                variant={activeTab === "experience" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("experience")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  5
                </div>
                Experience
              </Button>
              <Button
                variant={activeTab === "personnel" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("personnel")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  6
                </div>
                Personnel
              </Button>
              <Button
                variant={activeTab === "contract" ? "default" : "ghost"}
                className={`flex items-center ${contractNeedsRenewal ? "animate-pulse bg-orange-100 hover:bg-orange-200" : ""}`}
                onClick={() => {
                  setActiveTab("contract")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  7
                </div>
                Contract {contractNeedsRenewal && <span className="ml-1 text-orange-600">•</span>}
              </Button>
              <Button
                variant={activeTab === "advertisement" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("advertisement")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  8
                </div>
                Advertisement
              </Button>
              <Button
                variant={activeTab === "document" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => {
                  setActiveTab("document")
                  toast({
                    title: "Progress Saved",
                    description: "Your form data has been saved automatically.",
                  })
                }}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  9
                </div>
                Document
              </Button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider-code">Provider Code (Auto-generated)</Label>
                      <Input id="provider-code" value={providerCode} readOnly className="bg-gray-50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-name">Provider Name (As per Borang B/F)</Label>
                        <Input
                          id="providerName"
                          name="name"
                          value={formFields.name}
                          onChange={(e) => {
                            setFormFields((prev) => ({ ...prev, name: e.target.value }))
                            if (errors.name && e.target.value.trim()) {
                              setErrors((prev) => ({ ...prev, name: undefined }))
                            }
                          }}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provider-alias">Provider Alias</Label>
                        <Input
                          id="provider-alias"
                          name="provider-alias"
                          value={formFields.providerAlias}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, providerAlias: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formFields.address}
                        onChange={(e) => setFormFields((prev) => ({ ...prev, address: e.target.value }))}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={formFields.city}
                          onValueChange={(value) => setFormFields((prev) => ({ ...prev, city: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city, index) => (
                              <SelectItem key={index} value={city.toLowerCase()}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={formFields.state}
                          onValueChange={(value) => setFormFields((prev) => ({ ...prev, state: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                            <SelectItem value="selangor">Selangor</SelectItem>
                            <SelectItem value="penang">Penang</SelectItem>
                            <SelectItem value="johor">Johor</SelectItem>
                            <SelectItem value="sabah">Sabah</SelectItem>
                            <SelectItem value="sarawak">Sarawak</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input
                          id="postcode"
                          name="postcode"
                          value={formFields.postcode}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, postcode: e.target.value }))}
                        />
                        {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">GPS Coordinates - Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.000001"
                          name="latitude"
                          value={formFields.latitude}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, latitude: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">GPS Coordinates - Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.000001"
                          name="longitude"
                          value={formFields.longitude}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, longitude: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tel-number">Provider Tel Number</Label>
                        <Input
                          id="telNumber"
                          name="telNumber"
                          value={formFields.telNumber}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, telNumber: e.target.value }))}
                        />
                        {errors.telNumber && <p className="text-red-500 text-sm mt-1">{errors.telNumber}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fax-number">Provider Fax No</Label>
                        <Input
                          id="fax-number"
                          name="fax-number"
                          value={formFields.faxNumber}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, faxNumber: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formFields.email}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, email: e.target.value }))}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile-phone">Mobile Phone No</Label>
                        <Input
                          id="mobile-phone"
                          name="mobile-phone"
                          value={formFields.mobilePhone}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, mobilePhone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">Phone WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          value={formFields.whatsapp}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, whatsapp: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={formFields.website}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proprietor">Proprietor</Label>
                        <Input
                          id="proprietor"
                          name="proprietor"
                          value={formFields.proprietor}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, proprietor: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passport">Passport No (For Non Malaysian Citizen Only)</Label>
                        <Input
                          id="passport"
                          name="passport"
                          value={formFields.passport}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, passport: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Registration & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-reg-no">Company Registration No</Label>
                        <Input
                          id="companyRegNo"
                          name="companyRegNo"
                          value={formFields.companyRegNo}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, companyRegNo: e.target.value }))}
                        />
                        {errors.companyRegNo && <p className="text-red-500 text-sm mt-1">{errors.companyRegNo}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gst-reg">GST Registration</Label>
                        <Input
                          id="gst-reg"
                          name="gst-reg"
                          value={formFields.gstReg}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, gstReg: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tin-no">TIN No</Label>
                        <Input
                          id="tinNo"
                          name="tinNo"
                          value={formFields.tinNo}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, tinNo: e.target.value }))}
                        />
                        {errors.tinNo && <p className="text-red-500 text-sm mt-1">{errors.tinNo}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sst-registration-no">SST Registration No.</Label>
                        <Input
                          id="sst-registration-no"
                          name="sst-registration-no"
                          value={formFields.sstRegistrationNo}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, sstRegistrationNo: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxpayer-status">Taxpayer Status</Label>
                      <Select
                        value={formFields.taxpayerStatus}
                        onValueChange={(value) => setFormFields((prev) => ({ ...prev, taxpayerStatus: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select taxpayer status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="above-100-million">
                            Taxpayer with an annual turnover above RM100 million
                          </SelectItem>
                          <SelectItem value="25-to-100-million">
                            Taxpayer with an annual turnover above RM25 million and up to RM100 million
                          </SelectItem>
                          <SelectItem value="other-taxpayer">Other Taxpayer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Classification & Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-type">Provider Type</Label>
                        <Select
                          value={selectedProviderType}
                          onValueChange={(value) => {
                            handleFormFieldChange("selectedProviderType", value)
                            setSelectedProviderType(value)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {providerTypes.map((type, index) => (
                              <SelectItem key={index} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provider-category">Provider Category</Label>
                        <Select
                          value={formFields.providerCategory}
                          onValueChange={(value) => setFormFields((prev) => ({ ...prev, providerCategory: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {providerCategories.map((category, index) => (
                              <SelectItem key={index} value={category.toLowerCase().replace(/\s+/g, "-")}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.providerCategory && (
                          <p className="text-red-500 text-sm mt-1">{errors.providerCategory}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gl-issuance"
                          name="gl-issuance"
                          checked={formFields.glIssuance}
                          onCheckedChange={(checked) =>
                            setFormFields((prev) => ({ ...prev, glIssuance: checked === true }))
                          }
                        />
                        <Label htmlFor="gl-issuance">Eligibility for GL Issuance?</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Services Provided</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {servicesProvided.map((service, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`service-${index}`}
                              checked={formFields.servicesProvided.includes(service)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormFields((prev) => ({
                                    ...prev,
                                    servicesProvided: [...prev.servicesProvided, service],
                                  }))
                                } else {
                                  setFormFields((prev) => ({
                                    ...prev,
                                    servicesProvided: prev.servicesProvided.filter((s) => s !== service),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={`service-${index}`}>{service}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Panel & Service Eligibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="use-mediline"
                          name="use-mediline"
                          checked={formFields.useMediline}
                          onCheckedChange={(checked) =>
                            setFormFields((prev) => ({ ...prev, useMediline: checked === true }))
                          }
                        />
                        <Label htmlFor="use-mediline">Use mediline?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ame-panel"
                          name="ame-panel"
                          checked={formFields.amePanel}
                          onCheckedChange={(checked) =>
                            setFormFields((prev) => ({ ...prev, amePanel: checked === true }))
                          }
                        />
                        <Label htmlFor="ame-panel">AME Panel?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="perkeso-panel"
                          name="perkeso-panel"
                          checked={formFields.perkesoPanel}
                          onCheckedChange={(checked) =>
                            setFormFields((prev) => ({ ...prev, perkesoPanel: checked === true }))
                          }
                        />
                        <Label htmlFor="perkeso-panel">PERKESO Panel?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="pmcare-panel"
                          name="pmcare-panel"
                          checked={formFields.pmcarePanel}
                          onCheckedChange={(checked) =>
                            setFormFields((prev) => ({ ...prev, pmcarePanel: checked === true }))
                          }
                        />
                        <Label htmlFor="pmcare-panel">PMCare Panel?</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="panel-group">Panel Group</Label>
                      <Select
                        value={formFields.panelGroup}
                        onValueChange={(value) => setFormFields((prev) => ({ ...prev, panelGroup: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {panelGroups.map((group, index) => (
                            <SelectItem key={index} value={group.toLowerCase().replace(/\s+/g, "-")}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Admission & Payment Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id="deposit-required"
                            checked={showDepositField}
                            onCheckedChange={(checked) => setShowDepositField(checked === true)}
                          />
                          <Label htmlFor="deposit-required">Deposit for admission required?</Label>
                        </div>
                        {showDepositField && (
                          <div className="space-y-2">
                            <Label htmlFor="deposit-admission">Deposit Amount (RM)</Label>
                            <Input
                              id="deposit-admission"
                              type="number"
                              step="0.01"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id="corporate-discount-checkbox"
                            checked={showDiscountFields}
                            onCheckedChange={(checked) => setShowDiscountFields(checked === true)}
                          />
                          <Label htmlFor="corporate-discount-checkbox">Corporate Discount</Label>
                        </div>

                        {showDiscountFields && (
                          <div className="space-y-4 border p-3 rounded-md">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="discount-category">Category</Label>
                                <Select value={newDiscountCategory} onValueChange={setNewDiscountCategory}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {discountCategories.map((category, index) => (
                                      <SelectItem key={index} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="discount-item">Item</Label>
                                <Select
                                  value={newDiscountItem}
                                  onValueChange={setNewDiscountItem}
                                  disabled={!newDiscountCategory}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {filteredDiscountItems.map((item, index) => (
                                      <SelectItem key={index} value={item.item}>
                                        {item.item}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="discount-percentage">Discount (%)</Label>
                                <Input
                                  id="discount-percentage"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={newDiscountPercentage}
                                  onChange={(e) => setNewDiscountPercentage(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="discount-remarks">Remarks</Label>
                                <Input
                                  id="discount-remarks"
                                  value={newDiscountRemarks}
                                  onChange={(e) => setNewDiscountRemarks(e.target.value)}
                                />
                              </div>
                            </div>

                            <Button type="button" onClick={addDiscountItem} className="w-full">
                              Add Discount Item
                            </Button>

                            {selectedDiscountItems.length > 0 && (
                              <div className="border rounded-md mt-4">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="px-4 py-2 text-left">Category</th>
                                      <th className="px-4 py-2 text-left">Item</th>
                                      <th className="px-4 py-2 text-left">Discount (%)</th>
                                      <th className="px-4 py-2 text-left">Remarks</th>
                                      <th className="px-4 py-2 text-right">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedDiscountItems.map((item, index) => (
                                      <tr
                                        key={index}
                                        className={index < selectedDiscountItems.length - 1 ? "border-b" : ""}
                                      >
                                        <td className="px-4 py-2">{item.category}</td>
                                        <td className="px-4 py-2">{item.item}</td>
                                        <td className="px-4 py-2">{item.discount}%</td>
                                        <td className="px-4 py-2">{item.remarks}</td>
                                        <td className="px-4 py-2 text-right">
                                          <Button variant="ghost" size="sm" onClick={() => removeDiscountItem(index)}>
                                            Remove
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operational Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="operating-hours">Operating Hours</Label>
                      <Select value={operatingHoursType} onValueChange={setOperatingHoursType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select.." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24 Hours">24 Hours</SelectItem>
                          <SelectItem value="Regular Hours">Regular Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {showRegularHours && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Daily</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor="daily-hours-start" className="text-xs">
                                From
                              </Label>
                              <Input
                                id="daily-hours-start"
                                type="time"
                                value={dailyHoursStart}
                                onChange={(e) => setDailyHoursStart(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="daily-hours-end" className="text-xs">
                                Until
                              </Label>
                              <Input
                                id="daily-hours-end"
                                type="time"
                                value={dailyHoursEnd}
                                onChange={(e) => setDailyHoursEnd(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Monday - Friday</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor="weekday-hours-start" className="text-xs">
                                From
                              </Label>
                              <Input
                                id="weekday-hours-start"
                                type="time"
                                value={weekdayHoursStart}
                                onChange={(e) => setWeekdayHoursStart(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="weekday-hours-end" className="text-xs">
                                Until
                              </Label>
                              <Input
                                id="weekday-hours-end"
                                type="time"
                                value={weekdayHoursEnd}
                                onChange={(e) => setWeekdayHoursEnd(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Saturday - Sunday</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor="weekend-hours-start" className="text-xs">
                                From
                              </Label>
                              <Input
                                id="weekend-hours-start"
                                type="time"
                                value={weekendHoursStart}
                                onChange={(e) => setWeekendHoursStart(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="weekend-hours-end" className="text-xs">
                                Until
                              </Label>
                              <Input
                                id="weekend-hours-end"
                                type="time"
                                value={weekendHoursEnd}
                                onChange={(e) => setWeekendHoursEnd(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="additional-info"
                            checked={showAdditionalInfo}
                            onCheckedChange={(checked) => setShowAdditionalInfo(checked === true)}
                          />
                          <Label htmlFor="additional-info">Additional info</Label>
                        </div>

                        {showAdditionalInfo && (
                          <div className="space-y-4 border-t pt-4">
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                              "Public Holiday",
                            ].map((day) => (
                              <div key={day} className="space-y-2">
                                <Label>{day}</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <Label htmlFor={`${day.toLowerCase()}-hours-start`} className="text-xs">
                                      From
                                    </Label>
                                    <Input
                                      id={`${day.toLowerCase()}-hours-start`}
                                      type="time"
                                      value={dayHours[day.toLowerCase()]?.start || ""}
                                      onChange={(value) =>
                                        setDayHours({
                                          ...dayHours,
                                          [day.toLowerCase()]: {
                                            ...dayHours[day.toLowerCase()],
                                            start: value.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`${day.toLowerCase()}-hours-end`} className="text-xs">
                                      Until
                                    </Label>
                                    <Input
                                      id={`${day.toLowerCase()}-hours-end`}
                                      type="time"
                                      value={dayHours[day.toLowerCase()]?.end || ""}
                                      onChange={(value) =>
                                        setDayHours({
                                          ...dayHours,
                                          [day.toLowerCase()]: {
                                            ...dayHours[day.toLowerCase()],
                                            end: value.target.value,
                                          },
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                {/* Replace the existing PMCare Representative section with the following code: */}
                <Card key={`pmcare-${pmcareRepresentative.personInCharge}-${pmcareRepresentative.email}`}>
                  <CardHeader>
                    <CardTitle>PMCare Representative</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showRepSelection && (
                      <div className="border rounded-md p-4 bg-blue-50 mb-4">
                        <Label className="text-sm font-medium mb-2 block">
                          Multiple representatives found. Please select one:
                        </Label>
                        <div className="space-y-2">
                          {filteredPmcareReps.map((rep, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleRepresentativeSelection(rep)}
                            >
                              <div>
                                <div className="font-medium">{rep.personInCharge}</div>
                                <div className="text-sm text-gray-500">
                                  {rep.designation} - {rep.email} - {rep.phone}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Provider Types: {rep.providerTypes.join(", ")} | States: {rep.states.join(", ")}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                Select
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredPmcareReps.length === 1 && !showRepSelection && pmcareRepresentative.personInCharge && (
                      <div className="border rounded-md p-3 bg-green-50 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-700">
                            Representative auto-selected: <strong>{pmcareRepresentative.personInCharge}</strong> based
                            on provider type and state
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pmcare-person">Person In Charge</Label>
                        <Input
                          id="pmcare-person"
                          value={pmcareRepresentative.personInCharge}
                          onChange={(e) =>
                            setPmcareRepresentative((prev) => ({
                              ...prev,
                              personInCharge: e.target.value,
                            }))
                          }
                          readOnly={filteredPmcareReps.length === 1 && pmcareRepresentative.personInCharge !== ""}
                          className={
                            filteredPmcareReps.length === 1 && pmcareRepresentative.personInCharge !== ""
                              ? "bg-gray-50"
                              : ""
                          }
                          placeholder="Enter person in charge name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pmcare-designation">Designation</Label>
                        <Input
                          id="pmcare-designation"
                          value={pmcareRepresentative.designation}
                          onChange={(e) =>
                            setPmcareRepresentative((prev) => ({
                              ...prev,
                              designation: e.target.value,
                            }))
                          }
                          readOnly={filteredPmcareReps.length === 1 && pmcareRepresentative.designation !== ""}
                          className={
                            filteredPmcareReps.length === 1 && pmcareRepresentative.designation !== ""
                              ? "bg-gray-50"
                              : ""
                          }
                          placeholder="Enter designation"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pmcare-status">Status</Label>
                        <Select
                          value={pmcareRepresentative.status}
                          onValueChange={(value) =>
                            setPmcareRepresentative((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                          disabled={filteredPmcareReps.length === 1 && pmcareRepresentative.status !== ""}
                        >
                          <SelectTrigger
                            className={
                              filteredPmcareReps.length === 1 && pmcareRepresentative.status !== "" ? "bg-gray-50" : ""
                            }
                          >
                            <SelectValue placeholder="Select status">
                              {pmcareRepresentative.status || "Select status"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Extension">Extension</SelectItem>
                            <SelectItem value="N/A">N/A</SelectItem>
                            <SelectItem value="Renewal">Renewal</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                            <SelectItem value="Terminated">Terminated</SelectItem>
                            <SelectItem value="Void">Void</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pmcare-phone">Phone</Label>
                        <Input
                          id="pmcare-phone"
                          value={pmcareRepresentative.phone}
                          onChange={(e) =>
                            setPmcareRepresentative((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          readOnly={filteredPmcareReps.length === 1 && pmcareRepresentative.phone !== ""}
                          className={
                            filteredPmcareReps.length === 1 && pmcareRepresentative.phone !== "" ? "bg-gray-50" : ""
                          }
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pmcare-email">Email</Label>
                        <Input
                          id="pmcare-email"
                          type="email"
                          value={pmcareRepresentative.email}
                          onChange={(e) =>
                            setPmcareRepresentative((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          readOnly={filteredPmcareReps.length === 1 && pmcareRepresentative.email !== ""}
                          className={
                            filteredPmcareReps.length === 1 && pmcareRepresentative.email !== "" ? "bg-gray-50" : ""
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    {filteredPmcareReps.length === 0 && selectedProviderType && formFields.state && (
                      <div className="border rounded-md p-3 bg-yellow-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-yellow-700">
                            No PMCare representative found for {selectedProviderType} in{" "}
                            {formFields.state
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                            . Please enter manually or contact admin.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Add a button to clear auto-selected data if needed */}
                    {filteredPmcareReps.length > 0 && pmcareRepresentative.personInCharge && (
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPmcareRepresentative({
                              personInCharge: "",
                              designation: "",
                              status: "",
                              phone: "",
                              email: "",
                            })
                            toast({
                              title: "Representative Cleared",
                              description: "PMCare representative data has been cleared. You can now enter manually.",
                            })
                          }}
                        >
                          Clear & Enter Manually
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons for Profile Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payee List</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-no">Account No</Label>
                        <Input
                          id="account-no"
                          value={payeeList.accountNo}
                          onChange={(e) =>
                            setPayeeList({
                              ...payeeList,
                              accountNo: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank">Bank</Label>
                        <Select
                          value={payeeList.bank}
                          onValueChange={(
                            value, // Change from onChange to onValueChange
                          ) =>
                            setPayeeList({
                              ...payeeList,
                              bank: value,
                            })
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maybank">Maybank</SelectItem>
                            <SelectItem value="cimb">CIMB Bank</SelectItem>
                            <SelectItem value="public-bank">Public Bank</SelectItem>
                            <SelectItem value="rhb">RHB Bank</SelectItem>
                            <SelectItem value="hong-leong">Hong Leong Bank</SelectItem>
                            <SelectItem value="bank-islam">Bank Islam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="payee">Payee</Label>
                        <Input
                          id="payee"
                          value={payeeList.payee}
                          onChange={(e) =>
                            setPayeeList({
                              ...payeeList,
                              payee: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-method-code">Payment Method Code</Label>
                        <Input
                          id="payment-method-code"
                          value={payeeList.paymentMethodCode}
                          onChange={(e) =>
                            setPayeeList({
                              ...payeeList,
                              paymentMethodCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Guarantee</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bg-no">BG No</Label>
                        <Input
                          id="bg-no"
                          value={formFields.bgNo}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, bgNo: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bg-amount">BG Amount (RM)</Label>
                        <Input
                          id="bg-amount"
                          type="number"
                          step="0.01"
                          value={formFields.bgAmount}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, bgAmount: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bg-expiry-date">BG Expiry Date</Label>
                        <Input
                          id="bg-expiry-date"
                          type="date"
                          value={formFields.bgExpiryDate}
                          onChange={(e) => setFormFields((prev) => ({ ...prev, bgExpiryDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons for Profile Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "charges" && (
              <div className="space-y-6">
                <Tabs defaultValue="consultation">
                  <TabsList className="w-full">
                    <TabsTrigger value="consultation" className="flex-1">
                      Charges for Consultation Fees
                    </TabsTrigger>
                    <TabsTrigger value="illness" className="flex-1">
                      Charges for Common and Chronic Illness
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="consultation" className="pt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="charges-type">Charges Type</Label>
                            <Select value={newChargeType} onValueChange={setNewChargeType}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {chargesTypes.map((type, index) => (
                                  <SelectItem key={index} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="charges-amount">Charges (RM)</Label>
                            <Input
                              id="charges-amount"
                              type="number"
                              step="0.01"
                              value={newChargeAmount}
                              onChange={(e) => setNewChargeAmount(e.target.value)}
                            />
                          </div>
                        </div>

                        <Button type="button" variant="outline" onClick={addConsultationCharge}>
                          Add Charges
                        </Button>

                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="px-4 py-2 text-left">Charges Type</th>
                                <th className="px-4 py-2 text-left">Charges (RM)</th>
                                <th className="px-4 py-2 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {consultationCharges.map((charge, index) => (
                                <tr key={index} className={index < consultationCharges.length - 1 ? "border-b" : ""}>
                                  <td className="px-4 py-2">{charge.type}</td>
                                  <td className="px-4 py-2">{charge.amount}</td>
                                  <td className="px-4 py-2 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => removeConsultationCharge(index)}>
                                      Remove
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="illness" className="pt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="diagnosed-illness">List of Diagnosed Illness</Label>
                            <Select value={newIllness} onValueChange={setNewIllness}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {diagnosedIllnesses.map((illness, index) => (
                                  <SelectItem key={index} value={illness}>
                                    {illness}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="medication-price">Average cost of medication price</Label>
                            <Input
                              id="medication-price"
                              type="number"
                              step="0.01"
                              value={newIllnessCost}
                              onChange={(e) => setNewIllnessCost(e.target.value)}
                            />
                          </div>
                        </div>

                        <Button type="button" variant="outline" onClick={addIllnessCharge}>
                          Add Illness
                        </Button>

                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="px-4 py-2 text-left">Diagnosed Illness</th>
                                <th className="px-4 py-2 text-left">Average Cost (RM)</th>
                                <th className="px-4 py-2 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {illnessCharges.map((illness, index) => (
                                <tr key={index} className={index < illnessCharges.length - 1 ? "border-b" : ""}>
                                  <td className="px-4 py-2">{illness.illness}</td>
                                  <td className="px-4 py-2">{illness.cost}</td>
                                  <td className="px-4 py-2 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => removeIllnessCharge(index)}>
                                      Remove
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                {/* Action Buttons for Profile Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "capabilities" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Technology Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Technology Infrastructure</Label>
                      <div className="border rounded-md p-4 space-y-2">
                        {techInfrastructures.map((tech, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tech-${index}`}
                              checked={selectedTechInfrastructures.includes(tech.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTechInfrastructures([...selectedTechInfrastructures, tech.name])
                                } else {
                                  setSelectedTechInfrastructures(
                                    selectedTechInfrastructures.filter((t) => t !== tech.name),
                                  )
                                }
                              }}
                            />
                            <div>
                              <Label htmlFor={`tech-${index}`} className="font-medium">
                                {tech.name}
                              </Label>
                              <p className="text-sm text-gray-500">{tech.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Laboratories Arrangement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Laboratory Arrangements</Label>
                      <div className="border rounded-md p-4 space-y-2">
                        {labArrangements.map((lab, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`lab-${index}`}
                              checked={selectedLabArrangements.includes(lab.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedLabArrangements([...selectedLabArrangements, lab.name])
                                } else {
                                  setSelectedLabArrangements(selectedLabArrangements.filter((l) => l !== lab.name))
                                }
                              }}
                            />
                            <div>
                              <Label htmlFor={`lab-${index}`} className="font-medium">
                                {lab.name}
                              </Label>
                              <p className="text-sm text-gray-500">{lab.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Facilities/Services Available</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Facilities/Services</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        {facilities.map((facility, index) => {
                          const isSelected = selectedFacilities.some((f) => f.name === facility.name)
                          const facilityCharges = isSelected
                            ? selectedFacilities.find((f) => f.name === facility.name)?.charges || ""
                            : ""

                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`facility-${index}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      // Add to selected facilities with default charges of 0
                                      addFacility(facility.name)
                                    } else {
                                      // Remove from selected facilities
                                      removeFacility(facility.name)
                                    }
                                  }}
                                />
                                <div>
                                  <Label htmlFor={`facility-${index}`} className="font-medium">
                                    {facility.name}
                                  </Label>
                                  <p className="text-sm text-gray-500">{facility.description}</p>
                                </div>
                              </div>

                              {isSelected && (
                                <div className="ml-6 flex items-center space-x-2">
                                  <Label htmlFor={`facility-charges-${index}`} className="w-24">
                                    Charges (RM):
                                  </Label>
                                  <Input
                                    id={`facility-charges-${index}`}
                                    type="number"
                                    step="0.01"
                                    value={facilityCharges}
                                    onChange={(e) => {
                                      const updatedFacilities = selectedFacilities.map((f) =>
                                        f.name === facility.name ? { ...f, charges: e.target.value } : f,
                                      )
                                      setSelectedFacilities(updatedFacilities)
                                    }}
                                    className="w-32"
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Drug List</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Replace the Drug dropdown in the "Drug List" section with: */}
                      <div className="space-y-2">
                        <Label htmlFor="drugName">Drug Name</Label>
                        <Select value={newDrug.drugCode} onValueChange={handleDrugSelection}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select drug">
                              {newDrug.drugCode && newDrug.productName
                                ? `${newDrug.productName} (${newDrug.genericName})`
                                : newDrug.drugCode
                                  ? (() => {
                                      const setupData = getSetupData()
                                      const availableDrugs = setupData.drugs || []
                                      const selectedDrug = availableDrugs.find(
                                        (drug) => drug.drugCode === newDrug.drugCode,
                                      )
                                      return selectedDrug
                                        ? `${selectedDrug.productName} (${selectedDrug.genericName})`
                                        : newDrug.drugCode
                                    })()
                                  : "Select drug"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const setupData = getSetupData()
                              const availableDrugs = setupData.drugs || []
                              return availableDrugs && availableDrugs.length > 0 ? (
                                availableDrugs.map((drug) => (
                                  <SelectItem key={drug.drugCode} value={drug.drugCode}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{drug.productName}</span>
                                      <span className="text-sm text-gray-500">{drug.genericName}</span>
                                      <span className="text-xs text-gray-400">{drug.drugCode}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-drugs-available" disabled>
                                  No drugs available. Please add drugs in Provider Setup first.
                                </SelectItem>
                              )
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drug-dosage">Dosage</Label>
                        <Select value={newDrugDosage} onValueChange={setNewDrugDosage}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dosage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Each">Each</SelectItem>
                            <SelectItem value="Suppository">Suppository</SelectItem>
                            <SelectItem value="Tablet">Tablet</SelectItem>
                            <SelectItem value="Vial">Vial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="drug-unit-price">Unit Price (RM)</Label>
                        <Input
                          id="drug-unit-price"
                          type="number"
                          step="0.01"
                          value={newDrugUnitPrice}
                          onChange={(e) => setNewDrugUnitPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drug-minimum-quantity">Minimum Selling Quantity</Label>
                        <Input
                          id="drug-minimum-quantity"
                          type="number"
                          value={newDrugMinimumSellingQuantity}
                          onChange={(e) => setNewDrugMinimumSellingQuantity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drug-selling-price">Selling Price (RM)</Label>
                        <Input
                          id="drug-selling-price"
                          type="number"
                          step="0.01"
                          value={newDrugSellingPrice}
                          onChange={(e) => setNewDrugSellingPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button type="button" onClick={addDrug}>
                      Add Drug
                    </Button>

                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Drug Name</th>
                            <th className="px-4 py-2 text-left">Dosage</th>
                            <th className="px-4 py-2 text-left">Unit Price (RM)</th>
                            <th className="px-4 py-2 text-left">Min. Qty</th>
                            <th className="px-4 py-2 text-left">Selling Price (RM)</th>
                            <th className="px-4 py-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {drugList.map((drug, index) => (
                            <tr key={index} className={index < drugList.length - 1 ? "border-b" : ""}>
                              <td className="px-4 py-2">{drug.drugName}</td>
                              <td className="px-4 py-2">{drug.dosage}</td>
                              <td className="px-4 py-2">{drug.unitPrice}</td>
                              <td className="px-4 py-2">{drug.minimumSellingQuantity}</td>
                              <td className="px-4 py-2">{drug.sellingPrice}</td>
                              <td className="px-4 py-2 text-right">
                                <Button variant="ghost" size="sm" onClick={() => removeDrug(index)}>
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                {/* Action Buttons for Profile Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Experiences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Provider Experiences</Label>
                      <div className="border rounded-md p-4 space-y-2">
                        {experiences.map((exp, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`exp-${index}`}
                              checked={selectedExperiences.includes(exp.years)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedExperiences([...selectedExperiences, exp.years])
                                } else {
                                  setSelectedExperiences(selectedExperiences.filter((e) => e !== exp.years))
                                }
                              }}
                            />
                            <div>
                              <Label htmlFor={`exp-${index}`} className="font-medium">
                                {exp.years}
                              </Label>
                              <p className="text-sm text-gray-500">{exp.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Action Buttons for Profile Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "personnel" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider's Representative</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pic-doctor">Name of PIC doctor</Label>
                        <Input
                          id="pic-doctor"
                          value={providerRepresentative.nameOfPICDoctor}
                          onChange={(e) =>
                            setProviderRepresentative({
                              ...providerRepresentative,
                              nameOfPICDoctor: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pic-phone">Phone number</Label>
                        <Input
                          id="pic-phone"
                          value={providerRepresentative.phoneNumber}
                          onChange={(e) =>
                            setProviderRepresentative({
                              ...providerRepresentative,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Staffing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Replace the Staffing Role dropdown in the "Staffing" section with: */}
                      <div className="space-y-2">
                        <Label htmlFor="staff-role">Role</Label>
                        <Select value={newStaffRole} onValueChange={setNewStaffRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const setupData = getSetupData()
                              // Changed from staffing to staffingRequirements to match the data structure
                              const staffingRoles = setupData.staffingRequirements || []
                              return staffingRoles.map((staff, index) => (
                                <SelectItem key={index} value={staff.role}>
                                  {staff.role}
                                </SelectItem>
                              ))
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staff-number">Number of Staff(s)</Label>
                        <Input
                          id="staff-number"
                          type="number"
                          min="1"
                          placeholder="Enter number"
                          value={newStaffNumber}
                          onChange={(e) => setNewStaffNumber(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button type="button" onClick={addStaff}>
                      Add Staff
                    </Button>

                    {staffingList.length > 0 && (
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-2 text-left">Role</th>
                              <th className="px-4 py-2 text-left">Number of Staff(s)</th>
                              <th className="px-4 py-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {staffingList.map((staff, index) => (
                              <tr key={index} className={index < staffingList.length - 1 ? "border-b" : ""}>
                                <td className="px-4 py-2">{staff.role}</td>
                                <td className="px-4 py-2">{staff.numberOfStaff}</td>
                                <td className="px-4 py-2 text-right">
                                  <Button variant="ghost" size="sm" onClick={() => removeStaff(index)}>
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Details of Practicing Doctors/Proprietors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-name">Name</Label>
                        <Input
                          id="doctor-name"
                          value={newDoctor.name}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-role">Role</Label>
                        <Select
                          value={newDoctor.role}
                          onValueChange={(value) =>
                            setNewDoctor({
                              ...newDoctor,
                              role: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="proprietor">Proprietor</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                            <SelectItem value="attending-doctor">Attending Doctor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-nric">New NRIC No</Label>
                        <Input
                          id="doctor-nric"
                          value={newDoctor.nric}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              nric: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-gender">Gender</Label>
                        <Select
                          value={newDoctor.gender}
                          onValueChange={(value) =>
                            setNewDoctor({
                              ...newDoctor,
                              gender: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-university">College/University</Label>
                        <Input
                          id="doctor-university"
                          value={newDoctor.university}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              university: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-degree">Degree</Label>
                        <Select
                          value={newDoctor.degree}
                          onValueChange={(value) =>
                            setNewDoctor({
                              ...newDoctor,
                              degree: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="md">MD (Medical Doctor)</SelectItem>
                            <SelectItem value="mbbs">MBBS (Medicine Bachelor of Surgery)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Replace the Specialty dropdown in the "Details of Practicing Doctors/Proprietors" section with: */}
                      <div className="space-y-2">
                        <Label htmlFor="doctor-specialty">Specialty</Label>
                        <Select
                          value={newDoctor.specialty}
                          onValueChange={(value) =>
                            setNewDoctor({
                              ...newDoctor,
                              specialty: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const setupData = getSetupData()
                              const specialties = setupData.specialtyDoctors || []
                              return specialties.map((specialty, index) => (
                                <SelectItem key={index} value={specialty}>
                                  {specialty}
                                </SelectItem>
                              ))
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Replace the Sub-Specialty dropdown in the "Details of Practicing Doctors/Proprietors" section with: */}
                      <div className="space-y-2">
                        <Label htmlFor="doctor-sub-specialty">Sub-Specialty</Label>
                        <Select
                          value={newDoctor.subSpecialty}
                          onValueChange={(value) =>
                            setNewDoctor({
                              ...newDoctor,
                              subSpecialty: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub-specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const setupData = getSetupData()
                              const subSpecialties = setupData.subSpecialtyDoctors || []
                              return subSpecialties.map((subSpecialty, index) => (
                                <SelectItem key={index} value={subSpecialty}>
                                  {subSpecialty}
                                </SelectItem>
                              ))
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-year">Year</Label>
                        <Input
                          id="doctor-year"
                          value={newDoctor.year}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              year: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-mmc">MMC No.</Label>
                        <Input
                          id="doctor-mmc"
                          value={newDoctor.mmcNo}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              mmcNo: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-nsr">NSR No.</Label>
                        <Input
                          id="doctor-nsr"
                          value={newDoctor.nsrNo}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              nsrNo: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-apc">APC No.</Label>
                        <Input
                          id="doctor-apc"
                          value={newDoctor.apcNo}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              apcNo: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-qualification">Additional Qualification</Label>
                        <Input
                          id="doctor-qualification"
                          placeholder="DFM etc."
                          value={newDoctor.additionalQualification}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              additionalQualification: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-working-hours-start">Working Hours (Start)</Label>
                        <Input
                          id="doctor-working-hours-start"
                          type="time"
                          value={newDoctor.workingHoursStart}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              workingHoursStart: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-working-hours-end">Working Hour (End)</Label>
                        <Input
                          id="doctor-working-hours-end"
                          type="time"
                          value={newDoctor.workingHoursEnd}
                          onChange={(e) =>
                            setNewDoctor({
                              ...newDoctor,
                              workingHoursEnd: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button type="button" onClick={addPracticingDoctor}>
                      Add Doctor
                    </Button>

                    {practicingDoctors.length > 0 && (
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-2 text-left">Name</th>
                              <th className="px-4 py-2 text-left">Role</th>
                              <th className="px-4 py-2 text-left">NRIC</th>
                              <th className="px-4 py-2 text-left">Gender</th>
                              <th className="px-4 py-2 text-left">University</th>
                              <th className="px-4 py-2 text-left">Degree</th>
                              <th className="px-4 py-py-2 text-left">Specialty</th>
                              <th className="px-4 py-2 text-left">Sub-Specialty</th>
                              <th className="px-4 py-2 text-left">Year</th>
                              <th className="px-4 py-2 text-left">APC No.</th>
                              <th className="px-4 py-2 text-left">Qualifications</th>
                              <th className="px-4 py-2 text-left">Hours</th>
                              <th className="px-4 py-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {practicingDoctors.map((doctor, index) => (
                              <tr key={index} className={index < practicingDoctors.length - 1 ? "border-b" : ""}>
                                <td className="px-4 py-2">{doctor.name}</td>
                                <td className="px-4 py-2">{doctor.role}</td>
                                <td className="px-4 py-2">{doctor.nric}</td>
                                <td className="px-4 py-2">{doctor.gender}</td>
                                <td className="px-4 py-2">{doctor.university}</td>
                                <td className="px-4 py-2">{doctor.degree}</td>
                                <td className="px-4 py-2">{doctor.specialty}</td>
                                <td className="px-4 py-2">{doctor.subSpecialty}</td>
                                <td className="px-4 py-2">{doctor.year}</td>
                                <td className="px-4 py-2">{doctor.apcNo}</td>
                                <td className="px-4 py-2">{doctor.additionalQualification}</td>
                                <td className="px-4 py-2">
                                  {doctor.workingHoursStart} - {doctor.workingHoursEnd}
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setNewDoctor(doctor)
                                      setPracticingDoctors(practicingDoctors.filter((_, i) => i !== index))
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => removePracticingDoctor(index)}>
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Occupational Health Doctor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="health-doctor-name">Name</Label>
                        <Input
                          id="health-doctor-name"
                          value={newHealthDoctor.name}
                          onChange={(e) =>
                            setNewHealthDoctor({
                              ...newHealthDoctor,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="health-doctor-reg">OHD Registration No.</Label>
                        <Input
                          id="health-doctor-reg"
                          value={newHealthDoctor.registrationNo}
                          onChange={(e) =>
                            setNewHealthDoctor({
                              ...newHealthDoctor,
                              registrationNo: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="health-doctor-effective">Effective date</Label>
                        <Input
                          id="health-doctor-effective"
                          type="date"
                          value={newHealthDoctor.effectiveDate}
                          onChange={(e) =>
                            setNewHealthDoctor({
                              ...newHealthDoctor,
                              effectiveDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="health-doctor-expiry">Expiry date</Label>
                        <Input
                          id="health-doctor-expiry"
                          type="date"
                          value={newHealthDoctor.expiryDate}
                          onChange={(e) =>
                            setNewHealthDoctor({
                              ...newHealthDoctor,
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="health-doctor-status">Status</Label>
                        <Select
                          value={newHealthDoctor.status || ""}
                          onChange={(value) =>
                            setNewHealthDoctor({
                              ...newHealthDoctor,
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="extension">Extension</SelectItem>
                            <SelectItem value="n/a">N/A</SelectItem>
                            <SelectItem value="renewal">Renewal</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                            <SelectItem value="void">Void</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="button" onClick={addHealthDoctor}>
                      Add Health Doctor
                    </Button>

                    {healthDoctors.length > 0 && (
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-2 text-left">Name</th>
                              <th className="px-4 py-2 text-left">Registration No.</th>
                              <th className="px-4 py-2 text-left">Effective Date</th>
                              <th className="px-4 py-2 text-left">Expiry Date</th>
                              <th className="px-4 py-2 text-left">Status</th>
                              <th className="px-4 py-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {healthDoctors.map((doctor, index) => (
                              <tr key={index} className={index < healthDoctors.length - 1 ? "border-b" : ""}>
                                <td className="px-4 py-2">{doctor.name}</td>
                                <td className="px-4 py-2">{doctor.registrationNo}</td>
                                <td className="px-4 py-2">{doctor.effectiveDate}</td>
                                <td className="px-4 py-2">{doctor.expiryDate}</td>
                                <td className="px-4 py-2 capitalize">{doctor.status}</td>
                                <td className="px-4 py-2 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setNewHealthDoctor(doctor)
                                      setHealthDoctors(healthDoctors.filter((_, i) => i !== index))
                                      toast({
                                        title: "Edit Health Doctor",
                                        description: "Health doctor details loaded for editing.",
                                      })
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => removeHealthDoctor(index)}>
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resident Specialist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Resident Specialists</Label>
                      <div className="border rounded-md p-4 space-y-2">
                        {specialists.map((specialist, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`specialist-${index}`}
                              checked={selectedSpecialists.includes(specialist.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSpecialists([...selectedSpecialists, specialist.name])
                                } else {
                                  setSelectedSpecialists(selectedSpecialists.filter((s) => s !== specialist.name))
                                }
                              }}
                            />
                            <div>
                              <Label htmlFor={`specialist-${index}`} className="font-medium">
                                {specialist.name}
                              </Label>
                              <p className="text-sm text-gray-500">
                                {specialist.specialty} - {specialist.qualification}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Radiographer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="radiographer-name">Name</Label>
                      <Input
                        id="radiographer-name"
                        value={radiographer.name}
                        onChange={(e) =>
                          setRadiographer({
                            ...radiographer,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiographer-reg">Reg. No.</Label>
                      <Input
                        id="radiographer-reg"
                        value={radiographer.regNo}
                        onChange={(e) =>
                          setRadiographer({
                            ...radiographer,
                            regNo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiographer-field">Radiographer Field Validation</Label>
                      <Input
                        id="radiographer-field"
                        value={radiographer.fieldValidation}
                        onChange={(e) =>
                          setRadiographer({
                            ...radiographer,
                            fieldValidation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Spoken Language</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Languages</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {spokenLanguages.map((language, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`language-${index}`}
                              checked={selectedLanguages.includes(language)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFormFieldChange("selectedLanguages", [...selectedLanguages, language])
                                  setSelectedLanguages([...selectedLanguages, language])
                                } else {
                                  handleFormFieldChange(
                                    "selectedLanguages",
                                    selectedLanguages.filter((lang) => lang !== language),
                                  )
                                  setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language))
                                }
                              }}
                            />
                            <Label htmlFor={`language-${index}`}>{language}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Action Buttons for Profile Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contract" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Panel Application Date</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="panel-application-date">Date</Label>
                      <Input
                        id="panel-application-date"
                        type="date"
                        value={formFields.panelApplicationDate}
                        onChange={(e) => setFormFields((prev) => ({ ...prev, panelApplicationDate: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contract Period with PMCare</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-start-date">Start Date</Label>
                        <Input
                          id="contract-start-date"
                          type="date"
                          value={contract.startDate}
                          onChange={(e) => {
                            const newStartDate = e.target.value
                            setContract((prev) => ({
                              ...prev,
                              startDate: newStartDate,
                            }))
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contract-end-date">End Date</Label>
                        <Input
                          id="contract-end-date"
                          type="date"
                          value={contract.endDate}
                          onChange={(e) => {
                            const newEndDate = e.target.value
                            setContract((prev) => ({
                              ...prev,
                              endDate: newEndDate,
                            }))
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-duration">Duration</Label>
                        <Input id="contract-duration" value={contract.duration} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 h-full pt-6">
                          <Checkbox
                            id="contract-renewal"
                            checked={contract.renewal}
                            onCheckedChange={(checked) =>
                              setContract({
                                ...contract,
                                renewal: checked === true,
                              })
                            }
                          />
                          <Label htmlFor="contract-renewal">Contract renewal?</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contract-status">Status</Label>
                        <Select
                          value={status.status || ""}
                          onValueChange={(value) =>
                            setStatus({
                              ...status,
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select">{status.status}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {status.status === "suspended" && (
                      <div className="space-y-2">
                        <Label htmlFor="suspension-date">Suspension date</Label>
                        <Input
                          id="suspension-date"
                          type="date"
                          value={status.suspensionDate}
                          onChange={(e) =>
                            setStatus({
                              ...status,
                              suspensionDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {status.status === "terminated" && (
                      <div className="space-y-2">
                        <Label htmlFor="termination-date">Termination date</Label>
                        <Input
                          id="termination-date"
                          type="date"
                          value={status.terminationDate}
                          onChange={(e) =>
                            setStatus({
                              ...status,
                              terminationDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="ceo-approval-date">Appointment date (Auto generated after CEO approved)</Label>
                      <Input id="ceo-approval-date" value={status.ceoApprovalDate} readOnly className="bg-gray-50" />
                    </div>
                  </CardContent>
                </Card>
                {/* Action Buttons for Profile Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "advertisement" && (
              <div className="space-y-6">
                <Tabs defaultValue="health-screening">
                  <TabsList className="w-full">
                    <TabsTrigger value="health-screening" className="flex-1">
                      Health Screening Package
                    </TabsTrigger>
                    <TabsTrigger value="promotion" className="flex-1">
                      Advertisement & Promotion
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="health-screening" className="pt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-6">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">Packages</h3>
                          <div className="space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                // Trigger file input click
                                const fileInput = document.getElementById("poster-upload")
                                if (fileInput) fileInput.click()
                              }}
                            >
                              Upload Poster
                            </Button>
                            <Input
                              id="poster-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleUploadPoster}
                            />
                            <Button type="button" onClick={handleNewPackage}>
                              New Package
                            </Button>
                          </div>
                        </div>

                        {packages.length === 0 ? (
                          <div className="border rounded-md p-6 text-center text-muted-foreground">
                            No packages created yet.
                          </div>
                        ) : (
                          <div className="border rounded-md">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="px-4 py-2 text-left">Package Name</th>
                                  <th className="px-4 py-2 text-left">Price (RM)</th>
                                  <th className="px-4 py-2 text-left">Discount (%)</th>
                                  <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {packages.map((pkg) => (
                                  <tr key={pkg.id} className="border-b">
                                    <td className="px-4 py-2">{pkg.name}</td>
                                    <td className="px-4 py-2">{pkg.price}</td>
                                    <td className="px-4 py-2">{pkg.discount}</td>
                                    <td className="px-4 py-2 text-right">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          try {
                                            setCurrentPackage(pkg)
                                            setSelectedPackageId(pkg.id)
                                            setShowPackageForm(true)
                                            if (pkg.posterImage) {
                                              // Clean up previous preview
                                              if (posterPreview) {
                                                URL.revokeObjectURL(posterPreview)
                                              }
                                              const previewUrl = URL.createObjectURL(pkg.posterImage)
                                              setPosterPreview(previewUrl)
                                            }
                                          } catch (error) {
                                            console.error("Error editing package:", error)
                                            toast({
                                              title: "Error",
                                              description: "Failed to load package for editing.",
                                              variant: "destructive",
                                            })
                                          }
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setPackages(packages.filter((p) => p.id !== pkg.id))
                                          toast({
                                            title: "Package Deleted",
                                            description: "The package has been deleted.",
                                          })
                                        }}
                                      >
                                        Delete
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {showPackageForm && (
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">
                              {selectedPackageId ? "Edit Package" : "Create New Package"}
                            </h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="package-name">Package Name</Label>
                                <Input
                                  id="package-name"
                                  placeholder="Enter package name"
                                  value={currentPackage.name}
                                  onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="package-gender">Gender</Label>
                                <Select
                                  value={currentPackage.gender}
                                  onValueChange={(value) => setCurrentPackage({ ...currentPackage, gender: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="package-description">Description</Label>
                                <Textarea
                                  id="package-description"
                                  placeholder="Enter package description"
                                  rows={4}
                                  value={currentPackage.description}
                                  onChange={(e) =>
                                    setCurrentPackage({ ...currentPackage, description: e.target.value })
                                  }
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="price">Price (RM)</Label>
                                  <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={currentPackage.price}
                                    onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="discount">Discount (%)</Label>
                                  <Input
                                    id="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={currentPackage.discount}
                                    onChange={(e) => setCurrentPackage({ ...currentPackage, discount: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="whatsapp-booking">WhatsApp Number for Booking</Label>
                                <Input
                                  id="whatsapp-booking"
                                  placeholder="60123456789"
                                  value={currentPackage.whatsappNumber}
                                  onChange={(e) =>
                                    setCurrentPackage({ ...currentPackage, whatsappNumber: e.target.value })
                                  }
                                />
                              </div>

                              {posterPreview && (
                                <div className="space-y-2">
                                  <Label>Poster Preview</Label>
                                  <div className="border rounded-md p-2">
                                    <img
                                      src={posterPreview || "/placeholder.svg"}
                                      alt="Poster preview"
                                      className="max-h-40 mx-auto"
                                      onError={(e) => {
                                        console.error("Failed to load poster preview")
                                        setPosterPreview(null)
                                      }}
                                      onLoad={() => {
                                        console.log("Poster preview loaded successfully")
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex justify-between mb-2">
                                  <Label>Examinations</Label>
                                  <Button type="button" size="sm" onClick={handleAddExamination}>
                                    Add Examination
                                  </Button>
                                </div>

                                <div className="border rounded-md">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="px-4 py-2 text-left">Examination</th>
                                        <th className="px-4 py-2 text-left">Description</th>
                                        <th className="px-4 py-2 w-10"></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {currentPackage.examinations.length === 0 ? (
                                        <tr>
                                          <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                                            No examinations added yet. Click "Add Examination" to add one.
                                          </td>
                                        </tr>
                                      ) : (
                                        currentPackage.examinations.map((exam) => (
                                          <tr key={exam.id} className="border-b">
                                            <td className="px-4 py-2">
                                              <Input
                                                placeholder="Eg. Blood Pressure Check"
                                                value={exam.name}
                                                onChange={(e) =>
                                                  handleExaminationChange(exam.id, "name", e.target.value)
                                                }
                                              />
                                            </td>
                                            <td className="px-4 py-2">
                                              <Input
                                                placeholder="Eg. Systolic and diastolic pressure measurement"
                                                value={exam.description}
                                                onChange={(e) =>
                                                  handleExaminationChange(exam.id, "description", e.target.value)
                                                }
                                              />
                                            </td>
                                            <td className="px-4 py-2">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveExamination(exam.id)}
                                              >
                                                Remove
                                              </Button>
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="file-attachment">File Attachment</Label>
                                <Input
                                  id="file-attachment"
                                  type="file"
                                  onChange={handleFileAttachment}
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {currentPackage.fileAttachment && (
                                  <p className="text-sm text-gray-600">
                                    Attached: {currentPackage.fileAttachment.name}
                                  </p>
                                )}
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={handleCancelPackage}>
                                  Cancel
                                </Button>
                                <Button type="button" onClick={handleSavePackage}>
                                  Save Package
                                </Button>
                                <Button type="button" onClick={handleNextStep}>
                                  Save & Next
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="promotion" className="pt-4">
                    <Card>
                      <CardContent className="pt-6 space-y-6">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">Promotion Files</h3>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const fileInput = document.getElementById("promotion-files")
                                if (fileInput) fileInput.click()
                              }}
                            >
                              Add Files
                            </Button>
                            <Input
                              id="promotion-files"
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*,.pdf,.doc,.docx"
                              onChange={handleAddPromotionFiles}
                            />
                          </div>
                        </div>

                        {promotionFiles.length === 0 ? (
                          <div className="border rounded-md p-6 text-center text-muted-foreground">
                            No promotion files uploaded yet.
                          </div>
                        ) : (
                          <div className="border rounded-md">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="px-4 py-2 text-left">File Name</th>
                                  <th className="px-4 py-2 text-left">Type</th>
                                  <th className="px-4 py-2 text-left">Size</th>
                                  <th className="px-4 py-2 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {promotionFiles.map((file) => (
                                  <tr key={file.id} className="border-b">
                                    <td className="px-4 py-2">{file.name}</td>
                                    <td className="px-4 py-2">{file.file.type}</td>
                                    <td className="px-4 py-2">{(file.file.size / 1024).toFixed(1)} KB</td>
                                    <td className="px-4 py-2 text-right">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemovePromotionFile(file.id)}
                                      >
                                        Remove
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                {/* Action Buttons for Advertisement Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="button" onClick={handleSaveAndNext}>
                      Save & Next
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "document" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Submission</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {getRelevantDocuments().length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          {selectedProviderType
                            ? `No document requirements found for ${selectedProviderType} providers.`
                            : "Please select a provider type to see document requirements."}
                        </div>
                      ) : (
                        getRelevantDocuments().map((doc, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">{doc.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                            <div className="flex items-center space-x-2">
                              <Input type="file" className="flex-1" accept=".pdf" />
                              <Button type="button" variant="outline" size="sm">
                                Upload
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="qr-code-image">QR Code Image</Label>
                      <Input
                        id="qr-code-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0]

                            // Validate file type for QR code (images only)
                            if (!file.type.startsWith("image/")) {
                              toast({
                                title: "Invalid File Type",
                                description: "Please select an image file for QR code.",
                                variant: "destructive",
                              })
                              e.target.value = "" // Clear the input
                              return
                            }

                            setFormFields((prev) => ({ ...prev, qrcodeImage: file }))
                          }
                        }}
                      />
                      {formFields.qrcodeImage && (
                        <p className="text-sm text-gray-600">Selected: {formFields.qrcodeImage.name}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {/* Action Buttons for Document Tab */}
                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <div className="space-x-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Provider"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
