// Plan storage utility for managing plan data in localStorage

export interface Plan {
  id: string
  name: string
  type: string
  status: string
  createdDate: string
  description?: string
  effectiveDate?: string
  expiryDate?: string
  serviceTypes?: string[]
  subServiceTypes?: { [serviceType: string]: string[] }
  providerAccess?: string
  selectedProviders?: any[]
  hasBillback?: boolean
  hasSpecialRules?: boolean
  limits?: any[]
  specialRules?: {
    coPayments?: any[]
    benefitCoordination?: any[]
    regulatoryCompliance?: {
      essentialHealthBenefits?: { enabled: boolean; categories: any[]; exemptions: any[] }
      preventiveCareExemptions?: { enabled: boolean; services: any[]; copaymentWaived: boolean }
      mentalHealthParity?: {
        enabled: boolean
        treatmentLimits: boolean
        financialRequirements: boolean
        quantitativeLimits: boolean
      }
    }
  }
  coPayments?: any[]
}

const STORAGE_KEY = "plans"

export class PlanStorage {
  // Get all plans from localStorage
  static getAllPlans(): Plan[] {
    try {
      const plans = localStorage.getItem(STORAGE_KEY)
      return plans ? JSON.parse(plans) : []
    } catch (error) {
      console.error("Error reading plans from localStorage:", error)
      return []
    }
  }

  // Save all plans to localStorage
  static savePlans(plans: Plan[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
    } catch (error) {
      console.error("Error saving plans to localStorage:", error)
    }
  }

  // Add a new plan
  static addPlan(plan: Plan): void {
    const plans = this.getAllPlans()
    plans.unshift(plan) // Add to the beginning of the array
    this.savePlans(plans)
  }

  // Update an existing plan
  static updatePlan(id: string, updates: Partial<Plan>): void {
    const plans = this.getAllPlans()
    const index = plans.findIndex((plan) => plan.id === id)
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates }
      this.savePlans(plans)
    }
  }

  // Delete a plan
  static deletePlan(id: string): void {
    const plans = this.getAllPlans()
    const filteredPlans = plans.filter((plan) => plan.id !== id)
    this.savePlans(filteredPlans)
  }

  // Get a plan by ID
  static getPlanById(id: string): Plan | undefined {
    const plans = this.getAllPlans()
    return plans.find((plan) => plan.id === id)
  }

  // Get plans by status
  static getPlansByStatus(status: string): Plan[] {
    const plans = this.getAllPlans()
    return plans.filter((plan) => plan.status === status)
  }

  // Get active plans
  static getActivePlans(): Plan[] {
    return this.getPlansByStatus("Active")
  }

  // Search plans by name or ID
  static searchPlans(query: string): Plan[] {
    const plans = this.getAllPlans()
    const lowerQuery = query.toLowerCase()
    return plans.filter(
      (plan) => plan.name.toLowerCase().includes(lowerQuery) || plan.id.toLowerCase().includes(lowerQuery),
    )
  }

  // Generate a new plan ID
  static generatePlanId(): string {
    const plans = this.getAllPlans()
    const maxId = plans.reduce((max, plan) => {
      const num = Number.parseInt(plan.id.replace("PL", ""))
      return num > max ? num : max
    }, 0)
    return `PL${String(maxId + 1).padStart(3, "0")}`
  }

  // Check if storage is empty
  static isEmpty(): boolean {
    return this.getAllPlans().length === 0
  }

  // Clear all plans (for testing purposes)
  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}

// Export functions for easier use
export const getPlans = () => PlanStorage.getAllPlans()
export const addPlan = (plan: Plan) => PlanStorage.addPlan(plan)
export const updatePlan = (id: string, updates: Partial<Plan>) => PlanStorage.updatePlan(id, updates)
export const deletePlan = (id: string) => PlanStorage.deletePlan(id)
export const getPlanById = (id: string) => PlanStorage.getPlanById(id)
export const getActivePlans = () => PlanStorage.getActivePlans()
export const searchPlans = (query: string) => PlanStorage.searchPlans(query)
export const generatePlanId = () => PlanStorage.generatePlanId()
