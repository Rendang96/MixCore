export interface Agent {
  id: string
  agentCode: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiryDate: string
  commissionRate: number
  status: "Active" | "Inactive" | "Suspended"
  salesManagerId?: string
  dateJoined: string
  address: string
  city: string
  state: string
  zipCode: string
}

export interface Broker {
  id: string
  brokerCode: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiryDate: string
  commissionRate: number
  status: "Active" | "Inactive" | "Suspended"
  dateJoined: string
  address: string
  city: string
  state: string
  zipCode: string
  businessType: "Individual" | "Corporate"
}

export interface SalesManager {
  id: string
  managerCode: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  status: "Active" | "Inactive" | "Suspended"
  dateJoined: string
  assignedAgents: string[]
  region: string
}
