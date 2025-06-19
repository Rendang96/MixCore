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
import { FinancialArrangementForm } from "@/components/company/financial-arrangement-form"
import { Textarea } from "@/components/ui/textarea"
import { addCompany } from "@/lib/company/company-storage"
import { PayorForm } from "@/components/company/payor-form"

// Add the following functions and constants before the NewCompanyForm component definition

type FormStep =
  | "company-info"
  | "contact-details"
  | "operational"
  | "job-grade"
  | "report-frequency"
  | "medical-provider"
  | "financial-arrangement"
  | "payor"
  | "sob"
  | "history"
  | "summary"

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
  const [operationalSegmentation, setOperationalSegmentation] = useState<any[]>([])
  const [jobGrade, setJobGrade] = useState<JobGradeSet[]>([])
  const [reportFrequency, setReportFrequency] = useState<any[]>([])
  const [medicalProvider, setMedicalProvider] = useState<any[]>([])
  const [financialArrangement, setFinancialArrangement] = useState<any[]>([])
  const [payor, setPayor] = useState<any[]>([])
  const [sob, setSob] = useState<any>(null)
  const [country, setCountry] = useState<string>("")

  // State for contact details
  const [contacts, setContacts] = useState<Contact[]>([])

  // Initialize with a single active contract history record that inherits from form data
  const [contractHistory, setContractHistory] = useState<ContractHistoryRecord[]>([
    {
      id: 1,
      startDate: "", // Will be updated when contractStart changes
      endDate: "", // Will be updated when contractEnd changes
      status: "Active",
      modifiedBy: "System",
      modifiedDate: new Date().toISOString().split("T")[0], // Today's date
    },
  ])

  // Function to reset all form state
  const resetAllFormData = () => {
    setCompanyName("")
    setCompanyCode("")
    setSelectedStatus("active")
    setRegistrationNo("")
    setGstSstRegNo("")
    setTinNo("")
    setTinEmail("")
    setProgramType("")
    setIndustry("")
    setSubIndustry("")
    setWebsite("")
    setPhoneNo("")
    setAddress("")
    setPostcode("")
    setCity("")
    setState("")
    setCountry("")
    setJoiningDate("")
    setContractStart("")
    setContractEnd("")
    setSelectedCompanyType("")
    setSelectedParentId("")
    setHierarchyLevel("")
    setSubsidiaries("")
    setContacts([])
    setOperationalSegmentation([])
    setJobGrade([])
    setReportFrequency([])
    setMedicalProvider([])
    setFinancialArrangement([])
    setPayor([])
    setSob(null)
    setContractHistory([
      {
        id: 1,
        startDate: "",
        endDate: "",
        status: "Active",
        modifiedBy: "System",
        modifiedDate: new Date().toISOString().split("T")[0],
      },
    ])
  }

  // Clear all form data when component mounts (for new company creation)
  useEffect(() => {
    // Clear all localStorage data for company form - comprehensive list
    localStorage.removeItem("company_form_draft")
    localStorage.removeItem("company-contacts")
    localStorage.removeItem("company-operational-segmentation")
    localStorage.removeItem("operational_structures")
    localStorage.removeItem("company-job-grade")
    localStorage.removeItem("company-report-configs")
    localStorage.removeItem("company-report-frequency")
    localStorage.removeItem("company-medical-provider")
    localStorage.removeItem("medicalProviderConfigs")
    localStorage.removeItem("company-financial-arrangement")
    localStorage.removeItem("company-payor")
    localStorage.removeItem("company-sob")
    localStorage.removeItem("company-contract-history")

    // Reset all form state
    resetAllFormData()
  }, []) // Empty dependency array means this runs only once when component mounts

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
    // Notify parent component when step changes
    if (onStepChange) {
      onStepChange(currentStep)
    }
  }, [currentStep, onStepChange])

  // Update contract history when contract start/end dates change
  useEffect(() => {
    if (contractStart || contractEnd) {
      setContractHistory((prevHistory) => {
        const updatedHistory = [...prevHistory]
        if (updatedHistory.length > 0) {
          updatedHistory[0] = {
            ...updatedHistory[0],
            startDate: contractStart || updatedHistory[0].startDate,
            endDate: contractEnd || updatedHistory[0].endDate,
            modifiedDate: new Date().toISOString().split("T")[0], // Update modified date when contract dates change
          }
        }
        return updatedHistory
      })
    }
  }, [contractStart, contractEnd])

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
    } else if (step === "payor") {
      window.history.pushState({}, "", "/company/add/payor")
    } else if (step === "sob") {
      window.history.pushState({}, "", "/company/add/sob")
    } else if (step === "history") {
      window.history.pushState({}, "", "/company/add/history")
    } else if (step === "summary") {
      window.history.pushState({}, "", "/company/add/summary")
    }
  }

  const handleNext = () => {
    if (currentStep === "company-info") {
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
      setCurrentStep("payor")
      window.history.pushState({}, "", "/company/add/payor")
    } else if (currentStep === "payor") {
      setCurrentStep("sob")
      window.history.pushState({}, "", "/company/add/sob")
    } else if (currentStep === "sob") {
      setCurrentStep("history")
      window.history.pushState({}, "", "/company/add/history")
    } else if (currentStep === "history") {
      setCurrentStep("summary")
      window.history.pushState({}, "", "/company/add/summary")
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
    } else if (currentStep === "payor") {
      setCurrentStep("financial-arrangement")
      window.history.pushState({}, "", "/company/add/financial_arrangement")
    } else if (currentStep === "sob") {
      setCurrentStep("payor")
      window.history.pushState({}, "", "/company/add/payor")
    } else if (currentStep === "history") {
      setCurrentStep("sob")
      window.history.pushState({}, "", "/company/add/sob")
    } else if (currentStep === "summary") {
      setCurrentStep("history")
      window.history.pushState({}, "", "/company/add/history")
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
      ...(financialArrangement.length > 0 && { financialArrangement }),
      ...(payor.length > 0 && { payor }),
      ...(sob && { sob }),
      // The following fields will only be included if they have been populated by the user
      // through their respective form components
      // These will be added by the respective form components and stored in local storage
    }
  }

  const handleSaveConfirm = () => {
    setShowConfirmDialog(false)

    // Collect form data
    const formData = collectFormData()

    // Add completion status as completed
    const completedCompanyData = {
      ...formData,
      completionStatus: "Completed",
    }

    // Save the company data to local storage
    addCompany(completedCompanyData)

    // Save the complete company data
    if (onSave) {
      onSave(completedCompanyData)
    }

    // Navigate back to the company search page
    onBack()

    console.log("Company saved successfully:", completedCompanyData)
  }

  const handleSaveAsDraft = () => {
    // Collect form data
    const formData = collectFormData()

    // Add completion status as draft
    const draftCompanyData = {
      ...formData,
      completionStatus: "Draft",
    }

    // Save the company data to local storage as a draft record
    addCompany(draftCompanyData)

    // Save the complete company data
    if (onSave) {
      onSave(draftCompanyData)
    }

    // Navigate back to the company search page
    onBack()

    console.log("Company saved as draft:", draftCompanyData)
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
      "payor",
      "sob",
      "history",
      "summary",
    ]
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (step === currentStep) return "current" // Blue
    if (stepIndex < currentIndex) return "completed" // Green
    return "pending" // Gray
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to format service type for display
  const formatServiceType = (type: string): string => {
    if (!type) return "Not specified"

    const typeMap: { [key: string]: string } = {
      gp: "GP",
      sp: "SP",
      oc: "OC",
      dt: "DT",
      hp: "HP",
      mt: "MT",
    }

    if (type.includes(", ")) {
      return type
        .split(", ")
        .map((t) => typeMap[t] || t.toUpperCase())
        .join(", ")
    }

    return typeMap[type] || type.toUpperCase()
  }

  // Helper function to format panelship for display
  const formatPanelship = (panelship: string): string => {
    if (!panelship) return "Not specified"

    const panelshipMap: { [key: string]: string } = {
      all: "All",
      panel: "Panel",
      select_access: "Select Access",
      provider_group: "Provider Group", // Added for the new feature
    }

    return panelshipMap[panelship] || panelship
  }

  // Helper function to format provider type for display
  const formatProviderType = (type: string): string => {
    if (!type) return "Not specified"

    const typeMap: { [key: string]: string } = {
      all: "All",
      government: "Government",
      semi_government: "Semi-Government",
      private: "Private",
      corporatised: "Corporatised",
    }

    if (type.includes(", ")) {
      return type
        .split(", ")
        .map((t) => typeMap[t] || t)
        .join(", ")
    }

    return typeMap[type] || type
  }

  // Helper function to format payment method for display
  const formatPaymentMethod = (method: string): string => {
    if (!method) return "Not specified"

    const methodMap: { [key: string]: string } = {
      cashless: "Cashless",
      pay_and_claim: "Pay and Claim",
      both: "Both",
    }

    return methodMap[method] || method
  }

  // Helper function to format access rule for display
  const formatAccessRule = (rule: string): string => {
    if (!rule) return "Not specified"

    const ruleMap: { [key: string]: string } = {
      "direct-access": "Direct Access",
      referral: "Referral",
      gl: "GL",
    }

    return ruleMap[rule] || rule
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
    <div className="space-y-6">
      {/* Page header with title and back button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Company Information</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Listing
        </Button>
      </div>

      {/* Horizontal step navigation */}
      <div className="bg-gray-50 py-4 px-4 rounded-md border relative">
        {/* Horizontal line connecting the bullets */}
        <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

        {/* Wrap all step bullets and text in a single flex container */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          {/* Step 1: Company Info */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("company-info")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("company-info") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("company-info") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              1
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("company-info") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("company-info") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Company Info
            </span>
          </div>

          {/* Step 2: Contact Details */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("contact-details")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("contact-details") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("contact-details") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              2
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("contact-details") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("contact-details") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Contact Details
            </span>
          </div>

          {/* Step 3: Operational Segmentation */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("operational")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("operational") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("operational") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              3
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("operational") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("operational") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Operational Segmentation
            </span>
          </div>

          {/* Step 4: Job Category */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("job-grade")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("job-grade") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("job-grade") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              4
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("job-grade") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("job-grade") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Job Category
            </span>
          </div>

          {/* Step 5: Report Frequency */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("report-frequency")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("report-frequency") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("report-frequency") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              5
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("report-frequency") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("report-frequency") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Report Frequency
            </span>
          </div>

          {/* Step 6: Medical Provider */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("medical-provider")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("medical-provider") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("medical-provider") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              6
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("medical-provider") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("medical-provider") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Medical Provider
            </span>
          </div>

          {/* Step 7: Financial Arrangement */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("financial-arrangement")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("financial-arrangement") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("financial-arrangement") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              7
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("financial-arrangement") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("financial-arrangement") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Financial Arrangement
            </span>
          </div>

          {/* Step 8: Payor */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("payor")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("payor") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("payor") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              8
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("payor") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("payor") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Payor
            </span>
          </div>

          {/* Step 9: SOB */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("sob")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("sob") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("sob") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              9
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("sob") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("sob") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              SOB
            </span>
          </div>

          {/* Step 10: History */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("history")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("history") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("history") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              10
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("history") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("history") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              History
            </span>
          </div>

          {/* Step 11: Summary */}
          <div
            className="flex flex-col items-center text-center cursor-pointer px-2"
            onClick={() => handleStepClick("summary")}
          >
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full mb-1
          ${
            getStepStatus("summary") === "current"
              ? "bg-sky-600 text-white"
              : getStepStatus("summary") === "completed"
                ? "bg-green-500 text-white"
                : "bg-slate-300 text-slate-700"
          } font-medium text-sm`}
            >
              11
            </div>
            <span
              className={`text-sm whitespace-nowrap
          ${
            getStepStatus("summary") === "current"
              ? "font-medium text-sky-600"
              : getStepStatus("summary") === "completed"
                ? "font-medium text-green-500"
                : "text-slate-600"
          }`}
            >
              Summary
            </span>
          </div>
        </div>
      </div>

      {/* Main form content area */}
      <div className="bg-white p-6 rounded-md border">
        {currentStep === "company-info" && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Company Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {" "}
              {/* Changed from grid-cols-2 to grid-cols-3 */}
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
              <div className="space-y-2 col-span-full">
                {" "}
                {/* This field spans all columns */}
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
                <div className="space-y-2 col-span-full">
                  {" "}
                  {/* This field spans all columns */}
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
                <div className="space-y-2 col-span-full">
                  {" "}
                  {/* This field spans all columns */}
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
              <div className="space-y-2 col-span-full">
                {" "}
                {/* This field spans all columns */}
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
          <FinancialArrangementForm
            onNext={handleNext}
            onBack={handlePrevious}
            initialData={financialArrangement}
            onSaveData={setFinancialArrangement}
          />
        )}

        {currentStep === "payor" && (
          <PayorForm onNext={handleNext} onBack={handlePrevious} initialData={payor} onSaveData={setPayor} />
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
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === "summary" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Summary</h3>
            <p className="text-slate-600 mb-6">Review all the information you've entered for this company setup.</p>

            {/* Company Information Summary */}
            <div className="space-y-6">
              {/* Company Details */}
              <div className="border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-red-500 pl-4">
                  Company Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-slate-600">Company Name:</span>
                    <p className="text-slate-800">{companyName || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Company Code:</span>
                    <p className="text-slate-800">{companyCode || "Not generated"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Status:</span>
                    <p className="text-slate-800 capitalize">{selectedStatus || "Not selected"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Company Type:</span>
                    <p className="text-slate-800">
                      {selectedCompanyType === "main-holding"
                        ? "Main Holding"
                        : selectedCompanyType === "subsidiary"
                          ? "Subsidiary"
                          : selectedCompanyType === "independent"
                            ? "Independent"
                            : "Not selected"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Registration No:</span>
                    <p className="text-slate-800">{registrationNo || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Industry:</span>
                    <p className="text-slate-800 capitalize">{industry || "Not selected"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Joining Date:</span>
                    <p className="text-slate-800">{formatDate(joiningDate)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Contract Period:</span>
                    <p className="text-slate-800">
                      {contractStart && contractEnd
                        ? `${formatDate(contractStart)} - ${formatDate(contractEnd)}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              {contacts.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-blue-500 pl-4">
                    Contact Details
                  </h4>
                  <div className="space-y-3">
                    {contacts.map((contact, index) => (
                      <div key={index} className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">{contact.name}</p>
                        <p className="text-sm text-slate-600">
                          Contact Function: {contact.function || "Not specified"}
                        </p>
                        <p className="text-sm text-slate-600">
                          Designation: {contact.position || contact.designation || "Not specified"}
                        </p>
                        <p className="text-sm text-slate-600">E-mail: {contact.email || "Not specified"}</p>
                        <p className="text-sm text-slate-600">Phone: {contact.phone || "Not specified"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operational Segmentation - Enhanced Display */}
              {operationalSegmentation.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-green-500 pl-4">
                    Operational Segmentation
                  </h4>
                  <div className="space-y-4">
                    {operationalSegmentation.map((structure, index) => (
                      <div key={index} className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">{structure.name || `Structure ${index + 1}`}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Structure Code:</span> {structure.code || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Structure Type:</span> {structure.type || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Status:</span> {structure.status || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Parent Structure:</span>{" "}
                              {structure.parentStructure || "None"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Address:</span> {structure.address || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">City:</span> {structure.city || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">State:</span> {structure.state || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Country:</span> {structure.country || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Postcode:</span> {structure.postcode || "Not specified"}
                            </p>
                          </div>
                        </div>
                        {structure.remarks && (
                          <div className="mt-2">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Remarks:</span> {structure.remarks}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Categories */}
              {jobGrade.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-purple-500 pl-4">
                    Job Categories
                  </h4>
                  <div className="space-y-4">
                    {jobGrade.map((jobSet, index) => (
                      <div key={index} className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">
                          {jobSet.category === "job-grade"
                            ? "Job Grade"
                            : jobSet.category === "designation"
                              ? "Designation"
                              : jobSet.category === "employment-type"
                                ? "Employment Type"
                                : jobSet.category === "staff-category"
                                  ? "Staff Category"
                                  : jobSet.category || `Job Grade Set ${index + 1}`}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Category:</span>{" "}
                              {jobSet.category === "job-grade"
                                ? "Job Grade"
                                : jobSet.category === "designation"
                                  ? "Designation"
                                  : jobSet.category === "employment-type"
                                    ? "Employment Type"
                                    : jobSet.category === "staff-category"
                                      ? "Staff Category"
                                      : jobSet.category || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Total Grades:</span>{" "}
                              {jobSet.grades ? jobSet.grades.filter((grade) => grade.trim() !== "").length : 0}
                            </p>
                          </div>
                        </div>
                        {jobSet.grades && jobSet.grades.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-slate-600">Grades:</p>
                            <div className="mt-1">
                              <p className="text-sm text-slate-700">
                                {jobSet.grades.filter((grade) => grade.trim() !== "").join(", ") ||
                                  "No grades specified"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Frequency */}
              {reportFrequency.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-orange-500 pl-4">
                    Report Frequency
                  </h4>
                  <div className="space-y-4">
                    {reportFrequency.map((config, index) => (
                      <div key={index} className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">{config.reportType || `Report ${index + 1}`}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Frequency:</span>{" "}
                              {config.reportFrequency || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Delivery Method:</span>{" "}
                              {config.deliveryMethod || "Not specified"}
                            </p>
                          </div>
                        </div>
                        {config.recipients && config.recipients.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-slate-600">Recipients:</p>
                            <div className="mt-1">
                              {config.recipients.map((recipient, recIndex) => (
                                <p key={recIndex} className="text-sm text-slate-700">
                                  • {recipient.name} ({recipient.email})
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Provider */}
              {medicalProvider.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-teal-500 pl-4">
                    Medical Provider
                  </h4>
                  <div className="space-y-4">
                    {medicalProvider.map((provider, index) => (
                      <div key={index} className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">{provider.name || `Provider ${index + 1}`}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Service Type:</span>{" "}
                              {formatServiceType(provider.serviceType)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Panelship:</span> {formatPanelship(provider.panelship)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Provider Type:</span>{" "}
                              {formatProviderType(provider.providerType)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Payment Method:</span>{" "}
                              {formatPaymentMethod(provider.paymentMethod)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Access Rule:</span> {formatAccessRule(provider.accessRule)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Status:</span> {provider.status || "Not specified"}
                            </p>
                          </div>
                        </div>
                        {provider.remarks && (
                          <div className="mt-2">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Remarks:</span> {provider.remarks}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Arrangement */}
              {financialArrangement.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-indigo-500 pl-4">
                    Financial Arrangement
                  </h4>
                  <div className="space-y-4">
                    {/* TPA Fees Section */}
                    {financialArrangement[0] && (
                      <div className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">TPA Fees</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Payment Term:</span>{" "}
                              {financialArrangement[0].paymentTerm || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Credit Term (Days):</span>{" "}
                              {financialArrangement[0].paymentTerms || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Billing Frequency:</span>{" "}
                              {financialArrangement[0].billingFrequency || "Not specified"}
                            </p>
                          </div>
                        </div>
                        {financialArrangement[0].specialTerms && (
                          <div className="mt-2">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Special Terms & Conditions:</span>{" "}
                              {financialArrangement[0].specialTerms}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Medical Claims Section */}
                    {financialArrangement[1] && (
                      <div className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">Medical Claims</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Credit Term (Days):</span>{" "}
                              {financialArrangement[1].paymentTerms || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Billing Frequency:</span>{" "}
                              {financialArrangement[1].billingFrequency || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Float:</span>{" "}
                              {financialArrangement[1].float || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Block to Accounting:</span>{" "}
                              {financialArrangement[1].blockToAccounting === true
                                ? "Yes"
                                : financialArrangement[1].blockToAccounting === false
                                  ? "No"
                                  : "Not specified"}
                            </p>
                          </div>
                        </div>
                        {financialArrangement[1].specialTerms && (
                          <div className="mt-2">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Special Terms & Conditions:</span>{" "}
                              {financialArrangement[1].specialTerms}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payor */}
              {payor.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-pink-500 pl-4">
                    Payor
                  </h4>
                  <div className="space-y-4">
                    {payor.map((payorItem, index) => (
                      <div key={index} className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">{payorItem.name || `Payor ${index + 1}`}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Payor Code:</span> {payorItem.code || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Type:</span> {payorItem.type || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Status:</span> {payorItem.status || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Contact Person:</span>{" "}
                              {payorItem.contactPerson || "Not specified"}
                            </p>
                          </div>
                        </div>
                        {payorItem.address && (
                          <div className="mt-2">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Address:</span> {payorItem.address}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule of Benefits (SOB) */}
              {sob && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-yellow-500 pl-4">
                    Schedule of Benefits (SOB)
                  </h4>
                  <div className="border-l-4 border-sky-200 pl-4">
                    <p className="font-medium text-slate-800">{sob.sobName || "SOB Configuration"}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">SOB Code:</span> {sob.sobCode || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Version:</span> {sob.version || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Effective Date:</span> {formatDate(sob.effectiveDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Expiry Date:</span> {formatDate(sob.expiryDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Status:</span> {sob.status || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Document Type:</span> {sob.documentType || "Not specified"}
                        </p>
                      </div>
                    </div>
                    {sob.description && (
                      <div className="mt-2">
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Description:</span> {sob.description}
                        </p>
                      </div>
                    )}
                    {sob.uploadedFile && (
                      <div className="mt-2">
                        <p className="text-sm text-slate-600">
                          <span className="font-medium">Uploaded Document:</span> {sob.uploadedFile.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contract History */}
              {contractHistory.length > 0 && (
                <div className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-l-4 border-gray-500 pl-4">
                    Contract History
                  </h4>
                  <div className="space-y-4">
                    {contractHistory.map((record, index) => (
                      <div key={record.id} className="border-l-4 border-sky-200 pl-4">
                        <p className="font-medium text-slate-800">Contract Record {index + 1}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Contract Start:</span> {formatDate(record.startDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Contract End:</span> {formatDate(record.endDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Status:</span>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  record.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "Completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {record.status}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Modified By:</span> {record.modifiedBy}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Modified Date:</span> {formatDate(record.modifiedDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button variant="outline" onClick={handleSaveAsDraft}>
                Save as Draft
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowConfirmDialog(true)}>
                Save Company
              </Button>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Confirm Save</h3>
                  <p className="text-slate-600 mb-6">
                    Are you sure you want to save this company configuration? This will create a new company record.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveConfirm}>
                      Confirm Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
