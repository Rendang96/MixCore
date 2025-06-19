// lib/person/person-storage.ts

// Define the Person interface
export interface Person {
  id: string
  name: string
  personId: string
  membershipNo: string
  idNo: string
  personType: string
  companyName: string
  companyCode: string
  policyNo: string
  status: string
  groupId?: string
  groupName?: string
  dateCreated: string
  dateModified: string
  createdBy: string
  modifiedBy: string
  employeeName?: string
  employeeIdNo?: string
  uploadBatchId?: string
  // New required fields
  dateOfBirth?: Date | string
  gender?: string
  nationality?: string
  idType?: string
  // New passport-specific fields
  issuedCountry?: string
  issueDate?: Date | string
  expiryDate?: Date | string
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
  persons: Person[]
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

// Function to get persons from local storage
export const getPersons = (): Person[] => {
  if (typeof window === "undefined") {
    return []
  }

  const personsJson = localStorage.getItem(PERSONS_STORAGE_KEY)
  return personsJson ? JSON.parse(personsJson) : []
}

// Function to get person groups from local storage
export const getPersonGroups = (): PersonGroup[] => {
  if (typeof window === "undefined") {
    return []
  }

  const groupsJson = localStorage.getItem(PERSON_GROUPS_STORAGE_KEY)
  return groupsJson ? JSON.parse(groupsJson) : []
}

// Function to save persons to local storage
const savePersons = (persons: Person[]) => {
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
  personData: Omit<Person, "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy">,
): Person => {
  const persons = getPersons()
  const currentDate = new Date().toISOString()
  const currentUser = "System User" // This could be replaced with actual user context

  const newPerson: Person = {
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
  }

  persons.push(newPerson)
  savePersons(persons)

  return newPerson
}

// Function to add bulk persons
export const addBulkPersons = (
  groupData: Omit<PersonGroup, "id" | "groupId" | "totalRecords" | "persons">,
  personsData: Omit<
    Person,
    "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy" | "groupId" | "groupName" | "uploadBatchId"
  >[],
): PersonGroup => {
  const persons = getPersons()
  const groups = getPersonGroups()
  const currentDate = new Date().toISOString()
  const currentUser = "System User" // This could be replaced with actual user context
  const groupId = getNextGroupId()
  const uploadBatchId = `BATCH_${Date.now()}`

  // Create new persons with group information
  const newPersons: Person[] = personsData.map((personData) => ({
    ...personData,
    id: getNextPersonId(),
    groupId: groupId,
    groupName: groupData.groupName,
    uploadBatchId: uploadBatchId,
    dateCreated: currentDate,
    dateModified: currentDate,
    createdBy: currentUser,
    modifiedBy: currentUser,
    // Ensure date fields are stored as ISO strings for consistency
    dateOfBirth: personData.dateOfBirth instanceof Date ? personData.dateOfBirth.toISOString() : personData.dateOfBirth,
    issueDate: personData.issueDate instanceof Date ? personData.issueDate.toISOString() : personData.issueDate,
    expiryDate: personData.expiryDate instanceof Date ? personData.expiryDate.toISOString() : personData.expiryDate,
  }))

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
export const updatePerson = (personId: string, updates: Partial<Person>): Person | null => {
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
export const getPersonById = (personId: string): Person | null => {
  const persons = getPersons()
  return persons.find((p) => p.id === personId) || null
}

// Function to get persons by group ID
export const getPersonsByGroupId = (groupId: string): Person[] => {
  const persons = getPersons()
  return persons.filter((p) => p.groupId === groupId)
}

// Function to get a group by ID
export const getGroupById = (groupId: string): PersonGroup | null => {
  const groups = getPersonGroups()
  return groups.find((g) => g.groupId === groupId) || null
}

// Function to search persons (single view)
export const searchPersons = (criteria: PersonSearchCriteria): Person[] => {
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
    if (
      criteria.personType &&
      criteria.personType !== "all" &&
      person.personType.toLowerCase() !== criteria.personType.toLowerCase()
    ) {
      return false
    }

    // Match company name (case-insensitive partial match)
    if (criteria.companyName && !person.companyName.toLowerCase().includes(criteria.companyName.toLowerCase())) {
      return false
    }

    // Match policy number (case-insensitive partial match)
    if (criteria.policyNo && !person.policyNo.toLowerCase().includes(criteria.policyNo.toLowerCase())) {
      return false
    }

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
    if (criteria.groupId && !group.groupId.toLowerCase().includes(criteria.groupId.toLowerCase())) {
      return false
    }

    // Match group name (case-insensitive partial match)
    if (criteria.groupName && !group.groupName.toLowerCase().includes(criteria.groupName.toLowerCase())) {
      return false
    }

    // For other criteria, check if any person in the group matches
    if (
      criteria.membershipNo ||
      criteria.personType ||
      criteria.companyName ||
      criteria.policyNo ||
      criteria.status ||
      !criteria.includeInactive
    ) {
      const matchingPersons = group.persons.filter((person) => {
        // Match membership number
        if (criteria.membershipNo && !person.membershipNo.toLowerCase().includes(criteria.membershipNo.toLowerCase())) {
          return false
        }

        // Match person type
        if (
          criteria.personType &&
          criteria.personType !== "all" &&
          person.personType.toLowerCase() !== criteria.personType.toLowerCase()
        ) {
          return false
        }

        // Match company name
        if (criteria.companyName && !person.companyName.toLowerCase().includes(criteria.companyName.toLowerCase())) {
          return false
        }

        // Match policy number
        if (criteria.policyNo && !person.policyNo.toLowerCase().includes(criteria.policyNo.toLowerCase())) {
          return false
        }

        // Match status
        if (
          criteria.status &&
          criteria.status !== "all" &&
          person.status.toLowerCase() !== criteria.status.toLowerCase()
        ) {
          return false
        }

        // Include inactive records check
        if (!criteria.includeInactive && person.status === "Inactive") {
          return false
        }

        return true
      })

      if (matchingPersons.length === 0) {
        return false
      }
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
}

// Function to initialize with sample data
export const initializeSampleData = () => {
  const existingPersons = getPersons()
  const existingGroups = getPersonGroups()

  // Only initialize if no data exists
  if (existingPersons.length === 0 && existingGroups.length === 0) {
    // Sample single persons with real Malaysian names - Updated Ahmad Farid with passport info
    const samplePersons: Omit<Person, "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy">[] = [
      {
        name: "Ahmad Farid bin Abdullah",
        personId: "PER-2025-457",
        membershipNo: "MEM-IND-001",
        idNo: "A12345678",
        personType: "Employee",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        dateOfBirth: new Date("1985-01-01").toISOString(),
        gender: "Male",
        nationality: "Malaysian",
        idType: "Passport No.",
        issuedCountry: "Malaysia",
        issueDate: new Date("2020-03-15").toISOString(),
        expiryDate: new Date("2030-03-14").toISOString(),
      },
      // Ahmad Farid's Wife
      {
        name: "Siti Aishah binti Ahmad",
        personId: "PER-2025-458",
        membershipNo: "MEM-IND-002",
        idNo: "870505-14-5678",
        personType: "Wife",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        employeeName: "Ahmad Farid bin Abdullah",
        employeeIdNo: "A12345678",
        dateOfBirth: new Date("1987-05-05").toISOString(),
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Ahmad Farid's First Child
      {
        name: "Ahmad Danial bin Ahmad Farid",
        personId: "PER-2025-459",
        membershipNo: "MEM-IND-003",
        idNo: "120315-14-1234",
        personType: "Child",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        employeeName: "Ahmad Farid bin Abdullah",
        employeeIdNo: "A12345678",
        dateOfBirth: new Date("2012-03-15").toISOString(),
        gender: "Male",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Ahmad Farid's Second Child
      {
        name: "Nur Aisyah binti Ahmad Farid",
        personId: "PER-2025-460",
        membershipNo: "MEM-IND-004",
        idNo: "140820-14-5678",
        personType: "Child",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        employeeName: "Ahmad Farid bin Abdullah",
        employeeIdNo: "A12345678",
        dateOfBirth: new Date("2014-08-20").toISOString(),
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Ahmad Farid's Third Child
      {
        name: "Ahmad Arif bin Ahmad Farid",
        personId: "PER-2025-461",
        membershipNo: "MEM-IND-005",
        idNo: "170612-14-9012",
        personType: "Child",
        companyName: "Individual Corp",
        companyCode: "IND01",
        policyNo: "POL-IND-001",
        status: "Active",
        employeeName: "Ahmad Farid bin Abdullah",
        employeeIdNo: "A12345678",
        dateOfBirth: new Date("2017-06-12").toISOString(),
        gender: "Male",
        nationality: "Malaysian",
        idType: "IC No.",
      },

      // 10 NEW COMPLETE DUMMY RECORDS
      // Record 1 - Employee with Passport
      {
        name: "Mohd Zulkifli bin Hassan",
        personId: "PER-2025-501",
        membershipNo: "MEM-ZUL-001",
        idNo: "P78901234",
        personType: "Employee",
        companyName: "Tech Innovations Sdn Bhd",
        companyCode: "TECH01",
        policyNo: "POL-TECH-001",
        status: "Active",
        dateOfBirth: new Date("1982-07-15").toISOString(),
        gender: "Male",
        nationality: "Malaysian",
        idType: "Passport No.",
        issuedCountry: "Malaysia",
        issueDate: new Date("2022-05-10").toISOString(),
        expiryDate: new Date("2032-05-09").toISOString(),
      },
      // Record 2 - Spouse with IC
      {
        name: "Noraini binti Ismail",
        personId: "PER-2025-502",
        membershipNo: "MEM-ZUL-002",
        idNo: "840923-14-5522",
        personType: "Wife",
        companyName: "Tech Innovations Sdn Bhd",
        companyCode: "TECH01",
        policyNo: "POL-TECH-001",
        status: "Active",
        employeeName: "Mohd Zulkifli bin Hassan",
        employeeIdNo: "P78901234",
        dateOfBirth: new Date("1984-09-23").toISOString(),
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Record 3 - Child with IC
      {
        name: "Nur Amira binti Mohd Zulkifli",
        personId: "PER-2025-503",
        membershipNo: "MEM-ZUL-003",
        idNo: "100712-14-6644",
        personType: "Child",
        companyName: "Tech Innovations Sdn Bhd",
        companyCode: "TECH01",
        policyNo: "POL-TECH-001",
        status: "Active",
        employeeName: "Mohd Zulkifli bin Hassan",
        employeeIdNo: "P78901234",
        dateOfBirth: new Date("2010-07-12").toISOString(),
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Record 4 - Employee with IC
      {
        name: "Tan Wei Ling",
        personId: "PER-2025-504",
        membershipNo: "MEM-TWL-001",
        idNo: "880405-10-5566",
        personType: "Employee",
        companyName: "Global Finance Group",
        companyCode: "GFG01",
        policyNo: "POL-GFG-001",
        status: "Active",
        dateOfBirth: new Date("1988-04-05").toISOString(),
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Record 5 - Spouse with Passport
      {
        name: "David Chen Jian Wei",
        personId: "PER-2025-505",
        membershipNo: "MEM-TWL-002",
        idNo: "S9876543Z",
        personType: "Husband",
        companyName: "Global Finance Group",
        companyCode: "GFG01",
        policyNo: "POL-GFG-001",
        status: "Active",
        employeeName: "Tan Wei Ling",
        employeeIdNo: "880405-10-5566",
        dateOfBirth: new Date("1986-11-20").toISOString(),
        gender: "Male",
        nationality: "Singapore",
        idType: "Passport No.",
        issuedCountry: "Singapore",
        issueDate: new Date("2021-08-15").toISOString(),
        expiryDate: new Date("2031-08-14").toISOString(),
      },
      // Record 6 - Employee with IC
      {
        name: "Rajendran a/l Subramaniam",
        personId: "PER-2025-506",
        membershipNo: "MEM-RAJ-001",
        idNo: "790215-08-7788",
        personType: "Employee",
        companyName: "Healthcare Solutions Bhd",
        companyCode: "HSB01",
        policyNo: "POL-HSB-001",
        status: "Active",
        dateOfBirth: new Date("1979-02-15").toISOString(),
        gender: "Male",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Record 7 - Spouse with IC
      {
        name: "Lakshmi a/p Govindasamy",
        personId: "PER-2025-507",
        membershipNo: "MEM-RAJ-002",
        idNo: "810630-08-5544",
        personType: "Wife",
        companyName: "Healthcare Solutions Bhd",
        companyCode: "HSB01",
        policyNo: "POL-HSB-001",
        status: "Active",
        employeeName: "Rajendran a/l Subramaniam",
        employeeIdNo: "790215-08-7788",
        dateOfBirth: new Date("1981-06-30").toISOString(),
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Record 8 - Employee with Passport (Foreign)
      {
        name: "Hiroshi Tanaka",
        personId: "PER-2025-508",
        membershipNo: "MEM-HIR-001",
        idNo: "TK8765432",
        personType: "Employee",
        companyName: "Eastern Manufacturing Co.",
        companyCode: "EMC01",
        policyNo: "POL-EMC-001",
        status: "Active",
        dateOfBirth: new Date("1975-09-18").toISOString(),
        gender: "Male",
        nationality: "Japanese",
        idType: "Passport No.",
        issuedCountry: "Japan",
        issueDate: new Date("2023-01-05").toISOString(),
        expiryDate: new Date("2033-01-04").toISOString(),
      },
      // Record 9 - Employee with IC (Inactive)
      {
        name: "Wong Mei Ling",
        personId: "PER-2025-509",
        membershipNo: "MEM-WML-001",
        idNo: "920708-14-3322",
        personType: "Employee",
        companyName: "Creative Design Studio",
        companyCode: "CDS01",
        policyNo: "POL-CDS-001",
        status: "Inactive",
        dateOfBirth: new Date("1992-07-08").toISOString(),
        gender: "Female",
        nationality: "Malaysian",
        idType: "IC No.",
      },
      // Record 10 - Employee with Passport (Suspended)
      {
        name: "John William Smith",
        personId: "PER-2025-510",
        membershipNo: "MEM-JWS-001",
        idNo: "A55667788",
        personType: "Employee",
        companyName: "International Consulting Group",
        companyCode: "ICG01",
        policyNo: "POL-ICG-001",
        status: "Suspended",
        dateOfBirth: new Date("1980-12-25").toISOString(),
        gender: "Male",
        nationality: "British",
        idType: "Passport No.",
        issuedCountry: "United Kingdom",
        issueDate: new Date("2019-11-30").toISOString(),
        expiryDate: new Date("2029-11-29").toISOString(),
      },
    ]

    // Add sample single persons
    samplePersons.forEach((personData) => {
      addPerson(personData)
    })

    // Add test record for passport matching functionality
    const testMatchRecord: Omit<Person, "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy">[] = [
      {
        name: "Osas",
        personId: "PER-2025-123",
        membershipNo: "MEM-OSA-001",
        idNo: "A1234567",
        personType: "Employee",
        companyName: "Test Company",
        companyCode: "TST01",
        policyNo: "POL-TEST-001",
        status: "Active",
        dateOfBirth: new Date("2025-05-01").toISOString(), // 01/05/2025
        gender: "Male",
        nationality: "Thailand",
        idType: "Passport No.",
        issuedCountry: "Thailand",
        issueDate: new Date("2020-01-01").toISOString(),
        expiryDate: new Date("2030-01-01").toISOString(),
      },
    ]

    // Add the test record
    testMatchRecord.forEach((personData) => {
      addPerson(personData)
    })

    // Add additional dummy person with complete passport information
    const additionalDummyPerson: Omit<Person, "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy">[] = [
      {
        name: "Sarah Michelle Johnson",
        personId: "PER-2025-456",
        membershipNo: "MEM-SMJ-002",
        idNo: "B9876543",
        personType: "Employee",
        companyName: "Global Tech Solutions",
        companyCode: "GTS01",
        policyNo: "POL-GTS-002",
        status: "Active",
        dateOfBirth: new Date("1990-03-15").toISOString(), // 15/03/1990
        gender: "Female",
        nationality: "United States",
        idType: "Passport No.",
        issuedCountry: "United States",
        issueDate: new Date("2019-06-10").toISOString(),
        expiryDate: new Date("2029-06-10").toISOString(),
      },
    ]

    // Add the additional dummy person
    additionalDummyPerson.forEach((personData) => {
      addPerson(personData)
    })

    // Sample bulk data for PMCare Group with real Malaysian names
    const pmcarePersons: Omit<
      Person,
      "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy" | "groupId" | "groupName" | "uploadBatchId"
    >[] = [
      {
        name: "Siti Nurhaliza binti Hassan",
        personId: "PMC002",
        membershipNo: "CM-PMC-002-I",
        idNo: "850102-14-1001",
        personType: "Employee",
        companyName: "PMCare Sdn. Bhd",
        companyCode: "PMC01",
        policyNo: "XY123",
        status: "Active",
      },
      {
        name: "Lim Wei Ming",
        personId: "PMC003",
        membershipNo: "CM-PMC-003-I",
        idNo: "850103-14-1002",
        personType: "Employee",
        companyName: "PMCare Sdn. Bhd",
        companyCode: "PMC01",
        policyNo: "XY123",
        status: "Active",
      },
      {
        name: "Rajesh Kumar a/l Subramaniam",
        personId: "PMC004",
        membershipNo: "CM-PMC-004-I",
        idNo: "850104-14-1003",
        personType: "Dependent",
        companyName: "PMCare Sdn. Bhd",
        companyCode: "PMC01",
        policyNo: "XY123",
        status: "Active",
        employeeName: "Siti Nurhaliza binti Hassan",
        employeeIdNo: "850102-14-1001",
      },
      {
        name: "Nurul Aina binti Mohd Razak",
        personId: "PMC005",
        membershipNo: "CM-PMC-005-I",
        idNo: "850105-14-1004",
        personType: "Employee",
        companyName: "PMCare Sdn. Bhd",
        companyCode: "PMC01",
        policyNo: "XY123",
        status: "Active",
      },
      {
        name: "Tan Chee Keong",
        personId: "PMC006",
        membershipNo: "CM-PMC-006-I",
        idNo: "850106-14-1005",
        personType: "Employee",
        companyName: "PMCare Sdn. Bhd",
        companyCode: "PMC01",
        policyNo: "XY123",
        status: "Active",
      },
      {
        name: "Fatimah binti Omar",
        personId: "PMC007",
        membershipNo: "CM-PMC-007-I",
        idNo: "850107-14-1006",
        personType: "Dependent",
        companyName: "PMCare Sdn. Bhd",
        companyCode: "PMC01",
        policyNo: "XY123",
        status: "Active",
        employeeName: "Tan Chee Keong",
        employeeIdNo: "850106-14-1005",
      },
      // Add more sample persons to reach 25 total
      ...Array.from({ length: 18 }, (_, i) => ({
        name: `PMCare Employee ${i + 8}`,
        personId: `PMC${(i + 8).toString().padStart(3, "0")}`,
        membershipNo: `CM-PMC-${(i + 8).toString().padStart(3, "0")}-I`,
        idNo: `${(850108 + i).toString()}-14-${(1007 + i).toString()}`,
        personType: i % 3 === 0 ? "Dependent" : "Employee",
        companyName: "PMCare Sdn. Bhd",
        companyCode: "PMC01",
        policyNo: "XY123",
        status: i % 10 === 0 ? "Inactive" : "Active",
      })),
    ]

    addBulkPersons(
      {
        groupName: "PMCare Group",
        dateUpload: "2024-01-15",
        uploadStatus: "Complete",
        uploadedBy: "System Admin",
      },
      pmcarePersons,
    )

    // Sample bulk data for Global Holdings Group
    const globalPersons: Omit<
      Person,
      "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy" | "groupId" | "groupName" | "uploadBatchId"
    >[] = Array.from({ length: 42 }, (_, i) => ({
      name: `Global Employee ${i + 1}`,
      personId: `GCH${(i + 1).toString().padStart(4, "0")}`,
      membershipNo: `MEM-GCH-${(i + 1).toString().padStart(3, "0")}`,
      idNo: `${(900101 + i).toString()}-08-${(2000 + i).toString()}`,
      personType: i % 4 === 0 ? "Dependent" : "Employee",
      companyName: "Global Corp Holdings",
      companyCode: "GCH01",
      policyNo: "POL-2025-001",
      status: i % 15 === 0 ? "Suspended" : "Active",
    }))

    addBulkPersons(
      {
        groupName: "Global Holdings Group",
        dateUpload: "2024-01-20",
        uploadStatus: "Complete",
        uploadedBy: "HR Manager",
      },
      globalPersons,
    )

    // Add more sample groups...
    const easternPersons: Omit<
      Person,
      "id" | "dateCreated" | "dateModified" | "createdBy" | "modifiedBy" | "groupId" | "groupName" | "uploadBatchId"
    >[] = Array.from({ length: 18 }, (_, i) => ({
      name: `Eastern Employee ${i + 1}`,
      personId: `GCE${(i + 1).toString().padStart(4, "0")}`,
      membershipNo: `MEM-GCE-${(i + 1).toString().padStart(3, "0")}`,
      idNo: `${(850101 + i).toString()}-10-${(3000 + i).toString()}`,
      personType: i % 5 === 0 ? "Dependent" : "Employee",
      companyName: "GC Eastern Division",
      companyCode: "GCE01",
      policyNo: "POL-2025-002",
      status: "Active",
    }))

    addBulkPersons(
      {
        groupName: "Eastern Division Group",
        dateUpload: "2024-01-18",
        uploadStatus: "Pending Review",
        uploadedBy: "Division Manager",
      },
      easternPersons,
    )
  }
}
