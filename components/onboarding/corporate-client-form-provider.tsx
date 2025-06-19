"use client"

import { createContext, type ReactNode } from "react"

const CorporateClientFormContext = createContext<any>(undefined)

export function CorporateClientFormProvider({ children }: { children: ReactNode }) {
  return null
}

export function useCorporateClientForm() {
  return {}
}
