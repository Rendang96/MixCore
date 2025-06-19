"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface DependentInfo {
  name?: string
  nricPassport?: string
  relationship?: string
  dateOfBirth?: Date
  gender?: string
  isDisabled?: boolean
  address?: string
  postcode?: string
  city?: string
  state?: string
  country?: string
  phoneNo?: string
  email?: string
}

export interface MemberEntry {
  id: string
  personId: string
  personName: string
  idNumber: string
  membershipId: string
  staffId: string
  personType: string
  employeePersonId: string
  designation: string
  jobGrade: string
  employmentType: string
  staffCategory: string
  startDate?: Date
  endDate?: Date
  joinedDate?: Date
  setupProvider: string
  specialTags: string[]
  medicalProviders: Array<{
    id: string
    serviceTypes: string[]
    panelship: string
    providerTypes: string[]
  }>
  planName: string
  planCode: string
  planEffectiveDate?: Date
  planExpiryDate?: Date
  dependentCovered: string
  selectedDependents: string[]
  remarks: string // Added
  dateOfBirth?: Date // Added
  gender?: string // Added
  isDisabled?: boolean // Added
  email?: string // Added
  phoneNo?: string // Added
  address?: string // Added
  postcode?: string // Added
  city?: string // Added
  state?: string // Added
  country?: string // Added
  unit?: string // Added
  department?: string // Added
  memberEmploymentStatus?: string // Added
  dependentInfo?: DependentInfo // Added
}

export interface CompanyEntry {
  id: string
  name: string
  registrationNumber: string
  businessType: string
  industry: string
  establishedDate: Date | undefined
  employeeCount: string
  annualRevenue: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  website: string
  description: string
}

export interface PayorEntry {
  id: string
  name: string
  code: string
  payorType: string
}

export interface ProductEntry {
  id: string
  name: string
  code: string
  payorName: string
  payorCode: string
}

export interface PolicyEntry {
  id: string
  name: string
  code: string
  serviceType: string
  productName: string
  productCode: string
  effectiveDate: Date | undefined
  expiryDate: Date | undefined
}

export type ServiceType = "GP" | "SP" | "OC" | "DT" | "MT" | "HP"

export interface PlanEntry {
  id: string
  name: string
  code: string
  description: string
  effectiveDate: Date | undefined
  expiryDate: Date | undefined
  policies: Array<{
    id: string
    policyNo: string
    policyName: string
    effectiveDate: Date | undefined
    expiryDate: Date | undefined
    serviceTypes: ServiceType[]
  }>
}

export interface ProviderEntry {
  id: string
  name: string
  code: string
  type: string
  category: string
  specialization: string[]
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  contractStartDate: Date | undefined
  contractEndDate: Date | undefined
  status: string
}

export interface CorporateClientFormData {
  // Company data
  companyName: string
  companyCode: string
  companyEntries: CompanyEntry[]
  companyTabValue: string
  companyBulkData: { groupId: string }
  companySelectedFile: File | null

  // New payor fields for Company step
  payorName1: string
  payorCode1: string
  payorType1: string
  payorName2: string
  payorCode2: string
  payorType2: string

  // Payor data
  payorEntries: PayorEntry[]
  payorTabValue: string
  payorBulkData: { groupId: string }
  payorSelectedFile: File | null
  selectedFromLookup: { [key: string]: boolean }
  selectedProductFromLookup: { [key: string]: boolean }
  selectedPolicyFromLookup: { [key: string]: boolean }
  selectedPlanFromLookup: { [key: string]: boolean }

  // Product data
  productEntries: ProductEntry[]
  productTabValue: string
  productBulkData: { groupId: string }
  productSelectedFile: File | null

  // Policy data
  policyEntries: PolicyEntry[]
  policyTabValue: string
  policyBulkData: { groupId: string }
  policySelectedFile: File | null

  // Plan data
  planEntries: PlanEntry[]
  planTabValue: string
  planBulkData: { groupId: string }
  planSelectedFile: File | null

  // Member data
  memberEntries: MemberEntry[]
  memberTabValue: string
  memberBulkData: { groupId: string }
  memberSelectedFile: File | null
  selectedProviders: { [key: string]: string[] }

  // Provider data
  providerEntries: ProviderEntry[]
  providerTabValue: string
  providerBulkData: { groupId: string }
  providerSelectedFile: File | null

  // Summary data
  summaryNotes: string
  summaryAttachments: File[]
}

const defaultFormData: CorporateClientFormData = {
  // Company defaults
  companyName: "",
  companyCode: "",
  companyEntries: [
    {
      id: "company-1",
      name: "",
      registrationNumber: "",
      businessType: "",
      industry: "",
      establishedDate: undefined,
      employeeCount: "",
      annualRevenue: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      website: "",
      description: "",
    },
  ],
  companyTabValue: "single",
  companyBulkData: { groupId: "" },
  companySelectedFile: null,

  // New payor fields defaults
  payorName1: "",
  payorCode1: "",
  payorType1: "Self-funded/Non-Insurer",
  payorName2: "",
  payorCode2: "",
  payorType2: "Insurance",

  // Payor defaults
  payorEntries: [
    {
      id: "payor-1",
      name: "",
      code: "",
      payorType: "insurer",
    },
  ],
  payorTabValue: "single",
  payorBulkData: { groupId: "" },
  payorSelectedFile: null,
  selectedFromLookup: {},
  selectedProductFromLookup: {},
  selectedPolicyFromLookup: {},
  selectedPlanFromLookup: {},

  // Product defaults
  productEntries: [
    {
      id: "product-1",
      name: "",
      code: "",
      payorName: "",
      payorCode: "",
    },
  ],
  productTabValue: "single",
  productBulkData: { groupId: "" },
  productSelectedFile: null,

  // Policy defaults - Initialize with 2 entries
  policyEntries: [
    {
      id: "policy-1",
      name: "",
      code: "",
      serviceType: "",
      productName: "",
      productCode: "",
      effectiveDate: undefined,
      expiryDate: undefined,
    },
    {
      id: "policy-2",
      name: "",
      code: "",
      serviceType: "",
      productName: "",
      productCode: "",
      effectiveDate: undefined,
      expiryDate: undefined,
    },
  ],
  policyTabValue: "single",
  policyBulkData: { groupId: "" },
  policySelectedFile: null,

  // Plan defaults
  planEntries: [
    {
      id: "plan-1",
      name: "",
      code: "",
      description: "",
      effectiveDate: undefined,
      expiryDate: undefined,
      policies: [
        {
          id: "plan-1-policy-1",
          policyNo: "",
          policyName: "",
          effectiveDate: undefined,
          expiryDate: undefined,
          serviceTypes: [],
        },
      ],
    },
  ],
  planTabValue: "single",
  planBulkData: { groupId: "" },
  planSelectedFile: null,

  // Member defaults
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
      startDate: undefined,
      endDate: undefined,
      joinedDate: undefined,
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
    },
  ],
  memberTabValue: "single",
  memberBulkData: { groupId: "" },
  memberSelectedFile: null,
  selectedProviders: {},

  // Provider defaults
  providerEntries: [
    {
      id: "provider-1",
      name: "",
      code: "",
      type: "",
      category: "",
      specialization: [],
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      contractStartDate: undefined,
      contractEndDate: undefined,
      status: "",
    },
  ],
  providerTabValue: "single",
  providerBulkData: { groupId: "" },
  providerSelectedFile: null,

  // Summary defaults
  summaryNotes: "",
  summaryAttachments: [],
}

interface CorporateClientFormContextType {
  formData: CorporateClientFormData
  updateFormData: (updates: Partial<CorporateClientFormData>) => void
  resetFormData: () => void
}

const CorporateClientFormContext = createContext<CorporateClientFormContextType | undefined>(undefined)

export function CorporateClientFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<CorporateClientFormData>(defaultFormData)

  const updateFormData = (updates: Partial<CorporateClientFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const resetFormData = () => {
    setFormData(defaultFormData)
  }

  return (
    <CorporateClientFormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </CorporateClientFormContext.Provider>
  )
}

export function useCorporateClientForm() {
  const context = useContext(CorporateClientFormContext)
  if (context === undefined) {
    throw new Error("useCorporateClientForm must be used within a CorporateClientFormProvider")
  }
  return context
}
