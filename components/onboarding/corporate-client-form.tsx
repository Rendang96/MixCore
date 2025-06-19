"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useRouter, usePathname } from "next/navigation"
import { CorporateClientFormProvider } from "@/contexts/corporate-client-form-context"
import { CompanyStep } from "./steps/company-step"
import { PolicyStep } from "./steps/policy-step"
import { PlanStep } from "./steps/plan-step"
import { MemberStep } from "./steps/member-step"
import { SummaryStep } from "./steps/summary-step"

function CorporateClientFormContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const pathname = usePathname()

  const steps = [
    { id: 1, name: "Company", path: "company" },
    { id: 2, name: "Policy", path: "policy" },
    { id: 3, name: "Plan", path: "plan" },
    { id: 4, name: "Member", path: "member" },
    { id: 5, name: "Summary", path: "summary" },
  ]

  // Initialize the current step based on the URL path
  useEffect(() => {
    const path = pathname.split("/").pop()
    const stepIndex = steps.findIndex((step) => step.path === path)
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex + 1)
    }
  }, [pathname])

  const handleBackToListing = () => {
    router.push("/onboarding/corporate-client")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CompanyStep onNext={() => handleNext()} onCancel={handleBackToListing} />
      case 2:
        return (
          <PolicyStep onNext={() => handleNext()} onPrevious={() => handlePrevious()} onCancel={handleBackToListing} />
        )
      case 3:
        return (
          <PlanStep onNext={() => handleNext()} onPrevious={() => handlePrevious()} onCancel={handleBackToListing} />
        )
      case 4:
        return (
          <MemberStep onNext={() => handleNext()} onPrevious={() => handlePrevious()} onCancel={handleBackToListing} />
        )
      case 5:
        return <SummaryStep onPrevious={() => handlePrevious()} />
      default:
        return <div>Step {currentStep} - Coming soon...</div>
    }
  }

  const handleNext = () => {
    const nextStep = currentStep + 1
    if (nextStep <= steps.length) {
      setCurrentStep(nextStep)
      const nextPath = steps[nextStep - 1].path
      router.push(`/onboarding/corporate-client/add/${nextPath}`)
    }
  }

  const handlePrevious = () => {
    const prevStep = currentStep - 1
    if (prevStep >= 1) {
      setCurrentStep(prevStep)
      const prevPath = steps[prevStep - 1].path
      router.push(`/onboarding/corporate-client/add/${prevPath}`)
    }
  }

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId)
    const stepPath = steps[stepId - 1].path
    router.push(`/onboarding/corporate-client/add/${stepPath}`)
  }

  return (
    <div className="container mx-auto py-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <button onClick={handleBackToListing} className="hover:text-gray-700 transition-colors">
            Onboarding
          </button>
          <span>{">"}</span>
          <button onClick={handleBackToListing} className="hover:text-gray-700 transition-colors">
            Corporate Client
          </button>
          <span>{">"}</span>
          <span className="text-gray-900">New Corporate Client</span>
        </nav>
      </div>

      <h1 className="text-xl font-bold mb-6">New Corporate Client</h1>

      {/* Horizontal Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-medium cursor-pointer ${
                  currentStep === step.id ? "bg-blue-600" : currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                {step.id}
              </div>
              <span className="font-medium text-sm mt-2 text-center">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <Card className="p-6 border">{renderStepContent()}</Card>
    </div>
  )
}

export function CorporateClientForm() {
  return (
    <CorporateClientFormProvider>
      <CorporateClientFormContent />
    </CorporateClientFormProvider>
  )
}
