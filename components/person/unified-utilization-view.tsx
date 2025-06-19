"use client"

import { useState } from "react"
import { ArrowLeft, Info, ChevronDown, ChevronRight, Layers, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface BaseLimit {
  id: string
  name: string
  serviceTypes: string[]
  limit: string
  utilized: string
  remaining: string
  percentage: number
  limitType: "flat" | "nested"
  description?: string
}

interface FlatLimit extends BaseLimit {
  limitType: "flat"
}

interface NestedLimit extends BaseLimit {
  limitType: "nested"
  children?: NestedLimit[]
  expanded?: boolean
  level?: number
}

type UnifiedLimit = FlatLimit | NestedLimit

interface UnifiedUtilizationViewProps {
  personId: string
  planCode: string
  onBack: () => void
}

export function UnifiedUtilizationView({ personId, planCode, onBack }: UnifiedUtilizationViewProps) {
  const [planName, setPlanName] = useState<string>("Malaysia Premium Health Plan")
  const [membershipNo, setMembershipNo] = useState<string>("MYS-PER-2025-123-01-PRI")
  const [effectiveDate, setEffectiveDate] = useState<string>("2024-01-15")
  const [expiryDate, setExpiryDate] = useState<string>("2025-01-14")
  const [activeTab, setActiveTab] = useState<string>("visualization")
  const [viewMode, setViewMode] = useState<"unified" | "separated">("unified")
  const [showFlatLimitsExpanded, setShowFlatLimitsExpanded] = useState(true)

  // Mixed limit structure with both flat and nested limits
  const [limitStructure, setLimitStructure] = useState<UnifiedLimit[]>([
    // Nested limit example
    {
      id: "nested-1",
      name: "Combined Medical Limit",
      serviceTypes: ["GP", "SP", "OC", "DT"],
      limit: "RM 10,000.00",
      utilized: "RM 1,150.00",
      remaining: "RM 8,850.00",
      percentage: 11.5,
      limitType: "nested",
      description: "Primary limit covering all medical services with nested sub-limits",
      expanded: true,
      level: 0,
      children: [
        {
          id: "nested-1-1",
          name: "Optical & Dental Limit",
          serviceTypes: ["OC", "DT"],
          limit: "RM 1,800.00",
          utilized: "RM 220.00",
          remaining: "RM 1,580.00",
          percentage: 12.2,
          limitType: "nested",
          description: "Sub-limit for optical and dental services",
          expanded: true,
          level: 1,
          children: [
            {
              id: "nested-1-1-1",
              name: "Optical Specific Limit",
              serviceTypes: ["OC"],
              limit: "RM 800.00",
              utilized: "RM 0.00",
              remaining: "RM 800.00",
              percentage: 0,
              limitType: "nested",
              description: "Specific limit for optical services only",
              level: 2,
            },
          ],
        },
      ],
    },
    // Flat limits examples
    {
      id: "flat-1",
      name: "Maternity Benefit",
      serviceTypes: ["MT"],
      limit: "RM 3,000.00",
      utilized: "RM 0.00",
      remaining: "RM 3,000.00",
      percentage: 0,
      limitType: "flat",
      description: "Standalone maternity coverage limit",
    },
    {
      id: "flat-2",
      name: "Emergency Services",
      serviceTypes: ["EM"],
      limit: "RM 5,000.00",
      utilized: "RM 750.00",
      remaining: "RM 4,250.00",
      percentage: 15,
      limitType: "flat",
      description: "Emergency medical services coverage",
    },
    {
      id: "flat-3",
      name: "Wellness Program",
      serviceTypes: ["WP"],
      limit: "RM 500.00",
      utilized: "RM 200.00",
      remaining: "RM 300.00",
      percentage: 40,
      limitType: "flat",
      description: "Annual wellness and preventive care allowance",
    },
  ])

  const getServiceTypeColor = (serviceType: string) => {
    const colors: Record<string, string> = {
      GP: "bg-blue-500",
      SP: "bg-purple-500",
      OC: "bg-green-500",
      DT: "bg-amber-500",
      MT: "bg-pink-500",
      EM: "bg-red-500",
      WP: "bg-teal-500",
    }
    return colors[serviceType] || "bg-gray-500"
  }

  const getServiceTypeName = (serviceType: string) => {
    const names: Record<string, string> = {
      GP: "General Practitioner",
      SP: "Specialist",
      OC: "Optical Care",
      DT: "Dental Treatment",
      MT: "Maternity",
      EM: "Emergency",
      WP: "Wellness Program",
    }
    return names[serviceType] || serviceType
  }

  const toggleNestedLimit = (limitId: string, limits: UnifiedLimit[]): UnifiedLimit[] => {
    return limits.map((limit) => {
      if (limit.id === limitId && limit.limitType === "nested") {
        return { ...limit, expanded: !limit.expanded }
      }
      if (limit.limitType === "nested" && limit.children) {
        return { ...limit, children: toggleNestedLimit(limitId, limit.children) }
      }
      return limit
    })
  }

  const handleToggleExpanded = (limitId: string) => {
    setLimitStructure((prev) => toggleNestedLimit(limitId, prev))
  }

  const renderFlatLimit = (limit: FlatLimit) => (
    <div key={limit.id} className="mb-4">
      <div className="relative rounded-xl border-2 border-gray-300 p-6 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200 hover:shadow-lg">
        {/* Flat limit indicator */}
        <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white">
          STANDALONE LIMIT
        </div>

        {/* Header section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <h3 className="text-lg font-bold text-gray-800">{limit.name}</h3>
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{limit.description}</p>
                  <p>Service Types: {limit.serviceTypes.join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Service type badges */}
          <div className="flex space-x-1">
            {limit.serviceTypes.map((st) => (
              <div key={st} className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
                <div className={`h-2 w-2 rounded-full ${getServiceTypeColor(st)} mr-1`}></div>
                <span className="text-xs font-medium text-gray-700">{st}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Utilization Progress</span>
            <span className="text-sm font-bold text-gray-800">{limit.percentage.toFixed(1)}% Used</span>
          </div>
          <div className="relative">
            <Progress value={limit.percentage} className="h-3 [&>div]:bg-gray-500" />
            <div
              className="absolute top-0 h-3 w-0.5 bg-gray-400 opacity-75"
              style={{ left: `${limit.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Amount breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Limit</div>
            <div className="text-sm font-bold text-gray-800 mt-1">{limit.limit}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Utilized</div>
            <div className="text-sm font-bold text-red-600 mt-1">{limit.utilized}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Remaining</div>
            <div className="text-sm font-bold text-green-600 mt-1">{limit.remaining}</div>
          </div>
        </div>

        {/* Utilization status indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div
            className={`
              flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
              ${
                limit.percentage < 50
                  ? "bg-green-100 text-green-800"
                  : limit.percentage < 80
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }
            `}
          >
            <div
              className={`
                w-2 h-2 rounded-full
                ${limit.percentage < 50 ? "bg-green-500" : limit.percentage < 80 ? "bg-yellow-500" : "bg-red-500"}
              `}
            ></div>
            <span>{limit.percentage < 50 ? "Low Usage" : limit.percentage < 80 ? "Moderate Usage" : "High Usage"}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNestedLimit = (limit: NestedLimit, level = 0) => (
    <div key={limit.id} className="mb-6">
      <div className={`relative ${level > 0 ? "ml-8" : ""}`}>
        {/* Connection line for nested levels */}
        {level > 0 && (
          <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 to-transparent"></div>
        )}
        {level > 0 && <div className="absolute -left-8 top-6 w-7 h-px bg-blue-300"></div>}

        {/* Main limit card */}
        <div
          className={`
            relative rounded-xl border-2 p-6 bg-gradient-to-br transition-all duration-200 hover:shadow-lg
            ${level === 0 ? "border-blue-500 from-blue-50 to-blue-100 shadow-md" : ""}
            ${level === 1 ? "border-purple-400 from-purple-50 to-purple-100" : ""}
            ${level === 2 ? "border-green-400 from-green-50 to-green-100" : ""}
          `}
        >
          {/* Level indicator */}
          <div
            className={`
              absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-semibold
              ${level === 0 ? "bg-blue-500 text-white" : ""}
              ${level === 1 ? "bg-purple-500 text-white" : ""}
              ${level === 2 ? "bg-green-500 text-white" : ""}
            `}
          >
            {level === 0 ? "PRIMARY LIMIT" : level === 1 ? "NESTED LIMIT" : "INNER LIMIT"}
          </div>

          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {limit.children && limit.children.length > 0 && (
                <button
                  onClick={() => handleToggleExpanded(limit.id)}
                  className="mr-2 hover:bg-white hover:bg-opacity-50 rounded p-1"
                >
                  {limit.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              )}
              <div
                className={`
                  w-3 h-3 rounded-full
                  ${level === 0 ? "bg-blue-500" : ""}
                  ${level === 1 ? "bg-purple-500" : ""}
                  ${level === 2 ? "bg-green-500" : ""}
                `}
              ></div>
              <h3 className="text-lg font-bold text-gray-800">{limit.name}</h3>
              <Layers className="h-4 w-4 text-gray-500" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Info className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{limit.description}</p>
                    <p>Service Types: {limit.serviceTypes.join(", ")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Service type badges */}
            <div className="flex space-x-1">
              {limit.serviceTypes.map((st) => (
                <div key={st} className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
                  <div className={`h-2 w-2 rounded-full ${getServiceTypeColor(st)} mr-1`}></div>
                  <span className="text-xs font-medium text-gray-700">{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Utilization Progress</span>
              <span className="text-sm font-bold text-gray-800">{limit.percentage.toFixed(1)}% Used</span>
            </div>
            <div className="relative">
              <Progress
                value={limit.percentage}
                className={`h-3 ${
                  level === 0 ? "[&>div]:bg-blue-500" : level === 1 ? "[&>div]:bg-purple-500" : "[&>div]:bg-green-500"
                }`}
              />
              <div
                className="absolute top-0 h-3 w-0.5 bg-gray-400 opacity-75"
                style={{ left: `${limit.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Amount breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Limit</div>
              <div className="text-sm font-bold text-gray-800 mt-1">{limit.limit}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Utilized</div>
              <div className="text-sm font-bold text-red-600 mt-1">{limit.utilized}</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Remaining</div>
              <div className="text-sm font-bold text-green-600 mt-1">{limit.remaining}</div>
            </div>
          </div>

          {/* Utilization status indicator */}
          <div className="mt-4 flex items-center justify-center">
            <div
              className={`
                flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
                ${
                  limit.percentage < 50
                    ? "bg-green-100 text-green-800"
                    : limit.percentage < 80
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              `}
            >
              <div
                className={`
                  w-2 h-2 rounded-full
                  ${limit.percentage < 50 ? "bg-green-500" : limit.percentage < 80 ? "bg-yellow-500" : "bg-red-500"}
                `}
              ></div>
              <span>
                {limit.percentage < 50 ? "Low Usage" : limit.percentage < 80 ? "Moderate Usage" : "High Usage"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Render children with improved spacing */}
      {limit.expanded && limit.children && limit.children.length > 0 && (
        <div className="mt-6">{limit.children.map((child) => renderNestedLimit(child, level + 1))}</div>
      )}
    </div>
  )

  const renderUnifiedView = () => {
    const nestedLimits = limitStructure.filter((limit) => limit.limitType === "nested") as NestedLimit[]
    const flatLimits = limitStructure.filter((limit) => limit.limitType === "flat") as FlatLimit[]

    return (
      <div className="space-y-8">
        {/* Nested Limits Section */}
        {nestedLimits.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Layers className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Multi-Level Limits</h3>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {nestedLimits.length} limit{nestedLimits.length > 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="space-y-6">{nestedLimits.map((limit) => renderNestedLimit(limit))}</div>
          </div>
        )}

        {/* Flat Limits Section */}
        {flatLimits.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-800">Standalone Limits</h3>
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  {flatLimits.length} limit{flatLimits.length > 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="expand-flat" className="text-sm">
                  Expanded View
                </Label>
                <Switch id="expand-flat" checked={showFlatLimitsExpanded} onCheckedChange={setShowFlatLimitsExpanded} />
              </div>
            </div>

            {showFlatLimitsExpanded ? (
              <div className="space-y-4">{flatLimits.map((limit) => renderFlatLimit(limit))}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flatLimits.map((limit) => (
                  <div key={limit.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{limit.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {limit.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={limit.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{limit.utilized}</span>
                        <span>{limit.limit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderSeparatedView = () => (
    <Tabs defaultValue="nested" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="nested" className="flex items-center space-x-2">
          <Layers className="h-4 w-4" />
          <span>Multi-Level Limits</span>
        </TabsTrigger>
        <TabsTrigger value="flat" className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span>Standalone Limits</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="nested" className="mt-6">
        <div className="space-y-6">
          {limitStructure
            .filter((limit) => limit.limitType === "nested")
            .map((limit) => renderNestedLimit(limit as NestedLimit))}
        </div>
      </TabsContent>
      <TabsContent value="flat" className="mt-6">
        <div className="space-y-4">
          {limitStructure
            .filter((limit) => limit.limitType === "flat")
            .map((limit) => renderFlatLimit(limit as FlatLimit))}
        </div>
      </TabsContent>
    </Tabs>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Unified Utilization View</h2>
          <p className="text-sm text-muted-foreground">
            {planName} ({planCode}) • {membershipNo}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Information</CardTitle>
          <CardDescription>
            Effective: {effectiveDate} to {expiryDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Plan Name</div>
              <div>{planName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Plan Code</div>
              <div>{planCode}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Membership No</div>
              <div>{membershipNo}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Period</div>
              <div>
                {effectiveDate} - {expiryDate}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-gray-500 rounded-full"></div>
                <span>Unified Limit Structure</span>
              </CardTitle>
              <CardDescription>Comprehensive view of both multi-level and standalone benefit limits</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="view-mode" className="text-sm">
                  View Mode:
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "unified" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("unified")}
                  >
                    Unified
                  </Button>
                  <Button
                    variant={viewMode === "separated" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("separated")}
                  >
                    Separated
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Service type legend */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Service Type Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {["GP", "SP", "OC", "DT", "MT", "EM", "WP"].map((serviceType) => (
                <div key={serviceType} className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                  <div className={`h-3 w-3 rounded-full ${getServiceTypeColor(serviceType)}`}></div>
                  <span className="text-sm font-medium">{getServiceTypeName(serviceType)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limit type explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Understanding Limit Types</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Layers className="h-4 w-4" />
                  <strong>Multi-Level Limits:</strong>
                </div>
                <ul className="space-y-1 ml-6">
                  <li>• Hierarchical structure with parent-child relationships</li>
                  <li>• Child limits are constrained by parent limits</li>
                  <li>• Useful for complex benefit structures</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <BarChart3 className="h-4 w-4" />
                  <strong>Standalone Limits:</strong>
                </div>
                <ul className="space-y-1 ml-6">
                  <li>• Independent limits with no hierarchy</li>
                  <li>• Simple, direct benefit coverage</li>
                  <li>• Easier to understand and manage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Render based on view mode */}
          {viewMode === "unified" ? renderUnifiedView() : renderSeparatedView()}

          {/* Summary statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="text-sm opacity-90">Multi-Level Limits</div>
              <div className="text-2xl font-bold">{limitStructure.filter((l) => l.limitType === "nested").length}</div>
              <div className="text-xs opacity-75">Hierarchical structures</div>
            </div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-4 text-white">
              <div className="text-sm opacity-90">Standalone Limits</div>
              <div className="text-2xl font-bold">{limitStructure.filter((l) => l.limitType === "flat").length}</div>
              <div className="text-xs opacity-75">Independent limits</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="text-sm opacity-90">Total Coverage</div>
              <div className="text-2xl font-bold">RM 18.3K</div>
              <div className="text-xs opacity-75">Combined limit value</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="text-sm opacity-90">Overall Usage</div>
              <div className="text-2xl font-bold">12.8%</div>
              <div className="text-xs opacity-75">Across all limits</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
