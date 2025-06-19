"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react"
import { ReportConfigViewModal } from "./report-config-view-modal"

export interface ReportConfig {
  id: string
  reportType: string
  reportFrequency: string
  deliveryMethod: string
  recipients: string
}

interface ReportFrequencyFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: ReportConfig[]
  onSaveData?: (data: ReportConfig[]) => void
}

export function ReportFrequencyForm({ onNext, onBack, initialData = [], onSaveData }: ReportFrequencyFormProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [savedReportConfigs, setSavedReportConfigs] = useState<ReportConfig[]>([])
  const [currentReportConfig, setCurrentReportConfig] = useState<ReportConfig>({
    id: "",
    reportType: "",
    reportFrequency: "",
    deliveryMethod: "",
    recipients: "",
  })

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedReportConfig, setSelectedReportConfig] = useState<ReportConfig | null>(null)

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null)

  // Initialize data from props or localStorage
  useEffect(() => {
    if (!isInitialized) {
      const storageKey = "company-report-configs"

      if (initialData && initialData.length > 0) {
        // Initialize from props
        const configsWithIds = initialData.map((config, index) => ({
          ...config,
          id: config.id || `config-${Date.now()}-${index}`,
        }))
        setSavedReportConfigs(configsWithIds)
        localStorage.setItem(storageKey, JSON.stringify(configsWithIds))
      } else {
        // Try to load from localStorage
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          try {
            const parsedConfigs = JSON.parse(stored)
            setSavedReportConfigs(parsedConfigs)
          } catch (error) {
            console.error("Error parsing stored report configs:", error)
            setSavedReportConfigs([])
          }
        }
      }
      setIsInitialized(true)
    }
  }, [initialData, isInitialized])

  // Update parent component when saved configs change
  useEffect(() => {
    if (isInitialized && onSaveData) {
      onSaveData(savedReportConfigs)
    }
  }, [savedReportConfigs, onSaveData, isInitialized])

  // Helper function to format report type for display
  const formatReportType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      utilization: "Utilization Report",
      claims: "Claims Report",
      membership: "Membership Report",
      financial: "Financial Report",
    }
    return typeMap[type] || type
  }

  // Helper function to format frequency for display
  const formatFrequency = (frequency: string): string => {
    const frequencyMap: { [key: string]: string } = {
      monthly: "Monthly",
      quarterly: "Quarterly",
      annually: "Annually",
    }
    return frequencyMap[frequency] || frequency
  }

  // Helper function to format delivery method for display
  const formatDeliveryMethod = (method: string): string => {
    const methodMap: { [key: string]: string } = {
      email: "Email",
      portal: "Portal",
      physical: "Physical Copy",
    }
    return methodMap[method] || method
  }

  const handleSaveReportConfig = useCallback(() => {
    if (
      !currentReportConfig.reportType ||
      !currentReportConfig.reportFrequency ||
      !currentReportConfig.deliveryMethod
    ) {
      alert("Please fill in all required fields")
      return
    }

    const configToSave = {
      ...currentReportConfig,
      id: editingId || `config-${Date.now()}`,
    }

    let updatedConfigs: ReportConfig[]
    if (editingId) {
      // Update existing config
      updatedConfigs = savedReportConfigs.map((config) => (config.id === editingId ? configToSave : config))
      setEditingId(null)
    } else {
      // Add new config
      updatedConfigs = [...savedReportConfigs, configToSave]
    }

    setSavedReportConfigs(updatedConfigs)

    // Save to localStorage immediately
    localStorage.setItem("company-report-configs", JSON.stringify(updatedConfigs))

    // Update parent component immediately
    if (onSaveData) {
      onSaveData(updatedConfigs)
    }

    // Reset form
    setCurrentReportConfig({
      id: "",
      reportType: "",
      reportFrequency: "",
      deliveryMethod: "",
      recipients: "",
    })
  }, [currentReportConfig, editingId, savedReportConfigs, onSaveData])

  const handleEditReportConfig = useCallback((config: ReportConfig) => {
    setCurrentReportConfig(config)
    setEditingId(config.id)
  }, [])

  const handleDeleteReportConfig = useCallback(
    (id: string) => {
      const updatedConfigs = savedReportConfigs.filter((config) => config.id !== id)
      setSavedReportConfigs(updatedConfigs)

      // Save to localStorage immediately
      localStorage.setItem("company-report-configs", JSON.stringify(updatedConfigs))

      // Update parent component immediately
      if (onSaveData) {
        onSaveData(updatedConfigs)
      }
    },
    [savedReportConfigs, onSaveData],
  )

  const handleViewReportConfig = useCallback((config: ReportConfig) => {
    setSelectedReportConfig(config)
    setViewModalOpen(true)
  }, [])

  const handleReset = useCallback(() => {
    setCurrentReportConfig({
      id: "",
      reportType: "",
      reportFrequency: "",
      deliveryMethod: "",
      recipients: "",
    })
    setEditingId(null)
  }, [])

  const handleSave = useCallback(() => {
    if (onSaveData) {
      onSaveData(savedReportConfigs)
    }
    onNext()
  }, [savedReportConfigs, onSaveData, onNext])

  // Filter and search logic
  const filteredConfigs = savedReportConfigs.filter((config) => {
    const matchesSearch =
      searchTerm === "" ||
      formatReportType(config.reportType).toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatFrequency(config.reportFrequency).toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDeliveryMethod(config.deliveryMethod).toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.recipients.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || config.reportType === filterType

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentConfigs = filteredConfigs.slice(startIndex, endIndex)

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterType])

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-slate-800 mb-8">Report Frequency</h3>

      {/* Report Configuration Form */}
      <div className="mb-8 p-6 border border-slate-200 rounded-lg bg-slate-50">
        <h4 className="text-lg font-medium text-slate-800 mb-4">
          {editingId ? "Edit Report Configuration" : "Report Configuration Details"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Report Type *</label>
            <Select
              value={currentReportConfig.reportType}
              onValueChange={(value) => setCurrentReportConfig((prev) => ({ ...prev, reportType: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utilization">Utilization Report</SelectItem>
                <SelectItem value="claims">Claims Report</SelectItem>
                <SelectItem value="membership">Membership Report</SelectItem>
                <SelectItem value="financial">Financial Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Report Frequency *</label>
            <Select
              value={currentReportConfig.reportFrequency}
              onValueChange={(value) => setCurrentReportConfig((prev) => ({ ...prev, reportFrequency: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Delivery Method *</label>
            <Select
              value={currentReportConfig.deliveryMethod}
              onValueChange={(value) => setCurrentReportConfig((prev) => ({ ...prev, deliveryMethod: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Delivery Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="portal">Portal</SelectItem>
                <SelectItem value="physical">Physical Copy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Recipients</label>
            <Input
              className="w-full"
              placeholder="Enter email addresses separated by commas"
              value={currentReportConfig.recipients}
              onChange={(e) => setCurrentReportConfig((prev) => ({ ...prev, recipients: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSaveReportConfig} className="bg-sky-600 hover:bg-sky-700">
            Save
          </Button>
          <Button variant="outline" onClick={handleReset}>
            {editingId ? "Cancel Edit" : "Reset"}
          </Button>
        </div>
      </div>

      {/* Report Configuration Listing */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-slate-800 mb-4">Report Configuration Listing</h4>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search report configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="utilization">Utilization Report</SelectItem>
                <SelectItem value="claims">Claims Report</SelectItem>
                <SelectItem value="membership">Membership Report</SelectItem>
                <SelectItem value="financial">Financial Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">No.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Report Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Frequency</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Delivery Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Recipients</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentConfigs.length > 0 ? (
                currentConfigs.map((config, index) => (
                  <tr key={config.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{formatReportType(config.reportType)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{formatFrequency(config.reportFrequency)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{formatDeliveryMethod(config.deliveryMethod)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {config.recipients
                        ? config.recipients.length > 30
                          ? `${config.recipients.substring(0, 30)}...`
                          : config.recipients
                        : "No recipients"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewReportConfig(config)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditReportConfig(config)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReportConfig(config.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    {searchTerm || filterType !== "all"
                      ? "No report configurations match your search criteria."
                      : "No report configurations saved yet. Add your first configuration above."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Show count below table */}
        <div className="text-right mt-4 text-sm text-slate-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredConfigs.length)} of {filteredConfigs.length} report
          configurations
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
      </div>

      {/* View Modal */}
      {selectedReportConfig && (
        <ReportConfigViewModal
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false)
            setSelectedReportConfig(null)
          }}
          reportConfig={selectedReportConfig}
        />
      )}
    </div>
  )
}
