"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "./product-search"

interface AddProductProps {
  onSave: (product: Product) => void
  onCancel: () => void
  initialProduct?: Product | null
}

export function AddProduct({ onSave, onCancel, initialProduct }: AddProductProps) {
  const [productName, setProductName] = useState("")
  const [productCode, setProductCode] = useState("")
  const [productType, setProductType] = useState("")
  const [productStatus, setProductStatus] = useState("Active")
  const isEditing = !!initialProduct

  // Initialize form with product data if editing
  useEffect(() => {
    if (initialProduct) {
      setProductName(initialProduct.name || "")
      setProductCode(initialProduct.code || "")
      setProductType(initialProduct.type || "")
      setProductStatus(initialProduct.status || "Active")
    }
  }, [initialProduct])

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

    // Create a new product with the form data
    const product: Product = {
      id: initialProduct?.id || Date.now().toString(), // Generate a unique ID or use existing
      name: productName,
      code: productCode,
      type: productType || "Individual", // Default value if not selected
      status: productStatus || "Active",
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
              placeholder="Enter Plan Product Code"
              className="w-full"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
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
