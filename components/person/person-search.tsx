"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Search, Download, Filter, ArrowUpDown, UserPlus, Upload } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { PersonDetails } from "./person-details"
import { AddNewPerson } from "./add-new-person"
import { AddBulkPerson } from "./add-bulk-person"
import { BulkEditPerson } from "./bulk-edit-person"
import { GroupUploadRecords } from "./group-upload-records"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getPersons,
  searchPersons,
  searchPersonGroups,
  initializeSampleData,
  type PersonProfile,
} from "@/lib/person/person-storage"
import { GenerateMembershipNo } from "./generate-membership-no"

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
  // Replace these lines:
  // const [searchResults, setSearchResults] = useState<PersonProfile[]>([])
  // const [showResults, setShowResults] = useState(false)

  // With these separate states:
  const [singleSearchResults, setSingleSearchResults] = useState<PersonProfile[]>([])
  const [bulkSearchResults, setBulkSearchResults] = useState<PersonProfile[]>([])
  const [showSingleResults, setShowSingleResults] = useState(false)
  const [showBulkResults, setShowBulkResults] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<PersonProfile | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<PersonProfile | null>(null)
  const [showAddNew, setShowAddNew] = useState(false)
  const [showAddBulk, setShowAddBulk] = useState(false)
  const [showBulkEdit, setShowBulkEdit] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const [tableSearchTerm, setTableSearchTerm] = useState("")
  const [showGenerateMembership, setShowGenerateMembership] = useState(false)
  const [navigateToPersonId, setNavigateToPersonId] = useState<string | null>(null)

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

  // Handle navigation to specific person
  React.useEffect(() => {
    if (navigateToPersonId) {
      const allPersons = getPersons()
      const targetPerson = allPersons.find((p) => p.personId === navigateToPersonId)
      if (targetPerson) {
        setSelectedPerson(targetPerson)
        setNavigateToPersonId(null)
      }
    }
  }, [navigateToPersonId])

  // Sample data for the table
  const sampleData: PersonProfile[] = [
    {
      id: "1",
      name: "Nur Amani binti Zainal",
      personId: "MF0001",
      membershipNo: "CM-PMC 321-I",
      idNo: "880101-14-5567",
      idType: "NRIC",
      dateOfBirth: "1988-01-01",
      gender: "Female",
      nationality: "Malaysian",
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
      idType: "Passport",
      dateOfBirth: "1990-02-15",
      gender: "Female",
      nationality: "American",
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
      idType: "NRIC",
      dateOfBirth: "1985-06-30",
      gender: "Male",
      nationality: "Malaysian",
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
      idType: "NRIC",
      dateOfBirth: "1992-07-12",
      gender: "Female",
      nationality: "Malaysian",
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
      idType: "NRIC",
      dateOfBirth: "1978-05-02",
      gender: "Male",
      nationality: "Malaysian",
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
      idType: "NRIC",
      dateOfBirth: "1989-08-25",
      gender: "Female",
      nationality: "Malaysian",
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
      idType: "NRIC",
      dateOfBirth: "1991-03-04",
      gender: "Male",
      nationality: "Indian",
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
    if (activeTab === "single") {
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
      setSingleSearchResults(filteredResults)
      setShowSingleResults(true)
    } else {
      // Bulk view search - use searchPersonGroups function
      const bulkSearchCriteria = {
        groupId: (document.getElementById("bulk-group-id") as HTMLInputElement)?.value || "",
        groupName: (document.getElementById("bulk-group-name") as HTMLInputElement)?.value || "",
        includeInactive: searchForm.includeInactive,
      }

      const groupResults = searchPersonGroups(bulkSearchCriteria)

      // Convert group results to the format expected by the results table
      const formattedResults = groupResults.map((group) => ({
        id: group.id,
        groupId: group.groupId,
        groupName: group.groupName,
        totalRecords: group.totalRecords,
        dateUpload: group.dateUpload,
        uploadStatus: group.uploadStatus,
        // Add other required fields for display
        name: group.groupName,
        personId: group.groupId,
        idNo: "",
        idType: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        status: group.uploadStatus,
        companyName: group.companyName || "",
        companyCode: group.companyCode || "",
        policyNo: group.policyNo || "",
      }))

      setBulkSearchResults(formattedResults)
      setShowBulkResults(true)
    }
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

    if (activeTab === "single") {
      setShowSingleResults(false)
      setSingleSearchResults([])
    } else {
      setShowBulkResults(false)
      setBulkSearchResults([])
    }
  }

  const handleTableSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableSearchTerm(e.target.value)

    if (e.target.value) {
      const term = e.target.value.toLowerCase()

      if (activeTab === "single") {
        const allPersons = getPersons()
        const filtered = allPersons.filter(
          (person) =>
            person.name.toLowerCase().includes(term) ||
            person.personId.toLowerCase().includes(term) ||
            person.idNo.toLowerCase().includes(term) ||
            (person.idType && person.idType.toLowerCase().includes(term)) ||
            (person.gender && person.gender.toLowerCase().includes(term)) ||
            (person.nationality && person.nationality.toLowerCase().includes(term)) ||
            person.status.toLowerCase().includes(term),
        )
        setSingleSearchResults(filtered)
      } else {
        // Filter bulk results
        const filtered = bulkSearchResults.filter(
          (group) =>
            group.groupId?.toLowerCase().includes(term) ||
            group.groupName?.toLowerCase().includes(term) ||
            group.uploadStatus?.toLowerCase().includes(term),
        )
        setBulkSearchResults(filtered)
      }
    } else {
      // If search term is cleared, rerun the main search to restore results
      handleSearch()
    }
  }

  const handlePersonClick = (person: PersonProfile) => {
    setSelectedPerson(person)
  }

  const handleGroupClick = (group: PersonProfile) => {
    setSelectedGroup(group)
  }

  const handleBackToSearch = () => {
    setSelectedPerson(null)
    setSelectedGroup(null)
    setShowBulkEdit(false)
  }

  const handleAddNewClick = () => {
    if (activeTab === "single") {
      setShowAddNew(true)
    } else {
      setShowAddBulk(true)
    }
  }

  const handleBulkEditClick = () => {
    setShowBulkEdit(true)
  }

  const handleGenerateMembershipClick = () => {
    setShowGenerateMembership(true)
  }

  // If bulk edit screen should be shown
  if (showBulkEdit) {
    return <BulkEditPerson onBack={handleBackToSearch} />
  }

  // If add new single screen should be shown
  if (showAddNew) {
    return <AddNewPerson onBack={() => setShowAddNew(false)} />
  }

  // If add bulk screen should be shown
  if (showAddBulk) {
    return <AddBulkPerson onBack={() => setShowAddBulk(false)} />
  }

  // If generate membership screen should be shown
  if (showGenerateMembership) {
    return <GenerateMembershipNo onBack={() => setShowGenerateMembership(false)} />
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
    return (
      <PersonDetails
        person={selectedPerson}
        onBack={handleBackToSearch}
        onNavigateToFamilyMember={(personId: string) => {
          setSelectedPerson(null)
          setNavigateToPersonId(personId)
        }}
      />
    )
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
          {showSingleResults && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  Search Results{" "}
                  {singleSearchResults.length > 0
                    ? `(${Math.min(singleSearchResults.length, 50)}${singleSearchResults.length > 50 ? " of " + singleSearchResults.length : ""})`
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
                    disabled={singleSearchResults.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {singleSearchResults.length > 0 ? (
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
                              ID No.
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              ID Type
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Date of Birth
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Gender
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Nationality
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
                        {singleSearchResults.slice(0, 50).map((person, index) => (
                          <tr key={person.id} className="text-slate-700 hover:bg-slate-50 cursor-pointer">
                            <td className="py-3 px-2 text-center">{index + 1}</td>
                            <td
                              className="py-3 px-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              onClick={() => handlePersonClick(person)}
                            >
                              {person.name}
                            </td>
                            <td className="py-3 px-2">{person.personId}</td>
                            <td className="py-3 px-2">{person.idNo}</td>
                            <td className="py-3 px-2">{person.idType}</td>
                            <td className="py-3 px-2">{person.dateOfBirth}</td>
                            <td className="py-3 px-2">{person.gender}</td>
                            <td className="py-3 px-2">{person.nationality}</td>
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
                      Showing 1 to {Math.min(singleSearchResults.length, 50)} of {singleSearchResults.length} records
                      {singleSearchResults.length > 50 && (
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
            <div className="mb-6 flex justify-end gap-3">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleBulkEditClick}>
                <Upload className="h-4 w-4" />
                Bulk Update
              </Button>
              <Button className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2" onClick={handleAddNewClick}>
                <UserPlus className="h-4 w-4" />
                Add New
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="bulk-group-id" className="text-sm font-medium text-slate-700">
                  Batch ID
                </label>
                <Input id="bulk-group-id" placeholder="Enter Batch ID" className="w-full" />
              </div>

              <div className="space-y-2">
                <label htmlFor="bulk-group-name" className="text-sm font-medium text-slate-700">
                  Batch Name
                </label>
                <Input id="bulk-group-name" placeholder="Enter Batch Name" className="w-full" />
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
                  <Checkbox
                    id="bulk-include-inactive"
                    checked={searchForm.includeInactive}
                    onCheckedChange={handleCheckboxChange}
                  />
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
          {showBulkResults && activeTab === "bulk" && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  Search Results {bulkSearchResults.length > 0 ? `(${bulkSearchResults.length})` : "(No results found)"}
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
                    disabled={bulkSearchResults.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {bulkSearchResults.length > 0 ? (
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
                              Batch ID
                              <button className="ml-1">
                                <ArrowUpDown className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="flex items-center">
                              Batch Name
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
                        {bulkSearchResults.map((person, index) => (
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
                      Showing 1 to {bulkSearchResults.length} of {bulkSearchResults.length} records
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
