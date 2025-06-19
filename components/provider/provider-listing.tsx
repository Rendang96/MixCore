"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Download } from "lucide-react"
import { deleteProvider } from "@/lib/provider/provider-storage"
import type { Provider } from "@/lib/provider/provider-storage"

interface ProviderListingProps {
  providers: Provider[]
  onProviderUpdated: () => void
}

export function ProviderListing({ providers, onProviderUpdated }: ProviderListingProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(providers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProviders = providers.slice(startIndex, endIndex)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this provider?")) {
      deleteProvider(id)
      onProviderUpdated()
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["Provider Name", "Provider Code", "Type", "Specialization", "Contact Person", "Phone", "Email", "Status"],
      ...providers.map((provider) => [
        provider.providerName,
        provider.providerCode,
        provider.providerType,
        provider.specialization,
        provider.contactPerson,
        provider.phoneNumber,
        provider.email,
        provider.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "providers.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Provider Listing ({providers.length} providers found)</CardTitle>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Provider Name</th>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Specialization</th>
                <th className="text-left p-3 font-medium">Contact Person</th>
                <th className="text-left p-3 font-medium">Phone</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProviders.map((provider) => (
                <tr key={provider.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{provider.providerName}</td>
                  <td className="p-3">{provider.providerCode}</td>
                  <td className="p-3">{provider.providerType}</td>
                  <td className="p-3">{provider.specialization}</td>
                  <td className="p-3">{provider.contactPerson}</td>
                  <td className="p-3">{provider.phoneNumber}</td>
                  <td className="p-3">
                    <Badge variant={provider.status === "Active" ? "default" : "secondary"}>{provider.status}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(provider.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, providers.length)} of {providers.length} providers
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
