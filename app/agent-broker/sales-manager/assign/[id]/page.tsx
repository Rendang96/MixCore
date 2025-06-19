import { TPADashboard } from "@/components/tpa-dashboard"
import { AgentAssignment } from "@/components/agent-broker/agent-assignment"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

export default function AssignAgentsPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent & Broker", href: "/agent-broker" },
    { label: "Sales & Marketing", href: "/agent-broker/sales-manager" },
    { label: "Assign Agents", href: `/agent-broker/sales-manager/assign/${params.id}` },
  ]

  return (
    <TPADashboard>
      <PageBreadcrumbs items={breadcrumbs} />
      <AgentAssignment managerId={params.id} />
    </TPADashboard>
  )
}
