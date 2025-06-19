// Corporate Client storage functionality

export interface PayorEntry {
  id: string
  name: string
  code: string
  payorType: "insurer" | "self-funded"
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
  productName: string
  productCode: string
  effectiveDate: string
  expiryDate: string
}

export interface PolicyInPlanEntry {
  id: string
  policyNo: string
  policyName: string
  effectiveDate: string
  expiryDate: string
  serviceTypes: string[]
}

export interface PlanEntry {
  id: string
  name: string
  code: string
  description: string
  policies: PolicyInPlanEntry[]
}

export interface MemberEntry {
  id: string
  personId: string
  personName: string
  idNumber: string
  personType: string
  employeePersonId: string
  designation: string
  jobGrade: string
  employmentType: string
  staffCategory: string
  setupProvider: string
}

export interface CorporateClient {
  id: string
  companyName: string
  companyCode: string
  status: "Active" | "Inactive" | "Pending" | "Suspended"

  // Multiple entries for each section
  payors: PayorEntry[]
  products: ProductEntry[]
  policies: PolicyEntry[]
  plans: PlanEntry[]
  members: MemberEntry[]

  // Legacy fields for backward compatibility and summary display
  policyNo: string
  payorName: string
  productName: string
  planName: string
  memberCount: number

  effectiveDate: string
  expiryDate: string
  createdDate: string
  createdBy: string
}

const CORPORATE_CLIENTS_KEY = "corporate_clients"

// Get all corporate clients from localStorage
export const getCorporateClients = (): CorporateClient[] => {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(CORPORATE_CLIENTS_KEY)
  return data ? JSON.parse(data) : []
}

// Save corporate clients to localStorage
export const saveCorporateClients = (clients: CorporateClient[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem(CORPORATE_CLIENTS_KEY, JSON.stringify(clients))
}

// Add a new corporate client
export const addCorporateClient = (client: Omit<CorporateClient, "id" | "createdDate" | "createdBy">) => {
  const clients = getCorporateClients()
  const newClient: CorporateClient = {
    ...client,
    id: `CC${Date.now()}`,
    createdDate: new Date().toISOString().split("T")[0],
    createdBy: "Current User",
  }

  clients.push(newClient)
  saveCorporateClients(clients)
  return newClient
}

// Delete a corporate client
export const deleteCorporateClient = (id: string) => {
  const clients = getCorporateClients()
  const updatedClients = clients.filter((client) => client.id !== id)
  saveCorporateClients(updatedClients)
}

// Search corporate clients
export const searchCorporateClients = (criteria: {
  companyName?: string
  companyCode?: string
  status?: string
  policyNo?: string
}) => {
  const clients = getCorporateClients()

  return clients.filter((client) => {
    if (criteria.companyName && !client.companyName.toLowerCase().includes(criteria.companyName.toLowerCase())) {
      return false
    }
    if (criteria.companyCode && !client.companyCode.toLowerCase().includes(criteria.companyCode.toLowerCase())) {
      return false
    }
    if (criteria.status && criteria.status !== "all" && client.status !== criteria.status) {
      return false
    }
    if (criteria.policyNo && !client.policyNo.toLowerCase().includes(criteria.policyNo.toLowerCase())) {
      return false
    }
    return true
  })
}

// Initialize dummy data
export const initializeDummyCorporateClients = () => {
  const existingClients = getCorporateClients()
  if (existingClients.length === 0) {
    const dummyClients: CorporateClient[] = [
      {
        id: "CC001",
        companyName: "Tech Solutions Sdn Bhd",
        companyCode: "TECH001",
        status: "Active",
        policyNo: "POL-2024-001",
        payorName: "Great Eastern",
        productName: "Corporate Health Plan",
        planName: "Premium Medical Plan",
        memberCount: 150,
        effectiveDate: "2024-01-01",
        expiryDate: "2024-12-31",
        createdDate: "2024-01-15",
        createdBy: "Admin User",
        payors: [
          {
            id: "payor-1",
            name: "Great Eastern",
            code: "GE001",
            payorType: "insurer",
          },
        ],
        products: [
          {
            id: "product-1",
            name: "Corporate Health Plan",
            code: "CHP001",
            payorName: "Great Eastern",
            payorCode: "GE001",
          },
        ],
        policies: [
          {
            id: "policy-1",
            name: "Premium Policy",
            code: "POL-2024-001",
            productName: "Corporate Health Plan",
            productCode: "CHP001",
            effectiveDate: "2024-01-01",
            expiryDate: "2024-12-31",
          },
        ],
        plans: [
          {
            id: "plan-1",
            name: "Premium Medical Plan",
            code: "PMP001",
            description: "Comprehensive medical coverage",
            policies: [
              {
                id: "plan-policy-1",
                policyNo: "POL-2024-001",
                policyName: "Premium Policy",
                effectiveDate: "2024-01-01",
                expiryDate: "2024-12-31",
                serviceTypes: ["GP", "SP"],
              },
            ],
          },
        ],
        members: [],
      },
      {
        id: "CC002",
        companyName: "Manufacturing Corp",
        companyCode: "MFG002",
        status: "Active",
        policyNo: "POL-2024-002",
        payorName: "Allianz Malaysia",
        productName: "Group Medical Insurance",
        planName: "Basic Medical Plan",
        memberCount: 85,
        effectiveDate: "2024-02-01",
        expiryDate: "2025-01-31",
        createdDate: "2024-02-10",
        createdBy: "HR Manager",
        payors: [
          {
            id: "payor-1",
            name: "Allianz Malaysia",
            code: "ALZ001",
            payorType: "insurer",
          },
        ],
        products: [
          {
            id: "product-1",
            name: "Group Medical Insurance",
            code: "GMI001",
            payorName: "Allianz Malaysia",
            payorCode: "ALZ001",
          },
        ],
        policies: [
          {
            id: "policy-1",
            name: "Basic Policy",
            code: "POL-2024-002",
            productName: "Group Medical Insurance",
            productCode: "GMI001",
            effectiveDate: "2024-02-01",
            expiryDate: "2025-01-31",
          },
        ],
        plans: [
          {
            id: "plan-1",
            name: "Basic Medical Plan",
            code: "BMP001",
            description: "Essential medical coverage",
            policies: [
              {
                id: "plan-policy-1",
                policyNo: "POL-2024-002",
                policyName: "Basic Policy",
                effectiveDate: "2024-02-01",
                expiryDate: "2025-01-31",
                serviceTypes: ["GP"],
              },
            ],
          },
        ],
        members: [],
      },
      {
        id: "CC003",
        companyName: "Retail Chain Bhd",
        companyCode: "RET003",
        status: "Pending",
        policyNo: "POL-2024-003",
        payorName: "AIA Malaysia",
        productName: "Employee Benefits Plan",
        planName: "Comprehensive Health Plan",
        memberCount: 220,
        effectiveDate: "2024-03-01",
        expiryDate: "2025-02-28",
        createdDate: "2024-02-25",
        createdBy: "Benefits Admin",
        payors: [
          {
            id: "payor-1",
            name: "AIA Malaysia",
            code: "AIA001",
            payorType: "insurer",
          },
        ],
        products: [
          {
            id: "product-1",
            name: "Employee Benefits Plan",
            code: "EBP001",
            payorName: "AIA Malaysia",
            payorCode: "AIA001",
          },
        ],
        policies: [
          {
            id: "policy-1",
            name: "Comprehensive Policy",
            code: "POL-2024-003",
            productName: "Employee Benefits Plan",
            productCode: "EBP001",
            effectiveDate: "2024-03-01",
            expiryDate: "2025-02-28",
          },
        ],
        plans: [
          {
            id: "plan-1",
            name: "Comprehensive Health Plan",
            code: "CHP001",
            description: "Full health coverage",
            policies: [
              {
                id: "plan-policy-1",
                policyNo: "POL-2024-003",
                policyName: "Comprehensive Policy",
                effectiveDate: "2024-03-01",
                expiryDate: "2025-02-28",
                serviceTypes: ["GP", "SP", "OC"],
              },
            ],
          },
        ],
        members: [],
      },
      {
        id: "CC004",
        companyName: "Financial Services Ltd",
        companyCode: "FIN004",
        status: "Active",
        policyNo: "POL-2024-004",
        payorName: "Prudential Malaysia",
        productName: "Executive Health Plan",
        planName: "Executive Medical Plan",
        memberCount: 45,
        effectiveDate: "2024-01-15",
        expiryDate: "2024-12-31",
        createdDate: "2024-01-20",
        createdBy: "CEO Office",
        payors: [
          {
            id: "payor-1",
            name: "Prudential Malaysia",
            code: "PRU001",
            payorType: "insurer",
          },
        ],
        products: [
          {
            id: "product-1",
            name: "Executive Health Plan",
            code: "EHP001",
            payorName: "Prudential Malaysia",
            payorCode: "PRU001",
          },
        ],
        policies: [
          {
            id: "policy-1",
            name: "Executive Policy",
            code: "POL-2024-004",
            productName: "Executive Health Plan",
            productCode: "EHP001",
            effectiveDate: "2024-01-15",
            expiryDate: "2024-12-31",
          },
        ],
        plans: [
          {
            id: "plan-1",
            name: "Executive Medical Plan",
            code: "EMP001",
            description: "Premium executive coverage",
            policies: [
              {
                id: "plan-policy-1",
                policyNo: "POL-2024-004",
                policyName: "Executive Policy",
                effectiveDate: "2024-01-15",
                expiryDate: "2024-12-31",
                serviceTypes: ["GP", "SP", "OC", "DT"],
              },
            ],
          },
        ],
        members: [],
      },
      {
        id: "CC005",
        companyName: "Education Institute",
        companyCode: "EDU005",
        status: "Inactive",
        policyNo: "POL-2023-015",
        payorName: "Zurich Malaysia",
        productName: "Academic Staff Plan",
        planName: "Standard Medical Plan",
        memberCount: 120,
        effectiveDate: "2023-09-01",
        expiryDate: "2024-08-31",
        createdDate: "2023-08-15",
        createdBy: "HR Department",
        payors: [
          {
            id: "payor-1",
            name: "Zurich Malaysia",
            code: "ZUR001",
            payorType: "insurer",
          },
        ],
        products: [
          {
            id: "product-1",
            name: "Academic Staff Plan",
            code: "ASP001",
            payorName: "Zurich Malaysia",
            payorCode: "ZUR001",
          },
        ],
        policies: [
          {
            id: "policy-1",
            name: "Standard Policy",
            code: "POL-2023-015",
            productName: "Academic Staff Plan",
            productCode: "ASP001",
            effectiveDate: "2023-09-01",
            expiryDate: "2024-08-31",
          },
        ],
        plans: [
          {
            id: "plan-1",
            name: "Standard Medical Plan",
            code: "SMP001",
            description: "Standard medical coverage",
            policies: [
              {
                id: "plan-policy-1",
                policyNo: "POL-2023-015",
                policyName: "Standard Policy",
                effectiveDate: "2023-09-01",
                expiryDate: "2024-08-31",
                serviceTypes: ["GP"],
              },
            ],
          },
        ],
        members: [],
      },
    ]

    saveCorporateClients(dummyClients)
  }
}
