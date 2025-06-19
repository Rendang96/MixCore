import { savePolicy, getPolicy } from "./policy-storage"

export interface PolicyDummyData {
  id: string
  name: string
  code: string
  description: string
  effectiveDate: string
  expiryDate: string
  status: "active" | "inactive"
}

const dummyPolicies: PolicyDummyData[] = [
  // Moved from position 6 to position 1
  {
    id: "policy-dummy-6",
    name: "Prudential Enhanced Medical Care",
    code: "POL-2024-006",
    description: "Eye care and vision coverage",
    effectiveDate: "2024-06-01",
    expiryDate: "2025-05-31",
    status: "active",
  },
  // Moved from position 7 to position 2
  {
    id: "policy-dummy-7",
    name: "PMC Medical Care",
    code: "POL-2024-007",
    description: "Emergency medical services coverage",
    effectiveDate: "2024-07-01",
    expiryDate: "2025-06-30",
    status: "active",
  },
  // Original positions 1-5 moved to positions 3-7
  {
    id: "policy-dummy-1",
    name: "Corporate Health Plan - Premium",
    code: "POL-2024-001",
    description: "Full coverage health insurance policy",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
    status: "active",
  },
  {
    id: "policy-dummy-2",
    name: "Executive Health Plan",
    code: "POL-2024-002",
    description: "Essential medical coverage policy",
    effectiveDate: "2024-02-15",
    expiryDate: "2025-02-14",
    status: "active",
  },
  {
    id: "policy-dummy-3",
    name: "Standard Dental Plan",
    code: "POL-2024-003",
    description: "Comprehensive dental care coverage",
    effectiveDate: "2024-03-01",
    expiryDate: "2025-02-28",
    status: "active",
  },
  {
    id: "policy-dummy-4",
    name: "Vision Care Plan",
    code: "POL-2024-004",
    description: "Eye care and vision coverage",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
    status: "active",
  },
  {
    id: "policy-dummy-5",
    name: "Group Life Insurance",
    code: "POL-2024-005",
    description: "Emergency medical services coverage",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
    status: "active",
  },
]

export function initializeDummyPolicies(): void {
  // Check if dummy policies already exist
  const existingPolicy = getPolicy("policy-dummy-1")

  if (!existingPolicy) {
    // Add dummy policies to storage
    dummyPolicies.forEach((policy) => {
      savePolicy({
        id: policy.id,
        name: policy.name,
        code: policy.code,
        description: policy.description,
        effectiveDate: new Date(policy.effectiveDate),
        expiryDate: new Date(policy.expiryDate),
        status: policy.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    console.log("Dummy policies initialized")
  }
}
