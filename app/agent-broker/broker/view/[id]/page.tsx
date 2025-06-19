import { TPADashboard } from "@/components/tpa-dashboard"
import { ViewBroker } from "@/components/agent-broker/view-broker"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

export default function ViewBrokerPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent & Broker", href: "/agent-broker" },
    { label: "Broker Management", href: "/agent-broker/broker" },
    { label: "View Broker", href: `/agent-broker/broker/view/${params.id}` },
  ]

  return (
    <TPADashboard>
      <PageBreadcrumbs items={breadcrumbs} />
      <ViewBroker brokerId={params.id} />
    </TPADashboard>
  )
}
