"use client"

import { useFormikContext, Field } from "formik"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { PlanCreationFormValues } from "@/types/plan-creation-form"
import { cn } from "@/lib/utils"

export function MaternityCoverageSection() {
  const { values, setFieldValue, errors, touched } = useFormikContext<PlanCreationFormValues>()

  const handleStaffCategoryChange = (category: string, isChecked: boolean) => {
    const currentCategories = values.maternity.staffCategory
    if (isChecked) {
      setFieldValue("maternity.staffCategory", [...currentCategories, category])
    } else {
      setFieldValue(
        "maternity.staffCategory",
        currentCategories.filter((item) => item !== category),
      )
    }
  }

  const getFieldError = (fieldPath: string) => {
    return (errors.maternity as any)?.[fieldPath]
  }

  const getFieldTouched = (fieldPath: string) => {
    return (touched.maternity as any)?.[fieldPath]
  }

  return (
    <div className="space-y-6">
      {/* Staff Category Covered */}
      <div className="space-y-2">
        <Label>Staff Category Covered</Label>
        <div className="grid grid-cols-2 gap-4">
          {["All", "Permanent", "Contract", "Temporary"].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`staff-category-${category}`}
                checked={values.maternity.staffCategory.includes(category)}
                onCheckedChange={(checked) => handleStaffCategoryChange(category, !!checked)}
              />
              <Label htmlFor={`staff-category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
        {getFieldError("staffCategory") && getFieldTouched("staffCategory") && (
          <p className="text-red-500 text-xs">{getFieldError("staffCategory")}</p>
        )}
      </div>

      {/* Members Covered */}
      <div className="space-y-2">
        <Label>Members Covered</Label>
        <RadioGroup
          onValueChange={(value: "Staff only" | "Staff and Spouse") => setFieldValue("maternity.membersCovered", value)}
          value={values.maternity.membersCovered}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Staff only" id="members-staff-only" />
            <Label htmlFor="members-staff-only">Staff only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Staff and Spouse" id="members-staff-spouse" />
            <Label htmlFor="members-staff-spouse">Staff and Spouse</Label>
          </div>
        </RadioGroup>
        {getFieldError("membersCovered") && getFieldTouched("membersCovered") && (
          <p className="text-red-500 text-xs">{getFieldError("membersCovered")}</p>
        )}
      </div>

      {/* Total No. of Delivery */}
      <div className="space-y-2">
        <Label htmlFor="maternity.totalNoOfDeliveryType">Total No. of Delivery</Label>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value: "No. of Deliveries" | "No. of Surviving Children") =>
              setFieldValue("maternity.totalNoOfDeliveryType", value)
            }
            value={values.maternity.totalNoOfDeliveryType}
          >
            <SelectTrigger
              id="maternity.totalNoOfDeliveryType"
              className={cn(
                "w-[180px]",
                getFieldError("totalNoOfDeliveryType") && getFieldTouched("totalNoOfDeliveryType")
                  ? "border-red-500"
                  : "",
              )}
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No. of Deliveries">No. of Deliveries</SelectItem>
              <SelectItem value="No. of Surviving Children">No. of Surviving Children</SelectItem>
            </SelectContent>
          </Select>
          <Field
            as={Input}
            type="number"
            id="maternity.totalNoOfDeliveryValue"
            name="maternity.totalNoOfDeliveryValue"
            placeholder="Enter number"
            className={cn(
              "flex-grow",
              getFieldError("totalNoOfDeliveryValue") && getFieldTouched("totalNoOfDeliveryValue")
                ? "border-red-500"
                : "",
            )}
          />
        </div>
        {getFieldError("totalNoOfDeliveryType") && getFieldTouched("totalNoOfDeliveryType") && (
          <p className="text-red-500 text-xs">{getFieldError("totalNoOfDeliveryType")}</p>
        )}
        {getFieldError("totalNoOfDeliveryValue") && getFieldTouched("totalNoOfDeliveryValue") && (
          <p className="text-red-500 text-xs">{getFieldError("totalNoOfDeliveryValue")}</p>
        )}
      </div>

      {/* Waiting Period */}
      <div className="space-y-2">
        <Label htmlFor="maternity.waitingPeriod">Waiting Period</Label>
        <Select
          onValueChange={(value) => setFieldValue("maternity.waitingPeriod", value)}
          value={values.maternity.waitingPeriod}
        >
          <SelectTrigger
            id="maternity.waitingPeriod"
            className={cn(getFieldError("waitingPeriod") && getFieldTouched("waitingPeriod") ? "border-red-500" : "")}
          >
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="30 days">30 days</SelectItem>
            <SelectItem value="60 days">60 days</SelectItem>
            <SelectItem value="90 days">90 days</SelectItem>
          </SelectContent>
        </Select>
        {getFieldError("waitingPeriod") && getFieldTouched("waitingPeriod") && (
          <p className="text-red-500 text-xs">{getFieldError("waitingPeriod")}</p>
        )}
      </div>
    </div>
  )
}
