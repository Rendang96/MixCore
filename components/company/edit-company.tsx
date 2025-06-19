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
import { updateCompany } from "@/lib/company/company-storage"
import { format } from "date-fns"
import { FinancialArrangementForm } from "@/components/company/financial-arrangement-form"

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

interface EditCompanyProps {
  company: {
    id: number
    name: string
    code: string
    status: string
    registrationNo: string
    gstSstRegNo?: string
    tinNo?: string
    tinEmail?: string
    companyType: string
    parentCompany: string
    hierarchyLevel: string
    subsidiaries: number
    joiningDate?: string
    contractStart?: string
    contractEnd?: string
    programType?: string
    industry?: string
    subIndustry?: string
    website?: string
    phoneNo?: string
    address?: string
    postcode?: string
    city?: string
    state?: string
    country?: string
    contacts?: Contact[]
    operationalSegmentation?: any[]
    jobGrade?: JobGradeSet[]
    reportFrequency?: any[]
    medicalProvider?: any[]
    financialArrangement?: any[]
    sob?: any
    contractHistory?: any[]
  }
  onCancel: () => void
  onSave?: (company: any) => void
}

interface Company {
  id: number
  name: string
  companyType: string
  parentId?: number
}

interface ContractHistoryRecord {
  id: number
  startDate: string
  endDate: string
  status: string
  modifiedBy: string
  modifiedDate: string
}

export function EditCompany({ company: initialCompany, onCancel, onSave }: EditCompanyProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>("company-info")
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)

  // Initialize all form states with existing company data
  const [companyName, setCompanyName] = useState<string>(initialCompany.name || "")
  const [companyCode, setCompanyCode] = useState<string>(initialCompany.code || "")
  const [selectedStatus, setSelectedStatus] = useState<string>(initialCompany.status || "active")
  const [registrationNo, setRegistrationNo] = useState<string>(initialCompany.registrationNo || "")
  const [gstSstRegNo, setGstSstRegNo] = useState<string>(initialCompany.gstSstRegNo || "")
  const [tinNo, setTinNo] = useState<string>(initialCompany.tinNo || "")
  const [tinEmail, setTinEmail] = useState<string>(initialCompany.tinEmail || "")
  const [joiningDate, setJoiningDate] = useState<string>(formatDateForInput(initialCompany.joiningDate))
  const [contractStart, setContractStart] = useState<string>(formatDateForInput(initialCompany.contractStart))
  const [contractEnd, setContractEnd] = useState<string>(formatDateForInput(initialCompany.contractEnd))
  const [programType, setProgramType] = useState<string>(initialCompany.programType || "")
  const [industry, setIndustry] = useState<string>(initialCompany.industry || "")
  const [subIndustry, setSubIndustry] = useState<string>(initialCompany.subIndustry || "")
  const [website, setWebsite] = useState<string>(initialCompany.website || "")
  const [phoneNo, setPhoneNo] = useState<string>(initialCompany.phoneNo || "")
  const [address, setAddress] = useState<string>(initialCompany.address || "")
  const [postcode, setPostcode] = useState<string>(initialCompany.postcode || "")
  const [city, setCity] = useState<string>(initialCompany.city || "")
  const [state, setState] = useState<string>(initialCompany.state || "")
  const [country, setCountry] = useState<string>(initialCompany.country || "")

  // Convert company type to form format
  const getFormCompanyType = (type: string) => {
    switch (type.toLowerCase()) {
      case "main holding":
        return "main-holding"
      case "subsidiary":
        return "subsidiary"
      case "independent":
        return "independent"
      default:
        return ""
    }
  }

  const [selectedCompanyType, setSelectedCompanyType] = useState<string>(getFormCompanyType(initialCompany.companyType))
  const [hierarchyLevel, setHierarchyLevel] = useState<string>(initialCompany.hierarchyLevel || "")
  const [subsidiaries, setSubsidiaries] = useState<string>(initialCompany.subsidiaries?.toString() || "")
  const [selectedParentId, setSelectedParentId] = useState<string>("")

  // Initialize complex data structures
  const [contacts, setContacts] = useState<Contact[]>(initialCompany.contacts || [])
  const [operationalSegmentation, setOperationalSegmentation] = useState<any[]>(
    initialCompany.operationalSegmentation || [],
  )
  const [jobGrade, setJobGrade] = useState<JobGradeSet[]>(initialCompany.jobGrade || [])
  const [reportFrequency, setReportFrequency] = useState<any[]>(initialCompany.reportFrequency || [])
  const [medicalProvider, setMedicalProvider] = useState<any[]>(initialCompany.medicalProvider || [])
  const [financialArrangement, setFinancialArrangement] = useState<any[]>(initialCompany.financialArrangement || [])
  const [sob, setSob] = useState<any>(initialCompany.sob || null)
  const [contractHistory, setContractHistory] = useState<ContractHistoryRecord[]>(initialCompany.contractHistory || [])

  // Sample company data for parent company selection
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

  const [parentCompanyOptions, setParentCompanyOptions] = useState<Company[]>([])

  // Format date for input fields
  function formatDateForInput(dateString?: string) {
    if (!dateString) return ""
    try {
      return format(new Date(dateString), "yyyy-MM-dd")
    } catch (error) {
      return dateString || ""
    }
  }

  // Initialize parent company selection based on existing data
  useEffect(() => {
    if (selectedCompanyType === "subsidiary") {
      const specificParentOptions = companies.filter(
        (company) => company.name === "Global Corp Holdings" || company.name === "GC Western Division",
      )
      setParentCompanyOptions(specificParentOptions)

      // Set the selected parent if it exists in the data
      if (initialCompany.parentCompany) {
        const parentCompany = specificParentOptions.find((c) => c.name === initialCompany.parentCompany)
        if (parentCompany) {
          setSelectedParentId(parentCompany.id.toString())
        }
      }
    } else {
      setParentCompanyOptions([])
      setSelectedParentId("")
    }
  }, [selectedCompanyType, initialCompany.parentCompany])

  const handleStepClick = (step: FormStep) => {
    setCurrentStep(step)
  }

  const handleNext = () => {
    if (currentStep === "company-info") {
      setCurrentStep("contact-details")
    } else if (currentStep === "contact-details") {
      setCurrentStep("operational")
    } else if (currentStep === "operational") {
      setCurrentStep("job-grade")
    } else if (currentStep === "job-grade") {
      setCurrentStep("report-frequency")
    } else if (currentStep === "report-frequency") {
      setCurrentStep("medical-provider")
    } else if (currentStep === "medical-provider") {
      setCurrentStep("financial-arrangement")
    } else if (currentStep === "financial-arrangement") {
      setCurrentStep("sob")
    } else if (currentStep === "sob") {
      setCurrentStep("history")
    }
  }

  const handlePrevious = () => {
    if (currentStep === "contact-details") {
      setCurrentStep("company-info")
    } else if (currentStep === "operational") {
      setCurrentStep("contact-details")
    } else if (currentStep === "job-grade") {
      setCurrentStep("operational")
    } else if (currentStep === "report-frequency") {
      setCurrentStep("job-grade")
    } else if (currentStep === "medical-provider") {
      setCurrentStep("report-frequency")
    } else if (currentStep === "financial-arrangement") {
      setCurrentStep("medical-provider")
    } else if (currentStep === "sob") {
      setCurrentStep("financial-arrangement")
    } else if (currentStep === "history") {
      setCurrentStep("sob")
    }
  }

  const collectFormData = () => {
    return {
      ...initialCompany,
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
      subsidiaries: Number.parseInt(subsidiaries) || 0,
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
      contacts,
      operationalSegmentation,
      jobGrade,
      reportFrequency,
      medicalProvider,
      financialArrangement,
      sob,
      contractHistory,
    }
  }

  const handleSaveConfirm = () => {
    setShowConfirmDialog(false)
    const formData = collectFormData()
    updateCompany(formData)

    if (onSave) {
      onSave(formData)
    }

    onCancel()
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

    if (step === currentStep) return "current"
    if (stepIndex < currentIndex) return "completed"
    return "pending"
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Edit Company</h2>
        <Button variant="outline" onClick={onCancel}>
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

      {/* Main form area */}
      <div className="bg-white">
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
                  onChange={(e) => setCompanyCode(e.target.value)}
                  className="w-full"
                  placeholder="Company code"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
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
                <Select value={selectedCompanyType} onValueChange={(value) => setSelectedCompanyType(value)}>
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
                  value={selectedParentId}
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
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subsidiaries" className="text-sm font-medium text-slate-700">
                  Subsidiaries
                </label>
                <Input
                  id="subsidiaries"
                  className="w-full"
                  value={subsidiaries}
                  onChange={(e) => setSubsidiaries(e.target.value)}
                />
              </div>

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
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
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
                Save Changes
              </Button>
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to save these changes?</AlertDialogDescription>
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
