"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, Clock, AlertCircle, Upload } from "lucide-react"

export default function ApplicationStatusPage({ params }: { params: { id: string } }) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Payment proof uploaded",
      description: "Your payment proof has been uploaded successfully.",
    })

    setIsUploading(false)
  }

  // Mock application status data
  const applicationStatus = {
    id: params.id,
    providerName: "ABC Medical Center",
    status: "approved", // pending, approved, rejected
    steps: [
      {
        id: 1,
        name: "Application Submission",
        status: "completed", // completed, in-progress, pending
        date: "2023-05-10",
      },
      {
        id: 2,
        name: "Document Verification",
        status: "completed",
        date: "2023-05-12",
      },
      {
        id: 3,
        name: "Application Review",
        status: "completed",
        date: "2023-05-15",
      },
      {
        id: 4,
        name: "Approval",
        status: "completed",
        date: "2023-05-18",
      },
      {
        id: 5,
        name: "Payment",
        status: "in-progress",
        date: null,
      },
      {
        id: 6,
        name: "Contract Generation",
        status: "pending",
        date: null,
      },
    ],
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "in-progress":
        return <Clock className="h-6 w-6 text-blue-500" />
      case "pending":
        return <Clock className="h-6 w-6 text-gray-400" />
      default:
        return <AlertCircle className="h-6 w-6 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Application Status"
        description={`Track the status of your provider application (ID: ${params.id})`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Progress</CardTitle>
              <CardDescription>
                Current status:{" "}
                {applicationStatus.status === "approved" ? (
                  <span className="text-green-500 font-medium">Approved</span>
                ) : applicationStatus.status === "rejected" ? (
                  <span className="text-red-500 font-medium">Rejected</span>
                ) : (
                  <span className="text-blue-500 font-medium">Pending</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applicationStatus.steps.map((step) => (
                  <div key={step.id} className="flex items-start">
                    <div className="mr-4 mt-0.5">{getStatusIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{step.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          {step.date ? new Date(step.date).toLocaleDateString() : "Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.status === "completed"
                          ? "This step has been completed."
                          : step.status === "in-progress"
                            ? "This step is currently in progress."
                            : "This step is pending completion of previous steps."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {applicationStatus.steps[4].status === "in-progress" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Required</CardTitle>
                <CardDescription>Please complete the payment to proceed with your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Name:</div>
                    <div className="font-medium">PMCARE SDN BHD</div>
                    <div>Bank Name:</div>
                    <div className="font-medium">Bank Islam Malaysia Berhad</div>
                    <div>Account No:</div>
                    <div className="font-medium">120650100 33455</div>
                    <div>Amount:</div>
                    <div className="font-medium">RM5,000.00</div>
                    <div>Payment Reference:</div>
                    <div className="font-medium">{applicationStatus.providerName}</div>
                  </div>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-advice">Payment Advice for Appointment Fee</Label>
                    <Input id="payment-advice" type="file" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-statement">Account Bank Statement Header</Label>
                    <Input id="bank-statement" type="file" required />
                  </div>

                  <Button type="submit" className="w-full" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload Payment Proof"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Provider Name</h3>
                <p>{applicationStatus.providerName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Application ID</h3>
                <p>{applicationStatus.id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Submission Date</h3>
                <p>{new Date(applicationStatus.steps[0].date).toLocaleDateString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Current Status</h3>
                <p className="capitalize">{applicationStatus.status}</p>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
