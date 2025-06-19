"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { X, Trash2, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const billingGroups = [
  { id: "professional_fees", label: "Professional Fees" },
  { id: "facility_fees", label: "Facility Fees" },
  { id: "equipment_usage", label: "Equipment Usage" },
  { id: "supplies_materials", label: "Supplies & Materials" },
  { id: "diagnostic_tests", label: "Diagnostic Tests" },
  { id: "medications", label: "Medications" },
  { id: "administrative_fees", label: "Administrative Fees" },
  { id: "consultation_fees", label: "Consultation Fees" },
  { id: "procedure_fees", label: "Procedure Fees" },
  { id: "room_board", label: "Room & Board" },
  { id: "nursing_care", label: "Nursing Care" },
  { id: "anesthesia", label: "Anesthesia" },
  { id: "surgical_fees", label: "Surgical Fees" },
  { id: "imaging_fees", label: "Imaging Fees" },
  { id: "laboratory_fees", label: "Laboratory Fees" },
  { id: "therapy_fees", label: "Therapy Fees" },
  { id: "emergency_fees", label: "Emergency Fees" },
  { id: "ambulance_fees", label: "Ambulance Fees" },
  { id: "pharmacy_fees", label: "Pharmacy Fees" },
  { id: "optical_fees", label: "Optical Fees" },
]

interface LimitFormData {
  parentLimit: string
  name: string
  limitValue: number
  unit: string
  limitDuration: string
  applicableMemberRoles: string[]
  associatedServiceTypes: string[]
  associatedBillingGroups: string[]
  description: string
  limitType: "independent" | "shared"
}

interface AddTopLevelLimitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: LimitFormData) => void
  existingLimits?: Array<{ id: string; name: string }>
  editMode?: boolean
  initialData?: LimitFormData & { id?: string }
}

export function AddTopLevelLimitForm({
  open,
  onOpenChange,
  onSave,
  existingLimits = [],
  editMode = false,
  initialData,
}: AddTopLevelLimitFormProps) {
  const [formData, setFormData] = useState<LimitFormData>({
    parentLimit: initialData?.parentLimit || "none",
    name: initialData?.name || "",
    limitValue: initialData?.limitValue || 0,
    unit: initialData?.unit || "MYR",
    limitDuration: initialData?.limitDuration || "Per Year",
    applicableMemberRoles: initialData?.applicableMemberRoles || [],
    associatedServiceTypes: initialData?.associatedServiceTypes || [],
    associatedBillingGroups: initialData?.associatedBillingGroups || [],
    description: initialData?.description || "",
    limitType: initialData?.limitType || "independent",
  })

  useEffect(() => {
    if (initialData && editMode) {
      setFormData({
        parentLimit: initialData.parentLimit || "none",
        name: initialData.name || "",
        limitValue: initialData.limitValue || 0,
        unit: initialData.unit || "MYR",
        limitDuration: initialData.limitDuration || "Per Year",
        applicableMemberRoles: initialData.applicableMemberRoles || [],
        associatedServiceTypes: initialData.associatedServiceTypes || [],
        associatedBillingGroups: initialData.associatedBillingGroups || [],
        description: initialData.description || "",
        limitType: initialData.limitType || "independent",
      })
    }
  }, [initialData, editMode])

  const memberRoles = [
    { id: "employee", label: "Employee" },
    { id: "spouse", label: "Spouse" },
    { id: "child", label: "Child" },
    { id: "parents", label: "Parents" },
    { id: "policyholder", label: "Policyholder" },
  ]

  const serviceTypes = [
    { id: "gp", label: "GP - General Practitioner" },
    { id: "sp", label: "SP - Specialist" },
    { id: "oc", label: "OC - Optical" },
    { id: "dt", label: "DT - Dental" },
    { id: "ip", label: "IP - Inpatient" },
    { id: "hp", label: "HP - Hospitalization" },
    { id: "sg", label: "SG - Surgery" },
    { id: "mt", label: "MT - Maternity" },
    { id: "am", label: "AM - Alternative Medicine" },
  ]

  const handleMemberRoleChange = (roleId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      applicableMemberRoles: checked
        ? [...prev.applicableMemberRoles, roleId]
        : prev.applicableMemberRoles.filter((id) => id !== roleId),
    }))
  }

  const handleServiceTypeChange = (serviceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      associatedServiceTypes: checked
        ? [...prev.associatedServiceTypes, serviceId]
        : prev.associatedServiceTypes.filter((id) => id !== serviceId),
    }))
  }

  const handleBillingGroupChange = (billingGroupId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      associatedBillingGroups: checked
        ? [...prev.associatedBillingGroups, billingGroupId]
        : prev.associatedBillingGroups.filter((id) => id !== billingGroupId),
    }))
  }

  const handleSave = () => {
    const dataToSave = editMode && initialData?.id ? { ...formData, id: initialData.id } : formData

    onSave(dataToSave)
    // Reset form only if not in edit mode
    if (!editMode) {
      setFormData({
        parentLimit: "none",
        name: "",
        limitValue: 0,
        unit: "MYR",
        limitDuration: "Per Year",
        applicableMemberRoles: [],
        associatedServiceTypes: [],
        associatedBillingGroups: [],
        description: "",
        limitType: "independent",
      })
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      parentLimit: "none",
      name: "",
      limitValue: 0,
      unit: "MYR",
      limitDuration: "Per Year",
      applicableMemberRoles: [],
      associatedServiceTypes: [],
      associatedBillingGroups: [],
      description: "",
      limitType: "independent",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {editMode ? "Edit Top-Level Limit" : "Add Top-Level Limit"}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Parent Limit */}
          <div className="space-y-2">
            <Label htmlFor="parent-limit">Parent Limit</Label>
            <Select
              value={formData.parentLimit}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, parentLimit: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top-Level)</SelectItem>
                {existingLimits.map((limit) => (
                  <SelectItem key={limit.id} value={limit.id}>
                    {limit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter limit name"
            />
          </div>

          {/* Limit Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit-value">Limit Value</Label>
              <Input
                id="limit-value"
                type="number"
                value={formData.limitValue}
                onChange={(e) => setFormData((prev) => ({ ...prev, limitValue: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="MYR">MYR</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Limit Duration */}
          <div className="space-y-2">
            <Label htmlFor="limit-duration">Limit Duration</Label>
            <Select
              value={formData.limitDuration}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, limitDuration: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Per Year">Per Year</SelectItem>
                <SelectItem value="Per Month">Per Month</SelectItem>
                <SelectItem value="Per Visit">Per Visit</SelectItem>
                <SelectItem value="Per Day">Per Day</SelectItem>
                <SelectItem value="Lifetime">Lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applicable Member Roles */}
          <div className="space-y-3">
            <Label>Applicable Member Roles</Label>
            <div className="grid grid-cols-2 gap-4">
              {memberRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.id}
                    checked={formData.applicableMemberRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleMemberRoleChange(role.id, checked as boolean)}
                  />
                  <Label htmlFor={role.id} className="text-sm font-normal">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Service Types */}
          <div className="space-y-3">
            <Label>Associated Service Types</Label>
            <div className="grid grid-cols-3 gap-4">
              {serviceTypes.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={formData.associatedServiceTypes.includes(service.id)}
                    onCheckedChange={(checked) => handleServiceTypeChange(service.id, checked as boolean)}
                  />
                  <Label htmlFor={service.id} className="text-sm font-normal">
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Billing Groups */}
          <div className="space-y-3">
            <Label>Associated Billing Groups</Label>
            <div className="grid grid-cols-2 gap-4">
              {billingGroups.map((billingGroup) => (
                <div key={billingGroup.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={billingGroup.id}
                    checked={formData.associatedBillingGroups.includes(billingGroup.id)}
                    onCheckedChange={(checked) => handleBillingGroupChange(billingGroup.id, checked as boolean)}
                  />
                  <Label htmlFor={billingGroup.id} className="text-sm font-normal">
                    {billingGroup.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Limit Type */}
          <div className="space-y-3">
            <Label>Limit Type</Label>
            <RadioGroup
              value={formData.limitType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, limitType: value as "independent" | "shared" }))
              }
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="independent" id="independent" />
                <Label htmlFor="independent">Independent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shared" id="shared" />
                <Label htmlFor="shared">Shared</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={4}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              {editMode ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
