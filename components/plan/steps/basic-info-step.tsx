"use client"

import { cn } from "@/lib/utils"

import { useFormikContext, Field, ErrorMessage } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Switch } from "@/components/ui/switch"
import type { PlanCreationFormValues } from "@/types/plan-creation-form"
import { ServiceConfigurationSection } from "@/components/plan/sub-components/service-configuration-section"
import { EligibilityCriteriaSection } from "@/components/plan/sub-components/eligibility-criteria-section"
import { MaternityCoverageSection } from "@/components/plan/sub-components/maternity-coverage-section"
import { Checkbox } from "@/components/ui/checkbox"

interface BasicInfoStepProps {
  onProviderSelectionToggle: (enabled: boolean) => void
  onSpecialRulesToggle: (enabled: boolean) => void
}

export function BasicInfoStep({ onProviderSelectionToggle, onSpecialRulesToggle }: BasicInfoStepProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<PlanCreationFormValues>()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Plan Information</CardTitle>
          <CardDescription>Enter the basic details for your new plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Field
                as={Input}
                id="planName"
                name="planName"
                placeholder="Enter plan name"
                className={errors.planName && touched.planName ? "border-red-500" : ""}
              />
              <ErrorMessage name="planName" component="p" className="text-red-500 text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planType">Plan Type</Label>
              <Select onValueChange={(value) => setFieldValue("planType", value)} value={values.planType}>
                <SelectTrigger className={errors.planType && touched.planType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select plan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Insured">Insured</SelectItem>
                  <SelectItem value="Self-Funded">Self-Funded</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage name="planType" component="p" className="text-red-500 text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DatePicker
              label="Effective Date"
              date={values.effectiveDate}
              setDate={(date) => {
                setFieldValue("effectiveDate", date)
                // If effective date changes and is after expiry date, clear expiry date
                if (date && values.expiryDate && date > values.expiryDate) {
                  setFieldValue("expiryDate", undefined)
                }
              }}
              minDate={new Date()} // Set minDate to today
              className={errors.effectiveDate && touched.effectiveDate ? "border-red-500" : ""}
              helperText="Plan start date cannot be in the past"
            />
            <DatePicker
              label="Expiry Date"
              date={values.expiryDate}
              setDate={(date) => setFieldValue("expiryDate", date)}
              disabled={(date) => !values.effectiveDate || date < values.effectiveDate}
              className={errors.expiryDate && touched.expiryDate ? "border-red-500" : ""}
              helperText="Please select an effective date first"
            />
          </div>

          {/* Service Configuration Section */}
          <ServiceConfigurationSection />

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Enter plan description"
              rows={3}
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.description && touched.description ? "border-red-500" : "",
              )}
            />
            <ErrorMessage name="description" component="p" className="text-red-500 text-xs" />
          </div>

          {/* Plan Features */}
          <div className="space-y-4">
            <CardTitle className="text-lg">Plan Features</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="billbackEnabled"
                checked={values.billbackEnabled}
                onCheckedChange={(checked) => setFieldValue("billbackEnabled", checked)}
              />
              <Label htmlFor="billbackEnabled">Billback</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="specialRulesEnabled"
                checked={values.specialRulesEnabled}
                onCheckedChange={(checked) => {
                  setFieldValue("specialRulesEnabled", checked)
                  onSpecialRulesToggle(checked)
                }}
              />
              <Label htmlFor="specialRulesEnabled">
                Special Rules (Co-Payment, Deductible, Co-Insurance & Max Out-of-Pocket)
              </Label>
            </div>
          </div>

          {/* Eligibility Criteria Section */}
          <Card className="p-4 border shadow-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-lg">Eligibility Criteria</CardTitle>
                <CardDescription>
                  Set age limits, family coverage rules, and other eligibility requirements
                </CardDescription>
              </div>
              <Switch
                checked={values.eligibilityCriteriaEnabled}
                onCheckedChange={(checked) => setFieldValue("eligibilityCriteriaEnabled", checked)}
              />
            </div>
            {values.eligibilityCriteriaEnabled && <EligibilityCriteriaSection />}
          </Card>

          {/* Maternity Coverage Section */}
          <Card className="p-4 border shadow-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-lg">Maternity Coverage</CardTitle>
                <CardDescription>Configure maternity benefits for this plan</CardDescription>
              </div>
              <Switch
                checked={values.maternityCoverageEnabled}
                onCheckedChange={(checked) => setFieldValue("maternityCoverageEnabled", checked)}
              />
            </div>
            {values.maternityCoverageEnabled && <MaternityCoverageSection />}
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
