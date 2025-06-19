"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { getCompanies, type Company } from "@/lib/company/company-storage"
import { PayorStorage, type Payor } from "@/lib/payor/payor-storage"
import { initializeDummyCompanies } from "@/lib/company/dummy-data"
import { initializeDummyPayors } from "@/lib/payor/dummy-data"
import { useCorporateClientForm } from "@/contexts/corporate-client-form-context"

interface CompanyStepProps {
  onNext: () => void
  onCancel: () => void
}

export function CompanyStep({ onNext, onCancel }: CompanyStepProps) {
  const { formData, updateFormData } = useCorporateClientForm()
  const [suggestions, setSuggestions] = useState<Company[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [localCompanies, setLocalCompanies] = useState<Company[]>([])
  const [showPayorSection, setShowPayorSection] = useState(false)
  const [companySelected, setCompanySelected] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Payor related states
  const [payorSuggestions1, setPayorSuggestions1] = useState<Payor[]>([])
  const [payorSuggestions2, setPayorSuggestions2] = useState<Payor[]>([])
  const [showPayorSuggestions1, setShowPayorSuggestions1] = useState(false)
  const [showPayorSuggestions2, setShowPayorSuggestions2] = useState(false)
  const [localPayors, setLocalPayors] = useState<Payor[]>([])
  const payorSuggestionsRef1 = useRef<HTMLDivElement>(null)
  const payorSuggestionsRef2 = useRef<HTMLDivElement>(null)

  // Initialize companies and payors on mount
  useEffect(() => {
    initializeDummyCompanies()
    initializeDummyPayors()
    const companiesFromStorage = getCompanies()
    const payorsFromStorage = PayorStorage.getAllPayors()
    setLocalCompanies(companiesFromStorage)
    setLocalPayors(payorsFromStorage)
    setIsInitialized(true)
  }, [])

  // Restore form state when component mounts or form data changes
  useEffect(() => {
    if (!isInitialized) return

    console.log("Restoring form data:", formData)

    // Check if there's existing company and payor data
    const hasCompanyData = formData.companyName && formData.companyCode
    const hasPayorData = formData.payorName1 || formData.payorName2

    if (hasCompanyData && hasPayorData) {
      console.log("Restoring company and payor data")
      setCompanySelected(true)
      setShowPayorSection(true)
    } else if (hasCompanyData) {
      console.log("Restoring company data only")
      setCompanySelected(true)
      setShowPayorSection(false)
    } else {
      console.log("No data to restore")
      setCompanySelected(false)
      setShowPayorSection(false)
    }
  }, [isInitialized, formData.companyName, formData.companyCode, formData.payorName1, formData.payorName2])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
      if (payorSuggestionsRef1.current && !payorSuggestionsRef1.current.contains(event.target as Node)) {
        setShowPayorSuggestions1(false)
      }
      if (payorSuggestionsRef2.current && !payorSuggestionsRef2.current.contains(event.target as Node)) {
        setShowPayorSuggestions2(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const searchCompanies = (query: string) => {
    if (query.length >= 3) {
      const filteredCompanies = localCompanies.filter((company) =>
        company.name.toLowerCase().includes(query.toLowerCase()),
      )
      setSuggestions(filteredCompanies)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const searchPayors = (query: string, index: number) => {
    if (query.length >= 3) {
      const filteredPayors = localPayors.filter((payor) => payor.name.toLowerCase().includes(query.toLowerCase()))
      if (index === 1) {
        setPayorSuggestions1(filteredPayors)
        setShowPayorSuggestions1(true)
      } else {
        setPayorSuggestions2(filteredPayors)
        setShowPayorSuggestions2(true)
      }
    } else {
      if (index === 1) {
        setPayorSuggestions1([])
        setShowPayorSuggestions1(false)
      } else {
        setPayorSuggestions2([])
        setShowPayorSuggestions2(false)
      }
    }
  }

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateFormData({ companyName: value })
    searchCompanies(value)

    // If user is manually typing and there's no existing payor data, consider it not selected from dropdown
    if (!formData.payorName1 && !formData.payorName2) {
      setCompanySelected(false)
      setShowPayorSection(false)
    }

    // Hide payor section when company name is cleared
    if (!value) {
      setCompanySelected(false)
      setShowPayorSection(false)
      updateFormData({
        payorName1: "",
        payorCode1: "",
        payorType1: "Self-funded/Non-Insurer",
        payorName2: "",
        payorCode2: "",
        payorType2: "Insurance",
      })
    }
  }

  const handleCompanyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateFormData({ companyCode: value })

    // If user is manually typing and there's no existing payor data, consider it not selected from dropdown
    if (!formData.payorName1 && !formData.payorName2) {
      setCompanySelected(false)
      setShowPayorSection(false)
    }
  }

  const handlePayorNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (index === 1) {
      updateFormData({ payorName1: value })
      searchPayors(value, 1)
    } else {
      updateFormData({ payorName2: value })
      searchPayors(value, 2)
    }
  }

  const handlePayorCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (index === 1) {
      updateFormData({ payorCode1: value })
    } else {
      updateFormData({ payorCode2: value })
    }
  }

  const handlePayorTypeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (index === 1) {
      updateFormData({ payorType1: value })
    } else {
      updateFormData({ payorType2: value })
    }
  }

  const handleSelectCompany = (company: Company) => {
    updateFormData({
      companyName: company.name,
      companyCode: company.code,
      // Auto-populate payor information
      payorName1: "PMCare Sdn Bhd",
      payorCode1: "PMC",
      payorType1: "Self-funded/Non-Insurer",
      payorName2: "Prudential Assurance Malaysia Berhad",
      payorCode2: "PAMB",
      payorType2: "Insurance",
    })
    setShowSuggestions(false)

    // Mark that company was selected from dropdown
    setCompanySelected(true)
    setShowPayorSection(true)
  }

  const handleSelectPayor = (payor: Payor, index: number) => {
    if (index === 1) {
      updateFormData({
        payorName1: payor.name,
        payorCode1: payor.code,
      })
      setShowPayorSuggestions1(false)
    } else {
      updateFormData({
        payorName2: payor.name,
        payorCode2: payor.code,
      })
      setShowPayorSuggestions2(false)
    }
  }

  const handleSave = () => {
    // Ensure data is saved in context first
    const companyData = {
      companyName: formData.companyName,
      companyCode: formData.companyCode,
      payorName1: formData.payorName1,
      payorCode1: formData.payorCode1,
      payorType1: formData.payorType1,
      payorName2: formData.payorName2,
      payorCode2: formData.payorCode2,
      payorType2: formData.payorType2,
    }

    // Force update the context with current form values
    updateFormData(companyData)

    console.log("Saving company data:", companyData)

    // Store in localStorage as backup
    localStorage.setItem(
      "corporateClientCompanyStep",
      JSON.stringify({
        ...companyData,
        companySelected: true,
        showPayorSection: showPayorSection,
      }),
    )

    // Show success message
    alert("Company information saved successfully!")

    // Small delay to ensure context update completes
    setTimeout(() => {
      onNext()
    }, 100)
  }

  const handleCancel = () => {
    updateFormData({
      companyName: "",
      companyCode: "",
      payorName1: "",
      payorCode1: "",
      payorType1: "Self-funded/Non-Insurer",
      payorName2: "",
      payorCode2: "",
      payorType2: "Insurance",
    })
    setSuggestions([])
    setShowSuggestions(false)
    setPayorSuggestions1([])
    setShowPayorSuggestions1(false)
    setPayorSuggestions2([])
    setShowPayorSuggestions2(false)
    setCompanySelected(false)
    setShowPayorSection(false)

    // Clear localStorage backup
    localStorage.removeItem("corporateClientCompanyStep")

    onCancel()
  }

  // Load from localStorage if context data is empty
  useEffect(() => {
    if (isInitialized && !formData.companyName && !formData.companyCode) {
      const savedData = localStorage.getItem("corporateClientCompanyStep")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          console.log("Loading data from localStorage:", parsedData)

          updateFormData({
            companyName: parsedData.companyName || "",
            companyCode: parsedData.companyCode || "",
            payorName1: parsedData.payorName1 || "",
            payorCode1: parsedData.payorCode1 || "",
            payorType1: parsedData.payorType1 || "Self-funded/Non-Insurer",
            payorName2: parsedData.payorName2 || "",
            payorCode2: parsedData.payorCode2 || "",
            payorType2: parsedData.payorType2 || "Insurance",
          })

          setCompanySelected(parsedData.companySelected || false)
          setShowPayorSection(parsedData.showPayorSection || false)
        } catch (error) {
          console.error("Error loading data from localStorage:", error)
        }
      }
    }
  }, [isInitialized, formData.companyName, formData.companyCode, updateFormData])

  return (
    <div className="space-y-8">
      {/* Company Information Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative">
            <label htmlFor="companyName" className="text-sm font-medium">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              autoComplete="off"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
              value={formData.companyName || ""}
              onChange={handleCompanyNameChange}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {suggestions.map((company) => (
                  <div
                    key={company.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectCompany(company)}
                  >
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-gray-500">Code: {company.code}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="companyCode" className="text-sm font-medium">
              Company Code
            </label>
            <input
              id="companyCode"
              type="text"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company code"
              value={formData.companyCode || ""}
              onChange={handleCompanyCodeChange}
            />
          </div>
        </div>
      </div>

      {/* Payor Information Section - Conditionally Rendered */}
      {/* Payor 1 Information Section */}
      {showPayorSection && (
        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-lg font-semibold">Payor 1 Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label htmlFor="payorName1" className="text-sm font-medium">
                Payor Name
              </label>
              <input
                id="payorName1"
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor name"
                value={formData.payorName1 || ""}
                onChange={(e) => handlePayorNameChange(e, 1)}
              />
              {showPayorSuggestions1 && payorSuggestions1.length > 0 && (
                <div
                  ref={payorSuggestionsRef1}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {payorSuggestions1.map((payor) => (
                    <div
                      key={payor.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPayor(payor, 1)}
                    >
                      <div className="font-medium">{payor.name}</div>
                      <div className="text-sm text-gray-500">Code: {payor.code}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="payorCode1" className="text-sm font-medium">
                Payor Code
              </label>
              <input
                id="payorCode1"
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor code"
                value={formData.payorCode1 || ""}
                onChange={(e) => handlePayorCodeChange(e, 1)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="payorType1" className="text-sm font-medium">
                Payor Type
              </label>
              <input
                id="payorType1"
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor type"
                value={formData.payorType1 || ""}
                onChange={(e) => handlePayorTypeChange(e, 1)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payor 2 Information Section */}
      {showPayorSection && (
        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-lg font-semibold">Payor 2 Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label htmlFor="payorName2" className="text-sm font-medium">
                Payor Name
              </label>
              <input
                id="payorName2"
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor name"
                value={formData.payorName2 || ""}
                onChange={(e) => handlePayorNameChange(e, 2)}
              />
              {showPayorSuggestions2 && payorSuggestions2.length > 0 && (
                <div
                  ref={payorSuggestionsRef2}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {payorSuggestions2.map((payor) => (
                    <div
                      key={payor.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPayor(payor, 2)}
                    >
                      <div className="font-medium">{payor.name}</div>
                      <div className="text-sm text-gray-500">Code: {payor.code}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="payorCode2" className="text-sm font-medium">
                Payor Code
              </label>
              <input
                id="payorCode2"
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor code"
                value={formData.payorCode2 || ""}
                onChange={(e) => handlePayorCodeChange(e, 2)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="payorType2" className="text-sm font-medium">
                Payor Type
              </label>
              <input
                id="payorType2"
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor type"
                value={formData.payorType2 || ""}
                onChange={(e) => handlePayorTypeChange(e, 2)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4 mt-6 border-t">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}
