"use client"

import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { AddGeneralExclusion } from "@/components/catalogue/add-general-exclusion"
import { generalExclusionStorage, type GeneralExclusion } from "@/lib/catalogue/general-exclusion-storage"

export default function GeneralExclusionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [exclusions, setExclusions] = useState<GeneralExclusion[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedExclusions = generalExclusionStorage.getAll()
    if (loadedExclusions.length === 0) {
      // Initialize with default data
      const defaultExclusions: Omit<GeneralExclusion, "id">[] = [
        {
          itemId: "GE001",
          catalogId: "KPJ_CAT_001",
          title: "Self-inflicted Injuries",
          description:
            "Any injury, illness, or condition that is intentionally self-inflicted, including but not limited to suicide attempts, self-harm, or injuries sustained while under the influence of alcohol or drugs.",
          coverageImpact: "always_excluded",
          isOverridable: false,
          appliesTo: "all",
          isVisibleToMember: true,
          remarks: "Legally mandated exclusion in most jurisdictions",
        },
        {
          itemId: "GE002",
          catalogId: "KPJ_CAT_001",
          title: "War and Terrorism",
          description:
            "Any loss, injury, or damage directly or indirectly caused by war, invasion, acts of foreign enemies, hostilities, civil war, rebellion, revolution, insurrection, or terrorism.",
          coverageImpact: "legally_mandated",
          isOverridable: false,
          appliesTo: "all",
          isVisibleToMember: true,
          remarks: "Standard exclusion across all insurance products",
        },
        {
          itemId: "GE003",
          catalogId: "PRU_CAT_001",
          title: "Experimental Treatment",
          description:
            "Any treatment, procedure, or medication that is experimental, investigational, or not approved by relevant medical authorities or regulatory bodies.",
          coverageImpact: "always_excluded",
          isOverridable: true,
          appliesTo: "all",
          isVisibleToMember: false,
          remarks: "May be overridden with special medical rider",
        },
        {
          itemId: "GE004",
          catalogId: "ALL_CAT_001",
          title: "Cosmetic Surgery",
          description:
            "Any surgical procedure performed primarily for cosmetic or aesthetic purposes, unless medically necessary due to accident or illness covered under the policy.",
          coverageImpact: "always_excluded",
          isOverridable: true,
          appliesTo: "all",
          isVisibleToMember: true,
          remarks: "Reconstructive surgery after covered accidents may be included",
        },
      ]

      defaultExclusions.forEach((exclusion) => {
        generalExclusionStorage.add(exclusion)
      })
      setExclusions(generalExclusionStorage.getAll())
    } else {
      setExclusions(loadedExclusions)
    }
  }, [])

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Benefit Exclusion Catalogue", href: "/catalogue" },
    { label: "General Exclusion", href: "/catalogue/general-exclusion" },
  ]

  const filteredExclusions = exclusions.filter(
    (exclusion) =>
      (exclusion.itemId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (exclusion.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (exclusion.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  const getCoverageImpactColor = (impact: string | undefined) => {
    if (!impact) return "bg-gray-100 text-gray-800"

    switch (impact) {
      case "always_excluded":
        return "bg-red-100 text-red-800"
      case "legally_mandated":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAppliesToColor = (appliesTo: string | undefined) => {
    if (!appliesTo) return "bg-gray-100 text-gray-800"

    switch (appliesTo) {
      case "all":
        return "bg-purple-100 text-purple-800"
      case "main_insured":
        return "bg-blue-100 text-blue-800"
      case "spouse":
        return "bg-green-100 text-green-800"
      case "dependent":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCoverageImpact = (impact: string | undefined) => {
    if (!impact) return "Unknown"

    switch (impact) {
      case "always_excluded":
        return "Always Excluded"
      case "legally_mandated":
        return "Legally Mandated"
      default:
        return impact
    }
  }

  const formatAppliesTo = (appliesTo: string | undefined) => {
    if (!appliesTo) return "Unknown"

    switch (appliesTo) {
      case "all":
        return "All"
      case "main_insured":
        return "Main Insured"
      case "spouse":
        return "Spouse"
      case "dependent":
        return "Dependent"
      default:
        return appliesTo
    }
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this exclusion?")) {
      generalExclusionStorage.delete(id)
      setExclusions(generalExclusionStorage.getAll())
    }
  }

  const handleExclusionAdded = (newExclusion: GeneralExclusion) => {
    setExclusions(generalExclusionStorage.getAll())
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Exclusions</h1>
          <p className="text-gray-600 mt-1">Manage general exclusions across all catalogues</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search exclusions by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <AddGeneralExclusion onExclusionAdded={handleExclusionAdded} />
      </div>

      {/* Table container */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ITEM ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EXCLUSION TITLE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  COVERAGE IMPACT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  APPLIES TO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OVERRIDABLE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExclusions.map((exclusion) => (
                <tr key={exclusion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {exclusion.itemId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {exclusion.title || "Untitled"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                    <div className="truncate">{exclusion.description || "No description"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getCoverageImpactColor(exclusion.coverageImpact)}>
                      {formatCoverageImpact(exclusion.coverageImpact)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getAppliesToColor(exclusion.appliesTo)}>
                      {formatAppliesTo(exclusion.appliesTo)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {exclusion.isOverridable ? (
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">No</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(exclusion.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
