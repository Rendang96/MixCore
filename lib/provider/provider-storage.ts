export interface Provider {
  id: string
  providerName: string
  providerCode: string
  providerType: string
  specialization: string
  contactPerson: string
  phoneNumber: string
  email: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  status: "Active" | "Inactive"
  registrationNumber: string
  licenseNumber: string
  accreditation: string
  contractStartDate: string
  contractEndDate: string
  paymentTerms: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "providers"

export function getProviders(): Provider[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading providers:", error)
    return []
  }
}

export function saveProvider(provider: Omit<Provider, "id" | "createdAt" | "updatedAt">): Provider {
  const providers = getProviders()
  const newProvider: Provider = {
    ...provider,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  providers.push(newProvider)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers))
  return newProvider
}

export function updateProvider(id: string, updates: Partial<Provider>): Provider | null {
  const providers = getProviders()
  const index = providers.findIndex((p) => p.id === id)

  if (index === -1) return null

  providers[index] = {
    ...providers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(providers))
  return providers[index]
}

export function deleteProvider(id: string): boolean {
  const providers = getProviders()
  const filteredProviders = providers.filter((p) => p.id !== id)

  if (filteredProviders.length === providers.length) return false

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProviders))
  return true
}

export function getProviderById(id: string): Provider | null {
  const providers = getProviders()
  return providers.find((p) => p.id === id) || null
}

export function searchProviders(filters: {
  providerName?: string
  providerCode?: string
  providerType?: string
  specialization?: string
  status?: string
}): Provider[] {
  const providers = getProviders()

  return providers.filter((provider) => {
    if (filters.providerName && !provider.providerName.toLowerCase().includes(filters.providerName.toLowerCase())) {
      return false
    }
    if (filters.providerCode && !provider.providerCode.toLowerCase().includes(filters.providerCode.toLowerCase())) {
      return false
    }
    if (filters.providerType && provider.providerType !== filters.providerType) {
      return false
    }
    if (
      filters.specialization &&
      !provider.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
    ) {
      return false
    }
    if (filters.status && provider.status !== filters.status) {
      return false
    }
    return true
  })
}
