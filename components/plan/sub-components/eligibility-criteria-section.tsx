"use client"

import { useFormikContext, Field, ErrorMessage } from "formik"
import { CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { PlanCreationFormValues } from "@/types/plan-creation-form"
import { cn } from "@/lib/utils"

export function EligibilityCriteriaSection() {
  const { values, setFieldValue, errors, touched } = useFormikContext<PlanCreationFormValues>()

  const getFieldError = (fieldPath: string) => {
    return (errors.eligibility as any)?.[fieldPath]
  }

  const getFieldTouched = (fieldPath: string) => {
    return (touched.eligibility as any)?.[fieldPath]
  }

  return (
    <div className="space-y-6">
      {/* Primary Member Age Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="eligibility.primaryMemberMinAge">Primary Member's Age Requirements</Label>
          <div className="flex items-center gap-2">
            <Field
              as={Input}
              type="number"
              id="eligibility.primaryMemberMinAge"
              name="eligibility.primaryMemberMinAge"
              placeholder="Minimum Age"
              className={cn(
                getFieldError("primaryMemberMinAge") && getFieldTouched("primaryMemberMinAge") ? "border-red-500" : "",
              )}
            />
            <span>years</span>
          </div>
          <ErrorMessage name="eligibility.primaryMemberMinAge" component="p" className="text-red-500 text-xs" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eligibility.primaryMemberMaxAge" className="sr-only">
            Maximum Age
          </Label>
          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <Field
              as={Input}
              type="number"
              id="eligibility.primaryMemberMaxAge"
              name="eligibility.primaryMemberMaxAge"
              placeholder="Maximum Age"
              className={cn(
                getFieldError("primaryMemberMaxAge") && getFieldTouched("primaryMemberMaxAge") ? "border-red-500" : "",
              )}
            />
            <span>years</span>
          </div>
          <ErrorMessage name="eligibility.primaryMemberMaxAge" component="p" className="text-red-500 text-xs" />
        </div>
      </div>

      {/* Spouse Age Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="eligibility.spouseMinAge">Spouse Age Requirements</Label>
          <div className="flex items-center gap-2">
            <Field
              as={Input}
              type="number"
              id="eligibility.spouseMinAge"
              name="eligibility.spouseMinAge"
              placeholder="Minimum Age"
              className={cn(getFieldError("spouseMinAge") && getFieldTouched("spouseMinAge") ? "border-red-500" : "")}
            />
            <span>years</span>
          </div>
          <ErrorMessage name="eligibility.spouseMinAge" component="p" className="text-red-500 text-xs" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eligibility.spouseMaxAge" className="sr-only">
            Maximum Age
          </Label>
          <div className="flex items-center gap-2 mt-6 md:mt-0">
            <Field
              as={Input}
              type="number"
              id="eligibility.spouseMaxAge"
              name="eligibility.spouseMaxAge"
              placeholder="Maximum Age"
              className={cn(getFieldError("spouseMaxAge") && getFieldTouched("spouseMaxAge") ? "border-red-500" : "")}
            />
            <span>years</span>
          </div>
          <ErrorMessage name="eligibility.spouseMaxAge" component="p" className="text-red-500 text-xs" />
        </div>
      </div>

      {/* Child Age Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="eligibility.maxChildAge">Maximum Child Age</Label>
          <div className="flex items-center gap-2">
            <Field
              as={Input}
              type="number"
              id="eligibility.maxChildAge"
              name="eligibility.maxChildAge"
              placeholder="21"
              className={cn(getFieldError("maxChildAge") && getFieldTouched("maxChildAge") ? "border-red-500" : "")}
            />
            <span>years</span>
          </div>
          <ErrorMessage name="eligibility.maxChildAge" component="p" className="text-red-500 text-xs" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eligibility.maxAgeIfStudying">Max Age If Studying</Label>
          <div className="flex items-center gap-2">
            <Field
              as={Input}
              type="number"
              id="eligibility.maxAgeIfStudying"
              name="eligibility.maxAgeIfStudying"
              placeholder="25"
              className={cn(
                getFieldError("maxAgeIfStudying") && getFieldTouched("maxAgeIfStudying") ? "border-red-500" : "",
              )}
            />
            <span>years</span>
          </div>
          <ErrorMessage name="eligibility.maxAgeIfStudying" component="p" className="text-red-500 text-xs" />
        </div>
      </div>

      {/* Family Coverage Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="eligibility.maxSpouses">Maximum Spouses</Label>
          <Select
            onValueChange={(value) => setFieldValue("eligibility.maxSpouses", Number(value))}
            value={values.eligibility.maxSpouses.toString()}
          >
            <SelectTrigger
              id="eligibility.maxSpouses"
              className={cn(getFieldError("maxSpouses") && getFieldTouched("maxSpouses") ? "border-red-500" : "")}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => i).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage name="eligibility.maxSpouses" component="p" className="text-red-500 text-xs" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eligibility.maxChildren">Maximum Children</Label>
          <Select
            onValueChange={(value) => setFieldValue("eligibility.maxChildren", Number(value))}
            value={values.eligibility.maxChildren.toString()}
          >
            <SelectTrigger
              id="eligibility.maxChildren"
              className={cn(getFieldError("maxChildren") && getFieldTouched("maxChildren") ? "border-red-500" : "")}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => i).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage name="eligibility.maxChildren" component="p" className="text-red-500 text-xs" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="eligibility.coverDisabledChildren"
          checked={values.eligibility.coverDisabledChildren}
          onCheckedChange={(checked) => setFieldValue("eligibility.coverDisabledChildren", checked)}
        />
        <Label htmlFor="eligibility.coverDisabledChildren">Cover disabled children beyond normal age limit</Label>
      </div>

      {/* Coverage Rules */}
      <div className="space-y-4">
        <CardTitle className="text-lg">Coverage Rules</CardTitle>
        <div className="space-y-2">
          <Label>Spouse Coverage by Gender</Label>
          <RadioGroup
            onValueChange={(value: "Yes" | "No") => setFieldValue("eligibility.spouseCoverageByGender", value)}
            value={values.eligibility.spouseCoverageByGender}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="spouse-gender-no" />
              <Label htmlFor="spouse-gender-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="spouse-gender-yes" />
              <Label htmlFor="spouse-gender-yes">Yes</Label>
            </div>
          </RadioGroup>
          <ErrorMessage name="eligibility.spouseCoverageByGender" component="p" className="text-red-500 text-xs" />
          <p className="text-sm text-gray-500">Allow spouse coverage regardless of gender</p>
        </div>

        <div className="space-y-2">
          <Label>Spouse Coverage by Employment Status</Label>
          <RadioGroup
            onValueChange={(value: "Yes" | "No") =>
              setFieldValue("eligibility.spouseCoverageByEmploymentStatus", value)
            }
            value={values.eligibility.spouseCoverageByEmploymentStatus}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="spouse-employment-no" />
              <Label htmlFor="spouse-employment-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="spouse-employment-yes" />
              <Label htmlFor="spouse-employment-yes">Yes</Label>
            </div>
          </RadioGroup>
          <ErrorMessage
            name="eligibility.spouseCoverageByEmploymentStatus"
            component="p"
            className="text-red-500 text-xs"
          />
          <p className="text-sm text-gray-500">Restrict spouse coverage based on their employment</p>
        </div>
      </div>
    </div>
  )
}
