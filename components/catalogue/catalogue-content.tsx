"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { CreateNewCatalogue } from "./create-new-catalogue"
import { getCatalogues, type Catalogue, deleteCatalogue } from "@/lib/catalogue/catalogue-storage"
import { initializeCompleteCatalogueData } from "@/lib/catalogue/complete-catalogue-initializer"
import { useRouter } from "next/navigation"

export function CatalogueContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Initialize dummy data first
    initializeCompleteCatalogueData()

    // Then fetch catalogues when component mounts or refreshTrigger changes
    const fetchedCatalogues = getCatalogues()
    setCatalogues(fetchedCatalogues)
  }, [refreshTrigger])

  const handleCreateSuccess = () => {
    // Trigger a refresh of the catalogue list
    setRefreshTrigger((prev) => prev + 1)
    setIsCreateModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this catalogue?")) {
      deleteCatalogue(id)
      setRefreshTrigger((prev) => prev + 1)
    }
  }

  const handleView = (id: string) => {
    router.push(`/catalogue/view/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/catalogue/edit/${id}`)
  }

  const filteredCatalogues = catalogues.filter(
    (catalogue) =>
      catalogue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalogue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalogue.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full max-w-none px-6 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">Benefit Exclusion Catalogues</h1>
        <p className="text-gray-600 mt-2">Manage catalogues of medical conditions and exclusions</p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 max-w-4xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search catalogues by ID, name or description..."
            className="pl-10 h-12 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="lg" className="h-12 px-4">
          <Filter className="h-5 w-5" />
        </Button>
        <Button onClick={() => setIsCreateModalOpen(true)} size="lg" className="h-12 bg-blue-600 hover:bg-blue-700">
          Create Catalogue
        </Button>
      </div>

      {/* Table - Full Width */}
      <div className="bg-white rounded-lg border w-full">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-32 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catalogue ID
                </th>
                <th className="w-80 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="w-64 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items Count
                </th>
                <th className="w-40 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="w-32 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-32 px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCatalogues.length > 0 ? (
                filteredCatalogues.map((catalogue) => (
                  <tr key={catalogue.id} className="hover:bg-gray-50">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{catalogue.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">{catalogue.name}</div>
                        <div className="text-sm text-gray-500 leading-relaxed">{catalogue.description}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">
                          <span className="font-medium">Pre-existing:</span> {catalogue.itemCounts.preExisting}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Specified:</span> {catalogue.itemCounts.specified}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Congenital:</span> {catalogue.itemCounts.congenital}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Exclusions:</span> {catalogue.itemCounts.exclusions}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{catalogue.lastUpdated}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <Badge
                        className={
                          catalogue.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : catalogue.status === "draft"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {catalogue.status.charAt(0).toUpperCase() + catalogue.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <button onClick={() => handleView(catalogue.id)} className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleEdit(catalogue.id)} className="text-gray-600 hover:text-gray-800">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(catalogue.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-500">
                    No catalogues found. Create your first catalogue to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && <CreateNewCatalogue onClose={handleCreateSuccess} />}
    </div>
  )
}
