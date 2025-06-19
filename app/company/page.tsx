"use client"

import { CompanySearch } from "@/components/company/company-search"
import { initializeDummyCompanies } from "@/lib/company/dummy-data"
import { useEffect } from "react"

export default function CompanyPage() {
  // Initialize dummy companies when the page loads
  useEffect(() => {
    initializeDummyCompanies()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Company Management</h1>
        <p className="text-slate-600 mt-2">Search and manage company information</p>
      </div>

      <CompanySearch />
    </div>
  )
}
