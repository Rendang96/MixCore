"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { PlanStorage, type Plan } from "@/lib/plan/plan-storage"
import { initializeDummyPlans } from "@/lib/plan/dummy-data"

interface PlanContextType {
  plans: Plan[]
  addPlan: (plan: Plan) => void
  updatePlan: (id: string, updates: Partial<Plan>) => void
  deletePlan: (id: string) => void
  getActivePlans: () => Plan[]
}

const PlansContext = createContext<PlanContextType | undefined>(undefined)

export const usePlans = () => {
  const context = useContext(PlansContext)
  if (!context) {
    throw new Error("usePlans must be used within a PlansProvider")
  }
  return context
}

interface Plan {
  id: string
  name: string
  type: string
  status: string
  createdDate: string
  description?: string
  effectiveDate?: string
  expiryDate?: string
  serviceTypes?: string[]
  subServiceTypes?: { [serviceType: string]: string[] }
  providerAccess?: string
  selectedProviders?: any[]
  hasBillback?: boolean
  hasSpecialRules?: boolean
  limits?: any[]
  specialRules?: {
    coPayments?: any[]
    benefitCoordination?: any[]
    regulatoryCompliance?: {
      essentialHealthBenefits?: { enabled: boolean; categories: any[]; exemptions: any[] }
      preventiveCareExemptions?: { enabled: boolean; services: any[]; copaymentWaived: boolean }
      mentalHealthParity?: {
        enabled: boolean
        treatmentLimits: boolean
        financialRequirements: boolean
        quantitativeLimits: boolean
      }
    }
  }
  coPayments?: any[]
}

export function PlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>([])

  // Initialize dummy data and load plans on mount
  useEffect(() => {
    initializeDummyPlans()
    setPlans(PlanStorage.getAllPlans())
  }, [])

  const addPlan = (plan: Plan) => {
    PlanStorage.addPlan(plan)
    setPlans(PlanStorage.getAllPlans())
  }

  const updatePlan = (id: string, updates: Partial<Plan>) => {
    PlanStorage.updatePlan(id, updates)
    setPlans(PlanStorage.getAllPlans())
  }

  const deletePlan = (id: string) => {
    PlanStorage.deletePlan(id)
    setPlans(PlanStorage.getAllPlans())
  }

  const getActivePlans = () => {
    return PlanStorage.getActivePlans()
  }

  const value = {
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    getActivePlans,
  }

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>
}
