// lib/company/company-storage.ts

// Define the Company interface
export interface Company {
  id: number
  name: string
  code: string
  status: string
  registrationNo: string
  gstSstRegNo?: string
  tinNo?: string
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
  contacts?: Contact[]
  operationalSegmentation?: OperationalSegmentation
  jobGrade?: JobGrade
  reportFrequency?: ReportFrequency
  medicalProvider?: MedicalProvider
  sob?: SOB
  contractHistory?: ContractHistory[]
}

// Define additional interfaces for company details
interface Contact {
  id: number
  name: string
  position: string
  email: string
  phone: string
}

interface OperationalSegmentation {
  // Remove the old properties
  // region: string
  // division: string
  // department: string

  // Replace with an array of structures that matches what's used in the form
  [index: number]: {
    id: number
    name: string
    code: string
    type: string
    status: string
    parentStructure: string
    address: string
    postcode: string
    city: string
    state: string
    country: string
    remarks: string
  }
}

interface JobGrade {
  // Update from simple array to match the JobGradeSet structure
  [index: number]: {
    category: string
    grades: string[]
  }
}

// Update the ReportFrequency interface to match the actual structure
interface ReportFrequency {
  // Update from simple boolean flags to match the ReportConfig structure
  [index: number]: {
    id: string
    reportType: string
    reportFrequency: string
    deliveryMethod: string
    recipients: string
  }
}

interface MedicalProvider {
  providers: string[]
}

interface SOB {
  benefits: string[]
}

interface ContractHistory {
  id: number
  startDate: string
  endDate: string
  status: string
  modifiedBy: string
  modifiedDate: string
}

// Define the search criteria interface
export interface CompanySearchCriteria {
  name?: string
  code?: string
  status?: string
  industry?: string
}

// Local storage key for companies
const COMPANIES_STORAGE_KEY = "companies"

// Function to get companies from local storage
export const getCompanies = (): Company[] => {
  if (typeof window === "undefined") {
    return []
  }

  const companiesJson = localStorage.getItem(COMPANIES_STORAGE_KEY)
  return companiesJson ? JSON.parse(companiesJson) : []
}

// Function to save companies to local storage
const saveCompanies = (companies: Company[]) => {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies))
}

// Function to add a new company
export const addCompany = (company: Company) => {
  const companies = getCompanies()

  // Generate a new ID if not provided
  if (!company.id) {
    const maxId = companies.reduce((max, c) => Math.max(max, c.id), 0)
    company.id = maxId + 1
  }

  // Check if we have operational segmentation data in the draft
  try {
    const draftData = localStorage.getItem("company_form_draft")
    if (draftData) {
      const parsedDraft = JSON.parse(draftData)
      if (parsedDraft.operationalSegmentation && !company.operationalSegmentation) {
        console.log("Adding operational segmentation from draft to company:", parsedDraft.operationalSegmentation)
        company.operationalSegmentation = parsedDraft.operationalSegmentation
      }

      // Add similar checks for job grade and report frequency
      if (parsedDraft.jobGrade && !company.jobGrade) {
        console.log("Adding job grade from draft to company:", parsedDraft.jobGrade)
        company.jobGrade = parsedDraft.jobGrade
      }

      if (parsedDraft.reportFrequency && !company.reportFrequency) {
        console.log("Adding report frequency from draft to company:", parsedDraft.reportFrequency)
        company.reportFrequency = parsedDraft.reportFrequency
      }
    }
  } catch (error) {
    console.error("Error retrieving draft data:", error)
  }

  // Add the new company
  companies.push(company)
  saveCompanies(companies)

  return company
}

// Function to update an existing company
export const updateCompany = (company: Company) => {
  const companies = getCompanies()
  const index = companies.findIndex((c) => c.id === company.id)

  if (index !== -1) {
    // Check if we have operational segmentation data in the draft
    try {
      const draftData = localStorage.getItem("company_form_draft")
      if (draftData) {
        const parsedDraft = JSON.parse(draftData)
        if (parsedDraft.operationalSegmentation) {
          console.log("Updating operational segmentation from draft:", parsedDraft.operationalSegmentation)
          company.operationalSegmentation = parsedDraft.operationalSegmentation
        }

        // Add similar checks for job grade and report frequency
        if (parsedDraft.jobGrade) {
          console.log("Updating job grade from draft:", parsedDraft.jobGrade)
          company.jobGrade = parsedDraft.jobGrade
        }

        if (parsedDraft.reportFrequency) {
          console.log("Updating report frequency from draft:", parsedDraft.reportFrequency)
          company.reportFrequency = parsedDraft.reportFrequency
        }
      }
    } catch (error) {
      console.error("Error retrieving draft data:", error)
    }

    companies[index] = company
    saveCompanies(companies)
    return company
  }

  return null
}

// Function to delete a company
export const deleteCompany = (id: number) => {
  const companies = getCompanies()
  const filteredCompanies = companies.filter((c) => c.id !== id)

  if (filteredCompanies.length < companies.length) {
    saveCompanies(filteredCompanies)
    return true
  }

  return false
}

// Function to get a company by ID
export const getCompanyById = (id: number): Company | null => {
  const companies = getCompanies()
  return companies.find((c) => c.id === id) || null
}

// Function to search companies based on criteria
export const searchCompanies = (criteria: CompanySearchCriteria): Company[] => {
  const companies = getCompanies()

  return companies.filter((company) => {
    // Match name (case-insensitive partial match)
    if (criteria.name && !company.name.toLowerCase().includes(criteria.name.toLowerCase())) {
      return false
    }

    // Match code (case-insensitive partial match)
    if (criteria.code && !company.code.toLowerCase().includes(criteria.code.toLowerCase())) {
      return false
    }

    // Match status (exact match)
    if (
      criteria.status &&
      criteria.status !== "all" &&
      company.status.toLowerCase() !== criteria.status.toLowerCase()
    ) {
      return false
    }

    // Match industry (exact match)
    if (
      criteria.industry &&
      criteria.industry !== "all" &&
      company.industry &&
      company.industry.toLowerCase() !== criteria.industry.toLowerCase()
    ) {
      return false
    }

    return true
  })
}

// Function to clear all companies (for testing)
export const clearCompanies = () => {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem(COMPANIES_STORAGE_KEY)
}
