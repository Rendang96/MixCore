"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { savePolicyRuleInfo } from "@/lib/policy/policy-storage"

interface PolicyRuleTabProps {
  policyId: string
  onSave: () => void
  onCancel: () => void
  initialData?: any
}

interface Condition {
  id: number
  no: number
  code: string
  name: string
  description: string
  waitingPeriod: string
  coInsurance: string
  deductible: string
  coPayment: string
}

export function PolicyRuleTab({ policyId, onSave, onCancel, initialData }: PolicyRuleTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("pre-existing")
  const [searchCatalogue, setSearchCatalogue] = useState("")
  const [searchCondition, setSearchCondition] = useState("")
  const [searchSpecifiedIllness, setSearchSpecifiedIllness] = useState("")
  const [searchCongenitalCondition, setSearchCongenitalCondition] = useState("")
  const [searchExclusion, setSearchExclusion] = useState("")

  // Sample pre-existing conditions data
  const preExistingConditions: Condition[] = [
    {
      id: 1,
      no: 1,
      code: "PRE01",
      name: "Hernia",
      description: "Abdominal wall weakness causing tissue protrusion",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 2,
      no: 2,
      code: "PRE02",
      name: "Cataract",
      description: "Clouding of the lens in the eye",
      waitingPeriod: "6 months",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 3,
      no: 3,
      code: "PRE03",
      name: "Gallstones",
      description: "Hardened deposits in the gallbladder",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 4,
      no: 4,
      code: "PRE04",
      name: "Varicose Veins",
      description: "Enlarged veins, usually in the legs",
      waitingPeriod: "1 year",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 5,
      no: 5,
      code: "PRE05",
      name: "Sinusitis (with surgery)",
      description: "Sinus inflammation requiring surgical treatment",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
  ]

  // Sample specified illness data
  const specifiedIllnesses: Condition[] = [
    {
      id: 1,
      no: 1,
      code: "SI01",
      name: "Hernia",
      description: "Abdominal wall weakness causing tissue protrusion",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 2,
      no: 2,
      code: "SI02",
      name: "Cataract",
      description: "Clouding of the lens in the eye",
      waitingPeriod: "6 months",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 3,
      no: 3,
      code: "SI03",
      name: "Gallstones",
      description: "Hardened deposits in the gallbladder",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 4,
      no: 4,
      code: "SI04",
      name: "Varicose Veins",
      description: "Enlarged veins, usually in the legs",
      waitingPeriod: "1 year",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 5,
      no: 5,
      code: "SI05",
      name: "Sinusitis (with surgery)",
      description: "Sinus inflammation requiring surgical treatment",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
  ]

  // Sample congenital conditions data
  const congenitalConditions: Condition[] = [
    {
      id: 1,
      no: 1,
      code: "SI01",
      name: "Hernia",
      description: "Abdominal wall weakness causing tissue protrusion",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 2,
      no: 2,
      code: "PRE02",
      name: "Cataract",
      description: "Clouding of the lens in the eye",
      waitingPeriod: "6 months",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 3,
      no: 3,
      code: "PRE03",
      name: "Gallstones",
      description: "Hardened deposits in the gallbladder",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 4,
      no: 4,
      code: "PRE04",
      name: "Varicose Veins",
      description: "Enlarged veins, usually in the legs",
      waitingPeriod: "1 year",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 5,
      no: 5,
      code: "PRE05",
      name: "Sinusitis (with surgery)",
      description: "Sinus inflammation requiring surgical treatment",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
  ]

  // Sample exclusions data
  const exclusions: Condition[] = [
    {
      id: 1,
      no: 1,
      code: "EX01",
      name: "Hernia",
      description: "Abdominal wall weakness causing tissue protrusion",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 2,
      no: 2,
      code: "EX02",
      name: "Cataract",
      description: "Clouding of the lens in the eye",
      waitingPeriod: "6 months",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 3,
      no: 3,
      code: "EX03",
      name: "Gallstones",
      description: "Hardened deposits in the gallbladder",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 4,
      no: 4,
      code: "EX04",
      name: "Varicose Veins",
      description: "Enlarged veins, usually in the legs",
      waitingPeriod: "1 year",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
    {
      id: 5,
      no: 5,
      code: "EX05",
      name: "Sinusitis (with surgery)",
      description: "Sinus inflammation requiring surgical treatment",
      waitingPeriod: "2 years",
      coInsurance: "N/A",
      deductible: "N/A",
      coPayment: "N/A",
    },
  ]

  // Initialize selected conditions from initialData if available
  const [selectedConditions, setSelectedConditions] = useState<number[]>([])
  const [selectedIllnesses, setSelectedIllnesses] = useState<number[]>([])
  const [selectedCongenitalConditions, setSelectedCongenitalConditions] = useState<number[]>([])
  const [selectedExclusions, setSelectedExclusions] = useState<number[]>([])

  // Load initial data if available
  useEffect(() => {
    if (initialData) {
      // If we have initial data, extract the selected IDs
      if (initialData.preExistingConditions && initialData.preExistingConditions.length > 0) {
        const ids = initialData.preExistingConditions.map((c: any) => c.id || c)
        setSelectedConditions(ids)
      } else {
        setSelectedConditions([1, 2, 3, 4, 5]) // Default
      }

      if (initialData.specifiedIllnesses && initialData.specifiedIllnesses.length > 0) {
        const ids = initialData.specifiedIllnesses.map((c: any) => c.id || c)
        setSelectedIllnesses(ids)
      } else {
        setSelectedIllnesses([1, 2, 3, 4, 5]) // Default
      }

      if (initialData.congenitalConditions && initialData.congenitalConditions.length > 0) {
        const ids = initialData.congenitalConditions.map((c: any) => c.id || c)
        setSelectedCongenitalConditions(ids)
      } else {
        setSelectedCongenitalConditions([1, 2, 3, 4, 5]) // Default
      }

      if (initialData.exclusions && initialData.exclusions.length > 0) {
        const ids = initialData.exclusions.map((c: any) => c.id || c)
        setSelectedExclusions(ids)
      } else {
        setSelectedExclusions([1, 2, 3, 4, 5]) // Default
      }
    } else {
      // Default values if no initial data
      setSelectedConditions([1, 2, 3, 4, 5])
      setSelectedIllnesses([1, 2, 3, 4, 5])
      setSelectedCongenitalConditions([1, 2, 3, 4, 5])
      setSelectedExclusions([1, 2, 3, 4, 5])
    }
  }, [initialData])

  const toggleCondition = (id: number) => {
    setSelectedConditions((prev) =>
      prev.includes(id) ? prev.filter((conditionId) => conditionId !== id) : [...prev, id],
    )
  }

  const toggleIllness = (id: number) => {
    setSelectedIllnesses((prev) => (prev.includes(id) ? prev.filter((illnessId) => illnessId !== id) : [...prev, id]))
  }

  const toggleCongenitalCondition = (id: number) => {
    setSelectedCongenitalConditions((prev) =>
      prev.includes(id) ? prev.filter((conditionId) => conditionId !== id) : [...prev, id],
    )
  }

  const toggleExclusion = (id: number) => {
    setSelectedExclusions((prev) =>
      prev.includes(id) ? prev.filter((exclusionId) => exclusionId !== id) : [...prev, id],
    )
  }

  // Filter data based on catalogue search and individual tab search
  const filterData = (data: Condition[], tabSearch: string) => {
    return data.filter(
      (item) =>
        (searchCatalogue === "" ||
          item.name.toLowerCase().includes(searchCatalogue.toLowerCase()) ||
          item.code.toLowerCase().includes(searchCatalogue.toLowerCase()) ||
          item.description.toLowerCase().includes(searchCatalogue.toLowerCase())) &&
        (tabSearch === "" ||
          item.name.toLowerCase().includes(tabSearch.toLowerCase()) ||
          item.code.toLowerCase().includes(tabSearch.toLowerCase()) ||
          item.description.toLowerCase().includes(tabSearch.toLowerCase())),
    )
  }

  // Get filtered data for the current tab
  const getFilteredData = () => {
    switch (activeSubTab) {
      case "pre-existing":
        return filterData(preExistingConditions, searchCondition)
      case "specified":
        return filterData(specifiedIllnesses, searchSpecifiedIllness)
      case "congenital":
        return filterData(congenitalConditions, searchCongenitalCondition)
      case "exclusions":
        return filterData(exclusions, searchExclusion)
      default:
        return filterData(preExistingConditions, searchCondition)
    }
  }

  const filteredData = getFilteredData()

  const handleSave = () => {
    // Create policy rule info object
    const policyRuleInfo = {
      catalogueCode: initialData?.catalogueCode || "EX00383",
      catalogueName: initialData?.catalogueName || "KPI Exclusion",
      catalogueDescription: initialData?.catalogueDescription || "This is the Default Catalogue",
      preExistingConditions: preExistingConditions.filter((condition) => selectedConditions.includes(condition.id)),
      specifiedIllnesses: specifiedIllnesses.filter((illness) => selectedIllnesses.includes(illness.id)),
      congenitalConditions: congenitalConditions.filter((condition) =>
        selectedCongenitalConditions.includes(condition.id),
      ),
      exclusions: exclusions.filter((exclusion) => selectedExclusions.includes(exclusion.id)),
    }

    // Save to local storage
    savePolicyRuleInfo(policyId, policyRuleInfo)

    // Show a success message or notification here if needed
    alert("Policy rule information saved successfully!")
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Search Catalogue</h3>
        <div className="relative max-w-md">
          <Input
            value={searchCatalogue}
            onChange={(e) => setSearchCatalogue(e.target.value)}
            placeholder="Enter Catalogue Name or ID"
            className="pr-10"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Catalogue Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2">
                <span className="font-medium">Catalogue Code:</span> {initialData?.catalogueCode || "EX00383"}
              </p>
              <p>
                <span className="font-medium">Catalogue Name:</span> {initialData?.catalogueName || "KPI Exclusion"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Catalogue Description:</span>{" "}
                {initialData?.catalogueDescription || "This is the Default Catalogue"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mb-4 bg-slate-100 rounded-md">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeSubTab === "pre-existing" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveSubTab("pre-existing")}
        >
          Pre-Existing Conditions
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeSubTab === "specified" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveSubTab("specified")}
        >
          Specified Illness
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeSubTab === "congenital" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveSubTab("congenital")}
        >
          Congenital Conditions
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeSubTab === "exclusions" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveSubTab("exclusions")}
        >
          Exclusions
        </button>
      </div>

      {activeSubTab === "pre-existing" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md border">
            <div>
              <h3 className="text-sm font-medium mb-2">Search Pre-Existing Condition</h3>
              <div className="relative max-w-md mb-4">
                <Input
                  value={searchCondition}
                  onChange={(e) => setSearchCondition(e.target.value)}
                  placeholder="Enter Condition Name or ID"
                />
              </div>

              <h3 className="text-md font-medium mb-2">Pre-Existing Conditions</h3>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead className="w-[40px]">No</TableHead>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead className="w-[250px]">Description</TableHead>
                      <TableHead className="w-[120px]">Waiting Period</TableHead>
                      <TableHead className="w-[120px]">Co-Insurance</TableHead>
                      <TableHead className="w-[120px]">Deductible</TableHead>
                      <TableHead className="w-[120px]">Co-Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((condition) => (
                        <TableRow key={condition.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedConditions.includes(condition.id)}
                              onCheckedChange={() => toggleCondition(condition.id)}
                            />
                          </TableCell>
                          <TableCell>{condition.no}</TableCell>
                          <TableCell>{condition.code}</TableCell>
                          <TableCell>{condition.name}</TableCell>
                          <TableCell>{condition.description}</TableCell>
                          <TableCell>{condition.waitingPeriod}</TableCell>
                          <TableCell>{condition.coInsurance}</TableCell>
                          <TableCell>{condition.deductible}</TableCell>
                          <TableCell>{condition.coPayment}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No matching conditions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "specified" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md border">
            <div>
              <h3 className="text-sm font-medium mb-2">Search Specified Illness</h3>
              <div className="relative max-w-md mb-4">
                <Input
                  value={searchSpecifiedIllness}
                  onChange={(e) => setSearchSpecifiedIllness(e.target.value)}
                  placeholder="Enter Illness Name or ID"
                />
              </div>

              <h3 className="text-md font-medium mb-2">Specified Illness</h3>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead className="w-[40px]">No</TableHead>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead className="w-[250px]">Description</TableHead>
                      <TableHead className="w-[120px]">Waiting Period</TableHead>
                      <TableHead className="w-[120px]">Co-Insurance</TableHead>
                      <TableHead className="w-[120px]">Deductible</TableHead>
                      <TableHead className="w-[120px]">Co-Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((condition) => (
                        <TableRow key={condition.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIllnesses.includes(condition.id)}
                              onCheckedChange={() => toggleIllness(condition.id)}
                            />
                          </TableCell>
                          <TableCell>{condition.no}</TableCell>
                          <TableCell>{condition.code}</TableCell>
                          <TableCell>{condition.name}</TableCell>
                          <TableCell>{condition.description}</TableCell>
                          <TableCell>{condition.waitingPeriod}</TableCell>
                          <TableCell>{condition.coInsurance}</TableCell>
                          <TableCell>{condition.deductible}</TableCell>
                          <TableCell>{condition.coPayment}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No matching illnesses found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "congenital" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md border">
            <div>
              <h3 className="text-sm font-medium mb-2">Search Congenital Conditions</h3>
              <div className="relative max-w-md mb-4">
                <Input
                  value={searchCongenitalCondition}
                  onChange={(e) => setSearchCongenitalCondition(e.target.value)}
                  placeholder="Enter Congenital Condition Name or ID"
                />
              </div>

              <h3 className="text-md font-medium mb-2">Congenital Conditions</h3>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead className="w-[40px]">No</TableHead>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead className="w-[250px]">Description</TableHead>
                      <TableHead className="w-[120px]">Waiting Period</TableHead>
                      <TableHead className="w-[120px]">Co-Insurance</TableHead>
                      <TableHead className="w-[120px]">Deductible</TableHead>
                      <TableHead className="w-[120px]">Co-Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((condition) => (
                        <TableRow key={condition.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCongenitalConditions.includes(condition.id)}
                              onCheckedChange={() => toggleCongenitalCondition(condition.id)}
                            />
                          </TableCell>
                          <TableCell>{condition.no}</TableCell>
                          <TableCell>{condition.code}</TableCell>
                          <TableCell>{condition.name}</TableCell>
                          <TableCell>{condition.description}</TableCell>
                          <TableCell>{condition.waitingPeriod}</TableCell>
                          <TableCell>{condition.coInsurance}</TableCell>
                          <TableCell>{condition.deductible}</TableCell>
                          <TableCell>{condition.coPayment}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No matching conditions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "exclusions" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md border">
            <div>
              <h3 className="text-sm font-medium mb-2">Search Exclusions</h3>
              <div className="relative max-w-md mb-4">
                <Input
                  value={searchExclusion}
                  onChange={(e) => setSearchExclusion(e.target.value)}
                  placeholder="Enter Exclusion Name or ID"
                />
              </div>

              <h3 className="text-md font-medium mb-2">Exclusions</h3>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead className="w-[40px]">No</TableHead>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead className="w-[250px]">Description</TableHead>
                      <TableHead className="w-[120px]">Waiting Period</TableHead>
                      <TableHead className="w-[120px]">Co-Insurance</TableHead>
                      <TableHead className="w-[120px]">Deductible</TableHead>
                      <TableHead className="w-[120px]">Co-Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((condition) => (
                        <TableRow key={condition.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedExclusions.includes(condition.id)}
                              onCheckedChange={() => toggleExclusion(condition.id)}
                            />
                          </TableCell>
                          <TableCell>{condition.no}</TableCell>
                          <TableCell>{condition.code}</TableCell>
                          <TableCell>{condition.name}</TableCell>
                          <TableCell>{condition.description}</TableCell>
                          <TableCell>{condition.waitingPeriod}</TableCell>
                          <TableCell>{condition.coInsurance}</TableCell>
                          <TableCell>{condition.deductible}</TableCell>
                          <TableCell>{condition.coPayment}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No matching exclusions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab !== "service-type" && (
        <div className="flex gap-3 mt-6">
          <Button onClick={onCancel} variant="destructive" className="bg-red-600 hover:bg-red-700">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
