import { Home } from "lucide-react"

import { Breadcrumbs } from "@/components/ui/breadcrumbs"

const breadcrumbItems = [
  { label: <Home className="h-4 w-4" />, href: "/" },
  { label: "Company", href: "/company" },
  { label: "New Company", href: "/company/add" },
  { label: "Contact Details" },
]

const Page = () => {
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div>Contact Details Page</div>
    </div>
  )
}

export default Page
