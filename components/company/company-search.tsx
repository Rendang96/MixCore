"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { searchCompanies } from "@/lib/company/company-storage"
import { initializeDummyCompanies } from "@/lib/company/dummy-data"
import { Search, Eye, Pencil, Trash2, ArrowUpDown, Download } from "lucide-react"

export function CompanySearch() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("")
  const [companyCode, setCompanyCode] = useState("")
  const [status, setStatus] = useState("all")
  const [industry, setIndustry] = useState("all")
  const [companies, setCompanies] = useState<any[]>([])
  const [showListing, setShowListing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Initialize dummy data when component mounts
  useEffect(() => {
    initializeDummyCompanies()
  }, [])

  const handleSearch = () => {
    const results = searchCompanies({
      name: companyName,
      code: companyCode,
      status: status === "all" ? "" : status,
      industry: industry === "all" ? "" : industry,
    })
    setCompanies(results)
    setShowListing(true)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setCompanyName("")
    setCompanyCode("")
    setStatus("all")
    setIndustry("all")
    setCompanies([])
    setShowListing(false)
  }

  const handleAddNew = () => {
    router.push("/company/add")
  }

  const handleView = (id: number) => {
    router.push(`/company/view/${id}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/company/edit/${id}`)
  }

  const handleDelete = (id: number) => {
    // This would typically show a confirmation dialog
    alert(`Delete company with ID: ${id}`)
  }

  const handleExport = () => {
    alert("Exporting company data...")
  }

  // Filter companies based on search query
  const filteredCompanies = searchQuery
    ? companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.code.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : companies

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="space-y-6">
      {/* Company Search Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Company Search</h2>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="company-name" className="text-sm font-medium text-slate-700">
                Company Name
              </label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company-code" className="text-sm font-medium text-slate-700">
                Company Code
              </label>
              <Input
                id="company-code"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                placeholder="Enter company code"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-slate-700">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium text-slate-700">
                Industry
              </label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry" className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select industry</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
              Add New
            </Button>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
              <Search size={16} />
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Company Listing Section - Only shown after search */}
      {showListing && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Company Listing</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Company Name
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Company Code
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        SSM Reg. No.
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Company Type
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Parent Company
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Hierarchy Level
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Subsidiaries
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((company, index) => (
                      <TableRow key={company.id}>
                        <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>xx{company.code}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              company.status.toLowerCase() === "active"
                                ? "bg-green-100 text-green-800"
                                : company.status.toLowerCase() === "inactive"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {company.status}
                          </span>
                        </TableCell>
                        <TableCell>RC{company.code}</TableCell>
                        <TableCell>{index === 0 ? "Main holding" : "Subsidiary"}</TableCell>
                        <TableCell>
                          {index > 0 ? (index === 3 ? "GC Western Division" : "Global Corp Holdings") : ""}
                        </TableCell>
                        <TableCell>Level {index === 0 ? 1 : index === 3 ? 3 : 2}</TableCell>
                        <TableCell>{index === 0 ? 3 : index === 1 ? 2 : index === 2 ? 1 : ""}</TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(company.id)}
                              className="h-8 w-8 text-slate-600 hover:text-slate-900"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(company.id)}
                              className="h-8 w-8 text-slate-600 hover:text-slate-900"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(company.id)}
                              className="h-8 w-8 text-slate-600 hover:text-slate-900"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        No companies found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                      <span className="font-medium">
                        {indexOfLastItem > filteredCompanies.length ? filteredCompanies.length : indexOfLastItem}
                      </span>{" "}
                      of <span className="font-medium">{filteredCompanies.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-l-md"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <Button
                          key={index}
                          variant={currentPage === index + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => paginate(index + 1)}
                          className={currentPage === index + 1 ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {index + 1}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-r-md"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
