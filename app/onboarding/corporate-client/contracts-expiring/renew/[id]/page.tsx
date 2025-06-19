"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { CalendarIcon, ArrowLeft, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock data for the contract being renewed
const contractData = {
  id: "1",
  companyName: "Tech Solutions Sdn Bhd",
  companyCode: "TECH-001",
  companyStatus: "Active",
  companyType: "Main Holding",
  totalMembers: 245,
  startDate: "2023-01-15",
  endDate: "2025-07-15",
  daysUntilExpiry: 38,
  expiryStatus: "Warning",
  remarks: "Contract renewal discussion in progress",
}

export default function ContractRenewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [renewalStatus, setRenewalStatus] = useState("")
  const [contractPeriod, setContractPeriod] = useState("")
  const [finalApprovalDate, setFinalApprovalDate] = useState<Date>()
  const [newStartDate, setNewStartDate] = useState<Date>()
  const [newEndDate, setNewEndDate] = useState<Date>()
  const [proposalFile, setProposalFile] = useState<File | null>(null)
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Onboarding", href: "/onboarding" },
    { label: "Corporate Client", href: "/onboarding/corporate-client" },
    { label: "Contracts Expiring", href: "/onboarding/corporate-client/contracts-expiring" },
    { label: "Renew Contract" },
  ]

  const handleProposalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProposalFile(e.target.files[0])
    }
  }

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContractFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect after success message
      setTimeout(() => {
        router.push("/onboarding/corporate-client/contracts-expiring")
      }, 2000)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Suspended":
        return "bg-yellow-100 text-yellow-800"
      case "Terminated":
        return "bg-red-100 text-red-800"
      case "Warning":
        return "bg-orange-100 text-orange-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      case "Notice":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCompanyTypeColor = (type: string) => {
    switch (type) {
      case "Main Holding":
        return "bg-red-100 text-red-800"
      case "Subsidiary":
        return "bg-yellow-100 text-yellow-800"
      case "Independent":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  }

  return (
    <div className="p-6 space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">Contract Renewal</h2>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/onboarding/corporate-client/contracts-expiring")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contracts
        </Button>
      </div>

      {isSuccess ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <h3 className="text-xl font-semibold text-green-800">Contract Renewal Submitted Successfully</h3>
              <p className="text-green-700">
                The contract renewal for {contractData.companyName} has been submitted successfully.
              </p>
              <p className="text-sm text-green-600">Redirecting to contracts page...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Company Info Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" value={contractData.companyName} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCode">Company Code</Label>
                <Input id="companyCode" value={contractData.companyCode} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyStatus">Company Status</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contractData.companyStatus)}`}
                  >
                    {contractData.companyStatus}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getCompanyTypeColor(contractData.companyType)}`}
                  >
                    {contractData.companyType}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Details Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Current Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Current Start Date</Label>
                <Input id="startDate" value={formatDate(contractData.startDate)} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Current End Date</Label>
                <Input id="endDate" value={formatDate(contractData.endDate)} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daysUntilExpiry">Days Until Expiry</Label>
                <Input id="daysUntilExpiry" value={contractData.daysUntilExpiry} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryStatus">Expiry Status</Label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background flex items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contractData.expiryStatus)}`}
                  >
                    {contractData.expiryStatus}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Renewal Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contract Renewal</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="renewalStatus">Renewal Status</Label>
                <Select value={renewalStatus} onValueChange={setRenewalStatus} required>
                  <SelectTrigger id="renewalStatus">
                    <SelectValue placeholder="Select renewal status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractPeriod">Contract Period</Label>
                <Select value={contractPeriod} onValueChange={setContractPeriod} required>
                  <SelectTrigger id="contractPeriod">
                    <SelectValue placeholder="Select contract period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="2-years">2 Years</SelectItem>
                    <SelectItem value="3-years">3 Years</SelectItem>
                    <SelectItem value="5-years">5 Years</SelectItem>
                    <SelectItem value="custom">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="finalApprovalDate">Final Approval Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !finalApprovalDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {finalApprovalDate ? format(finalApprovalDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={finalApprovalDate} onSelect={setFinalApprovalDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label>New Contract Period</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newStartDate">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newStartDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newStartDate ? format(newStartDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={newStartDate} onSelect={setNewStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newEndDate">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newEndDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEndDate ? format(newEndDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={newEndDate} onSelect={setNewEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="proposalUpload">Upload Proposal/Quote</Label>
                <div className="flex items-center gap-4">
                  <Input id="proposalUpload" type="file" onChange={handleProposalUpload} className="flex-1" />
                  {proposalFile && <span className="text-sm text-green-600">{proposalFile.name}</span>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractUpload">Upload Signed Contract</Label>
                <div className="flex items-center gap-4">
                  <Input id="contractUpload" type="file" onChange={handleContractUpload} className="flex-1" />
                  {contractFile && <span className="text-sm text-green-600">{contractFile.name}</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/corporate-client/contracts-expiring")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Renewal"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
