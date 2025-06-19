"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { BrokerDashboard } from "@/components/agent-broker/broker-dashboard"

export default function BrokerPage() {
  return (
    <TPADashboard initialMenu="agent">
      <div className="space-y-6">
        <PageBreadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Agent Broker", href: "/agent-broker" }, { label: "Broker" }]}
        />
        <BrokerDashboard />
      </div>
    </TPADashboard>
  )
}
