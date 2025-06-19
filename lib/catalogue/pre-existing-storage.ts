export interface PreExistingCondition {
  id: string
  preExistingId: string
  name: string
  description: string
  waitingPeriod: string
  catalogue: string
}

const STORAGE_KEY = "preExistingConditions"

export function getPreExistingConditions(): PreExistingCondition[] {
  if (typeof window === "undefined") return []

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return []
}

export function savePreExistingConditions(conditions: PreExistingCondition[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem(STORAGE_KEY, JSON.stringify(conditions))
}

export function addPreExistingCondition(condition: Omit<PreExistingCondition, "id">): PreExistingCondition {
  const conditions = getPreExistingConditions()
  const newCondition: PreExistingCondition = {
    ...condition,
    id: Date.now().toString(),
  }

  conditions.push(newCondition)
  savePreExistingConditions(conditions)
  return newCondition
}

export function updatePreExistingCondition(
  id: string,
  updates: Partial<PreExistingCondition>,
): PreExistingCondition | null {
  const conditions = getPreExistingConditions()
  const index = conditions.findIndex((condition) => condition.id === id)

  if (index === -1) return null

  conditions[index] = { ...conditions[index], ...updates }
  savePreExistingConditions(conditions)
  return conditions[index]
}

export function deletePreExistingCondition(id: string): boolean {
  const conditions = getPreExistingConditions()
  const filteredConditions = conditions.filter((condition) => condition.id !== id)

  if (filteredConditions.length === conditions.length) return false

  savePreExistingConditions(filteredConditions)
  return true
}
