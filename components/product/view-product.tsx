"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Pencil, Trash2, ArrowUpDown, Download, SearchIcon, RefreshCw } from "lucide-react"
import { PayorStorage } from "@/lib/payor/payor-storage"
import { getPolicies, getPoliciesByProductCode, type CompletePolicy } from "@/lib/policy/policy-storage"
import { useEffect, useState } from "react"

// Update the interface to include the product prop
interface ViewProductProps {
  productId: string | null
  onBack: () => void
  product: {
    id: string
    name: string
    code: string
    type: string
    payor: string
    status: string
    payorCode?: string
  } | null
}

// Update the component to use the product prop
export function ViewProduct({ productId, onBack, product }: ViewProductProps) {
  const [payorName, setPayorName] = useState<string>("-")
  const [linkedPolicies, setLinkedPolicies] = useState<CompletePolicy[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch payor name based on payorCode when component mounts or product changes
  useEffect(() => {
    // Initialize dummy payor data first
    PayorStorage.initializeDummyData()

    if (product?.payorCode) {
      // Get all payors and find the one matching the payorCode
      const payors = PayorStorage.getAllPayors()
      const matchingPayor = payors.find((payor) => payor.code === product.payorCode)

      if (matchingPayor) {
        setPayorName(matchingPayor.name)
      } else {
        setPayorName("-") // Default if no matching payor found
      }
    } else {
      setPayorName("-") // Default if no payorCode
    }
  }, [product])

  // Refresh function to load policies
  const refreshPolicies = () => {
    setIsLoading(true)

    if (product) {
      // Use the dedicated function to get policies by product code
      const filteredPolicies = getPoliciesByProductCode(product.code)
      setLinkedPolicies(filteredPolicies)
    }

    setIsLoading(false)
  }

  // Fetch policies linked to this specific product
  useEffect(() => {
    refreshPolicies()
  }, [product])

  // Filter policies based on search term
  const filteredPolicies = linkedPolicies.filter((policy) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      policy.policyNumber.toLowerCase().includes(searchLower) ||
      policy.policyName.toLowerCase().includes(searchLower) ||
      policy.status.toLowerCase().includes(searchLower)
    )
  })

  // Use the product data passed from the parent component
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">View Product</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshPolicies} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Product Information</h3>

        {product ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Product Name</p>
              <p className="font-medium">{product.name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Product Code</p>
              <p className="font-medium">{product.code}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Payor Code</p>
              <p className="font-medium">{product.payorCode || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Payor</p>
              <p className="font-medium">{product.payor || payorName}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Product Type</p>
              <p className="font-medium">{product.type}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Status</p>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  product.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {product.status}
              </span>
            </div>
          </div>
        ) : (
          <p>Product not found</p>
        )}
      </div>

      {/* Policy Listing Table */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Policy Listing</h3>
            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredPolicies.length} of {linkedPolicies.length} policies for this product
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Product Code: {product?.code} | Total Policies in System: {getPolicies().length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                placeholder="Search policies..."
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-slate-500">
                <th className="py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center">No.</div>
                </th>
                <th className="py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center">
                    Policy Number
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center">
                    Policy Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center">
                    Product Code
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center">
                    Effective Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center">
                    Expiry Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="py-3 px-2 whitespace-nowrap">
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="py-3 px-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy, index) => (
                  <tr key={policy.id} className="text-slate-700 hover:bg-slate-50">
                    <td className="py-3 px-2">{index + 1}</td>
                    <td className="py-3 px-2 font-medium">{policy.policyNumber}</td>
                    <td className="py-3 px-2">{policy.policyName}</td>
                    <td className="py-3 px-2 text-xs bg-slate-100 rounded px-1">{policy.productCode}</td>
                    <td className="py-3 px-2">{policy.effectiveDate}</td>
                    <td className="py-3 px-2">{policy.expiryDate}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          policy.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : policy.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    {searchTerm ? "No policies found matching your search" : "No policies found for this product"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
