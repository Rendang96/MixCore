"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Trash2 } from "lucide-react"
import { updateCatalogue, type Catalogue, type CatalogueItem } from "@/lib/catalogue/catalogue-storage"

interface EditCatalogueProps {
  catalogue: Catalogue
  onClose: () => void
}

export function EditCatalogue({ catalogue, onClose }: EditCatalogueProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    category: "medical",
    type: "benefit",
    status: "draft",
  })
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [newItem, setNewItem] = useState({
    code: "",
    name: "",
    description: "",
    type: "benefit",
  })

  // Initialize form data when catalogue prop changes
  useEffect(() => {
    if (catalogue) {
      console.log("Initializing form with catalogue:", catalogue)
      setFormData({
        code: catalogue.code || catalogue.id || "",
        name: catalogue.name || "",
        description: catalogue.description || "",
        category: catalogue.category || "medical",
        type: catalogue.type || "benefit",
        status: catalogue.status || "draft",
      })
      setItems(catalogue.items || [])
    }
  }, [catalogue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code || !formData.name || !formData.category || !formData.type) {
      alert("Please fill in all required fields")
      return
    }

    const result = updateCatalogue(catalogue.id, {
      ...formData,
      items,
    })

    if (result) {
      console.log("Catalogue updated successfully")
      onClose()
    } else {
      alert("Failed to update catalogue")
    }
  }

  const handleAddItem = () => {
    if (!newItem.code || !newItem.name) {
      alert("Please fill in item code and name")
      return
    }

    const newItemWithId: CatalogueItem = {
      ...newItem,
      id: Date.now().toString(),
      waitingPeriod: "",
      coInsurance: "",
      deductible: "",
      coPayment: "",
    }

    setItems([...items, newItemWithId])
    setNewItem({ code: "", name: "", description: "", type: "benefit" })
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Catalogue</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <SelectValue />
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

          {/* Items Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Catalogue Items</h3>

            {/* Add New Item */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-3">Add New Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Item Code"
                  value={newItem.code}
                  onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                />
                <Input
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="benefit">Benefit</SelectItem>
                    <SelectItem value="exclusion">Exclusion</SelectItem>
                    <SelectItem value="pre-existing">Pre-existing</SelectItem>
                    <SelectItem value="specified">Specified</SelectItem>
                    <SelectItem value="congenital">Congenital</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <Input
                placeholder="Item Description (optional)"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="mt-3"
              />
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Items ({items.length})</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {item.code} - {item.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Type: {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        {item.description && ` | ${item.description}`}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Catalogue</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
