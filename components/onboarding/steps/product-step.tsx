"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MinusCircle } from "lucide-react"
import { getProducts, type Product as StoredProduct } from "@/lib/product/product-storage"
import { useCorporateClientForm, type ProductEntry } from "@/contexts/corporate-client-form-context"

interface ProductStepProps {
  onNext: () => void
  onPrevious: () => void
  onCancel: () => void
}

export function ProductStep({ onNext, onPrevious, onCancel }: ProductStepProps) {
  const { formData, updateFormData } = useCorporateClientForm()
  const [productSuggestions, setProductSuggestions] = useState<StoredProduct[]>([])
  const [showProductSuggestions, setShowProductSuggestions] = useState<{ [key: string]: boolean }>({})
  const productSuggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getProducts() // Initialize products
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productSuggestionsRef.current && !productSuggestionsRef.current.contains(event.target as Node)) {
        setShowProductSuggestions({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const searchProducts = (query: string, field: "name" | "code", entryId: string) => {
    if (query.length >= 2) {
      const allProducts = getProducts()
      const filteredProducts = allProducts.filter((product) =>
        field === "name"
          ? product.name.toLowerCase().includes(query.toLowerCase())
          : product.code.toLowerCase().includes(query.toLowerCase()),
      )
      setProductSuggestions(filteredProducts)
      setShowProductSuggestions((prev) => ({ ...prev, [entryId]: true }))
    } else {
      setProductSuggestions([])
      setShowProductSuggestions((prev) => ({ ...prev, [entryId]: false }))
    }
  }

  const handleSelectProduct = (product: StoredProduct, entryId: string) => {
    const updatedEntries = formData.productEntries.map((entry) =>
      entry.id === entryId ? { ...entry, name: product.name, code: product.code } : entry,
    )
    updateFormData({
      productEntries: updatedEntries,
      selectedProductFromLookup: { ...formData.selectedProductFromLookup, [entryId]: true },
    })
    setShowProductSuggestions((prev) => ({ ...prev, [entryId]: false }))
  }

  const handleProductChange = (id: string, field: "name" | "code", value: string) => {
    const updatedEntries = formData.productEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry,
    )
    updateFormData({ productEntries: updatedEntries })

    if (field === "name") {
      searchProducts(value, field, id)
    }
  }

  const handleProductPayorChange = (id: string, field: "payorName" | "payorCode", value: string) => {
    const updatedEntries = formData.productEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry,
    )
    updateFormData({ productEntries: updatedEntries })
  }

  const handleProductPayorSelect = (id: string, payorId: string) => {
    const selectedPayor = formData.payorEntries.find((payor) => payor.id === payorId)
    if (selectedPayor) {
      const updatedEntries = formData.productEntries.map((entry) =>
        entry.id === id ? { ...entry, payorName: selectedPayor.name, payorCode: selectedPayor.code } : entry,
      )
      updateFormData({ productEntries: updatedEntries })
    }
  }

  const addProductEntry = () => {
    const newId = `product-${formData.productEntries.length + 1}`
    const newEntry: ProductEntry = { id: newId, name: "", code: "", payorName: "", payorCode: "" }
    updateFormData({ productEntries: [...formData.productEntries, newEntry] })
  }

  const removeProductEntry = (id: string) => {
    if (formData.productEntries.length > 1) {
      const updatedEntries = formData.productEntries.filter((entry) => entry.id !== id)
      updateFormData({ productEntries: updatedEntries })
    }
  }

  const handleSave = () => {
    console.log("Saving product data:", formData.productEntries)
    onNext()
  }

  const handleCancel = () => {
    updateFormData({
      productEntries: [{ id: "product-1", name: "", code: "", payorName: "", payorCode: "" }],
    })
    onCancel()
  }

  const hasValidPayorEntries =
    formData.payorEntries.length > 0 && formData.payorEntries.some((payor) => payor.name.trim() !== "")

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Product Information</h2>

      {formData.productEntries.map((entry, index) => (
        <div key={entry.id} className="space-y-4">
          {index > 0 && <div className="border-t pt-4"></div>}
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Product {index + 1}</h3>
            <div className="flex space-x-2">
              {formData.productEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProductEntry(entry.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove product"
                >
                  <MinusCircle className="h-5 w-5" />
                </button>
              )}
              {index === formData.productEntries.length - 1 && (
                <button
                  type="button"
                  onClick={addProductEntry}
                  className="text-green-500 hover:text-green-700"
                  aria-label="Add product"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label htmlFor={`productName-${entry.id}`} className="text-sm font-medium">
                Product Name
              </label>
              <input
                id={`productName-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
                value={entry.name || ""}
                onChange={(e) => handleProductChange(entry.id, "name", e.target.value)}
              />
              {showProductSuggestions[entry.id] && productSuggestions.length > 0 && (
                <div
                  ref={productSuggestionsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {productSuggestions.map((product) => (
                    <div
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectProduct(product, entry.id)}
                    >
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">Code: {product.code}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor={`productCode-${entry.id}`} className="text-sm font-medium">
                Product Code
              </label>
              <input
                id={`productCode-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product code"
                value={entry.code || ""}
                onChange={(e) => handleProductChange(entry.id, "code", e.target.value)}
                readOnly={formData.selectedProductFromLookup[entry.id]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label htmlFor={`payorName-${entry.id}`} className="text-sm font-medium">
                Payor Name
              </label>
              {hasValidPayorEntries ? (
                <Select
                  value={entry.payorName ? formData.payorEntries.find((p) => p.name === entry.payorName)?.id : ""}
                  onValueChange={(value) => handleProductPayorSelect(entry.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payor" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.payorEntries
                      .filter((p) => p.name.trim() !== "")
                      .map((payor) => (
                        <SelectItem key={payor.id} value={payor.id}>
                          {payor.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <input
                  id={`payorName-${entry.id}`}
                  type="text"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter payor name"
                  value={entry.payorName || ""}
                  onChange={(e) => handleProductPayorChange(entry.id, "payorName", e.target.value)}
                />
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor={`payorCode-${entry.id}`} className="text-sm font-medium">
                Payor Code
              </label>
              <input
                id={`payorCode-${entry.id}`}
                type="text"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payor code"
                value={entry.payorCode || ""}
                onChange={(e) => handleProductPayorChange(entry.id, "payorCode", e.target.value)}
                readOnly={hasValidPayorEntries}
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
