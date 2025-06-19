"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Phone, Clock } from "lucide-react"

interface Provider {
  id: string
  name: string
  code: string
  location: string
  phone: string
  hours: string
  status: "Active" | "Inactive"
  type: "clinic" | "hospital" | "pharmacy" | "dentist" | "physiotherapy"
}

interface ProviderSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedProviders: Provider[]) => void
  initialSelectedProviders?: Provider[]
}

const mockProviders: Provider[] = [
  {
    id: "fhc002",
    name: "Family Health Center",
    code: "FHC002",
    location: "Suburbs, Selangor",
    phone: "+1-555-0102",
    hours: "9AM-5PM",
    status: "Active",
    type: "clinic",
  },
  {
    id: "qcc003",
    name: "Quick Care Clinic",
    code: "QCC003",
    location: "Mall District, Kuala Lumpur",
    phone: "+1-555-0103",
    hours: "10AM-8PM",
    status: "Active",
    type: "clinic",
  },
  {
    id: "chc004",
    name: "Community Health Clinic",
    code: "CHC004",
    location: "Downtown, Kuala Lumpur",
    phone: "+1-555-0104",
    hours: "8AM-6PM",
    status: "Active",
    type: "clinic",
  },
  {
    id: "mgh001",
    name: "Metro General Hospital",
    code: "MGH001",
    location: "Central, Kuala Lumpur",
    phone: "+1-555-0201",
    hours: "24 Hours",
    status: "Active",
    type: "hospital",
  },
  {
    id: "sgh002",
    name: "Selangor General Hospital",
    code: "SGH002",
    location: "Shah Alam, Selangor",
    phone: "+1-555-0202",
    hours: "24 Hours",
    status: "Active",
    type: "hospital",
  },
  {
    id: "cp001",
    name: "CarePharm Pharmacy",
    code: "CP001",
    location: "KLCC, Kuala Lumpur",
    phone: "+1-555-0301",
    hours: "9AM-9PM",
    status: "Active",
    type: "pharmacy",
  },
  {
    id: "hp002",
    name: "HealthPlus Pharmacy",
    code: "HP002",
    location: "Petaling Jaya, Selangor",
    phone: "+1-555-0302",
    hours: "8AM-10PM",
    status: "Active",
    type: "pharmacy",
  },
  {
    id: "dc001",
    name: "Dental Care Center",
    code: "DC001",
    location: "Bangsar, Kuala Lumpur",
    phone: "+1-555-0401",
    hours: "9AM-6PM",
    status: "Active",
    type: "dentist",
  },
  {
    id: "sdc002",
    name: "Smile Dental Clinic",
    code: "SDC002",
    location: "Subang Jaya, Selangor",
    phone: "+1-555-0402",
    hours: "10AM-7PM",
    status: "Active",
    type: "dentist",
  },
  {
    id: "pc001",
    name: "PhysioTherapy Center",
    code: "PC001",
    location: "Mont Kiara, Kuala Lumpur",
    phone: "+1-555-0501",
    hours: "8AM-8PM",
    status: "Active",
    type: "physiotherapy",
  },
]

export function ProviderSelectionModal({
  isOpen,
  onClose,
  onSave,
  initialSelectedProviders = [],
}: ProviderSelectionModalProps) {
  const [activeTab, setActiveTab] = useState<Provider["type"]>("clinic")
  const [searchQuery, setSearchQuery] = useState("")
  const [providerGroupSearch, setProviderGroupSearch] = useState("")
  const [selectedProviderGroup, setSelectedProviderGroup] = useState("")
  const mockProviderGroups = ["FGV Group", "UMW Group", "TM Group"]
  const filteredProviderGroups = providerGroupSearch
    ? mockProviderGroups.filter((group) => group.toLowerCase().includes(providerGroupSearch.toLowerCase()))
    : []
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>(initialSelectedProviders)
  const [selectionsByType, setSelectionsByType] = useState<Record<Provider["type"], Provider[]>>({
    clinic: initialSelectedProviders.filter((p) => p.type === "clinic"),
    hospital: initialSelectedProviders.filter((p) => p.type === "hospital"),
    pharmacy: initialSelectedProviders.filter((p) => p.type === "pharmacy"),
    dentist: initialSelectedProviders.filter((p) => p.type === "dentist"),
    physiotherapy: initialSelectedProviders.filter((p) => p.type === "physiotherapy"),
  })

  const tabs = [
    { id: "clinic", label: "Clinics" },
    { id: "hospital", label: "Hospitals" },
    { id: "pharmacy", label: "Pharmacies" },
    { id: "dentist", label: "Dentists" },
    { id: "physiotherapy", label: "Physiotherapy" },
  ]

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesTab = provider.type === activeTab
    const matchesSearch =
      searchQuery === "" ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const handleProviderToggle = (provider: Provider) => {
    setSelectedProviders((prev) => {
      const isSelected = prev.some((p) => p.id === provider.id)
      const newSelection = isSelected ? prev.filter((p) => p.id !== provider.id) : [...prev, provider]

      // Update selections by type
      setSelectionsByType((current) => ({
        ...current,
        [provider.type]: isSelected
          ? current[provider.type].filter((p) => p.id !== provider.id)
          : [...current[provider.type], provider],
      }))

      return newSelection
    })
  }

  const isProviderSelected = (providerId: string) => {
    return selectedProviders.some((p) => p.id === providerId)
  }

  const handleSaveAndNext = () => {
    // Find the current tab index
    const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)

    // If this is the last tab, save and close
    if (currentTabIndex === tabs.length - 1) {
      onSave(selectedProviders)
      onClose()
      return
    }

    // Otherwise, move to the next tab
    const nextTab = tabs[currentTabIndex + 1].id as Provider["type"]
    setActiveTab(nextTab)
    setSearchQuery("") // Reset search when changing tabs
  }

  const handleFinalSave = () => {
    onSave(selectedProviders)
    onClose()
  }

  // Get the current tab's selected providers count
  const currentTabSelectedCount = selectionsByType[activeTab]?.length || 0

  // Determine if we're on the last tab
  const isLastTab = activeTab === tabs[tabs.length - 1].id

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <div>
            <DialogTitle className="text-xl font-semibold text-slate-800">Provider Selection</DialogTitle>
            <p className="text-sm text-slate-600 mt-1">
              Select healthcare providers for your plan. Choose from clinics, hospitals, pharmacies, dentists, and
              physiotherapy centers.
            </p>
            <div className="mt-4 relative">
              <label htmlFor="provider-group" className="text-sm font-medium text-slate-700 block mb-1">
                Provider Group
              </label>
              <Input
                id="provider-group"
                placeholder="Enter provider group name..."
                value={selectedProviderGroup || providerGroupSearch}
                onChange={(e) => {
                  setProviderGroupSearch(e.target.value)
                  setSelectedProviderGroup("") // Clear selected group when typing
                }}
                className="w-full"
              />
              {providerGroupSearch && filteredProviderGroups.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredProviderGroups.map((group) => (
                    <div
                      key={group}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedProviderGroup(group) // Set the selected group
                        setProviderGroupSearch("") // Clear the search query to hide suggestions
                      }}
                    >
                      {group}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b flex-shrink-0">
            <div className="flex px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as Provider["type"])
                    setSearchQuery("")
                  }}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                  {selectionsByType[tab.id as Provider["type"]]?.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {selectionsByType[tab.id as Provider["type"]].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-6 pb-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by name, code, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Provider List - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4 pb-4">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Checkbox
                    checked={isProviderSelected(provider.id)}
                    onCheckedChange={() => handleProviderToggle(provider)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-800">{provider.name}</h3>
                      <Badge
                        variant={provider.status === "Active" ? "default" : "secondary"}
                        className={provider.status === "Active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {provider.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">Code: {provider.code}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{provider.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{provider.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProviders.length === 0 && (
                <div className="text-center py-8 text-slate-500">No providers found matching your search criteria.</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="border-t p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-slate-600">
                {currentTabSelectedCount} provider{currentTabSelectedCount !== 1 ? "s" : ""} selected in this tab
              </p>
              <p className="text-sm text-slate-600">
                {selectedProviders.length} total provider{selectedProviders.length !== 1 ? "s" : ""} selected
              </p>
            </div>
            <div className="flex space-x-3">
              {isLastTab && (
                <Button onClick={handleFinalSave} className="bg-blue-600 hover:bg-blue-700">
                  Save & Close
                </Button>
              )}
              {!isLastTab && (
                <Button onClick={handleSaveAndNext} className="bg-blue-600 hover:bg-blue-700">
                  Save & Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
