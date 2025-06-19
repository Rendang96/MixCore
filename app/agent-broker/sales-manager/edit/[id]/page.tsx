import { TPADashboard } from "@/components/tpa-dashboard"
import { EditSalesManager } from "@/components/agent-broker/edit-sales-manager"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

export default function EditSalesManagerPage({ params }: { params: { id: string } }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent & Broker", href: "/agent-broker" },
    { label: "Sales & Marketing", href: "/agent-broker/sales-manager" },
    { label: "Edit S&M", href: `/agent-broker/sales-manager/edit/${params.id}` },
  ]

  return (
    <TPADashboard>
      <PageBreadcrumbs items={breadcrumbs} />
      <EditSalesManager managerId={params.id} />
    </TPADashboard>
  )
}
