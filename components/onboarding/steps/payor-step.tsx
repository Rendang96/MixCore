"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle } from "lucide-react"
import { PayorStorage, type Payor as StoredPayor } from "@/lib/payor/payor-storage"
import { initializeDummyPayors } from "@/lib/payor/dummy-data"
import { useCorporateClientForm, type PayorEntry } from "@/contexts/corporate-client-form-context"

interface PayorStepProps {
  onNext: () => void
  onPrevious: () => void
  onCancel: () => void
}

export function PayorStep({ onNext, onPrevious, onCancel }: PayorStepProps) {
  const { formData, updateFormData } = useCorporateClientForm()
  const [payorSuggestions, setPayorSuggestions] = useState<StoredPayor[]>([])
  const [showPayorSuggestions, setShowPayorSuggestions] = useState<{ [key: string]: boolean }>({})
  const payorSuggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeDummyPayors()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (payorSuggestionsRef.current && !payorSuggestionsRef.current.contains(event.target as Node)) {
        setShowPayorSuggestions({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const searchPayors = (query: string, field: "name" | "code", entryId: string) => {
    if (query.length >= 2) {
      const allPayors = PayorStorage.getAllPayors()
      const filteredPayors = allPayors.filter((payor) =>
        field === "name"
          ? payor.name.toLowerCase().includes(query.toLowerCase())
          : payor.code.toLowerCase().includes(query.toLowerCase()),
      )
      setPayorSuggestions(filteredPayors)
      setShowPayorSuggestions((prev) => ({ ...prev, [entryId]: true }))
    } else {
      setPayorSuggestions([])
      setShowPayorSuggestions((prev) => ({ ...prev, [entryId]: false }))
    }
  }

  const handleSelectPayor = (payor: StoredPayor, entryId: string) => {
    const updatedEntries = formData.payorEntries.map((entry) =>
      entry.id === entryId ? { ...entry, name: payor.name, code: payor.code } : entry,
    )
    updateFormData({
      payorEntries: updatedEntries,
      selectedFromLookup: { ...formData.selectedFromLookup, [entryId]: true },
    })
    setShowPayorSuggestions((prev) => ({ ...prev, [entryId]: false }))
  }

  const handlePayorChange = (id: string, field: "name" | "code", value: string) => {
    const updatedEntries = formData.payorEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry,
    )
    updateFormData({ payorEntries: updatedEntries })

    if (field === "name") {
      searchPayors(value, field, id)
    }
  }

  const handlePayorTypeChange = (id: string, value: "insurer" | "self-funded") => {
    const updatedEntries = formData.payorEntries.map((entry) =>
      entry.id === id ? { ...entry, payorType: value } : entry,
    )
    updateFormData({ payorEntries: updatedEntries })
  }

  const addPayorEntry = () => {
    const newId = `payor-${formData.payorEntries.length + 1}`
    const newEntry: PayorEntry = { id: newId, name: "", code: "", payorType: "insurer" }
    updateFormData({ payorEntries: [...formData.payorEntries, newEntry] })
  }

  const removePayorEntry = (id: string) => {
    if (formData.payorEntries.length > 1) {
      const updatedEntries = formData.payorEntries.filter((entry) => entry.id !== id)
      updateFormData({ payorEntries: updatedEntries })
    }
  }

  const handleSave = () => {
    console.log("Saving payor data:", formData.payorEntries)
    onNext()
  }

  const handleCancel = () => {
    updateFormData({
      payorEntries: [{ id: "payor-1", name: "", code: "", payorType: "insurer" }],
    })
    onCancel()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Payor Information</h2>

      {formData.payorEntries.map((entry, index) => (
        <div key={entry.id} className="space-y-4">
          {index > 0 && <div className="border-t pt-4"></div>}
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Payor {index + 1}</h3>
            <div className="flex space-x-2">
              {formData.payorEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePayorEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove payor"
                >
                  <MinusCircle className="h-5 w-5" />
                </button>
              )}
              {index === formData.payorEntries.length - 1 && (
                <button
                  type="button"
                  onClick={addPayorEntry}
                  className="text-green-500 hover:text-green-700"
                  aria-label="Add payor"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label htmlFor={`payorName-${entry.id}`} className="text-sm font-medium">
                Payor Name
              </label>
              <input
                id={`payorName-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor name"
                value={entry.name || ""}
                onChange={(e) => handlePayorChange(entry.id, "name", e.target.value)}
              />
              {showPayorSuggestions[entry.id] && payorSuggestions.length > 0 && (
                <div
                  ref={payorSuggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {payorSuggestions.map((payor) => (
                    <div
                      key={payor.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPayor(payor, entry.id)}
                    >
                      <div className="font-medium">{payor.name}</div>
                      <div className="text-sm text-gray-500">Code: {payor.code}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2 relative">
              <label htmlFor={`payorCode-${entry.id}`} className="text-sm font-medium">
                Payor Code
              </label>
              <input
                id={`payorCode-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor code"
                value={entry.code || ""}
                onChange={(e) => handlePayorChange(entry.id, "code", e.target.value)}
                readOnly={formData.selectedFromLookup[entry.id]}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Payor Type</div>
            <RadioGroup
              value={entry.payorType}
              onValueChange={(value) => handlePayorTypeChange(entry.id, value as "insurer" | "self-funded")}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="insurer" id={`insurer-${entry.id}`} />
                <Label htmlFor={`insurer-${entry.id}`}>Insurer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self-funded" id={`self-funded-${entry.id}`} />
                <Label htmlFor={`self-funded-${entry.id}`}>Self-funded/Non-Insurer</Label>
              </div>
            </RadioGroup>
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
