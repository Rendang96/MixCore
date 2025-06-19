"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { savePolicyRuleInfo } from "@/lib/policy/policy-storage"
import { getCatalogues, getCatalogueById } from "@/lib/catalogue/catalogue-storage"
import { initializeCompleteCatalogueData } from "@/lib/catalogue/complete-catalogue-initializer"

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
  const [catalogueSuggestions, setCatalogueSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCatalogue, setSelectedCatalogue] = useState<any>(null)

  // Dynamic data from catalogue storage
  const [preExistingConditions, setPreExistingConditions] = useState<Condition[]>([])
  const [specifiedIllnesses, setSpecifiedIllnesses] = useState<Condition[]>([])
  const [congenitalConditions, setCongenitalConditions] = useState<Condition[]>([])
  const [exclusions, setExclusions] = useState<Condition[]>([])

  // Initialize selected conditions from initialData if available
  const [selectedConditions, setSelectedConditions] = useState<number[]>([])
  const [selectedIllnesses, setSelectedIllnesses] = useState<number[]>([])
  const [selectedCongenitalConditions, setSelectedCongenitalConditions] = useState<number[]>([])
  const [selectedExclusions, setSelectedExclusions] = useState<number[]>([])

  // Initialize catalogue data when component mounts
  useEffect(() => {
    // Initialize the catalogue data first
    initializeCompleteCatalogueData()
    console.log("Initialized catalogue data")
  }, [])

  // Load initial data if available
  useEffect(() => {
    if (initialData) {
      // If we have initial data, extract the selected IDs
      if (initialData.preExistingConditions && initialData.preExistingConditions.length > 0) {
        const ids = initialData.preExistingConditions.map((c: any) => c.id || c)
        setSelectedConditions(ids)
      }

      if (initialData.specifiedIllnesses && initialData.specifiedIllnesses.length > 0) {
        const ids = initialData.specifiedIllnesses.map((c: any) => c.id || c)
        setSelectedIllnesses(ids)
      }

      if (initialData.congenitalConditions && initialData.congenitalConditions.length > 0) {
        const ids = initialData.congenitalConditions.map((c: any) => c.id || c)
        setSelectedCongenitalConditions(ids)
      }

      if (initialData.exclusions && initialData.exclusions.length > 0) {
        const ids = initialData.exclusions.map((c: any) => c.id || c)
        setSelectedExclusions(ids)
      }

      // Set selected catalogue if available
      if (initialData.catalogueCode) {
        const catalogues = getCatalogues()
        const catalogue = catalogues.find((cat) => cat.code === initialData.catalogueCode)
        if (catalogue) {
          setSelectedCatalogue(catalogue)
          setSearchCatalogue(catalogue.name)
          loadCatalogueData(catalogue.id)
        }
      }
    }
  }, [initialData])

  // Load catalogue suggestions when search term changes
  useEffect(() => {
    if (searchCatalogue.length > 0) {
      try {
        const catalogues = getCatalogues()
        console.log("Available catalogues:", catalogues)

        const filtered = catalogues.filter(
          (cat) =>
            cat.name?.toLowerCase().includes(searchCatalogue.toLowerCase()) ||
            cat.code?.toLowerCase().includes(searchCatalogue.toLowerCase()) ||
            cat.description?.toLowerCase().includes(searchCatalogue.toLowerCase()),
        )

        console.log("Filtered catalogues for search term:", searchCatalogue, filtered)
        setCatalogueSuggestions(filtered)
        setShowSuggestions(filtered.length > 0)
      } catch (error) {
        console.error("Error loading catalogues:", error)
        setCatalogueSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }, [searchCatalogue])

  const loadCatalogueData = (catalogueId: string) => {
    try {
      console.log("Loading catalogue data for ID:", catalogueId)

      // Get the actual catalogue data from storage
      const catalogue = getCatalogueById(catalogueId)
      console.log("Found catalogue:", catalogue)

      if (catalogue && catalogue.items) {
        // Filter items by type and convert to the expected format
        const preExistingItems = catalogue.items
          .filter((item) => item.type === "pre-existing")
          .map((item, index) => ({
            id: Number.parseInt(item.id) || index + 1,
            no: index + 1,
            code: item.code || `PRE${String(index + 1).padStart(3, "0")}`,
            name: item.name,
            description: item.description,
            waitingPeriod: item.waitingPeriod || "N/A",
            coInsurance: item.coInsurance || "N/A",
            deductible: item.deductible || "N/A",
            coPayment: item.coPayment || "N/A",
          }))

        const specifiedItems = catalogue.items
          .filter((item) => item.type === "specified")
          .map((item, index) => ({
            id: Number.parseInt(item.id) || index + 1,
            no: index + 1,
            code: item.code || `SI${String(index + 1).padStart(3, "0")}`,
            name: item.name,
            description: item.description,
            waitingPeriod: item.waitingPeriod || "N/A",
            coInsurance: item.coInsurance || "N/A",
            deductible: item.deductible || "N/A",
            coPayment: item.coPayment || "N/A",
          }))

        const congenitalItems = catalogue.items
          .filter((item) => item.type === "congenital")
          .map((item, index) => ({
            id: Number.parseInt(item.id) || index + 1,
            no: index + 1,
            code: item.code || `CC${String(index + 1).padStart(3, "0")}`,
            name: item.name,
            description: item.description,
            waitingPeriod: item.waitingPeriod || "N/A",
            coInsurance: item.coInsurance || "N/A",
            deductible: item.deductible || "N/A",
            coPayment: item.coPayment || "N/A",
          }))

        const exclusionItems = catalogue.items
          .filter((item) => item.type === "exclusion")
          .map((item, index) => ({
            id: Number.parseInt(item.id) || index + 1,
            no: index + 1,
            code: item.code || `EX${String(index + 1).padStart(3, "0")}`,
            name: item.name,
            description: item.description,
            waitingPeriod: item.waitingPeriod || "N/A",
            coInsurance: item.coInsurance || "N/A",
            deductible: item.deductible || "N/A",
            coPayment: item.coPayment || "N/A",
          }))

        // Set the data
        setPreExistingConditions(preExistingItems)
        setSpecifiedIllnesses(specifiedItems)
        setCongenitalConditions(congenitalItems)
        setExclusions(exclusionItems)

        // Auto-select all items by default
        const preExistingIds = preExistingItems.map((item) => item.id)
        const specifiedIds = specifiedItems.map((item) => item.id)
        const congenitalIds = congenitalItems.map((item) => item.id)
        const exclusionIds = exclusionItems.map((item) => item.id)

        setSelectedConditions(preExistingIds)
        setSelectedIllnesses(specifiedIds)
        setSelectedCongenitalConditions(congenitalIds)
        setSelectedExclusions(exclusionIds)

        console.log("Loaded catalogue data:", {
          catalogueId,
          preExisting: preExistingItems.length,
          specified: specifiedItems.length,
          congenital: congenitalItems.length,
          exclusions: exclusionItems.length,
        })
      } else {
        // No catalogue found or no items
        console.log("No catalogue found or no items for:", catalogueId)
        setPreExistingConditions([])
        setSpecifiedIllnesses([])
        setCongenitalConditions([])
        setExclusions([])
      }
    } catch (error) {
      console.error("Error loading catalogue data:", error)
      // Fallback to empty arrays
      setPreExistingConditions([])
      setSpecifiedIllnesses([])
      setCongenitalConditions([])
      setExclusions([])
    }
  }

  const handleCatalogueSelect = (catalogue: any) => {
    console.log("Selected catalogue:", catalogue)
    setSelectedCatalogue(catalogue)
    setSearchCatalogue(catalogue.name)
    setShowSuggestions(false)
    loadCatalogueData(catalogue.id)

    // Remove these lines that clear selections:
    // setSelectedConditions([])
    // setSelectedIllnesses([])
    // setSelectedCongenitalConditions([])
    // setSelectedExclusions([])
  }

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

  // Filter data based on individual tab search
  const filterData = (data: Condition[], tabSearch: string) => {
    return data.filter(
      (item) =>
        tabSearch === "" ||
        item.name.toLowerCase().includes(tabSearch.toLowerCase()) ||
        item.code.toLowerCase().includes(tabSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(tabSearch.toLowerCase()),
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
      catalogueCode: selectedCatalogue?.code || initialData?.catalogueCode || "",
      catalogueName: selectedCatalogue?.name || initialData?.catalogueName || "",
      catalogueDescription: selectedCatalogue?.description || initialData?.catalogueDescription || "",
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

          {/* Catalogue suggestions dropdown */}
          {showSuggestions && catalogueSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {catalogueSuggestions.map((catalogue) => (
                <div
                  key={catalogue.id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleCatalogueSelect(catalogue)}
                >
                  <div className="font-medium text-sm">{catalogue.name}</div>
                  <div className="text-xs text-gray-500">
                    {catalogue.code} - {catalogue.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Catalogue Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2">
                <span className="font-medium">Catalogue Code:</span>{" "}
                {selectedCatalogue?.code || initialData?.catalogueCode || ""}
              </p>
              <p>
                <span className="font-medium">Catalogue Name:</span>{" "}
                {selectedCatalogue?.name || initialData?.catalogueName || ""}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Catalogue Description:</span>{" "}
                {selectedCatalogue?.description || initialData?.catalogueDescription || ""}
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
                          {selectedCatalogue
                            ? "No pre-existing conditions found in this catalogue."
                            : "Please select a catalogue to view conditions."}
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
                          {selectedCatalogue
                            ? "No specified illnesses found in this catalogue."
                            : "Please select a catalogue to view illnesses."}
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
                          {selectedCatalogue
                            ? "No congenital conditions found in this catalogue."
                            : "Please select a catalogue to view conditions."}
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
                          {selectedCatalogue
                            ? "No exclusions found in this catalogue."
                            : "Please select a catalogue to view exclusions."}
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

      <div className="flex gap-3 mt-6">
        <Button onClick={onCancel} variant="destructive" className="bg-red-600 hover:bg-red-700">
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save
        </Button>
      </div>
    </div>
  )
}
