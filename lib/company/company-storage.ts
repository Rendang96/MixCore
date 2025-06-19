const STORAGE_KEY = "companies"

// Add the CompanySearchCriteria interface
export interface CompanySearchCriteria {
  name?: string
  code?: string
  status?: string
  industry?: string
}

// Add the missing interfaces
interface Contact {
  id: number
  name: string
  position: string
  email: string
  phone: string
}

interface OperationalSegmentation {
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
  [index: number]: {
    category: string
    grades: string[]
  }
}

interface ReportFrequency {
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

interface FinancialArrangement {
  [index: number]: {
    paymentTerms: string
    billingFrequency: string
    currency: string
    creditLimit: string
    blockToAccounting: boolean
    specialTerms: string
  }
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

// Update the Company interface to include completionStatus
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
  financialArrangement?: FinancialArrangement
  sob?: SOB
  contractHistory?: ContractHistory[]
  completionStatus?: string // Add this field
}

export function getCompanies(): Company[] {
  try {
    const companiesString = localStorage.getItem(STORAGE_KEY)
    return companiesString ? JSON.parse(companiesString) : []
  } catch (error) {
    console.error("Error getting companies from localStorage:", error)
    return []
  }
}

export function saveCompanies(companies: Company[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies))
  } catch (error) {
    console.error("Error saving companies to localStorage:", error)
  }
}

export function addCompany(company: Company): void {
  try {
    const companies = getCompanies()
    companies.push(company)
    saveCompanies(companies)
  } catch (error) {
    console.error("Error adding company:", error)
  }
}

export function updateCompany(updatedCompany: Company): boolean {
  try {
    const companies = getCompanies()
    const index = companies.findIndex((company) => company.id === updatedCompany.id)

    if (index === -1) {
      return false // Company not found
    }

    companies[index] = updatedCompany
    saveCompanies(companies)
    return true
  } catch (error) {
    console.error("Error updating company:", error)
    return false
  }
}

export function deleteCompany(id: number): boolean {
  try {
    const companies = getCompanies()
    const updatedCompanies = companies.filter((company) => company.id !== id)

    if (updatedCompanies.length === companies.length) {
      // Company not found
      return false
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompanies))
    return true
  } catch (error) {
    console.error("Error deleting company:", error)
    return false
  }
}

// Add the searchCompanies function
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

// Add the getCompanyById function
export const getCompanyById = (id: number): Company | null => {
  const companies = getCompanies()
  return companies.find((c) => c.id === id) || null
}
