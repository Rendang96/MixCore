import { Home } from "lucide-react"

import { Breadcrumb } from "@/components/ui/breadcrumb"

const breadcrumbItems = [
  { label: <Home className="h-4 w-4" />, href: "/" },
  { label: "Company", href: "/company" },
  { label: "New Company", href: "/company/add" },
  { label: "Operational Segmentation" },
]

const OperationalSegmentationPage = () => {
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <h1>Operational Segmentation</h1>
    </div>
  )
}

export default OperationalSegmentationPage
