import type { Agent, Broker, SalesManager } from "./types"

// Sample data
const sampleAgents: Agent[] = [
  {
    id: "1",
    agentCode: "AGT001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0101",
    licenseNumber: "LIC001",
    licenseExpiryDate: "2024-12-31",
    commissionRate: 5.5,
    status: "Active",
    salesManagerId: "1",
    dateJoined: "2023-01-15",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  },
  {
    id: "2",
    agentCode: "AGT002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0102",
    licenseNumber: "LIC002",
    licenseExpiryDate: "2025-06-30",
    commissionRate: 6.0,
    status: "Active",
    salesManagerId: "2",
    dateJoined: "2023-03-20",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
  },
  {
    id: "3",
    agentCode: "AGT003",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@email.com",
    phone: "+1-555-0103",
    licenseNumber: "LIC003",
    licenseExpiryDate: "2024-09-15",
    commissionRate: 5.0,
    status: "Inactive",
    dateJoined: "2022-11-10",
    address: "789 Pine St",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
  },
]

const sampleBrokers: Broker[] = [
  {
    id: "1",
    brokerCode: "BRK001",
    companyName: "ABC Insurance Brokers",
    contactPerson: "Robert Wilson",
    email: "robert@abcinsurance.com",
    phone: "+1-555-0201",
    licenseNumber: "BLIC001",
    licenseExpiryDate: "2024-12-31",
    commissionRate: 8.0,
    status: "Active",
    dateJoined: "2022-05-15",
    address: "100 Business Blvd",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    businessType: "Corporate",
  },
  {
    id: "2",
    brokerCode: "BRK002",
    companyName: "XYZ Insurance Services",
    contactPerson: "Lisa Brown",
    email: "lisa@xyzinsurance.com",
    phone: "+1-555-0202",
    licenseNumber: "BLIC002",
    licenseExpiryDate: "2025-03-31",
    commissionRate: 7.5,
    status: "Active",
    dateJoined: "2023-02-01",
    address: "200 Commerce St",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    businessType: "Individual",
  },
]

const sampleSalesManagers: SalesManager[] = [
  {
    id: "1",
    managerCode: "SM001",
    firstName: "David",
    lastName: "Thompson",
    email: "david.thompson@company.com",
    phone: "+1-555-0301",
    department: "Sales & Marketing",
    status: "Active",
    dateJoined: "2022-01-10",
    assignedAgents: ["1"],
    region: "East Coast",
  },
  {
    id: "2",
    managerCode: "SM002",
    firstName: "Jennifer",
    lastName: "Martinez",
    email: "jennifer.martinez@company.com",
    phone: "+1-555-0302",
    department: "Sales & Marketing",
    status: "Active",
    dateJoined: "2022-03-15",
    assignedAgents: ["2"],
    region: "West Coast",
  },
]

class AgentBrokerStorage {
  private agents: Agent[] = [...sampleAgents]
  private brokers: Broker[] = [...sampleBrokers]
  private salesManagers: SalesManager[] = [...sampleSalesManagers]

  // Agent methods
  getAllAgents(): Agent[] {
    return this.agents
  }

  getAgentById(id: string): Agent | undefined {
    return this.agents.find((agent) => agent.id === id)
  }

  createAgent(agent: Omit<Agent, "id">): Agent {
    // Generate unique agent code if not provided or if it already exists
    let agentCode = agent.agentCode
    if (!agentCode || this.agents.some((a) => a.agentCode === agentCode)) {
      const existingCodes = this.agents.map((a) => a.agentCode)
      let counter = 1
      do {
        agentCode = `AGT${counter.toString().padStart(3, "0")}`
        counter++
      } while (existingCodes.includes(agentCode))
    }

    const newAgent: Agent = {
      ...agent,
      agentCode,
      id: Date.now().toString(),
    }
    this.agents.push(newAgent)
    return newAgent
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | null {
    const index = this.agents.findIndex((agent) => agent.id === id)
    if (index !== -1) {
      this.agents[index] = { ...this.agents[index], ...updates }
      return this.agents[index]
    }
    return null
  }

  deleteAgent(id: string): boolean {
    const index = this.agents.findIndex((agent) => agent.id === id)
    if (index !== -1) {
      this.agents.splice(index, 1)
      return true
    }
    return false
  }

  // Broker methods
  getAllBrokers(): Broker[] {
    return this.brokers
  }

  getBrokerById(id: string): Broker | undefined {
    return this.brokers.find((broker) => broker.id === id)
  }

  createBroker(broker: Omit<Broker, "id">): Broker {
    // Generate unique broker code if not provided or if it already exists
    let brokerCode = broker.brokerCode
    if (!brokerCode || this.brokers.some((b) => b.brokerCode === brokerCode)) {
      const existingCodes = this.brokers.map((b) => b.brokerCode)
      let counter = 1
      do {
        brokerCode = `BRK${counter.toString().padStart(3, "0")}`
        counter++
      } while (existingCodes.includes(brokerCode))
    }

    const newBroker: Broker = {
      ...broker,
      brokerCode,
      id: Date.now().toString(),
    }
    this.brokers.push(newBroker)
    return newBroker
  }

  updateBroker(id: string, updates: Partial<Broker>): Broker | null {
    const index = this.brokers.findIndex((broker) => broker.id === id)
    if (index !== -1) {
      this.brokers[index] = { ...this.brokers[index], ...updates }
      return this.brokers[index]
    }
    return null
  }

  deleteBroker(id: string): boolean {
    const index = this.brokers.findIndex((broker) => broker.id === id)
    if (index !== -1) {
      this.brokers.splice(index, 1)
      return true
    }
    return false
  }

  // Sales Manager methods
  getAllSalesManagers(): SalesManager[] {
    return this.salesManagers
  }

  getSalesManagerById(id: string): SalesManager | undefined {
    return this.salesManagers.find((manager) => manager.id === id)
  }

  createSalesManager(manager: Omit<SalesManager, "id">): SalesManager {
    // Generate unique manager code if not provided or if it already exists
    let managerCode = manager.managerCode
    if (!managerCode || this.salesManagers.some((m) => m.managerCode === managerCode)) {
      const existingCodes = this.salesManagers.map((m) => m.managerCode)
      let counter = 1
      do {
        managerCode = `SM${counter.toString().padStart(3, "0")}`
        counter++
      } while (existingCodes.includes(managerCode))
    }

    const newManager: SalesManager = {
      ...manager,
      managerCode,
      id: Date.now().toString(),
      assignedAgents: manager.assignedAgents || [],
    }
    this.salesManagers.push(newManager)
    return newManager
  }

  updateSalesManager(id: string, updates: Partial<SalesManager>): SalesManager | null {
    const index = this.salesManagers.findIndex((manager) => manager.id === id)
    if (index !== -1) {
      this.salesManagers[index] = { ...this.salesManagers[index], ...updates }
      return this.salesManagers[index]
    }
    return null
  }

  deleteSalesManager(id: string): boolean {
    const index = this.salesManagers.findIndex((manager) => manager.id === id)
    if (index !== -1) {
      this.salesManagers.splice(index, 1)
      return true
    }
    return false
  }

  // Assignment methods
  assignAgentToManager(agentId: string, managerId: string): boolean {
    const agent = this.getAgentById(agentId)
    const manager = this.getSalesManagerById(managerId)

    if (agent && manager) {
      agent.salesManagerId = managerId
      if (!manager.assignedAgents.includes(agentId)) {
        manager.assignedAgents.push(agentId)
      }
      return true
    }
    return false
  }

  unassignAgentFromManager(agentId: string): boolean {
    const agent = this.getAgentById(agentId)
    if (agent && agent.salesManagerId) {
      const manager = this.getSalesManagerById(agent.salesManagerId)
      if (manager) {
        manager.assignedAgents = manager.assignedAgents.filter((id) => id !== agentId)
      }
      agent.salesManagerId = undefined
      return true
    }
    return false
  }
}

const storage = new AgentBrokerStorage()

// Export functions with correct names for compatibility
export const getAgents = () => storage.getAllAgents()
export const getBrokers = () => storage.getAllBrokers()
export const getSalesManagers = () => storage.getAllSalesManagers()
export const getAgentById = (id: string) => storage.getAgentById(id)
export const getBrokerById = (id: string) => storage.getBrokerById(id)
export const getSalesManagerById = (id: string) => storage.getSalesManagerById(id)

// Create functions - optimized for performance
export const createAgent = async (agent: Omit<Agent, "id">) => {
  // Use setTimeout to make it async and prevent blocking
  return new Promise<Agent>((resolve) => {
    setTimeout(() => {
      const result = storage.createAgent(agent)
      resolve(result)
    }, 0)
  })
}

export const createBroker = async (broker: Omit<Broker, "id">) => {
  return new Promise<Broker>((resolve) => {
    setTimeout(() => {
      const result = storage.createBroker(broker)
      resolve(result)
    }, 0)
  })
}

export const createSalesManager = async (manager: Omit<SalesManager, "id">) => {
  return new Promise<SalesManager>((resolve) => {
    setTimeout(() => {
      const result = storage.createSalesManager(manager)
      resolve(result)
    }, 0)
  })
}

// Update functions
export const updateAgent = (id: string, updates: Partial<Agent>) => storage.updateAgent(id, updates)
export const updateBroker = (id: string, updates: Partial<Broker>) => storage.updateBroker(id, updates)
export const updateSalesManager = (id: string, updates: Partial<SalesManager>) =>
  storage.updateSalesManager(id, updates)

// Delete functions
export const deleteAgent = (id: string) => storage.deleteAgent(id)
export const deleteBroker = (id: string) => storage.deleteBroker(id)
export const deleteSalesManager = (id: string) => storage.deleteSalesManager(id)

// Assignment functions
export const assignAgentToManager = (agentId: string, managerId: string) =>
  storage.assignAgentToManager(agentId, managerId)
export const unassignAgentFromManager = (agentId: string) => storage.unassignAgentFromManager(agentId)

// Search functions
export const searchAgents = (query: string) => {
  const agents = storage.getAllAgents()
  const lowerQuery = query.toLowerCase()
  return agents.filter(
    (agent) =>
      agent.firstName.toLowerCase().includes(lowerQuery) ||
      agent.lastName.toLowerCase().includes(lowerQuery) ||
      agent.email.toLowerCase().includes(lowerQuery) ||
      agent.licenseNumber.toLowerCase().includes(lowerQuery) ||
      agent.agentCode.toLowerCase().includes(lowerQuery),
  )
}

export const searchBrokers = (query: string) => {
  const brokers = storage.getAllBrokers()
  const lowerQuery = query.toLowerCase()
  return brokers.filter(
    (broker) =>
      broker.companyName.toLowerCase().includes(lowerQuery) ||
      broker.contactPerson.toLowerCase().includes(lowerQuery) ||
      broker.email.toLowerCase().includes(lowerQuery) ||
      broker.licenseNumber.toLowerCase().includes(lowerQuery) ||
      broker.brokerCode.toLowerCase().includes(lowerQuery),
  )
}

export const searchSalesManagers = (query: string) => {
  const managers = storage.getAllSalesManagers()
  const lowerQuery = query.toLowerCase()
  return managers.filter(
    (manager) =>
      manager.firstName.toLowerCase().includes(lowerQuery) ||
      manager.lastName.toLowerCase().includes(lowerQuery) ||
      manager.email.toLowerCase().includes(lowerQuery) ||
      manager.managerCode.toLowerCase().includes(lowerQuery),
  )
}

export default storage
