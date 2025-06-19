"use client"

import { NewCompanyForm } from "@/components/company/new-company-form"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Home } from "lucide-react"

export default function AddCompanyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("company-info")

  const handleBack = () => {
    router.push("/company")
  }

  const handleStepChange = (step: string) => {
    setCurrentStep(step)
  }

  // Map step names to human-readable labels
  const getStepLabel = (step: string): string => {
    switch (step) {
      case "company-info":
        return "Company Info"
      case "contact-details":
        return "Contact Details"
      case "operational":
        return "Operational Segmentation"
      case "job-grade":
        return "Job Grade"
      case "report-frequency":
        return "Report Frequency"
      case "medical-provider":
        return "Medical Provider"
      case "financial-arrangement":
        return "Financial Arrangement"
      case "payor":
        return "Payor"
      case "sob":
        return "SOB"
      case "history":
        return "History"
      default:
        return "Company Info"
    }
  }

  const breadcrumbItems = [
    { label: <Home className="h-4 w-4" />, href: "/" },
    { label: "Company", href: "/company" },
    { label: "Dashboard", href: "/company/dashboard" }, // Added Dashboard
    { label: "Add New Company" }, // Renamed from "New Company"
    { label: getStepLabel(currentStep) },
  ]

  return (
    <div className="w-full px-4 py-4">
      <PageBreadcrumbs items={breadcrumbItems} />
      <div className="mt-4 w-full">
        <NewCompanyForm onBack={handleBack} onStepChange={handleStepChange} />
      </div>
    </div>
  )
}
