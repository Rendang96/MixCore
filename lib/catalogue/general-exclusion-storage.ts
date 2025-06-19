export interface GeneralExclusion {
  id: number
  itemId: string
  catalogId: string
  title: string
  description: string
  coverageImpact: string
  isOverridable: boolean
  appliesTo: string
  isVisibleToMember: boolean
  remarks: string
}

const STORAGE_KEY = "generalExclusions"

export const generalExclusionStorage = {
  // Get all general exclusions from localStorage
  getAll: (): GeneralExclusion[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  // Save all general exclusions to localStorage
  saveAll: (exclusions: GeneralExclusion[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exclusions))
  },

  // Add a new general exclusion
  add: (exclusion: Omit<GeneralExclusion, "id">): GeneralExclusion => {
    const exclusions = generalExclusionStorage.getAll()
    const newId = exclusions.length > 0 ? Math.max(...exclusions.map((e) => e.id)) + 1 : 1
    const newExclusion = { ...exclusion, id: newId }
    const updatedExclusions = [...exclusions, newExclusion]
    generalExclusionStorage.saveAll(updatedExclusions)
    return newExclusion
  },

  // Update an existing general exclusion
  update: (id: number, updates: Partial<GeneralExclusion>): GeneralExclusion | null => {
    const exclusions = generalExclusionStorage.getAll()
    const index = exclusions.findIndex((e) => e.id === id)
    if (index === -1) return null

    exclusions[index] = { ...exclusions[index], ...updates }
    generalExclusionStorage.saveAll(exclusions)
    return exclusions[index]
  },

  // Delete a general exclusion
  delete: (id: number): boolean => {
    const exclusions = generalExclusionStorage.getAll()
    const filteredExclusions = exclusions.filter((e) => e.id !== id)
    if (filteredExclusions.length === exclusions.length) return false

    generalExclusionStorage.saveAll(filteredExclusions)
    return true
  },

  // Get a single general exclusion by ID
  getById: (id: number): GeneralExclusion | null => {
    const exclusions = generalExclusionStorage.getAll()
    return exclusions.find((e) => e.id === id) || null
  },
}
