"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
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

interface BenefitLimit {
  id: string
  name: string
  amount: number
  currency: string
  period: string
  scope: string
  memberRoles: string[]
  serviceTypes: string[]
  billingGroups?: { [serviceType: string]: string[] }
  description: string
  children?: BenefitLimit[]
  limitType: "independent" | "shared"
}

interface ChildLimitFormData {
  parentLimitId: string
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

interface AddChildLimitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: ChildLimitFormData) => void
  parentLimit: BenefitLimit | null
  existingLimits: BenefitLimit[]
  editMode?: boolean
  initialData?: ChildLimitFormData & { id?: string }
}

export function AddChildLimitForm({
  open,
  onOpenChange,
  onSave,
  parentLimit,
  existingLimits,
  editMode = false,
  initialData,
}: AddChildLimitFormProps) {
  const [formData, setFormData] = useState<ChildLimitFormData>({
    parentLimitId: initialData?.parentLimitId || "",
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

  const [parentInfo, setParentInfo] = useState({
    totalChildLimits: 0,
    remainingAvailable: 0,
    maxAllowed: 0,
  })

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

  useEffect(() => {
    if (parentLimit) {
      // Calculate existing child limits total
      const totalChildLimits = parentLimit.children?.reduce((sum, child) => sum + child.amount, 0) || 0
      const remainingAvailable = parentLimit.amount - totalChildLimits

      setParentInfo({
        totalChildLimits,
        remainingAvailable,
        maxAllowed: parentLimit.amount,
      })

      setFormData((prev) => ({
        ...prev,
        parentLimitId: parentLimit.id,
        unit: parentLimit.currency,
        limitDuration: parentLimit.period === "per year" ? "Per Year" : parentLimit.period,
      }))
    }
  }, [parentLimit])

  useEffect(() => {
    if (initialData && editMode) {
      setFormData({
        parentLimitId: initialData.parentLimitId || "",
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
    if (formData.limitValue > parentInfo.remainingAvailable && !editMode) {
      alert(`Limit value cannot exceed remaining available amount of $${parentInfo.remainingAvailable}`)
      return
    }

    const dataToSave = editMode && initialData?.id ? { ...formData, id: initialData.id } : formData

    onSave(dataToSave)
    // Reset form only if not in edit mode
    if (!editMode) {
      setFormData({
        parentLimitId: "",
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
      parentLimitId: "",
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

  if (!parentLimit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {editMode ? "Edit Child Limit" : "Add Child Limit"}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              {editMode
                ? `Editing child limit for: ${parentLimit?.name}`
                : `Creating a child limit for: ${parentLimit?.name}`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Parent Limit Information */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label>Parent Limit</Label>
              <Select value={parentLimit.id} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={parentLimit.id}>{parentLimit.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Parent limit value:</span>
                <div className="font-medium">
                  ${parentLimit.amount} {parentLimit.currency} {parentLimit.period}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total of existing child limits:</span>
                <div className="font-medium">
                  ${parentInfo.totalChildLimits} {parentLimit.currency}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Remaining available:</span>
                <div className="font-medium text-green-600">
                  ${parentInfo.remainingAvailable} {parentLimit.currency}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Maximum allowed for this limit:</span>
                <div className="font-medium">
                  ${parentInfo.maxAllowed} {parentLimit.currency}
                </div>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="child-name">Name</Label>
            <Input
              id="child-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter child limit name"
            />
          </div>

          {/* Limit Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="child-limit-value">Limit Value</Label>
              <Input
                id="child-limit-value"
                type="number"
                value={formData.limitValue}
                onChange={(e) => setFormData((prev) => ({ ...prev, limitValue: Number(e.target.value) }))}
                placeholder="0"
                max={parentInfo.remainingAvailable}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-unit">Unit</Label>
              <Select value={formData.unit} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={parentLimit.currency}>{parentLimit.currency}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-blue-600">Unit must match parent limit</p>
            </div>
          </div>

          {/* Limit Duration */}
          <div className="space-y-2">
            <Label htmlFor="child-limit-duration">Limit Duration</Label>
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
                    id={`child-${role.id}`}
                    checked={formData.applicableMemberRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleMemberRoleChange(role.id, checked as boolean)}
                  />
                  <Label htmlFor={`child-${role.id}`} className="text-sm font-normal">
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
                    id={`child-${service.id}`}
                    checked={formData.associatedServiceTypes.includes(service.id)}
                    onCheckedChange={(checked) => handleServiceTypeChange(service.id, checked as boolean)}
                  />
                  <Label htmlFor={`child-${service.id}`} className="text-sm font-normal">
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
                    id={`child-${billingGroup.id}`}
                    checked={formData.associatedBillingGroups.includes(billingGroup.id)}
                    onCheckedChange={(checked) => handleBillingGroupChange(billingGroup.id, checked as boolean)}
                  />
                  <Label htmlFor={`child-${billingGroup.id}`} className="text-sm font-normal">
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
                <RadioGroupItem value="independent" id="child-independent" />
                <Label htmlFor="child-independent">Independent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shared" id="child-shared" />
                <Label htmlFor="child-shared">Shared</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="child-description">Description</Label>
            <Textarea
              id="child-description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={4}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {editMode ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
