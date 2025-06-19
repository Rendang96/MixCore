// lib/integration/data-initializer.ts

import { initializeSampleData } from "@/lib/person/person-storage"
import { initializeOnboardingSampleData } from "@/lib/integration/person-onboarding-integration"

// Function to initialize all sample data across modules
export const initializeAllSampleData = () => {
  // Initialize person module sample data
  initializeSampleData()

  // Initialize onboarding integration sample data
  initializeOnboardingSampleData()
}

// Function to clear all data (for testing)
export const clearAllData = () => {
  if (typeof window === "undefined") {
    return
  }

  // Clear person data
  localStorage.removeItem("persons")
  localStorage.removeItem("person_groups")
  localStorage.removeItem("person_counter")
  localStorage.removeItem("group_counter")
  localStorage.removeItem("person_memberships")

  // Clear onboarding data
  localStorage.removeItem("onboarding_memberships")
  localStorage.removeItem("onboarding_employment")
}
