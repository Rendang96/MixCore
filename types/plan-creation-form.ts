export interface ProviderSelectionRecord {
  id: string
  providerTypes: string[] // e.g., "Hospitals", "SP Clinics"
  providerCategories: string[] // e.g., "Government", "Private"
  paymentMethods: string[] // e.g., "Cashless", "Pay and Claim"
  panelship: string // e.g., "Select Access"
  state: string[] // Changed to string[] for multi-select
  accessRule: string // e.g., "Select"
}

export interface SubService {
  name: string
  selected: boolean
}

export interface ServiceTypeConfig {
  name: string // e.g., "GP - General Practitioner"
  code: string // e.g., "GP"
  autoSuspension: number // percentage
  subServices: SubService[]
  selected: boolean // New property to track if the main service type checkbox is selected
}

export interface EligibilityCriteria {
  primaryMemberMinAge: number | ""
  primaryMemberMaxAge: number | ""
  spouseMinAge: number | ""
  spouseMaxAge: number | ""
  maxChildAge: number | ""
  maxAgeIfStudying: number | ""
  maxSpouses: number | ""
  maxChildren: number | ""
  coverDisabledChildren: boolean
  spouseCoverageByGender: "Yes" | "No"
  spouseCoverageByEmploymentStatus: "Yes" | "No"
}

export interface MaternityCoverage {
  staffCategory: string[] // "All", "Permanent", "Contract", "Temporary"
  membersCovered: "Staff only" | "Staff and Spouse" | ""
  totalNoOfDeliveryType: "No. of Deliveries" | "No. of Surviving Children" | ""
  totalNoOfDeliveryValue: number | ""
  waitingPeriod: string // e.g., "None", "30 days"
}

export interface PlanCreationFormValues {
  // Basic Plan Information
  planName: string
  planType: string
  effectiveDate: Date | undefined
  expiryDate: Date | undefined
  description: string

  // Features toggles
  providerSelectionEnabled: boolean
  specialRulesEnabled: boolean
  billbackEnabled: boolean
  eligibilityCriteriaEnabled: boolean
  maternityCoverageEnabled: boolean

  // Provider Selection (if enabled) - This is for the section within Basic Info
  providerSelectionRecords: ProviderSelectionRecord[]

  // Service Configuration
  serviceConfigurations: ServiceTypeConfig[]

  // Eligibility Criteria (if enabled)
  eligibility: EligibilityCriteria

  // Maternity Coverage (if enabled)
  maternity: MaternityCoverage

  // Other steps (placeholders for now)
  benefitLimits: any[]
  specialRules: any[]
}
