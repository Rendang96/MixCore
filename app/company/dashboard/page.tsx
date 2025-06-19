import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { getCompanies } from "@/lib/company/company-storage"
import { Building, Users, FileText, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CompanyDashboardPage() {
  // This function will run on the client side
  const getCompanyStats = () => {
    if (typeof window === "undefined") return { total: 0, active: 0, inactive: 0 }

    const companies = getCompanies()
    const active = companies.filter((c) => c.status === "active" || c.status === "Active").length
    const inactive = companies.filter((c) => c.status !== "active" && c.status !== "Active").length

    return {
      total: companies.length,
      active,
      inactive,
    }
  }

  const breadcrumbItems = [
    { label: "Home", href: "/", onClick: () => {} },
    { label: "Company", href: "/company", onClick: () => {} },
    { label: "Dashboard" },
  ]

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
        <Link href="/company">
          <Button>Go to Company Search</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompanyStats().total}</div>
            <p className="text-xs text-muted-foreground">Companies registered in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompanyStats().active}</div>
            <p className="text-xs text-muted-foreground">Companies with active status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Companies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompanyStats().inactive}</div>
            <p className="text-xs text-muted-foreground">Companies with inactive status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">New company added: Global Tech Solutions</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Company updated: Eastern Holdings</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Company deleted: Old Corp Ltd</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link
                href="/company/add"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-3 text-sky-600" />
                  <span>Add New Company</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/company"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-sky-600" />
                  <span>Search Companies</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="#" className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-sky-600" />
                  <span>View Contract Calendar</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
