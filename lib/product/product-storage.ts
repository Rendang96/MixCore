import { PayorStorage } from "@/lib/payor/payor-storage"
import { validateProductPayorRelationship } from "./product-validation"
import { getProductRelationshipStats } from "./product-relationship"

// Key for storing products in localStorage
const PRODUCTS_STORAGE_KEY = "tpa_products"

// Update the Product interface to ensure payor relationship
export interface Product {
  id: string
  name: string
  code: string
  payorCode: string // Make this required (remove ?)
  payor: string // Make this required (remove ?)
  type?: string
  status: string
  createdAt?: string
  updatedAt?: string
}

// Dummy product data
const dummyProducts: Product[] = [
  {
    id: "1749444557063",
    name: "New product",
    code: "gdfsf",
    payorCode: "GRE-001",
    payor: "Great Eastern",
    type: "ASO",
    status: "Active",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
  },
  {
    id: "1749444557064",
    name: "Premium Health Plan",
    code: "PHP-001",
    payorCode: "AIA-001",
    payor: "AIA Malaysia",
    type: "Individual",
    status: "Active",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
  {
    id: "1749444557065",
    name: "Corporate Medical Coverage",
    code: "CMC-002",
    payorCode: "ALI-001",
    payor: "Allianz Malaysia",
    type: "GHS",
    status: "Active",
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-08T14:20:00Z",
  },
  {
    id: "1749444557066",
    name: "Family Protection Plan",
    code: "FPP-003",
    payorCode: "PRU-001",
    payor: "Prudential Malaysia",
    type: "Individual",
    status: "Active",
    createdAt: "2024-01-05T11:45:00Z",
    updatedAt: "2024-01-05T11:45:00Z",
  },
  {
    id: "1749444557067",
    name: "Executive Health Package",
    code: "EHP-004",
    payorCode: "TUN-001",
    payor: "Tune Protect",
    type: "ASO",
    status: "Inactive",
    createdAt: "2023-12-20T16:30:00Z",
    updatedAt: "2023-12-20T16:30:00Z",
  },
  {
    id: "1749444557068",
    name: "Basic Medical Plan",
    code: "BMP-005",
    payorCode: "GRE-001",
    payor: "Great Eastern",
    type: "Individual",
    status: "Active",
    createdAt: "2023-12-15T10:00:00Z",
    updatedAt: "2023-12-15T10:00:00Z",
  },
  {
    id: "1749444557069",
    name: "Comprehensive Care Plus",
    code: "CCP-006",
    payorCode: "AIA-001",
    payor: "AIA Malaysia",
    type: "GHS",
    status: "Active",
    createdAt: "2023-12-10T13:25:00Z",
    updatedAt: "2023-12-10T13:25:00Z",
  },
  {
    id: "1749444557070",
    name: "Senior Citizen Plan",
    code: "SCP-007",
    payorCode: "ALI-001",
    payor: "Allianz Malaysia",
    type: "Individual",
    status: "Active",
    createdAt: "2023-12-05T15:10:00Z",
    updatedAt: "2023-12-05T15:10:00Z",
  },
]

// Function to initialize dummy data
function initializeDummyData(): void {
  try {
    const existingProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (!existingProducts) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(dummyProducts))
      console.log("Dummy product data initialized")
    }
  } catch (error) {
    console.error("Error initializing dummy product data:", error)
  }
}

// Function to save products to localStorage
export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error("Error saving products to localStorage:", error)
  }
}

// Function to load products from localStorage
export function getProducts(): Product[] {
  try {
    // Initialize dummy data if not exists
    initializeDummyData()

    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    let products = storedProducts ? JSON.parse(storedProducts) : dummyProducts

    // Populate payor names based on payor codes
    const payors = PayorStorage.getAllPayors()
    products = products.map((product: Product) => {
      if (product.payorCode && !product.payor) {
        const payor = payors.find((p) => p.code === product.payorCode)
        return {
          ...product,
          payor: payor ? payor.name : undefined,
        }
      }
      return product
    })

    // Save updated products back to storage if payor names were added
    if (products.some((p: Product) => p.payor)) {
      saveProducts(products)
    }

    return products
  } catch (error) {
    console.error("Error loading products from localStorage:", error)
    return dummyProducts
  }
}

// Add this function to check if product can be deleted
export function canDeleteProduct(productId: string): { canDelete: boolean; reason?: string } {
  const stats = getProductRelationshipStats(productId)

  if (!stats.canDelete) {
    return {
      canDelete: false,
      reason: `Cannot delete product. It has ${stats.policyCount} associated policy/policies.`,
    }
  }

  return { canDelete: true }
}

// Export the validation function for use in components
export { validateProductPayorRelationship }
