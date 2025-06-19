"use client"

import { useState, useEffect } from "react"
import { Plus, Users, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getAllPersonFamilyMembers,
  registerFamilyRelationship,
  updateRelationshipStatus,
  getPersons,
  type PersonProfile,
} from "@/lib/person/person-storage"

interface FamilyRelationshipManagerProps {
  personId: string
}

export function FamilyRelationshipManager({ personId }: FamilyRelationshipManagerProps) {
  const [familyMembers, setFamilyMembers] = useState<
    Array<{
      person: PersonProfile
      relationship: string
      relationshipStatus: string
      registeredDate: string
      isCoveredInAnyPlan: boolean
    }>
  >([])
  const [allPersons, setAllPersons] = useState<PersonProfile[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState("")
  const [selectedRelationship, setSelectedRelationship] = useState("")
  const [relationshipNotes, setRelationshipNotes] = useState("")

  const relationshipTypes = [
    "Spouse",
    "Husband",
    "Wife",
    "Father",
    "Mother",
    "Son",
    "Daughter",
    "Brother",
    "Sister",
    "Grandfather",
    "Grandmother",
    "Grandson",
    "Granddaughter",
    "Uncle",
    "Aunt",
    "Nephew",
    "Niece",
    "Cousin",
    "Father-in-law",
    "Mother-in-law",
    "Son-in-law",
    "Daughter-in-law",
    "Brother-in-law",
    "Sister-in-law",
    "Stepfather",
    "Stepmother",
    "Stepson",
    "Stepdaughter",
    "Guardian",
    "Ward",
    "Other",
  ]

  useEffect(() => {
    loadData()
  }, [personId])

  const loadData = () => {
    setFamilyMembers(getAllPersonFamilyMembers(personId))
    setAllPersons(getPersons().filter((p) => p.id !== personId)) // Exclude self
  }

  // Update the relationship registration to be more explicit about direction
  const handleAddRelationship = async () => {
    if (!selectedPersonId || !selectedRelationship) return

    try {
      // Register the relationship as entered
      // If user selects "Father" for the selected person, it means the selected person is the Father of the current person
      await registerFamilyRelationship(
        selectedPersonId, // The person who has the selected relationship
        personId, // The current person (who this relationship is relative to)
        selectedRelationship, // The exact relationship as selected
        "directional", // Most family relationships are directional for clarity
        relationshipNotes || undefined,
      )

      // Reset form
      setSelectedPersonId("")
      setSelectedRelationship("")
      setRelationshipNotes("")
      setIsAddDialogOpen(false)

      // Reload data
      loadData()
    } catch (error) {
      console.error("Error adding relationship:", error)
    }
  }

  const handleUpdateRelationshipStatus = async (relationshipId: string, newStatus: string) => {
    try {
      await updateRelationshipStatus(relationshipId, newStatus as any)
      loadData()
    } catch (error) {
      console.error("Error updating relationship status:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Family Relationship Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage all family relationships independent of insurance coverage
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Family Relationship</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This registers a family relationship record. Insurance coverage can be added separately later.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="person-select">Select Family Member</Label>
                <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a person..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allPersons.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name} ({person.personId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="relationship-select">Relationship Type</Label>
                <Select value={selectedRelationship} onValueChange={setSelectedRelationship}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose relationship..." />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={relationshipNotes}
                  onChange={(e) => setRelationshipNotes(e.target.value)}
                  placeholder="Additional notes about this relationship..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRelationship} disabled={!selectedPersonId || !selectedRelationship}>
                  Register Relationship
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Family Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Family Members ({familyMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {familyMembers.length > 0 ? (
            <div className="space-y-4">
              {familyMembers.map((fm, index) => (
                <div key={fm.person.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{fm.person.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {fm.person.personId} • {fm.person.idNo}
                          </p>
                        </div>
                        <Badge variant="outline">{fm.relationship}</Badge>
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
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Registered: {new Date(fm.registeredDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className={fm.isCoveredInAnyPlan ? "text-green-600" : "text-orange-600"}>
                          {fm.isCoveredInAnyPlan ? "Currently Covered" : "Available for Coverage"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {fm.relationshipStatus === "Active" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateRelationshipStatus(fm.person.id, "Inactive")}
                          >
                            Mark Inactive
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateRelationshipStatus(fm.person.id, "Deceased")}
                          >
                            Mark Deceased
                          </Button>
                        </>
                      )}
                      {fm.relationshipStatus !== "Active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateRelationshipStatus(fm.person.id, "Active")}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No family relationships registered</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add family members to maintain complete family records for future reference
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
