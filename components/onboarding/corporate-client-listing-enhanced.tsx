"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw, Eye, Edit, Trash2, Download, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import {
  getCorporateClients,
  searchCorporateClients,
  initializeDummyCorporateClients,
  deleteCorporateClient,
  type CorporateClient,
} from "@/lib/corporate-client/corporate-client-storage"

// Enhanced data structure to handle multiple policies per company
interface EnhancedCorporateClient {
  id: string
  companyName: string
  companyCode: string
  status: string
  effectiveDate: string
  totalMembers: number
  policies: {
    id: string
    policyNo: string
    payorName: string
    planName: string
    memberCount: number
    status: string
    effectiveDate: string
  }[]
}

export function CorporateClientListingEnhanced() {
  const router = useRouter()
  const [searchForm, setSearchForm] = useState({
    companyName: "",
    companyCode: "",
    status: "",
    policyNo: "",
  })

  const [corporateClients, setCorporateClients] = useState<EnhancedCorporateClient[]>([])
  const [filteredClients, setFilteredClients] = useState<EnhancedCorporateClient[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<"grouped" | "flat">("grouped")

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Onboarding", href: "/onboarding" },
    { label: "Corporate Client" },
  ]

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
    { value: "Suspended", label: "Suspended" },
  ]

  // Transform flat data into grouped structure
  const transformToGroupedData = (clients: CorporateClient[]): EnhancedCorporateClient[] => {
    const grouped = clients.reduce((acc, client) => {
      const existing = acc.find((c) => c.companyCode === client.companyCode)

      const policy = {
        id: client.id,
        policyNo: client.policyNo,
        payorName: client.payorName,
        planName: client.planName,
        memberCount: client.memberCount,
        status: client.status,
        effectiveDate: client.effectiveDate,
      }

      if (existing) {
        existing.policies.push(policy)
        existing.totalMembers += client.memberCount
      } else {
        acc.push({
          id: client.id,
          companyName: client.companyName,
          companyCode: client.companyCode,
          status: client.status,
          effectiveDate: client.effectiveDate,
          totalMembers: client.memberCount,
          policies: [policy],
        })
      }

      return acc
    }, [] as EnhancedCorporateClient[])

    return grouped
  }

  // Initialize dummy data on component mount
  useEffect(() => {
    initializeDummyCorporateClients()
    const clients = getCorporateClients()
    const groupedClients = transformToGroupedData(clients)
    setCorporateClients(groupedClients)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSearch = () => {
    const results = searchCorporateClients(searchForm)
    const groupedResults = transformToGroupedData(results)
    setFilteredClients(groupedResults)
    setHasSearched(true)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchForm({
      companyName: "",
      companyCode: "",
      status: "",
      policyNo: "",
    })
    setFilteredClients([])
    setHasSearched(false)
    setCurrentPage(1)
    setExpandedRows(new Set())
  }

  const toggleRowExpansion = (companyId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId)
    } else {
      newExpanded.add(companyId)
    }
    setExpandedRows(newExpanded)
  }

  const handleAddNew = () => {
    router.push("/onboarding/corporate-client/add")
  }

  const handleView = (id: string) => {
    router.push(`/onboarding/corporate-client/view/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/onboarding/corporate-client/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this corporate client?")) {
      deleteCorporateClient(id)
      // Refresh data logic here
      alert("Corporate client deleted successfully!")
    }
  }

  const handleExport = () => {
    console.log("Export data")
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentClients = filteredClients.slice(startIndex, endIndex)

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Suspended: "bg-red-100 text-red-800",
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}
      >
        {status}
      </span>
    )
  }

  const renderGroupedTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 w-8"></th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
              Company Name
            </th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
              Company Code
            </th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Policies</th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
              Total Members
            </th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
              Effective Date
            </th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client) => (
            <>
              {/* Company Row */}
              <tr key={client.id} className="hover:bg-gray-50 bg-blue-50">
                <td className="border border-gray-200 px-4 py-3 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(client.id)}
                    className="p-0 h-6 w-6"
                  >
                    {expandedRows.has(client.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                  {client.companyName}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.companyCode}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {client.policies.length} {client.policies.length === 1 ? "Policy" : "Policies"}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.totalMembers}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm">{getStatusBadge(client.status)}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.effectiveDate}</td>
                <td className="border border-gray-200 px-4 py-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(client.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Company"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(client.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit Company"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/onboarding/corporate-client/add-policy/${client.id}`)}
                      className="text-purple-600 hover:text-purple-800"
                      title="Add Policy"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>

              {/* Policy Rows (Expanded) */}
              {expandedRows.has(client.id) &&
                client.policies.map((policy, index) => (
                  <tr key={`${client.id}-${policy.id}`} className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2"></td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600 pl-8">
                      └ Policy {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-900">{policy.policyNo}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Payor:</span> {policy.payorName}
                        </div>
                        <div>
                          <span className="font-medium">Plan:</span> {policy.planName}
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-900">{policy.memberCount}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">{getStatusBadge(policy.status)}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-900">{policy.effectiveDate}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(policy.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Policy"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(policy.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit Policy"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(policy.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Policy"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Corporate Client</h2>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: "grouped" | "flat") => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grouped">Grouped View</SelectItem>
              <SelectItem value="flat">Flat View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddNew} className="bg-sky-600 hover:bg-sky-700">
            Add New
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Search form remains the same */}
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter company name"
              value={searchForm.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="companyCode" className="text-sm font-medium text-gray-700">
              Company Code
            </label>
            <input
              id="companyCode"
              type="text"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter company code"
              value={searchForm.companyCode}
              onChange={(e) => handleInputChange("companyCode", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <Select value={searchForm.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="policyNo" className="text-sm font-medium text-gray-700">
              Policy No.
            </label>
            <input
              id="policyNo"
              type="text"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter policy number"
              value={searchForm.policyNo}
              onChange={(e) => handleInputChange("policyNo", e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex items-center">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results Table */}
        {hasSearched && (
          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Corporate Client Listing ({filteredClients.length} companies found)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Total Policies: {filteredClients.reduce((sum, client) => sum + client.policies.length, 0)}
                </span>
                <Button variant="outline" onClick={handleExport} className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {filteredClients.length > 0 ? (
              <>
                {renderGroupedTable()}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of{" "}
                      {filteredClients.length} companies
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No corporate clients found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Default message when no search performed */}
        {!hasSearched && (
          <div className="mt-8 border-t pt-6">
            <div className="text-center text-gray-500 py-8">
              <p>Click "Search" to view corporate clients or "Add New" to create your first corporate client.</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
