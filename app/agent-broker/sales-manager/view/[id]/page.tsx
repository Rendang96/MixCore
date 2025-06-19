import { TPADashboard } from "@/components/tpa-dashboard"
import { ViewSalesManager } from "@/components/agent-broker/view-sales-manager"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

export default function ViewSalesManagerPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent & Broker", href: "/agent-broker" },
    { label: "Sales & Marketing", href: "/agent-broker/sales-manager" },
    { label: "View S&M", href: `/agent-broker/sales-manager/view/${params.id}` },
  ]

  return (
    <TPADashboard>
      <PageBreadcrumbs items={breadcrumbs} />
      <ViewSalesManager managerId={params.id} />
    </TPADashboard>
  )
}
