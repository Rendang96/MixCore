"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { ChevronLeft, ChevronRight, Filter, Search, Eye, AlertTriangle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

// Dummy data for contracts expiring in the next 3 months
const contractsExpiringData = [
  {
    id: "1",
    no: 1,
    companyName: "Tech Solutions Sdn Bhd",
    companyCode: "TECH-001",
    companyStatus: "Active",
    companyType: "Main Holding",
    totalMembers: 245,
    startDate: "2023-01-15",
    endDate: "2025-07-15",
    remarks: "Contract renewal discussion in progress",
  },
  {
    id: "2",
    no: 2,
    companyName: "Manufacturing Corp",
    companyCode: "MFG-002",
    companyStatus: "Active",
    companyType: "Subsidiary",
    totalMembers: 89,
    startDate: "2023-03-01",
    endDate: "2025-08-01",
    remarks: "Awaiting client confirmation for renewal",
  },
  {
    id: "3",
    no: 3,
    companyName: "Retail Chain Bhd",
    companyCode: "RTL-003",
    companyStatus: "Suspended",
    companyType: "Independent",
    totalMembers: 156,
    startDate: "2023-02-10",
    endDate: "2025-08-10",
    remarks: "Contract terms under review",
  },
  {
    id: "4",
    no: 4,
    companyName: "Financial Services Ltd",
    companyCode: "FIN-004",
    companyStatus: "Active",
    companyType: "Main Holding",
    totalMembers: 312,
    startDate: "2023-04-20",
    endDate: "2025-09-20",
    remarks: "Premium adjustment required before renewal",
  },
  {
    id: "5",
    no: 5,
    companyName: "Healthcare Group",
    companyCode: "HCG-005",
    companyStatus: "Active",
    companyType: "Subsidiary",
    totalMembers: 78,
    startDate: "2023-01-30",
    endDate: "2025-07-30",
    remarks: "Expansion of coverage requested",
  },
  {
    id: "6",
    no: 6,
    companyName: "Education Institute",
    companyCode: "EDU-006",
    companyStatus: "Terminated",
    companyType: "Independent",
    totalMembers: 203,
    startDate: "2023-05-15",
    endDate: "2025-08-15",
    remarks: "Student enrollment changes affecting contract",
  },
  {
    id: "7",
    no: 7,
    companyName: "Construction Ltd",
    companyCode: "CON-007",
    companyStatus: "Active",
    companyType: "Subsidiary",
    totalMembers: 134,
    startDate: "2023-03-25",
    endDate: "2025-09-25",
    remarks: "Safety compliance updates needed",
  },
  {
    id: "8",
    no: 8,
    companyName: "Logistics Express",
    companyCode: "LOG-008",
    companyStatus: "Suspended",
    companyType: "Independent",
    totalMembers: 67,
    startDate: "2023-02-28",
    endDate: "2025-08-28",
    remarks: "Fleet expansion impacting coverage",
  },
  {
    id: "9",
    no: 9,
    companyName: "Hospitality Group",
    companyCode: "HSP-009",
    companyStatus: "Active",
    companyType: "Main Holding",
    totalMembers: 189,
    startDate: "2023-04-10",
    endDate: "2025-09-10",
    remarks: "Seasonal workforce adjustments required",
  },
  {
    id: "10",
    no: 10,
    companyName: "Energy Solutions",
    companyCode: "ENR-010",
    companyStatus: "Active",
    companyType: "Subsidiary",
    totalMembers: 98,
    startDate: "2023-01-05",
    endDate: "2025-07-05",
    remarks: "Environmental compliance updates pending",
  },
]

// Helper functions moved outside the component
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getDaysUntilExpiry = (endDate: string) => {
  const today = new Date()
  const expiry = new Date(endDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getExpiryStatus = (endDate: string) => {
  const days = getDaysUntilExpiry(endDate)
  if (days <= 30) return { color: "text-red-600 bg-red-50", label: "Critical" }
  if (days <= 60) return { color: "text-orange-600 bg-orange-50", label: "Warning" }
  return { color: "text-amber-600 bg-amber-50", label: "Notice" }
}

const getCompanyTypeColor = (companyType: string) => {
  switch (companyType) {
    case "Main Holding":
      return "bg-red-100 text-red-800"
    case "Subsidiary":
      return "bg-yellow-100 text-yellow-800"
    case "Independent":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getCompanyStatusColor = (companyStatus: string) => {
  switch (companyStatus) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Suspended":
      return "bg-yellow-100 text-yellow-800"
    case "Terminated":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const companyTypes = ["Main Holding", "Subsidiary", "Independent"]
const companyStatuses = ["Active", "Suspended", "Terminated"]
const expiryStatuses = ["Critical", "Warning", "Notice"]

export default function ContractsExpiringPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companyTypeFilter, setCompanyTypeFilter] = useState("all")
  const [companyStatusFilter, setCompanyStatusFilter] = useState("all")
  const [expiryStatusFilter, setExpiryStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const router = useRouter()

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Onboarding", href: "/onboarding" },
    { label: "Corporate Client", href: "/onboarding/corporate-client" },
    { label: "Contracts Expiring" },
  ]

  // Filter data based on search term and filters
  const filteredData = contractsExpiringData.filter((item) => {
    const matchesSearch =
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.companyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.companyType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType =
      companyTypeFilter === "all" || item.companyType.toLowerCase() === companyTypeFilter.toLowerCase()

    const matchesStatus =
      companyStatusFilter === "all" || item.companyStatus.toLowerCase() === companyStatusFilter.toLowerCase()

    const expiryStatus = getExpiryStatus(item.endDate)
    const matchesExpiryStatus =
      expiryStatusFilter === "all" || expiryStatus.label.toLowerCase() === expiryStatusFilter.toLowerCase()

    return matchesSearch && matchesType && matchesStatus && matchesExpiryStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-slate-800">Contracts Expiring (Next 3 Months)</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{filteredData.length} contracts expiring</span>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">Contract Expiration Alert</p>
                <p className="text-xs text-amber-600">
                  {filteredData.length} contracts are expiring within the next 3 months
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-800">{filteredData.length}</p>
              <p className="text-xs text-amber-600">Total Contracts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Listing</CardTitle>
          <div className="flex flex-col gap-4 mt-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by company name, code, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>

              {/* Company Type Filter */}
              <Select value={companyTypeFilter} onValueChange={setCompanyTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Company Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Company Types</SelectItem>
                  {companyTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Company Status Filter */}
              <Select value={companyStatusFilter} onValueChange={setCompanyStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Company Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Company Status</SelectItem>
                  {companyStatuses.map((status) => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Expiry Status Filter */}
              <Select value={expiryStatusFilter} onValueChange={setExpiryStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Expiry Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expiry Status</SelectItem>
                  {expiryStatuses.map((status) => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">No.</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total Members</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">End Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Days Until Expiry</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Expiry Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Remarks</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => {
                  const expiryStatus = getExpiryStatus(item.endDate)
                  const daysUntilExpiry = getDaysUntilExpiry(item.endDate)

                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{item.no}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.companyName}</td>
                      <td className="px-4 py-3 text-sm">{item.companyCode}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getCompanyStatusColor(item.companyStatus)}`}
                        >
                          {item.companyStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getCompanyTypeColor(item.companyType)}`}
                        >
                          {item.companyType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {item.totalMembers.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(item.startDate)}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(item.endDate)}</td>
                      <td className="px-4 py-3 text-sm text-center">{daysUntilExpiry}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${expiryStatus.color}`}>
                          {expiryStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={item.remarks}>
                          {item.remarks}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                            onClick={() =>
                              router.push(`/onboarding/corporate-client/contracts-expiring/renew/${item.id}`)
                            }
                          >
                            Renew
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
