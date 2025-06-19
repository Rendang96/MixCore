"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "./product-search"
import { getProducts } from "@/lib/product/product-storage"
import { PayorStorage } from "@/lib/payor/payor-storage"
import { Search } from "lucide-react"
import { validateProductPayorRelationship } from "@/lib/product/product-validation"
import { getProductRelationshipStats } from "@/lib/product/product-relationship"

interface AddProductProps {
  onSave: (product: Product) => void
  onCancel: () => void
  initialProduct?: Product | null
}

export function AddProduct({ onSave, onCancel, initialProduct }: AddProductProps) {
  const [productName, setProductName] = useState("")
  const [productCode, setProductCode] = useState("")
  const [payorCode, setPayorCode] = useState("")
  const [productType, setProductType] = useState("")
  const [productStatus, setProductStatus] = useState("Active")
  const isEditing = !!initialProduct

  // Add states for payor search functionality
  const [payorName, setPayorName] = useState("")
  const [payorSuggestions, setPayorSuggestions] = useState<Array<{ code: string; name: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Initialize payor data when component mounts
  useEffect(() => {
    // Initialize dummy payor data
    PayorStorage.initializeDummyData()
  }, [])

  // Add useEffect to fetch payor suggestions when payor code changes
  useEffect(() => {
    if (payorCode) {
      const payors = PayorStorage.getAllPayors()

      // Filter payors based on code or name matching the input
      const filtered = payors
        .filter(
          (p) =>
            p.code.toLowerCase().includes(payorCode.toLowerCase()) ||
            p.name.toLowerCase().includes(payorCode.toLowerCase()),
        )
        .map((p) => ({ code: p.code, name: p.name }))

      setPayorSuggestions(filtered)
      setShowSuggestions(filtered.length > 0 && payorCode.length > 0)

      // Find exact match for payor name
      const exactMatch = payors.find((p) => p.code === payorCode)
      setPayorName(exactMatch?.name || "")
    } else {
      setPayorName("")
      setPayorSuggestions([])
      setShowSuggestions(false)
    }
  }, [payorCode])

  // Generate product code when component mounts or product name changes
  useEffect(() => {
    if (!isEditing && productName) {
      // Generate code based on product name (first 3 letters) + random number
      const prefix = productName.substring(0, 3).toUpperCase()
      const randomNum = Math.floor(1000 + Math.random() * 9000) // 4-digit number

      // Check if code already exists
      const existingProducts = getProducts()
      let newCode = `${prefix}-${randomNum}`
      let counter = 1

      while (existingProducts.some((p) => p.code === newCode)) {
        newCode = `${prefix}-${randomNum}-${counter}`
        counter++
      }

      setProductCode(newCode)
    }
  }, [productName, isEditing])

  // Initialize form with product data if editing
  useEffect(() => {
    if (initialProduct) {
      setProductName(initialProduct.name || "")
      setProductCode(initialProduct.code || "")
      setPayorCode(initialProduct.payorCode || "")
      setProductType(initialProduct.type || "")
      setProductStatus(initialProduct.status || "Active")
    }
  }, [initialProduct])

  // Handle payor suggestion selection
  const handlePayorSuggestionSelect = (suggestion: { code: string; name: string }) => {
    setPayorCode(suggestion.code)
    setPayorName(suggestion.name)
    setShowSuggestions(false)
  }

  // Handle payor code input blur
  const handlePayorCodeBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => setShowSuggestions(false), 200)
  }

  // Update the handleSave function to include payor in the product object
  const handleSave = () => {
    // Validate form
    if (!productName.trim()) {
      alert("Product name is required")
      return
    }

    if (!productCode.trim()) {
      alert("Product code is required")
      return
    }

    if (!payorCode.trim()) {
      alert("Payor selection is required")
      return
    }

    // Create a new product with the form data
    const product: Product = {
      id: initialProduct?.id || Date.now().toString(),
      name: productName,
      code: productCode,
      payorCode: payorCode,
      payor: payorName,
      type: productType || "Individual",
      status: productStatus || "Active",
    }

    // Validate product-payor relationship
    const validation = validateProductPayorRelationship(product)
    if (!validation.isValid) {
      alert(validation.error)
      return
    }

    // Check if editing and has policies
    if (initialProduct) {
      const relationshipStats = getProductRelationshipStats(initialProduct.id)
      if (relationshipStats.policyCount > 0) {
        const confirmUpdate = confirm(
          `This product has ${relationshipStats.policyCount} associated policy/policies. ` +
            "Updating product information may affect related policies. Do you want to continue?",
        )
        if (!confirmUpdate) return
      }
    }

    // Pass the product to the parent component
    onSave(product)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{isEditing ? "Edit Product" : "Create New Product"}</h2>
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Product Information</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="product-name" className="text-sm font-medium text-slate-700">
              Product Name
            </label>
            <Input
              id="product-name"
              placeholder="Enter Product Name"
              className="w-full"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="product-code" className="text-sm font-medium text-slate-700">
              Product Code
            </label>
            <Input
              id="product-code"
              placeholder="Auto-generated after entering name"
              className="w-full"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              readOnly={!isEditing}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2 relative">
            <label htmlFor="payor-code" className="text-sm font-medium text-slate-700">
              Payor Code
            </label>
            <div className="relative">
              <Input
                id="payor-code"
                placeholder="Enter Payor Code"
                className="w-full pl-10"
                value={payorCode}
                onChange={(e) => setPayorCode(e.target.value)}
                onFocus={() => payorCode && setShowSuggestions(payorSuggestions.length > 0)}
                onBlur={handlePayorCodeBlur}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {payorSuggestions.length > 0 ? (
                  payorSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onMouseDown={() => handlePayorSuggestionSelect(suggestion)}
                    >
                      <div className="font-medium text-sm">{suggestion.code}</div>
                      <div className="text-xs text-gray-600">{suggestion.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No payors found</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="payor-name" className="text-sm font-medium text-slate-700">
              Payor Name
            </label>
            <Input
              id="payor-name"
              placeholder="Payor name will appear here"
              className="w-full"
              value={payorName}
              readOnly
              disabled
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="product-type" className="text-sm font-medium text-slate-700">
              Product Type
            </label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger id="product-type" className="w-full">
                <SelectValue placeholder="Please select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="ASO">ASO</SelectItem>
                <SelectItem value="GHS">GHS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="product-status" className="text-sm font-medium text-slate-700">
              Status
            </label>
            <Select value={productStatus} onValueChange={setProductStatus}>
              <SelectTrigger id="product-status" className="w-full">
                <SelectValue placeholder="Please select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
            Save
          </Button>
          <Button variant="destructive" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
