"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Calendar, Search } from "lucide-react"
import { type CompletePolicy, saveBasicPolicyInfo } from "@/lib/policy/policy-storage"
import { PolicyRuleTab } from "./policy-rule-tab"
import { ServiceTypeTab } from "./service-type-tab"
import { ContactInformationTab } from "./contact-information-tab"
import { getProducts } from "@/lib/product/product-storage"
import type { Product } from "@/components/product/product-search"

interface EditPolicyProps {
  policy: CompletePolicy
  onSave: (policy: CompletePolicy) => void
  onCancel: () => void
  onBreadcrumbClick: (path: string) => void
}

export function EditPolicy({ policy, onSave, onCancel, onBreadcrumbClick }: EditPolicyProps) {
  const [policyNumber, setPolicyNumber] = useState(policy.policyNumber)
  const [policyName, setPolicyName] = useState(policy.policyName)
  const [fundingType, setFundingType] = useState(policy.fundingType)
  const [policyTerm, setPolicyTerm] = useState(policy.policyTerm)
  const [effectiveDate, setEffectiveDate] = useState(policy.effectiveDate)
  const [expiryDate, setExpiryDate] = useState(policy.expiryDate)
  const [status, setStatus] = useState(policy.status)
  const [payor, setPayor] = useState(policy.payor || "")
  const [activeTab, setActiveTab] = useState("basic")
  const [updatedPolicy, setUpdatedPolicy] = useState<CompletePolicy>(policy)

  const [products, setProducts] = useState<Product[]>([])
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Load products from storage
  useEffect(() => {
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

  // Update the local updatedPolicy state when basic info changes
  useEffect(() => {
    setUpdatedPolicy((prev) => ({
      ...prev,
      policyNumber,
      policyName,
      fundingType,
      policyTerm,
      effectiveDate,
      expiryDate,
      status,
      payor,
    }))
  }, [policyNumber, policyName, fundingType, policyTerm, effectiveDate, expiryDate, status, payor])

  const handleSaveBasicInfo = () => {
    // Create updated policy object
    const basicInfo = {
      id: policy.id,
      policyNumber,
      policyName,
      fundingType,
      policyTerm,
      effectiveDate,
      expiryDate,
      status,
      payor,
    }

    // Save basic info to local storage
    saveBasicPolicyInfo(basicInfo)

    // Update the updatedPolicy state
    setUpdatedPolicy((prev) => ({
      ...prev,
      ...basicInfo,
    }))

    // Show a success message or notification here if needed
    alert("Basic information saved successfully!")
  }

  const handleSavePolicyRule = () => {
    // Show a success message or notification here if needed
    alert("Policy rule information saved successfully!")
  }

  const handleSaveServiceType = () => {
    // Show a success message or notification here if needed
    alert("Service type information saved successfully!")
  }

  const handleFinalSave = () => {
    // Make sure we save all the latest changes
    const finalPolicy = {
      ...updatedPolicy,
      policyNumber,
      policyName,
      fundingType,
      policyTerm,
      effectiveDate,
      expiryDate,
      status,
      payor,
    }

    // Save to local storage
    saveBasicPolicyInfo(finalPolicy)

    // Call the onSave callback with the updated policy
    onSave(finalPolicy)
  }

  return (
    <div>
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/", isHome: true, onClick: () => onBreadcrumbClick("home") },
            { label: "Policy", href: "#", onClick: () => onBreadcrumbClick("policy") },
            { label: "Edit Policy" },
          ]}
        />
        <h1 className="text-xl font-semibold mt-4">Edit Policy</h1>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "basic" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "policy-rule" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("policy-rule")}
          >
            Policy Rule
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "service-type" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("service-type")}
          >
            Service Type
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "contact" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Information
          </button>
        </div>
      </div>

      {activeTab === "basic" && (
        <Card className="rounded-lg border bg-white p-6 shadow-sm">
          <CardContent className="p-0">
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
                  className="w-full"
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
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="productCode" className="text-sm font-medium text-slate-700">
                  Product Code
                </label>
                <div className="relative">
                  <Input
                    id="productCode"
                    value={policy.productCode || ""}
                    onChange={(e) => {
                      setProductSearchTerm(e.target.value)
                    }}
                    placeholder="Type to search product code..."
                    className="w-full pr-10"
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
                              // Update the policy object directly
                              setUpdatedPolicy((prev) => ({
                                ...prev,
                                productCode: product.code,
                                productName: product.name,
                              }))
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
                  value={policy.productName || ""}
                  readOnly
                  placeholder="Product name will be auto-filled"
                  className="w-full bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="policyTerm" className="text-sm font-medium text-slate-700">
                  Policy Term/Period
                </label>
                <Select value={policyTerm} onValueChange={setPolicyTerm}>
                  <SelectTrigger>
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
                <label htmlFor="fundingType" className="text-sm font-medium text-slate-700">
                  Funding Type
                </label>
                <Select value={fundingType} onValueChange={setFundingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">Type 1</SelectItem>
                    <SelectItem value="type2">Type 2</SelectItem>
                    <SelectItem value="type3">Type 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="payor" className="text-sm font-medium text-slate-700">
                  Payor
                </label>
                <Input
                  id="payor"
                  value={payor}
                  onChange={(e) => setPayor(e.target.value)}
                  placeholder="Enter Payor"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
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
                  <div className="relative">
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
                  <div className="relative">
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
              <Button onClick={onCancel} variant="destructive">
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
          policyId={policy.id}
          onSave={handleSavePolicyRule}
          onCancel={onCancel}
          initialData={policy.policyRule}
        />
      )}

      {activeTab === "service-type" && (
        <Card className="rounded-lg border bg-white shadow-sm">
          <CardContent className="p-6">
            <ServiceTypeTab
              policyId={policy.id}
              onSave={handleSaveServiceType}
              onCancel={onCancel}
              initialData={policy.serviceType}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === "contact" && (
        <ContactInformationTab
          policyId={policy.id}
          onSave={handleFinalSave}
          onCancel={onCancel}
          initialData={policy.contactInfo}
        />
      )}
    </div>
  )
}
