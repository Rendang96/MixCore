"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import type { Policy } from "./policy-search"
import { Calendar } from "lucide-react"
import { PolicyRuleTab } from "./policy-rule-tab"
import { ServiceTypeTab } from "./service-type-tab"
import { ContactInformationTab } from "./contact-information-tab"
import { saveBasicPolicyInfo } from "@/lib/policy/policy-storage"

interface CreateNewPolicyProps {
  onSave: (policy: Policy) => void
  onCancel: () => void
  onBreadcrumbClick: (path: string) => void
}

export function CreateNewPolicy({ onSave, onCancel, onBreadcrumbClick }: CreateNewPolicyProps) {
  const [policyId, setPolicyId] = useState("")
  const [policyNumber, setPolicyNumber] = useState("")
  const [policyName, setPolicyName] = useState("")
  const [fundingType, setFundingType] = useState("")
  const [policyTerm, setPolicyTerm] = useState("")
  const [effectiveDate, setEffectiveDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [status, setStatus] = useState("Active")
  const [activeTab, setActiveTab] = useState("basic")

  // Generate a new policy ID when the component mounts
  useEffect(() => {
    setPolicyId(uuidv4())
  }, [])

  const handleSaveBasicInfo = () => {
    // Create new policy object
    const newPolicy = {
      id: policyId,
      policyNumber,
      policyName,
      fundingType,
      policyTerm,
      effectiveDate,
      expiryDate,
      payor: "Sample Payor", // Default value
      status, // Use the status from state instead of hardcoded "Active"
    }

    // Save to local storage
    saveBasicPolicyInfo(newPolicy)

    // Show a success message or notification here if needed
    alert("Basic information saved successfully!")
  }

  const handleFinalSave = () => {
    // Create new policy object for the final save
    const newPolicy: Policy = {
      id: policyId,
      policyNumber,
      policyName,
      product: "N/A", // Default value
      fundingType,
      policyTerm,
      effectiveDate,
      expiryDate,
      payor: "Sample Payor", // Default value
      status, // Use the status from state instead of hardcoded "Active"
    }

    onSave(newPolicy)
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/", isHome: true, onClick: () => onBreadcrumbClick("home") },
            { label: "Policy", href: "#", onClick: () => onBreadcrumbClick("policy") },
            { label: "Create New Policy" },
          ]}
        />
        <h1 className="text-2xl font-semibold mt-4 mb-6">Create New Policy</h1>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${activeTab === "basic" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Information
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "policy-rule" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("policy-rule")}
          >
            Policy Rule
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "service-type" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("service-type")}
          >
            Service Type
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === "contact" ? "border-b-2 border-sky-600 text-sky-600" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Information
          </button>
        </div>
      </div>

      {activeTab === "basic" && (
        <Card className="rounded-lg border bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">Policy Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="policyNumber" className="text-sm font-medium text-slate-700">
                  Policy Number
                </label>
                <Input
                  id="policyNumber"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="Enter Policy Number"
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label htmlFor="policyName" className="text-sm font-medium text-slate-700">
                  Policy Name
                </label>
                <Input
                  id="policyName"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="Enter Policy Name"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label htmlFor="fundingType" className="text-sm font-medium text-slate-700">
                  Funding Type
                </label>
                <Select value={fundingType} onValueChange={setFundingType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">Type 1</SelectItem>
                    <SelectItem value="type2">Type 2</SelectItem>
                    <SelectItem value="type3">Type 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="policyTerm" className="text-sm font-medium text-slate-700">
                  Policy Term/Period
                </label>
                <Select value={policyTerm} onValueChange={setPolicyTerm}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                    <SelectItem value="3years">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Please select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="effectiveDate" className="text-sm font-medium text-slate-700">
                    Policy Effective Date
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="expiryDate" className="text-sm font-medium text-slate-700">
                    Policy Expiry Date
                  </label>
                  <div className="relative mt-1">
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button onClick={onCancel} variant="destructive">
                Cancel
              </Button>
              <Button onClick={handleSaveBasicInfo} className="bg-sky-600 hover:bg-sky-700">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "policy-rule" && (
        <PolicyRuleTab policyId={policyId} onSave={() => setActiveTab("service-type")} onCancel={onCancel} />
      )}

      {activeTab === "service-type" && (
        <Card className="rounded-lg border bg-white shadow-sm">
          <CardContent className="p-6">
            <ServiceTypeTab policyId={policyId} onSave={() => setActiveTab("contact")} onCancel={onCancel} />
          </CardContent>
        </Card>
      )}

      {activeTab === "contact" && (
        <ContactInformationTab policyId={policyId} onSave={handleFinalSave} onCancel={onCancel} />
      )}
    </div>
  )
}
