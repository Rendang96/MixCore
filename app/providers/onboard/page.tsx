"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OnboardingProvider = {
  id: string
  applicationCode: string
  name: string
  companyName: string
  tinNumber: string
  email: string
  phoneNumber: string
  state: string
  providerType: string
  status:
    | "filling"
    | "form-submitted"
    | "reviewing-afiqah"
    | "approved-afiqah"
    | "rejected-afiqah"
    | "pending-payment"
    | "paid"
    | "payment-verified-afiqah"
    | "approved-azni"
    | "rejected-azni"
    | "approved-kamal"
    | "rejected-kamal"
    | "payment-submitted"
  createdAt: string
  rejectionRemarks?: string
}

// Status display mapping
const statusDisplay: Record<OnboardingProvider["status"], { label: string; color: string }> = {
  filling: {
    label: "Provider Filling Form",
    color: "bg-blue-100 text-blue-800",
  },
  "form-submitted": {
    label: "Form Submitted",
    color: "bg-blue-100 text-blue-800",
  },
  "reviewing-afiqah": {
    label: "Reviewing by Afiqah",
    color: "bg-yellow-100 text-yellow-800",
  },
  "approved-afiqah": {
    label: "Approved and Asked for Payment by Afiqah",
    color: "bg-emerald-100 text-emerald-800",
  },
  "rejected-afiqah": {
    label: "Rejected by Afiqah",
    color: "bg-red-100 text-red-800",
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
  "approved-azni": {
    label: "Approved by Azni",
    color: "bg-emerald-100 text-emerald-800",
  },
  "rejected-azni": {
    label: "Rejected by Azni",
    color: "bg-red-100 text-red-800",
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
}

// Mock data for onboarding providers
const mockOnboardingProviders: OnboardingProvider[] = [
  {
    id: "1",
    applicationCode: "OB-2023-001",
    name: "John Smith",
    companyName: "ABC Medical Center",
    tinNumber: "123456789",
    email: "john@abcmedical.com",
    phoneNumber: "012-3456789",
    state: "Kuala Lumpur",
    providerType: "Medical",
    status: "filling",
    createdAt: "2023-05-10",
  },
  {
    id: "2",
    applicationCode: "OB-2023-002",
    name: "Sarah Lee",
    companyName: "Wellness Clinic",
    tinNumber: "987654321",
    email: "sarah@wellnessclinic.com",
    phoneNumber: "019-8765432",
    state: "Selangor",
    providerType: "Wellness",
    status: "form-submitted",
    createdAt: "2023-05-12",
  },
  {
    id: "3",
    applicationCode: "OB-2023-003",
    name: "David Wong",
    companyName: "Family Health Center",
    tinNumber: "456789123",
    email: "david@familyhealth.com",
    phoneNumber: "013-4567890",
    state: "Penang",
    providerType: "Medical",
    status: "reviewing-afiqah",
    createdAt: "2023-05-15",
  },
  {
    id: "5",
    applicationCode: "OB-2023-005",
    name: "Michael Lim",
    companyName: "City Hospital",
    tinNumber: "321654987",
    email: "michael@cityhospital.com",
    phoneNumber: "014-7890123",
    state: "Sabah",
    providerType: "Hospital",
    status: "pending-payment",
    createdAt: "2023-05-20",
  },
  {
    id: "6",
    applicationCode: "OB-2023-006",
    name: "Jennifer Ng",
    companyName: "Dental Solutions",
    tinNumber: "654987321",
    email: "jennifer@dentalsolutions.com",
    phoneNumber: "016-5432109",
    state: "Sarawak",
    providerType: "Dental",
    status: "paid",
    createdAt: "2023-05-22",
  },
  {
    id: "7",
    applicationCode: "OB-2023-007",
    name: "Robert Tan",
    companyName: "Healthcare Associates",
    tinNumber: "234567891",
    email: "robert@healthcareassociates.com",
    phoneNumber: "018-9012345",
    state: "Kuala Lumpur",
    providerType: "Medical",
    status: "payment-verified-afiqah",
    createdAt: "2023-05-25",
  },
  {
    id: "8",
    applicationCode: "OB-2023-008",
    name: "Emily Chen",
    companyName: "Chen Medical Group",
    tinNumber: "345678912",
    email: "emily@chenmedical.com",
    phoneNumber: "011-2345678",
    state: "Penang",
    providerType: "Medical",
    status: "approved-azni",
    createdAt: "2023-05-28",
  },
  {
    id: "9",
    applicationCode: "OB-2023-009",
    name: "Ahmad Razak",
    companyName: "Razak Clinic",
    tinNumber: "567891234",
    email: "ahmad@razakclinic.com",
    phoneNumber: "019-3456789",
    state: "Kedah",
    providerType: "Clinic",
    status: "rejected-afiqah",
    createdAt: "2023-06-01",
    rejectionRemarks: "Incomplete documentation - missing medical license",
  },
  {
    id: "10",
    applicationCode: "OB-2023-010",
    name: "Siti Aminah",
    companyName: "Aminah Healthcare",
    tinNumber: "678912345",
    email: "siti@aminahhealthcare.com",
    phoneNumber: "013-4567891",
    state: "Terengganu",
    providerType: "Healthcare",
    status: "rejected-azni",
    createdAt: "2023-06-05",
    rejectionRemarks: "Policy concerns - service area overlap",
  },
  {
    id: "11",
    applicationCode: "OB-2023-011",
    name: "Raj Patel",
    companyName: "Patel Medical",
    tinNumber: "789123456",
    email: "raj@patelmedical.com",
    phoneNumber: "012-3456781",
    state: "Selangor",
    providerType: "Medical",
    status: "approved-kamal",
    createdAt: "2023-06-10",
  },
  {
    id: "12",
    applicationCode: "OB-2023-012",
    name: "Mei Ling",
    companyName: "Ling Dental",
    tinNumber: "891234567",
    email: "mei@lingdental.com",
    phoneNumber: "014-5678912",
    state: "Johor",
    providerType: "Dental",
    status: "rejected-kamal",
    createdAt: "2023-06-15",
    rejectionRemarks: "Compliance issues - facility requirements not met",
  },
  {
    id: "13",
    applicationCode: "OB-2023-013",
    name: "Hassan Ali",
    companyName: "Ali Medical Centre",
    tinNumber: "912345678",
    email: "hassan@alimedical.com",
    phoneNumber: "015-6789012",
    state: "Perak",
    providerType: "Medical",
    status: "payment-submitted",
    createdAt: "2023-06-20",
  },
]

export default function OnboardingProvidersPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const pageSize = 10

  // Filter providers based on search term
  const filteredProviders = mockOnboardingProviders.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.applicationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Separate active and history providers
  const activeProviders = filteredProviders.filter(
    (provider) =>
      provider.status === "filling" ||
      provider.status === "form-submitted" ||
      provider.status === "reviewing-afiqah" ||
      provider.status === "approved-afiqah" ||
      provider.status === "pending-payment" ||
      provider.status === "paid" ||
      provider.status === "payment-submitted" ||
      provider.status === "payment-verified-afiqah" ||
      provider.status === "approved-azni",
  )

  const historyProviders = filteredProviders.filter(
    (provider) =>
      provider.status === "rejected-afiqah" ||
      provider.status === "rejected-azni" ||
      provider.status === "approved-kamal" ||
      provider.status === "rejected-kamal",
  )

  const totalActivePages = Math.ceil(activeProviders.length / pageSize)
  const totalHistoryPages = Math.ceil(historyProviders.length / pageSize)

  const paginatedActiveProviders = activeProviders.slice((page - 1) * pageSize, page * pageSize)
  const paginatedHistoryProviders = historyProviders.slice((page - 1) * pageSize, page * pageSize)

  // Reset page when switching tabs
  const handleTabChange = () => {
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Provider Onboarding" description="Manage providers in the onboarding process" />

      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Input
            type="search"
            placeholder="Search providers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {/* This button navigates to the new onboarding form */}
        <Button asChild>
          <Link href="/onboarding/providers/new/create">Onboard from Portal</Link>
        </Button>
      </div>

      <Tabs defaultValue="active" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Onboarding</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Provider Name</TableHead>
                  <TableHead>Provider Type</TableHead>
                  <TableHead>TIN Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedActiveProviders.length > 0 ? (
                  paginatedActiveProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>{provider.applicationCode}</TableCell>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>{provider.companyName}</TableCell>
                      <TableCell>{provider.providerType}</TableCell>
                      <TableCell>{provider.tinNumber}</TableCell>
                      <TableCell>{provider.email}</TableCell>
                      <TableCell>{provider.phoneNumber}</TableCell>
                      <TableCell>{provider.state}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusDisplay[provider.status].color}`}
                        >
                          {statusDisplay[provider.status].label}
                        </span>
                      </TableCell>
                      <TableCell>{provider.rejectionRemarks || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" title="View Details" asChild>
                            <Link href={`/onboarding/providers/${provider.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" title="Edit Provider" asChild>
                            <Link href={`/onboarding/providers/${provider.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Delete Provider"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this provider?")) {
                                // Delete logic would go here
                                alert(`Provider ${provider.applicationCode} deleted successfully.`)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      No active providers found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {activeProviders.length > 0 && (
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalActivePages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalActivePages, p + 1))}
                disabled={page === totalActivePages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalActivePages)}
                disabled={page === totalActivePages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Provider Name</TableHead>
                  <TableHead>Provider Type</TableHead>
                  <TableHead>TIN Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHistoryProviders.length > 0 ? (
                  paginatedHistoryProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>{provider.applicationCode}</TableCell>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>{provider.companyName}</TableCell>
                      <TableCell>{provider.providerType}</TableCell>
                      <TableCell>{provider.tinNumber}</TableCell>
                      <TableCell>{provider.email}</TableCell>
                      <TableCell>{provider.phoneNumber}</TableCell>
                      <TableCell>{provider.state}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusDisplay[provider.status].color}`}
                        >
                          {statusDisplay[provider.status].label}
                        </span>
                      </TableCell>
                      <TableCell>{provider.rejectionRemarks || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" title="View Details" asChild>
                            <Link href={`/onboarding/providers/${provider.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" title="Edit Provider" asChild>
                            <Link href={`/onboarding/providers/${provider.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      No history providers found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {historyProviders.length > 0 && (
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalHistoryPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalHistoryPages, p + 1))}
                disabled={page === totalHistoryPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalHistoryPages)}
                disabled={page === totalHistoryPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
