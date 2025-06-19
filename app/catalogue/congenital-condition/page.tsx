"use client"

import { useState, useEffect } from "react"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { AddCongenitalCondition } from "@/components/catalogue/add-congenital-condition"
import { congenitalConditionStorage, type CongenitalCondition } from "@/lib/catalogue/congenital-condition-storage"

const initialConditions: CongenitalCondition[] = [
  {
    id: "1",
    congenitalConditionId: "CC001",
    name: "Congenital Heart Defect",
    description: "Structural heart defect present at birth",
    type: "excluded",
    catalogue: "KPJ Catalogue",
    icdCode: "Q20.0",
    isDefaultExcluded: true,
    isCoverableUnderChildRider: false,
    coverageImpact: "excluded",
    isConditional: false,
    appliesTo: "child only",
    remarks: "Requires cardiac assessment",
  },
  {
    id: "2",
    congenitalConditionId: "CC002",
    name: "Spina Bifida",
    description: "Neural tube defect affecting the spine",
    type: "conditional",
    catalogue: "KPJ Catalogue",
    icdCode: "Q05.9",
    isDefaultExcluded: false,
    isCoverableUnderChildRider: true,
    coverageImpact: "covered with rider",
    isConditional: true,
    appliesTo: "child only",
    remarks: "Coverage depends on severity level",
  },
  {
    id: "3",
    congenitalConditionId: "CC003",
    name: "Cleft Palate",
    description: "Opening in the roof of the mouth present at birth",
    type: "covered with rider",
    catalogue: "Prudential Standard Catalogue",
    icdCode: "Q35.9",
    isDefaultExcluded: false,
    isCoverableUnderChildRider: true,
    coverageImpact: "covered with rider",
    isConditional: false,
    appliesTo: "child only",
    remarks: "Surgical correction covered under rider",
  },
  {
    id: "4",
    congenitalConditionId: "CC004",
    name: "Down Syndrome",
    description: "Genetic disorder caused by extra chromosome 21",
    type: "excluded",
    catalogue: "KPJ Catalogue",
    icdCode: "Q90.9",
    isDefaultExcluded: true,
    isCoverableUnderChildRider: false,
    coverageImpact: "excluded",
    isConditional: false,
    appliesTo: "all",
    remarks: "Excluded across all age groups",
  },
]

const getCoverageImpactColor = (impact: string) => {
  switch (impact?.toLowerCase()) {
    case "excluded":
      return "bg-red-100 text-red-800"
    case "covered with rider":
      return "bg-green-100 text-green-800"
    case "conditional":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getAppliesToColor = (appliesTo: string) => {
  switch (appliesTo?.toLowerCase()) {
    case "insured":
      return "bg-blue-100 text-blue-800"
    case "spouse":
      return "bg-purple-100 text-purple-800"
    case "child only":
      return "bg-pink-100 text-pink-800"
    case "all":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function CongenitalConditionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [conditions, setConditions] = useState<CongenitalCondition[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedConditions = congenitalConditionStorage.getAll()
    if (savedConditions.length > 0) {
      setConditions(savedConditions)
    } else {
      setConditions(initialConditions)
      congenitalConditionStorage.saveAll(initialConditions)
    }
  }, [])

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Benefit Exclusion Catalogue", href: "/catalogue" },
    { label: "Congenital Condition", href: "/catalogue/congenital-condition" },
  ]

  const filteredConditions = conditions.filter(
    (condition) =>
      (condition.congenitalConditionId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (condition.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (condition.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (condition.icdCode?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this condition?")) {
      congenitalConditionStorage.delete(id)
      setConditions(congenitalConditionStorage.getAll())
    }
  }

  const handleConditionAdded = (newCondition: CongenitalCondition) => {
    setConditions(congenitalConditionStorage.getAll())
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Congenital Conditions</h1>
          <p className="text-gray-600 mt-1">Manage congenital conditions across all catalogues</p>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conditions by name, ID, or ICD code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <AddCongenitalCondition onConditionAdded={handleConditionAdded} />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ITEM ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CONDITION NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ICD CODE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  COVERAGE IMPACT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  APPLIES TO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CATALOGUE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConditions.map((condition) => (
                <tr key={condition.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{condition.congenitalConditionId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{condition.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{condition.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{condition.icdCode || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getCoverageImpactColor(condition.coverageImpact)}>
                      {condition.coverageImpact}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getAppliesToColor(condition.appliesTo)}>{condition.appliesTo}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {condition.catalogue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(condition.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConditions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No conditions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
