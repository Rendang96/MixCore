"use client"

import { useEffect } from "react"

import { useState } from "react"
import { Eye, Edit, Trash2, Download, Copy } from "lucide-react" // Import Copy icon

interface CompletePolicy {
  id: string
  policyName: string
  policyNumber: string
  productCode?: string
  productName?: string
  payorCode?: string
  payorName?: string
  status?: string
  effectiveDate?: string
  expiryDate?: string
}

interface PolicyRelationshipHierarchy {
  product?: { name: string; code: string }
  payor?: { name: string; code: string }
  hierarchy: string
}

interface PolicyListingProps {
  policies: CompletePolicy[]
  onView?: (policy: CompletePolicy) => void
  onEdit?: (policy: CompletePolicy) => void
  onDelete?: (policyId: string) => void
  onCopy?: (policyId: string) => void // Make optional
}

// Mock function to get policy relationship hierarchy
const getPolicyRelationshipHierarchy = (policyId: string): PolicyRelationshipHierarchy => {
  return {
    product: { name: "Sample Product", code: "PROD001" },
    payor: { name: "Sample Payor", code: "PAY001" },
    hierarchy: "Payor > Product > Policy",
  }
}

// Mock function to get member count for a policy
const getPolicyMemberCount = (policyId: string): number => {
  return Math.floor(Math.random() * 100) + 1
}

export function PolicyListing({ policies, onView, onEdit, onDelete, onCopy }: PolicyListingProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPolicies, setFilteredPolicies] = useState(policies)

  // Update filtered policies when the `policies` prop changes
  // This ensures the listing reflects changes from search or new policy creation
  useEffect(() => {
    handleSearch(searchTerm) // Re-filter with current search term
  }, [policies])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = policies.filter(
      (policy) =>
        policy.policyName.toLowerCase().includes(term.toLowerCase()) ||
        policy.policyNumber.toLowerCase().includes(term.toLowerCase()) ||
        (policy.productName && policy.productName.toLowerCase().includes(term.toLowerCase())) ||
        (policy.payorName && policy.payorName.toLowerCase().includes(term.toLowerCase())),
    )
    setFilteredPolicies(filtered)
  }

  const handleView = (policy: CompletePolicy) => {
    if (onView) {
      onView(policy)
    } else {
      console.log("View policy:", policy.id)
    }
  }

  const handleEdit = (policy: CompletePolicy) => {
    if (onEdit) {
      onEdit(policy)
    } else {
      console.log("Edit policy:", policy.id)
    }
  }

  const handleDelete = (policy: CompletePolicy) => {
    const memberCount = getPolicyMemberCount(policy.id)

    if (memberCount > 0) {
      alert(
        `Cannot delete policy "${policy.policyName}" because it has ${memberCount} associated members. Please remove all members first.`,
      )
      return
    }

    if (confirm(`Are you sure you want to delete policy "${policy.policyName}"?`)) {
      if (onDelete) {
        onDelete(policy.id)
      } else {
        console.log("Delete policy:", policy.id)
      }
    }
  }

  const handleCopy = (policyId: string) => {
    if (onCopy) {
      onCopy(policyId)
    } else {
      alert("Copy functionality not available")
    }
  }

  const showRelationshipHierarchy = (policy: CompletePolicy) => {
    const hierarchy = getPolicyRelationshipHierarchy(policy.id)
    const memberCount = getPolicyMemberCount(policy.id)

    const message =
      `Policy Details:\n` +
      `Policy: ${policy.policyName}\n` +
      `Policy Number: ${policy.policyNumber}\n` +
      `Product: ${hierarchy.product?.name || policy.productName || "Unknown"}\n` +
      `Payor: ${hierarchy.payor?.name || policy.payorName || "Unknown"}\n` +
      `Members: ${memberCount}\n\n` +
      `Hierarchy: ${hierarchy.hierarchy}`

    alert(message)
  }

  const getStatusBadge = (status = "Active") => {
    const statusClass = status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{status}</span>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Policy Listing</h2>

        {/* Search and Export */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => console.log("Export policies")} // Placeholder for export logic
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredPolicies.length} of {policies.length} policies
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy Name ↑↓
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy Number ↑↓
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product ↑↓
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payor ↑↓
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status ↑↓
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members ↑↓
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPolicies.map((policy, index) => {
              const memberCount = getPolicyMemberCount(policy.id)

              return (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.policyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.policyNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.productName || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.payorName || "Unknown"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(policy.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => showRelationshipHierarchy(policy)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {memberCount}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(policy)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(policy)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleCopy(policy.id)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Copy"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(policy)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredPolicies.length === 0 && (
        <div className="text-center py-8 text-gray-500">No policies found matching your search criteria.</div>
      )}
    </div>
  )
}
