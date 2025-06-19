"use client"

import { NewCompanyForm } from "@/components/company/new-company-form"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Home } from "lucide-react"

export default function AddCompanyPayorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("payor")

  const handleBack = () => {
    router.push("/company")
  }

  const handleStepChange = (step: string) => {
    setCurrentStep(step)
  }

  const breadcrumbItems = [
    { label: <Home className="h-4 w-4" />, href: "/" },
    { label: "Company", href: "/company" },
    { label: "New Company" },
    { label: "Payor" },
  ]

  return (
    <div className="w-full px-4 py-4">
      <PageBreadcrumbs items={breadcrumbItems} />
      <div className="mt-4 w-full">
        <NewCompanyForm onBack={handleBack} onStepChange={handleStepChange} initialStep="payor" />
      </div>
    </div>
  )
}
