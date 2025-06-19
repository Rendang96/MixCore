"use client"

import { useRouter, useParams } from "next/navigation"
import { EditCompany } from "@/components/company/edit-company"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getCompanyById } from "@/lib/company/company-storage"
import { useEffect, useState } from "react"

export default function EditCompanyPage() {
  const router = useRouter()
  const params = useParams()
  const [company, setCompany] = useState<any>(null)

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

  const breadcrumbItems = [
    { label: "Home", href: "/", onClick: () => {} },
    { label: "Company", href: "/company", onClick: () => {} },
    { label: company ? company.name : "Edit Company" },
  ]

  const handleCancel = () => {
    router.push(`/company/view/${params.id}`)
  }

  if (!company) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />
      <EditCompany company={company} onCancel={handleCancel} />
    </div>
  )
}
