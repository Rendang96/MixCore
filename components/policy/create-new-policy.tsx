"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Calendar, Search } from "lucide-react"
import { PolicyRuleTab } from "./policy-rule-tab"
import { ServiceTypeTab } from "./service-type-tab"
import { ContactInformationTab } from "./contact-information-tab"
import {
  saveBasicPolicyInfo,
  savePolicyRuleInfo,
  saveServiceTypeInfo,
  saveContactInfo,
  type CompletePolicy,
  type PolicyRuleInfo,
  type ServiceTypeInfo,
  type ContactInfo,
} from "@/lib/policy/policy-storage"
import { getProducts } from "@/lib/product/product-storage"
import type { Product } from "@/components/product/product-search"

type CreateNewPolicyProps = {}

export function CreateNewPolicy() {
  const router = useRouter()
  const [policyId, setPolicyId] = useState("")
  const [policyNumber, setPolicyNumber] = useState("")
  const [policyName, setPolicyName] = useState("")
  const [productCode, setProductCode] = useState("")
  const [productName, setProductName] = useState("")
  const [fundingType, setFundingType] = useState("")
  const [policyTerm, setPolicyTerm] = useState("")
  const [effectiveDate, setEffectiveDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [status, setStatus] = useState("Active")
  const [activeTab, setActiveTab] = useState("basic")
  const [products, setProducts] = useState<Product[]>([])
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // State for nested data from tabs
  const [policyRuleData, setPolicyRuleData] = useState<PolicyRuleInfo | undefined>(undefined)
  const [serviceTypeData, setServiceTypeData] = useState<ServiceTypeInfo | undefined>(undefined)
  const [contactInfoData, setContactInfoData] = useState<ContactInfo | undefined>(undefined)

  // Effect to load initial policy data from localStorage if present (for copied policies)
  useEffect(() => {
    const storedInitialPolicy = localStorage.getItem("policyToInitialize")
    if (storedInitialPolicy) {
      const parsedPolicy: CompletePolicy = JSON.parse(storedInitialPolicy)
      setPolicyId(uuidv4()) // Always generate a new ID for the new policy
      setPolicyNumber(parsedPolicy.policyNumber || "") // Keep original number or clear if desired for new entry
      setPolicyName(parsedPolicy.policyName ? `Copy of ${parsedPolicy.policyName}` : "") // Prefix name
      setProductCode(parsedPolicy.productCode || "")
      setProductName(parsedPolicy.productName || "")
      setFundingType(parsedPolicy.fundingType || "")
      setPolicyTerm(parsedPolicy.policyTerm || "")
      setEffectiveDate(parsedPolicy.effectiveDate || "")
      setExpiryDate(parsedPolicy.expiryDate || "")
      setStatus(parsedPolicy.status || "Active")

      // Set initial data for nested tabs
      setPolicyRuleData(parsedPolicy.policyRule)
      setServiceTypeData(parsedPolicy.serviceType)
      setContactInfoData(parsedPolicy.contactInfo)

      localStorage.removeItem("policyToInitialize") // Clear after use
    } else {
      // For a genuinely new policy, just generate a new ID
      setPolicyId(uuidv4())
    }

    // Load products from storage
    const productList = getProducts()
    setProducts(productList)
  }, [])

  // Filter products based on search term
  useEffect(() => {
    if (productSearchTerm.trim()) {
      const filtered = products.filter(
        (product) =>
          product.code.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
          product.name.toLowerCase().includes(productSearchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [productSearchTerm, products])

  const validatePolicyProductRelationship = (policy: Partial<CompletePolicy>) => {
    // Mock validation logic
    if (policy.productCode === "INVALID_PRODUCT") {
      return { isValid: false, error: "Policy cannot be associated with the selected product." }
    }

    return { isValid: true, error: null }
  }

  const handleSaveBasicInfo = () => {
    // Validate required fields
    if (!policyNumber.trim()) {
      alert("Policy Number is required")
      return
    }

    if (!policyName.trim()) {
      alert("Policy Name is required")
      return
    }

    if (!productCode.trim()) {
      alert("Product selection is required")
      return
    }

    const currentPolicy: CompletePolicy = {
      id: policyId,
      policyNumber,
      policyName,
      productCode,
      productName,
      fundingType,
      policyTerm,
      effectiveDate,
      expiryDate,
      payor: "Sample Payor",
      status,
      policyRule: policyRuleData,
      serviceType: serviceTypeData,
      contactInfo: contactInfoData,
    }

    const validation = validatePolicyProductRelationship(currentPolicy)
    if (!validation.isValid) {
      alert(validation.error)
      return
    }

    saveBasicPolicyInfo(currentPolicy)
    alert("Basic information saved successfully!")
  }

  const handleFinalSave = () => {
    const finalPolicy: CompletePolicy = {
      id: policyId,
      policyNumber,
      policyName,
      productCode,
      productName,
      fundingType,
      policyTerm,
      effectiveDate,
      expiryDate,
      payor: "Sample Payor",
      status,
      policyRule: policyRuleData,
      serviceType: serviceTypeData,
      contactInfo: contactInfoData,
    }

    saveBasicPolicyInfo(finalPolicy) // Ensures basic info is saved/updated
    if (finalPolicy.policyRule) savePolicyRuleInfo(policyId, finalPolicy.policyRule)
    if (finalPolicy.serviceType) saveServiceTypeInfo(policyId, finalPolicy.serviceType)
    if (finalPolicy.contactInfo) saveContactInfo(policyId, finalPolicy.contactInfo)

    alert("Policy saved successfully!")
    router.push("/policy/results") // Navigate back to results after saving
  }

  const handleCancel = () => {
    router.push("/policy") // Navigate back to search page
  }

  const onBreadcrumbClick = (path: string) => {
    if (path === "home") {
      router.push("/")
    } else if (path === "policy") {
      router.push("/policy")
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/", isHome: true, onClick: () => onBreadcrumbClick("home") },
            { label: "Policy", href: "#", onClick: () => onBreadcrumbClick("policy") },
            { label: "Create New Policy" },
          ]}
        />
        <h1 className="text-2xl font-semibold mt-4 mb-6">Create New Policy</h1>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${activeTab === "basic" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "policy-rule" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("policy-rule")}
          >
            Policy Rule
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "service-type" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("service-type")}
          >
            Service Type
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "contact" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Information
          </button>
        </div>
      </div>

      {activeTab === "basic" && (
        <Card className="rounded-lg border bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">Policy Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="policyNumber" className="text-sm font-medium text-slate-700">
                  Policy Number
                </label>
                <Input
                  id="policyNumber"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="Enter Policy Number"
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label htmlFor="policyName" className="text-sm font-medium text-slate-700">
                  Policy Name
                </label>
                <Input
                  id="policyName"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="Enter Policy Name"
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label htmlFor="productCode" className="text-sm font-medium text-slate-700">
                  Product Code
                </label>
                <div className="relative">
                  <Input
                    id="productCode"
                    value={productCode}
                    onChange={(e) => {
                      setProductCode(e.target.value)
                      setProductSearchTerm(e.target.value)
                    }}
                    placeholder="Type to search product code..."
                    className="w-full mt-1 pr-10"
                    autoComplete="off"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  {filteredProducts.length > 0 && productSearchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg bg-white max-h-60 overflow-y-auto z-50">
                      <ul className="divide-y">
                        {filteredProducts.map((product) => (
                          <li
                            key={product.id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setProductCode(product.code)
                              setProductName(product.name)
                              setProductSearchTerm("")
                              setFilteredProducts([])
                            }}
                          >
                            <div className="font-medium text-sm">{product.code}</div>
                            <div className="text-xs text-gray-600">{product.name}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="productName" className="text-sm font-medium text-slate-700">
                  Product Name
                </label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter Product Name"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label htmlFor="fundingType" className="text-sm font-medium text-slate-700">
                  Funding Type
                </label>
                <Select value={fundingType} onValueChange={setFundingType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">ASO</SelectItem>
                    <SelectItem value="type2">GHS</SelectItem>
                    <SelectItem value="type3">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="policyTerm" className="text-sm font-medium text-slate-700">
                  Policy Term/Period
                </label>
                <Select value={policyTerm} onValueChange={setPolicyTerm}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                    <SelectItem value="3years">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="effectiveDate" className="text-sm font-medium text-slate-700">
                    Policy Effective Date
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="expiryDate" className="text-sm font-medium text-slate-700">
                    Policy Expiry Date
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button onClick={handleCancel} variant="destructive">
                Cancel
              </Button>
              <Button onClick={handleSaveBasicInfo} className="bg-sky-600 hover:bg-sky-700">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "policy-rule" && (
        <PolicyRuleTab
          policyId={policyId}
          onSave={(data) => {
            setPolicyRuleData(data)
            setActiveTab("service-type")
          }}
          onCancel={handleCancel}
          initialData={policyRuleData}
        />
      )}

      {activeTab === "service-type" && (
        <Card className="rounded-lg border bg-white shadow-sm">
          <CardContent className="p-6">
            <ServiceTypeTab
              policyId={policyId}
              onSave={(data) => {
                setServiceTypeData(data)
                setActiveTab("contact")
              }}
              onCancel={handleCancel}
              initialData={serviceTypeData}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "contact" && (
        <ContactInformationTab
          policyId={policyId}
          onSave={(data) => {
            setContactInfoData(data)
            handleFinalSave()
          }}
          onCancel={handleCancel}
          initialData={contactInfoData}
        />
      )}
    </div>
  )
}
