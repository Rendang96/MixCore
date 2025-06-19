"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Users, Briefcase, Heart, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  getPersonById,
  getPersonEmployment,
  getPersonType,
  getPersonMembershipsNormalized,
  migrateToNewStructure,
  type PersonProfile,
  type EmploymentRecord,
  type NormalizedMembership,
  getAllPersonFamilyMembers,
  getCoveredFamilyMembers,
} from "@/lib/person/person-storage"

interface ImprovedPersonDetailsProps {
  personId: string
  onBack: () => void
  onNavigateToFamilyMember?: (personId: string) => void
}

export function ImprovedPersonDetails({ personId, onBack, onNavigateToFamilyMember }: ImprovedPersonDetailsProps) {
  const [person, setPerson] = useState<PersonProfile | null>(null)
  const [familyMembers, setFamilyMembers] = useState<
    Array<{
      person: PersonProfile
      relationship: string
      relationshipStatus: string
      isCoveredInAnyPlan: boolean
      registeredDate: Date
    }>
  >([])
  const [employment, setEmployment] = useState<EmploymentRecord | null>(null)
  const [memberships, setMemberships] = useState<NormalizedMembership[]>([])
  const [personType, setPersonType] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Migrate existing data to new structure (run once)
    migrateToNewStructure()

    // Load person data
    const personData = getPersonById(personId)
    if (personData) {
      setPerson(personData)
      setFamilyMembers(getAllPersonFamilyMembers(personId))
      setEmployment(getPersonEmployment(personId))
      setMemberships(getPersonMembershipsNormalized(personId))
      setPersonType(getPersonType(personId))
    }
  }, [personId])

  // Add this mapping after the useEffect hook and before the serviceTypeData declaration
  const serviceTypeMapping = {
    Outpatient: "GP",
    Dental: "DT",
    Optical: "OC",
    Inpatient: "HP",
    Specialist: "SP",
    Maternity: "MT",
  }

  // Sample service type data for the new tab
  const serviceTypeData = [
    {
      code: "GP",
      name: "General Practitioner",
      description: "Primary healthcare services provided by general practitioners",
      status: "Active",
      coverageLimit: "RM 1,500.00",
      utilized: "RM 350.00",
      remaining: "RM 1,150.00",
      lastVisit: "2023-12-15",
    },
    {
      code: "SP",
      name: "Specialist",
      description: "Specialized medical services provided by specialists",
      status: "Active",
      coverageLimit: "RM 3,000.00",
      utilized: "RM 1,200.00",
      remaining: "RM 1,800.00",
      lastVisit: "2024-01-20",
    },
    {
      code: "OC",
      name: "Optical Care",
      description: "Eye examinations and optical products",
      status: "Active",
      coverageLimit: "RM 800.00",
      utilized: "RM 350.00",
      remaining: "RM 450.00",
      lastVisit: "2023-11-05",
    },
    {
      code: "DT",
      name: "Dental",
      description: "Dental treatments and procedures",
      status: "Active",
      coverageLimit: "RM 1,000.00",
      utilized: "RM 420.00",
      remaining: "RM 580.00",
      lastVisit: "2024-03-10",
    },
    {
      code: "MT",
      name: "Maternity",
      description: "Maternity and childbirth related services",
      status: "Active",
      coverageLimit: "RM 5,000.00",
      utilized: "RM 0.00",
      remaining: "RM 5,000.00",
      lastVisit: "N/A",
    },
    {
      code: "HP",
      name: "Hospital",
      description: "Inpatient hospital services",
      status: "Active",
      coverageLimit: "RM 15,000.00",
      utilized: "RM 3,200.00",
      remaining: "RM 11,800.00",
      lastVisit: "2024-02-10",
    },
  ]

  // Update the serviceHistoryData array to use the full service type names that will be mapped to codes
  const serviceHistoryData = [
    {
      date: "2024-03-15",
      serviceType: "Outpatient",
      provider: "City Medical Center",
      description: "Regular health checkup",
      amount: "RM 150.00",
      status: "Approved",
    },
    {
      date: "2024-02-10",
      serviceType: "Inpatient",
      provider: "Specialist Hospital",
      description: "Minor surgery procedure",
      amount: "RM 3,200.00",
      status: "Approved",
    },
    {
      date: "2024-01-20",
      serviceType: "Specialist",
      provider: "Cardiology Center",
      description: "Cardiology consultation",
      amount: "RM 300.00",
      status: "Approved",
    },
    {
      date: "2023-12-15",
      serviceType: "Outpatient",
      provider: "Family Clinic",
      description: "Flu treatment",
      amount: "RM 120.00",
      status: "Approved",
    },
    {
      date: "2023-11-05",
      serviceType: "Optical",
      provider: "Vision Care Center",
      description: "Eye examination and new glasses",
      amount: "RM 350.00",
      status: "Approved",
    },
    {
      date: "2023-10-20",
      serviceType: "Dental",
      provider: "Dental Care Plus",
      description: "Dental cleaning and checkup",
      amount: "RM 180.00",
      status: "Approved",
    },
  ]

  // Also update the utilization summary data to include the full service type names
  const utilizationSummaryData = [
    {
      serviceType: "Outpatient",
      utilized: "RM 1,850.00",
      limit: "RM 5,000.00",
      remaining: "RM 3,150.00",
    },
    {
      serviceType: "Dental",
      utilized: "RM 420.00",
      limit: "RM 1,000.00",
      remaining: "RM 580.00",
    },
    {
      serviceType: "Optical",
      utilized: "RM 0.00",
      limit: "RM 800.00",
      remaining: "RM 800.00",
    },
    {
      serviceType: "Inpatient",
      utilized: "RM 0.00",
      limit: "RM 15,000.00",
      remaining: "RM 15,000.00",
    },
  ]

  if (!person) {
    return <div>Person not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{person.name}</h2>
          <p className="text-sm text-muted-foreground">
            {personType} • {person.personId}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
          <TabsTrigger value="serviceTypes">Service Types</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={person.name} readOnly />
                  </div>
                  <div>
                    <Label>Person ID</Label>
                    <Input value={person.personId} readOnly />
                  </div>
                  <div>
                    <Label>ID Type & Number</Label>
                    <Input value={`${person.idType || "N/A"} - ${person.idNo}`} readOnly />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      value={person.dateOfBirth ? new Date(person.dateOfBirth).toLocaleDateString() : "N/A"}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Input value={person.gender || "N/A"} readOnly />
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <Input value={person.nationality || "N/A"} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={person.status === "Active" ? "default" : "secondary"}>{person.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Quick Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Person Type:</span>
                    <Badge variant="outline">{personType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Family Members:</span>
                    <span className="text-sm">{familyMembers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Active Memberships:</span>
                    <span className="text-sm">{memberships.filter((m) => m.status === "Active").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Employment Status:</span>
                    <Badge variant={employment ? "default" : "secondary"}>
                      {employment ? "Employed" : "Not Employed"}
                    </Badge>
                  </div>
                  {employment && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Company:</span>
                        <span className="text-sm">{employment.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Position:</span>
                        <span className="text-sm">{employment.position}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="family">
          <div className="space-y-6">
            {/* Family Relationships Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Registered Family Members</span>
                  <Badge variant="outline" className="text-xs">
                    {familyMembers.length} Total
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete family registry - includes all family members regardless of insurance coverage status. This
                  ensures complete family records for future reference and planning.
                </p>
              </CardHeader>
              <CardContent>
                {familyMembers.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Person ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID No.</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Relationship</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                              Relationship Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Coverage Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Registered Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {familyMembers.map((fm, index) => (
                            <tr key={fm.person.id} className="hover:bg-gray-50">
                              <td
                                className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
                                onClick={() => onNavigateToFamilyMember?.(fm.person.id)}
                              >
                                {fm.person.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{fm.person.personId}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{fm.person.idNo}</td>
                              <td className="px-4 py-3 text-sm">
                                <Badge variant="outline">{fm.relationship}</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <Badge
                                  variant={
                                    fm.relationshipStatus === "Active"
                                      ? "default"
                                      : fm.relationshipStatus === "Deceased"
                                        ? "destructive"
                                        : fm.relationshipStatus === "Divorced"
                                          ? "secondary"
                                          : "outline"
                                  }
                                >
                                  {fm.relationshipStatus}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Badge variant={fm.isCoveredInAnyPlan ? "default" : "secondary"}>
                                    {fm.isCoveredInAnyPlan ? "Covered" : "Not Covered"}
                                  </Badge>
                                  {!fm.isCoveredInAnyPlan && (
                                    <span className="text-xs text-muted-foreground">(Available for future plans)</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Date(fm.registeredDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {familyMembers.filter((fm) => fm.relationshipStatus === "Active").length}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Relationships</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {familyMembers.filter((fm) => fm.isCoveredInAnyPlan).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Currently Covered</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {
                            familyMembers.filter((fm) => !fm.isCoveredInAnyPlan && fm.relationshipStatus === "Active")
                              .length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">Available for Coverage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{familyMembers.length}</div>
                        <div className="text-sm text-muted-foreground">Total Registered</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No family members registered for this person.</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Family members can be registered independently of insurance coverage for future reference.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Coverage Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan Coverage</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Family members currently covered under active insurance plans.
                </p>
              </CardHeader>
              <CardContent>
                {(() => {
                  const coveredMembers = getCoveredFamilyMembers(personId)
                  return coveredMembers.length > 0 ? (
                  <div className="space-y-3">
                    {coveredMembers.map((cm, index) => (
                      <div
                        key={`${cm.person.id}-${cm.membershipNo}`}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{cm.person.name}</div>
                          <div className="text-sm text-muted-foreground">{cm.relationship}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{cm.planName}</div>
                          <div className="text-xs text-muted-foreground">{cm.membershipNo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No family members are currently covered under any active plans.
                  </p>
                  \
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employment ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Employee ID</Label>
                    <Input value={employment.employeeId} readOnly />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={employment.companyName} readOnly />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input value={employment.department} readOnly />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input value={employment.position} readOnly />
                  </div>
                  <div>
                    <Label>Job Grade</Label>
                    <Input value={employment.jobGrade} readOnly />
                  </div>
                  <div>
                    <Label>Join Date</Label>
                    <Input value={new Date(employment.joinDate).toLocaleDateString()} readOnly />
                  </div>
                  <div>
                    <Label>Employment Type</Label>
                    <Input value={employment.employmentType} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={employment.isActive ? "default" : "secondary"}>{employment.employmentStatus}</Badge>
                  </div>
                  <div>
                    <Label>Work Location</Label>
                    <Input value={employment.workLocation} readOnly />
                  </div>
                  {employment.salary && (
                    <div>
                      <Label>Salary</Label>
                      <Input value={employment.salary} readOnly />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No employment information found for this person.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memberships">
          <Card>
            <CardHeader>
              <CardTitle>Membership Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              {memberships.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {memberships.length} membership{memberships.length > 1 ? "s" : ""} found
                  </p>
                  <div className="space-y-4">
                    {memberships.map((membership, index) => {
                      const personRole =
                        membership.primaryEmployeeId === personId
                          ? "Primary"
                          : membership.coveredPersons.find((cp) => cp.personId === personId)?.membershipRole ||
                            "Unknown"

                      return (
                        <div key={membership.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{membership.planName}</h4>
                              <p className="text-sm text-muted-foreground">{membership.membershipNo}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{personRole}</Badge>
                              <p className="text-sm text-muted-foreground mt-1">{membership.priority}</p>
                            </div>
                          </div>

                          <div className="grid gap-2 md:grid-cols-3 text-sm">
                            <div>
                              <span className="font-medium">Company:</span> {membership.companyName}
                            </div>
                            <div>
                              <span className="font-medium">Policy:</span> {membership.policyNo}
                            </div>
                            <div>
                              <span className="font-medium">Period:</span> {membership.effectiveDate} -{" "}
                              {membership.expiryDate}
                            </div>
                          </div>

                          <div className="mt-3">
                            <span className="text-sm font-medium">Covered Persons: </span>
                            <span className="text-sm">{membership.coveredPersons.length + 1}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No membership coverage found for this person.</p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Visit History & Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Visit History</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Provider</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Service Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {serviceHistoryData.slice(0, 3).map((history, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">{new Date(history.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">{history.provider}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">
                                {serviceTypeMapping[history.serviceType] || history.serviceType}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{history.amount}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant={history.status === "Approved" ? "default" : "secondary"}>
                                {history.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Utilization Summary</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Service Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Utilized</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Limit</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Remaining</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {utilizationSummaryData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline">
                                {serviceTypeMapping[item.serviceType] || item.serviceType}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{item.utilized}</td>
                            <td className="px-4 py-3 text-sm">{item.limit}</td>
                            <td className="px-4 py-3 text-sm">{item.remaining}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="serviceTypes">
          <div className="space-y-6">
            {/* Service Types Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Service Types Coverage
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Details of healthcare service types covered under the person's insurance plans.
                </p>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Service Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Coverage Limit</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Utilized</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Remaining</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Last Visit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {serviceTypeData.map((service, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{service.code}</td>
                          <td className="px-4 py-3 text-sm">{service.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{service.description}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={service.status === "Active" ? "default" : "secondary"}>
                              {service.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{service.coverageLimit}</td>
                          <td className="px-4 py-3 text-sm">{service.utilized}</td>
                          <td className="px-4 py-3 text-sm">{service.remaining}</td>
                          <td className="px-4 py-3 text-sm">
                            {service.lastVisit === "N/A" ? "N/A" : new Date(service.lastVisit).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Service History Card */}
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <p className="text-sm text-muted-foreground">Recent healthcare service visits and claims history.</p>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Service Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Provider</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {serviceHistoryData.map((history, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{new Date(history.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline">
                              {serviceTypeMapping[history.serviceType] || history.serviceType}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{history.provider}</td>
                          <td className="px-4 py-3 text-sm">{history.description}</td>
                          <td className="px-4 py-3 text-sm">{history.amount}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={history.status === "Approved" ? "default" : "secondary"}>
                              {history.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">6</div>
                    <div className="text-sm text-muted-foreground">Total Service Types</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">RM 26,300.00</div>
                    <div className="text-sm text-muted-foreground">Total Coverage Limit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">RM 5,520.00</div>
                    <div className="text-sm text-muted-foreground">Total Utilized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">RM 20,780.00</div>
                    <div className="text-sm text-muted-foreground">Total Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
