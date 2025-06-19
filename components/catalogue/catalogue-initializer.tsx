"use client"

import { useEffect } from "react"
import { initializeIfEmpty } from "@/lib/catalogue/shared-catalogue-item-storage"

export function CatalogueInitializer() {
  useEffect(() => {
    // Initialize the shared catalogue item storage if it's empty
    initializeIfEmpty()
  }, [])

  return null
}
