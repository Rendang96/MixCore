// lib/integration/person-onboarding-integration.ts

export interface OnboardingMembershipFamilyMember {
  personId: string
  name: string
  idNo: string
  relationship: string
  status: string
  membershipNo: string
}

export interface OnboardingMembership {
  id: string
  personId: string
  planName: string
  planCode: string
  effectiveDate: string
  expiryDate: string
  personType: string
  priority: string
  companyId: string
  companyName: string
  companyCode: string
  policyNo: string
  status: string
  specialTag: string // Add this new field
  familyMembers: OnboardingMembershipFamilyMember[]
  visitHistory?: {
    date: string
    provider: string
    serviceType: string
    amount: string
    status: string
    claimNo: string
  }[]
  utilization?: {
    serviceType: string
    utilized: string
    limit: string
    remaining: string
    percentage: number
  }[]
  personJourney?: {
    date: string
    event: string
    description: string
    category: string
  }[]
  bankInfo?: {
    bankName: string
    accountNumber: string
    accountHolder: string
    branchCode: string
    accountType: string
  }
  employmentInfo?: {
    employeeId: string
    employeeName: string
    companyId: string
    companyName: string
    companyCode: string
    department: string
    position: string
    jobGrade: string
    joinDate: string
    employmentType: string
    employmentStatus: string
    reportingManager: string
    workLocation: string
    salary: string
    benefits: string[]
  }
  membershipNo?: string
}

// Function to determine special tag based on plan code
export const getSpecialTagByPlanCode = (planCode: string): string => {
  switch (planCode) {
    case "CHP-2024":
      return "VIP"
    case "ECP-2024":
      return "Standard"
    case "SCP-2024":
      return "Premium"
    case "CORP-STANDARD-2024":
      return "Corporate"
    case "SPD-2024":
      return "Family"
    default:
      return "Other"
  }
}

// Function to generate unique membership number for family members
export const generateFamilyMemberMembershipNo = (
  membership: OnboardingMembership,
  membershipIndex: number,
  familyMemberIndex: number,
): string => {
  // Safety check
  if (!membership) {
    return "N/A"
  }

  // Use company code from onboarding data
  const companyPrefix = membership.companyCode ? membership.companyCode.replace(/\d+$/, "") : "MEM"

  // Create a base membership number for the main member
  let baseMembershipNo = `${companyPrefix}-${membership.personId}-${(membershipIndex + 1).toString().padStart(2, "0")}`

  // Add suffix based on plan type or priority
  if (membership.priority === "Secondary") {
    baseMembershipNo += "-EXT"
  } else if (membership.priority === "Tertiary") {
    baseMembershipNo += "-SUPP"
  } else if (membership.planName && membership.planName.toLowerCase().includes("spouse")) {
    baseMembershipNo += "-SPO"
  } else if (membership.priority === "Primary") {
    baseMembershipNo += "-PRI"
  }

  // Add unique family member suffix
  baseMembershipNo += `-DEP${(familyMemberIndex + 1).toString().padStart(2, "00")}`

  return baseMembershipNo
}

// Function to generate unique membership number for display
export const generateOnboardingMembershipNo = (membership: OnboardingMembership, index: number): string => {
  // Use company code from onboarding data
  const companyPrefix = membership.companyCode ? membership.companyCode.replace(/\d+$/, "") : "MEM"

  // Create a base membership number
  let baseMembershipNo = `${companyPrefix}-${membership.personId}-${(index + 1).toString().padStart(2, "0")}`

  // Add suffix based on plan type or priority
  if (membership.priority === "Secondary") {
    baseMembershipNo += "-EXT"
  } else if (membership.priority === "Tertiary") {
    baseMembershipNo += "-SUPP"
  } else if (membership.planName.toLowerCase().includes("spouse")) {
    baseMembershipNo += "-SPO"
  } else if (membership.priority === "Primary") {
    baseMembershipNo += "-PRI"
  }

  return baseMembershipNo
}

// Function to get onboarding memberships from storage
export const getOnboardingMemberships = (): OnboardingMembership[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const membershipsJson = localStorage.getItem("onboardingMemberships")
    return membershipsJson ? JSON.parse(membershipsJson) : []
  } catch (error) {
    console.error("Error retrieving onboarding memberships:", error)
    return []
  }
}

// Function to get employment info from storage
export const getOnboardingEmploymentInfo = (): any[] => {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const employmentJson = localStorage.getItem("onboardingEmploymentInfo")
    return employmentJson ? JSON.parse(employmentJson) : []
  } catch (error) {
    console.error("Error retrieving onboarding employment info:", error)
    return []
  }
}

// Function to get memberships for a specific person from onboarding data
export const getPersonMembershipsFromOnboarding = (personId: string): OnboardingMembership[] => {
  const allMemberships = getOnboardingMemberships()
  return allMemberships.filter((membership) => membership.personId === personId)
}

// Function to get employment info for a specific person from onboarding data
export const getPersonEmploymentFromOnboarding = (personId: string): any | null => {
  const allEmploymentInfo = getOnboardingEmploymentInfo()
  return allEmploymentInfo.find((employment) => employment.employeeId === personId) || null
}

// Function to get family members for a person across all memberships
export const getPersonFamilyMembersFromOnboarding = (personId: string): OnboardingMembershipFamilyMember[] => {
  const memberships = getPersonMembershipsFromOnboarding(personId)
  const familyMembersMap = new Map<string, OnboardingMembershipFamilyMember>()

  // Collect unique family members across all memberships
  memberships.forEach((membership) => {
    membership.familyMembers.forEach((member) => {
      if (!familyMembersMap.has(member.personId)) {
        familyMembersMap.set(member.personId, member)
      }
    })
  })

  return Array.from(familyMembersMap.values())
}

// Function to clear onboarding data (for testing)
export const clearOnboardingData = () => {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem("onboardingMemberships")
  localStorage.removeItem("onboardingEmploymentInfo")
}

// Function to initialize sample onboarding data
export const initializeOnboardingSampleData = () => {
  const getOnboardingMemberships = () => {
    try {
      const storedMemberships = localStorage.getItem("onboardingMemberships")
      return storedMemberships ? JSON.parse(storedMemberships) : []
    } catch (error) {
      console.error("Error retrieving onboarding memberships from localStorage:", error)
      return []
    }
  }

  const getOnboardingEmploymentInfo = () => {
    try {
      const storedEmploymentInfo = localStorage.getItem("onboardingEmploymentInfo")
      return storedEmploymentInfo ? JSON.parse(storedEmploymentInfo) : []
    } catch (error) {
      console.error("Error retrieving onboarding employment info from localStorage:", error)
      return []
    }
  }

  const saveOnboardingMemberships = (memberships: OnboardingMembership[]) => {
    try {
      localStorage.setItem("onboardingMemberships", JSON.stringify(memberships))
    } catch (error) {
      console.error("Error saving onboarding memberships to localStorage:", error)
    }
  }

  const saveOnboardingEmploymentInfo = (employmentInfo: any[]) => {
    try {
      localStorage.setItem("onboardingEmploymentInfo", JSON.stringify(employmentInfo))
    } catch (error) {
      console.error("Error saving onboarding employment info to localStorage:", error)
    }
  }

  const existingMemberships = getOnboardingMemberships()
  const existingEmployment = getOnboardingEmploymentInfo()

  // Only initialize if no data exists
  if (existingMemberships.length === 0 && existingEmployment.length === 0) {
    // Sample employment data
    const employmentData = [
      {
        employeeId: "PER-2025-123", // Updated Ahmad Farid's ID
        employeeName: "Ahmad Farid bin Abdullah",
        companyId: "COMP-IND-001",
        companyName: "Individual Corp",
        companyCode: "IND01",
        department: "Information Technology",
        position: "Senior Software Engineer",
        jobGrade: "G7",
        joinDate: "2020-03-01",
        employmentType: "Full Time",
        employmentStatus: "Active",
        reportingManager: "Dato' Ahmad Rahman",
        workLocation: "Kuala Lumpur HQ",
        salary: "RM 8,500.00",
        benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus"],
      },
      {
        employeeId: "PER-2025-458",
        employeeName: "Siti Aishah binti Ahmad",
        companyId: "COMP-GTS-001",
        companyName: "Global Tech Solutions",
        companyCode: "GTS01",
        department: "Human Resources",
        position: "HR Manager",
        jobGrade: "M3",
        joinDate: "2021-03-01",
        employmentType: "Full Time",
        employmentStatus: "Active",
        reportingManager: "Dato' Sarah Johnson",
        workLocation: "Kuala Lumpur Branch",
        salary: "RM 7,800.00",
        benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus", "Spouse Coverage"],
      },
    ]

    // Sample membership data for Ahmad Farid bin Abdullah (PER-2025-123)
    const ahmadFaridMemberships: OnboardingMembership[] = [
      {
        id: "ONBOARD-MEM-001",
        personId: "PER-2025-123", // Updated Ahmad Farid's ID
        membershipNo: "IND-PER-2025-123-01-PRI", // Updated membership number
        planName: "Comprehensive Health Plan",
        planCode: "CHP-2024",
        specialTag: "VIP",
        effectiveDate: "2024-01-01",
        expiryDate: "2024-12-31",
        personType: "Employee",
        priority: "Primary",
        companyId: "COMP-IND-001",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-458",
            name: "Siti Aishah binti Ahmad",
            idNo: "900101075000", // Updated ID No.
            relationship: "Wife",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI-DEP01", // Updated membership number
          },
          {
            personId: "PER-2025-460", // Corrected Person ID for Nur Aisyah
            name: "Nur Aisyah binti Ahmad Farid",
            idNo: "140820-14-5678",
            relationship: "Child",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI-DEP02", // Updated membership number
          },
          {
            personId: "PER-2025-461", // Corrected Person ID for Ahmad Arif
            name: "Ahmad Arif bin Ahmad Farid",
            idNo: "170612-14-9012",
            relationship: "Child",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI-DEP03", // Updated membership number
          },
        ],
        visitHistory: [
          {
            date: "2024-03-15",
            provider: "City Medical Center",
            serviceType: "Outpatient",
            amount: "RM 250.00",
            status: "Approved",
            claimNo: "CLM-2024-001",
          },
          {
            date: "2024-02-20",
            provider: "Dental Care Plus",
            serviceType: "Dental",
            amount: "RM 120.00",
            status: "Approved",
            claimNo: "CLM-2024-002",
          },
          {
            date: "2024-01-10",
            provider: "Family Clinic",
            serviceType: "Outpatient",
            amount: "RM 80.00",
            status: "Approved",
            claimNo: "CLM-2024-003",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 1,850.00",
            limit: "RM 5,000.00",
            remaining: "RM 3,150.00",
            percentage: 37,
          },
          {
            serviceType: "Dental",
            utilized: "RM 420.00",
            limit: "RM 1,000.00",
            remaining: "RM 580.00",
            percentage: 42,
          },
          {
            serviceType: "Optical",
            utilized: "RM 0.00",
            limit: "RM 800.00",
            remaining: "RM 800.00",
            percentage: 0,
          },
          {
            serviceType: "Inpatient",
            utilized: "RM 0.00",
            limit: "RM 15,000.00",
            remaining: "RM 15,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-01-01",
            event: "Membership Activated",
            description: "Comprehensive Health Plan activated for Ahmad Farid and family",
            category: "Membership",
          },
          {
            date: "2024-01-10",
            event: "First Claim Submitted",
            description: "Outpatient visit at Family Clinic",
            category: "Claims",
          },
          {
            date: "2024-02-20",
            event: "Dental Treatment",
            description: "Dental care treatment for family member",
            category: "Claims",
          },
          {
            date: "2024-03-15",
            event: "Medical Consultation",
            description: "Specialist consultation at City Medical Center",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "Maybank Berhad",
          accountNumber: "1234567890123",
          accountHolder: "Ahmad Farid bin Abdullah",
          branchCode: "MB001KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123", // Updated Ahmad Farid's ID
          employeeName: "Ahmad Farid bin Abdullah",
          companyId: "COMP-IND-001",
          companyName: "Individual Corp",
          companyCode: "IND01",
          department: "Information Technology",
          position: "Senior Software Engineer",
          jobGrade: "G7",
          joinDate: "2020-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus"],
        },
      },
      {
        id: "ONBOARD-MEM-002",
        personId: "PER-2025-123", // Updated Ahmad Farid's ID
        membershipNo: "IND-PER-2025-123-02-EXT", // Updated membership number
        planName: "Extended Coverage Plan",
        planCode: "ECP-2024",
        specialTag: "Standard",
        effectiveDate: "2024-06-01",
        expiryDate: "2025-05-31",
        personType: "Employee",
        priority: "Secondary",
        companyId: "COMP-IND-001",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-002",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-458",
            name: "Siti Aishah binti Ahmad",
            idNo: "900101075000", // Updated ID No.
            relationship: "Wife",
            status: "Active",
            membershipNo: "IND-PER-2025-123-02-EXT-DEP01", // Updated membership number
          },
          {
            personId: "PER-2025-460", // Corrected Person ID for Nur Aisyah
            name: "Nur Aisyah binti Ahmad Farid",
            idNo: "140820-14-5678",
            relationship: "Child",
            status: "Active",
            membershipNo: "IND-PER-2025-123-02-EXT-DEP02", // Updated membership number
          },
        ],
        visitHistory: [
          {
            date: "2024-07-10",
            provider: "Specialist Hospital",
            serviceType: "Inpatient",
            amount: "RM 3,200.00",
            status: "Approved",
            claimNo: "CLM-2024-004",
          },
          {
            date: "2024-06-15",
            provider: "Eye Care Center",
            serviceType: "Optical",
            amount: "RM 350.00",
            status: "Approved",
            claimNo: "CLM-2024-005",
          },
        ],
        utilization: [
          {
            serviceType: "Inpatient",
            utilized: "RM 3,200.00",
            limit: "RM 20,000.00",
            remaining: "RM 16,800.00",
            percentage: 16,
          },
          {
            serviceType: "Optical",
            utilized: "RM 350.00",
            limit: "RM 1,200.00",
            remaining: "RM 850.00",
            percentage: 29,
          },
          {
            serviceType: "Outpatient",
            utilized: "RM 0.00",
            limit: "RM 8,000.00",
            remaining: "RM 8,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-06-01",
            event: "Extended Plan Activated",
            description: "Extended Coverage Plan added as secondary coverage",
            category: "Membership",
          },
          {
            date: "2024-06-15",
            event: "Optical Benefit Used",
            description: "Eye examination and glasses for family member",
            category: "Claims",
          },
          {
            date: "2024-07-10",
            event: "Inpatient Treatment",
            description: "Hospital admission for medical treatment",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "CIMB Bank Berhad",
          accountNumber: "9876543210987",
          accountHolder: "Ahmad Farid bin Abdullah",
          branchCode: "CIMB002KL",
          accountType: "Current Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123", // Updated Ahmad Farid's ID
          employeeName: "Ahmad Farid bin Abdullah",
          companyId: "COMP-IND-001",
          companyName: "Individual Corp",
          companyCode: "IND01",
          department: "Information Technology",
          position: "Senior Software Engineer",
          jobGrade: "G7",
          joinDate: "2020-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus", "Extended Medical"],
        },
      },
      // Ahmad Farid covered under Siti Aishah's plan
      {
        id: "ONBOARD-MEM-005",
        personId: "PER-2025-123", // Updated Ahmad Farid's ID
        membershipNo: "GTS-PER-2025-123-03-SPO", // Updated membership number
        planName: "Spouse Coverage Plan",
        planCode: "SCP-2024",
        specialTag: "Premium",
        effectiveDate: "2024-03-01",
        expiryDate: "2025-02-28",
        personType: "Husband",
        priority: "Tertiary",
        companyId: "COMP-GTS-001",
        companyName: "Global Tech Solutions",
        companyCode: "GTS01",
        policyNo: "POL-GTS-003",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-458",
            name: "Siti Aishah binti Ahmad",
            idNo: "900101075000", // Updated ID No.
            relationship: "Wife",
            status: "Active",
            membershipNo: "GTS-PER-2025-458-01-PRI", // Reference Siti Aishah's primary membership
          },
        ],
        visitHistory: [
          {
            date: "2024-09-12",
            provider: "Executive Health Center",
            serviceType: "Outpatient",
            amount: "RM 320.00",
            status: "Approved",
            claimNo: "CLM-2024-011",
          },
          {
            date: "2024-08-05",
            provider: "Premium Dental Clinic",
            serviceType: "Dental",
            amount: "RM 180.00",
            status: "Approved",
            claimNo: "CLM-2024-012",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 850.00",
            limit: "RM 3,000.00",
            remaining: "RM 2,150.00",
            percentage: 28,
          },
          {
            serviceType: "Dental",
            utilized: "RM 380.00",
            limit: "RM 1,500.00",
            remaining: "RM 1,120.00",
            percentage: 25,
          },
          {
            serviceType: "Optical",
            utilized: "RM 0.00",
            limit: "RM 1,000.00",
            remaining: "RM 1,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-03-01",
            event: "Spouse Coverage Activated",
            description: "Covered under Siti Aishah's spouse plan at Global Tech Solutions",
            category: "Membership",
          },
          {
            date: "2024-08-05",
            event: "Premium Dental Care",
            description: "Advanced dental treatment under spouse coverage",
            category: "Claims",
          },
          {
            date: "2024-09-12",
            event: "Executive Health Checkup",
            description: "Comprehensive health screening under spouse plan",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "Hong Leong Bank Berhad",
          accountNumber: "7890123456789",
          accountHolder: "Ahmad Farid bin Abdullah",
          branchCode: "HLB005KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-458", // Siti Aishah's ID
          employeeName: "Siti Aishah binti Ahmad",
          companyId: "COMP-GTS-001",
          companyName: "Global Tech Solutions",
          companyCode: "GTS01",
          department: "Human Resources",
          position: "HR Manager",
          jobGrade: "M3",
          joinDate: "2021-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Sarah Johnson",
          workLocation: "Kuala Lumpur Branch",
          salary: "RM 7,800.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus", "Spouse Coverage"],
        },
      },
    ]

    // Sample membership data for Siti Aishah binti Ahmad (PER-2025-458) - Now as Employee
    const sitiAishahMemberships: OnboardingMembership[] = [
      {
        id: "ONBOARD-MEM-003",
        personId: "PER-2025-458",
        membershipNo: "GTS-PER-2025-458-01-PRI",
        planName: "Executive Health Plan",
        planCode: "EHP-2024",
        specialTag: "Other",
        effectiveDate: "2024-01-01",
        expiryDate: "2024-12-31",
        personType: "Employee",
        priority: "Primary",
        companyId: "COMP-GTS-001",
        companyName: "Global Tech Solutions",
        companyCode: "GTS01",
        policyNo: "POL-GTS-001",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-123", // Updated Ahmad Farid's ID
            name: "Ahmad Farid bin Abdullah",
            idNo: "88888888", // Updated ID No.
            relationship: "Husband",
            status: "Active",
            membershipNo: "GTS-PER-2025-458-01-PRI-DEP01",
          },
        ],
        visitHistory: [
          {
            date: "2024-04-12",
            provider: "Executive Women's Health Clinic",
            serviceType: "Outpatient",
            amount: "RM 280.00",
            status: "Approved",
            claimNo: "CLM-2024-006",
          },
          {
            date: "2024-03-08",
            provider: "Premium Dental Care",
            serviceType: "Dental",
            amount: "RM 150.00",
            status: "Approved",
            claimNo: "CLM-2024-007",
          },
          {
            date: "2024-02-14",
            provider: "Vision Care Center",
            serviceType: "Optical",
            amount: "RM 320.00",
            status: "Approved",
            claimNo: "CLM-2024-008",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 1,450.00",
            limit: "RM 6,000.00",
            remaining: "RM 4,550.00",
            percentage: 24,
          },
          {
            serviceType: "Dental",
            utilized: "RM 350.00",
            limit: "RM 1,500.00",
            remaining: "RM 1,150.00",
            percentage: 23,
          },
          {
            serviceType: "Optical",
            utilized: "RM 320.00",
            limit: "RM 1,200.00",
            remaining: "RM 880.00",
            percentage: 27,
          },
          {
            serviceType: "Inpatient",
            utilized: "RM 0.00",
            limit: "RM 20,000.00",
            remaining: "RM 20,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-01-01",
            event: "Membership Activated",
            description: "Executive Health Plan activated for Siti Aishah as primary employee",
            category: "Membership",
          },
          {
            date: "2024-02-14",
            event: "Vision Care Treatment",
            description: "Comprehensive eye examination and premium lenses",
            category: "Claims",
          },
          {
            date: "2024-03-08",
            event: "Premium Dental Care",
            description: "Advanced dental treatment and whitening",
            category: "Claims",
          },
          {
            date: "2024-04-12",
            event: "Executive Health Screening",
            description: "Comprehensive women's health screening",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "Public Bank Berhad",
          accountNumber: "3456789012345",
          accountHolder: "Siti Aishah binti Ahmad",
          branchCode: "PB003KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-458",
          employeeName: "Siti Aishah binti Ahmad",
          companyId: "COMP-GTS-001",
          companyName: "Global Tech Solutions",
          companyCode: "GTS01",
          department: "Human Resources",
          position: "HR Manager",
          jobGrade: "M3",
          joinDate: "2021-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Sarah Johnson",
          workLocation: "Kuala Lumpur Branch",
          salary: "RM 7,800.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus", "Spouse Coverage"],
        },
      },
      {
        id: "ONBOARD-MEM-004",
        personId: "PER-2025-458",
        membershipNo: "GTS-PER-2025-458-02-EXT",
        planName: "Premium Extended Plan",
        planCode: "PEP-2024",
        specialTag: "Other",
        effectiveDate: "2024-06-01",
        expiryDate: "2025-05-31",
        personType: "Employee",
        priority: "Secondary",
        companyId: "COMP-GTS-001",
        companyName: "Global Tech Solutions",
        companyCode: "GTS01",
        policyNo: "POL-GTS-002",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-123", // Updated Ahmad Farid's ID
            name: "Ahmad Farid bin Abdullah",
            idNo: "88888888", // Updated ID No.
            relationship: "Husband",
            status: "Active",
            membershipNo: "GTS-PER-2025-458-02-EXT-DEP01",
          },
        ],
        visitHistory: [
          {
            date: "2024-08-15",
            provider: "Premium Women's Hospital",
            serviceType: "Inpatient",
            amount: "RM 3,500.00",
            status: "Approved",
            claimNo: "CLM-2024-009",
          },
          {
            date: "2024-07-22",
            provider: "Executive Eye Care",
            serviceType: "Optical",
            amount: "RM 550.00",
            status: "Approved",
            claimNo: "CLM-2024-010",
          },
        ],
        utilization: [
          {
            serviceType: "Inpatient",
            utilized: "RM 3,500.00",
            limit: "RM 25,000.00",
            remaining: "RM 21,500.00",
            percentage: 14,
          },
          {
            serviceType: "Optical",
            utilized: "RM 550.00",
            limit: "RM 1,500.00",
            remaining: "RM 950.00",
            percentage: 37,
          },
          {
            serviceType: "Outpatient",
            utilized: "RM 0.00",
            limit: "RM 10,000.00",
            remaining: "RM 10,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-06-01",
            event: "Premium Plan Activated",
            description: "Premium Extended Plan added for enhanced coverage",
            category: "Membership",
          },
          {
            date: "2024-07-22",
            event: "Executive Optical Care",
            description: "Premium eye treatment with advanced technology",
            category: "Claims",
          },
          {
            date: "2024-08-15",
            event: "Premium Inpatient Care",
            description: "Specialized treatment at premium women's hospital",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "RHB Bank Berhad",
          accountNumber: "5678901234567",
          accountHolder: "Siti Aishah binti Ahmad",
          branchCode: "RHB004KL",
          accountType: "Current Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-458",
          employeeName: "Siti Aishah binti Ahmad",
          companyId: "COMP-GTS-001",
          companyName: "Global Tech Solutions",
          companyCode: "GTS01",
          department: "Human Resources",
          position: "HR Manager",
          jobGrade: "M3",
          joinDate: "2021-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Sarah Johnson",
          workLocation: "Kuala Lumpur Branch",
          salary: "RM 7,800.00",
          benefits: [
            "Medical Insurance",
            "Dental Coverage",
            "Annual Leave",
            "Performance Bonus",
            "Spouse Coverage",
            "Premium Extended",
          ],
        },
      },
      // NEW: Add Siti Aishah as Employee with Corporate Standard Plan
      {
        id: "ONBOARD-MEM-009",
        personId: "PER-2025-458",
        membershipNo: "GTS-PER-2025-458-03-PRI",
        planName: "Corporate Standard Plan",
        planCode: "CORP-STANDARD-2024",
        specialTag: "Corporate",
        effectiveDate: "2024-01-01",
        expiryDate: "2024-12-31",
        personType: "Employee",
        priority: "Tertiary",
        companyId: "COMP-GTS-001",
        companyName: "Global Tech Solutions",
        companyCode: "GTS01",
        policyNo: "POL-GTS-004",
        status: "Active",
        familyMembers: [],
        visitHistory: [
          {
            date: "2024-05-01",
            provider: "Corporate Wellness Clinic",
            serviceType: "Outpatient",
            amount: "RM 180.00",
            status: "Approved",
            claimNo: "CLM-2024-019",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 180.00",
            limit: "RM 5,000.00",
            remaining: "RM 4,820.00",
            percentage: 3.6,
          },
        ],
        personJourney: [
          {
            date: "2024-01-01",
            event: "Corporate Plan Activated",
            description: "Corporate Standard Plan activated as employee coverage",
            category: "Membership",
          },
        ],
        bankInfo: {
          bankName: "Public Bank Berhad",
          accountNumber: "3456789012345",
          accountHolder: "Siti Aishah binti Ahmad",
          branchCode: "PB003KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-458",
          employeeName: "Siti Aishah binti Ahmad",
          companyId: "COMP-GTS-001",
          companyName: "Global Tech Solutions",
          companyCode: "GTS01",
          department: "Human Resources",
          position: "HR Manager",
          jobGrade: "M3",
          joinDate: "2021-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Sarah Johnson",
          workLocation: "Kuala Lumpur Branch",
          salary: "RM 7,800.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus", "Spouse Coverage"],
        },
      },
      // NEW: Add Siti Aishah as Wife under Ahmad Farid's plan
      {
        id: "ONBOARD-MEM-010",
        personId: "PER-2025-458",
        membershipNo: "IND-PER-2025-458-04-SPO",
        planName: "Spouse Dependent Plan",
        planCode: "SPD-2024",
        specialTag: "Family",
        effectiveDate: "2024-01-01",
        expiryDate: "2024-12-31",
        personType: "Wife",
        priority: "Quaternary",
        companyId: "COMP-IND-001",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-123", // Updated Ahmad Farid's ID
            name: "Ahmad Farid bin Abdullah",
            idNo: "88888888", // Updated ID No.
            relationship: "Husband",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI", // Reference Ahmad Farid's primary membership
          },
        ],
        visitHistory: [
          {
            date: "2024-06-10",
            provider: "Family Dental Clinic",
            serviceType: "Dental",
            amount: "RM 150.00",
            status: "Approved",
            claimNo: "CLM-2024-020",
          },
        ],
        utilization: [
          {
            serviceType: "Dental",
            utilized: "RM 150.00",
            limit: "RM 1,000.00",
            remaining: "RM 850.00",
            percentage: 15,
          },
        ],
        personJourney: [
          {
            date: "2024-01-01",
            event: "Dependent Coverage Started",
            description: "Covered as spouse under Ahmad Farid's plan",
            category: "Membership",
          },
        ],
        bankInfo: {
          bankName: "Maybank Berhad",
          accountNumber: "1234567890123",
          accountHolder: "Ahmad Farid bin Abdullah",
          branchCode: "MB001KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123", // Updated Ahmad Farid's ID
          employeeName: "Ahmad Farid bin Abdullah",
          companyId: "COMP-IND-001",
          companyName: "Individual Corp",
          companyCode: "IND01",
          department: "Information Technology",
          position: "Senior Software Engineer",
          jobGrade: "G7",
          joinDate: "2020-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus"],
        },
      },
    ]

    // Additional memberships for Siti Aishah where she's covered under Ahmad Farid's plans
    const sitiAishahCoveredMemberships: OnboardingMembership[] = [
      // Covered under Ahmad Farid's Comprehensive Health Plan
      {
        id: "ONBOARD-MEM-006",
        personId: "PER-2025-458",
        membershipNo: "IND-PER-2025-458-03-DEP",
        planName: "Comprehensive Health Plan",
        planCode: "CHP-2024",
        specialTag: "VIP",
        effectiveDate: "2024-01-01",
        expiryDate: "2024-12-31",
        personType: "Wife",
        priority: "Quinary",
        companyId: "COMP-IND-001",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-123", // Updated Ahmad Farid's ID
            name: "Ahmad Farid bin Abdullah",
            idNo: "88888888", // Updated ID No.
            relationship: "Husband",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI", // Reference Ahmad Farid's primary membership
          },
          {
            personId: "PER-2025-460", // Corrected Person ID for Nur Aisyah
            name: "Nur Aisyah binti Ahmad Farid",
            idNo: "140820-14-5678",
            relationship: "Child",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI-DEP02", // Reference Ahmad Farid's child membership
          },
          {
            personId: "PER-2025-461", // Corrected Person ID for Ahmad Arif
            name: "Ahmad Arif bin Ahmad Farid",
            idNo: "170612-14-9012",
            relationship: "Child",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI-DEP03", // Reference Ahmad Farid's child membership
          },
        ],
        visitHistory: [
          {
            date: "2024-05-20",
            provider: "Family Health Center",
            serviceType: "Outpatient",
            amount: "RM 120.00",
            status: "Approved",
            claimNo: "CLM-2024-013",
          },
          {
            date: "2024-04-18",
            provider: "Community Dental Clinic",
            serviceType: "Dental",
            amount: "RM 85.00",
            status: "Approved",
            claimNo: "CLM-2024-014",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 450.00",
            limit: "RM 5,000.00",
            remaining: "RM 4,550.00",
            percentage: 9,
          },
          {
            serviceType: "Dental",
            utilized: "RM 185.00",
            limit: "RM 1,000.00",
            remaining: "RM 815.00",
            percentage: 19,
          },
          {
            serviceType: "Optical",
            utilized: "RM 0.00",
            limit: "RM 800.00",
            remaining: "RM 800.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-01-01",
            event: "Dependent Coverage Started",
            description: "Covered as spouse under Ahmad Farid's Comprehensive Health Plan",
            category: "Membership",
          },
          {
            date: "2024-04-18",
            event: "Dental Care",
            description: "Routine dental treatment under spouse coverage",
            category: "Claims",
          },
          {
            date: "2024-05-20",
            event: "Family Health Visit",
            description: "Outpatient consultation under family plan",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "Maybank Berhad",
          accountNumber: "1234567890123",
          accountHolder: "Ahmad Farid bin Abdullah",
          branchCode: "MB001KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123", // Updated Ahmad Farid's ID
          employeeName: "Ahmad Farid bin Abdullah",
          companyId: "COMP-IND-001",
          companyName: "Individual Corp",
          companyCode: "IND01",
          department: "Information Technology",
          position: "Senior Software Engineer",
          jobGrade: "G7",
          joinDate: "2020-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus"],
        },
      },
      // Covered under Ahmad Farid's Extended Coverage Plan
      {
        id: "ONBOARD-MEM-007",
        personId: "PER-2025-458",
        membershipNo: "IND-PER-2025-458-04-EXT",
        planName: "Extended Coverage Plan",
        planCode: "ECP-2024",
        specialTag: "Standard",
        effectiveDate: "2024-06-01",
        expiryDate: "2025-05-31",
        personType: "Wife",
        priority: "Senary",
        companyId: "COMP-IND-001",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-002",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-123", // Updated Ahmad Farid's ID
            name: "Ahmad Farid bin Abdullah",
            idNo: "88888888", // Updated ID No.
            relationship: "Husband",
            status: "Active",
            membershipNo: "IND-PER-2025-123-02-EXT", // Reference Ahmad Farid's extended membership
          },
          {
            personId: "PER-2025-460", // Corrected Person ID for Nur Aisyah
            name: "Nur Aisyah binti Ahmad Farid",
            idNo: "140820-14-5678",
            relationship: "Child",
            status: "Active",
            membershipNo: "IND-PER-2025-123-02-EXT-DEP02", // Reference Ahmad Farid's child membership
          },
        ],
        visitHistory: [
          {
            date: "2024-09-10",
            provider: "Advanced Medical Center",
            serviceType: "Outpatient",
            amount: "RM 280.00",
            status: "Approved",
            claimNo: "CLM-2024-015",
          },
          {
            date: "2024-08-25",
            provider: "Optical Care Plus",
            serviceType: "Optical",
            amount: "RM 200.00",
            status: "Approved",
            claimNo: "CLM-2024-016",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 680.00",
            limit: "RM 8,000.00",
            remaining: "RM 7,320.00",
            percentage: 9,
          },
          {
            serviceType: "Optical",
            utilized: "RM 200.00",
            limit: "RM 1,200.00",
            remaining: "RM 1,000.00",
            percentage: 17,
          },
          {
            serviceType: "Inpatient",
            utilized: "RM 0.00",
            limit: "RM 20,000.00",
            remaining: "RM 20,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-06-01",
            event: "Extended Coverage Added",
            description: "Added to Ahmad Farid's Extended Coverage Plan as spouse",
            category: "Membership",
          },
          {
            date: "2024-08-25",
            event: "Optical Treatment",
            description: "Eye care treatment under extended coverage",
            category: "Claims",
          },
          {
            date: "2024-09-10",
            event: "Advanced Medical Care",
            description: "Specialist consultation under extended plan",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "CIMB Bank Berhad",
          accountNumber: "9876543210987",
          accountHolder: "Ahmad Farid bin Abdullah",
          branchCode: "CIMB002KL",
          accountType: "Current Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123", // Updated Ahmad Farid's ID
          employeeName: "Ahmad Farid bin Abdullah",
          companyId: "COMP-IND-001",
          companyName: "Individual Corp",
          companyCode: "IND01",
          department: "Information Technology",
          position: "Senior Software Engineer",
          jobGrade: "G7",
          joinDate: "2020-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus", "Extended Medical"],
        },
      },
      // Covered under Ahmad Farid's Supplementary Plan
      {
        id: "ONBOARD-MEM-008",
        personId: "PER-2025-458",
        membershipNo: "IND-PER-2025-458-05-SUPP",
        planName: "Supplementary Benefits Plan",
        planCode: "SBP-2024",
        specialTag: "Other",
        effectiveDate: "2024-09-01",
        expiryDate: "2025-08-31",
        personType: "Wife",
        priority: "Septenary",
        companyId: "COMP-IND-001",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-003",
        status: "Active",
        familyMembers: [
          {
            personId: "PER-2025-123", // Updated Ahmad Farid's ID
            name: "Ahmad Farid bin Abdullah",
            idNo: "88888888", // Updated ID No.
            relationship: "Husband",
            status: "Active",
            membershipNo: "IND-PER-2025-123-01-PRI", // Reference Ahmad Farid's primary membership
          },
        ],
        visitHistory: [
          {
            date: "2024-10-15",
            provider: "Wellness & Preventive Center",
            serviceType: "Preventive Care",
            amount: "RM 180.00",
            status: "Approved",
            claimNo: "CLM-2024-017",
          },
          {
            date: "2024-09-28",
            provider: "Alternative Medicine Clinic",
            serviceType: "Alternative Medicine",
            amount: "RM 120.00",
            status: "Approved",
            claimNo: "CLM-2024-018",
          },
        ],
        utilization: [
          {
            serviceType: "Preventive Care",
            utilized: "RM 300.00",
            limit: "RM 2,000.00",
            remaining: "RM 1,700.00",
            percentage: 15,
          },
          {
            serviceType: "Alternative Medicine",
            utilized: "RM 120.00",
            limit: "RM 1,000.00",
            remaining: "RM 880.00",
            percentage: 12,
          },
          {
            serviceType: "Mental Health",
            utilized: "RM 0.00",
            limit: "RM 3,000.00",
            remaining: "RM 3,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-09-01",
            event: "Supplementary Coverage Added",
            description: "Added to Ahmad Farid's Supplementary Benefits Plan as spouse",
            category: "Membership",
          },
          {
            date: "2024-09-28",
            event: "Alternative Medicine",
            description: "Traditional medicine treatment under supplementary plan",
            category: "Claims",
          },
          {
            date: "2024-10-15",
            event: "Preventive Care",
            description: "Wellness program participation under supplementary coverage",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "Public Bank Berhad",
          accountNumber: "5555666677888",
          accountHolder: "Ahmad Farid bin Abdullah",
          branchCode: "PB003KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123", // Updated Ahmad Farid's ID
          employeeName: "Ahmad Farid bin Abdullah",
          companyId: "COMP-IND-001",
          companyName: "Individual Corp",
          companyCode: "IND01",
          department: "Information Technology",
          position: "Senior Software Engineer",
          jobGrade: "G7",
          joinDate: "2020-03-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Dato' Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: [
            "Medical Insurance",
            "Dental Coverage",
            "Annual Leave",
            "Performance Bonus",
            "Supplementary Benefits",
          ],
        },
      },
    ]

    // Combine all of Siti Aishah's memberships (her own + covered under husband's plans)
    const allSitiAishahMemberships = [...sitiAishahMemberships, ...sitiAishahCoveredMemberships]

    // Combine all memberships
    const allMemberships = [...ahmadFaridMemberships, ...allSitiAishahMemberships]

    // Sample membership data for Osas (PER-2025-123) - Updated to MYR currency
    const osasMemberships: OnboardingMembership[] = [
      {
        id: "ONBOARD-MEM-OSAS-001",
        personId: "PER-2025-123",
        membershipNo: "MYS-PER-2025-123-01-PRI",
        planName: "Malaysia Premium Health Plan",
        planCode: "TPH-2024",
        specialTag: "Other",
        effectiveDate: "2024-01-15",
        expiryDate: "2025-01-14",
        personType: "Employee",
        priority: "Primary",
        companyId: "COMP-MYS-001",
        companyName: "Malaysia Corp",
        companyCode: "MYS01",
        policyNo: "POL-MYS-001",
        status: "Active",
        familyMembers: [],
        visitHistory: [
          {
            date: "2024-04-10",
            provider: "Kuala Lumpur Medical Center",
            serviceType: "Outpatient",
            amount: "RM 350.00",
            status: "Approved",
            claimNo: "CLM-2024-MYS-001",
          },
          {
            date: "2024-03-05",
            provider: "Dental Excellence KL",
            serviceType: "Dental",
            amount: "RM 220.00",
            status: "Approved",
            claimNo: "CLM-2024-MYS-002",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 350.00",
            limit: "RM 5,000.00",
            remaining: "RM 4,650.00",
            percentage: 7,
          },
          {
            serviceType: "Dental",
            utilized: "RM 220.00",
            limit: "RM 1,000.00",
            remaining: "RM 780.00",
            percentage: 22,
          },
          {
            serviceType: "Optical",
            utilized: "RM 0.00",
            limit: "RM 800.00",
            remaining: "RM 800.00",
            percentage: 0,
          },
          {
            serviceType: "Inpatient",
            utilized: "RM 0.00",
            limit: "RM 20,000.00",
            remaining: "RM 20,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-01-15",
            event: "Membership Activated",
            description: "Malaysia Premium Health Plan activated for Osas",
            category: "Membership",
          },
          {
            date: "2024-03-05",
            event: "First Claim Submitted",
            description: "Dental treatment at Dental Excellence KL",
            category: "Claims",
          },
          {
            date: "2024-04-10",
            event: "Medical Consultation",
            description: "Outpatient visit at Kuala Lumpur Medical Center",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "Maybank Berhad",
          accountNumber: "987654321098",
          accountHolder: "Osas",
          branchCode: "MB001KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123",
          employeeName: "Osas",
          companyId: "COMP-MYS-001",
          companyName: "Malaysia Corp",
          companyCode: "MYS01",
          department: "Marketing",
          position: "Marketing Manager",
          jobGrade: "M2",
          joinDate: "2023-11-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: ["Medical Insurance", "Dental Coverage", "Annual Leave", "Performance Bonus"],
        },
      },
      {
        id: "ONBOARD-MEM-OSAS-002",
        personId: "PER-2025-123",
        membershipNo: "MYS-PER-2025-123-02-EXT",
        planName: "Malaysia Executive Extension Plan",
        planCode: "TEE-2024",
        specialTag: "Other",
        effectiveDate: "2024-02-01",
        expiryDate: "2025-01-31",
        personType: "Employee",
        priority: "Secondary",
        companyId: "COMP-MYS-001",
        companyName: "Malaysia Corp",
        companyCode: "MYS01",
        policyNo: "POL-MYS-002",
        status: "Active",
        familyMembers: [],
        visitHistory: [
          {
            date: "2024-04-25",
            provider: "Executive Health Clinic KL",
            serviceType: "Outpatient",
            amount: "RM 580.00",
            status: "Approved",
            claimNo: "CLM-2024-MYS-003",
          },
        ],
        utilization: [
          {
            serviceType: "Outpatient",
            utilized: "RM 580.00",
            limit: "RM 10,000.00",
            remaining: "RM 9,420.00",
            percentage: 5.8,
          },
          {
            serviceType: "Inpatient",
            utilized: "RM 0.00",
            limit: "RM 50,000.00",
            remaining: "RM 50,000.00",
            percentage: 0,
          },
          {
            serviceType: "Wellness",
            utilized: "RM 0.00",
            limit: "RM 2,000.00",
            remaining: "RM 2,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-02-01",
            event: "Executive Plan Activated",
            description: "Malaysia Executive Extension Plan added as secondary coverage",
            category: "Membership",
          },
          {
            date: "2024-04-25",
            event: "Executive Health Check",
            description: "Comprehensive health screening at Executive Health Clinic",
            category: "Claims",
          },
        ],
        bankInfo: {
          bankName: "CIMB Bank Berhad",
          accountNumber: "123456789012",
          accountHolder: "Osas",
          branchCode: "CIMB002KL",
          accountType: "Current Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123",
          employeeName: "Osas",
          companyId: "COMP-MYS-001",
          companyName: "Malaysia Corp",
          companyCode: "MYS01",
          department: "Marketing",
          position: "Marketing Manager",
          jobGrade: "M2",
          joinDate: "2023-11-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: [
            "Medical Insurance",
            "Dental Coverage",
            "Annual Leave",
            "Performance Bonus",
            "Executive Health Plan",
          ],
        },
      },
      {
        id: "ONBOARD-MEM-OSAS-003",
        personId: "PER-2025-123",
        membershipNo: "MYS-PER-2025-123-03-SUPP",
        planName: "Malaysia International Coverage Plan",
        planCode: "TIC-2024",
        specialTag: "Other",
        effectiveDate: "2024-03-15",
        expiryDate: "2025-03-14",
        personType: "Employee",
        priority: "Tertiary",
        companyId: "COMP-MYS-001",
        companyName: "Malaysia Corp",
        companyCode: "MYS01",
        policyNo: "POL-MYS-003",
        status: "Active",
        familyMembers: [],
        visitHistory: [],
        utilization: [
          {
            serviceType: "International Coverage",
            utilized: "RM 0.00",
            limit: "RM 100,000.00",
            remaining: "RM 100,000.00",
            percentage: 0,
          },
          {
            serviceType: "Emergency Evacuation",
            utilized: "RM 0.00",
            limit: "RM 50,000.00",
            remaining: "RM 50,000.00",
            percentage: 0,
          },
        ],
        personJourney: [
          {
            date: "2024-03-15",
            event: "International Plan Activated",
            description: "Malaysia International Coverage Plan added for overseas travel",
            category: "Membership",
          },
        ],
        bankInfo: {
          bankName: "Public Bank Berhad",
          accountNumber: "456789012345",
          accountHolder: "Osas",
          branchCode: "PB003KL",
          accountType: "Savings Account",
        },
        employmentInfo: {
          employeeId: "PER-2025-123",
          employeeName: "Osas",
          companyId: "COMP-MYS-001",
          companyName: "Malaysia Corp",
          companyCode: "MYS01",
          department: "Marketing",
          position: "Marketing Manager",
          jobGrade: "M2",
          joinDate: "2023-11-01",
          employmentType: "Full Time",
          employmentStatus: "Active",
          reportingManager: "Ahmad Rahman",
          workLocation: "Kuala Lumpur HQ",
          salary: "RM 8,500.00",
          benefits: [
            "Medical Insurance",
            "Dental Coverage",
            "Annual Leave",
            "Performance Bonus",
            "International Coverage",
          ],
        },
      },
    ]

    // Add Osas's memberships to the allMemberships array
    allMemberships.push(...osasMemberships)

    // Create employment data for Osas - Updated to MYR currency
    const osasEmployment = {
      employeeId: "PER-2025-123",
      employeeName: "Osas",
      companyId: "COMP-MYS-001",
      companyName: "Malaysia Corp",
      companyCode: "MYS01",
      department: "Marketing",
      position: "Marketing Manager",
      jobGrade: "M2",
      joinDate: "2023-11-01",
      employmentType: "Full Time",
      employmentStatus: "Active",
      reportingManager: "Ahmad Rahman",
      workLocation: "Kuala Lumpur HQ",
      salary: "RM 8,500.00",
      benefits: [
        "Medical Insurance",
        "Dental Coverage",
        "Annual Leave",
        "Performance Bonus",
        "International Coverage",
        "Executive Health Plan",
      ],
    }

    // Add Osas's employment data to the employmentData array
    employmentData.push(osasEmployment)

    // Save all membership and employment data including Osas's data
    saveOnboardingMemberships(allMemberships)
    saveOnboardingEmploymentInfo(employmentData)
  }
}

// Function to save updated membership order
export const saveUpdatedMembershipOrder = (personId: string, updatedMemberships: OnboardingMembership[]): void => {
  if (typeof window === "undefined") {
    return
  }

  try {
    const allMemberships = getOnboardingMemberships()
    // Remove old memberships for this person
    const otherMemberships = allMemberships.filter((m) => m.personId !== personId)
    // Add updated memberships
    const newAllMemberships = [...otherMemberships, ...updatedMemberships]
    localStorage.setItem("onboardingMemberships", JSON.stringify(newAllMemberships))
  } catch (error) {
    console.error("Error saving updated membership order:", error)
  }
}
