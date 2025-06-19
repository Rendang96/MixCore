"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { getNextItemId, addItem } from "@/lib/catalogue/shared-catalogue-item-storage"

type AddPreExistingConditionProps = {
  onClose: () => void
  onSave: (condition: PreExistingConditionForm) => void
}

type PreExistingConditionForm = {
  itemId: string
  catalogId: string
  title: string
  description: string
  icdCode: string
  diagnosisRequirement: string
  isDefaultExcluded: boolean
  isConditional: boolean
  waitingPeriodMonths: string
  coverageImpact: string
  isExcludable: boolean
  remarks: string
}

export function AddPreExistingCondition({ onClose, onSave }: AddPreExistingConditionProps) {
  const [formData, setFormData] = useState<PreExistingConditionForm>({
    itemId: getNextItemId(),
    catalogId: "",
    title: "",
    description: "",
    icdCode: "",
    diagnosisRequirement: "",
    isDefaultExcluded: false,
    isConditional: false,
    waitingPeriodMonths: "",
    coverageImpact: "excluded",
    isExcludable: false,
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
    if (!formData.icdCode.trim()) {
      newErrors.icdCode = "ICD Code is required"
    }
    if (!formData.diagnosisRequirement.trim()) {
      newErrors.diagnosisRequirement = "Diagnosis requirement is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      addItem({
        itemId: formData.itemId,
        name: formData.title,
        description: formData.description,
        type: "pre-existing",
        catalogue: formData.catalogId,
      })

      onSave(formData)
      onClose()
    }
  }

  const handleInputChange = (field: keyof PreExistingConditionForm, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Pre-Existing Condition</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemId">Item ID *</Label>
              <Input
                id="itemId"
                value={formData.itemId}
                onChange={(e) => handleInputChange("itemId", e.target.value)}
                placeholder="e.g., ITEM001"
                className={errors.itemId ? "border-red-500" : ""}
                disabled
              />
              {errors.itemId && <p className="text-red-500 text-sm mt-1">{errors.itemId}</p>}
            </div>

            <div>
              <Label htmlFor="catalogId">Catalog ID *</Label>
              <Select value={formData.catalogId} onValueChange={(value) => handleInputChange("catalogId", value)}>
                <SelectTrigger className={errors.catalogId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select catalog" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KPJ_CAT_001">KPJ Catalogue</SelectItem>
                  <SelectItem value="PRUD_STD_001">Prudential Standard Catalogue</SelectItem>
                  <SelectItem value="ALLIANZ_001">Allianz Catalogue</SelectItem>
                  <SelectItem value="GREAT_EAST_001">Great Eastern Catalogue</SelectItem>
                </SelectContent>
              </Select>
              {errors.catalogId && <p className="text-red-500 text-sm mt-1">{errors.catalogId}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Diabetes Mellitus"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description">Clinical Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed clinical description of the condition"
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icdCode">ICD Code *</Label>
              <Input
                id="icdCode"
                value={formData.icdCode}
                onChange={(e) => handleInputChange("icdCode", e.target.value)}
                placeholder="e.g., E10, E11"
                className={errors.icdCode ? "border-red-500" : ""}
              />
              {errors.icdCode && <p className="text-red-500 text-sm mt-1">{errors.icdCode}</p>}
            </div>

            <div>
              <Label htmlFor="waitingPeriodMonths">Waiting Period (Months)</Label>
              <Input
                id="waitingPeriodMonths"
                type="number"
                value={formData.waitingPeriodMonths}
                onChange={(e) => handleInputChange("waitingPeriodMonths", e.target.value)}
                placeholder="e.g., 12"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="diagnosisRequirement">Diagnosis Requirement *</Label>
            <Textarea
              id="diagnosisRequirement"
              value={formData.diagnosisRequirement}
              onChange={(e) => handleInputChange("diagnosisRequirement", e.target.value)}
              placeholder="Required evidence to classify as pre-existing condition"
              rows={2}
              className={errors.diagnosisRequirement ? "border-red-500" : ""}
            />
            {errors.diagnosisRequirement && <p className="text-red-500 text-sm mt-1">{errors.diagnosisRequirement}</p>}
          </div>

          <div>
            <Label htmlFor="coverageImpact">Coverage Impact</Label>
            <Select
              value={formData.coverageImpact}
              onValueChange={(value) => handleInputChange("coverageImpact", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excluded">Excluded</SelectItem>
                <SelectItem value="conditional">Conditional</SelectItem>
                <SelectItem value="included_with_loading">Included with Loading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefaultExcluded"
                checked={formData.isDefaultExcluded}
                onCheckedChange={(checked) => handleInputChange("isDefaultExcluded", checked as boolean)}
              />
              <Label htmlFor="isDefaultExcluded" className="text-sm font-normal">
                Is this condition excluded by default?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isConditional"
                checked={formData.isConditional}
                onCheckedChange={(checked) => handleInputChange("isConditional", checked as boolean)}
              />
              <Label htmlFor="isConditional" className="text-sm font-normal">
                Is it covered under certain conditions (e.g., after review)?
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExcludable"
                checked={formData.isExcludable}
                onCheckedChange={(checked) => handleInputChange("isExcludable", checked as boolean)}
              />
              <Label htmlFor="isExcludable" className="text-sm font-normal">
                Can be waived by underwriting?
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              placeholder="Notes from medical or underwriting team"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Condition
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
