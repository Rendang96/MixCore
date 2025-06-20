"use client"

import { useFormikContext } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlanCreationFormValues } from "@/types/plan-creation-form"
import { Label } from "@/components/ui/label"

export function ReviewStep() {
  const { values } = useFormikContext<PlanCreationFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Plan Configuration</CardTitle>
        <CardDescription>Review all the details before saving your new plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information Summary */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-sm">Plan Name</Label>
                <p className="text-sm text-gray-600">{values.planName || "N/A"}</p>
              </div>
              <div>
                <Label className="font-medium text-sm">Plan Type</Label>
                <p className="text-sm text-gray-600">{values.planType || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-sm">Effective Date</Label>
                <p className="text-sm text-gray-600">{values.effectiveDate?.toDateString() || "N/A"}</p>
              </div>
              <div>
                <Label className="font-medium text-sm">Expiry Date</Label>
                <p className="text-sm text-gray-600">{values.expiryDate?.toDateString() || "N/A"}</p>
              </div>
            </div>
            <div>
              <Label className="font-medium text-sm">Description</Label>
              <p className="text-sm text-gray-600">{values.description || "No description provided"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Features Summary */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Plan Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="font-medium text-sm">Provider Selection</Label>
              <p className="text-sm text-gray-600">{values.providerSelectionEnabled ? "Enabled" : "Disabled"}</p>
            </div>
            {values.providerSelectionEnabled && values.providerSelectionRecords.length > 0 && (
              <div>
                <Label className="font-medium text-sm">Provider Selection Records</Label>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {values.providerSelectionRecords.map((record, index) => (
                    <li key={record.id}>
                      Record #{index + 1}: Types ({record.providerTypes.join(", ")}), Categories (
                      {record.providerCategories.join(", ")}), Payment ({record.paymentMethods.join(", ")}), Panelship (
                      {record.panelship}), State ({record.state}), Access Rule ({record.accessRule})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <Label className="font-medium text-sm">Billback</Label>
              <p className="text-sm text-gray-600">{values.billbackEnabled ? "Enabled" : "Disabled"}</p>
            </div>
            <div>
              <Label className="font-medium text-sm">Special Rules</Label>
              <p className="text-sm text-gray-600">{values.specialRulesEnabled ? "Enabled" : "Disabled"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Service Configuration Summary */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Service Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {values.serviceConfigurations.filter((s) => s.subServices.some((ss) => ss.selected)).length > 0 ? (
              values.serviceConfigurations
                .filter((s) => s.subServices.some((ss) => ss.selected))
                .map((service) => (
                  <div key={service.code}>
                    <Label className="font-medium text-sm">
                      {service.name} (Auto Suspension: {service.autoSuspension}%)
                    </Label>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                      {service.subServices
                        .filter((sub) => sub.selected)
                        .map((sub) => (
                          <li key={sub.name}>{sub.name}</li>
                        ))}
                    </ul>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-600">No service types configured.</p>
            )}
          </CardContent>
        </Card>

        {/* Eligibility Criteria Summary */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {values.eligibilityCriteriaEnabled ? (
              <div className="space-y-2">
                <div>
                  <Label className="font-medium text-sm">Primary Member Age</Label>
                  <p className="text-sm text-gray-600">
                    {values.eligibility.primaryMemberMinAge} - {values.eligibility.primaryMemberMaxAge} years
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Spouse Age</Label>
                  <p className="text-sm text-gray-600">
                    {values.eligibility.spouseMinAge} - {values.eligibility.spouseMaxAge} years
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Child Age</Label>
                  <p className="text-sm text-gray-600">
                    Max Child Age: {values.eligibility.maxChildAge} years, Max Age if Studying:{" "}
                    {values.eligibility.maxAgeIfStudying} years
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Family Coverage Limits</Label>
                  <p className="text-sm text-gray-600">
                    Max Spouses: {values.eligibility.maxSpouses}, Max Children: {values.eligibility.maxChildren}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Cover Disabled Children</Label>
                  <p className="text-sm text-gray-600">{values.eligibility.coverDisabledChildren ? "Yes" : "No"}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Spouse Coverage by Gender</Label>
                  <p className="text-sm text-gray-600">{values.eligibility.spouseCoverageByGender}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Spouse Coverage by Employment Status</Label>
                  <p className="text-sm text-gray-600">{values.eligibility.spouseCoverageByEmploymentStatus}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Eligibility Criteria not enabled.</p>
            )}
          </CardContent>
        </Card>

        {/* Maternity Coverage Summary */}
        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Maternity Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {values.maternityCoverageEnabled ? (
              <div className="space-y-2">
                <div>
                  <Label className="font-medium text-sm">Staff Category Covered</Label>
                  <p className="text-sm text-gray-600">
                    {values.maternity.staffCategory.length > 0 ? values.maternity.staffCategory.join(", ") : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Members Covered</Label>
                  <p className="text-sm text-gray-600">{values.maternity.membersCovered || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Total No. of Delivery</Label>
                  <p className="text-sm text-gray-600">
                    {values.maternity.totalNoOfDeliveryValue} {values.maternity.totalNoOfDeliveryType}
                  </p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Waiting Period</Label>
                  <p className="text-sm text-gray-600">{values.maternity.waitingPeriod || "N/A"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Maternity Coverage not enabled.</p>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
