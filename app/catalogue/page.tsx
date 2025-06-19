"use client"

import { useEffect } from "react"
import { initializeSampleCatalogueData } from "@/lib/catalogue/sample-data-initializer"

export default function CataloguePage() {
  useEffect(() => {
    // Initialize sample data when catalogue page loads
    initializeSampleCatalogueData()
  }, [])

  return (
    <div>
      <h1>Catalogue Page</h1>
      <p>This is the catalogue page.</p>
    </div>
  )
}
