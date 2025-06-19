"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactDetailsForm, type Contact } from "@/components/company/contact-details-form"
import { OperationalSegmentationForm } from "@/components/company/operational-segmentation-form"
import { MedicalProviderForm } from "@/components/company/medical-provider-form"
import { JobGradeForm, type JobGradeSet } from "@/components/company/job-grade-form"
import { ReportFrequencyForm } from "@/components/company/report-frequency-form"
import { SOBForm } from "@/components/company/sob-form"
import { Textarea } from "@/components/ui/textarea"
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
import { addCompany } from "@/lib/company/company-storage"

// Add the following functions and constants before the NewCompanyForm component definition
const COMPANY_FORM_STORAGE_KEY = "company_form_draft"

const saveFormToLocalStorage = (formData: any) => {
  try {
    localStorage.setItem(COMPANY_FORM_STORAGE_KEY, JSON.stringify(formData))
  } catch (error) {
    console.error("Error saving form data to local storage:", error)
  }
}

const loadFormFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    return savedData ? JSON.parse(savedData) : null
  } catch (error) {
    console.error("Error loading form data from local storage:", error)
    return null
  }
}

const clearFormFromLocalStorage = () => {
  try {
    localStorage.removeItem(COMPANY_FORM_STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing form data from local storage:", error)
  }
}

type FormStep =
  | "company-info"
  | "contact-details"
  | "operational"
  | "job-grade"
  | "report-frequency"
  | "medical-provider"
  | "financial-arrangement"
  | "sob"
  | "history"

interface NewCompanyFormProps {
  onBack: () => void
  onSave?: (companyData: any) => void
  onStepChange?: (step: string) => void
  initialStep?: FormStep
}

// Sample company data - in a real app, this would come from an API or database
interface Company {
  id: number
  name: string
  companyType: string
  parentId?: number
}

// Interface for contract history records
interface ContractHistoryRecord {
  id: number
  startDate: string
  endDate: string
  status: string
  modifiedBy: string
  modifiedDate: string
}

export function NewCompanyForm({ onBack, onSave, onStepChange, initialStep = "company-info" }: NewCompanyFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(initialStep)
  const [joiningDate, setJoiningDate] = useState<string>("")
  const [contractStart, setContractStart] = useState<string>("")
  const [contractEnd, setContractEnd] = useState<string>("")
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>("")
  const [parentCompanyOptions, setParentCompanyOptions] = useState<Company[]>([])
  const [hierarchyLevel, setHierarchyLevel] = useState<string>("")
  const [subsidiaries, setSubsidiaries] = useState<string>("")
  const [companyName, setCompanyName] = useState<string>("")
  const [companyCode, setCompanyCode] = useState<string>("")
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [subsidiaryCompanies, setSubsidiaryCompanies] = useState<Company[]>([])
  const [selectedParentId, setSelectedParentId] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("active")
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)
  const [registrationNo, setRegistrationNo] = useState<string>("")
  const [gstSstRegNo, setGstSstRegNo] = useState<string>("")
  const [tinNo, setTinNo] = useState<string>("")
  const [tinEmail, setTinEmail] = useState<string>("")
  const [programType, setProgramType] = useState<string>("")
  const [industry, setIndustry] = useState<string>("")
  const [subIndustry, setSubIndustry] = useState<string>("")
  const [website, setWebsite] = useState<string>("")
  const [phoneNo, setPhoneNo] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [postcode, setPostcode] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [state, setState] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [operationalSegmentation, setOperationalSegmentation] = useState<any[]>([])
  const [jobGrade, setJobGrade] = useState<JobGradeSet[]>([])
  const [reportFrequency, setReportFrequency] = useState<any[]>([])
  const [medicalProvider, setMedicalProvider] = useState<any[]>([])
  const [sob, setSob] = useState<any>(null)

  // State for contact details
  const [contacts, setContacts] = useState<Contact[]>([])

  // Initialize with dummy contract history data
  const [contractHistory, setContractHistory] = useState<ContractHistoryRecord[]>([
    {
      id: 1,
      startDate: "2025-01-01", // Jan 1, 2025
      endDate: "2026-12-31", // Dec 31, 2026
      status: "Active",
      modifiedBy: "Michael Johnson",
      modifiedDate: "2024-12-18", // Dec 18, 2024
    },
    {
      id: 2,
      startDate: "2023-06-15", // June 15, 2023
      endDate: "2024-12-31", // Dec 31, 2024
      status: "Completed",
      modifiedBy: "Sarah Williams",
      modifiedDate: "2023-06-10", // June 10, 2023
    },
    {
      id: 3,
      startDate: "2022-03-01", // March 1, 2022
      endDate: "2023-05-31", // May 31, 2023
      status: "Completed",
      modifiedBy: "David Chen",
      modifiedDate: "2022-02-25", // Feb 25, 2022
    },
    {
      id: 4,
      startDate: "2021-01-01", // Jan 1, 2021
      endDate: "2022-02-28", // Feb 28, 2022
      status: "Terminated",
      modifiedBy: "Emily Rodriguez",
      modifiedDate: "2021-12-15", // Dec 15, 2021
    },
  ])

  // Enhanced sample company data with parent-child relationships
  const companies: Company[] = [
    {
      id: 1,
      name: "Global Corp Holdings",
      companyType: "Main holding",
    },
    {
      id: 2,
      name: "GC Eastern Division",
      companyType: "Subsidiary",
      parentId: 1,
    },
    {
      id: 3,
      name: "GC Western Division",
      companyType: "Subsidiary",
      parentId: 1,
    },
    {
      id: 4,
      name: "GC Northern Division",
      companyType: "Subsidiary",
      parentId: 1,
    },
    {
      id: 5,
      name: "AD Techno",
      companyType: "Independent",
    },
    {
      id: 6,
      name: "BMF Holdings",
      companyType: "Main holding",
    },
    {
      id: 7,
      name: "BMF Services",
      companyType: "Subsidiary",
      parentId: 6,
    },
    {
      id: 8,
      name: "BMF Solutions",
      companyType: "Subsidiary",
      parentId: 6,
    },
    {
      id: 9,
      name: "Tech Innovations Inc",
      companyType: "Main holding",
    },
    {
      id: 10,
      name: "Tech Labs",
      companyType: "Subsidiary",
      parentId: 9,
    },
  ]

  // Load saved form data when component mounts
  useEffect(() => {
    // Load saved form data when component mounts
    const savedFormData = loadFormFromLocalStorage()
    if (savedFormData) {
      // Set all the form states from saved data
      if (savedFormData.companyName) setCompanyName(savedFormData.companyName)
      if (savedFormData.companyCode) setCompanyCode(savedFormData.companyCode)
      if (savedFormData.selectedStatus) setSelectedStatus(savedFormData.selectedStatus)
      if (savedFormData.joiningDate) setJoiningDate(savedFormData.joiningDate)
      if (savedFormData.contractStart) setContractStart(savedFormData.contractStart)
      if (savedFormData.contractEnd) setContractEnd(savedFormData.contractEnd)
      if (savedFormData.selectedCompanyType) setSelectedCompanyType(savedFormData.selectedCompanyType)
      if (savedFormData.hierarchyLevel) setHierarchyLevel(savedFormData.hierarchyLevel)
      if (savedFormData.subsidiaries) setSubsidiaries(savedFormData.subsidiaries)
      if (savedFormData.selectedParentId) setSelectedParentId(savedFormData.selectedParentId)
      if (savedFormData.contacts && savedFormData.contacts.length > 0) setContacts(savedFormData.contacts)
      if (savedFormData.registrationNo) setRegistrationNo(savedFormData.registrationNo)
      if (savedFormData.gstSstRegNo) setGstSstRegNo(savedFormData.gstSstRegNo)
      if (savedFormData.tinNo) setTinNo(savedFormData.tinNo)
      if (savedFormData.tinEmail) setTinEmail(savedFormData.tinEmail)
      if (savedFormData.programType) setProgramType(savedFormData.programType)
      if (savedFormData.industry) setIndustry(savedFormData.industry)
      if (savedFormData.subIndustry) setSubIndustry(savedFormData.subIndustry)
      if (savedFormData.website) setWebsite(savedFormData.website)
      if (savedFormData.phoneNo) setPhoneNo(savedFormData.phoneNo)
      if (savedFormData.address) setAddress(savedFormData.address)
      if (savedFormData.postcode) setPostcode(savedFormData.postcode)
      if (savedFormData.city) setCity(savedFormData.city)
      if (savedFormData.state) setState(savedFormData.state)
      if (savedFormData.country) setCountry(savedFormData.country)
      if (savedFormData.contractHistory && savedFormData.contractHistory.length > 0)
        setContractHistory(savedFormData.contractHistory)
      if (savedFormData.operationalSegmentation && savedFormData.operationalSegmentation.length > 0)
        setOperationalSegmentation(savedFormData.operationalSegmentation)
      if (savedFormData.jobGrade && savedFormData.jobGrade.length > 0) setJobGrade(savedFormData.jobGrade)
      if (savedFormData.reportFrequency && savedFormData.reportFrequency.length > 0)
        setReportFrequency(savedFormData.reportFrequency)
      if (savedFormData.medicalProvider && savedFormData.medicalProvider.length > 0)
        setMedicalProvider(savedFormData.medicalProvider)
      if (savedFormData.sob) setSob(savedFormData.sob)

      // Set the current step if saved
      if (savedFormData.currentStep) {
        setCurrentStep(savedFormData.currentStep)
        // Update URL based on saved step
        window.history.pushState({}, "", `/company/add/${savedFormData.currentStep.replace("-", "_")}`)
      }
    }
  }, [])

  // Add this useEffect to save form data whenever relevant state changes
  useEffect(() => {
    // Collect current form data
    const formData = {
      currentStep,
      companyName,
      companyCode,
      selectedStatus,
      joiningDate,
      contractStart,
      contractEnd,
      selectedCompanyType,
      hierarchyLevel,
      subsidiaries,
      selectedParentId,
      contacts,
      registrationNo,
      gstSstRegNo,
      tinNo,
      tinEmail,
      programType,
      industry,
      subIndustry,
      website,
      phoneNo,
      address,
      postcode,
      city,
      state,
      country,
      contractHistory,
      operationalSegmentation,
      jobGrade,
      reportFrequency,
      medicalProvider,
      sob,
      // Add any other form fields that need to be saved
    }

    // Save to local storage
    saveFormToLocalStorage(formData)
  }, [
    currentStep,
    companyName,
    companyCode,
    selectedStatus,
    joiningDate,
    contractStart,
    contractEnd,
    selectedCompanyType,
    hierarchyLevel,
    subsidiaries,
    selectedParentId,
    contacts,
    registrationNo,
    gstSstRegNo,
    tinNo,
    tinEmail,
    programType,
    industry,
    subIndustry,
    website,
    phoneNo,
    address,
    postcode,
    city,
    state,
    country,
    contractHistory,
    operationalSegmentation,
    jobGrade,
    reportFrequency,
    medicalProvider,
    sob,
    // Add any other dependencies that should trigger a save
  ])

  // Notify parent component when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep)
    }
  }, [currentStep, onStepChange])

  // Update parent company options and handle other company type related logic
  useEffect(() => {
    // Generate company code when company name changes
    if (companyName) {
      // Create a code based on the first 3 letters of company name + random 4 digits
      const prefix = companyName.substring(0, 3).toUpperCase()
      const randomDigits = Math.floor(1000 + Math.random() * 9000) // 4-digit number
      setCompanyCode(`${prefix}-${randomDigits}`)
    } else {
      setCompanyCode("")
    }

    if (selectedCompanyType === "subsidiary") {
      // As per requirement: show only Global Corp Holdings and GC Western Division
      const specificParentOptions = companies.filter(
        (company) => company.name === "Global Corp Holdings" || company.name === "GC Western Division",
      )
      setParentCompanyOptions(specificParentOptions)
    } else {
      // Reset the options for other company types
      setParentCompanyOptions([])
      setSelectedParentId("")
    }

    // Set hierarchy level based on company type
    if (selectedCompanyType === "main-holding" || selectedCompanyType === "independent") {
      setHierarchyLevel("1")
    } else if (selectedCompanyType === "subsidiary") {
      setHierarchyLevel("2")
    }

    // Find subsidiaries for the current company if it's a main holding
    if (selectedCompanyType === "main-holding" && companyName) {
      // In a real app, you would look up the company ID based on the name
      // For this example, we'll find the company ID from our sample data
      const company = companies.find((c) => c.name === companyName)
      if (company) {
        setSelectedCompanyId(company.id)

        // Find all subsidiaries of this company
        const subs = companies.filter((c) => c.parentId === company.id)
        setSubsidiaryCompanies(subs)

        // Format subsidiaries as a string
        if (subs.length > 0) {
          setSubsidiaries(subs.map((s) => s.name).join(", "))
        } else {
          setSubsidiaries("No subsidiaries found")
        }
      }
    } else {
      setSubsidiaryCompanies([])
      setSubsidiaries("")
    }
  }, [selectedCompanyType, companyName])

  // When parent company is selected, update related information
  useEffect(() => {
    if (selectedParentId && selectedCompanyType === "subsidiary") {
      const parentId = Number.parseInt(selectedParentId)
      const parent = companies.find((c) => c.id === parentId)

      if (parent) {
        // Find all sibling companies (other subsidiaries with the same parent)
        const siblings = companies.filter((c) => c.parentId === parentId && c.id !== selectedCompanyId)

        // Format siblings as a string for display
        if (siblings.length > 0) {
          const siblingNames = siblings.map((s) => s.name).join(", ")
          setSubsidiaries(`Other subsidiaries of ${parent.name}: ${siblingNames}`)
        } else {
          setSubsidiaries(`No other subsidiaries of ${parent.name}`)
        }
      }
    }
  }, [selectedParentId, selectedCompanyType, selectedCompanyId])

  const handleStepClick = (step: FormStep) => {
    setCurrentStep(step)

    // Update URL based on step without changing page state
    if (step === "company-info") {
      window.history.pushState({}, "", "/company/add/company_info")
    } else if (step === "contact-details") {
      window.history.pushState({}, "", "/company/add/contact_details")
    } else if (step === "operational") {
      window.history.pushState({}, "", "/company/add/operational_segmentation")
    } else if (step === "job-grade") {
      window.history.pushState({}, "", "/company/add/job_grade")
    } else if (step === "report-frequency") {
      window.history.pushState({}, "", "/company/add/report_frequency")
    } else if (step === "medical-provider") {
      window.history.pushState({}, "", "/company/add/medical_provider")
    } else if (step === "financial-arrangement") {
      window.history.pushState({}, "", "/company/add/financial_arrangement")
    } else if (step === "sob") {
      window.history.pushState({}, "", "/company/add/sob")
    } else if (step === "history") {
      window.history.pushState({}, "", "/company/add/history")
    }
  }

  const handleNext = () => {
    if (currentStep === "company-info") {
      // Just move to the next step without calling onSave
      setCurrentStep("contact-details")
      window.history.pushState({}, "", "/company/add/contact_details")
    } else if (currentStep === "contact-details") {
      setCurrentStep("operational")
      window.history.pushState({}, "", "/company/add/operational_segmentation")
    } else if (currentStep === "operational") {
      setCurrentStep("job-grade")
      window.history.pushState({}, "", "/company/add/job_grade")
    } else if (currentStep === "job-grade") {
      setCurrentStep("report-frequency")
      window.history.pushState({}, "", "/company/add/report_frequency")
    } else if (currentStep === "report-frequency") {
      setCurrentStep("medical-provider")
      window.history.pushState({}, "", "/company/add/medical_provider")
    } else if (currentStep === "medical-provider") {
      setCurrentStep("financial-arrangement")
      window.history.pushState({}, "", "/company/add/financial_arrangement")
    } else if (currentStep === "financial-arrangement") {
      setCurrentStep("sob")
      window.history.pushState({}, "", "/company/add/sob")
    } else if (currentStep === "sob") {
      setCurrentStep("history")
      window.history.pushState({}, "", "/company/add/history")
    }
  }

  const handlePrevious = () => {
    if (currentStep === "contact-details") {
      setCurrentStep("company-info")
      window.history.pushState({}, "", "/company/add/company_info")
    } else if (currentStep === "operational") {
      setCurrentStep("contact-details")
      window.history.pushState({}, "", "/company/add/contact_details")
    } else if (currentStep === "job-grade") {
      setCurrentStep("operational")
      window.history.pushState({}, "", "/company/add/operational_segmentation")
    } else if (currentStep === "report-frequency") {
      setCurrentStep("job-grade")
      window.history.pushState({}, "", "/company/add/job_grade")
    } else if (currentStep === "medical-provider") {
      setCurrentStep("report-frequency")
      window.history.pushState({}, "", "/company/add/report_frequency")
    } else if (currentStep === "financial-arrangement") {
      setCurrentStep("medical-provider")
      window.history.pushState({}, "", "/company/add/medical_provider")
    } else if (currentStep === "sob") {
      setCurrentStep("financial-arrangement")
      window.history.pushState({}, "", "/company/add/financial_arrangement")
    } else if (currentStep === "history") {
      setCurrentStep("sob")
      window.history.pushState({}, "", "/company/add/sob")
    }
  }

  // Updated collectFormData function to only include user-entered data
  const collectFormData = () => {
    // Collect all form data when needed (when saving)
    return {
      // Company Info
      id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID
      name: companyName,
      code: companyCode,
      status: selectedStatus,
      registrationNo: registrationNo,
      gstSstRegNo: gstSstRegNo,
      tinNo: tinNo,
      tinEmail,
      companyType:
        selectedCompanyType === "main-holding"
          ? "Main holding"
          : selectedCompanyType === "subsidiary"
            ? "Subsidiary"
            : selectedCompanyType === "independent"
              ? "Independent"
              : "",
      parentCompany: selectedParentId
        ? parentCompanyOptions.find((c) => c.id.toString() === selectedParentId)?.name || ""
        : "",
      hierarchyLevel: hierarchyLevel,
      subsidiaries: subsidiaryCompanies.length,
      joiningDate,
      contractStart,
      contractEnd,
      programType,
      industry,
      subIndustry,
      website,
      phoneNo,
      address,
      postcode,
      city,
      state,
      country,
      // Contact Details - only include if there are contacts
      ...(contacts.length > 0 && { contacts }),
      // Operational Segmentation - only include if there is data
      ...(operationalSegmentation.length > 0 && { operationalSegmentation }),
      ...(jobGrade.length > 0 && { jobGrade }),
      ...(reportFrequency.length > 0 && { reportFrequency }),
      // Contract History - only include if there is history
      ...(contractHistory.length > 0 && { contractHistory }),
      ...(medicalProvider.length > 0 && { medicalProvider }),
      ...(sob && { sob }),
      // The following fields will only be included if they have been populated by the user
      // through their respective form components
      // These will be added by the respective form components and stored in local storage
    }
  }

  const handleSaveConfirm = () => {
    // Close the dialog
    setShowConfirmDialog(false)

    // Collect form data only when needed
    const formData = collectFormData()

    // Save the company data to local storage
    addCompany(formData)

    // Clear the draft from local storage since it's now saved
    clearFormFromLocalStorage()

    // Save the complete company data
    if (onSave) {
      onSave(formData)
    }

    // Navigate back to the company search page
    onBack()

    console.log("Company saved successfully:", formData)
  }

  // Helper function to determine step status
  const getStepStatus = (step: FormStep) => {
    const steps: FormStep[] = [
      "company-info",
      "contact-details",
      "operational",
      "job-grade",
      "report-frequency",
      "medical-provider",
      "financial-arrangement",
      "sob",
      "history",
    ]
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (step === currentStep) return "current" // Blue
    if (stepIndex < currentIndex) return "completed" // Green
    return "pending" // Gray
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to add a contract history record
  const handleAddContractHistory = () => {
    const newRecord: ContractHistoryRecord = {
      id: contractHistory.length + 1,
      startDate: "2025-01-01", // Jan 1, 2025
      endDate: "2026-12-31", // Dec 31, 2026
      status: "Active",
      modifiedBy: "Michael Johnson", // Sample user name
      modifiedDate: "2024-12-18", // Dec 18, 2024
    }
    setContractHistory([...contractHistory, newRecord])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Company Information</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Listing
        </Button>
      </div>

      {/* Horizontal step navigation at the top */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between relative">
          {/* Horizontal line connecting the bullets */}
          <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("company-info") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("company-info") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("company-info")}
              >
                1
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("company-info") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("company-info") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("company-info")}
            >
              Company Info
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("contact-details") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("contact-details") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("contact-details")}
              >
                2
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("contact-details") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("contact-details") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("contact-details")}
            >
              Contact Details
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("operational") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("operational") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("operational")}
              >
                3
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("operational") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("operational") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("operational")}
            >
              Operational Segmentation
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("job-grade") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("job-grade") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("job-grade")}
              >
                4
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("job-grade") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("job-grade") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("job-grade")}
            >
              Job Grade
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("report-frequency") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("report-frequency") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("report-frequency")}
              >
                5
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("report-frequency") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("report-frequency") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("report-frequency")}
            >
              Report Frequency
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("medical-provider") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("medical-provider") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("medical-provider")}
              >
                6
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("medical-provider") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("medical-provider") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("medical-provider")}
            >
              Medical Provider
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
              ${
                getStepStatus("financial-arrangement") === "current"
                  ? "bg-sky-600 text-white"
                  : getStepStatus("financial-arrangement") === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-slate-300 text-slate-700"
              } font-medium text-sm`}
                onClick={() => handleStepClick("financial-arrangement")}
              >
                7
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
            ${
              getStepStatus("financial-arrangement") === "current"
                ? "font-medium text-sky-600"
                : getStepStatus("financial-arrangement") === "completed"
                  ? "font-medium text-green-500"
                  : "text-slate-600"
            }`}
              onClick={() => handleStepClick("financial-arrangement")}
            >
              Financial arrangement
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("sob") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("sob") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("sob")}
              >
                8
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("sob") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("sob") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("sob")}
            >
              SOB
            </span>
          </div>

          <div className="flex items-center bg-white px-2">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full cursor-pointer
                ${
                  getStepStatus("history") === "current"
                    ? "bg-sky-600 text-white"
                    : getStepStatus("history") === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-300 text-slate-700"
                } font-medium text-sm`}
                onClick={() => handleStepClick("history")}
              >
                9
              </div>
            </div>
            <span
              className={`ml-2 cursor-pointer text-sm whitespace-nowrap
              ${
                getStepStatus("history") === "current"
                  ? "font-medium text-sky-600"
                  : getStepStatus("history") === "completed"
                    ? "font-medium text-green-500"
                    : "text-slate-600"
              }`}
              onClick={() => handleStepClick("history")}
            >
              History
            </span>
          </div>
        </div>
      </div>

      {/* Main form area - now full width */}
      <div className="w-full bg-white">
        {/* Keep all the existing form content exactly the same */}
        {currentStep === "company-info" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Company Information</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="company-name" className="text-sm font-medium text-slate-700">
                  Company Name
                </label>
                <Input
                  id="company-name"
                  className="w-full"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company-code" className="text-sm font-medium text-slate-700">
                  Company Code
                </label>
                <Input
                  id="company-code"
                  value={companyCode}
                  className="w-full bg-gray-50"
                  readOnly
                  placeholder="Auto Generated"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select defaultValue={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspend">Suspended</SelectItem>
                    <SelectItem value="terminate">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="registration-no" className="text-sm font-medium text-slate-700">
                  SSM/Registration No.
                </label>
                <Input
                  id="registration-no"
                  className="w-full"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gst-sst-reg-no" className="text-sm font-medium text-slate-700">
                  GST/SST Reg. No.
                </label>
                <Input
                  id="gst-sst-reg-no"
                  className="w-full"
                  value={gstSstRegNo}
                  onChange={(e) => setGstSstRegNo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tin-no" className="text-sm font-medium text-slate-700">
                  TIN No.
                </label>
                <Input id="tin-no" className="w-full" value={tinNo} onChange={(e) => setTinNo(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label htmlFor="tin-email" className="text-sm font-medium text-slate-700">
                  TIN Email
                </label>
                <Input
                  id="tin-email"
                  type="email"
                  className="w-full"
                  value={tinEmail}
                  onChange={(e) => setTinEmail(e.target.value)}
                  placeholder="Enter TIN email address"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="joining-date" className="text-sm font-medium text-slate-700">
                  Joining Date
                </label>
                <Input
                  id="joining-date"
                  type="date"
                  className="w-full"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contract-start" className="text-sm font-medium text-slate-700">
                  Contract Start
                </label>
                <Input
                  id="contract-start"
                  type="date"
                  className="w-full"
                  value={contractStart}
                  onChange={(e) => setContractStart(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contract-end" className="text-sm font-medium text-slate-700">
                  Contract End
                </label>
                <Input
                  id="contract-end"
                  type="date"
                  className="w-full"
                  value={contractEnd}
                  onChange={(e) => setContractEnd(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="program-type" className="text-sm font-medium text-slate-700">
                  Program Type
                </label>
                <Select value={programType} onValueChange={setProgramType}>
                  <SelectTrigger id="program-type" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self-funded">Self-funded</SelectItem>
                    <SelectItem value="fully-insured">Fully-insured</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="company-type" className="text-sm font-medium text-slate-700">
                  Company Type
                </label>
                <Select defaultValue={selectedCompanyType} onValueChange={(value) => setSelectedCompanyType(value)}>
                  <SelectTrigger id="company-type" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-holding">Main Holding</SelectItem>
                    <SelectItem value="subsidiary">Subsidiary</SelectItem>
                    <SelectItem value="independent">Independent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="parent-company" className="text-sm font-medium text-slate-700">
                  Parent Company
                </label>
                <Select
                  disabled={selectedCompanyType !== "subsidiary"}
                  defaultValue={selectedParentId}
                  onValueChange={(value) => setSelectedParentId(value)}
                >
                  <SelectTrigger id="parent-company" className="w-full">
                    <SelectValue placeholder={selectedCompanyType === "subsidiary" ? "Select" : "Not Applicable"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCompanyType === "subsidiary" ? (
                      parentCompanyOptions.length > 0 ? (
                        parentCompanyOptions.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-options" disabled>
                          No parent companies available
                        </SelectItem>
                      )
                    ) : (
                      <SelectItem value="not-applicable" disabled>
                        Not Applicable
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="hierarchy-level" className="text-sm font-medium text-slate-700">
                  Hierarchy Level
                </label>
                <Input
                  id="hierarchy-level"
                  className="w-full"
                  value={hierarchyLevel}
                  onChange={(e) => setHierarchyLevel(e.target.value)}
                  disabled={selectedCompanyType === "main-holding" || selectedCompanyType === "independent"}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subsidiaries" className="text-sm font-medium text-slate-700">
                  Subsidiaries
                </label>
                <Textarea
                  id="subsidiaries"
                  className="w-full min-h-[80px]"
                  value={subsidiaries}
                  onChange={(e) => setSubsidiaries(e.target.value)}
                  readOnly={selectedCompanyType === "main-holding" || selectedCompanyType === "subsidiary"}
                  placeholder={
                    selectedCompanyType === "main-holding"
                      ? "Subsidiaries will be listed here"
                      : selectedCompanyType === "subsidiary"
                        ? "Other subsidiaries with the same parent will be listed here"
                        : ""
                  }
                />
              </div>

              {selectedCompanyType === "subsidiary" && (
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Available Parent Companies</label>
                  <div className="border rounded-md p-3 bg-slate-50">
                    <p className="text-sm text-slate-600 mb-2">
                      The following companies are available as parent companies:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {parentCompanyOptions.map((company) => (
                        <li
                          key={company.id}
                          className={`${Number.parseInt(selectedParentId) === company.id ? "font-medium text-sky-600" : "text-slate-700"}`}
                        >
                          {company.name}
                          {company.companyType && (
                            <span className="text-xs text-slate-500 ml-2">({company.companyType})</span>
                          )}
                          {Number.parseInt(selectedParentId) === company.id && (
                            <span className="ml-2 text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                              Selected
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {subsidiaryCompanies.length > 0 && selectedCompanyType === "main-holding" && (
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Companies with this Parent</label>
                  <div className="border rounded-md p-3 bg-slate-50">
                    <ul className="list-disc pl-5 space-y-1">
                      {subsidiaryCompanies.map((company) => (
                        <li key={company.id} className="text-slate-700">
                          {company.name} <span className="text-slate-500 text-sm">(ID: {company.id})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="industry" className="text-sm font-medium text-slate-700">
                  Industry
                </label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="sub-industry" className="text-sm font-medium text-slate-700">
                  Sub-Industry
                </label>
                <Select value={subIndustry} onValueChange={setSubIndustry}>
                  <SelectTrigger id="sub-industry" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="medical-services">Medical Services</SelectItem>
                    <SelectItem value="banking">Banking</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium text-slate-700">
                  Website
                </label>
                <Input
                  id="website"
                  placeholder="https://"
                  className="w-full"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone-no" className="text-sm font-medium text-slate-700">
                  Phone No.
                </label>
                <Input id="phone-no" className="w-full" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
              </div>

              <div className="space-y-2 col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Address
                </label>
                <Input id="address" className="w-full" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label htmlFor="postcode" className="text-sm font-medium text-slate-700">
                  Postcode
                </label>
                <Input
                  id="postcode"
                  className="w-full"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-slate-700">
                  City
                </label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger id="city" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                    <SelectItem value="penang">Penang</SelectItem>
                    <SelectItem value="johor-bahru">Johor Bahru</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium text-slate-700">
                  State
                </label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selangor">Selangor</SelectItem>
                    <SelectItem value="perak">Perak</SelectItem>
                    <SelectItem value="johor">Johor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium text-slate-700">
                  Country
                </label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="malaysia">Malaysia</SelectItem>
                    <SelectItem value="singapore">Singapore</SelectItem>
                    <SelectItem value="brunei">Brunei</SelectItem>
                    <SelectItem value="indonesia">Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleNext}>
                Save
              </Button>
              <Button variant="outline">Reset</Button>
            </div>
          </div>
        )}

        {currentStep === "contact-details" && (
          <ContactDetailsForm
            onNext={handleNext}
            onBack={handlePrevious}
            contacts={contacts}
            setContacts={setContacts}
          />
        )}

        {currentStep === "operational" && (
          <OperationalSegmentationForm
            onNext={handleNext}
            onBack={handlePrevious}
            initialData={operationalSegmentation}
            onSaveData={setOperationalSegmentation}
          />
        )}

        {currentStep === "job-grade" && (
          <JobGradeForm onNext={handleNext} onBack={handlePrevious} initialData={jobGrade} onSaveData={setJobGrade} />
        )}

        {currentStep === "report-frequency" && (
          <ReportFrequencyForm
            onNext={handleNext}
            onBack={handlePrevious}
            initialData={reportFrequency}
            onSaveData={setReportFrequency}
          />
        )}

        {currentStep === "medical-provider" && (
          <MedicalProviderForm
            onNext={handleNext}
            onBack={handlePrevious}
            initialData={medicalProvider}
            onSaveData={setMedicalProvider}
          />
        )}

        {currentStep === "financial-arrangement" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Financial Arrangement</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="payment-terms" className="text-sm font-medium text-slate-700">
                  Payment Terms
                </label>
                <Select>
                  <SelectTrigger id="payment-terms" className="w-full">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                    <SelectItem value="net-45">Net 45</SelectItem>
                    <SelectItem value="net-60">Net 60</SelectItem>
                    <SelectItem value="net-90">Net 90</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="billing-frequency" className="text-sm font-medium text-slate-700">
                  Billing Frequency
                </label>
                <Select>
                  <SelectTrigger id="billing-frequency" className="w-full">
                    <SelectValue placeholder="Select billing frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annually">Semi-annually</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium text-slate-700">
                  Currency
                </label>
                <Select>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="myr">MYR - Malaysian Ringgit</SelectItem>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="sgd">SGD - Singapore Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="credit-limit" className="text-sm font-medium text-slate-700">
                  Credit Limit
                </label>
                <Input id="credit-limit" className="w-full" placeholder="Enter credit limit" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Block to Accounting</label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="block-yes"
                      name="block-accounting"
                      value="yes"
                      className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                    />
                    <label htmlFor="block-yes" className="text-sm text-slate-700">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="block-no"
                      name="block-accounting"
                      value="no"
                      defaultChecked
                      className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                    />
                    <label htmlFor="block-no" className="text-sm text-slate-700">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label htmlFor="special-terms" className="text-sm font-medium text-slate-700">
                  Special Terms & Conditions
                </label>
                <Textarea
                  id="special-terms"
                  className="w-full min-h-[120px]"
                  placeholder="Enter any special financial terms or conditions"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleNext}>
                Save
              </Button>
            </div>
          </div>
        )}

        {currentStep === "sob" && (
          <SOBForm onNext={handleNext} onBack={handlePrevious} initialData={sob} onSaveData={setSob} />
        )}

        {currentStep === "history" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">History</h3>

            {/* Contract History section */}
            <div className="mb-8 border rounded-md overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b">
                <h4 className="font-medium text-slate-800">Contract History</h4>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 px-4 font-medium text-slate-600">No.</th>
                        <th className="py-2 px-4 font-medium text-slate-600">Contract Start</th>
                        <th className="py-2 px-4 font-medium text-slate-600">Contract End</th>
                        <th className="py-2 px-4 font-medium text-slate-600">Status</th>
                        <th className="py-2 px-4 font-medium text-slate-600">Modified By</th>
                        <th className="py-2 px-4 font-medium text-slate-600">Modified Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractHistory.length > 0 ? (
                        contractHistory.map((record, index) => (
                          <tr key={record.id} className="border-b">
                            <td className="py-3 px-4 text-slate-800">{index + 1}</td>
                            <td className="py-3 px-4 text-slate-800">{formatDate(record.startDate)}</td>
                            <td className="py-3 px-4 text-slate-800">{formatDate(record.endDate)}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  record.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "Completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-800">{record.modifiedBy}</td>
                            <td className="py-3 px-4 text-slate-800">{formatDate(record.modifiedDate)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-4 px-4 text-center text-slate-500">
                            No contract history records available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => setShowConfirmDialog(true)}>
                Save
              </Button>
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm New Company</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to add this new company?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSaveConfirm} className="bg-sky-600 hover:bg-sky-700">
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  )
}
