import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getCompanies } from "@/lib/company/company-storage"
import { format } from "date-fns"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CompanyHistoryPage() {
  // This function will run on the client side
  const getCompanyContractHistory = () => {
    if (typeof window === "undefined") return []

    const companies = getCompanies()
    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      contractStart: company.contractStart || "N/A",
      contractEnd: company.contractEnd || "N/A",
      status: company.status,
    }))
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString === "N/A") return dateString
    try {
      return format(new Date(dateString), "dd MMM yyyy")
    } catch (error) {
      return dateString
    }
  }

  const breadcrumbItems = [
    { label: "Home", href: "/", onClick: () => {} },
    { label: "Company", href: "/company", onClick: () => {} },
    { label: "Contract History" },
  ]

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Contract History</h1>
        <Link href="/company">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Companies
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contract Start</TableHead>
                <TableHead>Contract End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCompanyContractHistory().map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{formatDate(item.contractStart)}</TableCell>
                  <TableCell>{formatDate(item.contractEnd)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "active" || item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/company/view/${item.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {getCompanyContractHistory().length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No contract history available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
