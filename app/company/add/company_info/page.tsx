"use client"
import { useState } from "react"
import { NewCompanyForm } from "@/components/company/new-company-form"
import { useRouter } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Home } from "lucide-react"

export default function AddCompanyInfoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("company-info")

  // Dynamic breadcrumbs based on current step
  const breadcrumbItems = [
    { label: <Home className="h-4 w-4" />, href: "/" },
    { label: "Company", href: "/company" },
    { label: "New Company", href: "/company/add" },
    { label: "Company Info" },
  ]

  const handleBack = () => {
    router.push("/company")
  }

  const handleSave = (companyData: any) => {
    // Navigate back to the company page after saving
    router.push("/company")
  }

  const handleStepChange = (step: string) => {
    setCurrentStep(step)
  }

  return (
    <div className="w-full px-4 py-4">
      <PageBreadcrumbs items={breadcrumbItems} />
      <div className="mt-4 w-full">
        <NewCompanyForm
          onBack={handleBack}
          onSave={handleSave}
          onStepChange={handleStepChange}
          initialStep="company-info"
        />
      </div>
    </div>
  )
}
