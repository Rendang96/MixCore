// lib/payor/payor-storage.ts

export interface PayorContact {
  id: string
  name: string
  category: string
  designation: string
  email: string
  mobileNo: string
  officeNo: string
  extNo: string
  status: string
  remarks: string
}

export interface Payor {
  id: string
  name: string
  code: string
  address: string
  city: string
  postcode: string
  state: string
  country: string
  remarks: string
  status: string
  contacts: PayorContact[]
  createdAt?: string
  updatedAt?: string
}

const PAYOR_STORAGE_KEY = "tpa_payors"
const PAYOR_BACKUP_PREFIX = "tpa_payors_backup"
const PAYOR_AUTOSAVE_PREFIX = "tpa_payor_autosave"

export class PayorStorage {
  // Get all payors from localStorage
  static getAllPayors(): Payor[] {
    try {
      const data = localStorage.getItem(PAYOR_STORAGE_KEY)
      if (!data) return []

      const payors = JSON.parse(data)
      return Array.isArray(payors) ? payors : []
    } catch (error) {
      console.error("Error loading payors from storage:", error)
      return []
    }
  }

  // Save all payors to localStorage
  static saveAllPayors(payors: Payor[]): boolean {
    try {
      const timestamp = new Date().toISOString()
      const payorsWithTimestamp = payors.map((payor) => ({
        ...payor,
        updatedAt: timestamp,
      }))

      localStorage.setItem(PAYOR_STORAGE_KEY, JSON.stringify(payorsWithTimestamp))

      // Create backup
      this.createBackup(payorsWithTimestamp)

      return true
    } catch (error) {
      console.error("Error saving payors to storage:", error)
      return false
    }
  }

  // Get a specific payor by ID
  static getPayorById(id: string): Payor | null {
    const payors = this.getAllPayors()
    return payors.find((payor) => payor.id === id) || null
  }

  // Add a new payor
  static addPayor(payor: Payor): boolean {
    try {
      const payors = this.getAllPayors()
      const newPayor = {
        ...payor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      payors.push(newPayor)
      return this.saveAllPayors(payors)
    } catch (error) {
      console.error("Error adding payor:", error)
      return false
    }
  }

  // Update an existing payor
  static updatePayor(updatedPayor: Payor): boolean {
    try {
      const payors = this.getAllPayors()
      const index = payors.findIndex((payor) => payor.id === updatedPayor.id)

      if (index === -1) return false

      payors[index] = {
        ...updatedPayor,
        updatedAt: new Date().toISOString(),
      }

      return this.saveAllPayors(payors)
    } catch (error) {
      console.error("Error updating payor:", error)
      return false
    }
  }

  // Delete a payor
  static deletePayor(id: string): boolean {
    try {
      const payors = this.getAllPayors()
      const filteredPayors = payors.filter((payor) => payor.id !== id)

      if (filteredPayors.length === payors.length) return false

      return this.saveAllPayors(filteredPayors)
    } catch (error) {
      console.error("Error deleting payor:", error)
      return false
    }
  }

  // Search payors
  static searchPayors(searchTerm: string, searchCode?: string): Payor[] {
    const payors = this.getAllPayors()

    return payors.filter((payor) => {
      const nameMatch = payor.name.toLowerCase().includes(searchTerm.toLowerCase())
      const codeMatch = searchCode ? payor.code.toLowerCase().includes(searchCode.toLowerCase()) : true
      return nameMatch && codeMatch
    })
  }

  // Contact management methods
  static addContactToPayor(payorId: string, contact: PayorContact): boolean {
    const payor = this.getPayorById(payorId)
    if (!payor) return false

    payor.contacts.push(contact)
    return this.updatePayor(payor)
  }

  static updateContactInPayor(payorId: string, updatedContact: PayorContact): boolean {
    const payor = this.getPayorById(payorId)
    if (!payor) return false

    const contactIndex = payor.contacts.findIndex((contact) => contact.id === updatedContact.id)
    if (contactIndex === -1) return false

    payor.contacts[contactIndex] = updatedContact
    return this.updatePayor(payor)
  }

  static deleteContactFromPayor(payorId: string, contactId: string): boolean {
    const payor = this.getPayorById(payorId)
    if (!payor) return false

    payor.contacts = payor.contacts.filter((contact) => contact.id !== contactId)
    return this.updatePayor(payor)
  }

  // Auto-save functionality
  static autoSavePayor(payor: Payor): boolean {
    try {
      const autoSaveKey = `${PAYOR_AUTOSAVE_PREFIX}_${payor.id}`
      const autoSaveData = {
        ...payor,
        timestamp: Date.now(),
        isAutoSave: true,
      }

      localStorage.setItem(autoSaveKey, JSON.stringify(autoSaveData))
      return true
    } catch (error) {
      console.error("Error auto-saving payor:", error)
      return false
    }
  }

  // Get auto-saved payor
  static getAutoSavedPayor(payorId: string): Payor | null {
    try {
      const autoSaveKey = `${PAYOR_AUTOSAVE_PREFIX}_${payorId}`
      const data = localStorage.getItem(autoSaveKey)

      if (!data) return null

      return JSON.parse(data)
    } catch (error) {
      console.error("Error loading auto-saved payor:", error)
      return null
    }
  }

  // Clear auto-saved payor
  static clearAutoSavedPayor(payorId: string): void {
    try {
      const autoSaveKey = `${PAYOR_AUTOSAVE_PREFIX}_${payorId}`
      localStorage.removeItem(autoSaveKey)
    } catch (error) {
      console.error("Error clearing auto-saved payor:", error)
    }
  }

  // Get all auto-saved payors
  static getAllAutoSavedPayors(): Array<{ key: string; data: Payor; timestamp: number }> {
    try {
      const allKeys = Object.keys(localStorage)
      const autoSaveKeys = allKeys.filter((key) => key.startsWith(PAYOR_AUTOSAVE_PREFIX))

      return autoSaveKeys
        .map((key) => {
          const data = JSON.parse(localStorage.getItem(key) || "{}")
          return {
            key,
            data,
            timestamp: data.timestamp || 0,
          }
        })
        .sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error("Error loading auto-saved payors:", error)
      return []
    }
  }

  // Backup functionality
  private static createBackup(payors: Payor[]): void {
    try {
      const backupKey = `${PAYOR_BACKUP_PREFIX}_${Date.now()}`
      localStorage.setItem(backupKey, JSON.stringify(payors))

      // Keep only the last 5 backups
      this.cleanupOldBackups()
    } catch (error) {
      console.error("Error creating backup:", error)
    }
  }

  private static cleanupOldBackups(): void {
    try {
      const allKeys = Object.keys(localStorage)
      const backupKeys = allKeys.filter((key) => key.startsWith(PAYOR_BACKUP_PREFIX)).sort()

      if (backupKeys.length > 5) {
        const keysToRemove = backupKeys.slice(0, backupKeys.length - 5)
        keysToRemove.forEach((key) => localStorage.removeItem(key))
      }
    } catch (error) {
      console.error("Error cleaning up old backups:", error)
    }
  }

  // Export data
  static exportPayors(): string {
    const payors = this.getAllPayors()
    return JSON.stringify(payors, null, 2)
  }

  // Import data
  static importPayors(jsonData: string): boolean {
    try {
      const payors = JSON.parse(jsonData)
      if (!Array.isArray(payors)) return false

      return this.saveAllPayors(payors)
    } catch (error) {
      console.error("Error importing payors:", error)
      return false
    }
  }

  // Clear all data
  static clearAllData(): boolean {
    try {
      localStorage.removeItem(PAYOR_STORAGE_KEY)

      // Clear all backups and auto-saves
      const allKeys = Object.keys(localStorage)
      const payorKeys = allKeys.filter(
        (key) => key.startsWith(PAYOR_BACKUP_PREFIX) || key.startsWith(PAYOR_AUTOSAVE_PREFIX),
      )

      payorKeys.forEach((key) => localStorage.removeItem(key))

      return true
    } catch (error) {
      console.error("Error clearing payor data:", error)
      return false
    }
  }

  // Get storage statistics
  static getStorageStats(): {
    totalPayors: number
    totalContacts: number
    storageSize: number
    lastUpdated: string | null
  } {
    const payors = this.getAllPayors()
    const totalContacts = payors.reduce((sum, payor) => sum + payor.contacts.length, 0)

    let storageSize = 0
    let lastUpdated: string | null = null

    try {
      const data = localStorage.getItem(PAYOR_STORAGE_KEY)
      if (data) {
        storageSize = new Blob([data]).size
        const parsedPayors = JSON.parse(data)
        if (parsedPayors.length > 0) {
          lastUpdated = parsedPayors.reduce((latest: string, payor: Payor) => {
            const payorUpdated = payor.updatedAt || payor.createdAt || ""
            return payorUpdated > latest ? payorUpdated : latest
          }, "")
        }
      }
    } catch (error) {
      console.error("Error calculating storage stats:", error)
    }

    return {
      totalPayors: payors.length,
      totalContacts,
      storageSize,
      lastUpdated,
    }
  }

  // Initialize dummy data
  static initializeDummyData(): boolean {
    try {
      const existingPayors = this.getAllPayors()
      if (existingPayors.length > 0) {
        return true // Data already exists
      }

      const dummyPayors: Payor[] = [
        {
          id: "payor-001",
          name: "Great Eastern Life Assurance",
          code: "GRE-001",
          address: "Menara Great Eastern, 303 Jalan Ampang",
          city: "kuala-lumpur",
          postcode: "50450",
          state: "kuala-lumpur",
          country: "malaysia",
          remarks: "Leading life insurance provider in Malaysia",
          status: "Active",
          contacts: [
            {
              id: "contact-001",
              name: "Ahmad Rahman",
              category: "Primary",
              designation: "Claims Manager",
              email: "ahmad.rahman@greateaster.com.my",
              mobileNo: "012-3456789",
              officeNo: "03-42591234",
              extNo: "1001",
              status: "Active",
              remarks: "Main contact for claims processing",
            },
            {
              id: "contact-002",
              name: "Siti Nurhaliza",
              category: "Secondary",
              designation: "Customer Service Manager",
              email: "siti.nurhaliza@greateaster.com.my",
              mobileNo: "012-9876543",
              officeNo: "03-42591234",
              extNo: "1002",
              status: "Active",
              remarks: "Customer service inquiries",
            },
          ],
          createdAt: "2024-01-15T08:00:00.000Z",
          updatedAt: "2024-01-15T08:00:00.000Z",
        },
        {
          id: "payor-002",
          name: "Allianz Malaysia Berhad",
          code: "ALL-002",
          address: "Level 29, Menara Allianz Sentral, 203 Jalan Tun Sambanthan",
          city: "kuala-lumpur",
          postcode: "50470",
          state: "kuala-lumpur",
          country: "malaysia",
          remarks: "International insurance and asset management company",
          status: "Active",
          contacts: [
            {
              id: "contact-003",
              name: "Lim Wei Ming",
              category: "Primary",
              designation: "Medical Claims Director",
              email: "wei.ming.lim@allianz.com.my",
              mobileNo: "012-2345678",
              officeNo: "03-20562200",
              extNo: "2001",
              status: "Active",
              remarks: "Medical claims authorization",
            },
          ],
          createdAt: "2024-01-16T09:30:00.000Z",
          updatedAt: "2024-01-16T09:30:00.000Z",
        },
        {
          id: "payor-003",
          name: "AIA Malaysia",
          code: "AIA-003",
          address: "Level 18, Menara AIA Sentral, 30 Jalan Sultan Ismail",
          city: "kuala-lumpur",
          postcode: "50250",
          state: "kuala-lumpur",
          country: "malaysia",
          remarks: "Premier life insurance company in Asia",
          status: "Active",
          contacts: [
            {
              id: "contact-004",
              name: "Rajesh Kumar",
              category: "Primary",
              designation: "Operations Manager",
              email: "rajesh.kumar@aia.com.my",
              mobileNo: "012-7654321",
              officeNo: "03-21562888",
              extNo: "3001",
              status: "Active",
              remarks: "Operations and processing",
            },
            {
              id: "contact-005",
              name: "Michelle Tan",
              category: "Secondary",
              designation: "Account Manager",
              email: "michelle.tan@aia.com.my",
              mobileNo: "012-5432109",
              officeNo: "03-21562888",
              extNo: "3002",
              status: "Active",
              remarks: "Account management and relations",
            },
          ],
          createdAt: "2024-01-17T10:15:00.000Z",
          updatedAt: "2024-01-17T10:15:00.000Z",
        },
        {
          id: "payor-004",
          name: "Prudential Assurance Malaysia",
          code: "PRU-004",
          address: "Level 7, Menara Prudential, No. 10 Jalan Sultan Ismail",
          city: "kuala-lumpur",
          postcode: "50250",
          state: "kuala-lumpur",
          country: "malaysia",
          remarks: "Leading life insurance and takaful operator",
          status: "Active",
          contacts: [
            {
              id: "contact-006",
              name: "Fatimah Abdullah",
              category: "Primary",
              designation: "Claims Processing Head",
              email: "fatimah.abdullah@prudential.com.my",
              mobileNo: "012-8765432",
              officeNo: "03-21791777",
              extNo: "4001",
              status: "Active",
              remarks: "Claims processing and approval",
            },
          ],
          createdAt: "2024-01-18T11:45:00.000Z",
          updatedAt: "2024-01-18T11:45:00.000Z",
        },
        {
          id: "payor-005",
          name: "Zurich General Insurance Malaysia",
          code: "ZUR-005",
          address: "Level 23A, Menara Milenium, Jalan Damanlela",
          city: "kuala-lumpur",
          postcode: "50490",
          state: "kuala-lumpur",
          country: "malaysia",
          remarks: "General insurance and risk management solutions",
          status: "Inactive",
          contacts: [
            {
              id: "contact-007",
              name: "David Wong",
              category: "Primary",
              designation: "Branch Manager",
              email: "david.wong@zurich.com.my",
              mobileNo: "012-3456780",
              officeNo: "03-20534888",
              extNo: "5001",
              status: "Inactive",
              remarks: "Branch operations - currently inactive",
            },
          ],
          createdAt: "2024-01-19T14:20:00.000Z",
          updatedAt: "2024-01-19T14:20:00.000Z",
        },
      ]

      return this.saveAllPayors(dummyPayors)
    } catch (error) {
      console.error("Error initializing dummy payor data:", error)
      return false
    }
  }

  // Relationship validation methods
  static canDeletePayor(payorId: string): { canDelete: boolean; reason?: string } {
    try {
      // Check if payor has associated products
      const products = this.getProductsByPayorId(payorId)
      if (products.length > 0) {
        return {
          canDelete: false,
          reason: `Cannot delete payor. It has ${products.length} associated product(s).`,
        }
      }
      return { canDelete: true }
    } catch (error) {
      console.error("Error checking payor deletion:", error)
      return { canDelete: false, reason: "Error checking dependencies" }
    }
  }

  // Get products associated with a payor
  static getProductsByPayorId(payorId: string): any[] {
    try {
      const productsData = localStorage.getItem("tpa_products")
      if (!productsData) return []

      const products = JSON.parse(productsData)
      const payor = this.getPayorById(payorId)

      if (!payor) return []

      return products.filter((product: any) => product.payorCode === payor.code)
    } catch (error) {
      console.error("Error getting products by payor:", error)
      return []
    }
  }

  // Get policies associated with a payor (through products)
  static getPoliciesByPayorId(payorId: string): any[] {
    try {
      const products = this.getProductsByPayorId(payorId)
      const productCodes = products.map((p) => p.code)

      const policiesData = localStorage.getItem("policies")
      if (!policiesData) return []

      const policies = JSON.parse(policiesData)
      return policies.filter((policy: any) => productCodes.includes(policy.productCode))
    } catch (error) {
      console.error("Error getting policies by payor:", error)
      return []
    }
  }

  // Get relationship statistics for a payor
  static getPayorRelationshipStats(payorId: string): {
    productCount: number
    policyCount: number
    products: any[]
    policies: any[]
  } {
    const products = this.getProductsByPayorId(payorId)
    const policies = this.getPoliciesByPayorId(payorId)

    return {
      productCount: products.length,
      policyCount: policies.length,
      products,
      policies,
    }
  }
}
