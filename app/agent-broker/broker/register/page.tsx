"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { BrokerRegistrationForm } from "@/components/agent-broker/broker-registration-form"

export default function RegisterBrokerPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent & Broker", href: "/agent-broker" },
    { label: "Broker Management", href: "/agent-broker/broker" },
    { label: "Register Broker", href: "/agent-broker/broker/register" },
  ]

  return (
    <TPADashboard initialMenu="agent">
      <div className="space-y-6">
        <PageBreadcrumbs items={breadcrumbs} />
        <BrokerRegistrationForm />
      </div>
    </TPADashboard>
  )
}
