import { TPADashboard } from "@/components/tpa-dashboard"
import { EditBroker } from "@/components/agent-broker/edit-broker"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

export default function EditBrokerPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent & Broker", href: "/agent-broker" },
    { label: "Broker Management", href: "/agent-broker/broker" },
    { label: "Edit Broker", href: `/agent-broker/broker/edit/${params.id}` },
  ]

  return (
    <TPADashboard>
      <PageBreadcrumbs items={breadcrumbs} />
      <EditBroker brokerId={params.id} />
    </TPADashboard>
  )
}
