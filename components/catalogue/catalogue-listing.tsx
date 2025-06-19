"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2 } from "lucide-react"
import { getCatalogues, deleteCatalogue, type Catalogue } from "@/lib/catalogue/catalogue-storage"
import { ViewCatalogue } from "./view-catalogue"
import { EditCatalogue } from "./edit-catalogue"

export function CatalogueListing() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([])
  const [selectedCatalogue, setSelectedCatalogue] = useState<Catalogue | null>(null)
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null)

  useEffect(() => {
    setCatalogues(getCatalogues())
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this catalogue?")) {
      deleteCatalogue(id)
      setCatalogues(getCatalogues())
    }
  }

  const handleView = (catalogue: Catalogue) => {
    setSelectedCatalogue(catalogue)
    setViewMode("view")
  }

  const handleEdit = (catalogue: Catalogue) => {
    console.log("Editing catalogue:", catalogue)
    setSelectedCatalogue(catalogue)
    setViewMode("edit")
  }

  const handleClose = () => {
    setSelectedCatalogue(null)
    setViewMode(null)
    setCatalogues(getCatalogues()) // Refresh data
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      draft: "bg-yellow-100 text-yellow-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      medical: "bg-blue-100 text-blue-800",
      dental: "bg-purple-100 text-purple-800",
      optical: "bg-indigo-100 text-indigo-800",
      maternity: "bg-pink-100 text-pink-800",
      wellness: "bg-green-100 text-green-800",
    }
    return variants[category as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {catalogues.map((catalogue) => (
                <tr key={catalogue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{catalogue.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{catalogue.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getCategoryBadge(catalogue.category)}>
                      {catalogue.category.charAt(0).toUpperCase() + catalogue.category.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {catalogue.type.charAt(0).toUpperCase() + catalogue.type.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{catalogue.items.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusBadge(catalogue.status)}>
                      {catalogue.status.charAt(0).toUpperCase() + catalogue.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(catalogue)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(catalogue)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(catalogue.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {catalogues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No catalogues found. Create your first catalogue to get started.</p>
          </div>
        )}
      </div>

      {selectedCatalogue && viewMode === "view" && (
        <ViewCatalogue catalogue={selectedCatalogue} onClose={handleClose} />
      )}

      {selectedCatalogue && viewMode === "edit" && (
        <EditCatalogue catalogue={selectedCatalogue} onClose={handleClose} />
      )}
    </>
  )
}
