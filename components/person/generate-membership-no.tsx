"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Search, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getPersons, updatePerson, initializeSampleData } from "@/lib/person/person-storage"
import type { Person } from "@/lib/person/person-storage"

interface GenerateMembershipNoProps {
  onBack: () => void
}

export function GenerateMembershipNo({ onBack }: GenerateMembershipNoProps) {
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedPersons, setSelectedPersons] = useState<Set<string>>(new Set())
  const [tableSearchTerm, setTableSearchTerm] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchForm, setSearchForm] = useState({
    personName: "",
    personId: "",
    idNo: "",
    personType: "",
    companyName: "",
    policyNo: "",
    status: "",
    includeInactive: false,
  })

  // Initialize sample data when component mounts
  useEffect(() => {
    initializeSampleData()
  }, [])

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
            : id === "company-name"
              ? "companyName"
              : id === "policy-no"
                ? "policyNo"
                : id]: value,
    }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setSearchForm((prev) => ({
      ...prev,
      includeInactive: checked,
    }))
  }

  const handleSearch = () => {
    const persons = getPersons()

    // Filter persons without membership numbers
    const personsWithoutMembership = persons.filter(
      (person) => !person.membershipNo || person.membershipNo.trim() === "",
    )

    // Apply search criteria
    const filteredResults = personsWithoutMembership.filter((person) => {
      // Match name (case-insensitive partial match)
      if (searchForm.personName && !person.name.toLowerCase().includes(searchForm.personName.toLowerCase())) {
        return false
      }

      // Match person ID (case-insensitive partial match)
      if (searchForm.personId && !person.personId.toLowerCase().includes(searchForm.personId.toLowerCase())) {
        return false
      }

      // Match ID number (case-insensitive partial match)
      if (searchForm.idNo && !person.idNo.toLowerCase().includes(searchForm.idNo.toLowerCase())) {
        return false
      }

      // Match person type (exact match)
      if (
        searchForm.personType &&
        searchForm.personType !== "all" &&
        person.personType.toLowerCase() !== searchForm.personType.toLowerCase()
      ) {
        return false
      }

      // Match company name (case-insensitive partial match)
      if (searchForm.companyName && !person.companyName.toLowerCase().includes(searchForm.companyName.toLowerCase())) {
        return false
      }

      // Match policy number (case-insensitive partial match)
      if (searchForm.policyNo && !person.policyNo.toLowerCase().includes(searchForm.policyNo.toLowerCase())) {
        return false
      }

      // Match status (exact match)
      if (
        searchForm.status &&
        searchForm.status !== "all" &&
        person.status.toLowerCase() !== searchForm.status.toLowerCase()
      ) {
        return false
      }

      // Include inactive records check
      if (!searchForm.includeInactive && person.status === "Inactive") {
        return false
      }

      return true
    })

    setSearchResults(filteredResults)
    setShowResults(true)
    setSelectedPersons(new Set()) // Clear selections when new search is performed
  }

  const handleReset = () => {
    setSearchForm({
      personName: "",
      personId: "",
      idNo: "",
      personType: "",
      companyName: "",
      policyNo: "",
      status: "",
      includeInactive: false,
    })
    setShowResults(false)
    setSelectedPersons(new Set())
    setTableSearchTerm("")
  }

  const handleTableSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableSearchTerm(e.target.value)

    if (e.target.value) {
      const term = e.target.value.toLowerCase()
      const persons = getPersons()
      const personsWithoutMembership = persons.filter(
        (person) => !person.membershipNo || person.membershipNo.trim() === "",
      )

      const filtered = personsWithoutMembership.filter(
        (person) =>
          person.name.toLowerCase().includes(term) ||
          person.personId.toLowerCase().includes(term) ||
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

  const handlePersonSelect = (personId: string, checked: boolean) => {
    const newSelected = new Set(selectedPersons)
    if (checked) {
      newSelected.add(personId)
    } else {
      newSelected.delete(personId)
    }
    setSelectedPersons(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPersonIds = new Set(searchResults.map((person) => person.id))
      setSelectedPersons(allPersonIds)
    } else {
      setSelectedPersons(new Set())
    }
  }

  const generateUniqueMembershipNo = (person: Person, existingMembershipNos: Set<string>): string => {
    // Get all existing membership numbers from person records only
    const allPersons = getPersons()

    // Collect all existing membership numbers from person records
    allPersons.forEach((p) => {
      if (p.membershipNo && p.membershipNo.trim() !== "") {
        existingMembershipNos.add(p.membershipNo)
      }
    })

    // Generate base membership number using company code format: MEM-IND-001
    const companyCode = person.companyCode || "IND" // Default to "IND" for Individual

    let counter = 1
    let membershipNo: string

    // Generate unique membership number with format: MEM-{COMPANY}-{COUNTER}
    do {
      membershipNo = `MEM-${companyCode}-${counter.toString().padStart(3, "0")}`
      counter++
    } while (existingMembershipNos.has(membershipNo))

    return membershipNo
  }

  const handleGenerateMembership = async () => {
    if (selectedPersons.size === 0) {
      alert("Please select at least one person to generate membership numbers.")
      return
    }

    setIsGenerating(true)

    try {
      // Get all existing membership numbers to ensure uniqueness
      const allPersons = getPersons()
      const existingMembershipNos = new Set(
        allPersons
          .map((person) => person.membershipNo)
          .filter((membershipNo) => membershipNo && membershipNo.trim() !== ""),
      )

      // Generate membership numbers for selected persons
      const selectedPersonsList = searchResults.filter((person) => selectedPersons.has(person.id))
      const updatedPersons: Person[] = []

      for (const person of selectedPersonsList) {
        const newMembershipNo = generateUniqueMembershipNo(person, existingMembershipNos)
        existingMembershipNos.add(newMembershipNo) // Add to set to avoid duplicates in this batch

        const updatedPerson = updatePerson(person.id, { membershipNo: newMembershipNo })
        if (updatedPerson) {
          updatedPersons.push(updatedPerson)
        }
      }

      alert(`Successfully generated membership numbers for ${updatedPersons.length} person(s).`)

      // Refresh the search results to remove persons who now have membership numbers
      handleSearch()
      setSelectedPersons(new Set())
    } catch (error) {
      console.error("Error generating membership numbers:", error)
      alert("Error generating membership numbers. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = () => {
    if (searchResults.length === 0) {
      alert("No data to export.")
      return
    }

    // Create CSV content
    const headers = ["No.", "Name", "Person ID", "ID No.", "Person Type", "Company Name", "Policy No.", "Status"]
    const csvContent = [
      headers.join(","),
      ...searchResults.map((person, index) =>
        [
          index + 1,
          `"${person.name}"`,
          person.personId,
          person.idNo,
          person.personType,
          `"${person.companyName}"`,
          person.policyNo,
          person.status,
        ].join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `persons_without_membership_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Generate Membership No.</h2>
        <Button variant="outline" className="flex items-center gap-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
      </div>

      <Card className="p-6">
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

          <div className="space-y-2">
            <label htmlFor="person-type" className="text-sm font-medium text-slate-700">
              Person Type
            </label>
            <Select value={searchForm.personType} onValueChange={(value) => handleSelectChange(value, "personType")}>
              <SelectTrigger id="person-type" className="w-full">
                <SelectValue placeholder="Select Person Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Dependent">Dependent</SelectItem>
                <SelectItem value="Wife">Wife</SelectItem>
                <SelectItem value="Husband">Husband</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="In Law">In Law</SelectItem>
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
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Checkbox id="include-inactive" checked={searchForm.includeInactive} onCheckedChange={handleCheckboxChange} />
          <label htmlFor="include-inactive" className="text-sm text-slate-700">
            Include Inactive Records
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      {showResults && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">
              Persons Without Membership No.{" "}
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
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {searchResults.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedPersons.size === searchResults.length && searchResults.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-slate-600">
                    {selectedPersons.size} of {searchResults.length} selected
                  </span>
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={selectedPersons.size === 0 || isGenerating}
                  onClick={handleGenerateMembership}
                >
                  {isGenerating ? "Generating..." : `Generate Membership No. (${selectedPersons.size})`}
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-slate-500">
                      <th className="py-3 px-2 whitespace-nowrap">
                        <Checkbox
                          checked={selectedPersons.size === searchResults.length && searchResults.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
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
                      <tr key={person.id} className="text-slate-700 hover:bg-slate-50">
                        <td className="py-3 px-2">
                          <Checkbox
                            checked={selectedPersons.has(person.id)}
                            onCheckedChange={(checked) => handlePersonSelect(person.id, checked as boolean)}
                          />
                        </td>
                        <td className="py-3 px-2 text-center">{index + 1}</td>
                        <td className="py-3 px-2 font-medium">{person.name}</td>
                        <td className="py-3 px-2">{person.personId}</td>
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
              No persons found without membership numbers. All persons already have membership numbers assigned.
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
