import { Home } from "lucide-react"
import Breadcrumb from "@/components/ui/breadcrumb"

const breadcrumbItems = [
  { label: <Home className="h-4 w-4" />, href: "/" },
  { label: "Company", href: "/company" },
  { label: "New Company", href: "/company/add" },
  { label: "History" },
]

const CompanyAddHistoryPage = () => {
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div>Company Add History Page</div>
    </div>
  )
}

export default CompanyAddHistoryPage
