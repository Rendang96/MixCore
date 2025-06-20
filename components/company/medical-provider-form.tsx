"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Search, Filter, X } from "lucide-react"
import { ProviderConfigViewModal } from "./provider-config-view-modal"
import { ProviderSelectionModal } from "./provider-selection-modal"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Import RadioGroup components
import { ProviderGroupSelectionModal } from "./provider-group-selection-modal"

interface MedicalProviderFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: ProviderConfig[]
  onSaveData?: (data: ProviderConfig[]) => void
}

export interface ProviderConfig {
  id: string
  serviceType: string
  panelship: string
  providerType: string
  state: string
  paymentMethod: string
  accessRule: string
  selectedProviders?: any[] // For Panelship 'Select Access'
  closePanelProviders?: any[] // For Panelship 'Close Panel'
  providerGroupProviders?: any[] // New: For Panelship 'Provider Group'
  restrictAccess?: "yes" | "no" // New field
  restrictedProviders?: any[] // For Restrict Access 'Yes'
}

interface Provider {
  id: string
  name: string
  code: string
  location: string
  phone: string
  hours: string
  status: string
  type: string
}

export function MedicalProviderForm({ onNext, onBack, initialData, onSaveData }: MedicalProviderFormProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [savedProviderConfigs, setSavedProviderConfigs] = useState<ProviderConfig[]>([])
  const [currentProviderConfig, setCurrentProviderConfig] = useState<ProviderConfig>({
    id: "",
    serviceType: "",
    panelship: "",
    providerType: "",
    state: "",
    paymentMethod: "",
    accessRule: "",
    selectedProviders: [],
    closePanelProviders: [],
    providerGroupProviders: [], // Initialize new field
    restrictAccess: "no", // Default to 'no'
    restrictedProviders: [],
  })
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProviderType, setFilterProviderType] = useState("all")
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProviderConfig, setSelectedProviderConfig] = useState<ProviderConfig | null>(null)
  const [showPanelshipProviderModal, setShowPanelshipProviderModal] = useState(false) // For Panelship 'Select Access'
  const [showClosePanelProviderModal, setShowClosePanelProviderModal] = useState(false) // For Panelship 'Close Panel'
  const [showProviderGroupModal, setShowProviderGroupModal] = useState(false) // New: For Panelship 'Provider Group'
  const [showRestrictAccessProviderModal, setShowRestrictAccessProviderModal] = useState(false) // For Restrict Access 'Yes'

  // Initialize data from props or localStorage
  useEffect(() => {
    if (!isInitialized) {
      let loadedConfigs: ProviderConfig[] = []

      if (initialData && initialData.length > 0) {
        loadedConfigs = initialData.map((config, index) => ({
          ...config,
          id: config.id || `provider-config-${index + 1}`,
          restrictAccess: config.restrictAccess || "no", // Ensure default
          restrictedProviders: config.restrictedProviders || [], // Ensure default
          closePanelProviders: config.closePanelProviders || [], // Ensure default
          providerGroupProviders: config.providerGroupProviders || [], // Ensure default
        }))
      } else {
        const storedConfigs = localStorage.getItem("medicalProviderConfigs")
        if (storedConfigs) {
          try {
            loadedConfigs = JSON.parse(storedConfigs).map((config: ProviderConfig) => ({
              ...config,
              restrictAccess: config.restrictAccess || "no",
              restrictedProviders: config.restrictedProviders || [],
              closePanelProviders: config.closePanelProviders || [],
              providerGroupProviders: config.providerGroupProviders || [],
            }))
          } catch (error) {
            console.error("Error parsing stored provider configs:", error)
          }
        }
      }

      setSavedProviderConfigs(loadedConfigs)
      setIsInitialized(true)
    }
  }, [initialData, isInitialized])

  // Helper function to format service type for display
  const formatServiceType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      gp: "GP",
      sp: "SP",
      oc: "OC",
      dt: "DT",
      hp: "HP",
      mt: "MT",
    }
    return typeMap[type] || type.toUpperCase()
  }

  // Helper function to format panelship for display
  const formatPanelship = (panelship: string): string => {
    const panelshipMap: { [key: string]: string } = {
      open_panel: "Open Panel",
      close_panel: "Close Panel",
      select_access: "Select Access",
      provider_group: "Provider Group", // New mapping
    }
    return panelshipMap[panelship] || panelship
  }

  // Helper function to format provider type for display
  const formatProviderType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      all: "All",
      government: "Government",
      semi_government: "Semi-Government",
      private: "Private",
      corporatised: "Corporatised",
    }
    return typeMap[type] || type
  }

  // Helper function to format payment method for display
  const formatPaymentMethod = (method: string): string => {
    const methodMap: { [key: string]: string } = {
      cashless: "Cashless",
      pay_and_claim: "Pay and Claim",
      both: "Both",
    }
    return methodMap[method] || method
  }

  // Helper function to format access rule for display
  const formatAccessRule = (rule: string): string => {
    const ruleMap: { [key: string]: string } = {
      "direct-access": "Direct Access",
      referral: "Referral",
      gl: "GL",
    }
    return ruleMap[rule] || rule
  }

  const handleSaveProviderConfig = useCallback(() => {
    if (!currentProviderConfig.serviceType || !currentProviderConfig.panelship) {
      alert("Please fill in all required fields")
      return
    }

    const configToSave = {
      ...currentProviderConfig,
      id: isEditing ? currentProviderConfig.id : `provider-config-${Date.now()}`,
    }

    let updatedConfigs: ProviderConfig[]
    if (isEditing) {
      updatedConfigs = savedProviderConfigs.map((config) => (config.id === configToSave.id ? configToSave : config))
    } else {
      updatedConfigs = [...savedProviderConfigs, configToSave]
    }

    setSavedProviderConfigs(updatedConfigs)
    localStorage.setItem("medicalProviderConfigs", JSON.stringify(updatedConfigs))

    if (onSaveData) {
      onSaveData(updatedConfigs)
    }

    // Reset form
    setCurrentProviderConfig({
      id: "",
      serviceType: "",
      panelship: "",
      providerType: "",
      state: "",
      paymentMethod: "",
      accessRule: "",
      selectedProviders: [],
      closePanelProviders: [],
      providerGroupProviders: [], // Reset new field
      restrictAccess: "no",
      restrictedProviders: [],
    })
    setIsEditing(false)
  }, [currentProviderConfig, isEditing, savedProviderConfigs, onSaveData])

  const handleEditProviderConfig = useCallback((config: ProviderConfig) => {
    setCurrentProviderConfig(config)
    setIsEditing(true)
  }, [])

  const handleDeleteProviderConfig = useCallback(
    (id: string) => {
      const updatedConfigs = savedProviderConfigs.filter((config) => config.id !== id)
      setSavedProviderConfigs(updatedConfigs)
      localStorage.setItem("medicalProviderConfigs", JSON.stringify(updatedConfigs))

      if (onSaveData) {
        onSaveData(updatedConfigs)
      }
    },
    [savedProviderConfigs, onSaveData],
  )

  const handleViewProviderConfig = useCallback((config: ProviderConfig) => {
    setSelectedProviderConfig(config)
    setShowViewModal(true)
  }, [])

  const handleReset = useCallback(() => {
    setCurrentProviderConfig({
      id: "",
      serviceType: "",
      panelship: "",
      providerType: "",
      state: "",
      paymentMethod: "",
      accessRule: "",
      selectedProviders: [],
      closePanelProviders: [],
      providerGroupProviders: [], // Reset new field
      restrictAccess: "no",
      restrictedProviders: [],
    })
    setIsEditing(false)
  }, [])

  const handleSave = useCallback(() => {
    if (onSaveData) {
      onSaveData(savedProviderConfigs)
    }
    onNext()
  }, [savedProviderConfigs, onSaveData, onNext])

  // Panelship 'Select Access' modal handlers
  const handleOpenPanelshipProviderModal = () => {
    setShowPanelshipProviderModal(true)
  }

  const handleSavePanelshipSelectedProviders = (selectedProviders: Provider[]) => {
    setCurrentProviderConfig({ ...currentProviderConfig, selectedProviders })
  }

  const removePanelshipSelectedProvider = (selectedProviderId: string) => {
    if (currentProviderConfig.selectedProviders) {
      const updatedSelectedProviders = currentProviderConfig.selectedProviders.filter(
        (p: Provider) => p.id !== selectedProviderId,
      )
      setCurrentProviderConfig({ ...currentProviderConfig, selectedProviders: updatedSelectedProviders })
    }
  }

  // Panelship 'Close Panel' modal handlers
  const handleOpenClosePanelProviderModal = () => {
    setShowClosePanelProviderModal(true)
  }

  const handleSaveClosePanelProviders = (closePanelProviders: Provider[]) => {
    setCurrentProviderConfig({ ...currentProviderConfig, closePanelProviders })
  }

  const removeClosePanelProvider = (closePanelProviderId: string) => {
    if (currentProviderConfig.closePanelProviders) {
      const updatedClosePanelProviders = currentProviderConfig.closePanelProviders.filter(
        (p: Provider) => p.id !== closePanelProviderId,
      )
      setCurrentProviderConfig({ ...currentProviderConfig, closePanelProviders: updatedClosePanelProviders })
    }
  }

  // New: Panelship 'Provider Group' modal handlers
  const handleOpenProviderGroupModal = () => {
    setShowProviderGroupModal(true)
  }

  const handleSaveProviderGroupProviders = (providerGroupProviders: Provider[]) => {
    setCurrentProviderConfig({ ...currentProviderConfig, providerGroupProviders })
  }

  const removeProviderGroupProvider = (providerGroupId: string) => {
    if (currentProviderConfig.providerGroupProviders) {
      const updatedProviderGroupProviders = currentProviderConfig.providerGroupProviders.filter(
        (p: Provider) => p.id !== providerGroupId,
      )
      setCurrentProviderConfig({ ...currentProviderConfig, providerGroupProviders: updatedProviderGroupProviders })
    }
  }

  // Restrict Access 'Yes' modal handlers
  const handleOpenRestrictAccessProviderModal = () => {
    setShowRestrictAccessProviderModal(true)
  }

  const handleSaveRestrictedProviders = (restrictedProviders: Provider[]) => {
    setCurrentProviderConfig({ ...currentProviderConfig, restrictedProviders })
  }

  const removeRestrictedProvider = (restrictedProviderId: string) => {
    if (currentProviderConfig.restrictedProviders) {
      const updatedRestrictedProviders = currentProviderConfig.restrictedProviders.filter(
        (p: Provider) => p.id !== restrictedProviderId,
      )
      setCurrentProviderConfig({ ...currentProviderConfig, restrictedProviders: updatedRestrictedProviders })
    }
  }

  // Filter and search logic
  const filteredConfigs = savedProviderConfigs.filter((config) => {
    const matchesSearch =
      config.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.panelship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.providerType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.accessRule.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterProviderType === "all" || config.serviceType.includes(filterProviderType)

    return matchesSearch && matchesFilter
  })

  const addServiceType = (type: string) => {
    if (type && !currentProviderConfig.serviceType.includes(type)) {
      const newServiceTypes = currentProviderConfig.serviceType
        ? currentProviderConfig.serviceType.split(", ").concat(type).join(", ")
        : type
      setCurrentProviderConfig({ ...currentProviderConfig, serviceType: newServiceTypes })
    }
  }

  const removeServiceType = (typeToRemove: string) => {
    const types = currentProviderConfig.serviceType.split(", ").filter((t) => t !== typeToRemove)
    setCurrentProviderConfig({ ...currentProviderConfig, serviceType: types.join(", ") })
  }

  const addProviderType = (type: string) => {
    if (type && !currentProviderConfig.providerType.includes(type)) {
      const newProviderTypes = currentProviderConfig.providerType
        ? currentProviderConfig.providerType.split(", ").concat(type).join(", ")
        : type
      setCurrentProviderConfig({ ...currentProviderConfig, providerType: newProviderTypes })
    }
  }

  const removeProviderType = (typeToRemove: string) => {
    const types = currentProviderConfig.providerType.split(", ").filter((t) => t !== typeToRemove)
    setCurrentProviderConfig({ ...currentProviderConfig, providerType: types.join(", ") })
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-slate-800 mb-8">Medical Provider</h3>

      {/* Provider Configuration Details Form */}
      <div className="mb-8 border border-slate-200 rounded-lg p-6 bg-slate-50">
        <h4 className="text-lg font-medium text-slate-700 mb-6">
          {isEditing ? "Edit" : "Add"} Provider Configuration Details
        </h4>

        <div className="grid grid-cols-3 gap-8 mb-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Provider Services *</label>
            <div className="relative">
              <Select value="" onValueChange={addServiceType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gp">GP</SelectItem>
                  <SelectItem value="sp">SP</SelectItem>
                  <SelectItem value="oc">OC</SelectItem>
                  <SelectItem value="dt">DT</SelectItem>
                  <SelectItem value="hp">HP</SelectItem>
                  <SelectItem value="mt">MT</SelectItem>
                </SelectContent>
              </Select>

              {currentProviderConfig.serviceType && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentProviderConfig.serviceType
                    .split(", ")
                    .filter(Boolean)
                    .map((type, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {formatServiceType(type)}
                        <button
                          type="button"
                          onClick={() => removeServiceType(type)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Panelship *</label>
            <Select
              value={currentProviderConfig.panelship}
              onValueChange={(value) => {
                setCurrentProviderConfig({ ...currentProviderConfig, panelship: value })
                if (value === "select_access") {
                  handleOpenPanelshipProviderModal()
                } else if (value === "close_panel") {
                  handleOpenClosePanelProviderModal()
                } else if (value === "provider_group") {
                  handleOpenProviderGroupModal() // Open modal for Provider Group
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open_panel">Open Panel</SelectItem>
                <SelectItem value="close_panel">Close Panel</SelectItem>
                <SelectItem value="select_access">Select Access</SelectItem>
                <SelectItem value="provider_group">Provider Group</SelectItem> {/* New option */}
              </SelectContent>
            </Select>
          </div>

          {/* New Restrict Access Field */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Restrict Access</label>
            <RadioGroup
              defaultValue="no"
              className="flex space-x-4"
              value={currentProviderConfig.restrictAccess}
              onValueChange={(value: "yes" | "no") => {
                setCurrentProviderConfig({ ...currentProviderConfig, restrictAccess: value })
                if (value === "yes") {
                  handleOpenRestrictAccessProviderModal()
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="restrict-yes" />
                <label htmlFor="restrict-yes" className="text-sm font-medium text-slate-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="restrict-no" />
                <label htmlFor="restrict-no" className="text-sm font-medium text-slate-700">
                  No
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Provider Categories</label>
            <div className="relative">
              <Select value="" onValueChange={addProviderType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="semi_government">Semi-Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="corporatised">Corporatised</SelectItem>
                </SelectContent>
              </Select>

              {currentProviderConfig.providerType && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentProviderConfig.providerType
                    .split(", ")
                    .filter(Boolean)
                    .map((type, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {formatProviderType(type)}
                        <button
                          type="button"
                          onClick={() => removeProviderType(type)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Payment Method</label>
            <Select
              value={currentProviderConfig.paymentMethod}
              onValueChange={(value) => setCurrentProviderConfig({ ...currentProviderConfig, paymentMethod: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cashless">Cashless</SelectItem>
                <SelectItem value="pay_and_claim">Pay and Claim</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Access Rule</label>
            <Select
              value={currentProviderConfig.accessRule}
              onValueChange={(value) => setCurrentProviderConfig({ ...currentProviderConfig, accessRule: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct-access">Direct Access</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="gl">GL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Display Selected Providers for Panelship 'Select Access' */}
        {currentProviderConfig.panelship === "select_access" &&
          currentProviderConfig.selectedProviders &&
          currentProviderConfig.selectedProviders.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                <h5 className="text-md font-medium text-slate-700 mb-4">Selected Providers (Panelship)</h5>

                {/* Group providers by type */}
                {(() => {
                  const groupedProviders = currentProviderConfig.selectedProviders.reduce(
                    (acc: Record<string, Provider[]>, selectedProvider: Provider) => {
                      const type = selectedProvider.type.toUpperCase()
                      if (!acc[type]) acc[type] = []
                      acc[type].push(selectedProvider)
                      return acc
                    },
                    {},
                  )

                  return Object.entries(groupedProviders).map(([type, typeProviders]) => (
                    <div key={type} className="mb-4 last:mb-0">
                      {/* Category Header */}
                      <div className="text-xs font-medium text-gray-600 mb-2 tracking-wide">
                        {type === "CLINIC"
                          ? "CLINICS"
                          : type === "HOSPITAL"
                            ? "HOSPITALS"
                            : type === "PHARMACY"
                              ? "PHARMACIES"
                              : type === "DENTIST"
                                ? "DENTISTS"
                                : type === "PHYSIOTHERAPY"
                                  ? "PHYSIOTHERAPY"
                                  : type}
                      </div>

                      {/* Provider List */}
                      <div className="space-y-2">
                        {typeProviders.map((selectedProvider: Provider) => (
                          <div
                            key={selectedProvider.id}
                            className="bg-white border border-gray-200 rounded p-3 flex justify-between items-start"
                          >
                            <div>
                              <div className="font-medium text-slate-800 text-sm">{selectedProvider.name}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Code: {selectedProvider.code} • {selectedProvider.location}
                              </div>
                            </div>
                            <button
                              onClick={() => removePanelshipSelectedProvider(selectedProvider.id)}
                              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                              aria-label="Remove provider"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                })()}

                {/* Summary and Actions */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    Total selected: {currentProviderConfig.selectedProviders.length} providers
                  </div>
                  <button
                    onClick={handleOpenPanelshipProviderModal}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Modify Provider Selection
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Display Selected Providers for Panelship 'Close Panel' */}
        {currentProviderConfig.panelship === "close_panel" &&
          currentProviderConfig.closePanelProviders &&
          currentProviderConfig.closePanelProviders.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                <h5 className="text-md font-medium text-slate-700 mb-4">Selected Providers (Close Panel)</h5>

                {/* Group providers by type */}
                {(() => {
                  const groupedProviders = currentProviderConfig.closePanelProviders.reduce(
                    (acc: Record<string, Provider[]>, selectedProvider: Provider) => {
                      const type = selectedProvider.type.toUpperCase()
                      if (!acc[type]) acc[type] = []
                      acc[type].push(selectedProvider)
                      return acc
                    },
                    {},
                  )

                  return Object.entries(groupedProviders).map(([type, typeProviders]) => (
                    <div key={type} className="mb-4 last:mb-0">
                      {/* Category Header */}
                      <div className="text-xs font-medium text-gray-600 mb-2 tracking-wide">
                        {type === "CLINIC"
                          ? "CLINICS"
                          : type === "HOSPITAL"
                            ? "HOSPITALS"
                            : type === "PHARMACY"
                              ? "PHARMACIES"
                              : type === "DENTIST"
                                ? "DENTISTS"
                                : type === "PHYSIOTHERAPY"
                                  ? "PHYSIOTHERAPY"
                                  : type}
                      </div>

                      {/* Provider List */}
                      <div className="space-y-2">
                        {typeProviders.map((selectedProvider: Provider) => (
                          <div
                            key={selectedProvider.id}
                            className="bg-white border border-gray-200 rounded p-3 flex justify-between items-start"
                          >
                            <div>
                              <div className="font-medium text-slate-800 text-sm">{selectedProvider.name}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Code: {selectedProvider.code} • {selectedProvider.location}
                              </div>
                            </div>
                            <button
                              onClick={() => removeClosePanelProvider(selectedProvider.id)}
                              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                              aria-label="Remove provider"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                })()}

                {/* Summary and Actions */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    Total selected: {currentProviderConfig.closePanelProviders.length} providers
                  </div>
                  <button
                    onClick={handleOpenClosePanelProviderModal}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Modify Provider Selection
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* New: Display Selected Providers for Panelship 'Provider Group' */}
        {currentProviderConfig.panelship === "provider_group" &&
          currentProviderConfig.providerGroupProviders &&
          currentProviderConfig.providerGroupProviders.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                <h5 className="text-md font-medium text-slate-700 mb-4">Selected Providers (Provider Group)</h5>

                {/* Group providers by type */}
                {(() => {
                  const groupedProviders = currentProviderConfig.providerGroupProviders.reduce(
                    (acc: Record<string, Provider[]>, selectedProvider: Provider) => {
                      const type = selectedProvider.type.toUpperCase()
                      if (!acc[type]) acc[type] = []
                      acc[type].push(selectedProvider)
                      return acc
                    },
                    {},
                  )

                  return Object.entries(groupedProviders).map(([type, typeProviders]) => (
                    <div key={type} className="mb-4 last:mb-0">
                      {/* Category Header */}
                      <div className="text-xs font-medium text-gray-600 mb-2 tracking-wide">
                        {type === "CLINIC"
                          ? "CLINICS"
                          : type === "HOSPITAL"
                            ? "HOSPITALS"
                            : type === "PHARMACY"
                              ? "PHARMACIES"
                              : type === "DENTIST"
                                ? "DENTISTS"
                                : type === "PHYSIOTHERAPY"
                                  ? "PHYSIOTHERAPY"
                                  : type}
                      </div>

                      {/* Provider List */}
                      <div className="space-y-2">
                        {typeProviders.map((selectedProvider: Provider) => (
                          <div
                            key={selectedProvider.id}
                            className="bg-white border border-gray-200 rounded p-3 flex justify-between items-start"
                          >
                            <div>
                              <div className="font-medium text-slate-800 text-sm">{selectedProvider.name}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Code: {selectedProvider.code} • {selectedProvider.location}
                              </div>
                            </div>
                            <button
                              onClick={() => removeProviderGroupProvider(selectedProvider.id)}
                              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                              aria-label="Remove provider"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                })()}

                {/* Summary and Actions */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    Total selected: {currentProviderConfig.providerGroupProviders.length} providers
                  </div>
                  <button
                    onClick={handleOpenProviderGroupModal}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Modify Provider Selection
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Display Restricted Providers for Restrict Access */}
        {currentProviderConfig.restrictAccess === "yes" &&
          currentProviderConfig.restrictedProviders &&
          currentProviderConfig.restrictedProviders.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                <h5 className="text-md font-medium text-slate-700 mb-4">Restricted Providers</h5>

                {/* Group providers by type */}
                {(() => {
                  const groupedProviders = currentProviderConfig.restrictedProviders.reduce(
                    (acc: Record<string, Provider[]>, restrictedProvider: Provider) => {
                      const type = restrictedProvider.type.toUpperCase()
                      if (!acc[type]) acc[type] = []
                      acc[type].push(restrictedProvider)
                      return acc
                    },
                    {},
                  )

                  return Object.entries(groupedProviders).map(([type, typeProviders]) => (
                    <div key={type} className="mb-4 last:mb-0">
                      {/* Category Header */}
                      <div className="text-xs font-medium text-gray-600 mb-2 tracking-wide">
                        {type === "CLINIC"
                          ? "CLINICS"
                          : type === "HOSPITAL"
                            ? "HOSPITALS"
                            : type === "PHARMACY"
                              ? "PHARMACIES"
                              : type === "DENTIST"
                                ? "DENTISTS"
                                : type === "PHYSIOTHERAPY"
                                  ? "PHYSIOTHERAPY"
                                  : type}
                      </div>

                      {/* Provider List */}
                      <div className="space-y-2">
                        {typeProviders.map((restrictedProvider: Provider) => (
                          <div
                            key={restrictedProvider.id}
                            className="bg-white border border-gray-200 rounded p-3 flex justify-between items-start"
                          >
                            <div>
                              <div className="font-medium text-slate-800 text-sm">{restrictedProvider.name}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Code: {restrictedProvider.code} • {restrictedProvider.location}
                              </div>
                            </div>
                            <button
                              onClick={() => removeRestrictedProvider(restrictedProvider.id)}
                              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                              aria-label="Remove restricted provider"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                })()}

                {/* Summary and Actions */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    Total restricted: {currentProviderConfig.restrictedProviders.length} providers
                  </div>
                  <button
                    onClick={handleOpenRestrictAccessProviderModal}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Modify Restricted Provider Selection
                  </button>
                </div>
              </div>
            </div>
          )}

        <div className="flex gap-3">
          <Button onClick={handleSaveProviderConfig} className="bg-sky-600 hover:bg-sky-700">
            {isEditing ? "Update Configuration" : "Save Configuration"}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Provider Configuration Listing */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-slate-700 mb-6">Provider Configuration Listing</h4>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Select value={filterProviderType} onValueChange={setFilterProviderType}>
              <SelectTrigger className="w-48 pl-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provider Types</SelectItem>
                <SelectItem value="gp">GP</SelectItem>
                <SelectItem value="sp">SP</SelectItem>
                <SelectItem value="oc">OC</SelectItem>
                <SelectItem value="dt">DT</SelectItem>
                <SelectItem value="hp">HP</SelectItem>
                <SelectItem value="mt">MT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">No.</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Provider Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Panelship</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Restrict Access</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Provider Categories</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Payment Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Access Rule</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.length > 0 ? (
                filteredConfigs.map((config, index) => (
                  <tr key={config.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {config.serviceType ? (
                          config.serviceType
                            .split(", ")
                            .filter(Boolean)
                            .map((type, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {formatServiceType(type)}
                              </Badge>
                            ))
                        ) : (
                          <span className="text-slate-500">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {formatPanelship(config.panelship) || "Not specified"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {config.restrictAccess === "yes" ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {config.providerType ? (
                          config.providerType
                            .split(", ")
                            .filter(Boolean)
                            .map((type, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {formatProviderType(type)}
                              </Badge>
                            ))
                        ) : (
                          <span className="text-slate-500">Not specified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {formatPaymentMethod(config.paymentMethod) || "Not specified"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {formatAccessRule(config.accessRule) || "Not specified"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProviderConfig(config)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50 p-1 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProviderConfig(config)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProviderConfig(config.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded"
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
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No provider configurations saved yet. Add your first configuration above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Count Display */}
        <div className="flex justify-end mt-4">
          <span className="text-sm text-slate-600">
            Showing 1-{filteredConfigs.length} of {filteredConfigs.length} provider configurations
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
      </div>

      {/* Provider Selection Modal for Panelship 'Select Access' */}
      <ProviderSelectionModal
        isOpen={showPanelshipProviderModal}
        onClose={() => setShowPanelshipProviderModal(false)}
        onSave={handleSavePanelshipSelectedProviders}
        initialSelectedProviders={currentProviderConfig.selectedProviders || []}
      />

      {/* Provider Selection Modal for Panelship 'Close Panel' */}
      <ProviderSelectionModal
        isOpen={showClosePanelProviderModal}
        onClose={() => setShowClosePanelProviderModal(false)}
        onSave={handleSaveClosePanelProviders}
        initialSelectedProviders={currentProviderConfig.closePanelProviders || []}
      />

      {/* New: Provider Group Selection Modal for Panelship 'Provider Group' */}
      <ProviderGroupSelectionModal
        isOpen={showProviderGroupModal}
        onClose={() => setShowProviderGroupModal(false)}
        onSave={handleSaveProviderGroupProviders}
        initialSelectedProviders={currentProviderConfig.providerGroupProviders || []}
      />

      {/* Provider Selection Modal for Restrict Access 'Yes' */}
      <ProviderSelectionModal
        isOpen={showRestrictAccessProviderModal}
        onClose={() => setShowRestrictAccessProviderModal(false)}
        onSave={handleSaveRestrictedProviders}
        initialSelectedProviders={currentProviderConfig.restrictedProviders || []}
      />

      {/* View Modal */}
      {selectedProviderConfig && (
        <ProviderConfigViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          providerConfig={selectedProviderConfig}
        />
      )}
    </div>
  )
}
