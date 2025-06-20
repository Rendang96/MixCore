"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  FileText,
  Clock,
  Pencil,
  Upload,
  RefreshCcw,
} from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Plan {
  id: string
  name: string
  type: string
  status: string
  createdDate: string
  lastUpdated: string // Added lastUpdated
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
  progress: {
    // Added progress
    currentStep: number
    totalSteps: number
  }
  configStatus: {
    // Added configStatus
    basicInfo: boolean
    providerSelection: boolean
    benefitLimits: boolean
    specialRules: boolean
    review: boolean
  }
}

export function PlanContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [viewingPlan, setViewingPlan] = useState<Plan | null>(null)
  const [copyingPlan, setCopyingPlan] = useState<Plan | null>(null)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null) // New state for editing

  const [statusFilter, setStatusFilter] = useState("All Status")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [sortOrder, setSortOrder] = useState("Newest First")

  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "activate" | "deactivate"
    planId: string
    planName: string
  } | null>(null)

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
    const completePlanData = {
      ...plan,
      id: generatePlanId(), // Generate new ID for the copy
      name: `${plan.name} (Copy)`, // Append (Copy) to the name
      status: "Draft", // Copied plans start as Draft
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      // Ensure all configuration data is deeply copied if necessary,
      // for now, shallow copy is sufficient based on current structure
      serviceTypes: plan.serviceTypes ? [...plan.serviceTypes] : [],
      selectedProviders: plan.selectedProviders ? [...plan.selectedProviders] : [],
      limits: plan.limits ? [...plan.limits] : [],
      specialRules: plan.specialRules
        ? JSON.parse(JSON.stringify(plan.specialRules))
        : { coPayment: [], linkedLimits: [], additiveLimit: null },
      coPayments: plan.coPayments ? [...plan.coPayments] : [],
      progress: { currentStep: 1, totalSteps: 5 }, // Reset progress for copy
      configStatus: {
        basicInfo: false,
        providerSelection: false,
        benefitLimits: false,
        specialRules: false,
        review: false,
      }, // Reset config status for copy
    }
    setCopyingPlan(completePlanData)
    setIsCreating(true)
    setEditingPlan(null) // Ensure not in edit mode
  }

  // Handle editing a plan
  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan)
    setIsCreating(true)
    setCopyingPlan(null) // Ensure not in copy mode
  }

  // Handle closing view modal
  const handleCloseView = () => {
    setViewingPlan(null)
  }

  // Handle back from creation/edit form
  const handleBackFromCreation = () => {
    setIsCreating(false)
    setCopyingPlan(null)
    setEditingPlan(null)
  }

  const handleSavePlan = (planData: any) => {
    if (editingPlan) {
      // Update existing plan
      updatePlan(editingPlan.id, {
        name: planData.name,
        type: planData.type,
        status: planData.status === "active" ? "Active" : planData.status === "inactive" ? "Inactive" : "Draft",
        effectiveDate: planData.effectiveDate || "2024-01-01",
        expiryDate: planData.expiryDate || "2024-12-31",
        description: planData.description,
        limits: planData.limits || [],
        serviceTypes: planData.serviceTypes || [],
        providerAccess: planData.providerAccess || "",
        selectedProviders: planData.selectedProviders || [],
        hasBillback: planData.hasBillback || false,
        hasSpecialRules: planData.hasSpecialRules || false,
        specialRules: planData.specialRules || { coPayment: [], linkedLimits: [], additiveLimit: null },
        coPayments: planData.coPayments || [],
        progress: planData.progress || { currentStep: 1, totalSteps: 5 },
        configStatus: planData.configStatus || {
          basicInfo: false,
          providerSelection: false,
          benefitLimits: false,
          specialRules: false,
          review: false,
        },
      })
      console.log(`Plan "${planData.name}" updated successfully!`)
    } else {
      // Create new plan
      const newPlan: Plan = {
        id: generatePlanId(),
        name: planData.name,
        type: planData.type,
        status: planData.status === "active" ? "Active" : planData.status === "inactive" ? "Inactive" : "Draft",
        createdDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
        effectiveDate: planData.effectiveDate || "2024-01-01",
        expiryDate: planData.expiryDate || "2024-12-31",
        description: planData.description,
        limits: planData.limits || [],
        serviceTypes: planData.serviceTypes || [],
        providerAccess: planData.providerAccess || "",
        selectedProviders: planData.selectedProviders || [],
        hasBillback: planData.hasBillback || false,
        hasSpecialRules: planData.hasSpecialRules || false,
        specialRules: planData.specialRules || { coPayment: [], linkedLimits: [], additiveLimit: null },
        coPayments: planData.coPayments || [],
        progress: planData.progress || { currentStep: 1, totalSteps: 5 },
        configStatus: planData.configStatus || {
          basicInfo: false,
          providerSelection: false,
          benefitLimits: false,
          specialRules: false,
          review: false,
        },
      }
      addPlan(newPlan)
      console.log(`Plan "${newPlan.name}" created successfully and added to the top of the list`)
    }
    setIsCreating(false)
    setCopyingPlan(null)
    setEditingPlan(null)
  }

  // Filter and sort plans based on search term and filters
  const filteredAndSortedPlans = useMemo(() => {
    let tempPlans = plans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "All Status") {
      tempPlans = tempPlans.filter((plan) => plan.status === statusFilter)
    }

    if (typeFilter !== "All Types") {
      tempPlans = tempPlans.filter((plan) => plan.type === typeFilter)
    }

    tempPlans.sort((a, b) => {
      if (sortOrder === "Newest First") {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      } else if (sortOrder === "Oldest First") {
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      } else if (sortOrder === "Name (A-Z)") {
        return a.name.localeCompare(b.name)
      } else if (sortOrder === "Name (Z-A)") {
        return b.name.localeCompare(a.name)
      }
      return 0
    })

    return tempPlans
  }, [plans, searchTerm, statusFilter, typeFilter, sortOrder])

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

  // Helper to render status icons
  const renderStatusIcon = (isComplete: boolean) => {
    return isComplete ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  // Plan Details Modal Component
  const PlanDetailsModal = ({ plan, onClose }: { plan: Plan; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Plan Details - {plan.name}</h2>
          <Button variant="outline" onClick={onClose} className="bg-black text-white">
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
                  <Label className="font-medium text-sm">Last Updated</Label>
                  <p className="text-sm text-gray-600">{plan.lastUpdated}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium text-sm">Effective Date</Label>
                  <p className="text-sm text-gray-600">{plan.effectiveDate || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Expiry Date</Label>
                  <p className="text-sm text-gray-600">{plan.expiryDate || "N/A"}</p>
                </div>
              </div>
              <div>
                <Label className="font-medium text-sm">Description</Label>
                <p className="text-sm text-gray-600">{plan.description || "No description provided"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Summary */}
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

  // Calculate summary counts
  const totalPlans = plans.length
  const activePlans = plans.filter((p) => p.status === "Active").length
  const draftPlans = plans.filter((p) => p.status === "Draft").length
  const inactivePlans = plans.filter((p) => p.status === "Inactive").length

  if (isCreating) {
    return (
      <PlanCreationForm
        onBack={handleBackFromCreation}
        onSave={handleSavePlan}
        initialData={copyingPlan || editingPlan}
      />
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plan Management</h1>
          <p className="text-gray-500">Create, manage, and configure insurance plans with comprehensive tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-50">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </div>
      </div>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts for plan management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors border-blue-700"
              onClick={() => setIsCreating(true)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm opacity-90">Start building a new insurance plan from scratch</p>
              </CardContent>
            </Card>

            <Card
              className="bg-green-600 text-white hover:bg-green-700 cursor-pointer transition-colors border-green-700"
              onClick={() => {
                plansTableRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy Existing Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm opacity-90">Duplicate an existing plan with all configurations</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-600 text-white hover:bg-purple-700 cursor-pointer transition-colors border-purple-700">
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Bulk Upload Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm opacity-90">Import multiple plans from CSV or Excel file</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Plan Management Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Plans</p>
              <p className="text-2xl font-bold">{totalPlans}</p>
              <p className="text-xs text-gray-400">All plans in system</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Plans</p>
              <p className="text-2xl font-bold text-green-600">{activePlans}</p>
              <p className="text-xs text-gray-400">Currently active</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Draft Plans</p>
              <p className="text-2xl font-bold text-yellow-600">{draftPlans}</p>
              <p className="text-xs text-gray-400">In development</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Plans</p>
              <p className="text-2xl font-bold text-red-600">{inactivePlans}</p>
              <p className="text-xs text-gray-400">Deactivated</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Plans</CardTitle>
          <CardDescription>Find plans by name, type, or ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search plans by name, type, or ID..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Newest First">Newest First</SelectItem>
                <SelectItem value="Oldest First">Oldest First</SelectItem>
                <SelectItem value="Name (A-Z)">Name (A-Z)</SelectItem>
                <SelectItem value="Name (Z-A)">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card ref={plansTableRef}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plans ({filteredAndSortedPlans.length})</CardTitle>
            <CardDescription>All available plans</CardDescription>
          </div>
          <div className="text-sm text-gray-500">
            Next Plan ID: <span className="font-semibold text-blue-600">{generatePlanId()}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan ID</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Basic Info</TableHead>
                <TableHead>Provider Selection</TableHead>
                <TableHead>Benefit Limits</TableHead>
                <TableHead>Special Rules</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPlans.length > 0 ? (
                filteredAndSortedPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.id}</TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{plan.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          plan.status === "Active" ? "default" : plan.status === "Draft" ? "secondary" : "outline"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {plan.progress.currentStep}/{plan.progress.totalSteps}
                    </TableCell>
                    <TableCell>{renderStatusIcon(plan.configStatus.basicInfo)}</TableCell>
                    <TableCell>{renderStatusIcon(plan.configStatus.providerSelection)}</TableCell>
                    <TableCell>{renderStatusIcon(plan.configStatus.benefitLimits)}</TableCell>
                    <TableCell>{renderStatusIcon(plan.configStatus.specialRules)}</TableCell>
                    <TableCell>{renderStatusIcon(plan.configStatus.review)}</TableCell>
                    <TableCell>System</TableCell> {/* Assuming 'System' for now */}
                    <TableCell>{plan.lastUpdated}</TableCell>
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
                          className="h-8 w-8 p-0 hover:bg-green-50"
                          onClick={() => handleCopyPlan(plan)}
                          title="Copy Plan"
                        >
                          <Copy className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-yellow-50"
                          onClick={() => handleEditPlan(plan)}
                          title="Edit Plan"
                        >
                          <Pencil className="h-4 w-4 text-yellow-600" />
                        </Button>
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
                  <TableCell colSpan={13} className="text-center py-4">
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
