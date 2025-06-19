"use client"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

export function DashboardContent() {
  // Updated breadcrumb items for Dashboard
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard" }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <div className="flex gap-2">
          <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200">
            Export
          </button>
          <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700">
            New Report
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Clients", value: "1,284", change: "+12.5%" },
          { title: "Active Policies", value: "3,456", change: "+8.2%" },
          { title: "Claims Processed", value: "12,543", change: "+23.1%" },
          { title: "Revenue", value: "$1.2M", change: "+15.3%" },
        ].map((card, index) => (
          <div key={index} className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
              <span className="text-sm font-medium text-emerald-600">{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-slate-800">Recent Claims</h3>
          <div className="h-64 rounded-md bg-slate-50 flex items-center justify-center text-slate-400">
            Claims Chart Placeholder
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-slate-800">Policy Distribution</h3>
          <div className="h-64 rounded-md bg-slate-50 flex items-center justify-center text-slate-400">
            Policy Chart Placeholder
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-800">Recent Activities</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-slate-500">
                <th className="pb-3 pr-6">Activity</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Date</th>
                <th className="pb-3 pr-6">User</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {[
                { activity: "New policy created", status: "Completed", date: "May 4, 2025", user: "John Doe" },
                { activity: "Claim processed", status: "Completed", date: "May 3, 2025", user: "Jane Smith" },
                { activity: "Client onboarded", status: "Completed", date: "May 2, 2025", user: "Robert Johnson" },
                { activity: "Benefit updated", status: "Pending", date: "May 1, 2025", user: "Sarah Williams" },
                { activity: "Report generated", status: "Completed", date: "Apr 30, 2025", user: "Michael Brown" },
              ].map((row, index) => (
                <tr key={index} className="text-slate-700">
                  <td className="py-3 pr-6">{row.activity}</td>
                  <td className="py-3 pr-6">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        row.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 pr-6">{row.date}</td>
                  <td className="py-3 pr-6">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
