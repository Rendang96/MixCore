"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  PlusCircle,
  Users,
  Building,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CheckCircle,
  X,
  Eye,
  Filter,
  AlertTriangle,
  Calendar,
  FileX,
  UserX,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import {
  getCorporateClients,
  initializeDummyCorporateClients,
  type CorporateClient,
} from "@/lib/corporate-client/corporate-client-storage"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CorporateClientDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    pendingClients: 0,
    totalMembers: 0,
    recentlyAdded: [] as CorporateClient[],
  })

  const [alertStats, setAlertStats] = useState({
    contractsExpiring: 10,
    policiesExpiring: 3,
    plansExpiring: 1,
    membersTerminating: 5,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [recentSearchTerm, setRecentSearchTerm] = useState("")
  const [recentStatusFilter, setRecentStatusFilter] = useState("all")
  const [recentCurrentPage, setRecentCurrentPage] = useState(1)
  const recentItemsPerPage = 5

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Onboarding", href: "/onboarding" },
    { label: "Corporate Client", href: "/onboarding/corporate-client" },
    { label: "Corporate Client Dashboard" },
  ]

  const onboardingData = [
    {
      id: "1",
      companyName: "ABC Corp",
      companyCode: "ABC-001",
      companyInfo: "completed",
      payor: "completed",
      product: "completed",
      policy: "incomplete",
      plan: "processing",
      member: "incomplete",
      status: "Draft",
      progress: { completed: 3, total: 6 },
      lastUpdated: "2025-06-04",
      createdBy: "John Smith",
      action: "Resume",
    },
    {
      id: "2",
      companyName: "XYZ Ltd",
      companyCode: "XYZ-002",
      companyInfo: "completed",
      payor: "completed",
      product: "completed",
      policy: "completed",
      plan: "completed",
      member: "completed",
      status: "Completed",
      progress: { completed: 6, total: 6 },
      lastUpdated: "2025-06-03",
      createdBy: "Sarah Johnson",
      action: "View",
    },
    {
      id: "3",
      companyName: "Omega Inc",
      companyCode: "OMG-003",
      companyInfo: "incomplete",
      payor: "completed",
      product: "incomplete",
      policy: "incomplete",
      plan: "incomplete",
      member: "incomplete",
      status: "Draft",
      progress: { completed: 1, total: 6 },
      lastUpdated: "2025-06-01",
      createdBy: "Mike Chen",
      action: "Resume",
    },
    {
      id: "4",
      companyName: "Beta Health",
      companyCode: "BTH-004",
      companyInfo: "processing",
      payor: "completed",
      product: "completed",
      policy: "completed",
      plan: "completed",
      member: "processing",
      status: "System Processing",
      progress: { completed: 5, total: 6 },
      lastUpdated: "2025-06-04",
      createdBy: "Lisa Wong",
      action: "View",
    },
    {
      id: "5",
      companyName: "Delta Solutions",
      companyCode: "DLT-005",
      companyInfo: "completed",
      payor: "completed",
      product: "processing",
      policy: "incomplete",
      plan: "incomplete",
      member: "incomplete",
      status: "Draft",
      progress: { completed: 2, total: 6 },
      lastUpdated: "2025-06-02",
      createdBy: "Tom Wilson",
      action: "Resume",
    },
    {
      id: "6",
      companyName: "Gamma Tech",
      companyCode: "GMT-006",
      companyInfo: "completed",
      payor: "completed",
      product: "completed",
      policy: "completed",
      plan: "processing",
      member: "incomplete",
      status: "System Processing",
      progress: { completed: 4, total: 6 },
      lastUpdated: "2025-06-05",
      createdBy: "Emma Davis",
      action: "View",
    },
  ]

  // Filter data based on search term and status
  const filteredData = onboardingData.filter((item) => {
    const matchesSearch =
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.companyCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase().replace(" ", "-") === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter recently added clients based on search term and status
  const filteredRecentClients = stats.recentlyAdded.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(recentSearchTerm.toLowerCase()) ||
      (client.companyCode && client.companyCode.toLowerCase().includes(recentSearchTerm.toLowerCase())) ||
      client.policyNo.toLowerCase().includes(recentSearchTerm.toLowerCase())
    const matchesStatus =
      recentStatusFilter === "all" || client.status.toLowerCase() === recentStatusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  // Pagination for recently added clients
  const recentTotalPages = Math.ceil(filteredRecentClients.length / recentItemsPerPage)
  const recentStartIndex = (recentCurrentPage - 1) * recentItemsPerPage
  const paginatedRecentClients = filteredRecentClients.slice(recentStartIndex, recentStartIndex + recentItemsPerPage)

  const handleRecentPageChange = (page: number) => {
    setRecentCurrentPage(page)
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500 mx-auto" />
      case "incomplete":
      default:
        return <X className="h-4 w-4 text-red-500 mx-auto" />
    }
  }

  useEffect(() => {
    // Initialize dummy data if needed
    initializeDummyCorporateClients()

    // Get all corporate clients
    const clients = getCorporateClients()

    // Calculate statistics
    const activeClients = clients.filter((client) => client.status === "Active").length
    const pendingClients = clients.filter((client) => client.status === "Pending").length
    const totalMembers = clients.reduce((sum, client) => sum + (Number.parseInt(client.memberCount) || 0), 0)

    // Get 5 most recently added clients (assuming they're sorted by date)
    const recentlyAdded = clients.slice(0, 5)

    setStats({
      totalClients: clients.length,
      activeClients,
      pendingClients,
      totalMembers,
      recentlyAdded,
    })
  }, [])

  const handleSearch = () => {
    router.push("/onboarding/corporate-client/search")
  }

  const handleAddNew = () => {
    router.push("/onboarding/corporate-client/add")
  }

  const handleViewAll = () => {
    router.push("/onboarding/corporate-client/search")
  }

  const handleViewClient = (id: string) => {
    router.push(`/onboarding/corporate-client/view/${id}`)
  }

  const handleViewContractDetails = () => {
    router.push("/onboarding/corporate-client/contracts-expiring")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Corporate Client Dashboard</h2>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleSearch}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <Search className="h-6 w-6" />
              <span>Search Clients</span>
            </Button>
            <Button
              onClick={handleAddNew}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <PlusCircle className="h-6 w-6" />
              <span>Add New Client</span>
            </Button>
            <Button
              onClick={() => router.push("/onboarding/corporate-client/member")}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <Users className="h-6 w-6" />
              <span>Manage Members</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Clients</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-gray-500 mt-1">Corporate clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Clients</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalClients > 0
                ? `${Math.round((stats.activeClients / stats.totalClients) * 100)}% of total`
                : "No clients"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Clients</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingClients}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">650,000</div>
            <p className="text-xs text-gray-500 mt-1">Across all clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Expiration Alerts */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800">Expiration Alerts (Next 3 Months)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="bg-white rounded-lg p-4 border border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors"
              onClick={handleViewContractDetails}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700">Contract Expiring</p>
                  <p className="text-2xl font-bold text-amber-800">{alertStats.contractsExpiring}</p>
                  <p className="text-xs text-amber-600 mt-1">Companies</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Policies Expiring</p>
                  <p className="text-2xl font-bold text-red-800">{alertStats.policiesExpiring}</p>
                  <p className="text-xs text-red-600 mt-1">Policies</p>
                </div>
                <FileX className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Plans Expiring</p>
                  <p className="text-2xl font-bold text-orange-800">{alertStats.plansExpiring}</p>
                  <p className="text-xs text-orange-600 mt-1">Plans</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Member Terminations</p>
                  <p className="text-2xl font-bold text-purple-800">{alertStats.membersTerminating}</p>
                  <p className="text-xs text-purple-600 mt-1">Members</p>
                </div>
                <UserX className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Setup Tracker */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Onboarding Setup Tracker</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewAll} className="text-blue-600 hover:text-blue-800">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by company name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="system-processing">System Processing</SelectItem>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Code</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Company Info</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Payor</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Product</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Policy</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Plan</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Member</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Updated</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created/ Updated By</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{item.companyName}</td>
                    <td className="px-4 py-3 text-sm">{item.companyCode}</td>
                    <td className="px-4 py-3 text-center">{renderStepIcon(item.companyInfo)}</td>
                    <td className="px-4 py-3 text-center">{renderStepIcon(item.payor)}</td>
                    <td className="px-4 py-3 text-center">{renderStepIcon(item.product)}</td>
                    <td className="px-4 py-3 text-center">{renderStepIcon(item.policy)}</td>
                    <td className="px-4 py-3 text-center">{renderStepIcon(item.plan)}</td>
                    <td className="px-4 py-3 text-center">{renderStepIcon(item.member)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-800 flex items-center gap-1 w-fit"
                            : item.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status === "Completed" && <CheckCircle className="h-3 w-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          {item.progress.completed}/{item.progress.total}
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: item.progress.total }, (_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index < item.progress.completed ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.lastUpdated}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.createdBy}</td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                        {item.action === "View" && <Eye className="h-3 w-3 mr-1" />}
                        {item.action}
                      </Button>
                    </td>
                  </tr>
                ))}
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

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Recently Added Clients</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewAll} className="text-blue-600 hover:text-blue-800">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by company name, code, or policy no..."
                value={recentSearchTerm}
                onChange={(e) => setRecentSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={recentStatusFilter} onValueChange={setRecentStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecentClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Policy No.</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Members</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Effective Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created/Updated By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecentClients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{client.companyName}</td>
                      <td className="px-4 py-3 text-sm">{client.companyCode}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span>{client.policyNo}</span>
                          {client.companyName !== "Retail Chain Bhd" &&
                            client.companyName !== "Education Institute" && (
                              <span>
                                POL-{new Date().getFullYear()}-
                                {String(Number.parseInt(client.policyNo.split("-")[2]) + 100).padStart(3, "0")}
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{client.memberCount}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            client.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : client.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : client.status === "Inactive"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(client.effectiveDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {client.companyName === "Tech Solutions Sdn Bhd"
                          ? "John Smith"
                          : client.companyName === "Manufacturing Corp"
                            ? "Sarah Johnson"
                            : client.companyName === "Retail Chain Bhd"
                              ? "Mike Chen"
                              : client.companyName === "Financial Services Ltd"
                                ? "Lisa Wong"
                                : "Emma Davis"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClient(client.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No corporate clients have been added yet.</p>
              <Button onClick={handleAddNew} variant="outline" className="mt-4">
                Add Your First Client
              </Button>
            </div>
          )}
          {/* Pagination */}
          {recentTotalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {recentStartIndex + 1} to{" "}
                {Math.min(recentStartIndex + recentItemsPerPage, filteredRecentClients.length)} of{" "}
                {filteredRecentClients.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRecentPageChange(recentCurrentPage - 1)}
                  disabled={recentCurrentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: recentTotalPages }, (_, index) => {
                    const page = index + 1
                    if (
                      page === 1 ||
                      page === recentTotalPages ||
                      (page >= recentCurrentPage - 1 && page <= recentCurrentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={recentCurrentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRecentPageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === recentCurrentPage - 2 || page === recentCurrentPage + 2) {
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
                  onClick={() => handleRecentPageChange(recentCurrentPage + 1)}
                  disabled={recentCurrentPage === recentTotalPages}
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
