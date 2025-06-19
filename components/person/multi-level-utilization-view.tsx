"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getOnboardingMemberships } from "@/lib/integration/person-onboarding-integration"

interface MultiLevelUtilizationViewProps {
  personId: string
  planCode: string
  onBack: () => void
}

interface UtilizationLimit {
  id: string
  name: string
  serviceTypes: string[]
  limit: string
  utilized: string
  remaining: string
  percentage: number
  children?: UtilizationLimit[]
}

interface ClaimItem {
  date: string
  provider: string
  serviceType: string
  amount: string
  status: string
  claimNo: string
  impactedLimits: string[]
}

export function MultiLevelUtilizationView({ personId, planCode, onBack }: MultiLevelUtilizationViewProps) {
  const [planName, setPlanName] = useState<string>("")
  const [membershipNo, setMembershipNo] = useState<string>("")
  const [effectiveDate, setEffectiveDate] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [claims, setClaims] = useState<ClaimItem[]>([])
  const [activeTab, setActiveTab] = useState<string>("visualization")

  // Multi-level limit structure - Updated to MYR currency
  const [limitStructure, setLimitStructure] = useState<UtilizationLimit[]>([
    {
      id: "top-level",
      name: "OP: GP, SP, OC, DT",
      serviceTypes: ["GP", "SP", "OC", "DT"],
      limit: "RM 1,500.00",
      utilized: "RM 150.00",
      remaining: "RM 1,350.00",
      percentage: 10,
      children: [
        {
          id: "mid-level",
          name: "OC, DT",
          serviceTypes: ["OC", "DT"],
          limit: "RM 500.00",
          utilized: "RM 50.00",
          remaining: "RM 450.00",
          percentage: 10,
          children: [
            {
              id: "inner-level",
              name: "DT",
              serviceTypes: ["DT"],
              limit: "RM 200.00",
              utilized: "RM 0.00",
              remaining: "RM 200.00",
              percentage: 0,
            },
          ],
        },
      ],
    },
  ])

  useEffect(() => {
    // Fetch plan details for the specific person and plan code
    const memberships = getOnboardingMemberships()
    const targetMembership = memberships.find((m) => m.personId === personId && m.planCode === planCode)

    if (targetMembership) {
      setPlanName(targetMembership.planName)
      setMembershipNo(targetMembership.membershipNo || "")
      setEffectiveDate(targetMembership.effectiveDate)
      setExpiryDate(targetMembership.expiryDate)

      // Transform visit history to claims with impacted limits
      if (targetMembership.visitHistory) {
        const transformedClaims = targetMembership.visitHistory.map((visit) => {
          const serviceType =
            visit.serviceType === "Outpatient"
              ? "GP"
              : visit.serviceType === "Dental"
                ? "DT"
                : visit.serviceType === "Optical"
                  ? "OC"
                  : visit.serviceType === "Specialist"
                    ? "SP"
                    : visit.serviceType

          // Determine which limits are impacted by this claim
          const impactedLimits = []

          // Top level is always impacted
          impactedLimits.push("OP: GP, SP, OC, DT")

          // Check if OC or DT for mid-level
          if (serviceType === "OC" || serviceType === "DT") {
            impactedLimits.push("OC, DT")
          }

          // Check if DT for inner level
          if (serviceType === "DT") {
            impactedLimits.push("DT")
          }

          return {
            ...visit,
            serviceType,
            impactedLimits,
          }
        })

        setClaims(transformedClaims)
      }
    }
  }, [personId, planCode])

  const getServiceTypeColor = (serviceType: string) => {
    const colors: Record<string, string> = {
      GP: "bg-blue-500",
      SP: "bg-purple-500",
      OC: "bg-green-500",
      DT: "bg-amber-500",
    }
    return colors[serviceType] || "bg-gray-500"
  }

  const getServiceTypeName = (serviceType: string) => {
    const names: Record<string, string> = {
      GP: "General Practitioner",
      SP: "Specialist",
      OC: "Optical Care",
      DT: "Dental Treatment",
    }
    return names[serviceType] || serviceType
  }

  const renderLimitStructure = (limits: UtilizationLimit[], level = 0) => {
    return limits.map((limit) => (
      <div key={limit.id} className="mb-4">
        {/* Indentation wrapper */}
        <div
          style={{
            marginLeft: level === 0 ? "0px" : level === 1 ? "40px" : "80px",
          }}
        >
          {/* New card design matching the uploaded image */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
            {/* Top row with service types and main limit amount */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ChevronDown className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-800">{limit.serviceTypes.join(", ")}</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{limit.limit}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {level === 0 ? "1st Tier Limit" : level === 1 ? "2nd Tier Limit" : "3rd Tier Limit"}
                </div>
                <div className="text-xs text-gray-600">
                  {level === 0 ? "Combine limit" : level === 1 ? "Nested limit" : "Inner limit"}
                </div>
              </div>
            </div>

            {/* Bottom row with utilized and remaining */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-700">
                Utilized: <span className="font-medium">{limit.utilized}</span>
              </div>
              <div className="text-sm text-gray-700">
                Remaining: <span className="font-medium text-green-600">{limit.remaining}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${limit.percentage}%` }}
              ></div>
            </div>

            {/* Tier label on the left */}
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
              <div
                className={`
    px-3 py-1 rounded-r-lg text-xs font-bold text-white shadow-md
    ${level === 0 ? "bg-blue-600" : ""}
    ${level === 1 ? "bg-purple-600" : ""}
    ${level === 2 ? "bg-green-600" : ""}
  `}
              >
                {level === 0 ? "1st Tier" : level === 1 ? "2nd Tier" : "3rd Tier"}
              </div>
            </div>
          </div>
        </div>

        {/* Render children */}
        {limit.children && limit.children.length > 0 && (
          <div className="mt-4">{renderLimitStructure(limit.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Multi-Level Utilization</h2>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="visualization">Limit Visualization</TabsTrigger>
          <TabsTrigger value="claims">Claims Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization">
          <div className="space-y-6">
            {/* Header with legend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <span>Multi-Level Limit Structure</span>
                </CardTitle>
                <CardDescription>
                  Interactive visualization of nested benefit limits showing current utilization across all levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Service type legend */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Service Type Legend</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">GP - General Practitioner</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium">SP - Specialist</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-lg px-3 2 shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">OC - Optical Care</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium">DT - Dental Treatment</span>
                    </div>
                  </div>
                </div>

                {/* Hierarchy explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">How Nested Limits Work</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      • <strong>Primary Limit:</strong> Overall combined limit for all covered services
                    </p>
                    <p>
                      • <strong>Nested Limit:</strong> Specific sub-limit within the primary limit for certain services
                    </p>
                    <p>
                      • <strong>Inner Limit:</strong> Additional restriction within the nested limit for specific
                      service types
                    </p>
                  </div>
                </div>

                {/* Limit structure visualization */}
                <div className="space-y-6">{renderLimitStructure(limitStructure)}</div>

                {/* Summary statistics - Updated to MYR */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <div className="text-sm opacity-90">Total Limits</div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs opacity-75">Active limit levels</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <div className="text-sm opacity-90">Available Balance</div>
                    <div className="text-2xl font-bold">RM 1.35K</div>
                    <div className="text-xs opacity-75">Primary limit remaining</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="text-sm opacity-90">Overall Usage</div>
                    <div className="text-2xl font-bold">10%</div>
                    <div className="text-xs opacity-75">Of primary limit used</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>Claims Impact Analysis</CardTitle>
              <CardDescription>How each claim affects different levels of limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Provider</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Service Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Claim No</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Impacted Limits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {claims.map((claim, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{claim.date}</td>
                        <td className="px-4 py-3 text-sm">{claim.provider}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <div
                              className={`h-3 w-3 rounded-full ${getServiceTypeColor(claim.serviceType)} mr-2`}
                            ></div>
                            <span>{getServiceTypeName(claim.serviceType)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{claim.amount}</td>
                        <td className="px-4 py-3 text-sm">{claim.claimNo}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {claim.impactedLimits.map((limit, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {limit}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {claims.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                          No claims data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
