"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Edit, Trash2, Download, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import {
  getCorporateClients,
  searchCorporateClients,
  initializeDummyCorporateClients,
  deleteCorporateClient,
  type CorporateClient,
} from "@/lib/corporate-client/corporate-client-storage"

export function CorporateClientSearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [corporateClients, setCorporateClients] = useState<CorporateClient[]>([])
  const [filteredClients, setFilteredClients] = useState<CorporateClient[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchCriteria, setSearchCriteria] = useState({
    companyName: "",
    companyCode: "",
    status: "",
    policyNo: "",
  })

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Onboarding", href: "/onboarding" },
    { label: "Corporate Client", href: "/onboarding/corporate-client" },
    { label: "Search Results" },
  ]

  // Initialize dummy data and perform search on component mount
  useEffect(() => {
    initializeDummyCorporateClients()
    const clients = getCorporateClients()
    setCorporateClients(clients)

    // Get search parameters from URL
    const searchForm = {
      companyName: searchParams.get("companyName") || "",
      companyCode: searchParams.get("companyCode") || "",
      status: searchParams.get("status") || "",
      policyNo: searchParams.get("policyNo") || "",
    }

    setSearchCriteria(searchForm)

    // Perform search with the parameters
    const results = searchCorporateClients(searchForm)
    setFilteredClients(results)
  }, [searchParams])

  const handleBackToDashboard = () => {
    router.push("/onboarding/corporate-client")
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

      // Refresh the data
      const updatedClients = getCorporateClients()
      setCorporateClients(updatedClients)

      // Update filtered results
      const results = searchCorporateClients(searchCriteria)
      setFilteredClients(results)

      alert("Corporate client deleted successfully!")
    }
  }

  const handleExport = () => {
    // Implement export logic here
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

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToDashboard} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold text-slate-800">Corporate Client Search Results</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search Criteria Summary */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Search Criteria:</h3>
        <div className="flex flex-wrap gap-2">
          {searchCriteria.companyName && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Company Name: {searchCriteria.companyName}
            </span>
          )}
          {searchCriteria.companyCode && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Company Code: {searchCriteria.companyCode}
            </span>
          )}
          {searchCriteria.status && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Status: {searchCriteria.status}</span>
          )}
          {searchCriteria.policyNo && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              Policy No.: {searchCriteria.policyNo}
            </span>
          )}
          {!searchCriteria.companyName &&
            !searchCriteria.companyCode &&
            !searchCriteria.status &&
            !searchCriteria.policyNo && <span className="text-gray-500 text-sm">All records</span>}
        </div>
      </Card>

      {/* Results Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Corporate Client Listing ({filteredClients.length} records found)</h3>
          <Button variant="outline" onClick={handleExport} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {filteredClients.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Company Name
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Company Code
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Policy No.
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Payor
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Plan Name
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Members
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Effective Date
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.companyName}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.companyCode}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.policyNo}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.payorName}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.planName}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.memberCount}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">{getStatusBadge(client.status)}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{client.effectiveDate}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(client.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(client.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of {filteredClients.length}{" "}
                  results
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
            <Button variant="outline" onClick={handleBackToDashboard} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
