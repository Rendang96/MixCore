// Define types for policy data
export interface PolicyBasicInfo {
  id: string
  policyNumber: string
  policyName: string
  fundingType: string
  policyTerm: string
  effectiveDate: string
  expiryDate: string
  payor: string
  status: string
  product?: string
}

export interface PolicyRuleInfo {
  catalogueCode: string
  catalogueName: string
  catalogueDescription: string
  preExistingConditions: any[]
  specifiedIllnesses: any[]
  congenitalConditions: any[]
  exclusions: any[]
}

export interface ServiceTypeInfo {
  serviceTypes: any[]
}

export interface ContactInfo {
  contacts: any[]
}

export interface CompletePolicy extends PolicyBasicInfo {
  policyRule?: PolicyRuleInfo
  serviceType?: ServiceTypeInfo
  contactInfo?: ContactInfo
}

// Local storage keys
const POLICIES_KEY = "policies"
const POLICY_RULE_PREFIX = "policy_rule_"
const SERVICE_TYPE_PREFIX = "service_type_"
const CONTACT_INFO_PREFIX = "contact_info_"

// Dummy data for policies
const dummyPolicies: CompletePolicy[] = [
  {
    id: "pol-001",
    policyNumber: "POL-2024-001",
    policyName: "Corporate Health Plan - Premium",
    fundingType: "Fully Insured",
    policyTerm: "Annual",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
    payor: "ABC Insurance",
    status: "Active",
    product: "Comprehensive Health Insurance",
    policyRule: {
      catalogueCode: "CAT-001",
      catalogueName: "Standard Health Catalogue",
      catalogueDescription: "Standard health benefits for corporate clients",
      preExistingConditions: [
        { code: "PEC-001", name: "Diabetes", waitingPeriod: "12 months" },
        { code: "PEC-002", name: "Hypertension", waitingPeriod: "6 months" },
      ],
      specifiedIllnesses: [
        { code: "SI-001", name: "Cancer", coverage: "Full after 24 months" },
        { code: "SI-002", name: "Heart Disease", coverage: "Full after 12 months" },
      ],
      congenitalConditions: [{ code: "CC-001", name: "Down Syndrome", coverage: "Limited to $10,000" }],
      exclusions: [
        { code: "EX-001", name: "Cosmetic Surgery", description: "Unless medically necessary" },
        { code: "EX-002", name: "Experimental Treatments", description: "Not approved by regulatory bodies" },
      ],
    },
    serviceType: {
      serviceTypes: [
        { code: "GP", name: "General Practitioner", coverage: "100%" },
        { code: "SP", name: "Specialist", coverage: "80%" },
        { code: "HP", name: "Hospitalization", coverage: "100%" },
      ],
    },
    contactInfo: {
      contacts: [
        {
          id: "cont-001",
          name: "John Smith",
          role: "Account Manager",
          email: "john.smith@abcinsurance.com",
          phone: "+1-555-123-4567",
        },
        {
          id: "cont-002",
          name: "Sarah Johnson",
          role: "Claims Specialist",
          email: "sarah.johnson@abcinsurance.com",
          phone: "+1-555-987-6543",
        },
      ],
    },
  },
  {
    id: "pol-002",
    policyNumber: "POL-2024-002",
    policyName: "Executive Health Plan",
    fundingType: "Self-Funded",
    policyTerm: "Annual",
    effectiveDate: "2024-02-15",
    expiryDate: "2025-02-14",
    payor: "XYZ Corporation",
    status: "Active",
    product: "Comprehensive Health Insurance",
    policyRule: {
      catalogueCode: "CAT-002",
      catalogueName: "Executive Health Catalogue",
      catalogueDescription: "Premium health benefits for executive staff",
      preExistingConditions: [{ code: "PEC-001", name: "All pre-existing conditions", waitingPeriod: "6 months" }],
      specifiedIllnesses: [{ code: "SI-001", name: "All specified illnesses", coverage: "Full after 12 months" }],
      congenitalConditions: [{ code: "CC-001", name: "All congenital conditions", coverage: "Full coverage" }],
      exclusions: [{ code: "EX-001", name: "Cosmetic Surgery", description: "Unless medically necessary" }],
    },
    serviceType: {
      serviceTypes: [
        { code: "GP", name: "General Practitioner", coverage: "100%" },
        { code: "SP", name: "Specialist", coverage: "100%" },
        { code: "OC", name: "Outpatient Care", coverage: "100%" },
        { code: "DT", name: "Dental", coverage: "100% up to $3,000" },
      ],
    },
    contactInfo: {
      contacts: [
        {
          id: "cont-003",
          name: "Michael Wong",
          role: "Executive Account Manager",
          email: "michael.wong@xyzcorp.com",
          phone: "+1-555-222-3333",
        },
      ],
    },
  },
  {
    id: "pol-003",
    policyNumber: "POL-2024-003",
    policyName: "Standard Dental Plan",
    fundingType: "Fully Insured",
    policyTerm: "Annual",
    effectiveDate: "2024-03-01",
    expiryDate: "2025-02-28",
    payor: "Dental Care Inc.",
    status: "Active",
    product: "Dental Care Premium",
    policyRule: {
      catalogueCode: "CAT-003",
      catalogueName: "Standard Dental Catalogue",
      catalogueDescription: "Standard dental benefits for all employees",
      preExistingConditions: [],
      specifiedIllnesses: [],
      congenitalConditions: [],
      exclusions: [
        { code: "EX-001", name: "Cosmetic Dental Procedures", description: "Unless medically necessary" },
        { code: "EX-002", name: "Orthodontic Treatment for Adults", description: "Unless specified in plan" },
      ],
    },
    serviceType: {
      serviceTypes: [
        { code: "DT", name: "Dental", coverage: "100%" },
        { code: "OC", name: "Outpatient Care", coverage: "80% for dental-related consultations" },
      ],
    },
    contactInfo: {
      contacts: [
        {
          id: "cont-004",
          name: "Lisa Chen",
          role: "Dental Plan Coordinator",
          email: "lisa.chen@dentalcare.com",
          phone: "+1-555-444-5555",
        },
      ],
    },
  },
  {
    id: "pol-004",
    policyNumber: "POL-2024-004",
    policyName: "Vision Care Plan",
    fundingType: "Fully Insured",
    policyTerm: "Annual",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
    payor: "Vision Plus",
    status: "Active",
    product: "Vision Protection Plan",
    policyRule: {
      catalogueCode: "CAT-004",
      catalogueName: "Vision Care Catalogue",
      catalogueDescription: "Vision benefits for all employees",
      preExistingConditions: [],
      specifiedIllnesses: [],
      congenitalConditions: [],
      exclusions: [{ code: "EX-001", name: "LASIK Surgery", description: "Not covered under standard plan" }],
    },
    serviceType: {
      serviceTypes: [
        { code: "SP", name: "Specialist", coverage: "100% for ophthalmologists" },
        { code: "OC", name: "Outpatient Care", coverage: "100% for vision-related consultations" },
        { code: "SG", name: "Surgery", coverage: "80% for specific vision correction procedures" },
      ],
    },
    contactInfo: {
      contacts: [
        {
          id: "cont-005",
          name: "Robert Kim",
          role: "Vision Plan Administrator",
          email: "robert.kim@visionplus.com",
          phone: "+1-555-666-7777",
        },
      ],
    },
  },
  {
    id: "pol-005",
    policyNumber: "POL-2024-005",
    policyName: "Group Life Insurance",
    fundingType: "Fully Insured",
    policyTerm: "Annual",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
    payor: "Life Secure Insurance",
    status: "Active",
    product: "Life Insurance Basic",
    policyRule: {
      catalogueCode: "CAT-005",
      catalogueName: "Life Insurance Catalogue",
      catalogueDescription: "Group life insurance for all employees",
      preExistingConditions: [],
      specifiedIllnesses: [],
      congenitalConditions: [],
      exclusions: [
        { code: "EX-001", name: "Suicide", description: "Within first 2 years of coverage" },
        { code: "EX-002", name: "War or Act of War", description: "Direct participation" },
      ],
    },
    serviceType: {
      serviceTypes: [
        { code: "HP", name: "Hospitalization", coverage: "Terminal illness benefit" },
        { code: "SG", name: "Surgery", coverage: "Accidental dismemberment benefit" },
      ],
    },
    contactInfo: {
      contacts: [
        {
          id: "cont-006",
          name: "Amanda Rodriguez",
          role: "Life Insurance Specialist",
          email: "amanda.rodriguez@lifesecure.com",
          phone: "+1-555-888-9999",
        },
      ],
    },
  },
  {
    id: "pol-006",
    policyNumber: "POL-2024-006",
    policyName: "Prudential Enhanced Medical Care",
    fundingType: "Fully Insured",
    policyTerm: "Annual",
    effectiveDate: "2024-06-01",
    expiryDate: "2025-05-31",
    payor: "Prudential Assurance Malaysia Berhad",
    status: "Active",
    product: "PruWorks",
    policyRule: {
      catalogueCode: "CAT-006",
      catalogueName: "Enhanced Medical Care Catalogue",
      catalogueDescription: "Comprehensive medical benefits with enhanced coverage for corporate clients",
      preExistingConditions: [
        { code: "PEC-001", name: "Diabetes", waitingPeriod: "6 months" },
        { code: "PEC-002", name: "Hypertension", waitingPeriod: "3 months" },
        { code: "PEC-003", name: "Heart Disease", waitingPeriod: "12 months" },
      ],
      specifiedIllnesses: [
        { code: "SI-001", name: "Cancer", coverage: "Full after 12 months" },
        { code: "SI-002", name: "Stroke", coverage: "Full after 6 months" },
        { code: "SI-003", name: "Kidney Failure", coverage: "Full after 12 months" },
      ],
      congenitalConditions: [
        { code: "CC-001", name: "Congenital Heart Disease", coverage: "Full coverage from day 1" },
        { code: "CC-002", name: "Cleft Palate", coverage: "Up to $25,000" },
      ],
      exclusions: [
        { code: "EX-001", name: "Cosmetic Surgery", description: "Unless medically necessary" },
        { code: "EX-002", name: "Experimental Treatments", description: "Not approved by regulatory bodies" },
        { code: "EX-003", name: "War and Terrorism", description: "Direct participation or acts of war" },
      ],
    },
    serviceType: {
      serviceTypes: [
        { code: "HP", name: "Hospitalization", coverage: "100%" },
        { code: "SG", name: "Surgery", coverage: "100%" },
        { code: "MT", name: "Maternity", coverage: "100% after 10 months" },
      ],
    },
    contactInfo: {
      contacts: [
        {
          id: "cont-007",
          name: "Tan Wei Liang",
          role: "Senior Account Manager",
          email: "weiliang.tan@prudential.com.my",
          phone: "+60-3-2170-8888",
        },
        {
          id: "cont-008",
          name: "Dr. Siti Aminah Binti Ahmad",
          role: "Medical Advisor",
          email: "aminah.ahmad@prudential.com.my",
          phone: "+60-3-2170-8899",
        },
        {
          id: "cont-009",
          name: "Raj Kumar Patel",
          role: "Claims Manager",
          email: "raj.patel@prudential.com.my",
          phone: "+60-3-2170-8877",
        },
      ],
    },
  },
  {
    id: "pol-007",
    policyNumber: "POL-2024-007",
    policyName: "PMC Medical Care",
    fundingType: "Self-Funded",
    policyTerm: "Annual",
    effectiveDate: "2024-07-01",
    expiryDate: "2025-06-30",
    payor: "PMCare Sdn Bhd",
    status: "Active",
    product: "Comprehensive Health Insurance",
    policyRule: {
      catalogueCode: "CAT-007",
      catalogueName: "PMC Medical Care Catalogue",
      catalogueDescription:
        "Comprehensive medical care benefits managed by PMCare with focus on primary and specialist care",
      preExistingConditions: [
        { code: "PEC-001", name: "Diabetes", waitingPeriod: "9 months" },
        { code: "PEC-002", name: "Hypertension", waitingPeriod: "6 months" },
        { code: "PEC-003", name: "Chronic Kidney Disease", waitingPeriod: "12 months" },
      ],
      specifiedIllnesses: [
        { code: "SI-001", name: "Cancer", coverage: "Full after 18 months" },
        { code: "SI-002", name: "Heart Disease", coverage: "Full after 12 months" },
        { code: "SI-003", name: "Stroke", coverage: "Full after 9 months" },
      ],
      congenitalConditions: [
        { code: "CC-001", name: "Congenital Heart Disease", coverage: "Limited to $15,000" },
        { code: "CC-002", name: "Spina Bifida", coverage: "Up to $20,000" },
      ],
      exclusions: [
        { code: "EX-001", name: "Cosmetic Surgery", description: "Unless medically necessary" },
        { code: "EX-002", name: "Experimental Treatments", description: "Not approved by regulatory bodies" },
        { code: "EX-003", name: "Self-inflicted Injuries", description: "Intentional self-harm" },
      ],
    },
    serviceType: {
      serviceTypes: [
        { code: "GP", name: "General Practitioner", coverage: "100%" },
        { code: "SP", name: "Specialist", coverage: "85%" },
        { code: "OC", name: "Outpatient Care", coverage: "90%" },
        { code: "DT", name: "Dental", coverage: "75% up to $2,000" },
      ],
    },
    contactInfo: {
      contacts: [
        {
          id: "cont-010",
          name: "Dato' Ahmad Zaki Ismail",
          role: "Chief Executive Officer",
          email: "zaki.ismail@pmcare.com.my",
          phone: "+60-3-6201-2000",
        },
        {
          id: "cont-011",
          name: "Dr. Sarah Lim Wei Ming",
          role: "Chief Medical Officer",
          email: "sarah.lim@pmcare.com.my",
          phone: "+60-3-6201-2001",
        },
        {
          id: "cont-012",
          name: "Mohd Hafiz Rahman",
          role: "Head of Claims Management",
          email: "hafiz.rahman@pmcare.com.my",
          phone: "+60-3-6201-2002",
        },
      ],
    },
  },
]

// Initialize policies in localStorage if not already present
function initializePolicies(): void {
  if (!localStorage.getItem(POLICIES_KEY)) {
    localStorage.setItem(POLICIES_KEY, JSON.stringify(dummyPolicies))
  }
}

// Save basic policy information
export function saveBasicPolicyInfo(policy: PolicyBasicInfo): void {
  // Initialize policies if needed
  initializePolicies()

  const policies = getPolicies()
  const existingIndex = policies.findIndex((p) => p.id === policy.id)

  if (existingIndex >= 0) {
    policies[existingIndex] = { ...policies[existingIndex], ...policy }
  } else {
    policies.push(policy)
  }

  localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
}

// Save policy rule information
export function savePolicyRuleInfo(policyId: string, ruleInfo: PolicyRuleInfo): void {
  localStorage.setItem(`${POLICY_RULE_PREFIX}${policyId}`, JSON.stringify(ruleInfo))

  // Update the policy in the policies list
  const policies = getPolicies()
  const policyIndex = policies.findIndex((p) => p.id === policyId)

  if (policyIndex >= 0) {
    policies[policyIndex].policyRule = ruleInfo
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
  }
}

// Save service type information
export function saveServiceTypeInfo(policyId: string, serviceTypeInfo: ServiceTypeInfo): void {
  localStorage.setItem(`${SERVICE_TYPE_PREFIX}${policyId}`, JSON.stringify(serviceTypeInfo))

  // Update the policy in the policies list
  const policies = getPolicies()
  const policyIndex = policies.findIndex((p) => p.id === policyId)

  if (policyIndex >= 0) {
    policies[policyIndex].serviceType = serviceTypeInfo
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
  }
}

// Save contact information
export function saveContactInfo(policyId: string, contactInfo: ContactInfo): void {
  localStorage.setItem(`${CONTACT_INFO_PREFIX}${policyId}`, JSON.stringify(contactInfo))

  // Update the policy in the policies list
  const policies = getPolicies()
  const policyIndex = policies.findIndex((p) => p.id === policyId)

  if (policyIndex >= 0) {
    policies[policyIndex].contactInfo = contactInfo
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
  }
}

// Get all policies with their complete information
export function getPolicies(): CompletePolicy[] {
  // Force reset and reorder policies
  localStorage.removeItem(POLICIES_KEY)

  // Reordered dummy data with Prudential Enhanced Medical Care and PMC Medical Care first
  const reorderedPolicies: CompletePolicy[] = [
    {
      id: "pol-006",
      policyNumber: "POL-2024-006",
      policyName: "Prudential Enhanced Medical Care",
      fundingType: "Fully Insured",
      policyTerm: "Annual",
      effectiveDate: "2024-06-01",
      expiryDate: "2025-05-31",
      payor: "Prudential Assurance Malaysia Berhad",
      status: "Active",
      product: "PruWorks",
      policyRule: {
        catalogueCode: "CAT-006",
        catalogueName: "Enhanced Medical Care Catalogue",
        catalogueDescription: "Comprehensive medical benefits with enhanced coverage for corporate clients",
        preExistingConditions: [
          { code: "PEC-001", name: "Diabetes", waitingPeriod: "6 months" },
          { code: "PEC-002", name: "Hypertension", waitingPeriod: "3 months" },
          { code: "PEC-003", name: "Heart Disease", waitingPeriod: "12 months" },
        ],
        specifiedIllnesses: [
          { code: "SI-001", name: "Cancer", coverage: "Full after 12 months" },
          { code: "SI-002", name: "Stroke", coverage: "Full after 6 months" },
          { code: "SI-003", name: "Kidney Failure", coverage: "Full after 12 months" },
        ],
        congenitalConditions: [
          { code: "CC-001", name: "Congenital Heart Disease", coverage: "Full coverage from day 1" },
          { code: "CC-002", name: "Cleft Palate", coverage: "Up to $25,000" },
        ],
        exclusions: [
          { code: "EX-001", name: "Cosmetic Surgery", description: "Unless medically necessary" },
          { code: "EX-002", name: "Experimental Treatments", description: "Not approved by regulatory bodies" },
          { code: "EX-003", name: "War and Terrorism", description: "Direct participation or acts of war" },
        ],
      },
      serviceType: {
        serviceTypes: [
          { code: "HP", name: "Hospitalization", coverage: "100%" },
          { code: "SG", name: "Surgery", coverage: "100%" },
          { code: "MT", name: "Maternity", coverage: "100% after 10 months" },
        ],
      },
      contactInfo: {
        contacts: [
          {
            id: "cont-007",
            name: "Tan Wei Liang",
            role: "Senior Account Manager",
            email: "weiliang.tan@prudential.com.my",
            phone: "+60-3-2170-8888",
          },
          {
            id: "cont-008",
            name: "Dr. Siti Aminah Binti Ahmad",
            role: "Medical Advisor",
            email: "aminah.ahmad@prudential.com.my",
            phone: "+60-3-2170-8899",
          },
          {
            id: "cont-009",
            name: "Raj Kumar Patel",
            role: "Claims Manager",
            email: "raj.patel@prudential.com.my",
            phone: "+60-3-2170-8877",
          },
        ],
      },
    },
    {
      id: "pol-007",
      policyNumber: "POL-2024-007",
      policyName: "PMC Medical Care",
      fundingType: "Self-Funded",
      policyTerm: "Annual",
      effectiveDate: "2024-07-01",
      expiryDate: "2025-06-30",
      payor: "PMCare Sdn Bhd",
      status: "Active",
      product: "Comprehensive Health Insurance",
      policyRule: {
        catalogueCode: "CAT-007",
        catalogueName: "PMC Medical Care Catalogue",
        catalogueDescription:
          "Comprehensive medical care benefits managed by PMCare with focus on primary and specialist care",
        preExistingConditions: [
          { code: "PEC-001", name: "Diabetes", waitingPeriod: "9 months" },
          { code: "PEC-002", name: "Hypertension", waitingPeriod: "6 months" },
          { code: "PEC-003", name: "Chronic Kidney Disease", waitingPeriod: "12 months" },
        ],
        specifiedIllnesses: [
          { code: "SI-001", name: "Cancer", coverage: "Full after 18 months" },
          { code: "SI-002", name: "Heart Disease", coverage: "Full after 12 months" },
          { code: "SI-003", name: "Stroke", coverage: "Full after 9 months" },
        ],
        congenitalConditions: [
          { code: "CC-001", name: "Congenital Heart Disease", coverage: "Limited to $15,000" },
          { code: "CC-002", name: "Spina Bifida", coverage: "Up to $20,000" },
        ],
        exclusions: [
          { code: "EX-001", name: "Cosmetic Surgery", description: "Unless medically necessary" },
          { code: "EX-002", name: "Experimental Treatments", description: "Not approved by regulatory bodies" },
          { code: "EX-003", name: "Self-inflicted Injuries", description: "Intentional self-harm" },
        ],
      },
      serviceType: {
        serviceTypes: [
          { code: "GP", name: "General Practitioner", coverage: "100%" },
          { code: "SP", name: "Specialist", coverage: "85%" },
          { code: "OC", name: "Outpatient Care", coverage: "90%" },
          { code: "DT", name: "Dental", coverage: "75% up to $2,000" },
        ],
      },
      contactInfo: {
        contacts: [
          {
            id: "cont-010",
            name: "Dato' Ahmad Zaki Ismail",
            role: "Chief Executive Officer",
            email: "zaki.ismail@pmcare.com.my",
            phone: "+60-3-6201-2000",
          },
          {
            id: "cont-011",
            name: "Dr. Sarah Lim Wei Ming",
            role: "Chief Medical Officer",
            email: "sarah.lim@pmcare.com.my",
            phone: "+60-3-6201-2001",
          },
          {
            id: "cont-012",
            name: "Mohd Hafiz Rahman",
            role: "Head of Claims Management",
            email: "hafiz.rahman@pmcare.com.my",
            phone: "+60-3-6201-2002",
          },
        ],
      },
    },
    ...dummyPolicies.slice(0, 5), // Add the first 5 original policies after the reordered ones
  ]

  localStorage.setItem(POLICIES_KEY, JSON.stringify(reorderedPolicies))

  try {
    return reorderedPolicies
  } catch (error) {
    console.error("Error parsing policies from localStorage:", error)
    return []
  }
}

// Get a specific policy by ID
export function getPolicy(policyId: string): CompletePolicy | null {
  const policies = getPolicies()
  return policies.find((p) => p.id === policyId) || null
}

// Delete a policy and all its related data
export function deletePolicy(policyId: string): void {
  const policies = getPolicies().filter((p) => p.id !== policyId)
  localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))

  // Remove related data
  localStorage.removeItem(`${POLICY_RULE_PREFIX}${policyId}`)
  localStorage.removeItem(`${SERVICE_TYPE_PREFIX}${policyId}`)
  localStorage.removeItem(`${CONTACT_INFO_PREFIX}${policyId}`)
}

// Helper function to get formatted service types
export function getFormattedServiceTypes(policy: CompletePolicy): string {
  if (!policy.serviceType || !policy.serviceType.serviceTypes || policy.serviceType.serviceTypes.length === 0) {
    return "N/A"
  }

  return policy.serviceType.serviceTypes.map((st) => st.code).join("+")
}
