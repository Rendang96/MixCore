"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Upload, Download } from "lucide-react"

interface AddBulkPersonProps {
  onBack: () => void
}

export function AddBulkPerson({ onBack }: AddBulkPersonProps) {
  const handleSubmit = () => {
    // Handle bulk person submission logic here
    // After successful submission, go back to search
    onBack()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Add Bulk Persons</h2>
        <Button variant="outline" className="flex items-center gap-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Bulk Person Entry</h3>
            <p className="text-sm text-slate-600 mb-4">
              Upload a file or enter multiple person records in the text area below. Each line should contain person
              information separated by commas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Upload File</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-2">Drag and drop your file here, or click to browse</p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <span className="text-xs text-slate-500">Download sample template for bulk upload</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-slate-800 mb-3">Data Validation Options</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-slate-700">Validate duplicate Person IDs</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-slate-700">Validate ID Number format</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-slate-700">Skip invalid records</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-slate-700">Generate validation report</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSubmit}>
              Process Bulk Data
            </Button>
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button variant="outline">Validate Only</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
