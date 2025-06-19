"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Search } from "lucide-react"
import { createCatalogue } from "@/lib/catalogue/catalogue-storage"

// Import storage functions for the different condition types
import { getPreExistingConditions } from "@/lib/catalogue/pre-existing-storage"
import { specifiedIllnessStorage } from "@/lib/catalogue/specified-illness-storage"
import { congenitalConditionStorage } from "@/lib/catalogue/congenital-condition-storage"
import { generalExclusionStorage } from "@/lib/catalogue/general-exclusion-storage"
import { initializeSampleCatalogueData } from "@/lib/catalogue/sample-data-initializer"

interface CreateNewCatalogueProps {
  onClose: () => void
}

interface SelectedItem {
  id: string
  name: string
  type: string
  sourceId: string
  description?: string
  waitingPeriod: string
  coInsurance: string
  deductible: string
  coPayment: string
}

export function CreateNewCatalogue({ onClose }: CreateNewCatalogueProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    category: "",
    type: "benefit",
    status: "draft",
  })

  // State for selected items - this will show in the "Selected Items" tab
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  // State for available items from different sources
  const [preExistingConditions, setPreExistingConditions] = useState<any[]>([])
  const [specifiedIllnesses, setSpecifiedIllnesses] = useState<any[]>([])
  const [congenitalConditions, setCongenitalConditions] = useState<any[]>([])
  const [generalExclusions, setGeneralExclusions] = useState<any[]>([])

  // State for bulk selection in each tab
  const [bulkSelected, setBulkSelected] = useState<{
    preExisting: string[]
    specified: string[]
    congenital: string[]
    exclusion: string[]
  }>({
    preExisting: [],
    specified: [],
    congenital: [],
    exclusion: [],
  })

  // Search terms for filtering
  const [searchTerms, setSearchTerms] = useState({
    preExisting: "",
    specified: "",
    congenital: "",
    exclusion: "",
  })

  // Load data from storage
  useEffect(() => {
    // Initialize sample data if none exists
    initializeSampleCatalogueData()

    // Load data from storage
    const preExisting = getPreExistingConditions()
    const specified = specifiedIllnessStorage.getAll()
    const congenital = congenitalConditionStorage.getAll()
    const exclusions = generalExclusionStorage.getAll()

    // DEBUG: Log the actual data structures
    console.log("=== DATA STRUCTURE DEBUG ===")
    console.log("Pre-existing conditions:", preExisting)
    console.log("Specified illnesses:", specified)
    console.log("Congenital conditions:", congenital)
    console.log("General exclusions:", exclusions)
    console.log("=== END DEBUG ===")

    setPreExistingConditions(preExisting)
    setSpecifiedIllnesses(specified)
    setCongenitalConditions(congenital)
    setGeneralExclusions(exclusions)
  }, [])

  // Debug effect to track selected items
  useEffect(() => {
    console.log("Selected items updated:", selectedItems)
  }, [selectedItems])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || !formData.name || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    // Create catalogue items from selected items
    const items = selectedItems.map((item) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: item.name,
      description: item.description || "",
      type: item.type,
      code: item.sourceId,
      waitingPeriod: item.waitingPeriod,
      coInsurance: item.coInsurance,
      deductible: item.deductible,
      coPayment: item.coPayment,
    }))

    // Create the catalogue
    createCatalogue({
      id: formData.code,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      status: formData.status,
      items: items,
      itemCounts: {
        preExisting: selectedItems.filter((item) => item.type === "pre-existing").length,
        specified: selectedItems.filter((item) => item.type === "specified").length,
        congenital: selectedItems.filter((item) => item.type === "congenital").length,
        exclusions: selectedItems.filter((item) => item.type === "exclusion").length,
      },
    })

    alert("Catalogue created successfully!")
    onClose()
  }

  // Function to add a single item to selected items
  const addSelectedItem = (item: any, type: string) => {
    console.log("=== ADD ITEM DEBUG ===")
    console.log("Adding item:", item)
    console.log("Item ID:", item.id)
    console.log("Item ID type:", typeof item.id)
    console.log("Type:", type)
    console.log("Current selected items:", selectedItems)

    // Check if item is already selected
    const isAlreadySelected = selectedItems.some((selected) => {
      const match = String(selected.sourceId) === String(item.id) && selected.type === type
      console.log(`Checking: ${selected.sourceId} === ${item.id} && ${selected.type} === ${type} = ${match}`)
      return match
    })

    console.log("Is already selected:", isAlreadySelected)
    console.log("=== END ADD ITEM DEBUG ===")

    if (isAlreadySelected) {
      alert("This item is already selected!")
      return
    }

    // Add item to selected items
    const newSelectedItem: SelectedItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: item.name || item.title || "Unknown",
      type: type,
      sourceId: String(item.id), // Ensure it's a string
      description: item.description || "",
      waitingPeriod: "",
      coInsurance: "",
      deductible: "",
      coPayment: "",
    }

    setSelectedItems((prev) => {
      const updated = [...prev, newSelectedItem]
      console.log("Updated selected items:", updated)
      return updated
    })
  }

  // Function to remove an item from selected items
  const removeSelectedItem = (id: string) => {
    console.log("Removing item with id:", id)
    setSelectedItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Function to update selected item properties
  const updateSelectedItem = (id: string, field: string, value: string) => {
    setSelectedItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Bulk selection functions
  const handleBulkSelection = (itemId: string, type: string, checked: boolean) => {
    setBulkSelected((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type as keyof typeof prev], itemId]
        : prev[type as keyof typeof prev].filter((id) => id !== itemId),
    }))
  }

  const addBulkItems = (type: string) => {
    const selectedIds = bulkSelected[type as keyof typeof bulkSelected]
    let sourceData: any[] = []
    let itemType = ""

    switch (type) {
      case "preExisting":
        sourceData = preExistingConditions
        itemType = "pre-existing"
        break
      case "specified":
        sourceData = specifiedIllnesses
        itemType = "specified"
        break
      case "congenital":
        sourceData = congenitalConditions
        itemType = "congenital"
        break
      case "exclusion":
        sourceData = generalExclusions
        itemType = "exclusion"
        break
    }

    console.log("Adding bulk items:", selectedIds, "from type:", type)

    const itemsToAdd = sourceData.filter((item) => selectedIds.includes(String(item.id)))

    itemsToAdd.forEach((item) => {
      addSelectedItem(item, itemType)
    })

    // Clear bulk selection for this type
    setBulkSelected((prev) => ({
      ...prev,
      [type]: [],
    }))
  }

  const selectAllInCategory = (type: string) => {
    let sourceData: any[] = []

    switch (type) {
      case "preExisting":
        sourceData = filteredPreExisting
        break
      case "specified":
        sourceData = filteredSpecified
        break
      case "congenital":
        sourceData = filteredCongenital
        break
      case "exclusion":
        sourceData = filteredExclusions
        break
    }

    const allIds = sourceData.map((item) => String(item.id))
    setBulkSelected((prev) => ({
      ...prev,
      [type]: allIds,
    }))
  }

  const clearSelectionInCategory = (type: string) => {
    setBulkSelected((prev) => ({
      ...prev,
      [type]: [],
    }))
  }

  // Helper function to check if an item is already selected
  const isItemSelected = (itemId: string | number, type: string) => {
    const found = selectedItems.some((item) => String(item.sourceId) === String(itemId) && item.type === type)
    console.log(`isItemSelected check for ${itemId} (${type}):`, found)
    return found
  }

  // Filter functions for each tab with null checks
  const filteredPreExisting = preExistingConditions.filter(
    (item) =>
      (item.name || item.title || "").toLowerCase().includes(searchTerms.preExisting.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerms.preExisting.toLowerCase()),
  )

  const filteredSpecified = specifiedIllnesses.filter(
    (item) =>
      (item.name || item.title || "").toLowerCase().includes(searchTerms.specified.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerms.specified.toLowerCase()),
  )

  const filteredCongenital = congenitalConditions.filter(
    (item) =>
      (item.name || item.title || "").toLowerCase().includes(searchTerms.congenital.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerms.congenital.toLowerCase()),
  )

  const filteredExclusions = generalExclusions.filter(
    (item) =>
      (item.name || item.title || "").toLowerCase().includes(searchTerms.exclusion.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerms.exclusion.toLowerCase()),
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Create New Catalogue</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Catalogue Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CAT001"
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter catalogue name"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="optical">Optical</SelectItem>
                  <SelectItem value="maternity">Maternity</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benefit">Benefit</SelectItem>
                  <SelectItem value="exclusion">Exclusion</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter catalogue description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Item Selection Tabs */}
          <div className="border rounded-lg">
            <Tabs defaultValue="selected" className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="selected">Selected Items ({selectedItems.length})</TabsTrigger>
                <TabsTrigger value="preExisting">Pre-Existing ({filteredPreExisting.length})</TabsTrigger>
                <TabsTrigger value="specified">Specified Illness ({filteredSpecified.length})</TabsTrigger>
                <TabsTrigger value="congenital">Congenital ({filteredCongenital.length})</TabsTrigger>
                <TabsTrigger value="exclusion">Exclusions ({filteredExclusions.length})</TabsTrigger>
              </TabsList>

              {/* Selected Items Tab - Shows ALL selected items from all categories */}
              <TabsContent value="selected" className="p-4">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg font-medium">No items selected yet</p>
                    <p className="text-sm">
                      Select items from the Pre-Existing, Specified Illness, Congenital, or Exclusions tabs to add them
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Total selected: {selectedItems.length} items</p>
                      <div className="flex gap-4 mt-1">
                        <span>Pre-existing: {selectedItems.filter((item) => item.type === "pre-existing").length}</span>
                        <span>Specified: {selectedItems.filter((item) => item.type === "specified").length}</span>
                        <span>Congenital: {selectedItems.filter((item) => item.type === "congenital").length}</span>
                        <span>Exclusions: {selectedItems.filter((item) => item.type === "exclusion").length}</span>
                      </div>
                    </div>

                    {selectedItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500 capitalize">{item.type.replace("-", " ")}</p>
                            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSelectedItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <Label htmlFor={`waiting-${item.id}`} className="text-xs">
                              Waiting Period
                            </Label>
                            <Input
                              id={`waiting-${item.id}`}
                              value={item.waitingPeriod}
                              onChange={(e) => updateSelectedItem(item.id, "waitingPeriod", e.target.value)}
                              placeholder="e.g., 3 months"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`coinsurance-${item.id}`} className="text-xs">
                              Co-Insurance (%)
                            </Label>
                            <Input
                              id={`coinsurance-${item.id}`}
                              value={item.coInsurance}
                              onChange={(e) => updateSelectedItem(item.id, "coInsurance", e.target.value)}
                              placeholder="e.g., 20%"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`deductible-${item.id}`} className="text-xs">
                              Deductible
                            </Label>
                            <Input
                              id={`deductible-${item.id}`}
                              value={item.deductible}
                              onChange={(e) => updateSelectedItem(item.id, "deductible", e.target.value)}
                              placeholder="e.g., $500"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`copay-${item.id}`} className="text-xs">
                              Co-Payment
                            </Label>
                            <Input
                              id={`copay-${item.id}`}
                              value={item.coPayment}
                              onChange={(e) => updateSelectedItem(item.id, "coPayment", e.target.value)}
                              placeholder="e.g., $20"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Pre-Existing Conditions Tab */}
              <TabsContent value="preExisting" className="p-4">
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search pre-existing conditions..."
                      value={searchTerms.preExisting}
                      onChange={(e) => setSearchTerms({ ...searchTerms, preExisting: e.target.value })}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selectAllInCategory("preExisting")}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearSelectionInCategory("preExisting")}
                    >
                      Clear Selection
                    </Button>
                    {bulkSelected.preExisting.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addBulkItems("preExisting")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Selected ({bulkSelected.preExisting.length})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredPreExisting.length > 0 ? (
                    filteredPreExisting.map((condition) => {
                      const itemAlreadySelected = isItemSelected(condition.id, "pre-existing")
                      const displayName = condition.name || condition.title || "Unknown Condition"
                      const displayDescription = condition.description || "No description available"

                      return (
                        <div
                          key={condition.id}
                          className={`flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 ${
                            itemAlreadySelected ? "bg-green-50 border-green-200" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={bulkSelected.preExisting.includes(String(condition.id))}
                              onCheckedChange={(checked) =>
                                handleBulkSelection(String(condition.id), "preExisting", checked as boolean)
                              }
                              disabled={itemAlreadySelected}
                            />
                            <div>
                              <div className="font-medium">{displayName}</div>
                              <div className="text-sm text-gray-500">{displayDescription}</div>
                              <div className="text-xs text-blue-500">
                                ID: {condition.id} (type: {typeof condition.id})
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addSelectedItem(condition, "pre-existing")}
                            disabled={itemAlreadySelected}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {itemAlreadySelected ? "Added" : "Add"}
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">No pre-existing conditions found.</div>
                  )}
                </div>
              </TabsContent>

              {/* Specified Illness Tab */}
              <TabsContent value="specified" className="p-4">
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search specified illnesses..."
                      value={searchTerms.specified}
                      onChange={(e) => setSearchTerms({ ...searchTerms, specified: e.target.value })}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => selectAllInCategory("specified")}>
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearSelectionInCategory("specified")}
                    >
                      Clear Selection
                    </Button>
                    {bulkSelected.specified.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addBulkItems("specified")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Selected ({bulkSelected.specified.length})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredSpecified.length > 0 ? (
                    filteredSpecified.map((illness) => {
                      const itemAlreadySelected = isItemSelected(illness.id, "specified")
                      const displayName = illness.name || illness.title || "Unknown Illness"
                      const displayDescription = illness.description || "No description available"

                      return (
                        <div
                          key={illness.id}
                          className={`flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 ${
                            itemAlreadySelected ? "bg-green-50 border-green-200" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={bulkSelected.specified.includes(String(illness.id))}
                              onCheckedChange={(checked) =>
                                handleBulkSelection(String(illness.id), "specified", checked as boolean)
                              }
                              disabled={itemAlreadySelected}
                            />
                            <div>
                              <div className="font-medium">{displayName}</div>
                              <div className="text-sm text-gray-500">{displayDescription}</div>
                              <div className="text-xs text-blue-500">
                                ID: {illness.id} (type: {typeof illness.id})
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addSelectedItem(illness, "specified")}
                            disabled={itemAlreadySelected}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {itemAlreadySelected ? "Added" : "Add"}
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">No specified illnesses found.</div>
                  )}
                </div>
              </TabsContent>

              {/* Congenital Conditions Tab */}
              <TabsContent value="congenital" className="p-4">
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search congenital conditions..."
                      value={searchTerms.congenital}
                      onChange={(e) => setSearchTerms({ ...searchTerms, congenital: e.target.value })}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => selectAllInCategory("congenital")}>
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearSelectionInCategory("congenital")}
                    >
                      Clear Selection
                    </Button>
                    {bulkSelected.congenital.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addBulkItems("congenital")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Selected ({bulkSelected.congenital.length})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredCongenital.length > 0 ? (
                    filteredCongenital.map((condition) => {
                      const itemAlreadySelected = isItemSelected(condition.id, "congenital")
                      const displayName = condition.name || condition.title || "Unknown Condition"
                      const displayDescription = condition.description || "No description available"

                      return (
                        <div
                          key={condition.id}
                          className={`flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 ${
                            itemAlreadySelected ? "bg-green-50 border-green-200" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={bulkSelected.congenital.includes(String(condition.id))}
                              onCheckedChange={(checked) =>
                                handleBulkSelection(String(condition.id), "congenital", checked as boolean)
                              }
                              disabled={itemAlreadySelected}
                            />
                            <div>
                              <div className="font-medium">{displayName}</div>
                              <div className="text-sm text-gray-500">{displayDescription}</div>
                              <div className="text-xs text-blue-500">
                                ID: {condition.id} (type: {typeof condition.id})
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addSelectedItem(condition, "congenital")}
                            disabled={itemAlreadySelected}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {itemAlreadySelected ? "Added" : "Add"}
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">No congenital conditions found.</div>
                  )}
                </div>
              </TabsContent>

              {/* General Exclusions Tab */}
              <TabsContent value="exclusion" className="p-4">
                <div className="mb-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search general exclusions..."
                      value={searchTerms.exclusion}
                      onChange={(e) => setSearchTerms({ ...searchTerms, exclusion: e.target.value })}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => selectAllInCategory("exclusion")}>
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearSelectionInCategory("exclusion")}
                    >
                      Clear Selection
                    </Button>
                    {bulkSelected.exclusion.length > 0 && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addBulkItems("exclusion")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Selected ({bulkSelected.exclusion.length})
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredExclusions.length > 0 ? (
                    filteredExclusions.map((exclusion) => {
                      const itemAlreadySelected = isItemSelected(exclusion.id, "exclusion")
                      const displayName = exclusion.name || exclusion.title || "Unknown Exclusion"
                      const displayDescription = exclusion.description || "No description available"

                      return (
                        <div
                          key={exclusion.id}
                          className={`flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 ${
                            itemAlreadySelected ? "bg-green-50 border-green-200" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={bulkSelected.exclusion.includes(String(exclusion.id))}
                              onCheckedChange={(checked) =>
                                handleBulkSelection(String(exclusion.id), "exclusion", checked as boolean)
                              }
                              disabled={itemAlreadySelected}
                            />
                            <div>
                              <div className="font-medium">{displayName}</div>
                              <div className="text-sm text-gray-500">{displayDescription}</div>
                              <div className="text-xs text-blue-500">
                                ID: {exclusion.id} (type: {typeof exclusion.id})
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addSelectedItem(exclusion, "exclusion")}
                            disabled={itemAlreadySelected}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {itemAlreadySelected ? "Added" : "Add"}
                          </Button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">No general exclusions found.</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-2 pt-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Catalogue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
