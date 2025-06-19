export interface SpecifiedIllness {
  id: string
  specifiedIllnessId: string
  name: string
  description: string
  catalogue: string
  waitingPeriodMonths?: number
  isCoveredAfterWaiting?: boolean
  coverageImpact?: string
  isExcludable?: boolean
  ageRestriction?: string
  remarks?: string
}

const STORAGE_KEY = "specifiedIllnesses"

export const specifiedIllnessStorage = {
  // Get all specified illnesses from localStorage
  getAll: (): SpecifiedIllness[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  // Save all specified illnesses to localStorage
  saveAll: (illnesses: SpecifiedIllness[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(illnesses))
  },

  // Add a new specified illness
  add: (illness: Omit<SpecifiedIllness, "id">): SpecifiedIllness => {
    const illnesses = specifiedIllnessStorage.getAll()
    const newIllness: SpecifiedIllness = {
      ...illness,
      id: Date.now().toString(),
    }
    illnesses.push(newIllness)
    specifiedIllnessStorage.saveAll(illnesses)
    return newIllness
  },

  // Update an existing specified illness
  update: (id: string, updates: Partial<SpecifiedIllness>): SpecifiedIllness | null => {
    const illnesses = specifiedIllnessStorage.getAll()
    const index = illnesses.findIndex((illness) => illness.id === id)
    if (index === -1) return null

    illnesses[index] = { ...illnesses[index], ...updates }
    specifiedIllnessStorage.saveAll(illnesses)
    return illnesses[index]
  },

  // Delete a specified illness
  delete: (id: string): boolean => {
    const illnesses = specifiedIllnessStorage.getAll()
    const filteredIllnesses = illnesses.filter((illness) => illness.id !== id)
    if (filteredIllnesses.length === illnesses.length) return false

    specifiedIllnessStorage.saveAll(filteredIllnesses)
    return true
  },

  // Get a specified illness by ID
  getById: (id: string): SpecifiedIllness | null => {
    const illnesses = specifiedIllnessStorage.getAll()
    return illnesses.find((illness) => illness.id === id) || null
  },

  // Clear all specified illnesses
  clear: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },
}
