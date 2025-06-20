"use client"

import { DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { Pencil, ArrowLeft, Send, Eye, Download, Upload, Plus, Bell } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import { DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Reuse the status display mapping from the list page
const statusDisplay: Record<string, { label: string; color: string }> = {
  filling: {
    label: "Provider Filling Form",
    color: "bg-blue-100 text-blue-800",
  },
  verification: {
    label: "Waiting Verification",
    color: "bg-yellow-100 text-yellow-800",
  },
  "ceo-approval": {
    label: "CEO Approval",
    color: "bg-purple-100 text-purple-800",
  },
  payment: {
    label: "Pending Payment",
    color: "bg-orange-100 text-orange-800",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
  },
  "pnm-verified": {
    label: "Verified by PNM",
    color: "bg-green-100 text-green-800",
  },
  "pnm-approved": {
    label: "Approved by PNM Manager",
    color: "bg-emerald-100 text-emerald-800",
  },
  "approved-afiqah": {
    label: "Approved and Asked for Payment by Afiqah",
    color: "bg-emerald-100 text-emerald-800",
  },
  "rejected-afiqah": {
    label: "Rejected by Afiqah",
    color: "bg-red-100 text-red-800",
  },
  "approved-azni": {
    label: "Approved by Azni",
    color: "bg-emerald-100 text-emerald-800",
  },
  "rejected-azni": {
    label: "Rejected by Azni",
    color: "bg-red-100 text-red-800",
  },
  "approved-ceo": {
    label: "Approved by CEO",
    color: "bg-emerald-100 text-emerald-800",
  },
  "rejected-ceo": {
    label: "Rejected by CEO",
    color: "bg-red-100 text-red-800",
  },
  "form-submitted": {
    label: "Form Submitted",
    color: "bg-blue-100 text-blue-800",
  },
  "reviewing-afiqah": {
    label: "Reviewing by Afiqah",
    color: "bg-yellow-100 text-yellow-800",
  },
  "pending-payment": {
    label: "Pending for Payment",
    color: "bg-orange-100 text-orange-800",
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
  },
  "payment-verified-afiqah": {
    label: "Payment Verified by Afiqah",
    color: "bg-green-100 text-green-800",
  },
  "approved-kamal": {
    label: "Approved by En. Kamal",
    color: "bg-emerald-100 text-emerald-800",
  },
  "rejected-kamal": {
    label: "Rejected by En. Kamal",
    color: "bg-red-100 text-red-800",
  },
  "payment-submitted": {
    label: "Payment Submitted",
    color: "bg-blue-100 text-blue-800",
  },
  "approved-asked-payment-afiqah": {
    label: "Approved & Asked for Payment by Afiqah",
    color: "bg-emerald-100 text-emerald-800",
  },
}

export default function OnboardingProviderDetailsPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [providerStatus, setProviderStatus] = useState<string>("")
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [approvalAction, setApprovalAction] = useState<
    "approve" | "reject" | "payment-verified" | "payment-reviewed" | ""
  >("")
  const [rejectionRemarks, setRejectionRemarks] = useState("")

  useEffect(() => {
    // Simulate API call to fetch provider data
    const fetchProvider = async () => {
      setIsLoading(true)
      try {
        // In a real application, you would fetch this data from your API
        // const response = await fetch(`/api/onboarding/providers/${params.id}`)
        // const data = await response.json()

        // For demo purposes, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock provider data based on ID
        let status
        let mockProvider

        // Map provider IDs to specific statuses for testing different UI states
        switch (params.id) {
          case "1":
            status = "filling"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-001",
              name: "John Smith",
              providerName: "ABC Medical Center",
              tinNumber: "123456789",
              email: "john@abcmedical.com",
              phoneNumber: "012-3456789",
              state: "Kuala Lumpur",
              status: status,
              createdAt: "2023-05-10",
              notes: "Provider has been contacted via email and is in the process of completing their registration.",
              lastUpdated: "2023-05-11",
              updatedBy: "Admin User",
              providerType: "Medical",
            }
            break
          case "2":
            status = "form-submitted"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-002",
              name: "Sarah Lee",
              providerName: "Wellness Clinic",
              tinNumber: "987654321",
              email: "sarah@wellnessclinic.com",
              phoneNumber: "019-8765432",
              state: "Selangor",
              status: status,
              createdAt: "2023-05-12",
              notes: "Provider has completed registration form.",
              lastUpdated: "2023-05-13",
              updatedBy: "Admin User",
              providerType: "Wellness",
            }
            break
          case "3":
            status = "reviewing-afiqah"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-003",
              name: "David Wong",
              providerName: "Family Health Center",
              tinNumber: "456789123",
              email: "david@familyhealth.com",
              phoneNumber: "013-4567890",
              state: "Penang",
              status: status,
              createdAt: "2023-05-15",
              notes: "Application is currently under review by Afiqah.",
              lastUpdated: "2023-05-16",
              updatedBy: "Afiqah",
              providerType: "Medical",
            }
            break
          case "4":
            status = "approved-afiqah"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-004",
              name: "Lisa Tan",
              providerName: "Specialist Care",
              tinNumber: "789123456",
              email: "lisa@specialistcare.com",
              phoneNumber: "017-8901234",
              state: "Johor",
              status: status,
              createdAt: "2023-05-18",
              notes: "Application has been approved by Afiqah and is awaiting further approval.",
              lastUpdated: "2023-05-19",
              updatedBy: "Afiqah",
              providerType: "Specialist",
            }
            break
          case "5":
            status = "pending-payment"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-005",
              name: "Michael Lim",
              providerName: "City Hospital",
              tinNumber: "321654987",
              email: "michael@cityhospital.com",
              phoneNumber: "014-7890123",
              state: "Sabah",
              status: status,
              createdAt: "2023-05-20",
              notes: "Provider needs to complete payment to proceed.",
              lastUpdated: "2023-05-21",
              updatedBy: "System",
              providerType: "Hospital",
            }
            break
          case "6":
            status = "paid"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-006",
              name: "Jennifer Ng",
              providerName: "Dental Solutions",
              tinNumber: "654987321",
              email: "jennifer@dentalsolutions.com",
              phoneNumber: "016-5432109",
              state: "Sarawak",
              status: status,
              createdAt: "2023-05-22",
              notes: "Provider has completed payment.",
              lastUpdated: "2023-05-23",
              updatedBy: "System",
              providerType: "Dental",
            }
            break
          case "7":
            status = "payment-verified-afiqah"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-007",
              name: "Robert Tan",
              providerName: "Healthcare Associates",
              tinNumber: "234567891",
              email: "robert@healthcareassociates.com",
              phoneNumber: "018-9012345",
              state: "Kuala Lumpur",
              status: status,
              createdAt: "2023-05-25",
              notes: "Payment has been verified by Afiqah.",
              lastUpdated: "2023-05-26",
              updatedBy: "Afiqah",
              providerType: "Medical",
            }
            break
          case "8":
            status = "approved-azni"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-008",
              name: "Emily Chen",
              providerName: "Chen Medical Group",
              tinNumber: "345678912",
              email: "emily@chenmedical.com",
              phoneNumber: "011-2345678",
              state: "Penang",
              status: status,
              createdAt: "2023-05-28",
              notes: "Application has been approved by Azni.",
              lastUpdated: "2023-05-29",
              updatedBy: "Azni",
              providerType: "Medical",
            }
            break
          case "9":
            status = "rejected-afiqah"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-009",
              name: "Ahmad Razak",
              providerName: "Razak Clinic",
              tinNumber: "567891234",
              email: "ahmad@razakclinic.com",
              phoneNumber: "019-3456789",
              state: "Kedah",
              status: status,
              createdAt: "2023-06-01",
              notes: "Application has been rejected by Afiqah due to incomplete documentation.",
              lastUpdated: "2023-06-02",
              updatedBy: "Afiqah",
              providerType: "Clinic",
            }
            break
          case "10":
            status = "rejected-azni"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-010",
              name: "Siti Aminah",
              providerName: "Aminah Healthcare",
              tinNumber: "678912345",
              email: "siti@aminahhealthcare.com",
              phoneNumber: "013-4567891",
              state: "Terengganu",
              status: status,
              createdAt: "2023-06-05",
              notes: "Application has been rejected by Azni due to policy concerns.",
              lastUpdated: "2023-06-06",
              updatedBy: "Azni",
              providerType: "Healthcare",
            }
            break
          case "11":
            status = "approved-kamal"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-011",
              name: "Raj Patel",
              providerName: "Patel Medical",
              tinNumber: "789123456",
              email: "raj@patelmedical.com",
              phoneNumber: "012-3456781",
              state: "Selangor",
              status: status,
              createdAt: "2023-06-10",
              notes: "Application has been approved by En. Kamal.",
              lastUpdated: "2023-06-11",
              updatedBy: "En. Kamal",
              providerType: "Medical",
            }
            break
          case "12":
            status = "rejected-kamal"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-012",
              name: "Mei Ling",
              providerName: "Ling Dental",
              tinNumber: "891234567",
              email: "mei@lingdental.com",
              phoneNumber: "014-5678912",
              state: "Johor",
              status: status,
              createdAt: "2023-06-15",
              notes: "Application has been rejected by En. Kamal due to compliance issues.",
              lastUpdated: "2023-06-16",
              updatedBy: "En. Kamal",
              providerType: "Dental",
            }
            break
          case "13":
            status = "payment-submitted"
            mockProvider = {
              id: params.id,
              applicationCode: "OB-2023-013",
              name: "Hassan Ali",
              providerName: "Ali Medical Centre",
              tinNumber: "912345678",
              email: "hassan@alimedical.com",
              phoneNumber: "015-6789012",
              state: "Perak",
              status: status,
              createdAt: "2023-06-20",
              notes: "Provider has submitted payment proof for verification.",
              lastUpdated: "2023-06-21",
              updatedBy: "System",
              providerType: "Medical",
            }
            break
          default:
            // Default mock data for any other ID
            status = "verification"
            mockProvider = {
              id: params.id,
              applicationCode: `OB-2023-${params.id.padStart(3, "0")}`,
              name: `Provider ${params.id}`,
              providerName: `Health Center ${params.id}`,
              tinNumber: `TIN-${params.id}-12345`,
              email: `provider${params.id}@example.com`,
              phoneNumber: `01${params.id}-1234567`,
              state: "Unknown",
              status: status,
              createdAt: "2023-05-12",
              notes: "Provider information pending verification.",
              lastUpdated: "2023-05-13",
              updatedBy: "System",
              providerType: "Other",
            }
        }

        setProvider(mockProvider)
        setProviderStatus(status)

        // Mock activity logs
        const mockLogs = [
          {
            id: 1,
            date: "2023-05-10 09:30:00",
            user: "System",
            message: "Provider registration initiated.",
            type: "system",
          },
          {
            id: 2,
            date: "2023-05-10 10:15:00",
            user: "Admin User",
            message: "Invitation email sent to provider.",
            type: "user",
          },
          {
            id: 3,
            date: "2023-05-10 14:20:00",
            user: mockProvider.name,
            message: "Started filling registration form.",
            type: "provider",
          },
          {
            id: 4,
            date: "2023-05-11 11:05:00",
            user: "Admin User",
            message: "Kindly complete your profile information within 7 days.",
            type: "user",
          },
          {
            id: 5,
            date: "2023-05-11 13:30:00",
            user: mockProvider.name,
            message: "I need more information about the required documents.",
            type: "provider",
          },
          {
            id: 6,
            date: "2023-05-11 14:45:00",
            user: "Admin User",
            message:
              "Please refer to the document section. You need to upload business license, medical licenses, and practitioner certificates.",
            type: "user",
          },
        ]
        setActivityLogs(mockLogs)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load provider data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProvider()
  }, [params.id])

  const resendEmail = async () => {
    try {
      // Simulate API call to resend email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Email Sent",
        description: `Registration instructions have been resent to ${provider.email}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveStatus = async () => {
    if (!approvalAction) {
      toast({
        title: "Error",
        description: "Please select an action.",
        variant: "destructive",
      })
      return
    }

    if (approvalAction === "reject" && !rejectionRemarks.trim()) {
      toast({
        title: "Error",
        description: "Please provide rejection remarks.",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate API call to update status
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Determine the new status based on the approval action and current status
      let newStatus = ""

      if (providerStatus === "filling" || providerStatus === "form-submitted") {
        if (approvalAction === "approve") {
          newStatus = "approved-afiqah"
        } else if (approvalAction === "reject") {
          newStatus = "rejected-afiqah"
        }
      } else if (providerStatus === "reviewing-afiqah") {
        if (approvalAction === "approve") {
          newStatus = "approved-asked-payment-afiqah"
        } else if (approvalAction === "reject") {
          newStatus = "rejected-afiqah"
        }
      } else if (providerStatus === "approved-afiqah") {
        if (approvalAction === "approve") {
          newStatus = "approved-azni"
        } else if (approvalAction === "reject") {
          newStatus = "rejected-azni"
        }
      } else if (providerStatus === "approved-azni") {
        if (approvalAction === "approve") {
          newStatus = "approved-kamal"
        } else if (approvalAction === "reject") {
          newStatus = "rejected-kamal"
        }
      } else if (providerStatus === "payment-submitted") {
        if (approvalAction === "payment-reviewed") {
          newStatus = "payment-verified-afiqah"
        }
      } else if (providerStatus === "paid") {
        if (approvalAction === "approve") {
          newStatus = "approved-azni"
        } else if (approvalAction === "reject") {
          newStatus = "rejected-azni"
        }
      }

      // Update provider data
      setProvider({
        ...provider,
        status: newStatus,
        rejectionRemarks: approvalAction === "reject" ? rejectionRemarks : provider.rejectionRemarks,
      })
      setProviderStatus(newStatus)

      // Add activity log entry
      const newLog = {
        id: activityLogs.length + 1,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        user: "Admin User",
        message: `Status changed to ${statusDisplay[newStatus].label}`,
        type: "user",
      }
      setActivityLogs([...activityLogs, newLog])

      toast({
        title: "Status Updated",
        description: `Provider status has been updated to ${statusDisplay[newStatus].label}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSendingMessage(true)
    try {
      // Simulate API call to send message
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add message to activity logs
      const newLog = {
        id: activityLogs.length + 1,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        user: "Admin User",
        message: newMessage,
        type: "user",
      }
      setActivityLogs([...activityLogs, newLog])
      setNewMessage("")

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the provider.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingMessage(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading provider data...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Provider Not Found" description="The requested provider could not be found." />
        <Button asChild className="mt-4">
          <Link href="/onboarding/providers">Back to Providers</Link>
        </Button>
      </div>
    )
  }

  // Check if status is approved (any type of approval)
  const isApproved = providerStatus.includes("approved")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Provider: ${provider.name}`}
          description={`Application Code: ${provider.applicationCode}`}
        />
        <div className="flex space-x-4">
          <Button variant="outline" asChild>
            <Link href="/onboarding/providers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/onboarding/providers/${params.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Provider Onboard
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Provider Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Application Code</h3>
                  <p className="mt-1">{provider.applicationCode}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="mt-1">
                    <Badge className={statusDisplay[providerStatus]?.color || "bg-gray-100 text-gray-800"}>
                      {statusDisplay[providerStatus]?.label || providerStatus}
                    </Badge>
                    {provider.rejectionRemarks && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">Remarks:</p>
                        <p className="text-sm">{provider.rejectionRemarks}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="mt-1">{provider.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Provider Type</h3>
                  <p className="mt-1">{provider.providerType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Provider Name</h3>
                  <p className="mt-1">{provider.providerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">TIN Number</h3>
                  <p className="mt-1">{provider.tinNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">State</h3>
                  <p className="mt-1">{provider.state}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="mt-1">{provider.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                  <p className="mt-1">{provider.phoneNumber}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="mt-1">{provider.notes}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created Date</h3>
                <p className="mt-1">{new Date(provider.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p className="mt-1">{new Date(provider.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Updated By</h3>
                <p className="mt-1">{provider.updatedBy}</p>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={resendEmail}>
                  <Send className="mr-2 h-4 w-4" />
                  Resend Registration Email
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {providerStatus !== "filling" && (
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/onboarding/providers/${params.id}/application`}>View Full Application</Link>
                </Button>
              )}
              <Dialog open={showActivityLog} onOpenChange={setShowActivityLog}>
                <Button className="w-full" variant="outline" onClick={() => setShowActivityLog(true)}>
                  Conversation History
                </Button>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Conversation History</DialogTitle>
                    <DialogDescription>View all communications for this provider.</DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto p-4 border rounded-md">
                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`mb-4 p-3 rounded-lg ${
                          log.type === "system"
                            ? "bg-gray-100"
                            : log.type === "provider"
                              ? "bg-blue-50 ml-auto max-w-[80%]"
                              : "bg-green-50 max-w-[80%]"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm">{log.user}</span>
                          <span className="text-xs text-gray-500">{log.date}</span>
                        </div>
                        <p className="text-sm">{log.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start space-x-2 mt-4">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isSendingMessage || !newMessage.trim()}>
                      {isSendingMessage ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {providerStatus !== "filling" &&
            providerStatus !== "pending-payment" &&
            providerStatus !== "rejected-afiqah" &&
            providerStatus !== "rejected-azni" &&
            providerStatus !== "approved-kamal" &&
            providerStatus !== "rejected-kamal" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Change Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={approvalAction}
                    onValueChange={(value: "approve" | "reject" | "payment-verified" | "payment-reviewed" | "") =>
                      setApprovalAction(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Action" />
                    </SelectTrigger>
                    <SelectContent>
                      {providerStatus === "reviewing-afiqah" ? (
                        <>
                          <SelectItem value="approve">Approve & ask for appointment fee</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                        </>
                      ) : providerStatus === "payment-submitted" ? (
                        <SelectItem value="payment-reviewed">Payment Reviewed</SelectItem>
                      ) : providerStatus === "paid" ? (
                        <>
                          <SelectItem value="approve">Approve</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                        </>
                      ) : providerStatus === "form-submitted" ? (
                        <>
                          <SelectItem value="approve">Approve & ask for payment fee</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="approve">Approve</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {approvalAction === "reject" && (
                    <div className="space-y-2">
                      <Label htmlFor="rejection-remarks">Rejection Remarks</Label>
                      <Textarea
                        id="rejection-remarks"
                        value={rejectionRemarks}
                        onChange={(e) => setRejectionRemarks(e.target.value)}
                        placeholder="Please provide reason for rejection..."
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                  <Button className="w-full" variant="outline" onClick={handleSaveStatus}>
                    Save Status
                  </Button>
                </CardContent>
              </Card>
            )}

          {approvalAction === "approve" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Provider Documents</CardTitle>
                <CardDescription>Send guideline and offer letter to the provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border p-3 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">Provider Guideline</p>
                      <p className="text-sm text-muted-foreground">PDF document</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Provider Guideline</DialogTitle>
                        </DialogHeader>
                        <div className="bg-gray-100 p-4 rounded-md min-h-[60vh] flex items-center justify-center">
                          <p className="text-muted-foreground">Guideline document preview would appear here</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Guideline Sent",
                          description: `Guideline has been sent to ${provider.email}`,
                        })
                      }}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between border p-3 rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <p className="font-medium">Offer Letter</p>
                      <p className="text-sm text-muted-foreground">PDF document</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Offer Letter</DialogTitle>
                        </DialogHeader>
                        <div className="bg-gray-100 p-4 rounded-md min-h-[60vh] flex items-center justify-center">
                          <p className="text-muted-foreground">Offer letter preview would appear here</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Offer Letter Sent",
                          description: `Offer letter has been sent to ${provider.email}`,
                        })
                      }}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              Notes
              <Bell className="h-3 w-3 text-orange-500 animate-pulse" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Timeline</CardTitle>
                <CardDescription>Key milestones in the onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Timeline milestones */}
                  {(() => {
                    const baseMilestones = [
                      {
                        key: "filling",
                        labels: {
                          past: "Provider Filled Form",
                          current: "Provider Filling Form",
                          future: "Provider Fill Form",
                        },
                        date: "2023-05-10 - 9:30 AM",
                      },
                      {
                        key: "form-submitted",
                        labels: {
                          past: "Form Submitted",
                          current: "Form Submitting",
                          future: "Form Submit",
                        },
                        date: "2023-05-12 - 2:30 PM",
                      },
                      {
                        key: "reviewing-afiqah",
                        labels: {
                          past: "Reviewed by Afiqah",
                          current: "Reviewing by Afiqah",
                          future: "Review by Afiqah",
                        },
                        date: "2023-05-15 - 10:15 AM",
                      },
                      {
                        key: "pending-payment",
                        labels: {
                          past: "Payment Requested",
                          current: "Pending for Payment",
                          future: "Request Payment",
                        },
                        date: "2023-05-18 - 11:00 AM",
                      },
                      {
                        key: "payment-submitted",
                        labels: {
                          past: "Payment Submitted",
                          current: "Payment Submitting",
                          future: "Payment Submit",
                        },
                        date: "2023-05-20 - 2:15 PM",
                      },
                      {
                        key: "payment-verified-afiqah",
                        labels: {
                          past: "Payment Verified by Afiqah",
                          current: "Payment Verifying by Afiqah",
                          future: "Payment Verify by Afiqah",
                        },
                        date: "2023-05-22 - 9:45 AM",
                      },
                      {
                        key: "paid",
                        labels: {
                          past: "Paid",
                          current: "Paying",
                          future: "Pay",
                        },
                        date: "2023-05-23 - 3:20 PM",
                      },
                      {
                        key: "approved-azni",
                        labels: {
                          past: "Approved by Azni",
                          current: "Approving by Azni",
                          future: "Approve by Azni",
                        },
                        date: "2023-05-25 - 10:30 AM",
                      },
                      {
                        key: "approved-kamal",
                        labels: {
                          past: "Approved by En. Kamal",
                          current: "Approving by En. Kamal",
                          future: "Approve by En. Kamal",
                        },
                        date: "2023-05-28 - 4:15 PM",
                      },
                    ]

                    const currentStatusIndex = baseMilestones.findIndex((milestone) => milestone.key === providerStatus)

                    return (
                      <div className="relative">
                        {/* Horizontal line connecting all milestones */}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0"></div>

                        <div className="flex items-center justify-between relative z-10">
                          {baseMilestones.map((milestone, index) => {
                            let circleColor = "bg-gray-100"
                            let dotColor = "bg-gray-300"
                            let dateText = "Pending"
                            let labelText = milestone.labels.future

                            if (index < currentStatusIndex) {
                              // Past milestones - green
                              circleColor = "bg-green-100"
                              dotColor = "bg-green-500"
                              dateText = milestone.date
                              labelText = milestone.labels.past
                            } else if (index === currentStatusIndex) {
                              // Current milestone - yellow
                              circleColor = "bg-yellow-100"
                              dotColor = "bg-yellow-500"
                              dateText = milestone.date
                              labelText = milestone.labels.current
                            } else {
                              // Future milestones - gray
                              circleColor = "bg-gray-100"
                              dotColor = "bg-gray-300"
                              dateText = "Pending"
                              labelText = milestone.labels.future
                            }

                            return (
                              <div key={milestone.key} className="flex flex-col items-center max-w-[120px]">
                                <div
                                  className={`w-10 h-10 rounded-full ${circleColor} flex items-center justify-center`}
                                >
                                  <div className={`w-5 h-5 rounded-full ${dotColor}`}></div>
                                </div>
                                <div className="mt-4 text-center">
                                  <h3 className="text-xs font-medium leading-tight">{labelText}</h3>
                                  <p className="text-xs text-muted-foreground mt-1">{dateText}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
                <CardDescription>Documents provided by the provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Medical License</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on May 12, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Business Registration</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on May 12, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Tax Certificate</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on May 12, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Financial details and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Appointment Fee</h3>
                        <p className="text-sm text-muted-foreground">$500.00 - Due on June 1, 2023</p>
                        <Badge className="mt-2" variant="outline">
                          Pending
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Invoice
                      </Button>
                    </div>
                  </div>

                                    <div className="mt-6">
                    <h3 className="font-medium mb-2">Payment Attachments</h3>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">No payment attachments have been uploaded yet.</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Payment Proof
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
                <CardDescription>Notes for PNM staff only</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">Sarah Lee</span>
                          <span className="text-xs text-muted-foreground ml-2">May 15, 2023 - 11:30 AM</span>
                        </div>
                        <p className="text-sm mt-1">
                          Provider has submitted all required documents. Need to verify the medical license with the
                          state board.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">John Doe</span>
                          <span className="text-xs text-muted-foreground ml-2">May 14, 2023 - 09:15 AM</span>
                        </div>
                        <p className="text-sm mt-1">
                          Called provider to request additional information about their service area. They will send
                          details by email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Textarea placeholder="Add a new note..." className="min-h-[100px]" />
                    <Button className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
