"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { SalesManagerDashboard } from "@/components/agent-broker/sales-manager-dashboard"

export default function SalesManagerPage() {
  return (
    <TPADashboard initialMenu="agent">
      <div className="space-y-6">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Agent Broker", href: "/agent-broker" },
            { label: "Sales Manager" },
          ]}
        />
        <SalesManagerDashboard />
      </div>
    </TPADashboard>
  )
}
