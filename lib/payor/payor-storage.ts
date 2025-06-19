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
}
