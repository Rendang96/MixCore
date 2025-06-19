"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { congenitalConditionStorage, type CongenitalCondition } from "@/lib/catalogue/congenital-condition-storage"
// Update the imports to include the shared catalogue item storage
import { getNextItemId, addItem } from "@/lib/catalogue/shared-catalogue-item-storage"

interface AddCongenitalConditionProps {
  onConditionAdded: (condition: CongenitalCondition) => void
}

export function AddCongenitalCondition({ onConditionAdded }: AddCongenitalConditionProps) {
  const [open, setOpen] = useState(false)
  // Update the component to use the shared item ID system
  // Modify the useState initialization to include itemId from shared storage
  const [formData, setFormData] = useState({
    itemId: getNextItemId(), // Get the next available item ID
    catalogId: "",
    title: "",
    description: "",
    icdCode: "",
    isDefaultExcluded: false,
    isCoverableUnderChildRider: false,
    coverageImpact: "",
    isConditional: false,
    appliesTo: "",
    remarks: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.itemId.trim()) {
      newErrors.itemId = "Item ID is required"
    }
    if (!formData.catalogId.trim()) {
      newErrors.catalogId = "Catalog ID is required"
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.coverageImpact.trim()) {
      newErrors.coverageImpact = "Coverage Impact is required"
    }
    if (!formData.appliesTo.trim()) {
      newErrors.appliesTo = "Applies To is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Modify the handleSubmit function to register the item ID in the shared storage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // Register the item ID in the shared storage
      addItem({
        itemId: formData.itemId,
        name: formData.title,
        description: formData.description,
        type: "congenital-condition",
        catalogue: formData.catalogId,
      })

      const newCondition = congenitalConditionStorage.add({
        congenitalConditionId: formData.itemId,
        name: formData.title,
        description: formData.description,
        type: formData.coverageImpact,
        catalogue: formData.catalogId,
        icdCode: formData.icdCode,
        isDefaultExcluded: formData.isDefaultExcluded,
        isCoverableUnderChildRider: formData.isCoverableUnderChildRider,
        coverageImpact: formData.coverageImpact,
        isConditional: formData.isConditional,
        appliesTo: formData.appliesTo,
        remarks: formData.remarks,
      })

      onConditionAdded(newCondition)

      // Reset form
      setFormData({
        itemId: getNextItemId(), // Get a new next available item ID
        catalogId: "",
        title: "",
        description: "",
        icdCode: "",
        isDefaultExcluded: false,
        isCoverableUnderChildRider: false,
        coverageImpact: "",
        isConditional: false,
        appliesTo: "",
        remarks: "",
      })
      setErrors({})
      setOpen(false)
    } catch (error) {
      console.error("Error adding congenital condition:", error)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Condition
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Congenital Condition</DialogTitle>
          <DialogDescription>Enter the details for the new congenital condition.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemId">Item ID *</Label>
              <Input
                id="itemId"
                placeholder="e.g., CC001"
                value={formData.itemId}
                onChange={(e) => handleInputChange("itemId", e.target.value)}
                className={errors.itemId ? "border-red-500" : ""}
              />
              {errors.itemId && <p className="text-sm text-red-500">{errors.itemId}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catalogId">Catalog *</Label>
              <Select value={formData.catalogId} onValueChange={(value) => handleInputChange("catalogId", value)}>
                <SelectTrigger className={errors.catalogId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select catalog" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KPJ Catalogue">KPJ Catalogue</SelectItem>
                  <SelectItem value="Prudential Standard Catalogue">Prudential Standard Catalogue</SelectItem>
                  <SelectItem value="Allianz Catalogue">Allianz Catalogue</SelectItem>
                  <SelectItem value="Great Eastern Catalogue">Great Eastern Catalogue</SelectItem>
                </SelectContent>
              </Select>
              {errors.catalogId && <p className="text-sm text-red-500">{errors.catalogId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Condition Name *</Label>
            <Input
              id="title"
              placeholder="e.g., Cleft Lip, Heart Defect"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Clinical Description *</Label>
            <Textarea
              id="description"
              placeholder="Clinical definition or scope of the condition"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icdCode">ICD Code</Label>
            <Input
              id="icdCode"
              placeholder="e.g., Q20.0"
              value={formData.icdCode}
              onChange={(e) => handleInputChange("icdCode", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coverageImpact">Coverage Impact *</Label>
              <Select
                value={formData.coverageImpact}
                onValueChange={(value) => handleInputChange("coverageImpact", value)}
              >
                <SelectTrigger className={errors.coverageImpact ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select coverage impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excluded">Excluded</SelectItem>
                  <SelectItem value="covered with rider">Covered with Rider</SelectItem>
                  <SelectItem value="conditional">Conditional</SelectItem>
                </SelectContent>
              </Select>
              {errors.coverageImpact && <p className="text-sm text-red-500">{errors.coverageImpact}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="appliesTo">Applies To *</Label>
              <Select value={formData.appliesTo} onValueChange={(value) => handleInputChange("appliesTo", value)}>
                <SelectTrigger className={errors.appliesTo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select who this applies to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insured">Insured</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child only">Child Only</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
              {errors.appliesTo && <p className="text-sm text-red-500">{errors.appliesTo}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefaultExcluded"
                checked={formData.isDefaultExcluded}
                onCheckedChange={(checked) => handleInputChange("isDefaultExcluded", checked as boolean)}
              />
              <Label htmlFor="isDefaultExcluded">Excluded by default</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCoverableUnderChildRider"
                checked={formData.isCoverableUnderChildRider}
                onCheckedChange={(checked) => handleInputChange("isCoverableUnderChildRider", checked as boolean)}
              />
              <Label htmlFor="isCoverableUnderChildRider">Coverable under child rider</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isConditional"
                checked={formData.isConditional}
                onCheckedChange={(checked) => handleInputChange("isConditional", checked as boolean)}
              />
              <Label htmlFor="isConditional">Requires conditions (e.g., child survival period)</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Any age, plan-type, or provider restrictions"
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Condition
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
