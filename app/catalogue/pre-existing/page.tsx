"use client"

import { useState, useEffect } from "react"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { AddPreExistingCondition } from "@/components/catalogue/add-pre-existing-condition"

interface PreExistingCondition {
  id: string
  itemId: string
  catalogId: string
  title: string
  description: string
  icdCode: string
  diagnosisRequirement: string
  isDefaultExcluded: boolean
  isConditional: boolean
  waitingPeriodMonths: string
  coverageImpact: string
  isExcludable: boolean
  remarks: string
  catalogue: string // For display purposes
}

const defaultConditions: PreExistingCondition[] = [
  {
    id: "1",
    itemId: "PE001",
    catalogId: "KPJ_CAT_001",
    title: "Diabetes Mellitus Type 2",
    description:
      "A chronic metabolic disorder characterized by high blood glucose levels due to insulin resistance or insufficient insulin production",
    icdCode: "E11.9",
    diagnosisRequirement:
      "Medical records showing HbA1c levels ≥6.5%, fasting glucose ≥126 mg/dL, or documented diabetes treatment for at least 6 months",
    isDefaultExcluded: true,
    isConditional: false,
    waitingPeriodMonths: "12",
    coverageImpact: "excluded",
    isExcludable: true,
    remarks:
      "Standard exclusion for diabetes with complications. May consider coverage with significant loading after 2 years of stable control",
    catalogue: "KPJ Catalogue",
  },
  {
    id: "2",
    itemId: "PE002",
    catalogId: "KPJ_CAT_001",
    title: "Essential Hypertension",
    description: "High blood pressure of unknown cause requiring ongoing medication management",
    icdCode: "I10",
    diagnosisRequirement:
      "Blood pressure readings consistently ≥140/90 mmHg on multiple occasions, current antihypertensive medication, or documented hypertension diagnosis",
    isDefaultExcluded: false,
    isConditional: true,
    waitingPeriodMonths: "6",
    coverageImpact: "conditional",
    isExcludable: true,
    remarks: "May be covered with 25-50% loading after medical review. Exclude if target organ damage present",
    catalogue: "KPJ Catalogue",
  },
  {
    id: "3",
    itemId: "PE003",
    catalogId: "PRUD_STD_001",
    title: "Coronary Artery Disease",
    description: "Narrowing or blockage of coronary arteries that supply blood to the heart muscle",
    icdCode: "I25.10",
    diagnosisRequirement:
      "Cardiac catheterization results, stress test abnormalities, documented myocardial infarction, or coronary intervention procedures",
    isDefaultExcluded: true,
    isConditional: false,
    waitingPeriodMonths: "24",
    coverageImpact: "excluded",
    isExcludable: false,
    remarks: "Permanent exclusion for all cardiovascular conditions. No override permitted due to high mortality risk",
    catalogue: "Prudential Standard Catalogue",
  },
  {
    id: "4",
    itemId: "PE004",
    catalogId: "ALLIANZ_001",
    title: "Bronchial Asthma",
    description:
      "Chronic inflammatory airway disease causing recurrent episodes of wheezing, breathlessness, and coughing",
    icdCode: "J45.9",
    diagnosisRequirement:
      "Pulmonary function tests showing reversible airway obstruction, documented use of bronchodilators, or hospitalization for asthma exacerbation",
    isDefaultExcluded: false,
    isConditional: true,
    waitingPeriodMonths: "3",
    coverageImpact: "conditional",
    isExcludable: true,
    remarks:
      "Coverage possible with loading if well-controlled. Exclude if severe persistent asthma or recent hospitalizations",
    catalogue: "Allianz Catalogue",
  },
  {
    id: "5",
    itemId: "PE005",
    catalogId: "GREAT_EAST_001",
    title: "Chronic Kidney Disease Stage 3",
    description: "Moderate decrease in kidney function with GFR between 30-59 mL/min/1.73m²",
    icdCode: "N18.3",
    diagnosisRequirement:
      "Laboratory results showing eGFR 30-59 mL/min/1.73m² on two occasions at least 3 months apart, or documented CKD diagnosis by nephrologist",
    isDefaultExcluded: true,
    isConditional: false,
    waitingPeriodMonths: "18",
    coverageImpact: "excluded",
    isExcludable: false,
    remarks:
      "Permanent exclusion for renal conditions. High risk of progression to dialysis and transplant requirements",
    catalogue: "Great Eastern Catalogue",
  },
  {
    id: "6",
    itemId: "PE006",
    catalogId: "KPJ_CAT_001",
    title: "Hyperlipidemia",
    description: "Elevated levels of lipids in the blood including cholesterol and triglycerides",
    icdCode: "E78.5",
    diagnosisRequirement:
      "Lipid panel showing total cholesterol >240 mg/dL, LDL >160 mg/dL, or triglycerides >200 mg/dL, or current statin therapy",
    isDefaultExcluded: false,
    isConditional: true,
    waitingPeriodMonths: "0",
    coverageImpact: "included_with_loading",
    isExcludable: true,
    remarks: "Standard acceptance with 10-25% loading. Monitor for cardiovascular complications during underwriting",
    catalogue: "KPJ Catalogue",
  },
  {
    id: "7",
    itemId: "PE007",
    catalogId: "PRUD_STD_001",
    title: "Major Depressive Disorder",
    description:
      "Persistent mood disorder characterized by depressed mood, loss of interest, and impaired daily functioning",
    icdCode: "F33.9",
    diagnosisRequirement:
      "Psychiatric evaluation confirming diagnosis, documented antidepressant treatment, or history of hospitalization for depression",
    isDefaultExcluded: false,
    isConditional: true,
    waitingPeriodMonths: "12",
    coverageImpact: "conditional",
    isExcludable: true,
    remarks:
      "Case-by-case review required. Exclude if suicide attempts, psychosis, or severe functional impairment. Consider loading for mild-moderate cases",
    catalogue: "Prudential Standard Catalogue",
  },
  {
    id: "8",
    itemId: "PE008",
    catalogId: "ALLIANZ_001",
    title: "Gastroesophageal Reflux Disease",
    description: "Chronic condition where stomach acid frequently flows back into the esophagus",
    icdCode: "K21.9",
    diagnosisRequirement:
      "Endoscopy showing esophagitis, documented PPI therapy for >6 months, or pH monitoring confirming acid reflux",
    isDefaultExcluded: false,
    isConditional: false,
    waitingPeriodMonths: "0",
    coverageImpact: "included_with_loading",
    isExcludable: false,
    remarks: "Standard acceptance with minimal loading. Monitor for Barrett's esophagus or complications",
    catalogue: "Allianz Catalogue",
  },
]

export default function PreExistingPage() {
  const [conditions, setConditions] = useState<PreExistingCondition[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedConditions = localStorage.getItem("preExistingConditions")
    if (savedConditions) {
      setConditions(JSON.parse(savedConditions))
    } else {
      setConditions(defaultConditions)
      localStorage.setItem("preExistingConditions", JSON.stringify(defaultConditions))
    }
  }, [])

  // Save to localStorage whenever conditions change
  useEffect(() => {
    if (conditions.length > 0) {
      localStorage.setItem("preExistingConditions", JSON.stringify(conditions))
    }
  }, [conditions])

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Benefit Exclusion Catalogue", href: "/catalogue/records" },
    { label: "Pre-Existing", href: "/catalogue/pre-existing" },
  ]

  const filteredConditions = conditions.filter(
    (condition) =>
      condition.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.itemId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.icdCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.catalogue?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this condition?")) {
      setConditions(conditions.filter((condition) => condition.id !== id))
    }
  }

  const handleAddCondition = (newConditionData: any) => {
    // Map catalog ID to display name
    const catalogDisplayNames: Record<string, string> = {
      KPJ_CAT_001: "KPJ Catalogue",
      PRUD_STD_001: "Prudential Standard Catalogue",
      ALLIANZ_001: "Allianz Catalogue",
      GREAT_EAST_001: "Great Eastern Catalogue",
    }

    const newCondition: PreExistingCondition = {
      ...newConditionData,
      id: Date.now().toString(),
      catalogue: catalogDisplayNames[newConditionData.catalogId] || newConditionData.catalogId,
    }

    setConditions((prev) => [...prev, newCondition])
  }

  const formatCoverageImpact = (impact: string) => {
    if (!impact) return "Unknown"
    return impact.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getCoverageImpactColor = (impact: string) => {
    switch (impact) {
      case "excluded":
        return "text-red-600 border-red-200"
      case "conditional":
        return "text-yellow-600 border-yellow-200"
      case "included_with_loading":
        return "text-blue-600 border-blue-200"
      default:
        return "text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pre-existing Conditions</h1>
          <p className="text-gray-600 mt-1">Manage pre-existing conditions across all catalogues</p>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conditions by name, description, ID, or ICD code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {/* Conditions Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ICD Code
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
              {filteredConditions.map((condition) => (
                <tr key={condition.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{condition.itemId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{condition.title}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{condition.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{condition.icdCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className={getCoverageImpactColor(condition.coverageImpact)}>
                      {formatCoverageImpact(condition.coverageImpact)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {condition.catalogue || "Unknown Catalogue"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(condition.id)}
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

        {filteredConditions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? "No conditions found matching your search." : "No pre-existing conditions found."}
            </p>
          </div>
        )}
      </div>

      {/* Add Condition Modal */}
      {showAddForm && <AddPreExistingCondition onClose={() => setShowAddForm(false)} onSave={handleAddCondition} />}
    </div>
  )
}
