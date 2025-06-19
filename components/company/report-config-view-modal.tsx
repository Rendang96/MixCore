"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ReportConfig } from "./report-frequency-form"

interface ReportConfigViewModalProps {
  isOpen: boolean
  onClose: () => void
  reportConfig: ReportConfig
}

// Helper function to format report type for display
const formatReportType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    utilization: "Utilization Report",
    claims: "Claims Report",
    membership: "Membership Report",
    financial: "Financial Report",
  }
  return typeMap[type] || type
}

// Helper function to format frequency for display
const formatFrequency = (frequency: string): string => {
  const frequencyMap: { [key: string]: string } = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    annually: "Annually",
  }
  return frequencyMap[frequency] || frequency
}

// Helper function to format delivery method for display
const formatDeliveryMethod = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    email: "Email",
    portal: "Portal",
    physical: "Physical Copy",
  }
  return methodMap[method] || method
}

export function ReportConfigViewModal({ isOpen, onClose, reportConfig }: ReportConfigViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {formatReportType(reportConfig.reportType) || "Report Configuration"} Details
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Report Type</h4>
            <p className="text-slate-900">{formatReportType(reportConfig.reportType) || "Not specified"}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Frequency</h4>
            <p className="text-slate-900">{formatFrequency(reportConfig.reportFrequency) || "Not specified"}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Delivery Method</h4>
            <p className="text-slate-900">{formatDeliveryMethod(reportConfig.deliveryMethod) || "Not specified"}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Recipients</h4>
            <div className="text-slate-900">
              {reportConfig.recipients ? (
                <div className="space-y-1">
                  {reportConfig.recipients.split(",").map((email, index) => (
                    <div key={index} className="text-sm bg-slate-50 px-2 py-1 rounded">
                      {email.trim()}
                    </div>
                  ))}
                </div>
              ) : (
                "No recipients specified"
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
