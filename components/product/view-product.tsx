"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Pencil, Trash2, ArrowUpDown, Download, SearchIcon } from "lucide-react"

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
  } | null
}

interface Policy {
  id: string
  number: string
  name: string
  effectiveDate: string
  expiryDate: string
  status: string
}

// Update the component to use the product prop
export function ViewProduct({ productId, onBack, product }: ViewProductProps) {
  // Sample policy data
  const policies: Policy[] = [
    {
      id: "1",
      number: "POL-2023-001",
      name: "Takaful Life 150_John",
      effectiveDate: "01-02-2022",
      expiryDate: "01-02-2022",
      status: "Inactive",
    },
    {
      id: "2",
      number: "POL-2025-0012",
      name: "Takaful Life 150_Ali",
      effectiveDate: "04-05-2025",
      expiryDate: "04-05-2025",
      status: "Active",
    },
  ]

  // Use the product data passed from the parent component
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">View Product</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
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
              <p className="text-sm font-medium text-slate-500">Product Type</p>
              <p className="font-medium">{product.type}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Payor</p>
              <p className="font-medium">{product.payor}</p>
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
          <h3 className="text-xl font-bold text-slate-800">Policy Listing</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input placeholder="Search" className="pl-9 w-64" />
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
              {policies.map((policy, index) => (
                <tr key={policy.id} className="text-slate-700">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">{policy.number}</td>
                  <td className="py-3 px-2">{policy.name}</td>
                  <td className="py-3 px-2">{policy.effectiveDate}</td>
                  <td className="py-3 px-2">{policy.expiryDate}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        policy.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
