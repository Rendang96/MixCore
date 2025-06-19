"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { getPersonGroups, getPersonType } from "@/lib/person/person-storage"

interface UploadRecord {
  id: string
  name: string
  personId: string
  membershipNo: string
  idNo: string
  personType: string
  status: string
  uploadDate: string
}

interface GroupUploadRecordsProps {
  groupId: string
  groupName: string
  totalRecords: number
  onBack: () => void
}

export function GroupUploadRecords({ groupId, groupName, totalRecords, onBack }: GroupUploadRecordsProps) {
  // Get actual group records from storage
  const getActualGroupRecords = (groupId: string): UploadRecord[] => {
    const groups = getPersonGroups()
    const targetGroup = groups.find((g) => g.groupId === groupId)

    if (!targetGroup) {
      return []
    }

    // Convert the actual persons from the group to UploadRecord format
    return targetGroup.persons.map((person) => ({
      id: person.id,
      name: person.name,
      personId: person.personId,
      membershipNo: person.membershipNo || "", // Bulk uploads don't have membership numbers initially
      idNo: person.idNo,
      personType: getPersonType(person.id), // Use the function to determine person type
      status: person.status,
      uploadDate: targetGroup.dateUpload,
    }))
  }

  const [uploadRecords, setUploadRecords] = useState<UploadRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRecords, setFilteredRecords] = useState<UploadRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)

  // Load data on component mount
  useEffect(() => {
    const records = getActualGroupRecords(groupId)
    setUploadRecords(records)
    setFilteredRecords(records)
  }, [groupId])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page on new search

    if (term) {
      const filtered = uploadRecords.filter(
        (record) =>
          record.name.toLowerCase().includes(term) ||
          record.personId.toLowerCase().includes(term) ||
          record.membershipNo.toLowerCase().includes(term) ||
          record.idNo.toLowerCase().includes(term) ||
          record.personType.toLowerCase().includes(term) ||
          record.status.toLowerCase().includes(term),
      )
      setFilteredRecords(filtered)
    } else {
      setFilteredRecords(uploadRecords)
    }
  }

  // Sorting function
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })

    const sortedRecords = [...filteredRecords].sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1
      }
      return 0
    })

    setFilteredRecords(sortedRecords)
  }

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Add group information display
  const groups = getPersonGroups()
  const currentGroup = groups.find((g) => g.groupId === groupId)

  // Use actual count from the records
  const actualTotalRecords = filteredRecords.length
  const totalPages = Math.ceil(actualTotalRecords / recordsPerPage)

  // Handle export
  const handleExport = () => {
    if (filteredRecords.length === 0) return

    // Create CSV content
    const headers = ["No.", "Name", "Person ID", "Membership No.", "ID No.", "Person Type", "Status", "Upload Date"]
    const csvRows = [headers]

    filteredRecords.forEach((record, index) => {
      csvRows.push([
        (index + 1).toString(),
        record.name,
        record.personId,
        record.membershipNo,
        record.idNo,
        record.personType,
        record.status,
        record.uploadDate,
      ])
    })

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${groupId}_records_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Upload Records - {groupId}</h2>
            <p className="text-sm text-slate-600">{groupName}</p>
            {currentGroup && (
              <div className="text-xs text-slate-500 mt-1">
                Uploaded by: {currentGroup.uploadedBy} | Date: {currentGroup.dateUpload} | Status:{" "}
                {currentGroup.uploadStatus}
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Records ({filteredRecords.length} of {uploadRecords.length})
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input placeholder="Search records" className="pl-9 w-64" value={searchTerm} onChange={handleSearch} />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <Button
              className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
              disabled={filteredRecords.length === 0}
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-slate-500">
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">No.</div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Name
                        <button className="ml-1" onClick={() => requestSort("name")}>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Person ID
                        <button className="ml-1" onClick={() => requestSort("personId")}>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Membership No.
                        <button className="ml-1" onClick={() => requestSort("membershipNo")}>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        ID No.
                        <button className="ml-1" onClick={() => requestSort("idNo")}>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Person Type
                        <button className="ml-1" onClick={() => requestSort("personType")}>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Status
                        <button className="ml-1" onClick={() => requestSort("status")}>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Upload Date
                        <button className="ml-1" onClick={() => requestSort("uploadDate")}>
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {currentRecords.map((record, index) => (
                    <tr key={record.id} className="text-slate-700 hover:bg-slate-50">
                      <td className="py-3 px-2 text-center">{indexOfFirstRecord + index + 1}</td>
                      <td className="py-3 px-2 font-medium">{record.name}</td>
                      <td className="py-3 px-2">{record.personId}</td>
                      <td className="py-3 px-2">{record.membershipNo}</td>
                      <td className="py-3 px-2">{record.idNo}</td>
                      <td className="py-3 px-2">{record.personType}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">{record.uploadDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <div>
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, actualTotalRecords)} of{" "}
                {actualTotalRecords} records
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        size="icon"
                        className={`h-8 w-8 ${currentPage === pageNum ? "bg-sky-50 text-sky-600" : ""}`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  }
                  return null
                })}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-slate-500">No records found matching your search criteria.</div>
        )}
      </Card>
    </div>
  )
}
