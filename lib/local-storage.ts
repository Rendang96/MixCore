// Local Storage utility functions for Provider Network Management

export interface SetupData {
  providerTypes: string[]
  providerCategories: string[]
  servicesProvided: string[]
  panelGroups: string[]
  chargesTypes: string[]
  diagnosedIllnesses: string[]
  discountCategories: string[]
  discountItems: { item: string; category: string; percentage: number }[]
  techInfrastructures: { name: string; description: string }[]
  labArrangements: { name: string; description: string }[]
  facilities: { name: string; description: string }[]
  experiences: { years: string; description: string }[]
  specialists: { name: string; specialty: string; qualification: string }[]
  documentSubmissions: { title: string; providerTypes: string[]; description: string }[]
  spokenLanguages: string[]
  specialtyDoctors: string[]
  subSpecialtyDoctors: string[]
  staffingRequirements: { role: string; description: string }[]
  guidelines: { title: string; providerType: string; content: string }[]
  appointmentLetters: { title: string; providerType: string; content: string }[]
  pmcareRepresentatives: {
    personInCharge: string
    designation: string
    status: string
    phone: string
    email: string
    providerTypes: string[]
    states: string[]
  }[]
  drugs: {
    drugCode: string
    mcdCode: string
    genericName: string
    holderName: string
    productName: string
    productRegisterNo: string
    status: string
  }[]
}

interface ProviderPmcareRepresentative {
  personInCharge?: string
  designation?: string
  status?: string
  phone?: string
  email?: string
  nameOfPICDoctor?: string // Added for UI display
  phoneNumber?: string // Added for UI display
}

export interface Provider {
  id: string
  code: string
  name: string
  alias?: string
  providerType: string
  providerCategory: string
  address: string
  city: string
  state: string
  postcode: string
  latitude?: string
  longitude?: string
  telNumber: string
  faxNumber?: string
  email: string
  mobilePhone?: string
  whatsapp?: string
  website?: string
  proprietor?: string
  passport?: string
  companyRegNo: string
  gstReg?: string
  tinNo: string
  glIssuance?: boolean
  useMediline?: boolean
  amePanel?: boolean
  perkesoPanel?: boolean
  pmcarePanel?: boolean
  panelGroup?: string
  status: string
  isPMCarePanel: boolean
  isAMEPanel: boolean
  pic?: string
  selectedLanguages?: string[]
  consultationCharges?: { type: string; amount: string }[]
  illnessCharges?: { illness: string; cost: string }[]
  selectedTechInfrastructures?: string[]
  selectedLabArrangements?: string[]
  selectedFacilities?: { name: string; charges: string }[]
  selectedExperiences?: string[]
  selectedSpecialists?: string[]
  drugList?: { name: string; category: string }[]
  practicingDoctors?: any[]
  healthDoctors?: any[]
  radiographer?: any
  contract?: any
  pmcareRepresentative?: ProviderPmcareRepresentative // Updated to use the new interface
  payeeList?: any
  selectedDiscountItems?: any[]
  operatingHours?: any
  packages?: any[]
  promotionFiles?: string[]
  createdAt: string
  updatedAt: string
  staffing?: { role: string; count: number }[]
}

// Setup Data Management
export const getSetupData = (): SetupData => {
  const defaultData: SetupData = {
    providerTypes: [
      "GP",
      "SP",
      "HP",
      "Maternity",
      "Dental",
      "Dialysis",
      "Physiotherapy",
      "Optical",
      "Alternative Medicine",
    ],
    providerCategories: ["Government", "Private", "Semi Private"],
    servicesProvided: [
      "Alternative Medicine",
      "Dialysis Centre",
      "Imaging",
      "Specialist",
      "Hospital",
      "Lab",
      "General Physician",
      "Medical Supplies",
      "Physiotherapy",
      "Maternity",
      "Dental",
      "Pharmacy",
    ],
    panelGroups: ["Bank Simpanan Nasional", "BSN", "CIMB", "TNB", "umw", "DENTAL"], // Changed "UMW" to "umw"
    chargesTypes: ["Standard consultation"],
    diagnosedIllnesses: [
      "Fever Cough & Cold",
      "URTI",
      "Abdominal Pain",
      "Backache",
      "Hyperlipidaemia",
      "Diabetes",
      "Hypertesion",
    ],
    discountCategories: ["Brief", "ROOM RATE (ICU)"],
    discountItems: [
      { item: "Room & Board", category: "Brief", percentage: 0 },
      { item: "MO Consultation Fee (office Hours)", category: "Brief", percentage: 0 },
      { item: "Consultation OP Follow Up", category: "Brief", percentage: 0 },
      { item: "Admin Fee", category: "Brief", percentage: 0 },
      { item: "Lab", category: "Brief", percentage: 0 },
      { item: "ICU", category: "ROOM RATE (ICU)", percentage: 0 },
      { item: "CCU", category: "ROOM RATE (ICU)", percentage: 0 },
      { item: "HDU", category: "ROOM RATE (ICU)", percentage: 0 },
      { item: "Isolation", category: "ROOM RATE (ICU)", percentage: 0 },
    ],
    techInfrastructures: [
      { name: "Personal Computer", description: "" },
      { name: "Clinic Management System", description: "" },
      { name: "Internet / WiFi", description: "" },
      { name: "Free WiFi for Patient", description: "" },
    ],
    labArrangements: [
      { name: "BP Labs Healthcare", description: "" },
      { name: "Clinipath", description: "" },
      { name: "Gnosis Laboratories", description: "" },
      { name: "Gribbles Malaysia", description: "" },
      { name: "LabLink", description: "" },
      { name: "Medi-Vance Healthcare", description: "" },
      { name: "Pathlab", description: "" },
      { name: "Wellness Lab", description: "" },
    ],
    facilities: [
      { name: "CBC machine", description: "" },
      { name: "Dengue Rapid testing", description: "" },
      { name: "Influenza testing", description: "" },
      { name: "Urine Dipstick", description: "" },
      { name: "X-ray machine", description: "" },
      { name: "Nebulizer", description: "" },
      { name: "ECG", description: "" },
      { name: "Ultrasound", description: "" },
      { name: "IV Drip", description: "" },
      { name: "Resuscitation Set Up Endotracheal tube, ambo bag, etc.", description: "" },
      { name: "Preventive Vaccination", description: "" },
      { name: "Catheter", description: "" },
      { name: "Nasogastric tube", description: "" },
      { name: "Glucometer", description: "" },
      { name: "Minor Surgeries", description: "" },
      { name: "Inpatient Maternity Facilities", description: "" },
      { name: "Physiotherapy", description: "" },
      { name: "Cosmetic/Aesthetic Services", description: "" },
    ],
    experiences: [
      { years: "Medical", description: "" },
      { years: "O & G", description: "" },
      { years: "Surgical", description: "" },
      { years: "Pediatrics", description: "" },
      { years: "Oral Surgery", description: "" },
      { years: "Medical Care", description: "" },
      { years: "OSH / Family Medicine", description: "" },
    ],
    specialists: [
      { name: "ALLERGY AND IMMUNOLOGY", specialty: "", qualification: "" },
      { name: "ANAESTHETICS", specialty: "", qualification: "" },
      { name: "BREAST & ENDOCRINE SURGERY", specialty: "", qualification: "" },
      { name: "CARDIOLOGY", specialty: "", qualification: "" },
      { name: "CARDIOTHORACIC SURGERY", specialty: "", qualification: "" },
      { name: "CHILD AND ADOLESCENT PSYCHIATRY AND PSYCHOTHERAPY", specialty: "", qualification: "" },
      { name: "CLINICAL NEUROPHYSIOLOGY", specialty: "", qualification: "" },
      { name: "DENTISTRY", specialty: "", qualification: "" },
      { name: "DERMATO-VENEREOLOGY", specialty: "", qualification: "" },
      { name: "EMERGENCY MEDICINE", specialty: "", qualification: "" },
      { name: "ENDOCRINOLOGY", specialty: "", qualification: "" },
      { name: "GASTROENTEROLOGY", specialty: "", qualification: "" },
      { name: "GENERAL MEDICINE & PHYSICIAN", specialty: "", qualification: "" },
      { name: "GENERAL SURGERY", specialty: "", qualification: "" },
      { name: "GERIATRICS", specialty: "", qualification: "" },
      { name: "GYNAECOLOGY AND OBSTETRICS", specialty: "", qualification: "" },
      { name: "HAEMATOLOGY", specialty: "", qualification: "" },
      { name: "HEALTH INFORMATICS", specialty: "", qualification: "" },
      { name: "INFECTIOUS DISEASES", specialty: "", qualification: "" },
      { name: "INTERNAL MEDICINE", specialty: "", qualification: "" },
      { name: "INTERVENTIONAL RADIOLOGY", specialty: "", qualification: "" },
      { name: "MICROBIOLOGY", specialty: "", qualification: "" },
      { name: "NEONATOLOGY", specialty: "", qualification: "" },
      { name: "NEPHROLOGY", specialty: "", qualification: "" },
      { name: "NEUROLOGY", specialty: "", qualification: "" },
      { name: "NEURORADIOLOGY", specialty: "", qualification: "" },
      { name: "NEUROSURGERY", specialty: "", qualification: "" },
      { name: "NOT APPLICABLE", specialty: "", qualification: "" },
      { name: "NUCLEAR MEDICINE", specialty: "", qualification: "" },
    ],
    documentSubmissions: [
      {
        title: "Clinic Registration Documents",
        providerTypes: ["Clinic", "Specialist"],
        description: "Documents required for clinic registration",
      },
      {
        title: "Hospital Licensing Documents",
        providerTypes: ["Hospital"],
        description: "Documents required for hospital licensing",
      },
      {
        title: "Pharmacy License",
        providerTypes: ["Pharmacy"],
        description: "Pharmacy operating license",
      },
    ],
    spokenLanguages: ["English", "Malay", "Mandarin", "Tamil", "Arabic", "Hindi"],
    specialtyDoctors: [
      "ANAESTHETICS",
      "CARDIOTHORACIC SURGERY",
      "RADIOLOGY",
      "INTERVENTIONAL RADIOLOGY",
      "GENERAL MEDICINE & PHYSICIAN",
      "PAEDIATRICS",
    ],
    subSpecialtyDoctors: [
      "INTENSIVE CARE",
      "CARDIOTHORACIC SURGERY",
      "CLINICAL RADIOLOGY",
      "INTERVENTIONAL RADIOLOGY",
      "GENERAL MEDICINE & PHYSICIAN",
      "GENERAL PAEDIATRICS",
    ],
    staffingRequirements: [
      { role: "Doctor OSH", description: "" },
      { role: "Locum", description: "" },
      { role: "Nurse", description: "" },
      { role: "Others", description: "" },
    ],
    guidelines: [
      {
        title: "Clinic Onboarding Guidelines",
        providerType: "Clinic",
        content: "Guidelines for clinic onboarding process.",
      },
      {
        title: "Hospital Partnership Guidelines",
        providerType: "Hospital",
        content: "Guidelines for hospital partnership process.",
      },
    ],
    appointmentLetters: [
      {
        title: "Standard Appointment Letter",
        providerType: "Clinic",
        content: "Standard appointment letter content",
      },
      {
        title: "Hospital Appointment Letter",
        providerType: "Hospital",
        content: "Hospital appointment letter content",
      },
    ],
    pmcareRepresentatives: [
      {
        personInCharge: "Azni",
        designation: "Manager",
        status: "Active",
        phone: "0153647856",
        email: "azni@pmcare.my",
        providerTypes: ["GP", "HP"],
        states: ["Kuala Lumpur", "Selangor"],
      },
    ],
    drugs: [
      {
        drugCode: "PAR001",
        mcdCode: "MCD001",
        genericName: "Paracetamol",
        holderName: "ABC Pharmaceuticals",
        productName: "Panadol",
        productRegisterNo: "REG001",
        status: "REGISTERED",
      },
      {
        drugCode: "AMX002",
        mcdCode: "MCD002",
        genericName: "Amoxicillin",
        holderName: "XYZ Pharma",
        productName: "Amoxil",
        productRegisterNo: "REG002",
        status: "REGISTERED",
      },
    ],
  }

  try {
    const stored = localStorage.getItem("providerSetupData")
    if (stored) {
      const parsedData = JSON.parse(stored)
      // Merge with default data to ensure all fields exist
      return { ...defaultData, ...parsedData }
    }
  } catch (error) {
    console.error("Error loading setup data from localStorage:", error)
  }

  return defaultData
}

export const saveSetupData = (data: SetupData): void => {
  try {
    localStorage.setItem("providerSetupData", JSON.stringify(data))
    console.log("Setup data saved to localStorage, dispatching event")
    window.dispatchEvent(new CustomEvent("setupDataChanged", { detail: data }))
  } catch (error) {
    console.error("Error saving setup data to localStorage:", error)
  }
}

export const updateSetupSection = (section: keyof SetupData, data: any): void => {
  const currentData = getSetupData()
  currentData[section] = data
  saveSetupData(currentData)
}

// Provider Data Management
export const getProviders = (): Provider[] => {
  try {
    const stored = localStorage.getItem("providers")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading providers from localStorage:", error)
  }

  // Return default mock data if no stored data
  return [
    {
      id: "1",
      code: "PRV001",
      name: "ABC Medical Center",
      alias: "ABC Clinic",
      providerType: "Clinic",
      providerCategory: "Primary Care",
      address: "123 Healthcare St, Kuala Lumpur",
      city: "Kuala Lumpur",
      state: "kuala-lumpur",
      postcode: "50000",
      latitude: "",
      longitude: "",
      telNumber: "03-12345678",
      faxNumber: "03-12345679",
      email: "info@abcmedical.com",
      mobilePhone: "012-3456789",
      whatsapp: "012-3456789",
      website: "https://abcmedical.com",
      proprietor: "Dr. Ahmad",
      passport: "",
      companyRegNo: "123456-A",
      gstReg: "GST-123456",
      tinNo: "TIN12345",
      sstReg: "SST98765",
      taxpayerStatus: "Registered",
      status: "active",
      isPMCarePanel: true,
      isAMEPanel: true,
      panelGroup: "Bank Simpanan Nasional",
      pic: "Dr. Ahmad",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      staffing: [{ role: "Nurse", count: 2 }],
      pmcareRepresentative: {
        nameOfPICDoctor: "Dr. Ahmad",
        phoneNumber: "012-3456789",
      },
    },
    {
      id: "2",
      code: "PRV002",
      name: "XYZ Hospital",
      providerType: "Hospital",
      providerCategory: "Secondary Care",
      address: "456 Medical Blvd, Petaling Jaya",
      city: "Petaling Jaya",
      state: "selangor",
      postcode: "47810",
      latitude: "",
      longitude: "",
      telNumber: "03-87654321",
      faxNumber: "03-87654322",
      email: "contact@xyzhospital.com",
      mobilePhone: "019-8765432",
      companyRegNo: "654321-B",
      gstReg: "GST-654321",
      tinNo: "TIN54321",
      sstReg: "SST12345",
      taxpayerStatus: "Pending Approval",
      status: "terminated", // Changed to "terminated" to match user's console log
      isPMCarePanel: true,
      isAMEPanel: false,
      panelGroup: "umw", // Changed to "umw" to match user's console log
      pic: "Dr. Sarah",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      staffing: [{ role: "Doctor", count: 5 }],
      pmcareRepresentative: {
        nameOfPICDoctor: "Dr. Sarah",
        phoneNumber: "019-8765432",
      },
    },
  ]
}

export const saveProviders = (providers: Provider[]): void => {
  try {
    localStorage.setItem("providers", JSON.stringify(providers))
    console.log("Providers saved to localStorage, dispatching event")
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent("providersChanged", { detail: providers }))
  } catch (error) {
    console.error("Error saving providers to localStorage:", error)
    throw error
  }
}

export const getProvider = (id: string): Provider | null => {
  const providers = getProviders()
  return providers.find((p) => p.id === id) || null
}

export const saveProvider = (provider: Provider): void => {
  try {
    const providers = getProviders()
    const existingIndex = providers.findIndex((p) => p.id === provider.id)

    if (existingIndex >= 0) {
      // Update existing provider
      providers[existingIndex] = { ...provider, updatedAt: new Date().toISOString() }
      console.log("Updated existing provider:", provider.name)
    } else {
      // Add new provider
      providers.push({ ...provider, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      console.log("Added new provider:", provider.name)
    }

    console.log("Saving providers to localStorage:", providers)
    saveProviders(providers)
  } catch (error) {
    console.error("Error in saveProvider:", error)
    throw error
  }
}

export const deleteProvider = (id: string): void => {
  const providers = getProviders()
  const filteredProviders = providers.filter((p) => p.id !== id)
  saveProviders(filteredProviders)
}

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9)
}

// Generate provider code
export const generateProviderCode = (providerType: string): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000)

  switch (providerType) {
    case "Clinic":
      return `CL-${randomNum}`
    case "Hospital":
      return `HP-${randomNum}`
    case "Specialist":
      return `SP-${randomNum}`
    case "Dental":
      return `DN-${randomNum}`
    case "Pharmacy":
      return `PH-${randomNum}`
    default:
      return `PR-${randomNum}`
  }
}
