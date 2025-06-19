"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MinusCircle, Upload, FileText, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { getPlans, type Plan as StoredPlan } from "@/lib/plan/plan-storage"
import {
  useCorporateClientForm,
  type PlanEntry,
  type PolicyEntry,
  type ServiceType,
} from "@/contexts/corporate-client-form-context"
import { format } from "date-fns"

interface PlanStepProps {
  onNext: () => void
  onPrevious: () => void
  onCancel: () => void
}

// localStorage key for plan step data
const PLAN_STEP_STORAGE_KEY = "corporateClientPlanStep"

export function PlanStep({ onNext, onPrevious, onCancel }: PlanStepProps) {
  const { formData, updateFormData } = useCorporateClientForm()
  const [planSuggestions, setPlanSuggestions] = useState<StoredPlan[]>([])
  const [showPlanSuggestions, setShowPlanSuggestions] = useState<{ [key: string]: boolean }>({})
  const [isDragging, setIsDragging] = useState(false)
  const planSuggestionsRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [displayPolicies, setDisplayPolicies] = useState<PolicyEntry[]>([])
  const [selectedPolicies, setSelectedPolicies] = useState<{ [key: string]: boolean }>({})
  const [selectAll, setSelectAll] = useState(true)
  const [savedPlanRecords, setSavedPlanRecords] = useState<PlanEntry[]>([])
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)

  // Table functionality states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all") // all, name, code, description
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortBy, setSortBy] = useState<keyof PlanEntry>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Save data to localStorage
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        planEntries: formData.planEntries,
        planTabValue: formData.planTabValue,
        planSelectedFile: null, // Don't save file objects
        selectedPlanFromLookup: formData.selectedPlanFromLookup,
        savedPlanRecords: savedPlanRecords,
        selectedPolicies: selectedPolicies,
        displayPolicies: displayPolicies,
        // Save table state
        searchTerm,
        filterBy,
        currentPage,
        itemsPerPage,
        sortBy,
        sortOrder,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem(PLAN_STEP_STORAGE_KEY, JSON.stringify(dataToSave))
      console.log("Plan step data saved to localStorage:", dataToSave)
    } catch (error) {
      console.error("Error saving plan step data to localStorage:", error)
    }
  }

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(PLAN_STEP_STORAGE_KEY)
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        console.log("Loading plan step data from localStorage:", parsedData)

        // Restore form data
        updateFormData({
          planEntries: parsedData.planEntries || formData.planEntries,
          planTabValue: parsedData.planTabValue || "single",
          selectedPlanFromLookup: parsedData.selectedPlanFromLookup || {},
        })

        // Restore saved plan records
        if (parsedData.savedPlanRecords) {
          setSavedPlanRecords(parsedData.savedPlanRecords)
        }

        // Restore policy selections
        if (parsedData.selectedPolicies) {
          setSelectedPolicies(parsedData.selectedPolicies)
        }

        // Restore display policies
        if (parsedData.displayPolicies) {
          setDisplayPolicies(parsedData.displayPolicies)
        }

        // Restore table state
        if (parsedData.searchTerm !== undefined) setSearchTerm(parsedData.searchTerm)
        if (parsedData.filterBy) setFilterBy(parsedData.filterBy)
        if (parsedData.currentPage) setCurrentPage(parsedData.currentPage)
        if (parsedData.itemsPerPage) setItemsPerPage(parsedData.itemsPerPage)
        if (parsedData.sortBy) setSortBy(parsedData.sortBy)
        if (parsedData.sortOrder) setSortOrder(parsedData.sortOrder)

        return true
      }
    } catch (error) {
      console.error("Error loading plan step data from localStorage:", error)
    }
    return false
  }

  // Auto-save whenever important data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage()
    }, 1000) // Debounce saves by 1 second

    return () => clearTimeout(timeoutId)
  }, [
    formData.planEntries,
    formData.planTabValue,
    formData.selectedPlanFromLookup,
    savedPlanRecords,
    selectedPolicies,
    displayPolicies,
    searchTerm,
    filterBy,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
  ])

  // Load data on component mount
  useEffect(() => {
    console.log("Plan step: Component mounted, loading from localStorage")
    const loaded = loadFromLocalStorage()

    if (!loaded) {
      // If no saved data, load policy data as before
      const policies = loadPolicyData()
      setDisplayPolicies(policies)
    }
  }, [])

  // Function to get policy data from the Policy step
  const getPolicyDataFromContext = (): PolicyEntry[] => {
    console.log("=== GETTING POLICY DATA FROM CONTEXT ===")
    console.log("Full formData:", formData)
    console.log("formData.policyEntries:", formData.policyEntries)

    if (formData.policyEntries && formData.policyEntries.length > 0) {
      // Much more lenient filtering - accept any policy that exists and has an ID
      const validPolicies = formData.policyEntries.filter((policy) => {
        // Much more lenient filtering - accept any policy that exists and has an ID
        if (!policy || !policy.id) {
          console.log(`Rejecting policy: no ID`, policy)
          return false
        }

        const hasName = policy.name && policy.name.trim() !== ""
        const hasCode = policy.code && policy.code.trim() !== ""
        const hasServiceType = policy.serviceType && policy.serviceType.trim() !== ""
        const hasProductName = policy.productName && policy.productName.trim() !== ""

        // Accept if ANY field has data (much more lenient)
        const hasAnyData = hasName || hasCode || hasServiceType || hasProductName

        return hasAnyData
      })

      console.log("Valid policies found:", validPolicies)
      return validPolicies
    }

    console.log("No policy entries found in context")
    return []
  }

  // Function to load policy data from localStorage (Policy step backup)
  const getPolicyDataFromStorage = (): PolicyEntry[] => {
    console.log("=== TRYING TO LOAD FROM LOCALSTORAGE ===")
    try {
      const savedPolicyData = localStorage.getItem("corporateClientPolicyStep")
      if (savedPolicyData) {
        const parsedData = JSON.parse(savedPolicyData)
        console.log("Found saved policy data:", parsedData)

        if (parsedData.policyEntries && parsedData.policyEntries.length > 0) {
          const validPolicies = parsedData.policyEntries.filter((policy: PolicyEntry) => {
            const hasName = policy.name && policy.name.trim() !== ""
            const hasCode = policy.code && policy.code.trim() !== ""
            const hasServiceType = policy.serviceType && policy.serviceType.trim() !== ""
            return hasName || hasCode || hasServiceType
          })

          if (validPolicies.length > 0) {
            console.log("Valid policies from localStorage:", validPolicies)
            // Update the context with this data
            updateFormData({
              policyEntries: validPolicies,
              selectedPolicyFromLookup: parsedData.selectedPolicyFromLookup || {},
            })
            return validPolicies
          }
        }
      }
    } catch (error) {
      console.error("Error reading policy data from localStorage:", error)
    }

    console.log("No valid policy data found in localStorage")
    return []
  }

  // Main function to get policy data
  const loadPolicyData = (): PolicyEntry[] => {
    console.log("=== LOADING POLICY DATA ===")

    // First try to get from context
    let policies = getPolicyDataFromContext()

    // If no data in context, try localStorage
    if (policies.length === 0) {
      policies = getPolicyDataFromStorage()
    }

    console.log("Final policies to display:", policies)
    return policies
  }

  // Filtered and sorted data for the table
  const filteredAndSortedRecords = useMemo(() => {
    const filtered = savedPlanRecords.filter((record) => {
      if (!searchTerm) return true

      const searchLower = searchTerm.toLowerCase()

      if (filterBy === "all") {
        return (
          record.name.toLowerCase().includes(searchLower) ||
          record.code.toLowerCase().includes(searchLower) ||
          (record.description && record.description.toLowerCase().includes(searchLower))
        )
      } else if (filterBy === "name") {
        return record.name.toLowerCase().includes(searchLower)
      } else if (filterBy === "code") {
        return record.code.toLowerCase().includes(searchLower)
      } else if (filterBy === "description") {
        return record.description && record.description.toLowerCase().includes(searchLower)
      }

      return true
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || ""
      let bValue = b[sortBy] || ""

      // Handle date sorting
      if (sortBy === "effectiveDate" || sortBy === "expiryDate") {
        aValue = a[sortBy] ? new Date(a[sortBy] as Date).getTime() : 0
        bValue = b[sortBy] ? new Date(b[sortBy] as Date).getTime() : 0
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [savedPlanRecords, searchTerm, filterBy, sortBy, sortOrder])

  // Pagination calculations
  const totalRecords = filteredAndSortedRecords.length
  const totalPages = Math.ceil(totalRecords / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRecords = filteredAndSortedRecords.slice(startIndex, endIndex)

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterBy])

  // Initialize selected policies when policies are loaded
  useEffect(() => {
    if (displayPolicies.length > 0) {
      const initialSelectedState: { [key: string]: boolean } = {}
      displayPolicies.forEach((policy) => {
        initialSelectedState[policy.id] = true
      })
      setSelectedPolicies(initialSelectedState)
      setSelectAll(true)
    }
  }, [displayPolicies])

  // Load policy data when component mounts or when formData changes
  useEffect(() => {
    console.log("Plan step: useEffect triggered for policy data loading")
    const policies = loadPolicyData()
    setDisplayPolicies(policies)
  }, [formData.policyEntries])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (planSuggestionsRef.current && !planSuggestionsRef.current.contains(event.target as Node)) {
        setShowPlanSuggestions({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSort = (column: keyof PlanEntry) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleSelectAllToggle = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    const updatedSelectedPolicies: { [key: string]: boolean } = {}
    displayPolicies.forEach((policy) => {
      updatedSelectedPolicies[policy.id] = newSelectAll
    })
    setSelectedPolicies(updatedSelectedPolicies)
  }

  const handlePolicySelect = (policyId: string) => {
    const updatedSelectedPolicies = {
      ...selectedPolicies,
      [policyId]: !selectedPolicies[policyId],
    }
    setSelectedPolicies(updatedSelectedPolicies)

    // Check if all policies are selected to update the selectAll state
    const allSelected = displayPolicies.every((policy) => updatedSelectedPolicies[policy.id])
    setSelectAll(allSelected)
  }

  const searchPlans = (query: string, field: "name" | "code", entryId: string) => {
    if (query.length >= 2) {
      const allPlans = getPlans()
      const filteredPlans = allPlans.filter((plan) =>
        field === "name"
          ? plan.name.toLowerCase().includes(query.toLowerCase())
          : plan.id.toLowerCase().includes(query.toLowerCase()),
      )
      setPlanSuggestions(filteredPlans)
      setShowPlanSuggestions((prev) => ({ ...prev, [entryId]: true }))
    } else {
      setPlanSuggestions([])
      setShowPlanSuggestions((prev) => ({ ...prev, [entryId]: false }))
    }
  }

  const handleSelectPlan = (plan: StoredPlan, entryId: string) => {
    const updatedEntries = formData.planEntries.map((entry) =>
      entry.id === entryId
        ? {
            ...entry,
            name: plan.name,
            code: plan.id,
            description: plan.type || "",
            effectiveDate: plan.effectiveDate ? new Date(plan.effectiveDate) : undefined,
            expiryDate: plan.expiryDate ? new Date(plan.expiryDate) : undefined,
          }
        : entry,
    )
    updateFormData({
      planEntries: updatedEntries,
      selectedPlanFromLookup: { ...formData.selectedPlanFromLookup, [entryId]: true },
    })
    setShowPlanSuggestions((prev) => ({ ...prev, [entryId]: false }))
  }

  const handlePlanTextChange = (id: string, field: "name" | "code" | "description", value: string) => {
    const updatedEntries = formData.planEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    updateFormData({ planEntries: updatedEntries })

    if (field === "name") {
      searchPlans(value, field, id)
    }
  }

  const handlePlanDateChange = (id: string, field: "effectiveDate" | "expiryDate", value: Date | undefined) => {
    const updatedEntries = formData.planEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    updateFormData({ planEntries: updatedEntries })
  }

  const removePlanEntry = (id: string) => {
    if (formData.planEntries.length > 1) {
      const updatedEntries = formData.planEntries.filter((entry) => entry.id !== id)
      updateFormData({ planEntries: updatedEntries })
    }
  }

  const handleRefreshPolicies = () => {
    console.log("Manual refresh triggered")
    const policies = loadPolicyData()
    setDisplayPolicies(policies)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updateFormData({ planSelectedFile: e.target.files[0] })
    }
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      updateFormData({ planSelectedFile: e.dataTransfer.files[0] })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleBulkUpload = () => {
    if (formData.planSelectedFile) {
      console.log(`Processing file: ${formData.planSelectedFile.name}`)
      alert(`File "${formData.planSelectedFile.name}" uploaded successfully. Processing will begin shortly.`)
      updateFormData({ planSelectedFile: null })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } else {
      alert("Please select a file to upload.")
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleEditPlanRecord = (record: PlanEntry) => {
    // Load the record data back into the form
    updateFormData({
      planEntries: [
        {
          id: "plan-1",
          name: record.name,
          code: record.code,
          description: record.description || "",
          effectiveDate: record.effectiveDate,
          expiryDate: record.expiryDate,
        },
      ],
    })

    // Set selected policies if they exist
    if (record.policies && record.policies.length > 0) {
      const policySelections: { [key: string]: boolean } = {}
      displayPolicies.forEach((policy) => {
        const isSelected = record.policies?.some((p) => p.id === policy.id) || false
        policySelections[policy.id] = isSelected
      })
      setSelectedPolicies(policySelections)
    }

    // Mark this record as being edited
    setEditingRecordId(record.id)

    // Remove the record from saved records temporarily
    const updatedRecords = savedPlanRecords.filter((r) => r.id !== record.id)
    setSavedPlanRecords(updatedRecords)
  }

  const handleSavePlanRecord = () => {
    const currentPlan = formData.planEntries[0] // Get the first (current) plan entry

    // Validate required fields
    if (!currentPlan.name || !currentPlan.code) {
      alert("Please fill in all required fields (Plan Name and Plan Code)")
      return
    }

    // Get selected policies for this plan
    const selectedPolicyEntries = displayPolicies.filter((policy) => selectedPolicies[policy.id])

    // Create a new plan record with selected policies
    const newPlanRecord: PlanEntry = {
      ...currentPlan,
      id: editingRecordId || `saved-plan-${Date.now()}`, // Use existing ID if editing
      policies: selectedPolicyEntries.map((policy) => ({
        id: policy.id,
        policyNo: policy.code,
        policyName: policy.name,
        effectiveDate: policy.effectiveDate,
        expiryDate: policy.expiryDate,
        serviceTypes: [policy.serviceType] as ServiceType[],
      })),
    }

    // Add to saved records
    setSavedPlanRecords((prev) => [...prev, newPlanRecord])

    // Reset the form to empty state
    updateFormData({
      planEntries: [
        {
          id: "plan-1",
          name: "",
          code: "",
          description: "",
          effectiveDate: undefined,
          expiryDate: undefined,
          policies: [],
        },
      ],
    })

    // Reset selected policies and editing state
    setSelectedPolicies({})
    setSelectAll(true)
    setEditingRecordId(null)

    const message = editingRecordId ? "Plan record updated successfully!" : "Plan record saved successfully!"
    alert(message)
  }

  const handleSave = () => {
    // Save current state to localStorage before proceeding
    saveToLocalStorage()

    // Include both current plan entries and saved plan records
    const allPlanEntries = [...savedPlanRecords, ...formData.planEntries.filter((entry) => entry.name && entry.code)]

    if (allPlanEntries.length === 0) {
      alert("Please save at least one plan record before proceeding")
      return
    }

    // Save all plan records to context
    updateFormData({
      planEntries: allPlanEntries,
    })

    console.log("Saving all plan data:", allPlanEntries)
    onNext()
  }

  const handlePrevious = () => {
    // Save current state before going to previous step
    saveToLocalStorage()
    onPrevious()
  }

  const handleCancel = () => {
    // Clear localStorage data when canceling
    localStorage.removeItem(PLAN_STEP_STORAGE_KEY)

    updateFormData({
      planEntries: [
        {
          id: "plan-1",
          name: "",
          code: "",
          description: "",
        },
      ],
      planSelectedFile: null,
    })
    onCancel()
  }

  const downloadTemplate = () => {
    const csvContent = "No.,Plan Code,Policy Number"
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "plan_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Plan Information</h2>

      <Tabs
        defaultValue="single"
        value={formData.planTabValue}
        onValueChange={(value) => updateFormData({ planTabValue: value })}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="single">Single Record</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Records</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-0">
          {/* Plan Details Form - Separate Section */}
          {formData.planEntries.map((plan, planIndex) => (
            <div key={plan.id} className="space-y-8">
              {/* Plan Information Section */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Plan Details</h3>
                  <div className="flex space-x-2">
                    {formData.planEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlanEntry(plan.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove plan"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 relative">
                    <label htmlFor={`planName-${plan.id}`} className="text-sm font-medium text-gray-700">
                      Plan Name *
                    </label>
                    <input
                      id={`planName-${plan.id}`}
                      type="text"
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter plan name"
                      value={plan.name || ""}
                      onChange={(e) => handlePlanTextChange(plan.id, "name", e.target.value)}
                      required
                    />
                    {showPlanSuggestions[plan.id] && planSuggestions.length > 0 && (
                      <div
                        ref={planSuggestionsRef}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                      >
                        {planSuggestions.map((planSuggestion) => (
                          <div
                            key={planSuggestion.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectPlan(planSuggestion, plan.id)}
                          >
                            <div className="font-medium">{planSuggestion.name}</div>
                            <div className="text-sm text-gray-500">Code: {planSuggestion.id}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`planCode-${plan.id}`} className="text-sm font-medium text-gray-700">
                      Plan Code *
                    </label>
                    <input
                      id={`planCode-${plan.id}`}
                      type="text"
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter plan code"
                      value={plan.code || ""}
                      onChange={(e) => handlePlanTextChange(plan.id, "code", e.target.value)}
                      readOnly={formData.selectedPlanFromLookup[plan.id]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`planDescription-${plan.id}`} className="text-sm font-medium text-gray-700">
                      Plan Description
                    </label>
                    <input
                      id={`planDescription-${plan.id}`}
                      type="text"
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter plan description"
                      value={plan.description || ""}
                      onChange={(e) => handlePlanTextChange(plan.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`planEffectiveDate-${plan.id}`} className="text-sm font-medium text-gray-700">
                      Plan Effective Date
                    </label>
                    <input
                      id={`planEffectiveDate-${plan.id}`}
                      type="text"
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter effective date (e.g., 2024-01-01)"
                      value={plan.effectiveDate ? format(plan.effectiveDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const dateValue = e.target.value ? new Date(e.target.value) : undefined
                        handlePlanDateChange(plan.id, "effectiveDate", dateValue)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`planExpiryDate-${plan.id}`} className="text-sm font-medium text-gray-700">
                      Plan Expiry Date
                    </label>
                    <input
                      id={`planExpiryDate-${plan.id}`}
                      type="text"
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter expiry date (e.g., 2024-12-31)"
                      value={plan.expiryDate ? format(plan.expiryDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const dateValue = e.target.value ? new Date(e.target.value) : undefined
                        handlePlanDateChange(plan.id, "expiryDate", dateValue)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Policy Selection Section - Separate Form */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Policy Selection</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500 h-4 w-4"
                            checked={selectAll}
                            onChange={handleSelectAllToggle}
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Policy Name</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Policy Number</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Service Type</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Effective Date</th>
                        <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayPolicies && displayPolicies.length > 0 ? (
                        displayPolicies.map((policy, index) => (
                          <tr key={`${policy.id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500 h-4 w-4"
                                checked={selectedPolicies[policy.id] || false}
                                onChange={() => handlePolicySelect(policy.id)}
                              />
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{policy.name || "-"}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{policy.code || "-"}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{policy.serviceType || "-"}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {policy.effectiveDate ? format(policy.effectiveDate, "yyyy-MM-dd") : "-"}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {policy.expiryDate ? format(policy.expiryDate, "yyyy-MM-dd") : "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 px-4 text-center text-sm text-gray-500">
                            <div className="flex flex-col items-center space-y-2">
                              <span>No policies found from Policy step.</span>
                              <span className="text-xs">
                                Please go back to Policy step and save your policies, then return here.
                              </span>
                              <Button variant="outline" size="sm" onClick={handleRefreshPolicies}>
                                Try Loading Again
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Save Button Section */}
              <div className="flex justify-end">
                <Button onClick={handleSavePlanRecord} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                  Save Plan Record
                </Button>
              </div>
            </div>
          ))}

          {/* Enhanced Plan Records Table */}
          {savedPlanRecords.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Plan Records</h3>
                <div className="text-sm text-gray-600">
                  Total: {totalRecords} record{totalRecords !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search plan records..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      <option value="all">All Fields</option>
                      <option value="name">Plan Name</option>
                      <option value="code">Plan Code</option>
                      <option value="description">Description</option>
                    </select>
                  </div>

                  {/* Items per page */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th
                        className="text-left py-3 px-4 font-medium text-sm border-r border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Plan Name</span>
                          {sortBy === "name" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm border-r border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("code")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Plan Code</span>
                          {sortBy === "code" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm border-r border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("description")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Description</span>
                          {sortBy === "description" && (
                            <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm border-r border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("effectiveDate")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Effective Date</span>
                          {sortBy === "effectiveDate" && (
                            <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 font-medium text-sm border-r border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("expiryDate")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Expiry Date</span>
                          {sortBy === "expiryDate" && (
                            <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-sm border-r border-gray-200">Policies</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((record, index) => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium border-r border-gray-200">{record.name}</td>
                          <td className="py-3 px-4 text-sm border-r border-gray-200">{record.code}</td>
                          <td className="py-3 px-4 text-sm border-r border-gray-200">{record.description || "-"}</td>
                          <td className="py-3 px-4 text-sm border-r border-gray-200">
                            {record.effectiveDate ? format(record.effectiveDate, "yyyy-MM-dd") : "-"}
                          </td>
                          <td className="py-3 px-4 text-sm border-r border-gray-200">
                            {record.expiryDate ? format(record.expiryDate, "yyyy-MM-dd") : "-"}
                          </td>
                          <td className="py-3 px-4 text-sm border-r border-gray-200">
                            {record.policies && record.policies.length > 0
                              ? `${record.policies.length} policies selected`
                              : "No policies"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditPlanRecord(record)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updatedRecords = savedPlanRecords.filter((r) => r.id !== record.id)
                                  setSavedPlanRecords(updatedRecords)
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 px-4 text-center text-sm text-gray-500">
                          {searchTerm || filterBy !== "all"
                            ? "No records match your search criteria."
                            : "No plan records found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} records
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bulk" className="mt-0">
          <div className="space-y-6">
            <div className="bg-white p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Bulk Upload Plans</h3>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Upload a CSV file containing multiple plan records. The file should include the following columns:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-2 space-y-1">
                  <li>Column A - No.</li>
                  <li>Column B - Plan Code</li>
                  <li>Column C - Policy Number</li>
                </ul>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                />

                {formData.planSelectedFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-12 w-12 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">{formData.planSelectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(formData.planSelectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateFormData({ planSelectedFile: null })
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Drag and drop your file here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse files</p>
                    <p className="text-xs text-gray-500 mt-4">Supports CSV, Excel (.xlsx, .xls)</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button onClick={downloadTemplate} className="text-sm text-blue-600 hover:underline flex items-center">
                  Download template file
                </button>
                <Button onClick={handleBulkUpload} disabled={!formData.planSelectedFile} className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-4 mt-6 border-t">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handlePrevious}>
          Previous
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}
