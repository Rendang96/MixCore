"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PlusCircle, X } from "lucide-react"

export interface ReportConfig {
  id: string
  reportType: string
  reportFrequency: string
  deliveryMethod: string
  recipients: string
}

interface ReportFrequencyFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: ReportConfig[]
  onSaveData?: (data: ReportConfig[]) => void
}

export function ReportFrequencyForm({ onNext, onBack, initialData = [], onSaveData }: ReportFrequencyFormProps) {
  const [reportConfigs, setReportConfigs] = useState<ReportConfig[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: "config-1",
            reportType: "",
            reportFrequency: "",
            deliveryMethod: "",
            recipients: "",
          },
        ],
  )

  // Save data when it changes
  useEffect(() => {
    if (onSaveData) {
      onSaveData(reportConfigs)
    }
  }, [reportConfigs, onSaveData])

  const addNewConfig = () => {
    const newConfig: ReportConfig = {
      id: `config-${reportConfigs.length + 1}`,
      reportType: "",
      reportFrequency: "",
      deliveryMethod: "",
      recipients: "",
    }
    setReportConfigs([...reportConfigs, newConfig])
  }

  const removeConfig = (id: string) => {
    if (reportConfigs.length > 1) {
      setReportConfigs(reportConfigs.filter((config) => config.id !== id))
    }
  }

  const updateConfig = (id: string, field: keyof ReportConfig, value: string) => {
    setReportConfigs(reportConfigs.map((config) => (config.id === id ? { ...config, [field]: value } : config)))
  }

  const handleSave = () => {
    if (onSaveData) {
      onSaveData(reportConfigs)
    }
    onNext()
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-slate-800 mb-8">Report Frequency</h3>

      {reportConfigs.map((config, index) => (
        <div key={config.id} className="mb-8 p-4 border border-slate-200 rounded-md relative">
          {reportConfigs.length > 1 && (
            <button
              onClick={() => removeConfig(config.id)}
              className="absolute top-2 right-2 text-slate-500 hover:text-slate-700"
              aria-label="Remove configuration"
            >
              <X size={18} />
            </button>
          )}

          <div className="space-y-4 mb-4">
            <label className="text-sm font-medium text-slate-700">Report Type</label>
            <Select value={config.reportType} onValueChange={(value) => updateConfig(config.id, "reportType", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utilization">Utilization Report</SelectItem>
                <SelectItem value="claims">Claims Report</SelectItem>
                <SelectItem value="membership">Membership Report</SelectItem>
                <SelectItem value="financial">Financial Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 mb-4">
            <label className="text-sm font-medium text-slate-700">Report Frequency</label>
            <Select
              value={config.reportFrequency}
              onValueChange={(value) => updateConfig(config.id, "reportFrequency", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 mb-4">
            <label className="text-sm font-medium text-slate-700">Delivery Method</label>
            <Select
              value={config.deliveryMethod}
              onValueChange={(value) => updateConfig(config.id, "deliveryMethod", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="portal">Portal</SelectItem>
                <SelectItem value="physical">Physical Copy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 mb-4">
            <label className="text-sm font-medium text-slate-700">Recipients</label>
            <Input
              className="w-full"
              placeholder="Enter email addresses separated by commas"
              value={config.recipients}
              onChange={(e) => updateConfig(config.id, "recipients", e.target.value)}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addNewConfig} className="flex items-center gap-2 mb-8">
        <PlusCircle size={16} />
        Add New Report Configuration
      </Button>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
