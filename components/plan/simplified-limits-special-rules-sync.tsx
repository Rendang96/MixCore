"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

interface SimplifiedLimitsSpecialRulesSyncProps {
  limits: any[]
  specialRules: any
}

export function SimplifiedLimitsSpecialRulesSync({ limits, specialRules }: SimplifiedLimitsSpecialRulesSyncProps) {
  const hasLimits = limits && limits.length > 0
  const hasSpecialRules =
    specialRules &&
    ((specialRules.coPayments && specialRules.coPayments.length > 0) ||
      (specialRules.linkedLimits && specialRules.linkedLimits.length > 0) ||
      specialRules.additiveLimit)

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Synchronization Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Benefit Limits</span>
            <div className="flex items-center gap-2">
              {hasLimits ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {limits.length} configured
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    None configured
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Special Rules</span>
            <div className="flex items-center gap-2">
              {hasSpecialRules ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Configured
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    None configured
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              {hasLimits && hasSpecialRules ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Limits and special rules are properly synchronized</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Configuration is in progress</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
