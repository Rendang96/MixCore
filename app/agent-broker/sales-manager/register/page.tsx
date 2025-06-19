"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { SalesManagerRegistrationForm } from "@/components/agent-broker/sales-manager-registration-form"

export default function RegisterSalesManagerPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent & Broker", href: "/agent-broker" },
    { label: "Sales & Marketing", href: "/agent-broker/sales-manager" },
    { label: "Register S&M Manager", href: "/agent-broker/sales-manager/register" },
  ]

  return (
    <TPADashboard initialMenu="agent">
      <div className="space-y-6">
        <PageBreadcrumbs items={breadcrumbs} />
        <SalesManagerRegistrationForm />
      </div>
    </TPADashboard>
  )
}
