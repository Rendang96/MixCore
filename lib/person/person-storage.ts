// lib/person/person-storage.ts

import type { Person as PersonType } from "./person-types"

// New improved interfaces for better relationship modeling

// ===================================================================
// IMPORTANT: FAMILY RELATIONSHIPS vs PLAN COVERAGE SEPARATION
// ===================================================================
//
// This system maintains a clear separation between:
// 1. FAMILY RELATIONSHIPS - All registered family connections (permanent records)
// 2. PLAN COVERAGE - Who is covered under specific insurance plans (can change)
//
// The Family Member Information tab shows ALL registered family members,
// regardless of whether they are covered by any insurance plan or not.
// This ensures future flexibility and complete family record keeping.
// ===================================================================

export interface PersonRelationship {
  id: string
  personId1: string // ID of the primary person
  personId2: string // ID of the related person (dependent)
  relationshipType: string // e.g., "Spouse", "Child", "Parent"
  relationshipDirection: "directional" | "bidirectional" // e.g., "directional" (parent-child), "bidirectional" (spouse-spouse)
  status: "Active" | "Inactive"
  createdDate?: string
  createdBy?: string
  effectiveDate: string
  endDate?: string
  notes?: string
  registeredBy?: string
  registeredDate?: string
}

export interface MembershipPerson {
  personId: string
  membershipRole: "Primary" | "Dependent" | "Beneficiary"
  coverageStartDate: string
  coverageEndDate?: string
  status: "Active" | "Inactive" | "Suspended"
}

export interface NormalizedMembership {
  id: string
  membershipNo: string
  planName: string
  planCode: string
  effectiveDate: string
  expiryDate: string
  priority: string
  companyId: string
  companyName: string
  companyCode: string
  policyNo: string
  status: string
  primaryEmployeeId: string // The main employee who owns this membership
  coveredPersons: MembershipPerson[] // All people covered under this membership
  visitHistory: VisitRecord[]
  utilization: UtilizationRecord[]
  personJourney: JourneyRecord[]
  bankInfo: BankInfo
}

export interface PersonProfile {
  id: string
  personId: string
  name: string
  idNo: string
  idType: string
  dateOfBirth?: Date | string
  gender?: string
  nationality?: string
  status: string

  // Passport specific fields
  issuedCountry?: string
  issueDate?: Date | string
  expiryDate?: Date | string

  // New additional fields
  email?: string
  phoneNo?: string
  salutation?: string
  addresses?: { streetAddress: string; postcode: string; city: string; state: string; country: string; type: string }[]

  // New disability status fields
  disabilityStatus?: string
  specifyDisability?: string

  // Health Info fields (added)
  allergiesType?: string[] // e.g., ["Food", "Medicine"]
  allergiesDetails?: Record<string, string> // e.g., { "Food": "Peanuts", "Medicine": "Penicillin" }
  smoker?: boolean
  alcoholConsumption?: boolean

  // Audit fields
  dateCreated: string
  dateModified: string
  createdBy: string
  modifiedBy: string
  // Added for sample data consistency
  companyName?: string
  companyCode?: string
  policyNo?: string
}

export interface EmploymentRecord {
  id: string
  personId: string
  companyId: string
  companyName: string
  companyCode: string
  employeeId: string
  department: string
  position: string
  jobGrade: string
  joinDate: string
  endDate?: string
  employmentType: string
  employmentStatus: string
  reportingManagerId?: string
  workLocation: string
  salary?: string
  benefits?: string[]
  isActive: boolean
}

// Define the Membership interface
export interface Membership {
  no: number
  membershipNo: string
  planName: string
  planCode: string
  effectiveDate: string
  expiryDate: string
  personType: string
  company: string
  policyNo: string
  priority: string // Add this new field
  familyMembers: FamilyMember[]
  visitHistory: VisitRecord[]
  utilization: UtilizationRecord[]
  personJourney: JourneyRecord[]
  bankInfo: BankInfo
}

export interface FamilyMember {
  name: string
  idNo: string
  personId: string
  relationship: string
  status: string
}

export interface VisitRecord {
  date: string
  provider: string
  serviceType: string
  amount: string
  status: string
}

export interface UtilizationRecord {
  serviceType: string
  utilized: string
  limit: string
  remaining: string
}

export interface JourneyRecord {
  date: string
  event: string
}

export interface BankInfo {
  bankName: string
  accountNumber: string
  accountHolder: string
  branchCode: string
}

// Define the PersonGroup interface for bulk uploads
export interface PersonGroup {
  id: string
  groupId: string
  groupName: string
  totalRecords: number
  dateUpload: string
  uploadStatus: string
  uploadedBy: string
  persons: PersonType[]
  companyName?: string
  companyCode?: string
  policyNo?: string
}

// Define the search criteria interface
export interface PersonSearchCriteria {
  personName?: string
  personId?: string
  idNo?: string
  membershipNo?: string
  personType?: string
  companyName?: string
  policyNo?: string
  status?: string
  includeInactive?: boolean
  dateFrom?: string
  dateTo?: string
}

// Define the bulk search criteria interface
export interface BulkSearchCriteria {
  groupId?: string
  groupName?: string
  membershipNo?: string
  personType?: string
  companyName?: string
  policyNo?: string
  status?: string
  includeInactive?: boolean
  dateFrom?: string
  dateTo?: string
}

// Local storage keys
const PERSONS_STORAGE_KEY = "persons"
const PERSON_GROUPS_STORAGE_KEY = "person_groups"
const PERSON_COUNTER_KEY = "person_counter"
const GROUP_COUNTER_KEY = "group_counter"
const MEMBERSHIPS_STORAGE_KEY = "person_memberships"

// Storage keys for new structures
const RELATIONSHIPS_STORAGE_KEY = "person_relationships"
const NORMALIZED_MEMBERSHIPS_STORAGE_KEY = "normalized_memberships"
const EMPLOYMENT_RECORDS_STORAGE_KEY = "employment_records"

// Helper to generate unique IDs
const generateUniqueId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Simulate a database or local storage
let personsData: PersonProfile[] = []
let relationshipsData: PersonRelationship[] = []

export const initializeSampleData = () => {
  if (typeof window !== "undefined" && !localStorage.getItem(PERSONS_STORAGE_KEY)) {
    const samplePersons: PersonProfile[] = [
      {
        id: "person-1",
        name: "Ahmad Farid bin Abdullah",
        personId: "PER-2025-123",
        idNo: "88888888",
        companyName: "Tech Solutions Inc.",
        policyNo: "POL-TS-001",
        status: "Active",
        companyCode: "TS001",
        dateOfBirth: "1988-05-10T00:00:00.000Z",
        gender: "Male",
        nationality: "Malaysian",
        idType: "IC No.",
        email: "ahmad.farid@example.com",
        phoneNo: "+60123456789",
        salutation: "Mr.",
        addresses: [
          {
            streetAddress: "123 Jalan Bahagia",
            postcode: "50000",
            city: "Kuala Lumpur",
            state: "Wilayah Persekutuan",
            country: "Malaysia",
            type: "Home",
          },
        ],
        disabilityStatus: "No",
        specifyDisability: "",
        allergiesType: ["Food"], // Added sample data
        allergiesDetails: { Food: "Seafood" }, // Added sample data
        smoker: false, // Added sample data
        alcoholConsumption: true, // Added sample data
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        createdBy: "System",
        modifiedBy: "System",
      },
      {
        id: "person-458", // Changed from "person-2"
        name: "Siti Aishah binti Hassan",
        personId: "PER-2025-458", // Changed from "PER-2025-124"
        idNo: "900101075000",
        companyName: "Tech Solutions Inc.",
        policyNo: "POL-TS-001",
        status: "Active",
        companyCode: "TS001",
        dateOfBirth: "1990-01-01T00:00:00.000Z",
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
        email: "siti.aishah@example.com",
        phoneNo: "+60198765432",
        salutation: "Mrs.",
        addresses: [
          {
            streetAddress: "123 Jalan Bahagia",
            postcode: "50000",
            city: "Kuala Lumpur",
            state: "Wilayah Persekutuan",
            country: "Malaysia",
            type: "Home",
          },
        ],
        disabilityStatus: "No",
        specifyDisability: "",
        allergiesType: ["Medicine"], // Added sample data
        allergiesDetails: { Medicine: "Aspirin" }, // Added sample data
        smoker: false, // Added sample data
        alcoholConsumption: false, // Added sample data
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        createdBy: "System",
        modifiedBy: "System",
      },
      {
        id: "person-3",
        name: "Ahmad Danial bin Ahmad Farid",
        personId: "PER-2025-125",
        idNo: "150303140000",
        companyName: "Tech Solutions Inc.",
        policyNo: "POL-TS-001",
        status: "Active",
        companyCode: "TS001",
        dateOfBirth: "2015-03-03T00:00:00.000Z",
        gender: "Male",
        nationality: "Malaysian",
        idType: "IC No.",
        email: "",
        phoneNo: "",
        salutation: "Master",
        addresses: [
          {
            streetAddress: "123 Jalan Bahagia",
            postcode: "50000",
            city: "Kuala Lumpur",
            state: "Wilayah Persekutuan",
            country: "Malaysia",
            type: "Home",
          },
        ],
        disabilityStatus: "No",
        specifyDisability: "",
        allergiesType: [],
        allergiesDetails: {},
        smoker: false,
        alcoholConsumption: false,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        createdBy: "System",
        modifiedBy: "System",
      },
      {
        id: "person-4",
        name: "Lim Wei Ling",
        personId: "PER-2025-126",
        idNo: "920415140000",
        companyName: "Global Innovations Ltd.",
        policyNo: "POL-GI-002",
        status: "Active",
        companyCode: "GI002",
        dateOfBirth: "1992-04-15T00:00:00.000Z",
        gender: "Female",
        nationality: "Singaporean",
        idType: "IC No.",
        email: "wei.ling@example.com",
        phoneNo: "+6591234567",
        salutation: "Ms.",
        addresses: [
          {
            streetAddress: "Unit 45, Orchard Road",
            postcode: "238888",
            city: "Singapore",
            state: "",
            country: "Singapore",
            type: "Home",
          },
        ],
        disabilityStatus: "No",
        specifyDisability: "",
        allergiesType: [],
        allergiesDetails: {},
        smoker: false,
        alcoholConsumption: false,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        createdBy: "System",
        modifiedBy: "System",
      },
      {
        id: "person-5",
        name: "John Doe",
        personId: "PER-2025-127",
        idNo: "A1234567",
        companyName: "International Corp.",
        policyNo: "POL-IC-003",
        status: "Active",
        companyCode: "IC003",
        dateOfBirth: "1980-11-20T00:00:00.000Z",
        gender: "Male",
        nationality: "American",
        idType: "Passport No.",
        issuedCountry: "United States",
        issueDate: "2020-01-01T00:00:00.000Z",
        expiryDate: "2030-01-01T00:00:00.000Z",
        email: "john.doe@example.com",
        phoneNo: "+12125551234",
        salutation: "Mr.",
        addresses: [
          {
            streetAddress: "100 Main St",
            postcode: "10001",
            city: "New York",
            state: "NY",
            country: "United States",
            type: "Work",
          },
        ],
        disabilityStatus: "Yes",
        specifyDisability: "Mobility impairment",
        allergiesType: ["Others"],
        allergiesDetails: { Others: "Dust" },
        smoker: true,
        alcoholConsumption: true,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        createdBy: "System",
        modifiedBy: "System",
      },
      {
        id: "person-6",
        name: "Nur Aisyah binti Ahmad Farid",
        personId: "PER-2025-460",
        idNo: "140820-14-5678",
        companyName: "Tech Solutions Inc.",
        policyNo: "POL-TS-001",
        status: "Active",
        companyCode: "TS001",
        dateOfBirth: "2014-08-20T00:00:00.000Z",
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
        email: "",
        phoneNo: "",
        salutation: "Miss",
        addresses: [
          {
            streetAddress: "123 Jalan Bahagia",
            postcode: "50000",
            city: "Kuala Lumpur",
            state: "Wilayah Persekutuan",
            country: "Malaysia",
            type: "Home",
          },
        ],
        disabilityStatus: "No",
        specifyDisability: "",
        allergiesType: [],
        allergiesDetails: {},
        smoker: false,
        alcoholConsumption: false,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        createdBy: "System",
        modifiedBy: "System",
      },
      {
        id: "person-7",
        name: "Ahmad Arif bin Ahmad Farid",
        personId: "PER-2025-461",
        idNo: "170612-14-9012",
        companyName: "Tech Solutions Inc.",
        policyNo: "POL-TS-001",
        status: "Active",
        companyCode: "TS001",
        dateOfBirth: "2017-06-12T00:00:00.000Z",
        gender: "Male",
        nationality: "Malaysian",
        idType: "IC No.",
        email: "",
        phoneNo: "",
        salutation: "Master",
        addresses: [
          {
            streetAddress: "123 Jalan Bahagia",
            postcode: "50000",
            city: "Kuala Lumpur",
            state: "Wilayah Persekutuan",
            country: "Malaysia",
            type: "Home",
          },
        ],
        disabilityStatus: "No",
        specifyDisability: "",
        allergiesType: [],
        allergiesDetails: {},
        smoker: false,
        alcoholConsumption: false,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        createdBy: "System",
        modifiedBy: "System",
      },
    ]

    const sampleRelationships: PersonRelationship[] = [
      {
        id: "rel-1",
        personId1: "person-1",
        personId2: "person-458", // Changed from "person-2"
        relationshipType: "Spouse",
        relationshipDirection: "bidirectional",
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: "System",
        effectiveDate: "2010-06-15",
      },
      {
        id: "rel-2",
        personId1: "person-1",
        personId2: "person-3",
        relationshipType: "Child",
        relationshipDirection: "directional",
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: "System",
        effectiveDate: "2015-03-03",
      },
      {
        id: "rel-3",
        personId1: "person-458", // Changed from "person-2"
        personId2: "person-3",
        relationshipType: "Child",
        relationshipDirection: "directional",
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: "System",
        effectiveDate: "2015-03-03",
      },
      {
        id: "rel-4",
        personId1: "person-1", // Ahmad Farid
        personId2: "person-6", // Nur Aisyah
        relationshipType: "Child",
        relationshipDirection: "directional",
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: "System",
        effectiveDate: "2014-08-20",
      },
      {
        id: "rel-5",
        personId1: "person-458", // Siti Aishah
        personId2: "person-6", // Nur Aisyah
        relationshipType: "Child",
        relationshipDirection: "directional",
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: "System",
        effectiveDate: "2014-08-20",
      },
      {
        id: "rel-6",
        personId1: "person-1", // Ahmad Farid
        personId2: "person-7", // Ahmad Arif
        relationshipType: "Child",
        relationshipDirection: "directional",
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: "System",
        effectiveDate: "2017-06-12",
      },
      {
        id: "rel-7",
        personId1: "person-458", // Siti Aishah
        personId2: "person-7", // Ahmad Arif
        relationshipType: "Child",
        relationshipDirection: "directional",
        status: "Active",
        createdDate: new Date().toISOString(),
        createdBy: "System",
        effectiveDate: "2017-06-12",
      },
    ]

    localStorage.setItem(PERSONS_STORAGE_KEY, JSON.stringify(samplePersons))
    localStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(sampleRelationships))
  }
}

// Function to get persons from local storage
export const getPersons = (): PersonProfile[] => {
  if (typeof window === "undefined") {
    return personsData
  }

  const personsJson = localStorage.getItem(PERSONS_STORAGE_KEY)
  return personsJson ? JSON.parse(personsJson) : personsData
}

// Function to get person groups from local storage
export const getPersonGroups = (): PersonGroup[] => {
  if (typeof window === "undefined") {
    return []
  }

  const groupsJson = localStorage.getItem(PERSON_GROUPS_STORAGE_KEY)
  return groupsJson ? JSON.parse(groupsJson) : []
}

// Function to get memberships from local storage
export const getMemberships = (): { [personId: string]: Membership[] } => {
  if (typeof window === "undefined") {
    return {}
  }

  const membershipsJson = localStorage.getItem(MEMBERSHIPS_STORAGE_KEY)
  return membershipsJson ? JSON.parse(membershipsJson) : {}
}

// Relationship management functions
// Function to get person relationships from storage
export const getPersonRelationships = (): PersonRelationship[] => {
  if (typeof window === "undefined") return relationshipsData
  const relationshipsJson = localStorage.getItem(RELATIONSHIPS_STORAGE_KEY)
  return relationshipsJson ? JSON.parse(relationshipsJson) : relationshipsData
}

// Function to save person relationships to storage
export const savePersonRelationships = (relationships: PersonRelationship[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(relationships))
}

export const addPersonRelationship = (
  relationship: Omit<PersonRelationship, "id" | "createdDate" | "createdBy">,
): PersonRelationship => {
  const relationships = getPersonRelationships()
  const newRelationship: PersonRelationship = {
    ...relationship,
    id: `REL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdDate: new Date().toISOString(),
    createdBy: "System User",
  }

  relationships.push(newRelationship)
  savePersonRelationships(relationships)
  return newRelationship
}

// Update the function to also handle directional relationships properly
// Get family members for a person using the new relationship structure
export const getPersonFamilyMembers = (personId: string): Array<{ person: PersonProfile; relationship: string }> => {
  const relationships = getPersonRelationships()
  const allPersons = getPersons()
  const familyMembers: Array<{ person: PersonProfile; relationship: string }> = []

  relationships.forEach((rel) => {
    if (rel.status === "Active") {
      if (rel.personId1 === personId) {
        const relatedPerson = allPersons.find((p) => p.id === rel.personId2)
        if (relatedPerson) {
          familyMembers.push({
            person: relatedPerson,
            relationship: rel.relationshipType, // Show exact relationship as entered
          })
        }
      } else if (rel.personId2 === personId) {
        const relatedPerson = allPersons.find((p) => p.id === rel.personId1)
        if (relatedPerson) {
          // For directional relationships, we need to show the reverse
          // For bidirectional relationships, show the reverse relationship
          if (rel.relationshipDirection === "bidirectional") {
            const reverseRelationship = getReverseRelationshipType(rel.relationshipType)
            familyMembers.push({
              person: relatedPerson,
              relationship: reverseRelationship,
            })
          } else {
            // For directional relationships, we need to determine what this person is to the primary person
            // This requires storing both directions or computing the reverse
            const reverseRelationship = getReverseRelationshipType(rel.relationshipType)
            familyMembers.push({
              person: relatedPerson,
              relationship: reverseRelationship,
            })
          }
        }
      }
    }
  })

  return familyMembers
}

// Enhanced function to get ALL family members (regardless of coverage)
export const getAllPersonFamilyMembers = (
  personId: string,
): Array<{
  person: PersonProfile
  relationship: string
  relationshipStatus: string
  registeredDate: string
  isCoveredInAnyPlan: boolean // Additional info but not filtering criteria
}> => {
  const relationships = getPersonRelationships()
  const allPersons = getPersons()
  const allMemberships = getNormalizedMemberships()
  const familyMembers: Array<{
    person: PersonProfile
    relationship: string
    relationshipStatus: string
    registeredDate: string
    isCoveredInAnyPlan: boolean
  }> = []

  relationships.forEach((rel) => {
    // Include ALL relationships regardless of status (Active, Inactive, etc.)
    // This ensures complete family history is maintained
    if (rel.personId1 === personId) {
      const relatedPerson = allPersons.find((p) => p.id === rel.personId2)
      if (relatedPerson) {
        // Check if this person is covered in any plan (for informational purposes only)
        const isCovered = allMemberships.some((membership) =>
          membership.coveredPersons.some((cp) => cp.personId === rel.personId2 && cp.status === "Active"),
        )

        familyMembers.push({
          person: relatedPerson,
          relationship: rel.relationshipType, // Show exact relationship as entered
          relationshipStatus: rel.status,
          registeredDate: rel.registeredDate,
          isCoveredInAnyPlan: isCovered,
        })
      }
    } else if (rel.personId2 === personId && rel.relationshipDirection === "bidirectional") {
      const relatedPerson = allPersons.find((p) => p.id === rel.personId1)
      if (relatedPerson) {
        // Check if this person is covered in any plan (for informational purposes only)
        const isCovered = allMemberships.some((membership) =>
          membership.coveredPersons.some((cp) => cp.personId === rel.personId1 && cp.status === "Active"),
        )

        // For bidirectional relationships, show the reverse relationship
        const reverseRelationship = getReverseRelationshipType(rel.relationshipType)
        familyMembers.push({
          person: relatedPerson,
          relationship: reverseRelationship,
          relationshipStatus: rel.status,
          registeredDate: rel.registeredDate,
          isCoveredInAnyPlan: isCovered,
        })
      }
    }
  })

  return familyMembers
}

// Function to get ONLY family members covered in plans (for membership-specific views)
export const getCoveredFamilyMembers = (
  personId: string,
): Array<{
  person: PersonProfile
  relationship: string
  membershipNo: string
  planName: string
}> => {
  const memberships = getPersonMembershipsNormalized(personId)
  const allPersons = getPersons()
  const relationships = getPersonRelationships()
  const coveredMembers: Array<{
    person: PersonProfile
    relationship: string
    membershipNo: string
    planName: string
  }> = []

  memberships.forEach((membership) => {
    membership.coveredPersons.forEach((coveredPerson) => {
      if (coveredPerson.personId !== personId && coveredPerson.status === "Active") {
        const person = allPersons.find((p) => p.id === coveredPerson.personId)
        if (person) {
          // Find the relationship
          const relationship = relationships.find(
            (rel) =>
              (rel.personId1 === personId && rel.personId2 === coveredPerson.personId) ||
              (rel.personId2 === personId &&
                rel.personId1 === coveredPerson.personId &&
                rel.relationshipDirection === "bidirectional"),
          )

          const relationshipType = relationship
            ? relationship.personId1 === personId
              ? relationship.relationshipType
              : getReverseRelationshipType(relationship.relationshipType)
            : "Unknown"

          coveredMembers.push({
            person,
            relationship: relationshipType,
            membershipNo: membership.membershipNo,
            planName: membership.planName,
          })
        }
      }
    })
  })

  return coveredMembers
}

// Function to register a new family relationship (independent of any coverage)
export const registerFamilyRelationship = (
  personId1: string,
  personId2: string,
  relationshipType: string,
  relationshipDirection: "bidirectional" | "directional" = "bidirectional",
  notes?: string,
): PersonRelationship => {
  const relationships = getPersonRelationships()
  const currentUser = "System User" // Replace with actual user context
  const currentDate = new Date().toISOString()

  const newRelationship: PersonRelationship = {
    id: `REL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    personId1,
    personId2,
    relationshipType,
    relationshipDirection,
    status: "Active",
    effectiveDate: currentDate,
    notes,
    registeredBy: currentUser,
    registeredDate: currentDate,
    createdBy: currentUser,
    createdDate: currentDate,
  }

  relationships.push(newRelationship)
  savePersonRelationships(relationships)
  return newRelationship
}

// Function to update relationship status (e.g., divorce, death) without affecting coverage
export const updateRelationshipStatus = (
  relationshipId: string,
  newStatus: "Active" | "Inactive" | "Divorced" | "Deceased",
  endDate?: string,
  notes?: string,
): boolean => {
  const relationships = getPersonRelationships()
  const relationshipIndex = relationships.findIndex((rel) => rel.id === relationshipId)

  if (relationshipIndex !== -1) {
    relationships[relationshipIndex] = {
      ...relationships[relationshipIndex],
      status: newStatus,
      endDate,
      notes: notes || relationships[relationshipIndex].notes,
    }
    savePersonRelationships(relationships)
    return true
  }
  return false
}

// Helper function to get reverse relationship types
const getReverseRelationshipType = (relationshipType: string): string => {
  const reverseMap: { [key: string]: string } = {
    Spouse: "Spouse",
    Parent: "Child",
    Child: "Parent",
    Sibling: "Sibling",
    Father: "Child",
    Mother: "Child",
    Son: "Parent",
    Daughter: "Parent",
    Husband: "Wife",
    Wife: "Husband",
  }
  return reverseMap[relationshipType] || relationshipType
}

// Employment management functions
export const getEmploymentRecords = (): EmploymentRecord[] => {
  if (typeof window === "undefined") return []
  const employmentJson = localStorage.getItem(EMPLOYMENT_RECORDS_STORAGE_KEY)
  return employmentJson ? JSON.parse(employmentJson) : []
}

export const getPersonEmployment = (personId: string): EmploymentRecord | null => {
  const employmentRecords = getEmploymentRecords()
  return employmentRecords.find((emp) => emp.personId === personId && emp.isActive) || null
}

// Normalized membership functions
export const getNormalizedMemberships = (): NormalizedMembership[] => {
  if (typeof window === "undefined") return []
  const membershipsJson = localStorage.getItem(NORMALIZED_MEMBERSHIPS_STORAGE_KEY)
  return membershipsJson ? JSON.parse(membershipsJson) : []
}

export const getPersonMembershipsNormalized = (personId: string): NormalizedMembership[] => {
  const allMemberships = getNormalizedMemberships()
  return allMemberships.filter(
    (membership) =>
      membership.primaryEmployeeId === personId ||
      membership.coveredPersons.some((cp) => cp.personId === personId && cp.status === "Active"),
  )
}

// Function to determine person type based on relationships and employment
export const getPersonType = (personId: string): string => {
  const employment = getPersonEmployment(personId)
  if (employment) {
    return "Employee"
  }

  // If not an employee, determine type from relationships
  const familyMembers = getPersonFamilyMembers(personId)
  const employeeRelation = familyMembers.find((fm) => {
    const relatedEmployment = getPersonEmployment(fm.person.id)
    return relatedEmployment !== null
  })

  if (employeeRelation) {
    return employeeRelation.relationship
  }

  return "Individual"
}

// Function to save persons to local storage
const savePersons = (persons: PersonProfile[]) => {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(PERSONS_STORAGE_KEY, JSON.stringify(persons))
}

// Function to save person groups to local storage
const savePersonGroups = (groups: PersonGroup[]) => {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(PERSON_GROUPS_STORAGE_KEY, JSON.stringify(groups))
}

// Function to save memberships to local storage
const saveMemberships = (memberships: { [personId: string]: Membership[] }) => {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(MEMBERSHIPS_STORAGE_KEY, JSON.stringify(memberships))
}

// Function to get memberships for a specific person
export const getPersonMemberships = (personId: string): Membership[] => {
  const allMemberships = getMemberships()
  return allMemberships[personId] || []
}

// Function to set memberships for a specific person
export const setPersonMemberships = (personId: string, memberships: Membership[]): void => {
  const allMemberships = getMemberships()
  allMemberships[personId] = memberships
  saveMemberships(allMemberships)
}

// Function to get next person ID
const getNextPersonId = (): string => {
  if (typeof window === "undefined") {
    return "P000001"
  }

  const counter = localStorage.getItem(PERSON_COUNTER_KEY)
  const nextCounter = counter ? Number.parseInt(counter) + 1 : 1
  localStorage.setItem(PERSON_COUNTER_KEY, nextCounter.toString())
  return `P${nextCounter.toString().padStart(6, "0")}`
}

// Function to get next group ID
const getNextGroupId = (): string => {
  if (typeof window === "undefined") {
    return "GRP001"
  }

  const counter = localStorage.getItem(GROUP_COUNTER_KEY)
  const nextCounter = counter ? Number.parseInt(counter) + 1 : 1
  localStorage.setItem(GROUP_COUNTER_KEY, nextCounter.toString())
  return `GRP${nextCounter.toString().padStart(3, "0")}`
}

// Function to add a new person (single entry)
export const addPerson = (
  personData: Omit<PersonProfile, "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy">,
): PersonProfile => {
  const persons = getPersons()
  const currentDate = new Date().toISOString()
  const currentUser = "System User" // This could be replaced with actual user context

  const newPerson: PersonProfile = {
    ...personData,
    id: getNextPersonId(),
    dateCreated: currentDate,
    dateModified: currentDate,
    createdBy: currentUser,
    modifiedBy: currentUser,
    // Ensure date fields are stored as ISO strings for consistency
    dateOfBirth: personData.dateOfBirth instanceof Date ? personData.dateOfBirth.toISOString() : personData.dateOfBirth,
    issueDate: personData.issueDate instanceof Date ? personData.issueDate.toISOString() : personData.issueDate,
    expiryDate: personData.expiryDate instanceof Date ? personData.expiryDate.toISOString() : personData.expiryDate,
    // Ensure addresses are stored correctly
    addresses: personData.addresses || [],
  }

  persons.push(newPerson)
  savePersons(persons)

  return newPerson
}

// Function to add bulk persons
export const addBulkPersons = (
  groupData: Omit<PersonGroup, "id" | "groupId" | "totalRecords" | "persons">,
  personsData: Omit<PersonProfile, "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy">[],
): PersonGroup => {
  const persons = getPersons()
  const groups = getPersonGroups()
  const currentDate = new Date().toISOString()
  const currentUser = "System User" // This could be replaced with actual user context
  const groupId = getNextGroupId()
  const uploadBatchId = `BATCH_${Date.now()}`

  // Create new persons with group information
  const newPersons: PersonProfile[] = personsData.map((personData, index) => {
    // Generate Person ID using the same pattern as single entry
    const persons = getPersons()
    const timestamp = Date.now()
    let maxPerNumber = 0
    persons.forEach((person) => {
      if (person.personId && person.personId.startsWith("PER-2025-")) {
        const perNumber = Number.parseInt(person.personId.split("-")[2])
        if (!isNaN(perNumber) && perNumber > maxPerNumber) {
          maxPerNumber = perNumber
        }
      }
    })
    // Add index to ensure uniqueness within the batch
    const uniqueNumber = maxPerNumber + 1 + index + Math.floor(timestamp % 1000)
    const generatedPersonId = `PER-2025-${uniqueNumber.toString().padStart(3, "0")}`

    return {
      ...personData,
      id: getNextPersonId(),
      personId: generatedPersonId, // Use consistent pattern
      dateCreated: currentDate,
      dateModified: currentDate,
      createdBy: currentUser,
      modifiedBy: currentUser,
      // Ensure date fields are stored as ISO strings for consistency
      dateOfBirth:
        personData.dateOfBirth instanceof Date ? personData.dateOfBirth.toISOString() : personData.dateOfBirth,
      issueDate: personData.issueDate instanceof Date ? personData.issueDate.toISOString() : personData.issueDate,
      expiryDate: personData.expiryDate instanceof Date ? personData.expiryDate.toISOString() : personData.expiryDate,
      // Ensure addresses are stored correctly
      addresses: personData.addresses || [],
    }
  })

  // Create new group
  const newGroup: PersonGroup = {
    ...groupData,
    id: uploadBatchId,
    groupId: groupId,
    totalRecords: newPersons.length,
    persons: newPersons,
  }

  // Save to storage
  persons.push(...newPersons)
  groups.push(newGroup)
  savePersons(persons)
  savePersonGroups(groups)

  return newGroup
}

// Function to update an existing person
export const updatePerson = (personId: string, updates: Partial<PersonProfile>): PersonProfile | null => {
  const persons = getPersons()
  const index = persons.findIndex((p) => p.id === personId)

  if (index !== -1) {
    const currentDate = new Date().toISOString()
    const currentUser = "System User" // This could be replaced with actual user context

    persons[index] = {
      ...persons[index],
      ...updates,
      dateModified: currentDate,
      modifiedBy: currentUser,
    }

    savePersons(persons)
    return persons[index]
  }

  return null
}

// Function to update person profile with enhanced validation
export const updatePersonProfile = (personId: string, updates: Partial<PersonProfile>): PersonProfile | null => {
  const persons = getPersons()
  const index = persons.findIndex((p) => p.id === personId)

  if (index !== -1) {
    const currentDate = new Date().toISOString()
    const currentUser = "System User" // This could be replaced with actual user context

    // Ensure date fields are properly formatted
    const formattedUpdates = {
      ...updates,
      dateOfBirth: updates.dateOfBirth instanceof Date ? updates.dateOfBirth.toISOString() : updates.dateOfBirth,
      issueDate: updates.issueDate instanceof Date ? updates.issueDate.toISOString() : updates.issueDate,
      expiryDate: updates.expiryDate instanceof Date ? updates.expiryDate.toISOString() : updates.expiryDate,
      dateModified: currentDate,
      modifiedBy: currentUser,
    }

    persons[index] = {
      ...persons[index],
      ...formattedUpdates,
    }

    savePersons(persons)
    return persons[index]
  }

  return null
}

// Function to delete a person
export const deletePerson = (personId: string): boolean => {
  const persons = getPersons()
  const filteredPersons = persons.filter((p) => p.id !== personId)

  if (filteredPersons.length < persons.length) {
    savePersons(filteredPersons)

    // Update group total records if person was part of a group
    const deletedPerson = persons.find((p) => p.id === personId)
    if (deletedPerson?.groupId) {
      updateGroupTotalRecords(deletedPerson.groupId)
    }

    return true
  }

  return false
}

// Function to update group total records
const updateGroupTotalRecords = (groupId: string) => {
  const groups = getPersonGroups()
  const persons = getPersons()
  const groupIndex = groups.findIndex((g) => g.groupId === groupId)

  if (groupIndex !== -1) {
    const groupPersons = persons.filter((p) => p.groupId === groupId)
    groups[groupIndex].totalRecords = groupPersons.length
    groups[groupIndex].persons = groupPersons
    savePersonGroups(groups)
  }
}

// Function to get a person by ID
export const getPersonById = (personId: string): PersonProfile | null => {
  const persons = getPersons()
  return persons.find((p) => p.id === personId) || null
}

// Function to get persons by group ID
export const getPersonsByGroupId = (groupId: string): PersonProfile[] => {
  const persons = getPersons()
  return persons.filter((p) => p.groupId === groupId)
}

// Function to get a group by ID
export const getGroupById = (groupId: string): PersonGroup | null => {
  const groups = getPersonGroups()
  return groups.find((g) => g.groupId === groupId) || null
}

// Function to search persons (single view)
export const searchPersons = (criteria: PersonSearchCriteria): PersonProfile[] => {
  const persons = getPersons()

  return persons.filter((person) => {
    // Match name (case-insensitive partial match)
    if (criteria.personName && !person.name.toLowerCase().includes(criteria.personName.toLowerCase())) {
      return false
    }

    // Match person ID (case-insensitive partial match)
    if (criteria.personId && !person.personId.toLowerCase().includes(criteria.personId.toLowerCase())) {
      return false
    }

    // Match ID number (case-insensitive partial match)
    if (criteria.idNo && !person.idNo.toLowerCase().includes(criteria.idNo.toLowerCase())) {
      return false
    }

    // Match membership number (case-insensitive partial match)
    if (criteria.membershipNo && !person.membershipNo.toLowerCase().includes(criteria.membershipNo.toLowerCase())) {
      return false
    }

    // Match person type (exact match)
    // if (
    //   criteria.personType &&
    //   criteria.personType !== "all" &&
    //   person.personType.toLowerCase() !== criteria.personType.toLowerCase()
    // ) {
    //   return false
    // }

    // Match company name (case-insensitive partial match)
    // if (criteria.companyName && !person.companyName.toLowerCase().includes(criteria.companyName.toLowerCase())) {
    //   return false
    // }

    // Match policy number (case-insensitive partial match)
    // if (criteria.policyNo && !person.policyNo.toLowerCase().includes(criteria.policyNo.toLowerCase())) {
    //   return false
    // }

    // Match status (exact match)
    if (criteria.status && criteria.status !== "all" && person.status.toLowerCase() !== criteria.status.toLowerCase()) {
      return false
    }

    // Include inactive records check
    if (!criteria.includeInactive && person.status === "Inactive") {
      return false
    }

    // Date range check
    if (criteria.dateFrom || criteria.dateTo) {
      const personDate = new Date(person.dateCreated)
      if (criteria.dateFrom && personDate < new Date(criteria.dateFrom)) {
        return false
      }
      if (criteria.dateTo && personDate > new Date(criteria.dateTo)) {
        return false
      }
    }

    return true
  })
}

// Function to search person groups (bulk view)
export const searchPersonGroups = (criteria: BulkSearchCriteria): PersonGroup[] => {
  const groups = getPersonGroups()

  return groups.filter((group) => {
    // Match group ID (case-insensitive partial match)
    if (
      criteria.groupId &&
      criteria.groupId.trim() &&
      !group.groupId.toLowerCase().includes(criteria.groupId.toLowerCase())
    ) {
      return false
    }

    // Match group name (case-insensitive partial match)
    if (
      criteria.groupName &&
      criteria.groupName.trim() &&
      !group.groupName.toLowerCase().includes(criteria.groupName.toLowerCase())
    ) {
      return false
    }

    // Date range check
    if (criteria.dateFrom || criteria.dateTo) {
      const groupDate = new Date(group.dateUpload)
      if (criteria.dateFrom && groupDate < new Date(criteria.dateFrom)) {
        return false
      }
      if (criteria.dateTo && groupDate > new Date(criteria.dateTo)) {
        return false
      }
    }

    return true
  })
}

// Function to clear all persons (for testing)
export const clearPersons = () => {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem(PERSONS_STORAGE_KEY)
  localStorage.removeItem(PERSON_GROUPS_STORAGE_KEY)
  localStorage.removeItem(PERSON_COUNTER_KEY)
  localStorage.removeItem(GROUP_COUNTER_KEY)
  localStorage.removeItem(MEMBERSHIPS_STORAGE_KEY)
  localStorage.removeItem(RELATIONSHIPS_STORAGE_KEY)
  localStorage.removeItem(NORMALIZED_MEMBERSHIPS_STORAGE_KEY)
  localStorage.removeItem(EMPLOYMENT_RECORDS_STORAGE_KEY)
}

// Migration function to convert existing data to new structure
export const migrateToNewStructure = () => {
  const existingPersons = getPersons()
  const relationships: PersonRelationship[] = []
  const employmentRecords: EmploymentRecord[] = []

  existingPersons.forEach((person) => {
    // Create employment records for employees
    if (person.personType === "Employee") {
      const employmentRecord: EmploymentRecord = {
        id: `EMP-${person.id}`,
        personId: person.id,
        companyId: `COMP-${person.companyCode}`,
        companyName: person.companyName,
        companyCode: person.companyCode,
        employeeId: person.personId,
        department: "Unknown", // Would need to be filled in
        position: "Unknown", // Would need to be filled in
        jobGrade: "Unknown", // Would need to be filled in
        joinDate: person.dateCreated,
        employmentType: "Full Time",
        employmentStatus: person.status,
        workLocation: "Unknown", // Would need to be filled in
        isActive: person.status === "Active",
      }
      employmentRecords.push(employmentRecord)
    }

    // Create relationships for dependents
    // This logic needs to be adapted if person.employeeIdNo and person.employeeName are no longer directly on PersonProfile
    // For now, assuming they might still exist for migration purposes or are derived.
    // If they are removed, this part of migration would need to be re-evaluated based on how dependents are linked.
    // if (person.employeeIdNo && person.employeeName) {
    //   const employee = existingPersons.find((p) => p.idNo === person.employeeIdNo)
    //   if (employee) {
    //     const relationship: PersonRelationship = {
    //       id: `REL-${person.id}-${employee.id}`,
    //       personId1: employee.id,
    //       personId2: person.id,
    //       relationshipType: person.personType, // This might need mapping, e.g., "Dependent" -> "Child" or "Spouse"
    //       relationshipDirection: "directional",
    //       status: "Active",
    //       effectiveDate: person.dateCreated,
    //       createdBy: person.createdBy,
    //       createdDate: person.dateCreated,
    //     }
    //     relationships.push(relationship)
    //   }
    // }
  })

  // Save migrated data
  savePersonRelationships(relationships)
  localStorage.setItem(EMPLOYMENT_RECORDS_STORAGE_KEY, JSON.stringify(employmentRecords))
}

export interface Person {
  id: string
  name: string
  personId: string
  membershipNo?: string // Made optional as not all persons might have it
  idNo: string
  companyName?: string // Made optional
  companyCode?: string // Made optional
  policyNo?: string // Made optional
  status: string
  groupId?: string
  groupName?: string
  dateCreated: string
  dateModified: string
  createdBy: string
  modifiedBy: string
  dateOfBirth?: Date | string
  gender?: string
  nationality?: string
  idType?: string
  issuedCountry?: string
  issueDate?: Date | string
  expiryDate?: Date | string
  addresses?: { streetAddress: string; postcode: string; city: string; state: string; country: string; type: string }[]
  email?: string
  phoneNo?: string
  salutation?: string
  disabilityStatus?: string
  specifyDisability?: string
  allergiesType?: string[] // e.g., ["Food", "Medicine"]
  allergiesDetails?: Record<string, string> // e.g., { "Food": "Peanuts", "Medicine": "Penicillin" }
  smoker?: boolean
  alcoholConsumption?: boolean
}

export const getRelationshipsForPerson = (personId: string): PersonRelationship[] => {
  return relationshipsData.filter((rel) => rel.personId1 === personId || rel.personId2 === personId)
}

export const getPersonsBySearchTerm = (searchTerm: string): Person[] => {
  const persons = getPersons()
  if (!searchTerm) {
    return persons
  }
  const lowerCaseSearchTerm = searchTerm.toLowerCase()
  return persons.filter(
    (person) =>
      person.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      person.personId.toLowerCase().includes(lowerCaseSearchTerm) ||
      person.idNo.toLowerCase().includes(lowerCaseSearchTerm),
  )
}

export function getPersonRelationshipsData(personId: string): PersonRelationship[] {
  return relationshipsData.filter((rel) => rel.personId1 === personId || rel.personId2 === personId)
}

export function getDependentsOfPerson(primaryPersonId: string): PersonProfile[] {
  const dependentRelationships = relationshipsData.filter((rel) => rel.personId1 === primaryPersonId)
  const dependentIds = dependentRelationships.map((rel) => rel.personId2)
  const persons = getPersons()
  return persons.filter((person) => dependentIds.includes(person.id))
}

export function getPrimaryPersonForDependent(dependentId: string): PersonProfile | undefined {
  const primaryRelationship = relationshipsData.find((rel) => rel.personId2 === dependentId)
  if (primaryRelationship) {
    const persons = getPersons()
    return persons.find((person) => person.id === primaryRelationship.personId1)
  }
  return undefined
}

// For testing and resetting
export const clearAllPersons = () => {
  localStorage.removeItem(PERSONS_STORAGE_KEY)
  localStorage.removeItem(RELATIONSHIPS_STORAGE_KEY)
  personsData = []
  relationshipsData = []
}
