"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { PayorContact } from "@/components/payor/payor-search"

interface ViewContactDetailProps {
  contact: PayorContact
  onBack: () => void
}

export function ViewContactDetail({ contact, onBack }: ViewContactDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">View Contact Details</h2>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Contact Name</p>
            <p className="font-medium">{contact.name}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Contact Category</p>
            <p className="font-medium">{contact.category}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Designation</p>
            <p className="font-medium">{contact.designation}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="font-medium">{contact.email}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Mobile No.</p>
            <p className="font-medium">{contact.mobileNo}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Office No.</p>
            <p className="font-medium">{contact.officeNo}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Ext. No.</p>
            <p className="font-medium">{contact.extNo}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <p
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                contact.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {contact.status}
            </p>
          </div>

          <div className="space-y-2 col-span-2">
            <p className="text-sm font-medium text-slate-500">Remarks</p>
            <p className="font-medium">{contact.remarks}</p>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}
