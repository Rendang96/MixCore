"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SpecialRulesStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Rules</CardTitle>
        <CardDescription>Configure special rules for the plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Special Rules configuration will go here.</p>
      </CardContent>
    </Card>
  )
}
