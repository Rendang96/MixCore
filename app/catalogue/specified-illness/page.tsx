"use client"

import { useState, useEffect } from "react"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { specifiedIllnessStorage, type SpecifiedIllness } from "@/lib/catalogue/specified-illness-storage"
import { AddSpecifiedIllness } from "@/components/catalogue/add-specified-illness"

export default function SpecifiedIllnessPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [illnesses, setIllnesses] = useState<SpecifiedIllness[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    loadIllnesses()
  }, [])

  const loadIllnesses = () => {
    const savedIllnesses = specifiedIllnessStorage.getAll()
    if (savedIllnesses.length > 0) {
      setIllnesses(savedIllnesses)
    } else {
      // Initialize with sample data if empty
      const initialIllnesses: SpecifiedIllness[] = [
        {
          id: "1",
          specifiedIllnessId: "SI001",
          name: "Coronary Heart Disease",
          description: "Blockage of coronary arteries",
          catalogue: "KPJ Catalogue",
          waitingPeriodMonths: 12,
          isCoveredAfterWaiting: true,
          coverageImpact: "conditional",
          isExcludable: true,
          ageRestriction: "Above 40 years",
          remarks: "Requires medical review",
        },
        {
          id: "2",
          specifiedIllnessId: "SI002",
          name: "Stroke",
          description: "Cerebrovascular accident affecting brain function",
          catalogue: "KPJ Catalogue",
          waitingPeriodMonths: 24,
          isCoveredAfterWaiting: true,
          coverageImpact: "covered after waiting",
          isExcludable: false,
          ageRestriction: "Above 50 years",
          remarks: "Full coverage after waiting period",
        },
        {
          id: "3",
          specifiedIllnessId: "SI003",
          name: "Cancer",
          description: "Malignant tumor requiring immediate treatment",
          catalogue: "General Catalogue",
          waitingPeriodMonths: 36,
          isCoveredAfterWaiting: false,
          coverageImpact: "excluded",
          isExcludable: false,
          ageRestriction: "",
          remarks: "Permanent exclusion",
        },
        {
          id: "4",
          specifiedIllnessId: "SI004",
          name: "Kidney Failure",
          description: "Chronic kidney disease requiring dialysis",
          catalogue: "KPJ Catalogue",
          waitingPeriodMonths: 24,
          isCoveredAfterWaiting: true,
          coverageImpact: "conditional",
          isExcludable: true,
          ageRestriction: "",
          remarks: "Coverage subject to medical review",
        },
      ]
      setIllnesses(initialIllnesses)
      specifiedIllnessStorage.saveAll(initialIllnesses)
    }
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Benefit Exclusion Catalogue", href: "/catalogue" },
    { label: "Specified Illness", href: "/catalogue/specified-illness" },
  ]

  const filteredIllnesses = illnesses.filter(
    (illness) =>
      (illness.specifiedIllnessId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (illness.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (illness.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this specified illness?")) {
      specifiedIllnessStorage.delete(id)
      loadIllnesses()
    }
  }

  const getCoverageImpactColor = (impact: string | undefined) => {
    switch (impact?.toLowerCase()) {
      case "excluded":
        return "text-red-600 bg-red-50"
      case "conditional":
        return "text-orange-600 bg-orange-50"
      case "covered after waiting":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Specified Illnesses</h1>
          <p className="text-gray-600 mt-1">Manage specified illnesses across all catalogues</p>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search illnesses by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <AddSpecifiedIllness onIllnessAdded={loadIllnesses} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Illness Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waiting Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catalogue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIllnesses.map((illness) => (
                <tr key={illness.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{illness.specifiedIllnessId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{illness.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{illness.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {illness.waitingPeriodMonths} {illness.waitingPeriodMonths === 1 ? "month" : "months"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCoverageImpactColor(illness.coverageImpact)}`}
                    >
                      {illness.coverageImpact || "Not specified"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {illness.catalogue}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(illness.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIllnesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No specified illnesses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
