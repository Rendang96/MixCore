"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

type TabType = "basic-info" | "contact-details"

// Define the Payor interface if not already imported
interface PayorContact {
  id: string
  name: string
  category: string
  designation: string
  email: string
  mobileNo: string
  officeNo: string
  extNo: string
  status: string
  remarks: string
}

interface Payor {
  id: string
  name: string
  code: string
  address: string
  city: string
  postcode: string
  state: string
  country: string
  remarks: string
  status: string
  contacts: PayorContact[]
}

interface ViewPayorProps {
  payor: Payor
  onBack: () => void
}

export function ViewPayor({ payor, onBack }: ViewPayorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic-info")

  // Breadcrumb items for View Payor
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Payor",
      onClick: onBack,
    },
    { label: "View Payor" },
  ]

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">View Payor</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "basic-info"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => handleTabClick("basic-info")}
        >
          Basic Information
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "contact-details"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => handleTabClick("contact-details")}
        >
          Contact Details
        </button>
      </div>

      {activeTab === "basic-info" ? (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="payor-name" className="text-sm font-medium text-slate-700">
                Payor Name
              </label>
              <Input id="payor-name" className="w-full bg-slate-50" value={payor.name} disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="payor-code" className="text-sm font-medium text-slate-700">
                Payor Code
              </label>
              <Input id="payor-code" className="w-full bg-slate-50" value={payor.code} disabled />
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-slate-700">
                Address
              </label>
              <Input id="address" className="w-full bg-slate-50" value={payor.address} disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="postcode" className="text-sm font-medium text-slate-700">
                Postcode
              </label>
              <Input id="postcode" className="w-full bg-slate-50" value={payor.postcode} disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-slate-700">
                City
              </label>
              <Select value={payor.city} disabled>
                <SelectTrigger id="city" className="w-full bg-slate-50">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="penang">Penang</SelectItem>
                  <SelectItem value="johor-bahru">Johor Bahru</SelectItem>
                  <SelectItem value="ipoh">Ipoh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-slate-700">
                State
              </label>
              <Select value={payor.state} disabled>
                <SelectTrigger id="state" className="w-full bg-slate-50">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selangor">Selangor</SelectItem>
                  <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="penang">Penang</SelectItem>
                  <SelectItem value="johor">Johor</SelectItem>
                  <SelectItem value="perak">Perak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-slate-700">
                Country
              </label>
              <Select value={payor.country} disabled>
                <SelectTrigger id="country" className="w-full bg-slate-50">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malaysia">Malaysia</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="thailand">Thailand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <label htmlFor="remarks" className="text-sm font-medium text-slate-700">
                Remarks
              </label>
              <Textarea id="remarks" className="w-full bg-slate-50" value={payor.remarks} disabled />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          {payor.contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No contact details available for this payor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-slate-500">
                    <th className="py-3 px-4">No.</th>
                    <th className="py-3 px-4">Contact Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Mobile No.</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {payor.contacts.map((contact, index) => (
                    <tr key={contact.id} className="text-slate-700">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{contact.name}</td>
                      <td className="py-3 px-4">{contact.category}</td>
                      <td className="py-3 px-4">{contact.designation}</td>
                      <td className="py-3 px-4">{contact.email}</td>
                      <td className="py-3 px-4">{contact.mobileNo}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            contact.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {contact.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
