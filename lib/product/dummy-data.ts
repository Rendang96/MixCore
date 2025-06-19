export type Product = {
  id: string
  code: string
  name: string
  type: string
  payor: string
  status: "Active" | "Inactive"
  description?: string
  createdAt?: string
  updatedAt?: string
}

export const dummyProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Comprehensive Health Insurance",
    code: "CHI-2024",
    type: "Health Insurance",
    payor: "MediCare Plus",
    status: "Active",
  },
  {
    id: "PROD-002",
    name: "Dental Care Premium",
    code: "DCP-2024",
    type: "Dental Insurance",
    payor: "DentaCare Solutions",
    status: "Active",
  },
  {
    id: "PROD-003",
    name: "Vision Protection Plan",
    code: "VPP-2024",
    type: "Vision Insurance",
    payor: "ClearSight Insurance",
    status: "Active",
  },
  {
    id: "PROD-004",
    name: "Life Insurance Basic",
    code: "LIB-2024",
    type: "Life Insurance",
    payor: "LifeGuard Assurance",
    status: "Inactive",
  },
  {
    id: "PROD-005",
    name: "Critical Illness Coverage",
    code: "CIC-2024",
    type: "Critical Illness",
    payor: "HealthShield Corp",
    status: "Active",
  },
  {
    id: "PROD-006",
    name: "PruWorks",
    code: "PRW-2024",
    type: "Employee Benefits",
    payor: "Prudential Assurance Malaysia Berhad",
    status: "Active",
  },
  {
    id: "PROD-007",
    name: "PMC OP Benefits",
    code: "PMC-OP-2024",
    type: "Outpatient Benefits",
    payor: "PMCare Sdn Bhd",
    status: "Active",
  },
]
