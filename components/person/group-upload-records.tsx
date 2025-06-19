"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Search, Download, ArrowUpDown } from "lucide-react"

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
  // Generate sample data based on the group and total records
  const generateRecords = (groupId: string, count: number): UploadRecord[] => {
    const records: UploadRecord[] = []
    const baseNames = [
      "Ahmad bin Abdullah",
      "Siti Nurhaliza",
      "Lim Wei Ming",
      "Raj Kumar",
      "Sarah Johnson",
      "Michael Wong",
      "Lisa Chen",
      "David Kumar",
      "Aisha Abdullah",
      "Nur Amani",
      "John Smith",
      "Mary Jane",
      "Peter Parker",
      "Diana Prince",
      "Bruce Wayne",
      "Clark Kent",
      "Tony Stark",
      "Steve Rogers",
      "Natasha Romanoff",
      "Thor Odinson",
    ]

    for (let i = 1; i <= count; i++) {
      const nameIndex = (i - 1) % baseNames.length
      const personIdSuffix = String(i).padStart(4, "0")

      records.push({
        id: `${groupId}-${i}`,
        name: baseNames[nameIndex],
        personId: `P${personIdSuffix}`,
        membershipNo: `MEM${groupId.slice(-3)}${String(i).padStart(3, "0")}`,
        idNo: `${Math.floor(Math.random() * 900000) + 100000}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`,
        personType: i % 4 === 0 ? "Dependent" : "Employee",
        status: i % 10 === 0 ? "Inactive" : i % 15 === 0 ? "Suspended" : "Active",
        uploadDate: "2024-01-15",
      })
    }

    return records
  }

  const uploadRecords = generateRecords(groupId, totalRecords)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredRecords, setFilteredRecords] = React.useState(uploadRecords)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

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
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Records ({filteredRecords.length} of {totalRecords})
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input placeholder="Search records" className="pl-9 w-64" value={searchTerm} onChange={handleSearch} />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <Button
              className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
              disabled={filteredRecords.length === 0}
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
                        <button className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Person ID
                        <button className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Membership No.
                        <button className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        ID No.
                        <button className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Person Type
                        <button className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Status
                        <button className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                    <th className="py-3 px-2 whitespace-nowrap">
                      <div className="flex items-center">
                        Upload Date
                        <button className="ml-1">
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredRecords.map((record, index) => (
                    <tr key={record.id} className="text-slate-700 hover:bg-slate-50">
                      <td className="py-3 px-2 text-center">{index + 1}</td>
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
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} records
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  &lt;&lt;
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  &lt;
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-sky-50 text-sky-600">
                  1
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  &gt;
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  &gt;&gt;
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
