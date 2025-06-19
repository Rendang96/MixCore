"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getPersons } from "@/lib/person/person-storage"

interface Person {
  id: string
  name: string
  personId: string
  membershipNo: string
  idNo: string
  personType: string
  companyName: string
  policyNo: string
  status: string
  companyCode: string
  employeeName?: string
  employeeIdNo?: string
  idType?: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  issuedCountry?: string
  issueDate?: string
  expiryDate?: string
}

interface Membership {
  no: number
  membershipNo: string
  planName: string
  planCode: string
  effectiveDate: string
  expiryDate: string
  personType: string
  company: string
  policyNo: string
}

interface PersonDetailsProps {
  person: Person
  onBack: () => void
}

export function PersonDetails({ person, onBack }: PersonDetailsProps) {
  const [activeTab, setActiveTab] = useState("membership")
  const [activePersonTab, setActivePersonTab] = useState("personInfo")

  // Sample membership data
  const membershipList: Membership[] = [
    {
      no: 1,
      membershipNo: "MEM-IND-001",
      planName: "Comprehensive Plan",
      planCode: "CP123",
      effectiveDate: "2023-01-01",
      expiryDate: "2024-01-01",
      personType: "Employee",
      company: "Individual Corp",
      policyNo: "POL-IND-001",
    },
    {
      no: 2,
      membershipNo: "MEM-IND-001-EXT",
      planName: "Extended Coverage Plan",
      planCode: "ECP456",
      effectiveDate: "2024-01-01",
      expiryDate: "2025-01-01",
      personType: "Employee",
      company: "Individual Corp",
      policyNo: "POL-IND-002",
    },
    {
      no: 3,
      membershipNo: "MEM-IND-001-SUPP",
      planName: "Supplementary Plan",
      planCode: "SP789",
      effectiveDate: "2023-06-01",
      expiryDate: "2024-06-01",
      personType: "Employee",
      company: "Individual Corp",
      policyNo: "POL-IND-003",
    },
  ]

  // State to track selected membership
  const [selectedMembership, setSelectedMembership] = useState<Membership>(membershipList[0])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handlePersonTabChange = (value: string) => {
    setActivePersonTab(value)
  }

  const handleMembershipSelect = (membership: Membership) => {
    setSelectedMembership(membership)
  }

  const serviceTypeCoverages = ["Inpatient", "Outpatient", "Dental", "Optical"]

  // Get dependents for this person
  const getDependents = () => {
    const allPersons = getPersons()
    return allPersons.filter((p) => p.employeeIdNo === person.idNo && p.personType !== "Employee" && p.id !== person.id)
  }

  const dependents = getDependents()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Person Details</h2>
      </div>

      <Tabs value={activePersonTab} onValueChange={handlePersonTabChange}>
        <TabsList>
          <TabsTrigger value="personInfo">Person Information</TabsTrigger>
          <TabsTrigger value="familyMemberInfo">Family Member Information</TabsTrigger>
          <TabsTrigger value="membershipList">Membership List</TabsTrigger>
        </TabsList>
        <TabsContent value="personInfo">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Person Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={person.name} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" value={person.gender || "N/A"} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="idType">ID Type</Label>
                    <Input id="idType" value={person.idType || "N/A"} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      value={person.dateOfBirth ? new Date(person.dateOfBirth).toLocaleDateString() : "N/A"}
                      readOnly
                    />
                  </div>
                  {person.idType === "Passport No." && (
                    <div>
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <Input
                        id="issueDate"
                        value={person.issueDate ? new Date(person.issueDate).toLocaleDateString() : "N/A"}
                        readOnly
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" value={person.status} readOnly />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="personId">Person ID</Label>
                    <Input id="personId" value={person.personId} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" value={person.nationality || "N/A"} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="idNo">ID No.</Label>
                    <Input id="idNo" value={person.idNo} readOnly />
                  </div>
                  {person.idType === "Passport No." && (
                    <>
                      <div>
                        <Label htmlFor="issuedCountry">Issued Country</Label>
                        <Input id="issuedCountry" value={person.issuedCountry || "N/A"} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={person.expiryDate ? new Date(person.expiryDate).toLocaleDateString() : "N/A"}
                          readOnly
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="familyMemberInfo">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Family Member Information</CardTitle>
            </CardHeader>
            <CardContent>
              {dependents.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {dependents.length} family member{dependents.length > 1 ? "s" : ""} found
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID No.</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Person ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Relationship</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Membership No.</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Policy No.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dependents.map((dependent, index) => (
                          <tr key={dependent.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{dependent.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{dependent.idNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{dependent.personId}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">{dependent.personType}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant={dependent.status === "Active" ? "default" : "secondary"}>
                                {dependent.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{dependent.membershipNo}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{dependent.companyName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{dependent.policyNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No family member information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="membershipList">
          <div className="space-y-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Membership List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">No</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Membership No.</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Plan Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Plan Code</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Effective Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Expiry Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Person Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {membershipList.map((membership) => (
                        <tr
                          key={membership.no}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedMembership.no === membership.no ? "bg-gray-100" : ""}`}
                          onClick={() => handleMembershipSelect(membership)}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">{membership.no}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{membership.membershipNo}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{membership.planName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{membership.planCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{membership.effectiveDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{membership.expiryDate}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline">{membership.personType}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{membership.company}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="dependent">Family Member</TabsTrigger>
                <TabsTrigger value="visitHistoryUtilization">Visit History & Utilization</TabsTrigger>
                <TabsTrigger value="visitHistory">Visit History</TabsTrigger>
                <TabsTrigger value="personJourney">Person Journey</TabsTrigger>
                <TabsTrigger value="bankInfo">Bank Info</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="membership">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="planName">Plan Name</Label>
                        <Input id="planName" value={selectedMembership.planName} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="planCode">Plan Code</Label>
                        <Input id="planCode" value={selectedMembership.planCode} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input id="effectiveDate" value={selectedMembership.effectiveDate} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" value={selectedMembership.expiryDate} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="membershipNo">Membership No.</Label>
                        <Input id="membershipNo" value={selectedMembership.membershipNo} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" value={selectedMembership.company} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="personType">Person Type</Label>
                        <Input id="personType" value={selectedMembership.personType} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="policyNo">Policy No.</Label>
                        <Input id="policyNo" value={selectedMembership.policyNo} readOnly />
                      </div>
                    </div>

                    <div>
                      <Label>Service Type Coverage</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {serviceTypeCoverages.map((serviceType) => (
                          <Badge key={serviceType} variant="secondary">
                            {serviceType}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Service Type Combinations</Label>
                      <p className="text-sm text-muted-foreground">No combinations available.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="limitType">Limit Type</Label>
                        <Input id="limitType" value="Annual" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="limitAmount">Limit Amount</Label>
                        <Input id="limitAmount" value="10,000" readOnly />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="dependent">
                <Card>
                  <CardHeader>
                    <CardTitle>Family Member Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dependents.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          {dependents.length} family member{dependents.length > 1 ? "s" : ""} found
                        </p>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID No.</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Person ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Relationship</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                  Membership No.
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Policy No.</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {dependents.map((dependent, index) => (
                                <tr key={dependent.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm text-gray-900">{dependent.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{dependent.idNo}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{dependent.personId}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <Badge variant="outline">{dependent.personType}</Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <Badge variant={dependent.status === "Active" ? "default" : "secondary"}>
                                      {dependent.status}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{dependent.membershipNo}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{dependent.companyName}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{dependent.policyNo}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No family member information available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="visitHistoryUtilization">
                <Card>
                  <CardHeader>
                    <CardTitle>Visit History & Utilization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No visit history & utilization information available.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="visitHistory">
                <Card>
                  <CardHeader>
                    <CardTitle>Visit History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No visit history information available.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="personJourney">
                <Card>
                  <CardHeader>
                    <CardTitle>Person Journey</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No person journey information available.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="bankInfo">
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No bank information available.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No summary information available.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
