"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Copy, Filter, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { PlanCreationForm } from "@/components/plan/plan-creation-form"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePlans } from "@/contexts/plans-context"

interface Plan {
  id: string
  name: string
  type: string
  status: string
  createdDate: string
  effectiveDate: string
  expiryDate: string
  description?: string
  serviceTypes?: string[]
  providerAccess?: string
  selectedProviders?: any[]
  hasBillback?: boolean
  hasSpecialRules?: boolean
  limits?: any[]
  specialRules?: {
    coPayment?: any[]
    linkedLimits?: any[]
    additiveLimit?: any
  }
  coPayments?: any[]
}

export function PlanContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [viewingPlan, setViewingPlan] = useState<Plan | null>(null)
  const [copyingPlan, setCopyingPlan] = useState<Plan | null>(null)

  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "activate" | "deactivate"
    planId: string
    planName: string
  } | null>(null)

  // Replace with context
  const { plans, addPlan, updatePlan, deletePlan, getActivePlans } = usePlans()

  // Generate new plan ID
  const generatePlanId = () => {
    const maxId = plans.reduce((max, plan) => {
      const num = Number.parseInt(plan.id.replace("PL", ""))
      return num > max ? num : max
    }, 0)
    return `PL${String(maxId + 1).padStart(3, "0")}`
  }

  // Handle viewing a plan
  const handleViewPlan = (plan: Plan) => {
    setViewingPlan(plan)
  }

  // Handle copying a plan
  const handleCopyPlan = (plan: Plan) => {
    // Create a complete copy with all configuration data
    const completePlanData = {
      ...plan,
      // Include all the configuration that might be stored
      serviceTypes: plan.serviceTypes || [],
      providerAccess: plan.providerAccess || "",
      selectedProviders: plan.selectedProviders || [],
      hasBillback: plan.hasBillback || false,
      hasSpecialRules: plan.hasSpecialRules || false,
      limits: plan.limits || [],
      specialRules: plan.specialRules || {
        coPayment: [],
        linkedLimits: [],
        additiveLimit: null,
      },
      coPayments: plan.coPayments || [],
    }
    setCopyingPlan(completePlanData)
    setIsCreating(true)
  }

  // Handle closing view modal
  const handleCloseView = () => {
    setViewingPlan(null)
  }

  // Handle back from creation form
  const handleBackFromCreation = () => {
    setIsCreating(false)
    setCopyingPlan(null)
  }

  const handleSavePlan = (planData: any) => {
    const newPlan: Plan = {
      id: generatePlanId(),
      name: planData.name,
      type: planData.type,
      status: planData.status === "active" ? "Active" : planData.status === "inactive" ? "Inactive" : "Draft",
      createdDate: new Date().toISOString().split("T")[0],
      effectiveDate: planData.effectiveDate || "2024-01-01",
      expiryDate: planData.expiryDate || "2024-12-31",
      description: planData.description,
      limits: planData.limits || [],
      serviceTypes: planData.serviceTypes || [],
      providerAccess: planData.providerAccess || "",
      selectedProviders: planData.selectedProviders || [],
      hasBillback: planData.hasBillback || false,
      hasSpecialRules: planData.hasSpecialRules || false,
      specialRules: {
        coPayment: [],
        linkedLimits: [],
        additiveLimit: null,
      },
      coPayments: planData.coPayments || [],
    }

    addPlan(newPlan)
    setIsCreating(false)

    console.log(`Plan "${newPlan.name}" created successfully and added to the top of the list`)
  }

  // Filter plans based on search term
  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleActivatePlan = (planId: string) => {
    updatePlan(planId, { status: "Active" })
    setConfirmAction(null)
    console.log(`Plan ${planId} has been activated`)
  }

  const handleDeactivatePlan = (planId: string) => {
    updatePlan(planId, { status: "Inactive" })
    setConfirmAction(null)
    console.log(`Plan ${planId} has been deactivated`)
  }

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId)
    setConfirmAction(null)
    console.log(`Plan ${planId} has been deleted`)
  }

  const handleConfirmAction = () => {
    if (!confirmAction) return

    switch (confirmAction.type) {
      case "activate":
        handleActivatePlan(confirmAction.planId)
        break
      case "deactivate":
        handleDeactivatePlan(confirmAction.planId)
        break
      case "delete":
        handleDeletePlan(confirmAction.planId)
        break
    }
  }

  // Plan Details Modal Component
  const PlanDetailsModal = ({ plan, onClose }: { plan: Plan; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Plan Details - {plan.name}</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-sm">Plan Code</Label>
                  <p className="text-sm text-gray-600">{plan.id}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Plan Name</Label>
                  <p className="text-sm text-gray-600">{plan.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-sm">Plan Type</Label>
                  <p className="text-sm text-gray-600">{plan.type}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Status</Label>
                  <Badge variant={plan.status === "Active" ? "default" : "secondary"}>{plan.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-sm">Created Date</Label>
                  <p className="text-sm text-gray-600">{plan.createdDate}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Description</Label>
                  <p className="text-sm text-gray-600">{plan.description || "No description provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional plan details would be displayed here based on the plan's stored configuration */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="font-medium text-sm">Service Types</Label>
                <p className="text-sm text-gray-600">
                  {plan.serviceTypes?.join(", ") || "No service types configured"}
                </p>
              </div>

              <div>
                <Label className="font-medium text-sm">Provider Access</Label>
                <p className="text-sm text-gray-600">{plan.providerAccess || "No provider access configured"}</p>
              </div>

              {plan.selectedProviders && plan.selectedProviders.length > 0 && (
                <div>
                  <Label className="font-medium text-sm">Selected Providers</Label>
                  <ul>
                    {plan.selectedProviders.map((provider: any) => (
                      <li key={provider.id} className="text-sm text-gray-600">
                        {provider.name} ({provider.type}, {provider.location}) - Status: {provider.status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <Label className="font-medium text-sm">Benefit Limits</Label>
                {plan.limits && plan.limits.length > 0 ? (
                  <ul>
                    {plan.limits.map((limit: any) => (
                      <li key={limit.id} className="text-sm text-gray-600">
                        {limit.name}: {limit.amount} {limit.currency} - {limit.period}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No benefit limits configured</p>
                )}
              </div>

              <div>
                <Label className="font-medium text-sm">Special Rules</Label>
                {plan.hasSpecialRules ? (
                  <div className="space-y-2">
                    {plan.specialRules?.coPayment && plan.specialRules.coPayment.length > 0 && (
                      <div>
                        <Label className="font-medium text-sm">Co-Payments</Label>
                        <ul>
                          {plan.specialRules.coPayment.map((coPayment: any) => (
                            <li key={coPayment.id} className="text-sm text-gray-600">
                              {coPayment.serviceType}: {coPayment.amount} {coPayment.unit} - {coPayment.paymentMethod}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.specialRules?.linkedLimits && plan.specialRules.linkedLimits.length > 0 && (
                      <div>
                        <Label className="font-medium text-sm">Linked Limits</Label>
                        <ul>
                          {plan.specialRules.linkedLimits.map((linkedLimit: any) => (
                            <li key={linkedLimit.id} className="text-sm text-gray-600">
                              {linkedLimit.name}: Primary Limit - {linkedLimit.primaryLimitId}, Linked Limit -{" "}
                              {linkedLimit.linkedLimitId}, Type - {linkedLimit.linkType}, Ratio - {linkedLimit.ratio}%
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.specialRules?.additiveLimit && (
                      <div>
                        <Label className="font-medium text-sm">Additive Limit</Label>
                        <p className="text-sm text-gray-600">Additive limit configured</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No special rules configured</p>
                )}
              </div>

              <div>
                <Label className="font-medium text-sm">Billback</Label>
                <p className="text-sm text-gray-600">{plan.hasBillback ? "Enabled" : "Disabled"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const plansTableRef = useRef<HTMLDivElement>(null)

  if (isCreating) {
    return <PlanCreationForm onBack={handleBackFromCreation} onSave={handleSavePlan} initialData={copyingPlan} />
  }

  return (
    <div className="space-y-6 p-6">
      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for plan management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border"
              onClick={() => setIsCreating(true)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-blue-500" />
                  Create New Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-500">Create a new plan from scratch</p>
              </CardContent>
            </Card>

            <Card
              className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border"
              onClick={() => {
                plansTableRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <Copy className="h-5 w-5 mr-2 text-green-500" />
                  Copy Existing Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-500">Create a new plan based on an existing one</p>
              </CardContent>
            </Card>

            <Card className="bg-white hover:bg-gray-50 cursor-pointer transition-colors border">
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-purple-500" />
                  Advanced Search
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-500">Search plans with multiple criteria</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Plan Setup Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plan Setup</CardTitle>
            <CardDescription>Manage and configure plans</CardDescription>
          </div>
          <Button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </CardHeader>
      </Card>

      {/* Search Plan Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Plan</CardTitle>
          <CardDescription>Find plans by name or code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search plans by name or code..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card ref={plansTableRef}>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>All available plans</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Code</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.id}</TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.type}</TableCell>
                    <TableCell>{plan.effectiveDate || "2024-01-01"}</TableCell>
                    <TableCell>{plan.expiryDate || "2024-12-31"}</TableCell>
                    <TableCell>
                      <Badge variant={plan.status === "Active" ? "default" : "secondary"}>{plan.status}</Badge>
                    </TableCell>
                    <TableCell>{plan.createdDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                          onClick={() => handleViewPlan(plan)}
                          title="View Plan"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-50"
                          onClick={() => handleCopyPlan(plan)}
                          title="Copy Plan"
                        >
                          <Copy className="h-4 w-4 text-green-600" />
                        </Button>
                        {(plan.status === "Draft" || plan.status === "Inactive") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-emerald-50"
                            onClick={() => setConfirmAction({ type: "activate", planId: plan.id, planName: plan.name })}
                            title="Activate Plan"
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </Button>
                        )}
                        {plan.status === "Active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-orange-50"
                            onClick={() =>
                              setConfirmAction({ type: "deactivate", planId: plan.id, planName: plan.name })
                            }
                            title="Deactivate Plan"
                          >
                            <XCircle className="h-4 w-4 text-orange-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          onClick={() => setConfirmAction({ type: "delete", planId: plan.id, planName: plan.name })}
                          title="Delete Plan"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No plans found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Details Modal */}
      {viewingPlan && <PlanDetailsModal plan={viewingPlan} onClose={handleCloseView} />}

      {/* Confirmation Dialog */}
      {confirmAction && (
        <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmAction.type === "delete" && "Delete Plan"}
                {confirmAction.type === "activate" && "Activate Plan"}
                {confirmAction.type === "deactivate" && "Deactivate Plan"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmAction.type === "delete" &&
                  `Are you sure you want to delete "${confirmAction.planName}"? This action cannot be undone and will permanently remove the plan and all its configurations.`}
                {confirmAction.type === "activate" &&
                  `Are you sure you want to activate "${confirmAction.planName}"? This will make the plan available for use.`}
                {confirmAction.type === "deactivate" &&
                  `Are you sure you want to deactivate "${confirmAction.planName}"? This will make the plan unavailable for new enrollments.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                className={
                  confirmAction.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.type === "activate"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {confirmAction.type === "delete" && "Delete"}
                {confirmAction.type === "activate" && "Activate"}
                {confirmAction.type === "deactivate" && "Deactivate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
