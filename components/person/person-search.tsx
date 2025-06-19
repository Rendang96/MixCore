"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Search, Download, Filter, ArrowUpDown, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { PersonDetails } from "./person-details"
import { AddNewPerson } from "./add-new-person"
import { AddBulkPerson } from "./add-bulk-person"
import { GroupUploadRecords } from "./group-upload-records"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPersons, searchPersons, initializeSampleData } from "@/lib/person/person-storage"

interface Person {
  id: string
  name: string
  personId: string
  membershipNo: string
  idNo: string
  personType: string
  companyName: string
  policyNo: string
  status: string
  companyCode: string
  groupId: string
  groupName: string
  totalRecords: number
  dateUpload: string
  uploadStatus: string
}

interface SearchFormState {
  personName: string
  personId: string
  idNo: string
  membershipNo: string
  personType: string
  companyName: string
  policyNo: string
  status: string
  includeInactive: boolean
}

export function PersonSearch() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<Person | null>(null)
  const [showAddNew, setShowAddNew] = useState(false)
  const [showAddBulk, setShowAddBulk] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const [tableSearchTerm, setTableSearchTerm] = useState("")

  // Form state to track input values
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    personName: "",
    personId: "",
    idNo: "",
    membershipNo: "",
    personType: "",
    companyName: "",
    policyNo: "",
    status: "",
    includeInactive: false,
  })

  // Initialize sample data on component mount
  React.useEffect(() => {
    initializeSampleData()
  }, [])

  // Sample data for the table
  const sampleData: Person[] = [
    {
      id: "1",
      name: "Nur Amani binti Zainal",
      personId: "MF0001",
      membershipNo: "CM-PMC 321-I",
      idNo: "880101-14-5567",
      personType: "Employee",
      companyName: "PMCare Sdn. Bhd",
      companyCode: "PMC01",
      policyNo: "XY123",
      status: "Active",
      groupId: "GRP001",
      groupName: "PMCare Group",
      totalRecords: 25,
      dateUpload: "2024-01-15",
      uploadStatus: "Complete",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      personId: "P001235",
      membershipNo: "MEM123457",
      idNo: "900215-08-6678",
      personType: "Employee",
      companyName: "Global Corp Holdings",
      companyCode: "GCH01",
      policyNo: "POL-2025-001",
      status: "Active",
      groupId: "GRP002",
      groupName: "Global Holdings Group",
      totalRecords: 42,
      dateUpload: "2024-01-20",
      uploadStatus: "Complete",
    },
    {
      id: "3",
      name: "Michael Wong",
      personId: "P001236",
      membershipNo: "MEM123458",
      idNo: "850630-10-5432",
      personType: "Employee",
      companyName: "GC Eastern Division",
      companyCode: "GCE01",
      policyNo: "POL-2025-002",
      status: "Active",
      groupId: "GRP003",
      groupName: "Eastern Division Group",
      totalRecords: 18,
      dateUpload: "2024-01-18",
      uploadStatus: "Pending Review",
    },
    {
      id: "4",
      name: "Lisa Chen",
      personId: "P001237",
      membershipNo: "MEM123459",
      idNo: "920712-14-7890",
      personType: "Dependent",
      companyName: "GC Eastern Division",
      companyCode: "GCE01",
      policyNo: "POL-2025-002",
      status: "Inactive",
      groupId: "GRP003",
      groupName: "Eastern Division Group",
      totalRecords: 18,
      dateUpload: "2024-01-18",
      uploadStatus: "Pending Review",
    },
    {
      id: "5",
      name: "David Kumar",
      personId: "P001238",
      membershipNo: "MEM123460",
      idNo: "780502-08-1122",
      personType: "Employee",
      companyName: "AD Techno",
      companyCode: "ADT01",
      policyNo: "POL-2025-003",
      status: "Active",
      groupId: "GRP004",
      groupName: "AD Techno Group",
      totalRecords: 33,
      dateUpload: "2024-01-22",
      uploadStatus: "Failed",
    },
    {
      id: "6",
      name: "Aisha Abdullah",
      personId: "P001239",
      membershipNo: "MEM123461",
      idNo: "890825-14-3344",
      personType: "Employee",
      companyName: "AD Techno",
      companyCode: "ADT01",
      policyNo: "POL-2025-003",
      status: "Suspended",
      groupId: "GRP004",
      groupName: "AD Techno Group",
      totalRecords: 33,
      dateUpload: "2024-01-22",
      uploadStatus: "Failed",
    },
    {
      id: "7",
      name: "Raj Patel",
      personId: "P001240",
      membershipNo: "MEM123462",
      idNo: "910304-10-5566",
      personType: "Dependent",
      companyName: "GC Western Division",
      companyCode: "GCW01",
      policyNo: "POL-2025-004",
      status: "Active",
      groupId: "GRP005",
      groupName: "Western Division Group",
      totalRecords: 27,
      dateUpload: "2024-01-25",
      uploadStatus: "Processing",
    },
  ]

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setSearchForm((prev) => ({
      ...prev,
      [id === "person-name"
        ? "personName"
        : id === "person-id"
          ? "personId"
          : id === "id-no"
            ? "idNo"
            : id === "membership-no"
              ? "membershipNo"
              : id === "company-name"
                ? "companyName"
                : id === "policy-no"
                  ? "policyNo"
                  : id]: value,
    }))
  }

  // Handle select changes
  const handleSelectChange = (value: string, field: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setSearchForm((prev) => ({
      ...prev,
      includeInactive: checked,
    }))
  }

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters)
  }

  const handleSearch = () => {
    // Use the search function from storage instead of filtering sampleData
    const searchCriteria = {
      personName: searchForm.personName,
      personId: searchForm.personId,
      idNo: searchForm.idNo,
      membershipNo: searchForm.membershipNo,
      personType: searchForm.personType,
      companyName: searchForm.companyName,
      policyNo: searchForm.policyNo,
      status: searchForm.status,
      includeInactive: searchForm.includeInactive,
    }

    const filteredResults = searchPersons(searchCriteria)
    setSearchResults(filteredResults)
    setShowResults(true)
  }

  const handleReset = () => {
    // Reset form fields
    setSearchForm({
      personName: "",
      personId: "",
      idNo: "",
      membershipNo: "",
      personType: "",
      companyName: "",
      policyNo: "",
      status: "",
      includeInactive: false,
    })
    setShowResults(false)
  }

  const handleTableSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableSearchTerm(e.target.value)

    if (e.target.value) {
      const term = e.target.value.toLowerCase()
      const allPersons = getPersons()
      const filtered = allPersons.filter(
        (person) =>
          person.name.toLowerCase().includes(term) ||
          person.personId.toLowerCase().includes(term) ||
          (person.membershipNo && person.membershipNo.toLowerCase().includes(term)) ||
          person.idNo.toLowerCase().includes(term) ||
          person.personType.toLowerCase().includes(term) ||
          (person.companyName && person.companyName.toLowerCase().includes(term)) ||
          (person.policyNo && person.policyNo.toLowerCase().includes(term)) ||
          person.status.toLowerCase().includes(term),
      )
      setSearchResults(filtered)
    } else {
      // If search term is cleared, rerun the main search to restore results
      handleSearch()
    }
  }

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person)
  }

  const handleGroupClick = (group: Person) => {
    setSelectedGroup(group)
  }

  const handleBackToSearch = () => {
    setSelectedPerson(null)
    setSelectedGroup(null)
  }

  const handleAddNewClick = () => {
    if (activeTab === "single") {
      setShowAddNew(true)
    } else {
      setShowAddBulk(true)
    }
  }

  // If add new single screen should be shown
  if (showAddNew) {
    return <AddNewPerson onBack={() => setShowAddNew(false)} />
  }

  // If add bulk screen should be shown
  if (showAddBulk) {
    return <AddBulkPerson onBack={() => setShowAddBulk(false)} />
  }

  // If a group is selected, show the group upload records screen
  if (selectedGroup) {
    return (
      <GroupUploadRecords
        groupId={selectedGroup.groupId}
        groupName={selectedGroup.groupName}
        totalRecords={selectedGroup.totalRecords}
        onBack={handleBackToSearch}
      />
    )
  }

  // If a person is selected, show the person details screen
  if (selectedPerson) {
    return <PersonDetails person={selectedPerson} onBack={handleBackToSearch} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Person Search</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single View</TabsTrigger>
          <TabsTrigger value="bulk">Bulk View</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex justify-end">
              <Button className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2" onClick={handleAddNewClick}>
                <UserPlus className="h-4 w-4" />
                Add New
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="person-name" className="text-sm font-medium text-slate-700">
                  Person Name
                </label>
                <Input
                  id="person-name"
                  placeholder="Enter Person Name"
                  className="w-full"
                  value={searchForm.personName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="person-id" className="text-sm font-medium text-slate-700">
                  Person ID
                </label>
                <Input
                  id="person-id"
                  placeholder="Enter Person ID"
                  className="w-full"
                  value={searchForm.personId}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="id-no" className="text-sm font-medium text-slate-700">
                  ID No.
                </label>
                <Input
                  id="id-no"
                  placeholder="Enter ID Number"
                  className="w-full"
                  value={searchForm.idNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Advanced Filters Toggle Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={toggleAdvancedFilters}
                className="flex items-center gap-2 text-slate-600"
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
                {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Advanced Filters Section */}
            {showAdvancedFilters && (
              <div className="mt-4 border-t pt-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="membership-no" className="text-sm font-medium text-slate-700">
                      Membership No.
                    </label>
                    <Input
                      id="membership-no"
                      placeholder="Enter Membership Number"
                      className="w-full"
                      value={searchForm.membershipNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="person-type" className="text-sm font-medium text-slate-700">
                      Person Type
                    </label>
                    <Select
                      value={searchForm.personType}
                      onValueChange={(value) => handleSelectChange(value, "personType")}
                    >
                      <SelectTrigger id="person-type" className="w-full">
                        <SelectValue placeholder="Select Person Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Dependent">Dependent</SelectItem>
                        <SelectItem value="Retiree">Retiree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company-name" className="text-sm font-medium text-slate-700">
                      Company Name
                    </label>
                    <Input
                      id="company-name"
                      placeholder="Enter Company Name"
                      className="w-full"
                      value={searchForm.companyName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="policy-no" className="text-sm font-medium text-slate-700">
                      Policy No.
                    </label>
                    <Input
                      id="policy-no"
                      placeholder="Enter Policy Number"
                      className="w-full"
                      value={searchForm.policyNo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium text-slate-700">
                      Status
                    </label>
                    <Select value={searchForm.status} onValueChange={(value) => handleSelectChange(value, "status")}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date-range" className="text-sm font-medium text-slate-700">
                      Date Range
                    </label>
                    <div className="flex items-center gap-2">
                      <Input id="date-from" type="date" placeholder="From" className="w-full" />
                      <span>to</span>
                      <Input id="date-to" type="date" placeholder="To" className="w-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Checkbox
                    id="include-inactive"
                    checked={searchForm.includeInactive}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <label htmlFor="include-inactive" className="text-sm text-slate-700">
                    Include Inactive Records
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSearch}>
                Search
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Card>

          {/* Search Results Table for Single View */}
          {showResults && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  Search Results{" "}
                  {searchResults.length > 0
                    ? `(${Math.min(searchResults.length, 50)}${searchResults.length > 50 ? " of " + searchResults.length : ""})`
                    : "(No results found)"}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      placeholder="Search results"
                      className="pl-9 w-64"
                      value={tableSearchTerm}
                      onChange={handleTableSearch}
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <Button
                    className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
                    disabled={searchResults.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 ? (
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
                              Company Name
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Policy No.
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
                        </tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        {searchResults.slice(0, 50).map((person, index) => (
                          <tr key={person.id} className="text-slate-700 hover:bg-slate-50 cursor-pointer">
                            <td className="py-3 px-2 text-center">{index + 1}</td>
                            <td
                              className="py-3 px-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              onClick={() => handlePersonClick(person)}
                            >
                              {person.name}
                            </td>
                            <td className="py-3 px-2">{person.personId}</td>
                            <td className="py-3 px-2">{person.membershipNo}</td>
                            <td className="py-3 px-2">{person.idNo}</td>
                            <td className="py-3 px-2">{person.personType}</td>
                            <td className="py-3 px-2">{person.companyName}</td>
                            <td className="py-3 px-2">{person.policyNo}</td>
                            <td className="py-3 px-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  person.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : person.status === "Inactive"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {person.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <div>
                      Showing 1 to {Math.min(searchResults.length, 50)} of {searchResults.length} records
                      {searchResults.length > 50 && (
                        <span className="text-amber-600 ml-2">(Limited to first 50 results)</span>
                      )}
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
                <div className="py-8 text-center text-slate-500">
                  No records found matching your search criteria. Please try different search terms.
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex justify-end">
              <Button className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2" onClick={handleAddNewClick}>
                <UserPlus className="h-4 w-4" />
                Add New
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="bulk-group-id" className="text-sm font-medium text-slate-700">
                  Group ID
                </label>
                <Input id="bulk-group-id" placeholder="Enter Group ID" className="w-full" />
              </div>

              <div className="space-y-2">
                <label htmlFor="bulk-group-name" className="text-sm font-medium text-slate-700">
                  Group Name
                </label>
                <Input id="bulk-group-name" placeholder="Enter Group Name" className="w-full" />
              </div>
            </div>

            {/* Advanced Filters Toggle Button */}
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={toggleAdvancedFilters}
                className="flex items-center gap-2 text-slate-600"
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
                {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Advanced Filters Section */}
            {showAdvancedFilters && (
              <div className="mt-4 border-t pt-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="bulk-membership-no" className="text-sm font-medium text-slate-700">
                      Membership No.
                    </label>
                    <Input id="bulk-membership-no" placeholder="Enter Membership Number" className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bulk-person-type" className="text-sm font-medium text-slate-700">
                      Person Type
                    </label>
                    <Select>
                      <SelectTrigger id="bulk-person-type" className="w-full">
                        <SelectValue placeholder="Select Person Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Dependent">Dependent</SelectItem>
                        <SelectItem value="Retiree">Retiree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bulk-company-name" className="text-sm font-medium text-slate-700">
                      Company Name
                    </label>
                    <Input id="bulk-company-name" placeholder="Enter Company Name" className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bulk-policy-no" className="text-sm font-medium text-slate-700">
                      Policy No.
                    </label>
                    <Input id="bulk-policy-no" placeholder="Enter Policy Number" className="w-full" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bulk-status" className="text-sm font-medium text-slate-700">
                      Status
                    </label>
                    <Select>
                      <SelectTrigger id="bulk-status" className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bulk-date-range" className="text-sm font-medium text-slate-700">
                      Date Range
                    </label>
                    <div className="flex items-center gap-2">
                      <Input id="bulk-date-from" type="date" placeholder="From" className="w-full" />
                      <span>to</span>
                      <Input id="bulk-date-to" type="date" placeholder="To" className="w-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Checkbox id="bulk-include-inactive" />
                  <label htmlFor="bulk-include-inactive" className="text-sm text-slate-700">
                    Include Inactive Records
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSearch}>
                Search
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Card>

          {/* Search Results Table for Bulk View */}
          {showResults && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  Search Results {searchResults.length > 0 ? `(${searchResults.length})` : "(No results found)"}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      placeholder="Search results"
                      className="pl-9 w-64"
                      value={tableSearchTerm}
                      onChange={handleTableSearch}
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <Button
                    className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
                    disabled={searchResults.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 ? (
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
                              Group ID
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Group Name
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Total Records
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Date Upload
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Upload Status
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-sm">
                        {searchResults.map((person, index) => (
                          <tr key={person.id} className="text-slate-700 hover:bg-slate-50">
                            <td className="py-3 px-2 text-center">{index + 1}</td>
                            <td
                              className="py-3 px-2 text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                              onClick={() => handleGroupClick(person)}
                            >
                              {person.groupId}
                            </td>
                            <td className="py-3 px-2">{person.groupName}</td>
                            <td className="py-3 px-2">{person.totalRecords}</td>
                            <td className="py-3 px-2">{person.dateUpload}</td>
                            <td className="py-3 px-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  person.uploadStatus === "Complete"
                                    ? "bg-green-100 text-green-800"
                                    : person.uploadStatus === "Pending Review"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : person.uploadStatus === "Processing"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {person.uploadStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <div>
                      Showing 1 to {searchResults.length} of {searchResults.length} records
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
                <div className="py-8 text-center text-slate-500">
                  No records found matching your search criteria. Please try different search terms.
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
