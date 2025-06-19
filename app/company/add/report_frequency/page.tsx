import { Home } from "lucide-react"

import { Breadcrumbs } from "@/components/ui/breadcrumbs"

const breadcrumbItems = [
  { label: <Home className="h-4 w-4" />, href: "/" },
  { label: "Company", href: "/company" },
  { label: "New Company", href: "/company/add" },
  { label: "Report Frequency" },
]

const ReportFrequencyPage = () => {
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div>Report Frequency Page</div>
    </div>
  )
}

export default ReportFrequencyPage
