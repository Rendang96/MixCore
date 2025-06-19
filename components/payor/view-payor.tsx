"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getProducts } from "@/lib/product/product-storage"
import { ChevronDown, ChevronRight } from "lucide-react"

type TabType = "basic-info" | "contact-details" | "products"

// Define the Payor interface if not already imported
interface PayorContact {
  id: string
  name: string
  category: string
  designation: string
  email: string
  mobileNo: string
  officeNo: string
  extNo: string
  status: string
  remarks: string
}

interface Payor {
  id: string
  name: string
  code: string
  address: string
  city: string
  postcode: string
  state: string
  country: string
  remarks: string
  status: string
  contacts: PayorContact[]
}

interface ViewPayorProps {
  payor: Payor
  onBack: () => void
}

export function ViewPayor({ payor, onBack }: ViewPayorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic-info")
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())

  // Breadcrumb items for View Payor
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Payor",
      onClick: onBack,
    },
    { label: "View Payor" },
  ]

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
  }

  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts)
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId)
    } else {
      newExpanded.add(productId)
    }
    setExpandedProducts(newExpanded)
  }

  const getPoliciesForProduct = (productCode: string) => {
    try {
      // Use the correct storage key that matches the policy storage system
      const policies = JSON.parse(localStorage.getItem("policies") || "[]")
      return policies.filter((policy: any) => policy.productCode === productCode)
    } catch (error) {
      console.error("Error getting policies for product:", error)
      return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">View Payor</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "basic-info"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => handleTabClick("basic-info")}
        >
          Basic Information
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "contact-details"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => handleTabClick("contact-details")}
        >
          Contact Details
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "products" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => handleTabClick("products")}
        >
          Products
        </button>
      </div>

      {activeTab === "basic-info" ? (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="payor-name" className="text-sm font-medium text-slate-700">
                Payor Name
              </label>
              <Input id="payor-name" className="w-full bg-slate-50" value={payor.name} disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="payor-code" className="text-sm font-medium text-slate-700">
                Payor Code
              </label>
              <Input id="payor-code" className="w-full bg-slate-50" value={payor.code} disabled />
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-slate-700">
                Address
              </label>
              <Input id="address" className="w-full bg-slate-50" value={payor.address} disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="postcode" className="text-sm font-medium text-slate-700">
                Postcode
              </label>
              <Input id="postcode" className="w-full bg-slate-50" value={payor.postcode} disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-slate-700">
                City
              </label>
              <Select value={payor.city} disabled>
                <SelectTrigger id="city" className="w-full bg-slate-50">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="penang">Penang</SelectItem>
                  <SelectItem value="johor-bahru">Johor Bahru</SelectItem>
                  <SelectItem value="ipoh">Ipoh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-slate-700">
                State
              </label>
              <Select value={payor.state} disabled>
                <SelectTrigger id="state" className="w-full bg-slate-50">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selangor">Selangor</SelectItem>
                  <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="penang">Penang</SelectItem>
                  <SelectItem value="johor">Johor</SelectItem>
                  <SelectItem value="perak">Perak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-slate-700">
                Country
              </label>
              <Select value={payor.country} disabled>
                <SelectTrigger id="country" className="w-full bg-slate-50">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malaysia">Malaysia</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="thailand">Thailand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor="remarks" className="text-sm font-medium text-slate-700">
                Remarks
              </label>
              <Textarea id="remarks" className="w-full bg-slate-50" value={payor.remarks} disabled />
            </div>
          </div>
        </div>
      ) : activeTab === "contact-details" ? (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          {payor.contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No contact details available for this payor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-slate-500">
                    <th className="py-3 px-4">No.</th>
                    <th className="py-3 px-4">Contact Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Mobile No.</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {payor.contacts.map((contact, index) => (
                    <tr key={contact.id} className="text-slate-700">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{contact.name}</td>
                      <td className="py-3 px-4">{contact.category}</td>
                      <td className="py-3 px-4">{contact.designation}</td>
                      <td className="py-3 px-4">{contact.email}</td>
                      <td className="py-3 px-4">{contact.mobileNo}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            contact.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {contact.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === "products" ? (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          {(() => {
            const products = getProducts().filter((product) => product.payorCode === payor.code)
            return products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">No products assigned to this payor.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-slate-500">
                      <th className="py-3 px-4 w-8"></th>
                      <th className="py-3 px-4">No.</th>
                      <th className="py-3 px-4">Product Code</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Created Date</th>
                      <th className="py-3 px-4">Policies</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {products.map((product, index) => {
                      const policies = getPoliciesForProduct(product.code)
                      const isExpanded = expandedProducts.has(product.id)
                      return (
                        <>
                          <tr key={product.id} className="text-slate-700 border-b hover:bg-slate-50">
                            <td className="py-3 px-4">
                              {policies.length > 0 && (
                                <button
                                  onClick={() => toggleProductExpansion(product.id)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </td>
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4 font-medium">{product.code}</td>
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4">{product.type || "N/A"}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                  product.status === "Active"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-2 py-1 text-xs font-medium">
                                {policies.length} {policies.length === 1 ? "Policy" : "Policies"}
                              </span>
                            </td>
                          </tr>
                          {isExpanded && policies.length > 0 && (
                            <tr key={`${product.id}-policies`}>
                              <td colSpan={8} className="py-0 px-4">
                                <div className="bg-slate-50 rounded-lg p-4 my-2">
                                  <h4 className="text-sm font-medium text-slate-700 mb-3">
                                    Policies for {product.name}
                                  </h4>
                                  <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                      <thead>
                                        <tr className="border-b text-left text-xs font-medium text-slate-500">
                                          <th className="py-2 px-3">Policy Number</th>
                                          <th className="py-2 px-3">Policy Name</th>
                                          <th className="py-2 px-3">Status</th>
                                          <th className="py-2 px-3">Effective Date</th>
                                          <th className="py-2 px-3">Expiry Date</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y text-xs">
                                        {policies.map((policy: any) => (
                                          <tr key={policy.id} className="text-slate-600">
                                            <td className="py-2 px-3 font-medium">{policy.policyNumber}</td>
                                            <td className="py-2 px-3">{policy.policyName}</td>
                                            <td className="py-2 px-3">
                                              <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                  policy.status === "Active"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                                }`}
                                              >
                                                {policy.status}
                                              </span>
                                            </td>
                                            <td className="py-2 px-3">
                                              {policy.effectiveDate
                                                ? new Date(policy.effectiveDate).toLocaleDateString()
                                                : "N/A"}
                                            </td>
                                            <td className="py-2 px-3">
                                              {policy.expiryDate
                                                ? new Date(policy.expiryDate).toLocaleDateString()
                                                : "N/A"}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })()}
        </div>
      ) : null}
    </div>
  )
}
