import type { Product } from "@/components/product/product-search"
import { dummyProducts } from "./dummy-data"

// Key for storing products in localStorage
const PRODUCTS_STORAGE_KEY = "tpa_products"

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
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY)

    if (!storedProducts) {
      // If no products exist, initialize with dummy data
      saveProducts(dummyProducts)
      return dummyProducts
    }

    const products = JSON.parse(storedProducts)

    // If products array is empty, initialize with dummy data
    if (products.length === 0) {
      saveProducts(dummyProducts)
      return dummyProducts
    }

    return products
  } catch (error) {
    console.error("Error loading products from localStorage:", error)
    // Return dummy data as fallback
    return dummyProducts
  }
}
