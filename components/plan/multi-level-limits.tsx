"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, RefreshCw } from "lucide-react"
import { AddTopLevelLimitForm } from "./add-top-level-limit-form"
import { AddChildLimitForm } from "./add-child-limit-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BenefitLimit {
  id: string
  name: string
  amount: number
  currency: string
  period: string
  scope: string
  memberRoles: string[]
  serviceTypes: string[]
  billingGroups?: { [serviceType: string]: string[] } // Updated to support arrays
  description: string
  children?: BenefitLimit[]
  expanded?: boolean
  limitType: "independent" | "shared"
}

interface MultiLevelLimitsProps {
  onNext?: () => void
  onBack?: () => void
  onLimitsChange?: (limits: any[]) => void
  initialLimits?: BenefitLimit[]
}

export function MultiLevelLimits({ onNext, onBack, onLimitsChange, initialLimits = [] }: MultiLevelLimitsProps) {
  const [limits, setLimits] = useState<BenefitLimit[]>([])
  const [selectedLimit, setSelectedLimit] = useState<BenefitLimit | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showChildForm, setShowChildForm] = useState(false)
  const [editingLimit, setEditingLimit] = useState<BenefitLimit | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [limitToDelete, setLimitToDelete] = useState<string | null>(null)

  const [editFormData, setEditFormData] = useState<any>(null)
  const [editChildFormData, setEditChildFormData] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isChildEditMode, setIsChildEditMode] = useState(false)

  useEffect(() => {
    if (initialLimits && initialLimits.length > 0) {
      setLimits(initialLimits)
    }
  }, [initialLimits])

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

  const toggleExpanded = (limitId: string, limitsArray: BenefitLimit[]): BenefitLimit[] => {
    return limitsArray.map((limit) => {
      if (limit.id === limitId) {
        return { ...limit, expanded: !limit.expanded }
      }
      if (limit.children) {
        return { ...limit, children: toggleExpanded(limitId, limit.children) }
      }
      return limit
    })
  }

  const handleToggleExpanded = (limitId: string) => {
    setLimits((prev) => toggleExpanded(limitId, prev))
  }

  const addChildToLimit = (limitsArray: BenefitLimit[], parentId: string, newChild: BenefitLimit): BenefitLimit[] => {
    return limitsArray.map((limit) => {
      if (limit.id === parentId) {
        return {
          ...limit,
          children: [...(limit.children || []), newChild],
          expanded: true,
        }
      }
      if (limit.children) {
        return { ...limit, children: addChildToLimit(limit.children, parentId, newChild) }
      }
      return limit
    })
  }

  const updateLimitInTree = (
    limitsArray: BenefitLimit[],
    limitId: string,
    updatedLimit: Partial<BenefitLimit>,
  ): BenefitLimit[] => {
    return limitsArray.map((limit) => {
      if (limit.id === limitId) {
        return { ...limit, ...updatedLimit }
      }
      if (limit.children) {
        return { ...limit, children: updateLimitInTree(limit.children, limitId, updatedLimit) }
      }
      return limit
    })
  }

  const deleteLimitFromTree = (limitsArray: BenefitLimit[], limitId: string): BenefitLimit[] => {
    return limitsArray.filter((limit) => {
      if (limit.id === limitId) {
        return false
      }
      if (limit.children) {
        limit.children = deleteLimitFromTree(limit.children, limitId)
      }
      return true
    })
  }

  const findParentLimit = (limitsArray: BenefitLimit[], childId: string): BenefitLimit | null => {
    for (const limit of limitsArray) {
      if (limit.children?.some((child) => child.id === childId)) {
        return limit
      }
      if (limit.children) {
        const found = findParentLimit(limit.children, childId)
        if (found) return found
      }
    }
    return null
  }

  const handleEditLimit = (limit: BenefitLimit) => {
    console.log("Edit clicked for limit:", limit.name)

    // Check if this is a top-level limit or child limit
    const isTopLevel = !findParentLimit(limits, limit.id)

    if (isTopLevel) {
      // Prepare data for top-level limit form
      setEditFormData({
        id: limit.id,
        parentLimit: "none",
        name: limit.name,
        limitValue: limit.amount,
        unit: limit.currency,
        limitDuration: limit.period === "per year" ? "Per Year" : limit.period,
        applicableMemberRoles: limit.memberRoles,
        associatedServiceTypes: limit.serviceTypes,
        billingGroups: limit.billingGroups || {}, // Handle new billing groups structure
        description: limit.description,
        limitType: limit.limitType,
      })
      setIsEditMode(true)
      setShowAddForm(true)
    } else {
      // Prepare data for child limit form
      const parent = findParentLimit(limits, limit.id)
      setEditChildFormData({
        id: limit.id,
        parentLimitId: parent?.id || "",
        name: limit.name,
        limitValue: limit.amount,
        unit: limit.currency,
        limitDuration: limit.period === "per year" ? "Per Year" : limit.period,
        applicableMemberRoles: limit.memberRoles,
        associatedServiceTypes: limit.serviceTypes,
        billingGroups: limit.billingGroups || {}, // Handle new billing groups structure
        description: limit.description,
        limitType: limit.limitType,
      })
      setSelectedLimit(parent)
      setIsChildEditMode(true)
      setShowChildForm(true)
    }
  }

  const handleSaveLimit = (formData: any) => {
    if (isEditMode && formData.id) {
      // Update existing limit
      const updatedLimit = {
        name: formData.name,
        amount: formData.limitValue,
        currency: formData.unit,
        period: formData.limitDuration.toLowerCase(),
        scope: formData.applicableMemberRoles.includes("all") ? "All" : "Specific",
        memberRoles: formData.applicableMemberRoles,
        serviceTypes: formData.associatedServiceTypes,
        billingGroups: formData.billingGroups || {}, // Handle new billing groups structure
        description: formData.description,
        limitType: formData.limitType,
      }

      const updatedLimits = updateLimitInTree(limits, formData.id, updatedLimit)
      setLimits(updatedLimits)
      if (onLimitsChange) {
        onLimitsChange(updatedLimits)
      }

      // Reset edit state
      setIsEditMode(false)
      setEditFormData(null)
    } else {
      // Add new limit
      const newLimit: BenefitLimit = {
        id: Date.now().toString(),
        name: formData.name,
        amount: formData.limitValue,
        currency: formData.unit,
        period: formData.limitDuration.toLowerCase(),
        scope: formData.applicableMemberRoles.includes("all") ? "All" : "Specific",
        memberRoles: formData.applicableMemberRoles,
        serviceTypes: formData.associatedServiceTypes,
        billingGroups: formData.billingGroups || {}, // Handle new billing groups structure
        description: formData.description,
        limitType: formData.limitType,
      }

      const updatedLimits = [...limits, newLimit]
      setLimits(updatedLimits)
      if (onLimitsChange) {
        onLimitsChange(updatedLimits)
      }
    }
  }

  const handleSaveChildLimit = (formData: any) => {
    if (isChildEditMode && formData.id) {
      // Update existing child limit
      const updatedLimit = {
        name: formData.name,
        amount: formData.limitValue,
        currency: formData.unit,
        period: formData.limitDuration.toLowerCase(),
        scope: formData.applicableMemberRoles.includes("all") ? "All" : "Specific",
        memberRoles: formData.applicableMemberRoles,
        serviceTypes: formData.associatedServiceTypes,
        billingGroups: formData.billingGroups || {}, // Handle new billing groups structure
        description: formData.description,
        limitType: formData.limitType,
      }

      const updatedLimits = updateLimitInTree(limits, formData.id, updatedLimit)
      setLimits(updatedLimits)
      if (onLimitsChange) {
        onLimitsChange(updatedLimits)
      }

      // Reset edit state
      setIsChildEditMode(false)
      setEditChildFormData(null)
    } else {
      // Add new child limit
      const newChildLimit: BenefitLimit = {
        id: Date.now().toString(),
        name: formData.name,
        amount: formData.limitValue,
        currency: formData.unit,
        period: formData.limitDuration.toLowerCase(),
        scope: formData.applicableMemberRoles.includes("all") ? "All" : "Specific",
        memberRoles: formData.applicableMemberRoles,
        serviceTypes: formData.associatedServiceTypes,
        billingGroups: formData.billingGroups || {}, // Handle new billing groups structure
        description: formData.description,
        limitType: formData.limitType,
      }

      if (selectedLimit) {
        const updatedLimits = addChildToLimit(limits, selectedLimit.id, newChildLimit)
        setLimits(updatedLimits)
        if (onLimitsChange) {
          onLimitsChange(updatedLimits)
        }
      }
    }
  }

  const handleEditMemberRoleChange = (roleId: string, checked: boolean) => {
    if (editingLimit) {
      const updatedRoles = checked
        ? [...editingLimit.memberRoles, roleId]
        : editingLimit.memberRoles.filter((role) => role !== roleId)
      setEditingLimit({ ...editingLimit, memberRoles: updatedRoles })
    }
  }

  const handleEditServiceTypeChange = (typeId: string, checked: boolean) => {
    if (editingLimit) {
      const updatedTypes = checked
        ? [...editingLimit.serviceTypes, typeId]
        : editingLimit.serviceTypes.filter((type) => type !== typeId)
      setEditingLimit({ ...editingLimit, serviceTypes: updatedTypes })
    }
  }

  const handleEditLimitTypeChange = (limitType: "independent" | "shared") => {
    if (editingLimit) {
      setEditingLimit({ ...editingLimit, limitType: limitType })
    }
  }

  const handleDeleteLimit = (limitId: string) => {
    setShowDeleteDialog(true)
    setLimitToDelete(limitId)
  }

  const confirmDeleteLimit = () => {
    if (limitToDelete) {
      const updatedLimits = deleteLimitFromTree(limits, limitToDelete)
      setLimits(updatedLimits)
      if (onLimitsChange) {
        onLimitsChange(updatedLimits)
      }
      setShowDeleteDialog(false)
      setLimitToDelete(null)
    }
  }

  const cancelDeleteLimit = () => {
    setShowDeleteDialog(false)
    setLimitToDelete(null)
  }

  const renderLimitTree = (limitsArray: BenefitLimit[], level = 0) => {
    return (
      <div className="space-y-1">
        {limitsArray.map((limit) => (
          <div key={limit.id} className="relative">
            <div
              className={`flex items-center space-x-2 py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                selectedLimit?.id === limit.id ? "bg-gray-100" : ""
              }`}
              style={{ paddingLeft: `${level * 16 + 12}px` }}
              onClick={() => setSelectedLimit(limit)}
            >
              {limit.children && limit.children.length > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleExpanded(limit.id)
                  }}
                  className="mr-2"
                >
                  {limit.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : (
                <div className="w-4 h-4 mr-2"></div> // Placeholder for alignment
              )}
              <span>{limit.name}</span>
            </div>
            {limit.expanded && limit.children && limit.children.length > 0 && (
              <div className="ml-6">{renderLimitTree(limit.children, level + 1)}</div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Multi-Level Limits Definition</CardTitle>
              <CardDescription>Define hierarchical benefit limits for your plan</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Top-Level Limit
            </Button>

            <Button variant="outline" disabled={!selectedLimit} onClick={() => setShowChildForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child Limit
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Limit Hierarchy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <div className="h-4 w-4 mr-2 bg-blue-500 rounded"></div>
                  Limit Hierarchy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {limits.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <div className="mb-2">No limits defined yet</div>
                      <div className="text-sm">Click "Add Top-Level Limit" to get started</div>
                    </div>
                  ) : (
                    renderLimitTree(limits)
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Limit Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Limit Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedLimit ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Limit Name</Label>
                      <Input value={selectedLimit.name} readOnly />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Amount</Label>
                        <Input value={selectedLimit.amount} readOnly />
                      </div>
                      <div className="grid gap-2">
                        <Label>Currency</Label>
                        <Input value={selectedLimit.currency} readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Period</Label>
                        <Input value={selectedLimit.period} readOnly />
                      </div>
                      <div className="grid gap-2">
                        <Label>Scope</Label>
                        <Input value={selectedLimit.scope} readOnly />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Member Roles</Label>
                      <Input value={selectedLimit.memberRoles.join(", ")} readOnly />
                    </div>
                    <div className="grid gap-2">
                      <Label>Service Types</Label>
                      <Input value={selectedLimit.serviceTypes.join(", ")} readOnly />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Input value={selectedLimit.description} readOnly />
                    </div>
                    <div className="grid gap-2">
                      <Label>Limit Type</Label>
                      <Input value={selectedLimit.limitType} readOnly />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleEditLimit(selectedLimit)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteLimit(selectedLimit.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">Select a limit to view or edit its details</div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Add Top-Level Limit Form */}
      <AddTopLevelLimitForm
        open={showAddForm}
        onOpenChange={(open) => {
          setShowAddForm(open)
          if (!open) {
            setIsEditMode(false)
            setEditFormData(null)
          }
        }}
        onSave={handleSaveLimit}
        existingLimits={limits.map((limit) => ({ id: limit.id, name: limit.name }))}
        editMode={isEditMode}
        initialData={editFormData}
      />

      {/* Add Child Limit Form */}
      <AddChildLimitForm
        open={showChildForm}
        onOpenChange={(open) => {
          setShowChildForm(open)
          if (!open) {
            setIsChildEditMode(false)
            setEditChildFormData(null)
          }
        }}
        onSave={handleSaveChildLimit}
        parentLimit={selectedLimit}
        existingLimits={limits}
        editMode={isChildEditMode}
        initialData={editChildFormData}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Limit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this limit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={cancelDeleteLimit}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteLimit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
