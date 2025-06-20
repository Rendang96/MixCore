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
  autoSuspensionType: "Percentage" | "Amount" // New: Type of auto suspension
  autoSuspensionPercentage: number // For percentage type
  autoSuspensionAmount: number | "" // For amount type, MYR input
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
  // Updated fields for disabled children coverage
  coverDisabledChildren: boolean // Still needed to enable the section
  disabledChildrenAgeLimitType: "No age limit" | "Age limit" | "" // New: type of limit
  disabledChildrenAgeLimitValue: number | "" // New: specific age if "Age limit" is chosen
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

export interface Provider {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  type: "Hospital" | "GP Clinic" | "Pharmacy" | "Physiotherapy Center"
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

  // New: Selected Providers for Step 2
  selectedProviders: Provider[]

  // Other steps (placeholders for now)
  benefitLimits: any[]
  specialRules: any[]
}
