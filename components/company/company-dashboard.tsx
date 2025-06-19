"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getCompanies } from "@/lib/company/company-storage"
import { Building, Users, FileText, PlusCircle, Search, BarChart3, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function CompanyDashboard() {
  const [companyStats, setCompanyStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    draft: 0,
    recentCompanies: [] as any[],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Mock data for company setup progress
  const companySetupData = [
    {
      id: 1,
      name: "ABC Corp",
      code: "ABC-001",
      steps: {
        companyInfo: "completed",
        contactDetails: "completed",
        operationalSegmentation: "completed",
        jobGrade: "in-progress",
        reportFrequency: "pending",
        medicalProvider: "pending",
        financialArrangement: "pending",
        sob: "pending",
      },
      status: "Draft",
      progress: "4/8",
      lastUpdated: "2025-06-09",
      createdBy: "John Doe",
      updatedBy: "Jane Lee",
    },
    {
      id: 2,
      name: "XYZ Sdn Bhd",
      code: "XYZ-002",
      steps: {
        companyInfo: "completed",
        contactDetails: "completed",
        operationalSegmentation: "completed",
        jobGrade: "completed",
        reportFrequency: "completed",
        medicalProvider: "completed",
        financialArrangement: "completed",
        sob: "completed",
      },
      status: "Completed",
      progress: "8/8",
      lastUpdated: "2025-06-07",
      createdBy: "Adam Wong",
      updatedBy: "Adam Wong",
    },
    {
      id: 3,
      name: "MedHealth Co",
      code: "MHC-003",
      steps: {
        companyInfo: "completed",
        contactDetails: "completed",
        operationalSegmentation: "completed",
        jobGrade: "completed",
        reportFrequency: "completed",
        medicalProvider: "in-progress",
        financialArrangement: "completed",
        sob: "in-progress",
      },
      status: "System Processing",
      progress: "7/8",
      lastUpdated: "2025-06-08",
      createdBy: "Jenny Low",
      updatedBy: "Jenny Low",
    },
    {
      id: 4,
      name: "TechStart Solutions",
      code: "TSS-004",
      steps: {
        companyInfo: "completed",
        contactDetails: "completed",
        operationalSegmentation: "pending",
        jobGrade: "pending",
        reportFrequency: "pending",
        medicalProvider: "pending",
        financialArrangement: "pending",
        sob: "pending",
      },
      status: "Draft",
      progress: "2/8",
      lastUpdated: "2025-06-10",
      createdBy: "Sarah Chen",
      updatedBy: "Sarah Chen",
    },
    {
      id: 5,
      name: "Global Manufacturing",
      code: "GLM-005",
      steps: {
        companyInfo: "completed",
        contactDetails: "completed",
        operationalSegmentation: "completed",
        jobGrade: "completed",
        reportFrequency: "completed",
        medicalProvider: "in-progress",
        financialArrangement: "pending",
        sob: "pending",
      },
      status: "On Hold",
      progress: "5/8",
      lastUpdated: "2025-06-05",
      createdBy: "Mike Johnson",
      updatedBy: "Lisa Wang",
    },
  ]

  useEffect(() => {
    // This function will run on the client side
    const companies = getCompanies()
    const active = companies.filter((c) => c.status === "active" || c.status === "Active").length
    const inactive = companies.filter(
      (c) => c.status !== "active" && c.status !== "Active" && c.status !== "Draft",
    ).length
    const draft = companies.filter((c) => c.status === "Draft").length

    // Get recent companies (last 5)
    const recentCompanies = [...companies]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5)

    setCompanyStats({
      total: companies.length,
      active,
      inactive,
      draft,
      recentCompanies,
    })
  }, [])

  const breadcrumbItems = [
    { label: "Home", href: "/", onClick: () => {} },
    { label: "Company", href: "/company/dashboard", onClick: () => {} },
    { label: "Dashboard" },
  ]

  // Function to render status icon
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "pending":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <XCircle className="h-5 w-5 text-gray-300" />
    }
  }

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "System Processing":
        return "bg-blue-100 text-blue-800"
      case "On Hold":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter the company data based on search term and status filter
  const filteredCompanyData = companySetupData.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || company.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/company/add"
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <PlusCircle className="h-8 w-8 mb-2 text-sky-600" />
                <span className="font-medium">Add New Company</span>
                <span className="text-xs text-muted-foreground mt-1">Create a new company profile</span>
              </div>
            </Link>

            <Link
              href="/company/search"
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <Search className="h-8 w-8 mb-2 text-sky-600" />
                <span className="font-medium">Search Companies</span>
                <span className="text-xs text-muted-foreground mt-1">Find existing companies</span>
              </div>
            </Link>

            <Link
              href="/company/reports"
              className="flex items-center justify-center p-4 border rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-8 w-8 mb-2 text-sky-600" />
                <span className="font-medium">View Reports</span>
                <span className="text-xs text-muted-foreground mt-1">Generate company reports</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.total}</div>
            <p className="text-sm text-muted-foreground">Companies registered in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Active Companies</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.active}</div>
            <p className="text-sm text-muted-foreground">Companies with active status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Inactive Companies</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.inactive}</div>
            <p className="text-sm text-muted-foreground">Companies with inactive status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Draft Companies</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.draft}</div>
            <p className="text-sm text-muted-foreground">Companies in draft status</p>
          </CardContent>
        </Card>
      </div>

      {/* Company Setup Progress Table */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="mb-3">Company Setup Progress</CardTitle>
              <p className="text-sm text-muted-foreground">Track the completion status of company onboarding steps</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search companies..."
                className="w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
                <option value="System Processing">System Processing</option>
                <option value="On Hold">On Hold</option>
              </select>
              <Link
                href="/company/setup-progress"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium ml-4"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Company Name</TableHead>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>1</span>
                    <span className="text-xs font-normal">Company Info</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>2</span>
                    <span className="text-xs font-normal">Contact Details</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>3</span>
                    <span className="text-xs font-normal">Op. Segment</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>4</span>
                    <span className="text-xs font-normal">Job Grade</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>5</span>
                    <span className="text-xs font-normal">Report Freq.</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>6</span>
                    <span className="text-xs font-normal">Med. Provider</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>7</span>
                    <span className="text-xs font-normal">Fin. Arrange</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center">
                    <span>8</span>
                    <span className="text-xs font-normal">SOB</span>
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px]">Progress</TableHead>
                <TableHead className="w-[100px]">Last Updated</TableHead>
                <TableHead className="w-[150px]">Updated By</TableHead>
                <TableHead className="w-[100px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanyData.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.code}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {renderStatusIcon(company.steps.companyInfo)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {renderStatusIcon(company.steps.contactDetails)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {renderStatusIcon(company.steps.operationalSegmentation)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">{renderStatusIcon(company.steps.jobGrade)}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {renderStatusIcon(company.steps.reportFrequency)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {renderStatusIcon(company.steps.medicalProvider)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">
                      {renderStatusIcon(company.steps.financialArrangement)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center">{renderStatusIcon(company.steps.sob)}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(company.status)}`}>
                      {company.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{company.progress}</span>
                    </div>
                  </TableCell>
                  <TableCell>{company.lastUpdated}</TableCell>
                  <TableCell>{company.updatedBy}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className={company.status === "Draft" || company.status === "On Hold" ? "text-blue-600" : ""}
                    >
                      {company.status === "Draft" || company.status === "On Hold" ? "[Resume]" : "[View]"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyStats.recentCompanies.length > 0 ? (
                companyStats.recentCompanies.map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.industry || "Unspecified industry"}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          company.status === "Active" || company.status === "active"
                            ? "bg-green-100 text-green-800"
                            : company.status === "Draft"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {company.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No companies found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Renewals */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 border-b">
                <div>
                  <p className="font-medium">Acme Corporation</p>
                  <p className="text-xs text-muted-foreground">Policy #ACM-2023-001</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-amber-500" />
                  <span className="text-xs">7 days left</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <div>
                  <p className="font-medium">TechSolutions Inc</p>
                  <p className="text-xs text-muted-foreground">Policy #TSI-2023-042</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-amber-500" />
                  <span className="text-xs">14 days left</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 border-b">
                <div>
                  <p className="font-medium">Global Enterprises</p>
                  <p className="text-xs text-muted-foreground">Policy #GLE-2023-118</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-green-500" />
                  <span className="text-xs">30 days left</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
