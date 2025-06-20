"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MapPin, Phone, Clock, X } from "lucide-react"

interface Provider {
  id: string
  name: string
  code: string
  location: string
  phone: string
  hours: string
  status: string
  type: string
  groupId: string
}

interface ProviderGroup {
  id: string
  name: string
  providerCount: number
  providers: Provider[]
}

interface ProviderGroupSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (selectedProviders: Provider[]) => void
  initialSelectedProviders?: Provider[]
}

// Mock data for provider groups
const mockProviderGroups: ProviderGroup[] = [
  {
    id: "fgv",
    name: "FGV Group",
    providerCount: 3,
    providers: [
      {
        id: "fgv-1",
        name: "Family Health Center",
        code: "FHC002",
        type: "Clinic",
        location: "Suburbs, Selangor",
        phone: "+1-555-0102",
        hours: "9AM-5PM",
        status: "Active",
        groupId: "fgv",
      },
      {
        id: "fgv-2",
        name: "FGV Medical Centre",
        code: "FMC001",
        type: "Hospital",
        location: "Kuala Lumpur",
        phone: "+1-555-0103",
        hours: "24 Hours",
        status: "Active",
        groupId: "fgv",
      },
      {
        id: "fgv-3",
        name: "FGV Specialist Clinic",
        code: "FSC001",
        type: "Clinic",
        location: "Petaling Jaya",
        phone: "+1-555-0104",
        hours: "8AM-6PM",
        status: "Active",
        groupId: "fgv",
      },
    ],
  },
  {
    id: "umw",
    name: "UMW Group",
    providerCount: 2,
    providers: [
      {
        id: "umw-1",
        name: "Quick Care Clinic",
        code: "QCC003",
        type: "Clinic",
        location: "Mall District, Kuala Lumpur",
        phone: "+1-555-0103",
        hours: "10AM-8PM",
        status: "Active",
        groupId: "umw",
      },
      {
        id: "umw-2",
        name: "UMW Healthcare",
        code: "UHC001",
        type: "Hospital",
        location: "Shah Alam",
        phone: "+1-555-0105",
        hours: "24 Hours",
        status: "Active",
        groupId: "umw",
      },
    ],
  },
  {
    id: "tm",
    name: "TM Group",
    providerCount: 2,
    providers: [
      {
        id: "tm-1",
        name: "Community Health Clinic",
        code: "CHC004",
        type: "Clinic",
        location: "Downtown, Kuala Lumpur",
        phone: "+1-555-0104",
        hours: "8AM-6PM",
        status: "Active",
        groupId: "tm",
      },
      {
        id: "tm-2",
        name: "TM Wellness Center",
        code: "TWC001",
        type: "Clinic",
        location: "Cyberjaya",
        phone: "+1-555-0106",
        hours: "9AM-7PM",
        status: "Active",
        groupId: "tm",
      },
    ],
  },
  {
    id: "genting",
    name: "Genting Group",
    providerCount: 1,
    providers: [
      {
        id: "genting-1",
        name: "Genting Medical Centre",
        code: "GMC001",
        type: "Hospital",
        location: "Genting Highlands",
        phone: "+1-555-0107",
        hours: "24 Hours",
        status: "Active",
        groupId: "genting",
      },
    ],
  },
  {
    id: "public-bank",
    name: "Public Bank Group",
    providerCount: 1,
    providers: [
      {
        id: "pb-1",
        name: "Public Bank Medical Centre",
        code: "PBMC001",
        type: "Clinic",
        location: "Kuala Lumpur",
        phone: "+1-555-0108",
        hours: "9AM-5PM",
        status: "Active",
        groupId: "public-bank",
      },
    ],
  },
]

export function ProviderGroupSelectionModal({
  isOpen,
  onClose,
  onSave,
  initialSelectedProviders = [],
}: ProviderGroupSelectionModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>(initialSelectedProviders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGroup, setFilterGroup] = useState("all")

  // Initialize selected groups based on initial selected providers
  useEffect(() => {
    const groupIds = [...new Set(initialSelectedProviders.map((p) => p.groupId))]
    setSelectedGroups(groupIds)
  }, [initialSelectedProviders])

  // Get all providers from selected groups
  const getProvidersFromSelectedGroups = () => {
    return mockProviderGroups.filter((group) => selectedGroups.includes(group.id)).flatMap((group) => group.providers)
  }

  // Filter providers based on search and group filter
  const getFilteredProviders = () => {
    let providers = getProvidersFromSelectedGroups()

    if (filterGroup !== "all") {
      providers = providers.filter((provider) => provider.groupId === filterGroup)
    }

    if (searchTerm) {
      providers = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return providers
  }

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) => {
      const newSelectedGroups = prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]

      // If deselecting a group, remove its providers from selected providers
      if (prev.includes(groupId)) {
        setSelectedProviders((current) => current.filter((provider) => provider.groupId !== groupId))
      }

      return newSelectedGroups
    })
  }

  const handleProviderToggle = (provider: Provider) => {
    setSelectedProviders((prev) => {
      const isSelected = prev.some((p) => p.id === provider.id)
      if (isSelected) {
        return prev.filter((p) => p.id !== provider.id)
      } else {
        return [...prev, provider]
      }
    })
  }

  const handleSave = () => {
    onSave(selectedProviders)
    onClose()
  }

  const handleCancel = () => {
    setSelectedGroups([])
    setSelectedProviders(initialSelectedProviders)
    setSearchTerm("")
    setFilterGroup("all")
    onClose()
  }

  const getGroupBadgeColor = (groupId: string) => {
    const colors: { [key: string]: string } = {
      fgv: "bg-blue-100 text-blue-800",
      umw: "bg-green-100 text-green-800",
      tm: "bg-purple-100 text-purple-800",
      genting: "bg-orange-100 text-orange-800",
      "public-bank": "bg-red-100 text-red-800",
    }
    return colors[groupId] || "bg-gray-100 text-gray-800"
  }

  const getGroupName = (groupId: string) => {
    return mockProviderGroups.find((g) => g.id === groupId)?.name || groupId
  }

  const filteredProviders = getFilteredProviders()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">Provider Panel Catalogue Selection</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Select providers by panel catalogue affiliation. You can choose entire catalogues or individual
                providers within catalogues.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* Left Panel - Provider Groups */}
          <div className="w-80 border-r bg-gray-50 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Provider Panel Catalogues</h3>
            <div className="space-y-2">
              {mockProviderGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleGroupToggle(group.id)}
                >
                  <Checkbox checked={selectedGroups.includes(group.id)} onChange={() => handleGroupToggle(group.id)} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{group.name}</div>
                    <div className="text-xs text-gray-500">{group.providerCount} providers</div>
                  </div>
                  <div className="text-xs text-gray-400">👥</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Provider Details */}
          <div className="flex-1 flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b bg-white">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select value={filterGroup} onValueChange={setFilterGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by catalogue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Catalogues</SelectItem>
                      {mockProviderGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Provider List */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedGroups.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👥</div>
                    <p>Select provider panel catalogues from the left panel to view providers</p>
                  </div>
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No providers found matching your criteria</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-start space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleProviderToggle(provider)}
                    >
                      <Checkbox
                        checked={selectedProviders.some((p) => p.id === provider.id)}
                        onChange={() => handleProviderToggle(provider)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className={getGroupBadgeColor(provider.groupId)}>
                              {getGroupName(provider.groupId)}
                            </Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {provider.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Code: {provider.code} • Type: {provider.type}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedProviders.length} providers selected • Catalogues: {selectedGroups.length}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
