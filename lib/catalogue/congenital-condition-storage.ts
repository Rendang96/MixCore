export interface CongenitalCondition {
  id: string
  congenitalConditionId: string
  name: string
  description: string
  type: string
  catalogue: string
  icdCode?: string
  isDefaultExcluded: boolean
  isCoverableUnderChildRider: boolean
  coverageImpact: string
  isConditional: boolean
  appliesTo: string
  remarks?: string
}

const STORAGE_KEY = "congenital-conditions"

export const congenitalConditionStorage = {
  // Get all congenital conditions from localStorage
  getAll: (): CongenitalCondition[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  // Save all congenital conditions to localStorage
  saveAll: (conditions: CongenitalCondition[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conditions))
  },

  // Add a new congenital condition
  add: (condition: Omit<CongenitalCondition, "id">): CongenitalCondition => {
    const conditions = congenitalConditionStorage.getAll()
    const newCondition = {
      ...condition,
      id: Date.now().toString(),
    }
    conditions.push(newCondition)
    congenitalConditionStorage.saveAll(conditions)
    return newCondition
  },

  // Update an existing congenital condition
  update: (id: string, updates: Partial<CongenitalCondition>): CongenitalCondition | null => {
    const conditions = congenitalConditionStorage.getAll()
    const index = conditions.findIndex((c) => c.id === id)
    if (index === -1) return null

    conditions[index] = { ...conditions[index], ...updates }
    congenitalConditionStorage.saveAll(conditions)
    return conditions[index]
  },

  // Delete a congenital condition
  delete: (id: string): boolean => {
    const conditions = congenitalConditionStorage.getAll()
    const filteredConditions = conditions.filter((c) => c.id !== id)
    if (filteredConditions.length === conditions.length) return false

    congenitalConditionStorage.saveAll(filteredConditions)
    return true
  },

  // Get a single congenital condition by ID
  getById: (id: string): CongenitalCondition | null => {
    const conditions = congenitalConditionStorage.getAll()
    return conditions.find((c) => c.id === id) || null
  },
}
