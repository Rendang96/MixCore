"use client"

import { useEffect } from "react"
import { initializeDummyCompanyData } from "@/lib/company/dummy-data"

export function CompanyDataInitializer() {
  useEffect(() => {
    // Initialize dummy data when component mounts
    initializeDummyCompanyData()
  }, [])

  // This component doesn't render anything
  return null
}
