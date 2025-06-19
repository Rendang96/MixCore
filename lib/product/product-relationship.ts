// Function to get relationship statistics for a product
export function getProductRelationshipStats(productId: string): { policyCount: number; canDelete: boolean } {
  try {
    // Get policies associated with this product
    const policies = JSON.parse(localStorage.getItem("tpa_policies") || "[]")
    const associatedPolicies = policies.filter((p: any) => p.productCode === productId || p.productId === productId)

    return {
      policyCount: associatedPolicies.length,
      canDelete: associatedPolicies.length === 0,
    }
  } catch (error) {
    console.error("Error getting product relationship stats:", error)
    return {
      policyCount: 0,
      canDelete: true,
    }
  }
}

// Function to get all products for a specific payor
export function getProductsByPayor(payorCode: string): any[] {
  try {
    const products = JSON.parse(localStorage.getItem("tpa_products") || "[]")
    return products.filter((p: any) => p.payorCode === payorCode)
  } catch (error) {
    console.error("Error getting products by payor:", error)
    return []
  }
}

// Function to get full relationship hierarchy for a product
export function getProductHierarchy(productId: string): {
  product: any | null
  payor: any | null
  policies: any[]
} {
  try {
    // Get product
    const products = JSON.parse(localStorage.getItem("tpa_products") || "[]")
    const product = products.find((p: any) => p.id === productId)

    if (!product) {
      return { product: null, payor: null, policies: [] }
    }

    // Get payor
    const payors = JSON.parse(localStorage.getItem("tpa_payors") || "[]")
    const payor = payors.find((p: any) => p.code === product.payorCode)

    // Get policies
    const policies = JSON.parse(localStorage.getItem("tpa_policies") || "[]")
    const associatedPolicies = policies.filter((p: any) => p.productCode === product.code || p.productId === productId)

    return {
      product,
      payor: payor || null,
      policies: associatedPolicies,
    }
  } catch (error) {
    console.error("Error getting product hierarchy:", error)
    return { product: null, payor: null, policies: [] }
  }
}
