// This service will manage shared IDs across all catalogue item types
// to ensure consistency between pre-existing conditions, specified illnesses,
// congenital conditions, and general exclusions

export type CatalogueItemType = "pre-existing" | "specified-illness" | "congenital-condition" | "general-exclusion"

export type CatalogueItemBase = {
  id: string // Internal ID for the system
  itemId: string // Shared ID across all catalogue types
  name: string
  description: string
  type: CatalogueItemType
  catalogue: string
}

const STORAGE_KEY = "shared-catalogue-items"

// Get the next available item ID
export function getNextItemId(): string {
  if (typeof window === "undefined") return "ITEM001"

  const items = getAllItems()

  if (items.length === 0) {
    return "ITEM001"
  }

  // Extract numeric part of the last item ID and increment
  const lastItemId = items.reduce((max, item) => {
    // Extract numeric part from itemId (assuming format ITEMxxx)
    const match = item.itemId.match(/ITEM(\d+)/)
    if (!match) return max

    const num = Number.parseInt(match[1], 10)
    return num > max ? num : max
  }, 0)

  return `ITEM${(lastItemId + 1).toString().padStart(3, "0")}`
}

// Get all catalogue items
export function getAllItems(): CatalogueItemBase[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return []
  }
}

// Save all catalogue items
export function saveAllItems(items: CatalogueItemBase[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

// Add a new catalogue item
export function addItem(item: Omit<CatalogueItemBase, "id">): CatalogueItemBase {
  const items = getAllItems()

  const newItem: CatalogueItemBase = {
    ...item,
    id: Date.now().toString(),
  }

  items.push(newItem)
  saveAllItems(items)
  return newItem
}

// Check if an item ID already exists
export function itemIdExists(itemId: string): boolean {
  const items = getAllItems()
  return items.some((item) => item.itemId === itemId)
}

// Get item by itemId
export function getItemById(itemId: string): CatalogueItemBase | null {
  const items = getAllItems()
  return items.find((item) => item.itemId === itemId) || null
}

// Initialize with some sample data if empty
export function initializeIfEmpty(): void {
  const items = getAllItems()

  if (items.length === 0) {
    const sampleItems: Omit<CatalogueItemBase, "id">[] = [
      {
        itemId: "ITEM001",
        name: "Diabetes Mellitus Type 2",
        description: "A chronic metabolic disorder characterized by high blood glucose levels",
        type: "pre-existing",
        catalogue: "KPJ Catalogue",
      },
      {
        itemId: "ITEM002",
        name: "Hypertension",
        description: "Chronic condition with blood pressure consistently above normal",
        type: "pre-existing",
        catalogue: "KPJ Catalogue",
      },
      {
        itemId: "ITEM003",
        name: "Coronary Heart Disease",
        description: "Blockage of coronary arteries",
        type: "specified-illness",
        catalogue: "KPJ Catalogue",
      },
      {
        itemId: "ITEM004",
        name: "Congenital Heart Defect",
        description: "Structural heart defect present at birth",
        type: "congenital-condition",
        catalogue: "KPJ Catalogue",
      },
      {
        itemId: "ITEM005",
        name: "Self-inflicted Injuries",
        description: "Any injury, illness, or condition that is intentionally self-inflicted",
        type: "general-exclusion",
        catalogue: "KPJ Catalogue",
      },
    ]

    sampleItems.forEach((item) => addItem(item))
  }
}
