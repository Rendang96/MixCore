"use client"

import { ProviderSearch } from "@/components/provider/provider-search"
import { initializeDummyProviders } from "@/lib/provider/dummy-data"
import { useEffect } from "react"

export default function ProviderPage() {
  // Initialize dummy providers when the page loads
  useEffect(() => {
    initializeDummyProviders()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Provider Management</h1>
        <p className="text-slate-600 mt-2">Search and manage medical provider information</p>
      </div>

      <ProviderSearch />
    </div>
  )
}
