export interface Catalogue {
  id: string
  code: string
  name: string
  description: string
  category: string
  type: string
  status: string
  items: CatalogueItem[]
  lastUpdated: string
  itemCounts: {
    preExisting: number
    specified: number
    congenital: number
    exclusions: number
  }
}

// Update the CatalogueItem interface to include the new fields
export interface CatalogueItem {
  id: string
  name: string
  description: string
  type: "benefit" | "exclusion" | "pre-existing" | "specified" | "congenital"
  code?: string
  waitingPeriod?: string
  coInsurance?: string
  deductible?: string
  coPayment?: string
}

// Use localStorage for data persistence
const STORAGE_KEY = "catalogues"

function getCataloguesFromStorage(): Catalogue[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }

  // Return default data if nothing in storage
  return [
    {
      id: "CAT123",
      code: "CAT123",
      name: "KPJ Catalogue",
      description: "Standard catalogue for KPJ Healthcare providers",
      category: "medical",
      type: "benefit",
      status: "active",
      lastUpdated: "2023-05-15",
      itemCounts: {
        preExisting: 1,
        specified: 1,
        congenital: 1,
        exclusions: 1,
      },
      items: [
        {
          id: "1",
          name: "Pre-existing condition example",
          description: "Sample pre-existing condition",
          type: "pre-existing",
          code: "PE001",
        },
        {
          id: "2",
          name: "Specified condition example",
          description: "Sample specified condition",
          type: "specified",
          code: "SP001",
        },
      ],
    },
    {
      id: "CAT456",
      code: "CAT456",
      name: "Prudential Standard Catalogue",
      description: "Default catalogue for Prudential insurance policies",
      category: "medical",
      type: "benefit",
      status: "active",
      lastUpdated: "2023-05-15",
      itemCounts: {
        preExisting: 0,
        specified: 0,
        congenital: 0,
        exclusions: 0,
      },
      items: [],
    },
    {
      id: "cat1236",
      code: "cat1236",
      name: "tesqt",
      description: "Test catalogue description",
      category: "medical",
      type: "benefit",
      status: "draft",
      lastUpdated: "2023-06-05",
      itemCounts: {
        preExisting: 1,
        specified: 1,
        congenital: 1,
        exclusions: 1,
      },
      items: [
        {
          id: "3",
          name: "Hypertension",
          description: "High blood pressure condition",
          type: "pre-existing",
          code: "174909985709",
        },
        {
          id: "4",
          name: "Cancer",
          description: "Cancer condition",
          type: "specified",
          code: "174909985709",
        },
      ],
    },
  ]
}

function saveCataloguesToStorage(catalogues: Catalogue[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogues))
    console.log("Catalogues saved to localStorage:", catalogues)
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

export function getCatalogues(): Catalogue[] {
  const catalogues = getCataloguesFromStorage()
  console.log("Retrieved catalogues:", catalogues)
  return catalogues
}

export function getCatalogueById(id: string): Catalogue | undefined {
  const catalogues = getCataloguesFromStorage()
  const catalogue = catalogues.find((catalogue) => catalogue.id === id)
  console.log("getCatalogueById called with id:", id)
  console.log("Found catalogue:", catalogue)
  return catalogue
}

export function createCatalogue(catalogue: Omit<Catalogue, "lastUpdated">): Catalogue {
  const catalogues = getCataloguesFromStorage()
  const newCatalogue: Catalogue = {
    ...catalogue,
    lastUpdated: new Date().toISOString().split("T")[0],
  }
  catalogues.push(newCatalogue)
  saveCataloguesToStorage(catalogues)
  console.log("Created new catalogue:", newCatalogue)
  return newCatalogue
}

export function updateCatalogue(id: string, updates: Partial<Catalogue>): Catalogue | null {
  const catalogues = getCataloguesFromStorage()
  const index = catalogues.findIndex((catalogue) => catalogue.id === id)
  if (index === -1) {
    console.log("Catalogue not found for update:", id)
    return null
  }

  // Calculate item counts based on items
  const items = updates.items || catalogues[index].items || []
  const itemCounts = {
    preExisting: items.filter((item) => item.type === "pre-existing").length,
    specified: items.filter((item) => item.type === "specified").length,
    congenital: items.filter((item) => item.type === "congenital").length,
    exclusions: items.filter((item) => item.type === "exclusion").length,
  }

  catalogues[index] = {
    ...catalogues[index],
    ...updates,
    itemCounts,
    lastUpdated: new Date().toISOString().split("T")[0],
  }

  saveCataloguesToStorage(catalogues)
  console.log("Updated catalogue:", catalogues[index])
  return catalogues[index]
}

export function deleteCatalogue(id: string): boolean {
  const catalogues = getCataloguesFromStorage()
  const index = catalogues.findIndex((catalogue) => catalogue.id === id)
  if (index === -1) {
    console.log("Catalogue not found for deletion:", id)
    return false
  }

  catalogues.splice(index, 1)
  saveCataloguesToStorage(catalogues)
  console.log("Deleted catalogue with id:", id)
  return true
}
