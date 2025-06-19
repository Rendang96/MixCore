"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { FileText, Mail, Calendar, User } from "lucide-react"

// Add this constant and function before the ViewCompany component
const COMPANY_FORM_STORAGE_KEY = "company_form_draft"

const loadOperationalSegmentationFromLocalStorage = (company: any) => {
  try {
    console.log("Attempting to load operational segmentation data for company ID:", company.id)

    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return operational segmentation data if available
      if (parsedData.operationalSegmentation) {
        console.log("Found operational segmentation in form draft:", parsedData.operationalSegmentation)
        return parsedData.operationalSegmentation
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.operationalSegmentation) {
        console.log("Found operational segmentation in company data:", currentCompany.operationalSegmentation)
        return currentCompany.operationalSegmentation
      }
    }

    console.log("No operational segmentation data found in local storage")
    return null
  } catch (error) {
    console.error("Error loading operational segmentation data from local storage:", error)
    return null
  }
}

// Add this function to load job grade data from localStorage
const loadJobGradeFromLocalStorage = (company: any) => {
  try {
    console.log("Attempting to load job grade data for company ID:", company.id)

    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return job grade data if available
      if (parsedData.jobGrade) {
        console.log("Found job grade in form draft:", parsedData.jobGrade)
        return parsedData.jobGrade
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.jobGrade) {
        console.log("Found job grade in company data:", currentCompany.jobGrade)
        return currentCompany.jobGrade
      }
    }

    console.log("No job grade data found in local storage")
    return null
  } catch (error) {
    console.error("Error loading job grade data from local storage:", error)
    return null
  }
}

// Add this function to load report frequency data from localStorage
const loadReportFrequencyFromLocalStorage = (company: any) => {
  try {
    console.log("Attempting to load report frequency data for company ID:", company.id)

    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return report frequency data if available
      if (parsedData.reportFrequency) {
        console.log("Found report frequency in form draft:", parsedData.reportFrequency)
        return parsedData.reportFrequency
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.reportFrequency) {
        console.log("Found report frequency in company data:", currentCompany.reportFrequency)
        return currentCompany.reportFrequency
      }
    }

    console.log("No report frequency data found in local storage")
    return null
  } catch (error) {
    console.error("Error loading report frequency data from local storage:", error)
    return null
  }
}

// Add this function after the other loading functions (around line 100)
const loadMedicalProviderFromLocalStorage = (company: any) => {
  try {
    console.log("Attempting to load medical provider data for company ID:", company.id)

    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return medical provider data if available
      if (parsedData.medicalProvider) {
        console.log("Found medical provider in form draft:", parsedData.medicalProvider)
        return parsedData.medicalProvider
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.medicalProvider) {
        console.log("Found medical provider in company data:", currentCompany.medicalProvider)
        return currentCompany.medicalProvider
      }
    }

    console.log("No medical provider data found in local storage")
    return null
  } catch (error) {
    console.error("Error loading medical provider data from local storage:", error)
    return null
  }
}

// Add this function to load SOB data from localStorage
const loadSOBFromLocalStorage = (company: any) => {
  try {
    console.log("Attempting to load SOB data for company ID:", company.id)

    // First try to get from company_form_draft
    const savedData = localStorage.getItem(COMPANY_FORM_STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      // Return SOB data if available
      if (parsedData.sob) {
        console.log("Found SOB in form draft:", parsedData.sob)
        return parsedData.sob
      }
    }

    // If not found in draft, try to get from the companies storage
    const companies = localStorage.getItem("companies")
    if (companies) {
      const parsedCompanies = JSON.parse(companies)
      // Find the current company by ID
      const currentCompany = parsedCompanies.find((c: any) => c.id === company.id)
      if (currentCompany && currentCompany.sob) {
        console.log("Found SOB in company data:", currentCompany.sob)
        return currentCompany.sob
      }
    }

    console.log("No SOB data found in local storage")
    return null
  } catch (error) {
    console.error("Error loading SOB data from local storage:", error)
    return null
  }
}

// Helper function to format category name
const formatCategoryName = (category: string) => {
  switch (category) {
    case "job-grade":
      return "Job Grade"
    case "job-level":
      return "Job Level"
    case "designation":
      return "Designation"
    case "employment-type":
      return "Employment Type"
    case "staff-category":
      return "Staff Category"
    default:
      return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
  }
}

// Helper function to get icon for report type
const getReportTypeIcon = (reportType: string) => {
  switch (reportType) {
    case "utilization":
      return <FileText className="h-4 w-4 text-sky-600" />
    case "claims":
      return <FileText className="h-4 w-4 text-green-600" />
    case "membership":
      return <User className="h-4 w-4 text-purple-600" />
    case "financial":
      return <FileText className="h-4 w-4 text-amber-600" />
    default:
      return <FileText className="h-4 w-4 text-gray-600" />
  }
}

// Helper function to get icon for delivery method
const getDeliveryMethodIcon = (method: string) => {
  switch (method) {
    case "email":
      return <Mail className="h-4 w-4 text-blue-600" />
    case "portal":
      return <FileText className="h-4 w-4 text-green-600" />
    case "physical":
      return <FileText className="h-4 w-4 text-amber-600" />
    default:
      return <FileText className="h-4 w-4 text-gray-600" />
  }
}

// Helper function to get icon for frequency
const getFrequencyIcon = (frequency: string) => {
  switch (frequency) {
    case "monthly":
      return <Calendar className="h-4 w-4 text-blue-600" />
    case "quarterly":
      return <Calendar className="h-4 w-4 text-green-600" />
    case "annually":
      return <Calendar className="h-4 w-4 text-amber-600" />
    default:
      return <Calendar className="h-4 w-4 text-gray-600" />
  }
}

interface ViewCompanyProps {
  company: {
    id: number
    name: string
    code: string
    status: string
    registrationNo: string
    companyType: string
    parentCompany: string
    hierarchyLevel: string
    subsidiaries: number
    joiningDate?: string
    contractStart?: string
    contractEnd?: string
    contacts?: any[]
    operationalSegmentation?: any
    jobGrade?: any
    reportFrequency?: any
    medicalProvider?: any
    sob?: any
    industry?: string
    subIndustry?: string
    website?: string
    phoneNo?: string
    gstSstRegNo?: string
    tinNo?: string
    programType?: string
    contractHistory?: any[]
  }
  onBack: () => void
  onUpdate?: () => void
  initialStep?: string
  onStepChange?: (step: string) => void
}

type ViewSection =
  | "company-info"
  | "contact-details"
  | "operational"
  | "job-grade"
  | "report-frequency"
  | "medical-provider"
  | "financial-arrangement"
  | "sob"
  | "history"

export function ViewCompany({
  company,
  onBack,
  onUpdate,
  initialStep = "company-info",
  onStepChange,
}: ViewCompanyProps) {
  const [currentStep, setCurrentStep] = useState<ViewSection>(initialStep as ViewSection)
  const [operationalSegmentationData, setOperationalSegmentationData] = useState<any>(null)
  // Inside the ViewCompany component, add this state:
  const [jobGradeData, setJobGradeData] = useState<any>(null)
  const [reportFrequencyData, setReportFrequencyData] = useState<any>(null)
  // Add this state with the other state declarations (around line 200)
  const [medicalProviderData, setMedicalProviderData] = useState<any>(null)
  const [sobData, setSobData] = useState<any>(null)

  // Load operational segmentation data from local storage when component mounts
  useEffect(() => {
    console.log("Loading operational segmentation data for company ID:", company.id)
    const localStorageData = loadOperationalSegmentationFromLocalStorage(company)
    if (localStorageData) {
      console.log("Setting operational segmentation data from local storage:", localStorageData)
      setOperationalSegmentationData(localStorageData)
    } else if (company.operationalSegmentation) {
      console.log("Using company props for operational segmentation:", company.operationalSegmentation)
      setOperationalSegmentationData(company.operationalSegmentation)
    } else {
      console.log("No operational segmentation data found")
    }
  }, [company.id, company.operationalSegmentation, company])

  // Add this useEffect to load job grade data:
  useEffect(() => {
    console.log("Loading job grade data for company ID:", company.id)
    const localStorageData = loadJobGradeFromLocalStorage(company)
    if (localStorageData) {
      console.log("Setting job grade data from local storage:", localStorageData)
      setJobGradeData(localStorageData)
    } else if (company.jobGrade) {
      console.log("Using company props for job grade:", company.jobGrade)
      setJobGradeData(company.jobGrade)
    } else {
      console.log("No job grade data found")
    }
  }, [company.id, company.jobGrade, company])

  // Add this useEffect to load report frequency data:
  useEffect(() => {
    console.log("Loading report frequency data for company ID:", company.id)
    const localStorageData = loadReportFrequencyFromLocalStorage(company)
    if (localStorageData) {
      console.log("Setting report frequency data from local storage:", localStorageData)
      setReportFrequencyData(localStorageData)
    } else if (company.reportFrequency) {
      console.log("Using company props for report frequency:", company.reportFrequency)
      setReportFrequencyData(company.reportFrequency)
    } else {
      console.log("No report frequency data found")
    }
  }, [company.id, company.reportFrequency, company])

  // Add this useEffect with the other useEffect hooks (around line 240)
  // Add this useEffect to load medical provider data:
  useEffect(() => {
    console.log("Loading medical provider data for company ID:", company.id)
    const localStorageData = loadMedicalProviderFromLocalStorage(company)
    if (localStorageData) {
      console.log("Setting medical provider data from local storage:", localStorageData)
      setMedicalProviderData(localStorageData)
    } else if (company.medicalProvider) {
      console.log("Using company props for medical provider:", company.medicalProvider)
      setMedicalProviderData(company.medicalProvider)
    } else {
      console.log("No medical provider data found")
    }
  }, [company.id, company.medicalProvider, company])

  // Add this useEffect to load SOB data:
  useEffect(() => {
    console.log("Loading SOB data for company ID:", company.id)
    const localStorageData = loadSOBFromLocalStorage(company)
    if (localStorageData) {
      console.log("Setting SOB data from local storage:", localStorageData)
      setSobData(localStorageData)
    } else if (company.sob) {
      console.log("Using company props for SOB:", company.sob)
      setSobData(company.sob)
    } else {
      console.log("No SOB data found")
    }
  }, [company.id, company.sob, company])

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Helper function to determine step status
  const getStepStatus = (step: ViewSection) => {
    const steps: ViewSection[] = [
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

  // Handle step change
  const handleStepClick = (step: ViewSection) => {
    setCurrentStep(step)
    if (onStepChange) {
      onStepChange(step)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Company Information</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back to Listing
          </Button>
          {onUpdate && (
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={onUpdate}>
              Update
            </Button>
          )}
        </div>
      </div>

      {/* Horizontal step navigation at the top - matching the add company form */}
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

      {/* Main content area */}
      <div className="w-full bg-white">
        {currentStep === "company-info" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Company Information</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Company Name</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.name || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Company Code</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.code || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.status || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">SSM/Registration No.</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.registrationNo || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">GST/SST Reg. No.</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.gstSstRegNo || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">TIN No.</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.tinNo || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Joining Date</label>
                <div className="border rounded-md p-2 bg-gray-50">{formatDate(company.joiningDate)}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Contract Start</label>
                <div className="border rounded-md p-2 bg-gray-50">{formatDate(company.contractStart)}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Contract End</label>
                <div className="border rounded-md p-2 bg-gray-50">{formatDate(company.contractEnd)}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Program Type</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.programType || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Company Type</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.companyType || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Parent Company</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.parentCompany || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Hierarchy Level</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.hierarchyLevel || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Subsidiaries</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.subsidiaries || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Industry</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.industry || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Sub-Industry</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.subIndustry || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Website</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.website || ""}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone No.</label>
                <div className="border rounded-md p-2 bg-gray-50">{company.phoneNo || ""}</div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "contact-details" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Contact Details</h3>

            {company.contacts && company.contacts.length > 0 ? (
              company.contacts.map((contact, index) => (
                <div key={contact.id} className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                  <h3 className="text-lg font-semibold mb-6">Contact {contact.id}</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Contact Name</label>
                      <div className="border rounded-md p-2 bg-gray-50">{contact.name || ""}</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Contact Function</label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        {contact.function === "manager"
                          ? "Manager"
                          : contact.function === "director"
                            ? "Director"
                            : contact.function === "hr"
                              ? "HR"
                              : contact.function === "finance"
                                ? "Finance"
                                : contact.function === "it"
                                  ? "IT"
                                  : contact.function || ""}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Designation</label>
                      <div className="border rounded-md p-2 bg-gray-50">{contact.designation || ""}</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">E-mail</label>
                      <div className="border rounded-md p-2 bg-gray-50">{contact.email || ""}</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Office No.</label>
                      <div className="border rounded-md p-2 bg-gray-50">{contact.officeNo || ""}</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Mobile No.</label>
                      <div className="border rounded-md p-2 bg-gray-50">{contact.mobileNo || ""}</div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium text-slate-700">Remarks</label>
                      <div className="border rounded-md p-2 bg-gray-50 min-h-[60px]">{contact.remarks || ""}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 border rounded-md">No contact details available</div>
            )}
          </div>
        )}

        {currentStep === "operational" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Operational Segmentation</h3>

            {/* Use data from local storage if available, otherwise fall back to company props or default values */}
            {operationalSegmentationData ? (
              // If we have data from local storage, display it
              Array.isArray(operationalSegmentationData) ? (
                // If it's an array (multiple structures), map through them
                operationalSegmentationData.map((structure, index) => (
                  <div key={index} className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                    <h3 className="text-lg font-semibold mb-6">Structure {index + 1}</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      {Object.entries(structure).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                          </label>
                          <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // If it's a single object, display it
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6">Structure 1</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {Object.entries(operationalSegmentationData).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                        <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : company.operationalSegmentation ? (
              // Fall back to company props if no local storage data
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Structure 1</h3>

                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(company.operationalSegmentation).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Default message if no data available
              <div className="text-center py-8 text-slate-500 border rounded-md">
                No operational segmentation data available
              </div>
            )}
          </div>
        )}

        {/* Update the job-grade section to match the form layout */}
        {currentStep === "job-grade" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Job Grade</h3>

            {jobGradeData && jobGradeData.length > 0 ? (
              <div className="space-y-6">
                {jobGradeData.map((gradeSet: any, setIndex: number) => (
                  <div key={setIndex} className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="space-y-6">
                      {setIndex === 0 && (
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Job Category Information</h2>
                      )}

                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-black w-24">Job Category</label>
                        <div className="w-64 border rounded-md p-2 bg-gray-50 text-slate-700">
                          {formatCategoryName(gradeSet.category)}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 flex-grow">
                          {gradeSet.grades.map((grade: string, gradeIndex: number) => (
                            <div key={`${setIndex}-${gradeIndex}`} className="flex items-center gap-3">
                              <span className="text-sm font-medium text-slate-700 w-6">{gradeIndex + 1}</span>
                              <div className="w-full border rounded-md p-2 bg-gray-50">{grade}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border rounded-md">No job grade data available</div>
            )}
          </div>
        )}

        {currentStep === "report-frequency" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Report Frequency</h3>

            {reportFrequencyData && reportFrequencyData.length > 0 ? (
              <div className="space-y-6">
                {reportFrequencyData.map((config: any, index: number) => (
                  <div key={config.id || index} className="rounded-lg border bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Report Configuration {index + 1}</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getReportTypeIcon(config.reportType)}
                          <label className="text-sm font-medium text-slate-700">Report Type</label>
                        </div>
                        <div className="border rounded-md p-2 bg-gray-50">
                          {config.reportType === "utilization"
                            ? "Utilization Report"
                            : config.reportType === "claims"
                              ? "Claims Report"
                              : config.reportType === "membership"
                                ? "Membership Report"
                                : config.reportType === "financial"
                                  ? "Financial Report"
                                  : config.reportType || ""}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getFrequencyIcon(config.reportFrequency)}
                          <label className="text-sm font-medium text-slate-700">Report Frequency</label>
                        </div>
                        <div className="border rounded-md p-2 bg-gray-50">
                          {config.reportFrequency === "monthly"
                            ? "Monthly"
                            : config.reportFrequency === "quarterly"
                              ? "Quarterly"
                              : config.reportFrequency === "annually"
                                ? "Annually"
                                : config.reportFrequency || ""}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getDeliveryMethodIcon(config.deliveryMethod)}
                          <label className="text-sm font-medium text-slate-700">Delivery Method</label>
                        </div>
                        <div className="border rounded-md p-2 bg-gray-50">
                          {config.deliveryMethod === "email"
                            ? "Email"
                            : config.deliveryMethod === "portal"
                              ? "Portal"
                              : config.deliveryMethod === "physical"
                                ? "Physical Copy"
                                : config.deliveryMethod || ""}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Recipients</label>
                        <div className="border rounded-md p-2 bg-gray-50">{config.recipients || ""}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : company.reportFrequency ? (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Report Configuration</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(company.reportFrequency).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border rounded-md">
                No report frequency data available
              </div>
            )}
          </div>
        )}

        {currentStep === "medical-provider" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Medical Provider</h3>

            {medicalProviderData && medicalProviderData.length > 0 ? (
              medicalProviderData.map((provider: any, index: number) => (
                <div key={provider.id || index} className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                  <h4 className="text-lg font-medium text-slate-700 mb-6">Provider {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-8 mb-4">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Service Type</label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        {provider.serviceType === "gp"
                          ? "GP"
                          : provider.serviceType === "sp"
                            ? "SP"
                            : provider.serviceType === "oc"
                              ? "OC"
                              : provider.serviceType === "dt"
                                ? "DT"
                                : provider.serviceType === "hp"
                                  ? "HP"
                                  : provider.serviceType === "mt"
                                    ? "MT"
                                    : provider.serviceType || ""}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Panelship</label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        {provider.panelship === "panel"
                          ? "Panel"
                          : provider.panelship === "non-panel"
                            ? "Non-Panel"
                            : provider.panelship === "both"
                              ? "Both"
                              : provider.panelship || ""}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Provider Type</label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        {provider.providerType === "public"
                          ? "Public"
                          : provider.providerType === "private"
                            ? "Private"
                            : provider.providerType === "semi_private"
                              ? "Semi-Private"
                              : provider.providerType === "corporatised"
                                ? "Corporatised"
                                : provider.providerType || ""}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">State</label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        {provider.state === "selangor"
                          ? "Selangor"
                          : provider.state === "kuala-lumpur"
                            ? "Kuala Lumpur"
                            : provider.state === "penang"
                              ? "Penang"
                              : provider.state === "johor"
                                ? "Johor"
                                : provider.state || ""}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Payment Method</label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        {provider.paymentMethod === "cashless"
                          ? "Cashless"
                          : provider.paymentMethod === "reimbursement"
                            ? "Reimbursement"
                            : provider.paymentMethod === "both"
                              ? "Both"
                              : provider.paymentMethod || ""}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Access Rule</label>
                      <div className="border rounded-md p-2 bg-gray-50">
                        {provider.accessRule === "direct-access"
                          ? "Direct Access"
                          : provider.accessRule === "referral"
                            ? "Referral"
                            : provider.accessRule === "gl"
                              ? "GL"
                              : provider.accessRule || ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : company.medicalProvider ? (
              Array.isArray(company.medicalProvider) ? (
                company.medicalProvider.map((provider, index) => (
                  <div key={index} className="rounded-lg border bg-white p-6 shadow-sm mb-6">
                    <h4 className="text-lg font-medium text-slate-700 mb-6">Provider {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-8 mb-4">
                      {Object.entries(provider).map(([key, value]) => (
                        <div key={key} className="space-y-4">
                          <label className="text-sm font-medium text-slate-700">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                          </label>
                          <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h4 className="text-lg font-medium text-slate-700 mb-6">Provider 1</h4>
                  <div className="grid grid-cols-2 gap-8 mb-4">
                    {Object.entries(company.medicalProvider).map(([key, value]) => (
                      <div key={key} className="space-y-4">
                        <label className="text-sm font-medium text-slate-700">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                        <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-slate-500 border rounded-md">
                No medical provider data available
              </div>
            )}
          </div>
        )}

        {currentStep === "financial-arrangement" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Financial Arrangement</h3>

            {company.financialArrangement ? (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(company.financialArrangement).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border rounded-md">
                No financial arrangement data available
              </div>
            )}
          </div>
        )}

        {currentStep === "sob" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Schedule of Benefit</h3>

            {sobData ? (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">SOB Name</label>
                    <div className="border rounded-md p-2 bg-gray-50">{sobData.sobName || ""}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">SOB Code</label>
                    <div className="border rounded-md p-2 bg-gray-50">{sobData.sobCode || ""}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Effective Date</label>
                    <div className="border rounded-md p-2 bg-gray-50">{formatDate(sobData.effectiveDate)}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                    <div className="border rounded-md p-2 bg-gray-50">{formatDate(sobData.expiryDate)}</div>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Remarks</label>
                    <div className="border rounded-md p-2 bg-gray-50 min-h-[100px]">{sobData.remarks || ""}</div>
                  </div>

                  {sobData.fileName && (
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium text-slate-700">Document</label>
                      <div className="border rounded-md p-2 bg-gray-50 flex items-center">
                        <FileText className="h-4 w-4 text-slate-400 mr-2" />
                        {sobData.fileName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : company.sob ? (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="space-y-6">
                  {Object.entries(company.sob).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="border rounded-md p-2 bg-gray-50">{String(value) || ""}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border rounded-md">
                No schedule of benefits data available
              </div>
            )}
          </div>
        )}

        {currentStep === "history" && (
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Contract History</h3>

            {company.contractHistory && company.contractHistory.length > 0 ? (
              <div className="overflow-hidden rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contract Start
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contract End
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Modified By
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Modified Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {company.contractHistory.map((record, index) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              record.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : record.status === "Completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.modifiedBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record.modifiedDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border rounded-md">No contract history available</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
