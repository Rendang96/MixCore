"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { generalExclusionStorage, type GeneralExclusion } from "@/lib/catalogue/general-exclusion-storage"
// Update the imports to include the shared catalogue item storage
import { getNextItemId, addItem } from "@/lib/catalogue/shared-catalogue-item-storage"

interface AddGeneralExclusionProps {
  onExclusionAdded: (exclusion: GeneralExclusion) => void
}

export function AddGeneralExclusion({ onExclusionAdded }: AddGeneralExclusionProps) {
  const [open, setOpen] = useState(false)
  // Update the component to use the shared item ID system
  // Modify the useState initialization to include itemId from shared storage
  const [formData, setFormData] = useState({
    itemId: getNextItemId(), // Get the next available item ID
    catalogId: "",
    title: "",
    description: "",
    coverageImpact: "",
    isOverridable: false,
    appliesTo: "",
    isVisibleToMember: false,
    remarks: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.itemId.trim()) newErrors.itemId = "Item ID is required"
    if (!formData.catalogId.trim()) newErrors.catalogId = "Catalog ID is required"
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.coverageImpact) newErrors.coverageImpact = "Coverage Impact is required"
    if (!formData.appliesTo) newErrors.appliesTo = "Applies To is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Modify the handleSubmit function to register the item ID in the shared storage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // Register the item ID in the shared storage
      addItem({
        itemId: formData.itemId,
        name: formData.title,
        description: formData.description,
        type: "general-exclusion",
        catalogue: formData.catalogId,
      })

      const newExclusion = generalExclusionStorage.add({
        itemId: formData.itemId,
        catalogId: formData.catalogId,
        title: formData.title,
        description: formData.description,
        coverageImpact: formData.coverageImpact,
        isOverridable: formData.isOverridable,
        appliesTo: formData.appliesTo,
        isVisibleToMember: formData.isVisibleToMember,
        remarks: formData.remarks,
      })

      onExclusionAdded(newExclusion)
      setOpen(false)
      setFormData({
        itemId: getNextItemId(), // Get a new next available item ID
        catalogId: "",
        title: "",
        description: "",
        coverageImpact: "",
        isOverridable: false,
        appliesTo: "",
        isVisibleToMember: false,
        remarks: "",
      })
      setErrors({})
    } catch (error) {
      console.error("Error adding general exclusion:", error)
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Exclusion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New General Exclusion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Item ID */}
            <div className="space-y-2">
              <Label htmlFor="itemId">
                Item ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="itemId"
                placeholder="e.g., GE001"
                value={formData.itemId}
                onChange={(e) => handleInputChange("itemId", e.target.value)}
                className={errors.itemId ? "border-red-500" : ""}
              />
              {errors.itemId && <p className="text-sm text-red-500">{errors.itemId}</p>}
            </div>

            {/* Catalog ID */}
            <div className="space-y-2">
              <Label htmlFor="catalogId">
                Catalog ID <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.catalogId} onValueChange={(value) => handleInputChange("catalogId", value)}>
                <SelectTrigger className={errors.catalogId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select catalog" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KPJ_CAT_001">KPJ Catalogue</SelectItem>
                  <SelectItem value="PRU_CAT_001">Prudential Standard Catalogue</SelectItem>
                  <SelectItem value="ALL_CAT_001">Allianz Catalogue</SelectItem>
                  <SelectItem value="GE_CAT_001">Great Eastern Catalogue</SelectItem>
                </SelectContent>
              </Select>
              {errors.catalogId && <p className="text-sm text-red-500">{errors.catalogId}</p>}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Exclusion Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Self-inflicted injuries"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Full Exclusion Clause <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter the full exclusion clause or legal description..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Coverage Impact */}
            <div className="space-y-2">
              <Label htmlFor="coverageImpact">
                Coverage Impact <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.coverageImpact}
                onValueChange={(value) => handleInputChange("coverageImpact", value)}
              >
                <SelectTrigger className={errors.coverageImpact ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select coverage impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always_excluded">Always Excluded</SelectItem>
                  <SelectItem value="legally_mandated">Legally Mandated Exclusion</SelectItem>
                </SelectContent>
              </Select>
              {errors.coverageImpact && <p className="text-sm text-red-500">{errors.coverageImpact}</p>}
            </div>

            {/* Applies To */}
            <div className="space-y-2">
              <Label htmlFor="appliesTo">
                Applies To <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.appliesTo} onValueChange={(value) => handleInputChange("appliesTo", value)}>
                <SelectTrigger className={errors.appliesTo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select who this applies to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="main_insured">Main Insured</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="dependent">Dependent</SelectItem>
                </SelectContent>
              </Select>
              {errors.appliesTo && <p className="text-sm text-red-500">{errors.appliesTo}</p>}
            </div>
          </div>

          {/* Boolean Fields */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOverridable"
                checked={formData.isOverridable}
                onCheckedChange={(checked) => handleInputChange("isOverridable", checked as boolean)}
              />
              <Label htmlFor="isOverridable" className="text-sm font-normal">
                Can be overridden by special rider
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVisibleToMember"
                checked={formData.isVisibleToMember}
                onCheckedChange={(checked) => handleInputChange("isVisibleToMember", checked as boolean)}
              />
              <Label htmlFor="isVisibleToMember" className="text-sm font-normal">
                Show in member portal (otherwise back-office only)
              </Label>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Compliance or Legal Notes</Label>
            <Textarea
              id="remarks"
              placeholder="Enter any compliance or legal notes..."
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add General Exclusion</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
