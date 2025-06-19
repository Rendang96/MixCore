"use client"

import { useRouter, useParams } from "next/navigation"
import { ViewCompany } from "@/components/company/view-company"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getCompanyById } from "@/lib/company/company-storage"
import { useEffect, useState } from "react"

export default function ViewCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const [company, setCompany] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState("company-info")

  useEffect(() => {
    if (params.id) {
      const companyId = Number.parseInt(params.id as string)
      const foundCompany = getCompanyById(companyId)

      if (foundCompany) {
        setCompany(foundCompany)
      } else {
        // Company not found, redirect to company listing
        router.push("/company")
      }
    }
  }, [params.id, router])

  // Update breadcrumb items based on current step
  const getBreadcrumbItems = () => {
    const baseItems = [
      { label: "Home", href: "/", onClick: () => {} },
      { label: "Company", href: "/company", onClick: () => {} },
    ]

    if (!company) {
      return [...baseItems, { label: "View Company" }]
    }

    const stepLabel = getStepLabel(currentStep)
    return [
      ...baseItems,
      { label: company.name, href: `/company/view/${company.id}`, onClick: () => setCurrentStep("company-info") },
      { label: stepLabel },
    ]
  }

  const getStepLabel = (step: string) => {
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

  const handleBack = () => {
    router.push("/company")
  }

  const handleUpdate = () => {
    if (company) {
      router.push(`/company/edit/${company.id}`)
    }
  }

  const handleStepChange = (step: string) => {
    setCurrentStep(step)
  }

  if (!company) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={getBreadcrumbItems()} />
      <ViewCompany
        company={company}
        onBack={handleBack}
        onUpdate={handleUpdate}
        initialStep={currentStep}
        onStepChange={handleStepChange}
      />
    </div>
  )
}
