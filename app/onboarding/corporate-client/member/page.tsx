"use client"

import { OnboardingStepsSidebar, corporateClientSteps } from "@/components/onboarding/onboarding-steps-sidebar"
import { useCorporateClientForm } from "@/components/onboarding/corporate-client-form-provider"
import { useRouter } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Home, Search, User, Plus, Info } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MemberStep() {
  const { formData, updateFormData } = useCorporateClientForm()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Mock data for demonstration
  const memberSuggestions = [
    {
      id: "1",
      personId: "PER-2025-457",
      name: "Ahmad Farid bin Abdullah",
      idNumber: "A12345678",
      type: "Employee",
      status: "Active",
    },
    {
      id: "2",
      personId: "PER-2025-123",
      name: "Osas",
      idNumber: "A1234567",
      type: "Employee",
      status: "Active",
    },
  ]

  const filteredSuggestions = memberSuggestions.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.personId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.idNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setShowSuggestions(value.length > 0)
  }

  const handleSelectMember = (member: any) => {
    setSelectedMember(member)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const handleSave = () => {
    console.log("Saving member data:", selectedMember)
    router.push("/onboarding/corporate-client/summary")
  }

  return (
    <>
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: <Home className="h-4 w-4" />, href: "/" },
            { label: "Onboarding", href: "/onboarding" },
            { label: "Corporate Client", href: "/onboarding/corporate-client" },
            { label: "Member", href: "/onboarding/corporate-client/member" },
          ]}
        />
      </div>

      <div className="flex gap-12">
        <OnboardingStepsSidebar steps={corporateClientSteps} />

        <div className="flex-1 bg-white p-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Member Information</h2>
              <p className="text-gray-600">
                Add members to your corporate client account. You can search for existing members or add new ones.
              </p>
            </div>

            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Search Existing Members</TabsTrigger>
                <TabsTrigger value="new">Add New Member</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Search Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Label htmlFor="member-search">Search by name, Person ID, or ID number</Label>
                      <Input
                        id="member-search"
                        placeholder="Type to search for members..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="mt-1"
                      />

                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredSuggestions.map((member) => (
                            <div
                              key={member.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              onClick={() => handleSelectMember(member)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">{member.name}</div>
                                  <div className="text-sm text-gray-500">
                                    ID: {member.personId} • {member.idNumber}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{member.type}</Badge>
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    {member.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {searchQuery && filteredSuggestions.length === 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          No members found matching "{searchQuery}". Try a different search term or add a new member.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {selectedMember && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Selected Member
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                          <p className="text-lg font-medium">{selectedMember.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Person ID</Label>
                          <p className="text-lg font-medium">{selectedMember.personId}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">ID Number</Label>
                          <p className="text-lg font-medium">{selectedMember.idNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Member Type</Label>
                          <Badge variant="secondary" className="mt-1">
                            {selectedMember.type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="new" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Add New Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Create a new member profile. All fields marked with * are required.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-person-id">Person ID *</Label>
                        <Input id="new-person-id" placeholder="Enter person ID" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="new-person-name">Full Name *</Label>
                        <Input id="new-person-name" placeholder="Enter full name" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="new-id-number">ID Number *</Label>
                        <Input id="new-id-number" placeholder="Enter ID number" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="new-member-type">Member Type *</Label>
                        <select
                          id="new-member-type"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select type</option>
                          <option value="Employee">Employee</option>
                          <option value="Dependent">Dependent</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between gap-3 mt-12 pt-6 border-t">
              <Button variant="outline" onClick={() => router.push("/onboarding/corporate-client/provider")}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={!selectedMember}>
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
