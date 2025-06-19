"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface SOBFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: any
  onSaveData?: (data: any) => void
}

export function SOBForm({ onNext, onBack, initialData, onSaveData }: SOBFormProps) {
  const [sobName, setSobName] = useState<string>(initialData?.sobName || "")
  const [sobCode, setSobCode] = useState<string>(initialData?.sobCode || "")
  const [effectiveDate, setEffectiveDate] = useState<string>(initialData?.effectiveDate || "")
  const [expiryDate, setExpiryDate] = useState<string>(initialData?.expiryDate || "")
  const [remarks, setRemarks] = useState<string>(initialData?.remarks || "")
  const [fileName, setFileName] = useState<string>(initialData?.fileName || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      setSobName(initialData.sobName || "")
      setSobCode(initialData.sobCode || "")
      setEffectiveDate(initialData.effectiveDate || "")
      setExpiryDate(initialData.expiryDate || "")
      setRemarks(initialData.remarks || "")
      setFileName(initialData.fileName || "")
    }
  }, [initialData])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    if (sobName.trim()) {
      // Generate SOB Code based on SOB Name
      const cleanName = sobName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
      const timestamp = Date.now().toString().slice(-4)
      const generatedCode = `SOB-${cleanName}-${timestamp}`
      setSobCode(generatedCode)
    } else {
      setSobCode("")
    }
  }, [sobName])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleEffectiveDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEffectiveDate(e.target.value)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(e.target.value)
  }

  const handleSave = () => {
    // Collect form data
    const sobData = {
      sobName,
      sobCode: sobCode || `SOB-${Math.floor(1000 + Math.random() * 9000)}`,
      effectiveDate,
      expiryDate,
      remarks,
      fileName,
    }

    // Pass data to parent component if callback is provided
    if (onSaveData) {
      onSaveData(sobData)
    }

    // Proceed to next step
    onNext()
  }

  return (
    <div className="rounded-lg border bg-slate-50 p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">Schedule of Benefit</h3>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="sob-name" className="text-sm font-medium text-slate-700">
              SOB Name
            </label>
            <Input id="sob-name" className="w-full" value={sobName} onChange={(e) => setSobName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label htmlFor="sob-code" className="text-sm font-medium text-slate-700">
              SOB Code
            </label>
            <Input id="sob-code" placeholder="System auto generated" className="w-full" value={sobCode} readOnly />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="effective-date" className="text-sm font-medium text-slate-700">
              Effective Date
            </label>
            <Input
              id="effective-date"
              type="date"
              className="w-full"
              value={effectiveDate}
              onChange={handleEffectiveDateChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="expiry-date" className="text-sm font-medium text-slate-700">
              Expiry Date
            </label>
            <Input
              id="expiry-date"
              type="date"
              className="w-full"
              value={expiryDate}
              onChange={handleExpiryDateChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="remarks" className="text-sm font-medium text-slate-700">
            Remarks
          </label>
          <Textarea
            id="remarks"
            className="w-full min-h-[100px]"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sob-document" className="text-sm font-medium text-slate-700">
            SOB Document
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="sob-document"
                placeholder="File size max 10MB"
                className="w-full pr-10"
                value={fileName}
                readOnly
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700 whitespace-nowrap">Upload</Button>
            <Button variant="outline" className="whitespace-nowrap">
              Download
            </Button>
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => setShowPreviewDialog(true)}
              disabled={!fileName}
            >
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Preview: {fileName}</DialogTitle>
            <DialogDescription>
              This is a placeholder for the document preview. In a full application, the content of &quot;{fileName}
              &quot; would be displayed here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow border rounded-md p-4 overflow-auto bg-gray-50 text-gray-700">
            {fileName ? (
              <p>
                Preview functionality for <strong>{fileName}</strong> is not fully implemented in this demo.
                <br />
                In a production environment, you would see the parsed content of your document (e.g., Excel sheet data,
                PDF viewer, etc.) here.
              </p>
            ) : (
              <p>No file selected for preview.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
