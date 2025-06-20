"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BenefitLimitsStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Benefit Limits</CardTitle>
        <CardDescription>Configure benefit limits for the plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Benefit Limits configuration will go here.</p>
      </CardContent>
    </Card>
  )
}
