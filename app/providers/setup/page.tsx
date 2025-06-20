"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

import { useRouter } from "next/navigation"

import { getSetupData, saveSetupData, updateSetupSection, type SetupData } from "@/lib/local-storage"

export default function ProviderSetupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("provider-type")

  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // State variables for different setup items
  const [providerTypes, setProviderTypes] = useState<string[]>([])
  const [newProviderType, setNewProviderType] = useState("")

  const [diagnosedIllnesses, setDiagnosedIllnesses] = useState<string[]>([])
  const [newDiagnosedIllness, setNewDiagnosedIllness] = useState("")

  const [providerCategories, setProviderCategories] = useState<string[]>([])
  const [newProviderCategory, setNewProviderCategory] = useState("")

  const [servicesProvided, setServicesProvided] = useState<string[]>([])
  const [newService, setNewService] = useState("")

  const [chargesTypes, setChargesTypes] = useState<string[]>([])
  const [newChargeType, setNewChargeType] = useState("")

  const [panelGroups, setPanelGroups] = useState<string[]>([])
  const [newPanelGroup, setNewPanelGroup] = useState("")

  // Modified: Removed fileUrl from guideline type
  const [guidelines, setGuidelines] = useState<{ title: string; providerType: string; content: string }[]>([])

  const [appointmentLetters, setAppointmentLetters] = useState<
    { title: string; providerType: string; content: string }[]
  >([])

  const [documentSubmissions, setDocumentSubmissions] = useState<{ title: string; providerTypes: string[] }[]>([])

  const [staffingRequirements, setStaffingRequirements] = useState<{ role: string }[]>([])

  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([])
  const [newSpokenLanguage, setNewSpokenLanguage] = useState("")

  // State for Technology Infrastructure
  const [techInfrastructures, setTechInfrastructures] = useState<{ name: string; description: string }[]>([])
  const [newTechName, setNewTechName] = useState("")
  const [newTechDescription, setNewTechDescription] = useState("")

  // State for Laboratories Arrangement
  const [labArrangements, setLabArrangements] = useState<{ name: string; description: string }[]>([])
  const [newLabName, setNewLabName] = useState("")
  const [newLabDescription, setNewLabDescription] = useState("")

  // State for Facilities/Services
  const [facilities, setFacilities] = useState<{ name: string; description: string }[]>([])
  const [newFacilityName, setNewFacilityName] = useState("")
  const [newFacilityDescription, setNewFacilityDescription] = useState("")

  // State for Provider Experience
  const [experiences, setExperiences] = useState<{ years: string; description: string }[]>([])
  const [newExperienceYears, setNewExperienceYears] = useState("")
  const [newExperienceDescription, setNewExperienceDescription] = useState("")

  // State for Resident Specialist
  const [specialists, setSpecialists] = useState<{ name: string }[]>([])
  const [newSpecialistName, setNewSpecialistName] = useState("")

  // State for Specialty Doctor
  const [specialtyDoctors, setSpecialtyDoctors] = useState<string[]>([])
  const [newSpecialtyDoctor, setNewSpecialtyDoctor] = useState("")

  // State for Sub Specialty Doctor
  const [subSpecialtyDoctors, setSubSpecialtyDoctors] = useState<string[]>([])
  const [newSubSpecialtyDoctor, setNewSubSpecialtyDoctor] = useState("")

  // State for Discount Categories
  const [discountCategories, setDiscountCategories] = useState<string[]>([])
  const [newDiscountCategory, setNewDiscountCategory] = useState("")

  const [drugList, setDrugList] = useState<{ name: string; category: string }[]>([
    {
      name: "Paracetamol",
      category: "Pain Relief",
    },
    {
      name: "Amoxicillin",
      category: "Antibiotic",
    },
  ])

  const [discountItems, setDiscountItems] = useState<{ item: string; category: string }[]>([])

  // State for Guidelines
  const [newGuidelineTitle, setNewGuidelineTitle] = useState("")
  const [newGuidelineProviderType, setNewGuidelineProviderType] = useState("")
  const [newGuidelineContent, setNewGuidelineContent] = useState("")

  // State for Appointment Letters
  const [newLetterTitle, setNewLetterTitle] = useState("")
  const [newLetterProviderType, setNewLetterProviderType] = useState("")
  const [newLetterContent, setNewLetterContent] = useState("")

  // State for Document Submission
  const [newDocumentTitle, setNewDocumentTitle] = useState("")
  const [selectedDocumentProviderTypes, setSelectedDocumentProviderTypes] = useState<string[]>([])

  // State for Staffing
  const [newStaffRole, setNewStaffRole] = useState("")

  // State for Discount Items
  const [newDiscountItemName, setNewDiscountItemName] = useState("")
  const [newDiscountItemCategory, setNewDiscountItemCategory] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [setupData, setSetupData] = useState<SetupData>({
    providerTypes: [],
    providerCategories: [],
    servicesProvided: [],
    panelGroups: [],
    chargesTypes: [],
    diagnosedIllnesses: [],
    discountCategories: [],
    discountItems: [],
    techInfrastructures: [],
    labArrangements: [],
    facilities: [],
    experiences: [],
    specialists: [],
    documentSubmissions: [],
    spokenLanguages: [],
    specialtyDoctors: [],
    subSpecialtyDoctors: [],
    staffingRequirements: [],
    guidelines: [],
    appointmentLetters: [],
    pmcareRepresentatives: [],
    drugs: [],
    documentTemplates: [],
  })

  const [newDocumentTemplate, setNewDocumentTemplate] = useState("")
  // Removed: newGuidelineFile state
  // const [newGuidelineFile, setNewGuidelineFile] = useState<File | null>(null)

  // State for PMCare Representative
  const [pmcareRepresentatives, setPmcareRepresentatives] = useState<
    {
      personInCharge: string
      designation: string
      status: string
      phone: string
      email: string
      providerTypes: string[]
      states: string[]
    }[]
  >([])
  const [newPmcarePersonInCharge, setNewPmcarePersonInCharge] = useState("")
  const [newPmcareDesignation, setNewPmcareDesignation] = useState("")
  const [newPmcareStatus, setNewPmcareStatus] = useState("")
  const [newPmcarePhone, setNewPmcarePhone] = useState("")
  const [newPmcareEmail, setNewPmcareEmail] = useState("")
  const [selectedPmcareProviderTypes, setSelectedPmcareProviderTypes] = useState<string[]>([])
  const [selectedPmcareStates, setSelectedPmcareStates] = useState<string[]>([])

  // State for editing PMCare Representative
  const [editingPmcareIndex, setEditingPmcareIndex] = useState<number | null>(null)
  const [editPmcarePersonInCharge, setEditPmcarePersonInCharge] = useState("")
  const [editPmcareDesignation, setEditPmcareDesignation] = useState("")
  const [editPmcareStatus, setEditPmcareStatus] = useState("")
  const [editPmcarePhone, setEditPmcarePhone] = useState("")
  const [editPmcareEmail, setEditPmcareEmail] = useState("")
  const [editSelectedPmcareProviderTypes, setEditSelectedPmcareProviderTypes] = useState<string[]>([])
  const [editSelectedPmcareStates, setEditSelectedPmcareStates] = useState<string[]>([])

  // State for viewing/editing appointment letters
  const [viewingLetterIndex, setViewingLetterIndex] = useState<number | null>(null)
  const [editingLetterIndex, setEditingLetterIndex] = useState<number | null>(null)
  const [editLetterTitle, setEditLetterTitle] = useState("")
  const [editLetterProviderType, setEditLetterProviderType] = useState("")
  const [editLetterContent, setEditLetterContent] = useState("")

  // State for viewing/editing guidelines
  const [viewingGuidelineIndex, setViewingGuidelineIndex] = useState<number | null>(null)
  const [editingGuidelineIndex, setEditingGuidelineIndex] = useState<number | null>(null)
  const [editGuidelineTitle, setEditGuidelineTitle] = useState("")
  const [editGuidelineProviderType, setEditGuidelineProviderType] = useState("")
  const [editGuidelineContent, setEditGuidelineContent] = useState("")

  // Malaysian states for PMCare Representative
  const malaysianStates = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Kuala Lumpur",
    "Labuan",
    "Malacca",
    "Negeri Sembilan",
    "Pahang",
    "Penang",
    "Perak",
    "Perlis",
    "Putrajaya",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
  ]

  // PMCare Representative status options
  const pmcareStatusOptions = ["Active", "Extension", "N/A", "Renewal", "Suspended", "Terminated", "Void"]

  // State for Drug
  const [drugs, setDrugs] = useState<
    {
      drugCode: string
      mcdCode: string
      genericName: string
      holderName: string
      productName: string
      productRegisterNo: string
      status: string
    }[]
  >([])
  const [newDrugCode, setNewDrugCode] = useState("")
  const [newMcdCode, setNewMcdCode] = useState("")
  const [newGenericName, setNewGenericName] = useState("")
  const [newHolderName, setNewHolderName] = useState("")
  const [newProductName, setNewProductName] = useState("")
  const [newProductRegisterNo, setNewProductRegisterNo] = useState("")
  const [newDrugStatus, setNewDrugStatus] = useState("")

  // Drug status options
  const drugStatusOptions = [
    "NOT APPLICABLE",
    "APPEAL",
    "CANCEL",
    "EXPIRED",
    "APPEAL",
    "REJECTED",
    "Q2 STAGE 2",
    "Q3 STAGE 3",
    "REG",
    "REVIEW",
    "REGISTERED",
    "REJECTED",
    "RENEWAL",
    "SUSPENDED",
    "TERMINATED",
    "TRANSIT-REGISTERED",
    "WITHDRAWAL",
  ]

  const fetchSetupData = useCallback(async () => {
    try {
      setIsLoading(true)

      // Load data from local storage
      const data = getSetupData()
      setSetupData(data)

      // Set state variables with loaded data
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
      setSpecialtyDoctors(data.specialtyDoctors || [])
      setSubSpecialtyDoctors(data.subSpecialtyDoctors || [])
      setStaffingRequirements(data.staffingRequirements || [])
      setGuidelines(data.guidelines || [])
      setAppointmentLetters(data.appointmentLetters || [])
      setPmcareRepresentatives(data.pmcareRepresentatives || [])
      setDrugs(data.drugs || [])

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

  useEffect(() => {
    fetchSetupData()
  }, [fetchSetupData])

  useEffect(() => {
    const handleSetupChange = () => {
      fetchSetupData()
    }

    window.addEventListener("setupDataChanged", handleSetupChange)

    return () => {
      window.removeEventListener("setupDataChanged", handleSetupChange)
    }
  }, [fetchSetupData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Prepare setup data
      const setupData = {
        providerTypes,
        providerCategories,
        servicesProvided,
        panelGroups,
        chargesTypes,
        diagnosedIllnesses,
        discountCategories,
        discountItems,
        techInfrastructures,
        labArrangements,
        facilities,
        experiences,
        specialists,
        documentSubmissions,
        spokenLanguages,
        specialtyDoctors,
        subSpecialtyDoctors,
        staffingRequirements,
        guidelines,
        appointmentLetters,
        pmcareRepresentatives,
        drugs,
      }

      // Save data to local storage
      saveSetupData(setupData)

      toast({
        title: "Success!",
        description: "Provider setup settings have been saved successfully.",
      })

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error saving setup data:", error)
      toast({
        title: "Error",
        description: "There was an error saving the settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const saveSection = async (sectionName: string, sectionData: any) => {
    try {
      // Update specific section in local storage
      updateSetupSection(sectionName as keyof SetupData, sectionData)

      toast({
        title: "Options saved successfully",
        description: `${sectionName} settings have been updated.`,
      })
    } catch (error) {
      console.error(`Error saving ${sectionName} data:`, error)
      toast({
        title: "Error",
        description: `There was an error saving the ${sectionName} settings. Please try again.`,
        variant: "destructive",
      })
    }
  }

  // View appointment letter
  const viewAppointmentLetter = (index: number) => {
    const letter = appointmentLetters[index]
    setViewingLetterIndex(index)
    setEditLetterTitle(letter.title)
    setEditLetterProviderType(letter.providerType)
    setEditLetterContent(letter.content)
  }

  // Start editing appointment letter
  const startEditAppointmentLetter = (index: number) => {
    setEditingLetterIndex(index)
    setViewingLetterIndex(null)
  }

  // Save edited appointment letter
  const saveEditAppointmentLetter = () => {
    if (editingLetterIndex !== null && editLetterTitle && editLetterProviderType) {
      const updatedLetters = [...appointmentLetters]
      updatedLetters[editingLetterIndex] = {
        title: editLetterTitle,
        providerType: editLetterProviderType,
        content: editLetterContent,
      }
      setAppointmentLetters(updatedLetters)
      saveSection("appointmentLetters", updatedLetters)
      setEditingLetterIndex(null)
      setViewingLetterIndex(null)

      toast({
        title: "Appointment letter updated",
        description: `${editLetterTitle} has been updated successfully.`,
      })
    }
  }

  // Cancel editing appointment letter
  const cancelEditAppointmentLetter = () => {
    setEditingLetterIndex(null)
    setViewingLetterIndex(null)
  }

  // View guideline
  const viewGuideline = (index: number) => {
    const guideline = guidelines[index]
    setViewingGuidelineIndex(index)
    setEditGuidelineTitle(guideline.title)
    setEditGuidelineProviderType(guideline.providerType)
    setEditGuidelineContent(guideline.content)
  }

  // Start editing guideline
  const startEditGuideline = (index: number) => {
    setEditingGuidelineIndex(index)
    setViewingGuidelineIndex(null)
  }

  // Save edited guideline
  const saveEditGuideline = () => {
    if (editingGuidelineIndex !== null && editGuidelineTitle && editGuidelineProviderType) {
      const updatedGuidelines = [...guidelines]
      updatedGuidelines[editingGuidelineIndex] = {
        title: editGuidelineTitle,
        providerType: editGuidelineProviderType,
        content: editGuidelineContent,
        // Removed: fileUrl from updatedGuidelines
        // fileUrl: updatedGuidelines[editingGuidelineIndex].fileUrl,
      }
      setGuidelines(updatedGuidelines)
      saveSection("guidelines", updatedGuidelines)
      setEditingGuidelineIndex(null)
      setViewingGuidelineIndex(null)

      toast({
        title: "Guideline updated",
        description: `${editGuidelineTitle} has been updated successfully.`,
      })
    }
  }

  // Cancel editing guideline
  const cancelEditGuideline = () => {
    setEditingGuidelineIndex(null)
    setViewingGuidelineIndex(null)
  }

  // Add Technology Infrastructure
  const addTechInfrastructure = () => {
    if (newTechName.trim() && newTechDescription.trim()) {
      const updatedTechInfrastructures = [
        ...techInfrastructures,
        { name: newTechName.trim(), description: newTechDescription.trim() },
      ]
      setTechInfrastructures(updatedTechInfrastructures)
      setNewTechName("")
      setNewTechDescription("")

      // Save the updated technology infrastructures
      saveSection("techInfrastructures", updatedTechInfrastructures)

      toast({
        title: "Technology Infrastructure added",
        description: `${newTechName} has been added to the list.`,
      })
    }
  }

  // Add Laboratory Arrangement
  const addLabArrangement = () => {
    if (newLabName.trim() && newLabDescription.trim()) {
      const updatedLabArrangements = [
        ...labArrangements,
        { name: newLabName.trim(), description: newLabDescription.trim() },
      ]
      setLabArrangements(updatedLabArrangements)
      setNewLabName("")
      setNewLabDescription("")

      // Save the updated laboratory arrangements
      saveSection("labArrangements", updatedLabArrangements)

      toast({
        title: "Laboratory Arrangement added",
        description: `${newLabName} has been added to the list.`,
      })
    }
  }

  // Add Facility/Service
  const addFacility = () => {
    if (newFacilityName.trim() && newFacilityDescription.trim()) {
      const updatedFacilities = [
        ...facilities,
        { name: newFacilityName.trim(), description: newFacilityDescription.trim() },
      ]
      setFacilities(updatedFacilities)
      setNewFacilityName("")
      setNewFacilityDescription("")

      // Save the updated facilities
      saveSection("facilities", updatedFacilities)

      toast({
        title: "Facility/Service added",
        description: `${newFacilityName} has been added to the list.`,
      })
    }
  }

  // Add Provider Experience
  const addExperience = () => {
    if (newExperienceYears.trim() && newExperienceDescription.trim()) {
      const updatedExperiences = [
        ...experiences,
        { years: newExperienceYears.trim(), description: newExperienceDescription.trim() },
      ]
      setExperiences(updatedExperiences)
      setNewExperienceYears("")
      setNewExperienceDescription("")

      // Save the updated experiences
      saveSection("experiences", updatedExperiences)

      toast({
        title: "Provider Experience added",
        description: `${newExperienceYears} experience has been added to the list.`,
      })
    }
  }

  // Add Resident Specialist
  const addSpecialist = () => {
    if (newSpecialistName.trim()) {
      const updatedSpecialists = [
        ...specialists,
        {
          name: newSpecialistName.trim(),
        },
      ]
      setSpecialists(updatedSpecialists)
      setNewSpecialistName("")

      // Save the updated specialists
      saveSection("specialists", updatedSpecialists)

      toast({
        title: "Resident Specialist added",
        description: `${newSpecialistName} has been added to the list.`,
      })
    }
  }

  // Add Specialty Doctor
  const addSpecialtyDoctor = () => {
    if (newSpecialtyDoctor.trim()) {
      const updatedSpecialtyDoctors = [...specialtyDoctors, newSpecialtyDoctor.trim()]
      setSpecialtyDoctors(updatedSpecialtyDoctors)
      setNewSpecialtyDoctor("")

      // Save the updated specialty doctors
      saveSection("specialtyDoctors", updatedSpecialtyDoctors)

      toast({
        title: "Specialty Doctor added",
        description: `${newSpecialtyDoctor} has been added to the list.`,
      })
    }
  }

  // Add Sub Specialty Doctor
  const addSubSpecialtyDoctor = () => {
    if (newSubSpecialtyDoctor.trim()) {
      const updatedSubSpecialtyDoctors = [...subSpecialtyDoctors, newSubSpecialtyDoctor.trim()]
      setSubSpecialtyDoctors(updatedSubSpecialtyDoctors)
      setNewSubSpecialtyDoctor("")

      // Save the updated sub specialty doctors
      saveSection("subSpecialtyDoctors", updatedSubSpecialtyDoctors)

      toast({
        title: "Sub Specialty Doctor added",
        description: `${newSubSpecialtyDoctor} has been added to the list.`,
      })
    }
  }

  // Add Discount Category
  const addDiscountCategory = () => {
    if (newDiscountCategory.trim()) {
      const updatedDiscountCategories = [...discountCategories, newDiscountCategory.trim()]
      setDiscountCategories(updatedDiscountCategories)
      setNewDiscountCategory("")

      // Save the updated discount categories
      saveSection("discountCategories", updatedDiscountCategories)

      toast({
        title: "Discount Category added",
        description: `${newDiscountCategory} has been added to the list.`,
      })
    }
  }

  // Add Provider Type
  const addProviderType = () => {
    if (newProviderType.trim()) {
      const updatedTypes = [...providerTypes, newProviderType.trim()]
      setProviderTypes(updatedTypes)
      setNewProviderType("")

      // Save the updated provider types
      saveSection("providerTypes", updatedTypes)

      toast({
        title: "Provider type added",
        description: `${newProviderType} has been added to the list.`,
      })
    }
  }

  // Add Diagnosed Illness
  const addDiagnosedIllness = () => {
    if (newDiagnosedIllness.trim()) {
      const updatedIllnesses = [...diagnosedIllnesses, newDiagnosedIllness.trim()]
      setDiagnosedIllnesses(updatedIllnesses)
      setNewDiagnosedIllness("")

      // Save the updated diagnosed illnesses
      saveSection("diagnosedIllnesses", updatedIllnesses)

      toast({
        title: "Diagnosed illness added",
        description: `${newDiagnosedIllness} has been added to the list.`,
      })
    }
  }

  // Add Provider Category
  const addProviderCategory = () => {
    if (newProviderCategory.trim()) {
      const updatedCategories = [...providerCategories, newProviderCategory.trim()]
      setProviderCategories(updatedCategories)
      setNewProviderCategory("")

      // Save the updated provider categories
      saveSection("providerCategories", updatedCategories)

      toast({
        title: "Provider category added",
        description: `${newProviderCategory} has been added to the list.`,
      })
    }
  }

  // Add Service
  const addService = () => {
    if (newService.trim()) {
      const updatedServices = [...servicesProvided, newService.trim()]
      setServicesProvided(updatedServices)
      setNewService("")

      // Save the updated services
      saveSection("servicesProvided", updatedServices)

      toast({
        title: "Service added",
        description: `${newService} has been added to the list.`,
      })
    }
  }

  // Add Charge Type
  const addChargeType = () => {
    if (newChargeType.trim()) {
      const updatedChargesTypes = [...chargesTypes, newChargeType.trim()]
      setChargesTypes(updatedChargesTypes)
      setNewChargeType("")

      // Save the updated charge types
      saveSection("chargesTypes", updatedChargesTypes)

      toast({
        title: "Charge type added",
        description: `${newChargeType} has been added to the list.`,
      })
    }
  }

  // Add Panel Group
  const addPanelGroup = () => {
    if (newPanelGroup.trim()) {
      const updatedPanelGroups = [...panelGroups, newPanelGroup.trim()]
      setPanelGroups(updatedPanelGroups)
      setNewPanelGroup("")

      // Save the updated panel groups
      saveSection("panelGroups", updatedPanelGroups)

      toast({
        title: "Panel group added",
        description: `${newPanelGroup} has been added to the list.`,
      })
    }
  }

  // Add Guideline
  const addGuideline = () => {
    if (newGuidelineTitle && newGuidelineProviderType) {
      const providerTypeValue =
        typeof newGuidelineProviderType === "object" ? newGuidelineProviderType.status : newGuidelineProviderType
      const updatedGuidelines = [
        ...guidelines,
        {
          title: newGuidelineTitle,
          providerType: providerTypeValue,
          content: newGuidelineContent,
          // Removed: fileUrl from new guideline object
          // fileUrl: newGuidelineFile ? URL.createObjectURL(newGuidelineFile) : undefined,
        },
      ]
      setGuidelines(updatedGuidelines)
      setNewGuidelineTitle("")
      setNewGuidelineContent("")
      setNewGuidelineProviderType("")
      // Removed: setNewGuidelineFile(null)
      // setNewGuidelineFile(null)

      // Save the updated guidelines
      saveSection("guidelines", updatedGuidelines)

      toast({
        title: "Guideline added",
        description: `${newGuidelineTitle} has been added to the list.`,
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the guideline.",
        variant: "destructive",
      })
    }
  }

  // Add Appointment Letter
  const addAppointmentLetter = () => {
    if (newLetterTitle && newLetterProviderType) {
      const providerTypeValue =
        typeof newLetterProviderType === "object" ? newLetterProviderType.status : newLetterProviderType
      const updatedAppointmentLetters = [
        ...appointmentLetters,
        {
          title: newLetterTitle,
          providerType: providerTypeValue,
          content: newLetterContent || "",
        },
      ]
      setAppointmentLetters(updatedAppointmentLetters)
      setNewLetterTitle("")
      setNewLetterProviderType("")
      setNewLetterContent("")

      // Save the updated appointment letters
      saveSection("appointmentLetters", updatedAppointmentLetters)

      toast({
        title: "Appointment letter added",
        description: `${newLetterTitle} has been added to the list.`,
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the appointment letter.",
        variant: "destructive",
      })
    }
  }

  // Add Document Requirement
  const addDocumentRequirement = () => {
    if (newDocumentTitle && selectedDocumentProviderTypes && selectedDocumentProviderTypes.length > 0) {
      const updatedDocumentSubmissions = [
        ...documentSubmissions,
        {
          title: newDocumentTitle,
          providerTypes: selectedDocumentProviderTypes,
        },
      ]
      setDocumentSubmissions(updatedDocumentSubmissions)
      setNewDocumentTitle("")
      setSelectedDocumentProviderTypes([])

      // Save the updated document submissions
      saveSection("documentSubmissions", updatedDocumentSubmissions)

      toast({
        title: "Document requirement added",
        description: `${newDocumentTitle} has been added to the list.`,
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the document requirement.",
        variant: "destructive",
      })
    }
  }

  // Add Staff Role
  const addStaffRole = () => {
    if (newStaffRole) {
      const updatedStaffingRequirements = [
        ...staffingRequirements,
        {
          role: newStaffRole,
        },
      ]
      setStaffingRequirements(updatedStaffingRequirements)
      setNewStaffRole("")

      // Save the updated staffing requirements
      saveSection("staffingRequirements", updatedStaffingRequirements)

      toast({
        title: "Staff role added",
        description: `${newStaffRole} has been added to the list.`,
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please enter a staff role.",
        variant: "destructive",
      })
    }
  }

  // Add Spoken Language
  const addSpokenLanguage = () => {
    if (newSpokenLanguage.trim()) {
      const updatedSpokenLanguages = [...spokenLanguages, newSpokenLanguage.trim()]
      setSpokenLanguages(updatedSpokenLanguages)
      setNewSpokenLanguage("")

      // Save the updated spoken languages
      saveSection("spokenLanguages", updatedSpokenLanguages)

      toast({
        title: "Language added",
        description: `${newSpokenLanguage} has been added to the list.`,
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please enter a language.",
        variant: "destructive",
      })
    }
  }

  // Add Discount Item
  const addDiscountItem = () => {
    if (newDiscountItemName && newDiscountItemCategory) {
      const newItem = {
        item: newDiscountItemName,
        category: newDiscountItemCategory,
      }

      const updatedDiscountItems = [...discountItems, newItem]
      setDiscountItems(updatedDiscountItems)
      setNewDiscountItemName("")
      setNewDiscountItemCategory("")

      saveSection("discountItems", updatedDiscountItems)

      toast({
        title: "Discount item added",
        description: `${newDiscountItemName} has been added to the list.`,
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the discount item.",
        variant: "destructive",
      })
    }
  }

  const addPmcareRepresentative = () => {
    if (
      newPmcarePersonInCharge &&
      newPmcareDesignation &&
      newPmcareStatus &&
      newPmcarePhone &&
      newPmcareEmail &&
      selectedPmcareProviderTypes.length > 0 &&
      selectedPmcareStates.length > 0
    ) {
      const newRep = {
        personInCharge: newPmcarePersonInCharge,
        designation: newPmcareDesignation,
        status: newPmcareStatus,
        phone: newPmcarePhone,
        email: newPmcareEmail,
        providerTypes: selectedPmcareProviderTypes,
        states: selectedPmcareStates,
      }

      const updatedReps = [...pmcareRepresentatives, newRep]
      setPmcareRepresentatives(updatedReps)
      setNewPmcarePersonInCharge("")
      setNewPmcareDesignation("")
      setNewPmcareStatus("")
      setNewPmcarePhone("")
      setNewPmcareEmail("")
      setSelectedPmcareProviderTypes([])
      setSelectedPmcareStates([])

      saveSection("pmcareRepresentatives", updatedReps)

      toast({
        title: "PMCare Representative added",
        description: `${newPmcarePersonInCharge} has been added to the list.`,
      })
    } else {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the PMCare representative.",
        variant: "destructive",
      })
    }
  }

  const startEditPmcareRepresentative = (index: number) => {
    const rep = pmcareRepresentatives[index]
    setEditingPmcareIndex(index)
    setEditPmcarePersonInCharge(rep.personInCharge)
    setEditPmcareDesignation(rep.designation)
    setEditPmcareStatus(rep.status)
    setEditPmcarePhone(rep.phone)
    setEditPmcareEmail(rep.email)
    setEditSelectedPmcareProviderTypes(rep.providerTypes)
    setEditSelectedPmcareStates(rep.states)
  }

  const saveEditPmcareRepresentative = () => {
    if (editingPmcareIndex !== null) {
      const updatedReps = [...pmcareRepresentatives]
      updatedReps[editingPmcareIndex] = {
        personInCharge: editPmcarePersonInCharge,
        designation: editPmcareDesignation,
        status: editPmcareStatus,
        phone: editPmcarePhone,
        email: editPmcareEmail,
        providerTypes: editSelectedPmcareProviderTypes,
        states: editSelectedPmcareStates,
      }

      setPmcareRepresentatives(updatedReps)
      saveSection("pmcareRepresentatives", updatedReps)
      setEditingPmcareIndex(null)

      toast({
        title: "PMCare Representative updated",
        description: `${editPmcarePersonInCharge} has been updated successfully.`,
      })
    }
  }

  const cancelEditPmcareRepresentative = () => {
    setEditingPmcareIndex(null)
  }

  const addDrug = () => {
    if (
      newDrugCode &&
      newMcdCode &&
      newGenericName &&
      newHolderName &&
      newProductName &&
      newProductRegisterNo &&
      newDrugStatus
    ) {
      const newDrug = {
        drugCode: newDrugCode,
        mcdCode: newMcdCode,
        genericName: newGenericName,
        holderName: newHolderName,
        productName: newProductName,
        productRegisterNo: newProductRegisterNo,
        status: newDrugStatus,
      }

      const updatedDrugs = [...drugs, newDrug]
      setDrugs(updatedDrugs)
      setNewDrugCode("")
      setNewMcdCode("")
      setNewGenericName("")
      setNewHolderName("")
      setNewProductName("")
      setNewProductRegisterNo("")
      setNewDrugStatus("")

      saveSection("drugs", updatedDrugs)

      toast({
        title: "Drug added",
        description: `${newProductName} has been added to the list.`,
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <PageHeader heading="Provider Setup" text="Configure provider setup options" />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Select the section to configure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "provider-type" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("provider-type")}
                >
                  Provider Types
                </Button>
                <Button
                  variant={activeTab === "diagnosed-illness" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("diagnosed-illness")}
                >
                  Diagnosed Illnesses
                </Button>
                <Button
                  variant={activeTab === "provider-categories" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("provider-categories")}
                >
                  Provider Categories
                </Button>
                <Button
                  variant={activeTab === "services" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("services")}
                >
                  Services Provided
                </Button>
                <Button
                  variant={activeTab === "charges-types" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("charges-types")}
                >
                  Charges Types
                </Button>
                <Button
                  variant={activeTab === "panel-groups" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("panel-groups")}
                >
                  Panel Groups
                </Button>
                <Button
                  variant={activeTab === "guidelines" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("guidelines")}
                >
                  Guidelines
                </Button>
                <Button
                  variant={activeTab === "appointment-letters" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("appointment-letters")}
                >
                  Appointment Letters
                </Button>
                <Button
                  variant={activeTab === "document-submissions" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("document-submissions")}
                >
                  Document Submissions
                </Button>
                <Button
                  variant={activeTab === "staffing" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("staffing")}
                >
                  Staffing
                </Button>
                <Button
                  variant={activeTab === "spoken-languages" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("spoken-languages")}
                >
                  Spoken Languages
                </Button>
                <Button
                  variant={activeTab === "discount-items" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("discount-items")}
                >
                  Discount Items
                </Button>
                <Button
                  variant={activeTab === "discount-categories" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("discount-categories")}
                >
                  Discount Categories
                </Button>
                <Button
                  variant={activeTab === "technology" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("technology")}
                >
                  Technology Infrastructure
                </Button>
                <Button
                  variant={activeTab === "laboratories" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("laboratories")}
                >
                  Laboratories Arrangement
                </Button>
                <Button
                  variant={activeTab === "facilities" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("facilities")}
                >
                  Facilities/Services
                </Button>
                <Button
                  variant={activeTab === "experience" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("experience")}
                >
                  Provider Experience
                </Button>
                <Button
                  variant={activeTab === "resident-specialist" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("resident-specialist")}
                >
                  Resident Specialist
                </Button>
                <Button
                  variant={activeTab === "specialty-doctor" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("specialty-doctor")}
                >
                  Specialty Doctor
                </Button>
                <Button
                  variant={activeTab === "sub-specialty-doctor" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("sub-specialty-doctor")}
                >
                  Sub Specialty Doctor
                </Button>
                <Button
                  variant={activeTab === "pmcare-representative" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("pmcare-representative")}
                >
                  PMCare Representative
                </Button>
                <Button
                  variant={activeTab === "drug" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("drug")}
                >
                  Drug
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 space-y-6">
            {activeTab === "provider-type" && (
              <Card>
                <CardHeader>
                  <CardTitle>Provider Types</CardTitle>
                  <CardDescription>
                    Configure provider types that will be available in dropdown selections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter provider type"
                      className="flex-1"
                      value={newProviderType}
                      onChange={(e) => setNewProviderType(e.target.value)}
                    />
                    <Button type="button" onClick={addProviderType}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Provider Type</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providerTypes.map((type, index) => (
                          <tr key={index} className={index < providerTypes.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{type}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedTypes = [...providerTypes]
                                  updatedTypes.splice(index, 1)
                                  setProviderTypes(updatedTypes)

                                  // Save the updated provider types
                                  saveSection("providerTypes", updatedTypes)

                                  toast({
                                    title: "Provider type removed",
                                    description: `${type} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "diagnosed-illness" && (
              <Card>
                <CardHeader>
                  <CardTitle>Diagnosed Illnesses</CardTitle>
                  <CardDescription>
                    Configure diagnosed illnesses that will be available in dropdown selections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter diagnosed illness"
                      className="flex-1"
                      value={newDiagnosedIllness}
                      onChange={(e) => setNewDiagnosedIllness(e.target.value)}
                    />
                    <Button type="button" onClick={addDiagnosedIllness}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Diagnosed Illness</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosedIllnesses.map((illness, index) => (
                          <tr key={index} className={index < diagnosedIllnesses.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{illness}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedIllnesses = [...diagnosedIllnesses]
                                  updatedIllnesses.splice(index, 1)
                                  setDiagnosedIllnesses(updatedIllnesses)

                                  // Save the updated diagnosed illnesses
                                  saveSection("diagnosedIllnesses", updatedIllnesses)

                                  toast({
                                    title: "Diagnosed illness removed",
                                    description: `${illness} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "provider-categories" && (
              <Card>
                <CardHeader>
                  <CardTitle>Provider Categories</CardTitle>
                  <CardDescription>
                    Configure provider categories that will be available in dropdown selections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter provider category"
                      className="flex-1"
                      value={newProviderCategory}
                      onChange={(e) => setNewProviderCategory(e.target.value)}
                    />
                    <Button type="button" onClick={addProviderCategory}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Provider Category</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {providerCategories.map((category, index) => (
                          <tr key={index} className={index < providerCategories.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{category}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedCategories = [...providerCategories]
                                  updatedCategories.splice(index, 1)
                                  setProviderCategories(updatedCategories)

                                  // Save the updated provider categories
                                  saveSection("providerCategories", updatedCategories)

                                  toast({
                                    title: "Provider category removed",
                                    description: `${category} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "services" && (
              <Card>
                <CardHeader>
                  <CardTitle>Services Provided</CardTitle>
                  <CardDescription>
                    Configure services provided that will be available in dropdown selections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter service"
                      className="flex-1"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                    />
                    <Button type="button" onClick={addService}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Service</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servicesProvided.map((service, index) => (
                          <tr key={index} className={index < servicesProvided.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{service}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedServices = [...servicesProvided]
                                  updatedServices.splice(index, 1)
                                  setServicesProvided(updatedServices)

                                  // Save the updated services
                                  saveSection("servicesProvided", updatedServices)

                                  toast({
                                    title: "Service removed",
                                    description: `${service} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "charges-types" && (
              <Card>
                <CardHeader>
                  <CardTitle>Charges Types</CardTitle>
                  <CardDescription>
                    Configure charges types that will be available in dropdown selections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter charge type"
                      className="flex-1"
                      value={newChargeType}
                      onChange={(e) => setNewChargeType(e.target.value)}
                    />
                    <Button type="button" onClick={addChargeType}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Charge Type</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chargesTypes.map((charge, index) => (
                          <tr key={index} className={index < chargesTypes.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{charge}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedChargesTypes = [...chargesTypes]
                                  updatedChargesTypes.splice(index, 1)
                                  setChargesTypes(updatedChargesTypes)

                                  // Save the updated charge types
                                  saveSection("chargesTypes", updatedChargesTypes)

                                  toast({
                                    title: "Charge type removed",
                                    description: `${charge} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "panel-groups" && (
              <Card>
                <CardHeader>
                  <CardTitle>Panel Groups</CardTitle>
                  <CardDescription>
                    Configure panel groups that will be available in dropdown selections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter panel group"
                      className="flex-1"
                      value={newPanelGroup}
                      onChange={(e) => setNewPanelGroup(e.target.value)}
                    />
                    <Button type="button" onClick={addPanelGroup}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Panel Group</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {panelGroups.map((group, index) => (
                          <tr key={index} className={index < panelGroups.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{group}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedPanelGroups = [...panelGroups]
                                  updatedPanelGroups.splice(index, 1)
                                  setPanelGroups(updatedPanelGroups)

                                  // Save the updated panel groups
                                  saveSection("panelGroups", updatedPanelGroups)

                                  toast({
                                    title: "Panel group removed",
                                    description: `${group} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "guidelines" && (
              <Card>
                <CardHeader>
                  <CardTitle>Guidelines</CardTitle>
                  <CardDescription>Configure guidelines for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guideline-title">Title</Label>
                      <Input
                        id="guideline-title"
                        placeholder="Enter guideline title"
                        value={newGuidelineTitle}
                        onChange={(e) => setNewGuidelineTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guideline-provider-type">Provider Type</Label>
                      <Select onValueChange={(value) => setNewGuidelineProviderType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Provider Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {providerTypes.map((type, idx) => (
                            <SelectItem key={idx} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guideline-content">Content</Label>
                    <Textarea
                      id="guideline-content"
                      placeholder="Enter guideline content"
                      value={newGuidelineContent}
                      onChange={(e) => setNewGuidelineContent(e.target.value)}
                    />
                  </div>

                  {/* Removed: File upload input for guidelines */}
                  {/*
                  <div className="space-y-2">
                    <Label htmlFor="guideline-file">Upload File</Label>
                    <Input
                      type="file"
                      id="guideline-file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setNewGuidelineFile(e.target.files[0])
                        }
                      }}
                    />
                  </div>
                  */}

                  <Button type="button" onClick={addGuideline}>
                    Add Guideline
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Title</th>
                          <th className="px-4 py-2 text-left">Provider Type</th>
                          <th className="px-4 py-2 text-left">Content</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guidelines.map((guideline, index) => (
                          <tr key={index} className={index < guidelines.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{guideline.title}</td>
                            <td className="px-4 py-2">{guideline.providerType}</td>
                            <td className="px-4 py-2">{guideline.content.substring(0, 50)}...</td>
                            <td className="px-4 py-2 text-right">
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm" onClick={() => viewGuideline(index)}>
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedGuidelines = [...guidelines]
                                    updatedGuidelines.splice(index, 1)
                                    setGuidelines(updatedGuidelines)

                                    // Save the updated guidelines
                                    saveSection("guidelines", updatedGuidelines)

                                    toast({
                                      title: "Guideline removed",
                                      description: `${guideline.title} has been removed from the list.`,
                                    })
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {viewingGuidelineIndex !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>View Guideline</CardTitle>
                  <CardDescription>View and edit the selected guideline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="view-guideline-title">Title</Label>
                    <Input id="view-guideline-title" value={editGuidelineTitle} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="view-guideline-provider-type">Provider Type</Label>
                    <Input id="view-guideline-provider-type" value={editGuidelineProviderType} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="view-guideline-content">Content</Label>
                    <Textarea id="view-guideline-content" value={editGuidelineContent} readOnly rows={6} />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button" onClick={() => startEditGuideline(viewingGuidelineIndex)}>
                      Edit
                    </Button>
                    <Button type="button" variant="secondary" onClick={cancelEditGuideline}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {editingGuidelineIndex !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Guideline</CardTitle>
                  <CardDescription>Edit the selected guideline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-guideline-title">Title</Label>
                    <Input
                      id="edit-guideline-title"
                      placeholder="Enter guideline title"
                      value={editGuidelineTitle}
                      onChange={(e) => setEditGuidelineTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-guideline-provider-type">Provider Type</Label>
                    <Select
                      onValueChange={(value) => setEditGuidelineProviderType(value)}
                      defaultValue={editGuidelineProviderType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Provider Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {providerTypes.map((type, idx) => (
                          <SelectItem key={idx} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-guideline-content">Content</Label>
                    <Textarea
                      id="edit-guideline-content"
                      placeholder="Enter guideline content"
                      value={editGuidelineContent}
                      onChange={(e) => setEditGuidelineContent(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button" onClick={saveEditGuideline}>
                      Save
                    </Button>
                    <Button type="button" variant="secondary" onClick={cancelEditGuideline}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "appointment-letters" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Letters</CardTitle>
                  <CardDescription>Configure appointment letters for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="letter-title">Title</Label>
                      <Input
                        id="letter-title"
                        placeholder="Enter letter title"
                        value={newLetterTitle}
                        onChange={(e) => setNewLetterTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="letter-provider-type">Provider Type</Label>
                      <Select onValueChange={(value) => setNewLetterProviderType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Provider Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {providerTypes.map((type, idx) => (
                            <SelectItem key={idx} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="letter-content">Content</Label>
                    <div className="border rounded-md p-2 min-h-[200px]">
                      <div
                        id="letter-content"
                        className="prose w-full focus:outline-none"
                        contentEditable
                        onInput={(e) => setNewLetterContent(e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: newLetterContent }}
                      />
                      <div className="flex gap-2 border-t pt-2 mt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => document.execCommand("bold")}>
                          <strong>B</strong>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.execCommand("italic")}
                        >
                          <em>I</em>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.execCommand("underline")}
                        >
                          <span className="underline">U</span>
                        </Button>
                        <select
                          className="h-8 rounded-md border border-input px-3 py-1 text-sm"
                          onChange={(e) => {
                            document.execCommand("fontSize", false, e.target.value)
                          }}
                        >
                          <option value="">Font Size</option>
                          <option value="1">Small</option>
                          <option value="3">Normal</option>
                          <option value="5">Large</option>
                          <option value="7">X-Large</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={addAppointmentLetter}>
                    Add Appointment Letter
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Title</th>
                          <th className="px-4 py-2 text-left">Provider Type</th>
                          <th className="px-4 py-2 text-left">Content</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointmentLetters.map((letter, index) => (
                          <tr key={index} className={index < appointmentLetters.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{letter.title}</td>
                            <td className="px-4 py-2">{letter.providerType}</td>
                            <td className="px-4 py-2">{letter.content}</td>
                            <td className="px-4 py-2 text-right">
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm" onClick={() => viewAppointmentLetter(index)}>
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedAppointmentLetters = [...appointmentLetters]
                                    updatedAppointmentLetters.splice(index, 1)
                                    setAppointmentLetters(updatedAppointmentLetters)

                                    // Save the updated appointment letters
                                    saveSection("appointmentLetters", updatedAppointmentLetters)

                                    toast({
                                      title: "Appointment letter removed",
                                      description: `${letter.title} has been removed from the list.`,
                                    })
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {viewingLetterIndex !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>View Appointment Letter</CardTitle>
                  <CardDescription>View and edit the selected appointment letter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="view-letter-title">Title</Label>
                    <Input id="view-letter-title" value={editLetterTitle} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="view-letter-provider-type">Provider Type</Label>
                    <Input id="view-letter-provider-type" value={editLetterProviderType} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="view-letter-content">Content</Label>
                    <Textarea id="view-letter-content" value={editLetterContent} readOnly />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button" onClick={() => startEditAppointmentLetter(viewingLetterIndex)}>
                      Edit
                    </Button>
                    <Button type="button" variant="secondary" onClick={cancelEditAppointmentLetter}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {editingLetterIndex !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Appointment Letter</CardTitle>
                  <CardDescription>Edit the selected appointment letter</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-letter-title">Title</Label>
                    <Input
                      id="edit-letter-title"
                      placeholder="Enter letter title"
                      value={editLetterTitle}
                      onChange={(e) => setEditLetterTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-letter-provider-type">Provider Type</Label>
                    <Select
                      onValueChange={(value) => setEditLetterProviderType(value)}
                      defaultValue={editLetterProviderType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Provider Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {providerTypes.map((type, idx) => (
                          <SelectItem key={idx} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-letter-content">Content</Label>
                    <div className="border rounded-md p-2 min-h-[200px]">
                      <div
                        id="edit-letter-content"
                        className="prose w-full focus:outline-none"
                        contentEditable
                        onInput={(e) => setEditLetterContent(e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: editLetterContent }}
                      />
                      <div className="flex gap-2 border-t pt-2 mt-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => document.execCommand("bold")}>
                          <strong>B</strong>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.execCommand("italic")}
                        >
                          <em>I</em>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.execCommand("underline")}
                        >
                          <span className="underline">U</span>
                        </Button>
                        <select
                          className="h-8 rounded-md border border-input px-3 py-1 text-sm"
                          onChange={(e) => {
                            document.execCommand("fontSize", false, e.target.value)
                          }}
                        >
                          <option value="">Font Size</option>
                          <option value="1">Small</option>
                          <option value="3">Normal</option>
                          <option value="5">Large</option>
                          <option value="7">X-Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button" onClick={saveEditAppointmentLetter}>
                      Save
                    </Button>
                    <Button type="button" variant="secondary" onClick={cancelEditAppointmentLetter}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "document-submissions" && (
              <Card>
                <CardHeader>
                  <CardTitle>Document Submissions</CardTitle>
                  <CardDescription>Configure document submissions for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-title">Title</Label>
                    <Input
                      id="document-title"
                      placeholder="Enter document title"
                      value={newDocumentTitle}
                      onChange={(e) => setNewDocumentTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document-provider-types">Provider Types (Select Multiple)</Label>
                    <div className="relative">
                      <button
                        type="button"
                        id="document-provider-types"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => {
                          const dropdown = document.getElementById("document-provider-types-dropdown")
                          if (dropdown) {
                            dropdown.classList.toggle("hidden")
                          }
                        }}
                      >
                        <span>
                          {selectedDocumentProviderTypes.length > 0
                            ? selectedDocumentProviderTypes.join(", ")
                            : "Select Provider Types"}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 opacity-50"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <div
                        id="document-provider-types-dropdown"
                        className="absolute z-10 mt-1 hidden w-full rounded-md border border-gray-200 bg-white shadow-lg"
                      >
                        <div className="p-2 max-h-60 overflow-y-auto">
                          {providerTypes.map((type, idx) => (
                            <div key={idx} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                              <input
                                type="checkbox"
                                id={`document-provider-type-${idx}`}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={selectedDocumentProviderTypes.includes(type)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDocumentProviderTypes([...selectedDocumentProviderTypes, type])
                                  } else {
                                    setSelectedDocumentProviderTypes(
                                      selectedDocumentProviderTypes.filter((t) => t !== type),
                                    )
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`document-provider-type-${idx}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="border-t p-2 flex justify-between">
                          <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => setSelectedDocumentProviderTypes([...providerTypes])}
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => setSelectedDocumentProviderTypes([])}
                          >
                            Deselect All
                          </button>
                          <button
                            type="button"
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => {
                              const dropdown = document.getElementById("document-provider-types-dropdown")
                              if (dropdown) {
                                dropdown.classList.add("hidden")
                              }
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={addDocumentRequirement}>
                    Add Document Requirement
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Title</th>
                          <th className="px-4 py-2 text-left">Provider Types</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentSubmissions.map((doc, index) => (
                          <tr key={index} className={index < documentSubmissions.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{doc.title}</td>
                            <td className="px-4 py-2">
                              {doc.providerTypes.map((type, i) => (
                                <span
                                  key={i}
                                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                                >
                                  {type}
                                </span>
                              ))}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedDocumentSubmissions = [...documentSubmissions]
                                  updatedDocumentSubmissions.splice(index, 1)
                                  setDocumentSubmissions(updatedDocumentSubmissions)

                                  // Save the updated document submissions
                                  saveSection("documentSubmissions", updatedDocumentSubmissions)

                                  toast({
                                    title: "Document requirement removed",
                                    description: `${doc.title} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "staffing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Staffing</CardTitle>
                  <CardDescription>Configure staffing requirements for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="staff-role">Role</Label>
                      <Input
                        id="staff-role"
                        placeholder="Enter staff role"
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addStaffRole}>
                    Add Staff Role
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Role</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffingRequirements.map((staff, index) => (
                          <tr key={index} className={index < staffingRequirements.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{staff.role}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedStaffingRequirements = [...staffingRequirements]
                                  updatedStaffingRequirements.splice(index, 1)
                                  setStaffingRequirements(updatedStaffingRequirements)

                                  // Save the updated staffing requirements
                                  saveSection("staffingRequirements", updatedStaffingRequirements)

                                  toast({
                                    title: "Staff role removed",
                                    description: `${staff.role} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "spoken-languages" && (
              <Card>
                <CardHeader>
                  <CardTitle>Spoken Languages</CardTitle>
                  <CardDescription>Configure spoken languages for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter spoken language"
                      className="flex-1"
                      value={newSpokenLanguage}
                      onChange={(e) => setNewSpokenLanguage(e.target.value)}
                    />
                    <Button type="button" onClick={addSpokenLanguage}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Spoken Language</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {spokenLanguages.map((language, index) => (
                          <tr key={index} className={index < spokenLanguages.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{language}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedSpokenLanguages = [...spokenLanguages]
                                  updatedSpokenLanguages.splice(index, 1)
                                  setSpokenLanguages(updatedSpokenLanguages)

                                  // Save the updated spoken languages
                                  saveSection("spokenLanguages", updatedSpokenLanguages)

                                  toast({
                                    title: "Language removed",
                                    description: `${language} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "discount-items" && (
              <Card>
                <CardHeader>
                  <CardTitle>Discount Items</CardTitle>
                  <CardDescription>Configure discount items that will be available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount-item-name">Item Name</Label>
                      <Input
                        id="discount-item-name"
                        placeholder="Enter item name"
                        value={newDiscountItemName}
                        onChange={(e) => setNewDiscountItemName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount-item-category">Category</Label>
                      <Select onValueChange={(value) => setNewDiscountItemCategory(value)}>
                        <SelectTrigger id="discount-item-category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {discountCategories.map((category, idx) => (
                            <SelectItem key={idx} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="button" onClick={addDiscountItem}>
                    Add Discount Item
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Item Name</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {discountItems.map((item, index) => (
                          <tr key={index} className={index < discountItems.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{item.item}</td>
                            <td className="px-4 py-2">{item.category}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedDiscountItems = [...discountItems]
                                  updatedDiscountItems.splice(index, 1)
                                  setDiscountItems(updatedDiscountItems)

                                  saveSection("discountItems", updatedDiscountItems)

                                  toast({
                                    title: "Discount item removed",
                                    description: `${item.item} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "discount-categories" && (
              <Card>
                <CardHeader>
                  <CardTitle>Discount Categories</CardTitle>
                  <CardDescription>
                    Configure discount categories that will be available in dropdown selections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter discount category"
                      className="flex-1"
                      value={newDiscountCategory}
                      onChange={(e) => setNewDiscountCategory(e.target.value)}
                    />
                    <Button type="button" onClick={addDiscountCategory}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Discount Category</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {discountCategories.map((category, index) => (
                          <tr key={index} className={index < discountCategories.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{category}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedCategories = [...discountCategories]
                                  updatedCategories.splice(index, 1)
                                  setDiscountCategories(updatedCategories)

                                  // Save the updated discount categories
                                  saveSection("discountCategories", updatedCategories)

                                  toast({
                                    title: "Discount category removed",
                                    description: `${category} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "technology" && (
              <Card>
                <CardHeader>
                  <CardTitle>Technology Infrastructure</CardTitle>
                  <CardDescription>Configure technology infrastructure options for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tech-name">Infrastructure Name</Label>
                      <Input
                        id="tech-name"
                        placeholder="E.g., Personal Computer"
                        value={newTechName}
                        onChange={(e) => setNewTechName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tech-description">Description</Label>
                      <Input
                        id="tech-description"
                        placeholder="Enter description"
                        value={newTechDescription}
                        onChange={(e) => setNewTechDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addTechInfrastructure}>
                    Add Technology Infrastructure
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {techInfrastructures.map((tech, index) => (
                          <tr key={index} className={index < techInfrastructures.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{tech.name}</td>
                            <td className="px-4 py-2">{tech.description}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedTech = [...techInfrastructures]
                                  updatedTech.splice(index, 1)
                                  setTechInfrastructures(updatedTech)
                                  saveSection("techInfrastructures", updatedTech)
                                  toast({
                                    title: "Technology infrastructure removed",
                                    description: `${tech.name} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "laboratories" && (
              <Card>
                <CardHeader>
                  <CardTitle>Laboratories Arrangement</CardTitle>
                  <CardDescription>Configure laboratory arrangement options for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lab-name">Laboratory Name</Label>
                      <Input
                        id="lab-name"
                        placeholder="E.g., BP Labs Healthcare"
                        value={newLabName}
                        onChange={(e) => setNewLabName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lab-description">Description</Label>
                      <Input
                        id="lab-description"
                        placeholder="Enter description"
                        value={newLabDescription}
                        onChange={(e) => setNewLabDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addLabArrangement}>
                    Add Laboratory Arrangement
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labArrangements.map((lab, index) => (
                          <tr key={index} className={index < labArrangements.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{lab.name}</td>
                            <td className="px-4 py-2">{lab.description}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedLabs = [...labArrangements]
                                  updatedLabs.splice(index, 1)
                                  setLabArrangements(updatedLabs)
                                  saveSection("labArrangements", updatedLabs)
                                  toast({
                                    title: "Laboratory arrangement removed",
                                    description: `${lab.name} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "facilities" && (
              <Card>
                <CardHeader>
                  <CardTitle>Facilities/Services</CardTitle>
                  <CardDescription>Configure facilities and services available for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facility-name">Facility/Service Name</Label>
                      <Input
                        id="facility-name"
                        placeholder="E.g., CBC machine"
                        value={newFacilityName}
                        onChange={(e) => setNewFacilityName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facility-description">Description</Label>
                      <Input
                        id="facility-description"
                        placeholder="Enter description"
                        value={newFacilityDescription}
                        onChange={(e) => setNewFacilityDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addFacility}>
                    Add Facility/Service
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facilities.map((facility, index) => (
                          <tr key={index} className={index < facilities.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{facility.name}</td>
                            <td className="px-4 py-2">{facility.description}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedFacilities = [...facilities]
                                  updatedFacilities.splice(index, 1)
                                  setFacilities(updatedFacilities)
                                  saveSection("facilities", updatedFacilities)
                                  toast({
                                    title: "Facility/Service removed",
                                    description: `${facility.name} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "experience" && (
              <Card>
                <CardHeader>
                  <CardTitle>Provider Experience</CardTitle>
                  <CardDescription>Configure provider experience categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience-years">Experience Type</Label>
                      <Input
                        id="experience-years"
                        placeholder="E.g., Medical"
                        value={newExperienceYears}
                        onChange={(e) => setNewExperienceYears(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience-description">Description</Label>
                      <Input
                        id="experience-description"
                        placeholder="Enter description"
                        value={newExperienceDescription}
                        onChange={(e) => setNewExperienceDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addExperience}>
                    Add Provider Experience
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Experience Type</th>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experiences.map((experience, index) => (
                          <tr key={index} className={index < experiences.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{experience.years}</td>
                            <td className="px-4 py-2">{experience.description}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedExperiences = [...experiences]
                                  updatedExperiences.splice(index, 1)
                                  setExperiences(updatedExperiences)
                                  saveSection("experiences", updatedExperiences)
                                  toast({
                                    title: "Provider experience removed",
                                    description: `${experience.years} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "resident-specialist" && (
              <Card>
                <CardHeader>
                  <CardTitle>Resident Specialist</CardTitle>
                  <CardDescription>Configure resident specialist information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialist-name">Specialty</Label>
                      <Input
                        id="specialist-name"
                        placeholder="E.g., ALLERGY AND IMMUNOLOGY"
                        value={newSpecialistName}
                        onChange={(e) => setNewSpecialistName(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addSpecialist}>
                    Add Resident Specialist
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Specialty</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specialists.map((specialist, index) => (
                          <tr key={index} className={index < specialists.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{specialist.name}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedSpecialists = [...specialists]
                                  updatedSpecialists.splice(index, 1)
                                  setSpecialists(updatedSpecialists)
                                  saveSection("specialists", updatedSpecialists)
                                  toast({
                                    title: "Resident specialist removed",
                                    description: `${specialist.name} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "specialty-doctor" && (
              <Card>
                <CardHeader>
                  <CardTitle>Specialty Doctor</CardTitle>
                  <CardDescription>Configure specialty doctor categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter specialty doctor category"
                      className="flex-1"
                      value={newSpecialtyDoctor}
                      onChange={(e) => setNewSpecialtyDoctor(e.target.value)}
                    />
                    <Button type="button" onClick={addSpecialtyDoctor}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Specialty Doctor</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specialtyDoctors.map((doctor, index) => (
                          <tr key={index} className={index < specialtyDoctors.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{doctor}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedDoctors = [...specialtyDoctors]
                                  updatedDoctors.splice(index, 1)
                                  setSpecialtyDoctors(updatedDoctors)
                                  saveSection("specialtyDoctors", updatedDoctors)
                                  toast({
                                    title: "Specialty doctor removed",
                                    description: `${doctor} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}

            {activeTab === "sub-specialty-doctor" && (
              <Card>
                <CardHeader>
                  <CardTitle>Sub Specialty Doctor</CardTitle>
                  <CardDescription>Configure sub specialty doctor categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <Input
                      placeholder="Enter sub specialty doctor category"
                      className="flex-1"
                      value={newSubSpecialtyDoctor}
                      onChange={(e) => setNewSubSpecialtyDoctor(e.target.value)}
                    />
                    <Button type="button" onClick={addSubSpecialtyDoctor}>
                      Add
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Sub Specialty Doctor</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subSpecialtyDoctors.map((doctor, index) => (
                          <tr key={index} className={index < subSpecialtyDoctors.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{doctor}</td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedDoctors = [...subSpecialtyDoctors]
                                  updatedDoctors.splice(index, 1)
                                  setSubSpecialtyDoctors(updatedDoctors)
                                  saveSection("subSpecialtyDoctors", updatedDoctors)
                                  toast({
                                    title: "Sub specialty doctor removed",
                                    description: `${doctor} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}
            {activeTab === "pmcare-representative" && (
              <Card>
                <CardHeader>
                  <CardTitle>PMCare Representative</CardTitle>
                  <CardDescription>
                    Configure PMCare representatives for different provider types and states
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pmcare-person">Person In Charge</Label>
                      <Input
                        id="pmcare-person"
                        value={newPmcarePersonInCharge}
                        onChange={(e) => setNewPmcarePersonInCharge(e.target.value)}
                        placeholder="Enter person in charge name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pmcare-designation">Designation</Label>
                      <Input
                        id="pmcare-designation"
                        value={newPmcareDesignation}
                        onChange={(e) => setNewPmcareDesignation(e.target.value)}
                        placeholder="Enter designation"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pmcare-status">Status</Label>
                      <Select onValueChange={(value) => setNewPmcareStatus(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {pmcareStatusOptions.map((status, idx) => (
                            <SelectItem key={idx} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pmcare-phone">Phone</Label>
                      <Input
                        id="pmcare-phone"
                        value={newPmcarePhone}
                        onChange={(e) => setNewPmcarePhone(e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pmcare-email">Email</Label>
                      <Input
                        id="pmcare-email"
                        type="email"
                        value={newPmcareEmail}
                        onChange={(e) => setNewPmcareEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pmcare-provider-types">Provider Types (Select Multiple)</Label>
                      <div className="relative">
                        <button
                          type="button"
                          id="pmcare-provider-types"
                          className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => {
                            const dropdown = document.getElementById("pmcare-provider-type-dropdown")
                            if (dropdown) {
                              dropdown.classList.toggle("hidden")
                            }
                          }}
                        >
                          <span>
                            {selectedPmcareProviderTypes.length > 0
                              ? selectedPmcareProviderTypes.join(", ")
                              : "Select Provider Types"}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 opacity-50"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        <div
                          id="pmcare-provider-type-dropdown"
                          className="absolute z-10 mt-1 hidden w-full rounded-md border border-gray-200 bg-white shadow-lg"
                        >
                          <div className="p-2 max-h-60 overflow-y-auto">
                            {providerTypes.map((type, idx) => (
                              <div key={idx} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                                <input
                                  type="checkbox"
                                  id={`pmcare-provider-type-${idx}`}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  checked={selectedPmcareProviderTypes.includes(type)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPmcareProviderTypes([...selectedPmcareProviderTypes, type])
                                    } else {
                                      setSelectedPmcareProviderTypes(
                                        selectedPmcareProviderTypes.filter((t) => t !== type),
                                      )
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`pmcare-provider-type-${idx}`}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <div className="border-t p-2 flex justify-between">
                            <button
                              type="button"
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => setSelectedPmcareProviderTypes([...providerTypes])}
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => setSelectedPmcareProviderTypes([])}
                            >
                              Deselect All
                            </button>
                            <button
                              type="button"
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => {
                                const dropdown = document.getElementById("pmcare-provider-type-dropdown")
                                if (dropdown) {
                                  dropdown.classList.add("hidden")
                                }
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pmcare-states">States (Select Multiple)</Label>
                      <div className="relative">
                        <button
                          type="button"
                          id="pmcare-states"
                          className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => {
                            const dropdown = document.getElementById("pmcare-states-dropdown")
                            if (dropdown) {
                              dropdown.classList.toggle("hidden")
                            }
                          }}
                        >
                          <span>
                            {selectedPmcareStates.length > 0 ? selectedPmcareStates.join(", ") : "Select States"}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 opacity-50"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        <div
                          id="pmcare-states-dropdown"
                          className="absolute z-10 mt-1 hidden w-full rounded-md border border-gray-200 bg-white shadow-lg"
                        >
                          <div className="p-2 max-h-60 overflow-y-auto">
                            {malaysianStates.map((state, idx) => (
                              <div key={idx} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                                <input
                                  type="checkbox"
                                  id={`pmcare-state-${idx}`}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  checked={selectedPmcareStates.includes(state)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPmcareStates([...selectedPmcareStates, state])
                                    } else {
                                      setSelectedPmcareStates(selectedPmcareStates.filter((s) => s !== state))
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`pmcare-state-${idx}`}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {state}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <div className="border-t p-2 flex justify-between">
                            <button
                              type="button"
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => setSelectedPmcareStates([...malaysianStates])}
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => setSelectedPmcareStates([])}
                            >
                              Deselect All
                            </button>
                            <button
                              type="button"
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => {
                                const dropdown = document.getElementById("pmcare-states-dropdown")
                                if (dropdown) {
                                  dropdown.classList.add("hidden")
                                }
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="button" onClick={addPmcareRepresentative}>
                    Add PMCare Representative
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Person In Charge</th>
                          <th className="px-4 py-2 text-left">Designation</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Phone</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Provider Types</th>
                          <th className="px-4 py-2 text-left">States</th>
                          <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pmcareRepresentatives.map((rep, index) => (
                          <tr key={index} className={index < pmcareRepresentatives.length - 1 ? "border-b" : ""}>
                            {editingPmcareIndex === index ? (
                              // Edit mode
                              <>
                                <td className="px-4 py-2">
                                  <Input
                                    value={editPmcarePersonInCharge}
                                    onChange={(e) => setEditPmcarePersonInCharge(e.target.value)}
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Input
                                    value={editPmcareDesignation}
                                    onChange={(e) => setEditPmcareDesignation(e.target.value)}
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Select value={editPmcareStatus} onValueChange={setEditPmcareStatus}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {pmcareStatusOptions.map((status, idx) => (
                                        <SelectItem key={idx} value={status}>
                                          {status}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="px-4 py-2">
                                  <Input
                                    value={editPmcarePhone}
                                    onChange={(e) => setEditPmcarePhone(e.target.value)}
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Input
                                    type="email"
                                    value={editPmcareEmail}
                                    onChange={(e) => setEditPmcareEmail(e.target.value)}
                                    className="w-full"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      onClick={() => {
                                        const dropdown = document.getElementById(`edit-provider-type-dropdown-${index}`)
                                        if (dropdown) {
                                          dropdown.classList.toggle("hidden")
                                        }
                                      }}
                                    >
                                      <span className="text-xs">
                                        {editSelectedPmcareProviderTypes.length > 0
                                          ? editSelectedPmcareProviderTypes.join(", ")
                                          : "Select Types"}
                                      </span>
                                    </button>
                                    <div
                                      id={`edit-provider-type-dropdown-${index}`}
                                      className="absolute z-10 mt-1 hidden w-full rounded-md border border-gray-200 bg-white shadow-lg"
                                    >
                                      <div className="p-2 max-h-40 overflow-y-auto">
                                        {providerTypes.map((type, idx) => (
                                          <div key={idx} className="flex items-center space-x-2 p-1">
                                            <input
                                              type="checkbox"
                                              id={`edit-provider-type-${index}-${idx}`}
                                              className="h-3 w-3"
                                              checked={editSelectedPmcareProviderTypes.includes(type)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setEditSelectedPmcareProviderTypes([
                                                    ...editSelectedPmcareProviderTypes,
                                                    type,
                                                  ])
                                                } else {
                                                  setEditSelectedPmcareProviderTypes(
                                                    editSelectedPmcareProviderTypes.filter((t) => t !== type),
                                                  )
                                                }
                                              }}
                                            />
                                            <Label htmlFor={`edit-provider-type-${index}-${idx}`} className="text-xs">
                                              {type}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                      <button
                                        type="button"
                                        className="text-xs text-blue-600 hover:underline"
                                        onClick={() => setEditSelectedPmcareProviderTypes([])}
                                      >
                                        Deselect All
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      onClick={() => {
                                        const dropdown = document.getElementById(`edit-states-dropdown-${index}`)
                                        if (dropdown) {
                                          dropdown.classList.toggle("hidden")
                                        }
                                      }}
                                    >
                                      <span className="text-xs">
                                        {editSelectedPmcareStates.length > 0
                                          ? editSelectedPmcareStates.join(", ")
                                          : "Select States"}
                                      </span>
                                    </button>
                                    <div
                                      id={`edit-states-dropdown-${index}`}
                                      className="absolute z-10 mt-1 hidden w-full rounded-md border border-gray-200 bg-white shadow-lg"
                                    >
                                      <div className="p-2 max-h-40 overflow-y-auto">
                                        {malaysianStates.map((state, idx) => (
                                          <div key={idx} className="flex items-center space-x-2 p-1">
                                            <input
                                              type="checkbox"
                                              id={`edit-state-${index}-${idx}`}
                                              className="h-3 w-3"
                                              checked={editSelectedPmcareStates.includes(state)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setEditSelectedPmcareStates([...editSelectedPmcareStates, state])
                                                } else {
                                                  setEditSelectedPmcareStates(
                                                    editSelectedPmcareStates.filter((s) => s !== state),
                                                  )
                                                }
                                              }}
                                            />
                                            <Label htmlFor={`edit-state-${index}-${idx}`} className="text-xs">
                                              {state}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                      <button
                                        type="button"
                                        className="text-xs text-blue-600 hover:underline"
                                        onClick={() => setEditSelectedPmcareStates([])}
                                      >
                                        Deselect All
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <div className="flex space-x-1">
                                    <Button variant="ghost" size="sm" onClick={saveEditPmcareRepresentative}>
                                      Save
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={cancelEditPmcareRepresentative}>
                                      Cancel
                                    </Button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              // View mode
                              <>
                                <td className="px-4 py-2">{rep.personInCharge}</td>
                                <td className="px-4 py-2">{rep.designation}</td>
                                <td className="px-4 py-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      rep.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : rep.status === "Suspended" ||
                                            rep.status === "Terminated" ||
                                            rep.status === "Void"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {rep.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{rep.phone}</td>
                                <td className="px-4 py-2">{rep.email}</td>
                                <td className="px-4 py-2">
                                  <div className="flex flex-wrap gap-1">
                                    {rep.providerTypes.map((type, typeIndex) => (
                                      <span
                                        key={typeIndex}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                                      >
                                        {type}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex flex-wrap gap-1">
                                    {rep.states.map((state, stateIndex) => (
                                      <span
                                        key={stateIndex}
                                        className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded"
                                      >
                                        {state}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => startEditPmcareRepresentative(index)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const updatedReps = [...pmcareRepresentatives]
                                        updatedReps.splice(index, 1)
                                        setPmcareRepresentatives(updatedReps)
                                        saveSection("pmcareRepresentatives", updatedReps)
                                        toast({
                                          title: "PMCare Representative removed",
                                          description: `${rep.personInCharge} has been removed from the list.`,
                                        })
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
            {activeTab === "drug" && (
              <Card>
                <CardHeader>
                  <CardTitle>Drug</CardTitle>
                  <CardDescription>Configure drug information for providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="drug-code">Drug Code</Label>
                      <Input
                        id="drug-code"
                        value={newDrugCode}
                        onChange={(e) => setNewDrugCode(e.target.value)}
                        placeholder="Enter drug code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mcd-code">MCD Code</Label>
                      <Input
                        id="mcd-code"
                        value={newMcdCode}
                        onChange={(e) => setNewMcdCode(e.target.value)}
                        placeholder="Enter MCD code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="generic-name">Generic Name</Label>
                      <Input
                        id="generic-name"
                        value={newGenericName}
                        onChange={(e) => setNewGenericName(e.target.value)}
                        placeholder="Enter generic name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holder-name">Holder Name</Label>
                      <Input
                        id="holder-name"
                        value={newHolderName}
                        onChange={(e) => setNewHolderName(e.target.value)}
                        placeholder="Enter holder name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input
                        id="product-name"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-register-no">Product Register No</Label>
                      <Input
                        id="product-register-no"
                        value={newProductRegisterNo}
                        onChange={(e) => setNewProductRegisterNo(e.target.value)}
                        placeholder="Enter product register number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="drug-status">Status</Label>
                      <Select onValueChange={(value) => setNewDrugStatus(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {drugStatusOptions.map((status, idx) => (
                            <SelectItem key={idx} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="button" onClick={addDrug}>
                    Add Drug
                  </Button>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Drug Code</th>
                          <th className="px-4 py-2 text-left">MCD Code</th>
                          <th className="px-4 py-2 text-left">Generic Name</th>
                          <th className="px-4 py-2 text-left">Holder Name</th>
                          <th className="px-4 py-2 text-left">Product Name</th>
                          <th className="px-4 py-2 text-left">Product Register No</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drugs.map((drug, index) => (
                          <tr key={index} className={index < drugs.length - 1 ? "border-b" : ""}>
                            <td className="px-4 py-2">{drug.drugCode}</td>
                            <td className="px-4 py-2">{drug.mcdCode}</td>
                            <td className="px-4 py-2">{drug.genericName}</td>
                            <td className="px-4 py-2">{drug.holderName}</td>
                            <td className="px-4 py-2">{drug.productName}</td>
                            <td className="px-4 py-2">{drug.productRegisterNo}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  drug.status === "REGISTERED"
                                    ? "bg-green-100 text-green-800"
                                    : drug.status === "EXPIRED" ||
                                        drug.status === "CANCEL" ||
                                        drug.status === "REJECTED" ||
                                        drug.status === "SUSPENDED" ||
                                        drug.status === "TERMINATED" ||
                                        drug.status === "WITHDRAWAL"
                                      ? "bg-red-100 text-red-800"
                                      : drug.status === "APPEAL" ||
                                          drug.status === "REVIEW" ||
                                          drug.status === "RENEWAL"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {drug.status.charAt(0).toUpperCase() + drug.status.slice(1).toLowerCase()}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedDrugs = [...drugs]
                                  updatedDrugs.splice(index, 1)
                                  setDrugs(updatedDrugs)

                                  // Save the updated drugs
                                  saveSection("drugs", updatedDrugs)

                                  toast({
                                    title: "Drug removed",
                                    description: `${drug.productName} has been removed from the list.`,
                                  })
                                }}
                              >
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
            )}
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
