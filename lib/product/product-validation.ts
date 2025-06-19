import type { Product } from "@/lib/product/product-storage"

// Function to validate product-payor relationship
export function validateProductPayorRelationship(product: Product): { isValid: boolean; error?: string } {
  if (!product.payorCode) {
    return { isValid: false, error: "Product must be assigned to a payor" }
  }

  // Check if payor exists
  try {
    const payors = JSON.parse(localStorage.getItem("tpa_payors") || "[]")
    const payorExists = payors.some((p: any) => p.code === product.payorCode)

    if (!payorExists) {
      return { isValid: false, error: "Selected payor does not exist" }
    }

    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: "Error validating payor relationship" }
  }
}

// Function to validate product code uniqueness
export function validateProductCodeUniqueness(
  productCode: string,
  excludeId?: string,
): { isValid: boolean; error?: string } {
  try {
    const products = JSON.parse(localStorage.getItem("tpa_products") || "[]")
    const codeExists = products.some((p: any) => p.code === productCode && p.id !== excludeId)

    if (codeExists) {
      return { isValid: false, error: "Product code already exists" }
    }

    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: "Error validating product code" }
  }
}

// Function to validate required product fields
export function validateProductFields(product: Partial<Product>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!product.name?.trim()) {
    errors.push("Product name is required")
  }

  if (!product.code?.trim()) {
    errors.push("Product code is required")
  }

  if (!product.payorCode?.trim()) {
    errors.push("Payor selection is required")
  }

  if (!product.status?.trim()) {
    errors.push("Product status is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
