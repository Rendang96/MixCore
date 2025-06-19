"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Search, Download } from "lucide-react"
import { getPoliciesByProductCode } from "@/lib/policy/policy-storage"

interface Product {
  id: string
  name: string
  code: string
  payorCode?: string
  payor?: string
  type?: string
  status: string
}

interface ProductListingProps {
  products: Product[]
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductListing({ products, onView, onEdit, onDelete }: ProductListingProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Get actual policy count for a product
  const getPolicyCount = (productCode: string): number => {
    try {
      const policies = getPoliciesByProductCode(productCode)
      return policies.length
    } catch (error) {
      console.error("Error getting policy count:", error)
      return 0
    }
  }

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.payor && product.payor.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDelete = (product: Product) => {
    const policyCount = getPolicyCount(product.code)

    if (policyCount > 0) {
      alert(`Cannot delete product "${product.name}" because it has ${policyCount} associated policies.`)
      return
    }

    const confirmDelete = confirm(`Are you sure you want to delete product "${product.name}"?`)
    if (confirmDelete) {
      onDelete(product.id)
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = status.toLowerCase() === "active" ? "default" : "secondary"
    const className =
      status.toLowerCase() === "active"
        ? "bg-green-100 text-green-800 hover:bg-green-100"
        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"

    return (
      <Badge variant={variant} className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Product Listing</h2>
        <Button className="bg-sky-600 hover:bg-sky-700">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">No.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Product Name ↕</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Product Code ↕</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Payor ↕</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status ↕</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Policies ↕</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => {
                  const policyCount = getPolicyCount(product.code)

                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.payor || "Not Assigned"}</td>
                      <td className="px-4 py-3">{getStatusBadge(product.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <button
                          onClick={() => {
                            if (policyCount > 0) {
                              alert(`This product has ${policyCount} associated policies.`)
                            } else {
                              alert("This product has no associated policies.")
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {policyCount}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onView(product)} className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredProducts.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
    </div>
  )
}
