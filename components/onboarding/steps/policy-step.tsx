"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Minus } from "lucide-react"
import { getPolicies, type CompletePolicy as StoredPolicy, getFormattedServiceTypes } from "@/lib/policy/policy-storage"
import { getProducts } from "@/lib/product/product-storage"
import { useCorporateClientForm } from "@/contexts/corporate-client-form-context"

interface PolicyStepProps {
  onNext: () => void
  onPrevious: () => void
  onCancel: () => void
}

export function PolicyStep({ onNext, onPrevious, onCancel }: PolicyStepProps) {
  const { formData, updateFormData } = useCorporateClientForm()
  const [policySuggestions, setPolicySuggestions] = useState<StoredPolicy[]>([])
  const [showPolicySuggestions, setShowPolicySuggestions] = useState<{ [key: string]: boolean }>({})
  const policySuggestionsRef = useRef<HTMLDivElement>(null)

  // Ensure we have policy entries, default to 2 if not available
  const policyEntries = formData.policyEntries || [
    {
      id: "policy-1",
      name: "",
      code: "",
      serviceType: "",
      productName: "",
      productCode: "",
      effectiveDate: undefined,
      expiryDate: undefined,
    },
    {
      id: "policy-2",
      name: "",
      code: "",
      serviceType: "",
      productName: "",
      productCode: "",
      effectiveDate: undefined,
      expiryDate: undefined,
    },
  ]

  // Initialize with 2 policy entries if we don't have them
  useEffect(() => {
    if (!formData.policyEntries || formData.policyEntries.length === 0) {
      updateFormData({
        policyEntries: [
          {
            id: "policy-1",
            name: "",
            code: "",
            serviceType: "",
            productName: "",
            productCode: "",
            effectiveDate: undefined,
            expiryDate: undefined,
          },
          {
            id: "policy-2",
            name: "",
            code: "",
            serviceType: "",
            productName: "",
            productCode: "",
            effectiveDate: undefined,
            expiryDate: undefined,
          },
        ],
      })
    } else if (formData.policyEntries.length === 1) {
      // If we only have 1, add a second one
      updateFormData({
        policyEntries: [
          ...formData.policyEntries,
          {
            id: "policy-2",
            name: "",
            code: "",
            serviceType: "",
            productName: "",
            productCode: "",
            effectiveDate: undefined,
            expiryDate: undefined,
          },
        ],
      })
    }
  }, [formData.policyEntries, updateFormData])

  useEffect(() => {
    getPolicies() // Initialize policies
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (policySuggestionsRef.current && !policySuggestionsRef.current.contains(event.target as Node)) {
        setShowPolicySuggestions({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Function to get a random product from the product listing
  const getRandomProduct = () => {
    const products = getProducts()
    const activeProducts = products.filter((product) => product.name && product.name.trim() !== "")

    if (activeProducts.length === 0) {
      return { name: "", code: "" }
    }

    const randomIndex = Math.floor(Math.random() * activeProducts.length)
    const randomProduct = activeProducts[randomIndex]

    return {
      name: randomProduct.name,
      code: randomProduct.code || randomProduct.productCode || "",
    }
  }

  const searchPolicies = (query: string, field: "name" | "code" | "serviceType", entryId: string) => {
    if (query.length >= 2) {
      const allPolicies = getPolicies()
      const filteredPolicies = allPolicies.filter((policy) =>
        field === "name"
          ? policy.policyName.toLowerCase().includes(query.toLowerCase())
          : policy.policyNumber.toLowerCase().includes(query.toLowerCase()),
      )
      setPolicySuggestions(filteredPolicies)
      setShowPolicySuggestions((prev) => ({ ...prev, [entryId]: true }))
    } else {
      setPolicySuggestions([])
      setShowPolicySuggestions((prev) => ({ ...prev, [entryId]: false }))
    }
  }

  const handleSelectPolicy = (policy: StoredPolicy, entryId: string) => {
    // Get specific product based on policy name
    const getProductForPolicy = (policyName: string) => {
      const products = getProducts()

      // Specific mappings based on policy name
      if (policyName === "PMC Medical Care") {
        return products.find((p) => p.name === "PMC OP Benefits") || { name: "PMC OP Benefits", code: "PMC-OP-2024" }
      } else if (policyName === "Prudential Enhanced Medical Care") {
        return products.find((p) => p.name === "PruWorks") || { name: "PruWorks", code: "PRW-2024" }
      }

      // Default: random product for other policies
      const activeProducts = products.filter((product) => product.name && product.name.trim() !== "")
      if (activeProducts.length === 0) {
        return { name: "", code: "" }
      }
      const randomIndex = Math.floor(Math.random() * activeProducts.length)
      const randomProduct = activeProducts[randomIndex]
      return {
        name: randomProduct.name,
        code: randomProduct.code || randomProduct.productCode || "",
      }
    }

    const selectedProduct = getProductForPolicy(policy.policyName)
    const serviceType = getFormattedServiceTypes(policy)

    const updatedEntries = policyEntries.map((entry) =>
      entry.id === entryId
        ? {
            ...entry,
            name: policy.policyName,
            code: policy.policyNumber,
            serviceType: serviceType,
            effectiveDate: policy.effectiveDate ? new Date(policy.effectiveDate) : undefined,
            expiryDate: policy.expiryDate ? new Date(policy.expiryDate) : undefined,
            productName: selectedProduct.name,
            productCode: selectedProduct.code,
          }
        : entry,
    )
    updateFormData({
      policyEntries: updatedEntries,
      selectedPolicyFromLookup: { ...formData.selectedPolicyFromLookup, [entryId]: true },
    })
    setShowPolicySuggestions((prev) => ({ ...prev, [entryId]: false }))
  }

  const handlePolicyChange = (id: string, field: "name" | "code" | "serviceType", value: string) => {
    const updatedEntries = policyEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    updateFormData({ policyEntries: updatedEntries })

    if (field === "name") {
      searchPolicies(value, field, id)
      // Clear the selectedFromLookup flag when manually typing
      updateFormData({
        selectedPolicyFromLookup: { ...formData.selectedPolicyFromLookup, [id]: false },
      })
    }
  }

  const handlePolicyProductChange = (id: string, field: "productName" | "productCode", value: string) => {
    const updatedEntries = policyEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    updateFormData({ policyEntries: updatedEntries })
  }

  const handlePolicyProductSelect = (id: string, productId: string) => {
    const productEntries = formData.productEntries || []
    const selectedProduct = productEntries.find((product) => product.id === productId)
    if (selectedProduct) {
      const updatedEntries = policyEntries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              productName: selectedProduct.name,
              productCode: selectedProduct.code,
            }
          : entry,
      )
      updateFormData({ policyEntries: updatedEntries })
    }
  }

  const handlePolicyDateChange = (id: string, field: "effectiveDate" | "expiryDate", value: Date | undefined) => {
    const updatedEntries = policyEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    updateFormData({ policyEntries: updatedEntries })
  }

  const addPolicyEntry = () => {
    const newId = `policy-${Date.now()}`
    const newEntry = {
      id: newId,
      name: "",
      code: "",
      serviceType: "",
      productName: "",
      productCode: "",
      effectiveDate: undefined,
      expiryDate: undefined,
    }

    updateFormData({
      policyEntries: [...policyEntries, newEntry],
    })
  }

  const removePolicyEntry = (entryId: string) => {
    // Don't allow removal if only 2 entries remain
    if (policyEntries.length <= 2) {
      alert("Minimum 2 policy entries required")
      return
    }

    const updatedEntries = policyEntries.filter((entry) => entry.id !== entryId)
    updateFormData({ policyEntries: updatedEntries })

    // Clean up related state
    const updatedSelectedFromLookup = { ...formData.selectedPolicyFromLookup }
    delete updatedSelectedFromLookup[entryId]
    updateFormData({ selectedPolicyFromLookup: updatedSelectedFromLookup })
  }

  const handleSave = () => {
    // Data is automatically saved in the context
    console.log("Policy step data saved:", {
      policyEntries: policyEntries,
      selectedPolicyFromLookup: formData.selectedPolicyFromLookup,
    })

    // Store in localStorage as backup
    const policyStepData = {
      policyEntries: policyEntries,
      selectedPolicyFromLookup: formData.selectedPolicyFromLookup || {},
      policyTabValue: formData.policyTabValue || "single",
    }

    localStorage.setItem("corporateClientPolicyStep", JSON.stringify(policyStepData))

    // Show success message
    alert("Policy information saved successfully!")

    onNext()
  }

  const handleCancel = () => {
    updateFormData({
      policyEntries: [
        {
          id: "policy-1",
          name: "",
          code: "",
          serviceType: "",
          productName: "",
          productCode: "",
          effectiveDate: undefined,
          expiryDate: undefined,
        },
        {
          id: "policy-2",
          name: "",
          code: "",
          serviceType: "",
          productName: "",
          productCode: "",
          effectiveDate: undefined,
          expiryDate: undefined,
        },
      ],
    })

    // Clear localStorage backup
    localStorage.removeItem("corporateClientPolicyStep")

    onCancel()
  }

  // Load from localStorage if context data is empty
  useEffect(() => {
    if (policyEntries.length === 2 && !policyEntries[0].name && !policyEntries[1].name) {
      const savedData = localStorage.getItem("corporateClientPolicyStep")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log("Loading policy data from localStorage:", parsedData)

          if (parsedData.policyEntries && parsedData.policyEntries.length > 0) {
            updateFormData({
              policyEntries: parsedData.policyEntries,
              selectedPolicyFromLookup: parsedData.selectedPolicyFromLookup || {},
              policyTabValue: parsedData.policyTabValue || "single",
            })
          }
        } catch (error) {
          console.error("Error loading policy data from localStorage:", error)
        }
      }
    }
  }, [policyEntries, updateFormData])

  const productEntries = formData.productEntries || []
  const hasValidProductEntries =
    productEntries.length > 0 && productEntries.some((product) => product.name.trim() !== "")

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Policy Information</h2>

      {policyEntries.map((entry, index) => (
        <div key={entry.id} className="space-y-4">
          {index > 0 && <div className="border-t pt-4"></div>}
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Policy {index + 1}</h3>
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={addPolicyEntry} className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removePolicyEntry(entry.id)}
                className="h-8 w-8 p-0"
                disabled={policyEntries.length <= 2}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor={`policyCode-${entry.id}`} className="text-sm font-medium">
                Policy Number
              </label>
              <input
                id={`policyCode-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter policy code"
                value={entry.code || ""}
                onChange={(e) => handlePolicyChange(entry.id, "code", e.target.value)}
                readOnly={formData.selectedPolicyFromLookup?.[entry.id]}
              />
            </div>
            <div className="space-y-2 relative">
              <label htmlFor={`policyName-${entry.id}`} className="text-sm font-medium">
                Policy Name
              </label>
              <input
                id={`policyName-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter policy name"
                value={entry.name || ""}
                onChange={(e) => handlePolicyChange(entry.id, "name", e.target.value)}
              />
              {showPolicySuggestions[entry.id] && policySuggestions.length > 0 && (
                <div
                  ref={policySuggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {policySuggestions.map((policy) => (
                    <div
                      key={policy.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPolicy(policy, entry.id)}
                    >
                      <div className="font-medium">{policy.policyName}</div>
                      <div className="text-sm text-gray-500">Code: {policy.policyNumber}</div>
                      <div className="text-xs text-gray-400">Service Type: {getFormattedServiceTypes(policy)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label htmlFor={`serviceType-${entry.id}`} className="text-sm font-medium">
                Service Type
              </label>
              <input
                id={`serviceType-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter service type (e.g., GP, SP, OC, DT)"
                value={entry.serviceType || ""}
                onChange={(e) => handlePolicyChange(entry.id, "serviceType", e.target.value)}
                readOnly={formData.selectedPolicyFromLookup?.[entry.id]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label htmlFor={`effectiveDate-${entry.id}`} className="text-sm font-medium">
                Effective Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                    id={`effectiveDate-${entry.id}`}
                    disabled={formData.selectedPolicyFromLookup?.[entry.id]}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {entry.effectiveDate ? format(entry.effectiveDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={entry.effectiveDate}
                    onSelect={(date) => handlePolicyDateChange(entry.id, "effectiveDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor={`expiryDate-${entry.id}`} className="text-sm font-medium">
                Expiry Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                    id={`expiryDate-${entry.id}`}
                    disabled={formData.selectedPolicyFromLookup?.[entry.id]}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {entry.expiryDate ? format(entry.expiryDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={entry.expiryDate}
                    onSelect={(date) => handlePolicyDateChange(entry.id, "expiryDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label htmlFor={`productName-${entry.id}`} className="text-sm font-medium">
                Product Name
              </label>
              {hasValidProductEntries ? (
                <Select
                  value={entry.productName ? productEntries.find((p) => p.name === entry.productName)?.id : ""}
                  onValueChange={(value) => handlePolicyProductSelect(entry.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productEntries
                      .filter((p) => p.name.trim() !== "")
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <input
                  id={`productName-${entry.id}`}
                  type="text"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Auto-populated from product listing"
                  value={entry.productName || ""}
                  onChange={(e) => handlePolicyProductChange(entry.id, "productName", e.target.value)}
                  readOnly={formData.selectedPolicyFromLookup?.[entry.id]}
                />
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor={`productCode-${entry.id}`} className="text-sm font-medium">
                Product Code
              </label>
              <input
                id={`productCode-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Auto-populated from product listing"
                value={entry.productCode || ""}
                onChange={(e) => handlePolicyProductChange(entry.id, "productCode", e.target.value)}
                readOnly={formData.selectedPolicyFromLookup?.[entry.id] || hasValidProductEntries}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-4 pt-4 mt-6 border-t">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}
