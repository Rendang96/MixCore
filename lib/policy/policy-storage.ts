import { v4 as uuidv4 } from "uuid"

// Define types for policy data
export interface PolicyBasicInfo {
  id: string
  policyNumber: string
  policyName: string
  productCode: string // Added product code
  productName: string // Added product name
  fundingType: string
  policyTerm: string
  effectiveDate: string
  expiryDate: string
  payor: string
  status: string
}

export interface PolicyRuleInfo {
  catalogueCode: string
  catalogueName: string
  catalogueDescription: string
  preExistingConditions: any[]
  specifiedIllnesses: any[]
  congenitalConditions: any[]
  exclusions: any[]
}

export interface ServiceTypeInfo {
  serviceTypes: any[]
}

export interface ContactInfo {
  contacts: any[]
}

export interface CompletePolicy extends PolicyBasicInfo {
  policyRule?: PolicyRuleInfo
  serviceType?: ServiceTypeInfo
  contactInfo?: ContactInfo
}

// Local storage keys
const POLICIES_KEY = "policies"
const POLICY_RULE_PREFIX = "policy_rule_"
const SERVICE_TYPE_PREFIX = "service_type_"
const CONTACT_INFO_PREFIX = "contact_info_"

// Save basic policy information
export function saveBasicPolicyInfo(policy: PolicyBasicInfo): void {
  const policies = getPolicies()
  const existingIndex = policies.findIndex((p) => p.id === policy.id)

  if (existingIndex >= 0) {
    policies[existingIndex] = { ...policies[existingIndex], ...policy }
  } else {
    policies.push(policy)
  }

  localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
}

// Save policy rule information
export function savePolicyRuleInfo(policyId: string, ruleInfo: PolicyRuleInfo): void {
  localStorage.setItem(`${POLICY_RULE_PREFIX}${policyId}`, JSON.stringify(ruleInfo))

  // Update the policy in the policies list
  const policies = getPolicies()
  const policyIndex = policies.findIndex((p) => p.id === policyId)

  if (policyIndex >= 0) {
    policies[policyIndex].policyRule = ruleInfo
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
  }
}

// Save service type information
export function saveServiceTypeInfo(policyId: string, serviceTypeInfo: ServiceTypeInfo): void {
  localStorage.setItem(`${SERVICE_TYPE_PREFIX}${policyId}`, JSON.stringify(serviceTypeInfo))

  // Update the policy in the policies list
  const policies = getPolicies()
  const policyIndex = policies.findIndex((p) => p.id === policyId)

  if (policyIndex >= 0) {
    policies[policyIndex].serviceType = serviceTypeInfo
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
  }
}

// Save contact information
export function saveContactInfo(policyId: string, contactInfo: ContactInfo): void {
  localStorage.setItem(`${CONTACT_INFO_PREFIX}${policyId}`, JSON.stringify(contactInfo))

  // Update the policy in the policies list
  const policies = getPolicies()
  const policyIndex = policies.findIndex((p) => p.id === policyId)

  if (policyIndex >= 0) {
    policies[policyIndex].contactInfo = contactInfo
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
  }
}

// Get all policies with their complete information
export function getPolicies(): CompletePolicy[] {
  const policiesJson = localStorage.getItem(POLICIES_KEY)
  if (!policiesJson) return []

  try {
    return JSON.parse(policiesJson)
  } catch (error) {
    console.error("Error parsing policies from localStorage:", error)
    return []
  }
}

// Get a specific policy by ID
export function getPolicy(policyId: string): CompletePolicy | null {
  const policies = getPolicies()
  return policies.find((p) => p.id === policyId) || null
}

// Delete a policy and all its related data
export function deletePolicy(policyId: string): void {
  const policies = getPolicies().filter((p) => p.id !== policyId)
  localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))

  // Remove related data
  localStorage.removeItem(`${POLICY_RULE_PREFIX}${policyId}`)
  localStorage.removeItem(`${SERVICE_TYPE_PREFIX}${policyId}`)
  localStorage.removeItem(`${CONTACT_INFO_PREFIX}${policyId}`)
}

// Helper function to get formatted service types
export function getFormattedServiceTypes(policy: CompletePolicy): string {
  if (!policy.serviceType || !policy.serviceType.serviceTypes || policy.serviceType.serviceTypes.length === 0) {
    return "N/A"
  }

  return policy.serviceType.serviceTypes.map((st) => st.code || st.name).join(", ")
}

// Get policies by product code
export function getPoliciesByProductCode(productCode: string): CompletePolicy[] {
  const policies = getPolicies()
  return policies.filter((policy) => policy.productCode === productCode)
}

// Initialize dummy policy data
export function initializeDummyPolicyData(force = false): void {
  const existingPolicies = getPolicies()

  // Only initialize if no policies exist OR if forced
  if (existingPolicies.length === 0 || force) {
    // Clear existing data first if forcing
    if (force) {
      clearAllPolicies()
    }

    // Comment out or remove the dummy data creation
    // const dummyPolicies: CompletePolicy[] = [...]

    // For now, just initialize with empty array
    localStorage.setItem(POLICIES_KEY, JSON.stringify([]))

    console.log("Policy storage initialized (empty)")
  }
}

// Relationship validation functions

// Function to validate policy-product relationship
export function validatePolicyProductRelationship(policy: PolicyBasicInfo): { isValid: boolean; error?: string } {
  if (!policy.productCode) {
    return { isValid: false, error: "Policy must be assigned to a product" }
  }

  // Check if product exists
  try {
    const productsData = localStorage.getItem("tpa_products")
    if (!productsData) {
      return { isValid: false, error: "No products available" }
    }

    const products = JSON.parse(productsData)
    const productExists = products.some((p: any) => p.code === policy.productCode)

    if (!productExists) {
      return { isValid: false, error: "Selected product does not exist" }
    }

    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: "Error validating product relationship" }
  }
}

// Function to get policy with full relationship data
export function getPolicyWithRelationships(policyId: string): {
  policy: CompletePolicy | null
  product: any | null
  payor: any | null
} {
  const policy = getPolicy(policyId)
  let product = null
  let payor = null

  if (policy?.productCode) {
    try {
      // Get product
      const productsData = localStorage.getItem("tpa_products")
      if (productsData) {
        const products = JSON.parse(productsData)
        product = products.find((p: any) => p.code === policy.productCode)

        // Get payor through product
        if (product?.payorCode) {
          const payorsData = localStorage.getItem("tpa_payors")
          if (payorsData) {
            const payors = JSON.parse(payorsData)
            payor = payors.find((p: any) => p.code === product.payorCode)
          }
        }
      }
    } catch (error) {
      console.error("Error getting policy relationships:", error)
    }
  }

  return { policy, product, payor }
}

// Function to update policy product relationship
export function updatePolicyProductRelationship(policyId: string, newProductCode: string): boolean {
  try {
    const policies = getPolicies()
    const policyIndex = policies.findIndex((p) => p.id === policyId)

    if (policyIndex === -1) return false

    // Validate new product exists
    const productsData = localStorage.getItem("tpa_products")
    if (!productsData) return false

    const products = JSON.parse(productsData)
    const newProduct = products.find((p: any) => p.code === newProductCode)

    if (!newProduct) return false

    // Update policy
    policies[policyIndex].productCode = newProductCode
    policies[policyIndex].productName = newProduct.name

    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))
    return true
  } catch (error) {
    console.error("Error updating policy product relationship:", error)
    return false
  }
}

// Function to get policies by product code with validation
export function getPoliciesByProductCodeValidated(productCode: string): CompletePolicy[] {
  const validation = validateProductExists(productCode)
  if (!validation.isValid) {
    console.warn(`Product ${productCode} does not exist`)
    return []
  }

  return getPoliciesByProductCode(productCode)
}

// Helper function to validate product exists
function validateProductExists(productCode: string): { isValid: boolean; error?: string } {
  try {
    const productsData = localStorage.getItem("tpa_products")
    if (!productsData) {
      return { isValid: false, error: "No products available" }
    }

    const products = JSON.parse(productsData)
    const productExists = products.some((p: any) => p.code === productCode)

    return productExists ? { isValid: true } : { isValid: false, error: "Product does not exist" }
  } catch (error) {
    return { isValid: false, error: "Error validating product" }
  }
}

// Function to get relationship hierarchy for a policy
export function getPolicyRelationshipHierarchy(policyId: string): {
  policy: CompletePolicy | null
  product: any | null
  payor: any | null
  hierarchy: string
} {
  const { policy, product, payor } = getPolicyWithRelationships(policyId)

  let hierarchy = "Unknown"
  if (payor && product && policy) {
    hierarchy = `${payor.name} → ${product.name} → ${policy.policyName}`
  }

  return { policy, product, payor, hierarchy }
}

// Prepare a copy of an existing policy without saving it to storage
export function prepareCopiedPolicy(originalPolicyId: string): CompletePolicy | null {
  const originalPolicy = getPolicy(originalPolicyId)
  if (!originalPolicy) {
    return null
  }

  const newPolicyId = uuidv4()
  const copiedPolicy: CompletePolicy = {
    ...originalPolicy,
    id: newPolicyId,
    policyNumber: "", // Clear policy number for a new entry
    policyName: `Copy of ${originalPolicy.policyName}`, // Mark as copy
    // Deep copy for nested objects to ensure independence from original
    policyRule: originalPolicy.policyRule ? { ...originalPolicy.policyRule } : undefined,
    serviceType: originalPolicy.serviceType
      ? { ...originalPolicy.serviceType, serviceTypes: [...originalPolicy.serviceType.serviceTypes] }
      : undefined,
    contactInfo: originalPolicy.contactInfo
      ? { ...originalPolicy.contactInfo, contacts: [...originalPolicy.contactInfo.contacts] }
      : undefined,
  }

  return copiedPolicy
}

// Add a test policy for a specific product
export function addTestPolicyForProduct(productCode: string): CompletePolicy {
  const timestamp = new Date().getTime()
  const newPolicy: CompletePolicy = {
    id: `test-pol-${timestamp}`,
    policyNumber: `TEST-POL-${timestamp}`,
    policyName: `Test Policy for ${productCode}`,
    productCode: productCode,
    productName: `Product ${productCode}`,
    fundingType: "Test",
    policyTerm: "1year",
    effectiveDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    payor: "Test Payor",
    status: "Active",
  }

  // Save the policy
  const policies = getPolicies()
  policies.push(newPolicy)
  localStorage.setItem(POLICIES_KEY, JSON.stringify(policies))

  console.log(`Test policy created for product ${productCode}:`, newPolicy)
  return newPolicy
}

// Add test policies for PHP-001 and NEW-6000
export function addTestPoliciesForProducts(): void {
  // Add test policies for specific products
  addTestPolicyForProduct("PHP-001")
  addTestPolicyForProduct("NEW-6000")

  console.log("Test policies added for products PHP-001 and NEW-6000")
}

// Function to clear all policies and related data
export function clearAllPolicies(): void {
  // Clear main policies
  localStorage.removeItem(POLICIES_KEY)

  // Clear all related data by iterating through localStorage keys
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (
      key &&
      (key.startsWith(POLICY_RULE_PREFIX) || key.startsWith(SERVICE_TYPE_PREFIX) || key.startsWith(CONTACT_INFO_PREFIX))
    ) {
      keysToRemove.push(key)
    }
  }

  // Remove all related data
  keysToRemove.forEach((key) => localStorage.removeItem(key))

  console.log("All policies and related data cleared successfully")
}

// Function to reset policy storage (clear all and optionally reinitialize)
export function resetPolicyStorage(reinitialize = false): void {
  clearAllPolicies()

  if (reinitialize) {
    initializeDummyPolicyData()
  }
}
