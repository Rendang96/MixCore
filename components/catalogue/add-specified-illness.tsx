"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X, Plus } from "lucide-react"
import { specifiedIllnessStorage } from "@/lib/catalogue/specified-illness-storage"
import { getNextItemId, addItem } from "@/lib/catalogue/shared-catalogue-item-storage"

type AddSpecifiedIllnessProps = {
  onIllnessAdded: () => void
}

export function AddSpecifiedIllness({ onIllnessAdded }: AddSpecifiedIllnessProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    itemId: getNextItemId(),
    catalogId: "",
    title: "",
    description: "",
    waitingPeriodMonths: "",
    isCoveredAfterWaiting: false,
    coverageImpact: "covered after waiting",
    isExcludable: false,
    ageRestriction: "",
    remarks: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const catalogOptions = [
    { value: "KPJ Catalogue", label: "KPJ Catalogue" },
    { value: "Prudential Standard Catalogue", label: "Prudential Standard Catalogue" },
    { value: "Allianz Medical Catalogue", label: "Allianz Medical Catalogue" },
    { value: "Great Eastern Catalogue", label: "Great Eastern Catalogue" },
  ]

  const coverageOptions = [
    { value: "covered after waiting", label: "Covered After Waiting" },
    { value: "conditional", label: "Conditional" },
    { value: "excluded", label: "Excluded" },
  ]

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.itemId) newErrors.itemId = "Item ID is required"
    if (!formData.catalogId) newErrors.catalogId = "Catalog is required"
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.waitingPeriodMonths) newErrors.waitingPeriodMonths = "Waiting period is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    addItem({
      itemId: formData.itemId,
      name: formData.title,
      description: formData.description,
      type: "specified-illness",
      catalogue: formData.catalogId,
    })

    specifiedIllnessStorage.add({
      specifiedIllnessId: formData.itemId,
      name: formData.title,
      description: formData.description,
      catalogue: formData.catalogId,
      waitingPeriodMonths: Number.parseInt(formData.waitingPeriodMonths),
      isCoveredAfterWaiting: formData.isCoveredAfterWaiting,
      coverageImpact: formData.coverageImpact,
      isExcludable: formData.isExcludable,
      ageRestriction: formData.ageRestriction,
      remarks: formData.remarks,
    })

    setFormData({
      itemId: getNextItemId(),
      catalogId: "",
      title: "",
      description: "",
      waitingPeriodMonths: "",
      isCoveredAfterWaiting: false,
      coverageImpact: "covered after waiting",
      isExcludable: false,
      ageRestriction: "",
      remarks: "",
    })
    setOpen(false)
    onIllnessAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Specified Illness
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Specified Illness</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemId" className="font-medium">
                Item ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="itemId"
                placeholder="e.g., ITEM001"
                value={formData.itemId}
                onChange={(e) => handleChange("itemId", e.target.value)}
                className={errors.itemId ? "border-red-500" : ""}
                disabled
              />
              {errors.itemId && <p className="text-xs text-red-500">{errors.itemId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="catalogId" className="font-medium">
                Catalog <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.catalogId} onValueChange={(value) => handleChange("catalogId", value)}>
                <SelectTrigger className={errors.catalogId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select catalog" />
                </SelectTrigger>
                <SelectContent>
                  {catalogOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.catalogId && <p className="text-xs text-red-500">{errors.catalogId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium">
              Illness Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Cataract, Hernia"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed explanation of the illness"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`min-h-[80px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="waitingPeriodMonths" className="font-medium">
                Waiting Period (months) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="waitingPeriodMonths"
                type="number"
                placeholder="e.g., 4 (for 120 days)"
                value={formData.waitingPeriodMonths}
                onChange={(e) => handleChange("waitingPeriodMonths", e.target.value)}
                className={errors.waitingPeriodMonths ? "border-red-500" : ""}
              />
              {errors.waitingPeriodMonths && <p className="text-xs text-red-500">{errors.waitingPeriodMonths}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageRestriction" className="font-medium">
                Age Restriction (optional)
              </Label>
              <Input
                id="ageRestriction"
                placeholder="e.g., Above 50 years"
                value={formData.ageRestriction}
                onChange={(e) => handleChange("ageRestriction", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coverageImpact" className="font-medium">
                Coverage Impact
              </Label>
              <Select value={formData.coverageImpact} onValueChange={(value) => handleChange("coverageImpact", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {coverageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCoveredAfterWaiting"
                checked={formData.isCoveredAfterWaiting}
                onCheckedChange={(checked) => handleChange("isCoveredAfterWaiting", checked === true)}
              />
              <Label htmlFor="isCoveredAfterWaiting" className="font-medium">
                Covered after waiting period
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExcludable"
                checked={formData.isExcludable}
                onCheckedChange={(checked) => handleChange("isExcludable", checked === true)}
              />
              <Label htmlFor="isExcludable" className="font-medium">
                Can be excluded by underwriting
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks" className="font-medium">
              Remarks
            </Label>
            <Textarea
              id="remarks"
              placeholder="Underwriting notes or additional explanation"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Specified Illness
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
