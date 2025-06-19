import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCompanies } from "@/lib/company/company-storage"
import { Download, FileText, BarChart, PieChart } from "lucide-react"
import Link from "next/link"

export default function CompanyReportsPage() {
  // This function will run on the client side
  const getCompanyTypeDistribution = () => {
    if (typeof window === "undefined") return { mainHolding: 0, subsidiary: 0, independent: 0 }

    const companies = getCompanies()
    const mainHolding = companies.filter(
      (c) => c.companyType === "Main holding" || c.companyType === "main-holding",
    ).length

    const subsidiary = companies.filter((c) => c.companyType === "Subsidiary" || c.companyType === "subsidiary").length

    const independent = companies.filter(
      (c) => c.companyType === "Independent" || c.companyType === "independent",
    ).length

    return { mainHolding, subsidiary, independent }
  }

  const breadcrumbItems = [
    { label: "Home", href: "/", onClick: () => {} },
    { label: "Company", href: "/company", onClick: () => {} },
    { label: "Reports" },
  ]

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Reports</h1>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Reports
        </Button>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Main Holding Companies</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCompanyTypeDistribution().mainHolding}</div>
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        (getCompanyTypeDistribution().mainHolding /
                          (getCompanyTypeDistribution().mainHolding +
                            getCompanyTypeDistribution().subsidiary +
                            getCompanyTypeDistribution().independent)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Subsidiary Companies</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCompanyTypeDistribution().subsidiary}</div>
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        (getCompanyTypeDistribution().subsidiary /
                          (getCompanyTypeDistribution().mainHolding +
                            getCompanyTypeDistribution().subsidiary +
                            getCompanyTypeDistribution().independent)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Independent Companies</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCompanyTypeDistribution().independent}</div>
                <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${
                        (getCompanyTypeDistribution().independent /
                          (getCompanyTypeDistribution().mainHolding +
                            getCompanyTypeDistribution().subsidiary +
                            getCompanyTypeDistribution().independent)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-64 h-64 relative rounded-full bg-slate-100 flex items-center justify-center">
                <PieChart className="h-16 w-16 text-slate-400" />
                <div className="absolute inset-0">
                  {/* This would be a real chart in a production app */}
                  <div className="absolute inset-0 border-8 border-blue-500 rounded-full clip-path-pie-1"></div>
                  <div className="absolute inset-0 border-8 border-green-500 rounded-full clip-path-pie-2"></div>
                  <div className="absolute inset-0 border-8 border-purple-500 rounded-full clip-path-pie-3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                This report shows the status of all company contracts.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Active Contracts</span>
                  </div>
                  <span className="font-medium">65%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Expiring Soon</span>
                  </div>
                  <span className="font-medium">15%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: "15%" }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Expired</span>
                  </div>
                  <span className="font-medium">20%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "20%" }}></div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/company/history">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> View Contract History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                This report shows key performance indicators for companies.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium mb-2">Average Contract Duration</h3>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-sm text-muted-foreground">months</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Contract Renewal Rate</h3>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">78%</div>
                    <div className="text-sm text-green-600">+5% from last year</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">New Companies (Last 12 Months)</h3>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">12</div>
                    <div className="text-sm text-green-600">+2 from previous period</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
