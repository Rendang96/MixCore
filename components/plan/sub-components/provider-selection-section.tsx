"use client"

import { useFormikContext } from "formik"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { PlanCreationFormValues, ProviderSelectionRecord } from "@/types/plan-creation-form"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multi-select" // Import the new MultiSelect

const MALAYSIAN_STATES = [
  { label: "Johor", value: "Johor" },
  { label: "Kedah", value: "Kedah" },
  { label: "Kelantan", value: "Kelantan" },
  { label: "Malacca", value: "Malacca" },
  { label: "Negeri Sembilan", value: "Negeri Sembilan" },
  { label: "Pahang", value: "Pahang" },
  { label: "Penang", value: "Penang" },
  { label: "Perak", value: "Perak" },
  { label: "Perlis", value: "Perlis" },
  { label: "Sabah", value: "Sabah" },
  { label: "Sarawak", value: "Sarawak" },
  { label: "Selangor", value: "Selangor" },
  { label: "Terengganu", value: "Terengganu" },
  { label: "Kuala Lumpur", value: "Kuala Lumpur" },
  { label: "Labuan", value: "Labuan" },
  { label: "Putrajaya", value: "Putrajaya" },
]

export function ProviderSelectionSection() {
  const { values, setFieldValue, errors, touched } = useFormikContext<PlanCreationFormValues>()
  const [nextRecordId, setNextRecordId] = useState(
    values.providerSelectionRecords.length > 0
      ? Math.max(...values.providerSelectionRecords.map((r) => Number.parseInt(r.id.replace("record-", "")))) + 1
      : 1,
  )

  const addRecord = () => {
    const newRecord: ProviderSelectionRecord = {
      id: `record-${nextRecordId}`,
      providerTypes: [],
      providerCategories: [],
      paymentMethods: [],
      panelship: "",
      state: [], // Initialize as empty array for multi-select
      accessRule: "",
    }
    // Add new record to the top
    setFieldValue("providerSelectionRecords", [newRecord, ...values.providerSelectionRecords])
    setNextRecordId(nextRecordId + 1)
  }

  // Auto-add first record if section is enabled and no records exist
  useEffect(() => {
    if (values.providerSelectionEnabled && values.providerSelectionRecords.length === 0) {
      addRecord()
    }
  }, [values.providerSelectionEnabled, values.providerSelectionRecords.length]) // Depend on these values

  const deleteRecord = (idToDelete: string) => {
    setFieldValue(
      "providerSelectionRecords",
      values.providerSelectionRecords.filter((record) => record.id !== idToDelete),
    )
  }

  const deleteAllRecords = () => {
    setFieldValue("providerSelectionRecords", [])
  }

  const handleCheckboxChange = (
    recordIndex: number,
    field: keyof ProviderSelectionRecord,
    value: string,
    isChecked: boolean,
  ) => {
    // Ensure currentArray is always an array, even if the field was undefined
    const currentArray = (values.providerSelectionRecords[recordIndex][field] || []) as string[]
    if (isChecked) {
      setFieldValue(`providerSelectionRecords.${recordIndex}.${field}`, [...currentArray, value])
    } else {
      setFieldValue(
        `providerSelectionRecords.${recordIndex}.${field}`,
        currentArray.filter((item) => item !== value),
      )
    }
  }

  const getRecordErrors = (index: number) => {
    if (errors.providerSelectionRecords && touched.providerSelectionRecords) {
      return (errors.providerSelectionRecords as any)?.[index]
    }
    return undefined
  }

  const getRecordTouched = (index: number) => {
    if (touched.providerSelectionRecords) {
      return (touched.providerSelectionRecords as any)?.[index]
    }
    return undefined
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-base">Provider Selection Records</CardTitle>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={addRecord} className="bg-black text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          <Button type="button" variant="outline" onClick={deleteAllRecords} className="bg-black text-white">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
        </div>
      </div>

      {values.providerSelectionRecords.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No provider selection records added yet.</p>
      )}

      {values.providerSelectionRecords.map((record, index) => {
        const recordErrors = getRecordErrors(index)
        const recordTouched = getRecordTouched(index)

        // Safely access properties by providing a fallback empty array
        const currentProviderTypes = record.providerTypes || []
        const currentProviderCategories = record.providerCategories || []
        const currentPaymentMethods = record.paymentMethods || []
        const currentStates = record.state || [] // For multi-select

        const isRecordComplete =
          currentProviderTypes.length > 0 &&
          currentProviderCategories.length > 0 &&
          currentPaymentMethods.length > 0 &&
          record.panelship !== "" &&
          currentStates.length > 0 && // Check length for multi-select
          record.accessRule !== ""

        return (
          <Card key={record.id} className="p-4 border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Provider Selection Record #{index + 1}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => deleteRecord(record.id)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete Record
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Hospitals", "SP Clinics", "GP Clinics", "Pharmacies", "Physiotherapy Centers"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`providerType-${record.id}-${type}`}
                        checked={currentProviderTypes.includes(type)} // Use currentProviderTypes
                        onCheckedChange={(checked) => handleCheckboxChange(index, "providerTypes", type, !!checked)}
                      />
                      <Label htmlFor={`providerType-${record.id}-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
                {recordErrors?.providerTypes && recordTouched?.providerTypes && (
                  <p className="text-red-500 text-xs">{recordErrors.providerTypes}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Provider Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Government", "Semi-Government", "Private"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`providerCategory-${record.id}-${category}`}
                        checked={currentProviderCategories.includes(category)} // Use currentProviderCategories
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(index, "providerCategories", category, !!checked)
                        }
                      />
                      <Label htmlFor={`providerCategory-${record.id}-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
                {recordErrors?.providerCategories && recordTouched?.providerCategories && (
                  <p className="text-red-500 text-xs">{recordErrors.providerCategories}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Cashless", "Pay and Claim"].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`paymentMethod-${record.id}-${method}`}
                        checked={currentPaymentMethods.includes(method)} // Use currentPaymentMethods
                        onCheckedChange={(checked) => handleCheckboxChange(index, "paymentMethods", method, !!checked)}
                      />
                      <Label htmlFor={`paymentMethod-${record.id}-${method}`}>{method}</Label>
                    </div>
                  ))}
                </div>
                {recordErrors?.paymentMethods && recordTouched?.paymentMethods && (
                  <p className="text-red-500 text-xs">{recordErrors.paymentMethods}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`panelship-${record.id}`}>Panelship</Label>
                <Select
                  onValueChange={(value) => setFieldValue(`providerSelectionRecords.${index}.panelship`, value)}
                  value={record.panelship}
                >
                  <SelectTrigger
                    id={`panelship-${record.id}`}
                    className={cn(recordErrors?.panelship && recordTouched?.panelship ? "border-red-500" : "")}
                  >
                    <SelectValue placeholder="Select Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Panel">Panel</SelectItem>
                    <SelectItem value="Non Panel">Non Panel</SelectItem>
                    <SelectItem value="Select Access">Select Access</SelectItem>
                  </SelectContent>
                </Select>
                {recordErrors?.panelship && recordTouched?.panelship && (
                  <p className="text-red-500 text-xs">{recordErrors.panelship}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`state-${record.id}`}>State</Label>
                <MultiSelect
                  options={MALAYSIAN_STATES}
                  selected={currentStates}
                  onValueChange={(values) => setFieldValue(`providerSelectionRecords.${index}.state`, values)}
                  placeholder="Select states"
                  className={cn(recordErrors?.state && recordTouched?.state ? "border-red-500" : "")}
                />
                {recordErrors?.state && recordTouched?.state && (
                  <p className="text-red-500 text-xs">{recordErrors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`accessRule-${record.id}`}>Access Rule</Label>
                <Select
                  onValueChange={(value) => setFieldValue(`providerSelectionRecords.${index}.accessRule`, value)}
                  value={record.accessRule}
                >
                  <SelectTrigger
                    id={`accessRule-${record.id}`}
                    className={cn(recordErrors?.accessRule && recordTouched?.accessRule ? "border-red-500" : "")}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct Access">Direct Access</SelectItem>
                    <SelectItem value="Referral Letter">Referral Letter</SelectItem>
                    <SelectItem value="Guarantee Letter">Guarantee Letter</SelectItem>
                  </SelectContent>
                </Select>
                {recordErrors?.accessRule && recordTouched?.accessRule && (
                  <p className="text-red-500 text-xs">{recordErrors.accessRule}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <div>
                Record #{index + 1} Summary: Establishment Types: {currentProviderTypes.length} Provider Categories:{" "}
                {currentProviderCategories.length} Payment Methods: {currentPaymentMethods.length}
              </div>
              <div className={cn("font-semibold", isRecordComplete ? "text-green-600" : "text-red-600")}>
                Configuration Status: {isRecordComplete ? "Complete" : "Incomplete"}
              </div>
            </div>
          </Card>
        )
      })}
      {errors.providerSelectionRecords &&
        touched.providerSelectionRecords &&
        typeof errors.providerSelectionRecords === "string" && (
          <p className="text-red-500 text-xs mt-2">{errors.providerSelectionRecords}</p>
        )}
    </div>
  )
}
