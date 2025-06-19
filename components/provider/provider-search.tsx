"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProviderListing } from "./provider-listing"
import { AddNewProvider } from "./add-new-provider"
import { searchProviders } from "@/lib/provider/provider-storage"
import type { Provider } from "@/lib/provider/provider-storage"

export function ProviderSearch() {
  const [searchFilters, setSearchFilters] = useState({
    providerName: "",
    providerCode: "",
    providerType: "",
    specialization: "",
    status: "",
  })
  const [searchResults, setSearchResults] = useState<Provider[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSearch = () => {
    const results = searchProviders(searchFilters)
    setSearchResults(results)
    setShowResults(true)
    setShowAddForm(false)
  }

  const handleClear = () => {
    setSearchFilters({
      providerName: "",
      providerCode: "",
      providerType: "",
      specialization: "",
      status: "",
    })
    setSearchResults([])
    setShowResults(false)
  }

  const handleAddNew = () => {
    setShowAddForm(true)
    setShowResults(false)
  }

  const handleProviderAdded = () => {
    setShowAddForm(false)
    // Refresh search results if we were showing results
    if (showResults) {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="providerName">Provider Name</Label>
              <Input
                id="providerName"
                value={searchFilters.providerName}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, providerName: e.target.value }))}
                placeholder="Enter provider name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerCode">Provider Code</Label>
              <Input
                id="providerCode"
                value={searchFilters.providerCode}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, providerCode: e.target.value }))}
                placeholder="Enter provider code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerType">Provider Type</Label>
              <Select
                value={searchFilters.providerType}
                onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, providerType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                  <SelectItem value="Diagnostic Center">Diagnostic Center</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Specialist">Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={searchFilters.specialization}
                onChange={(e) => setSearchFilters((prev) => ({ ...prev, specialization: e.target.value }))}
                placeholder="Enter specialization"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={searchFilters.status}
                onValueChange={(value) => setSearchFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
            <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
              Add New Provider
            </Button>
          </div>
        </CardContent>
      </Card>

      {showAddForm && <AddNewProvider onCancel={() => setShowAddForm(false)} onProviderAdded={handleProviderAdded} />}

      {showResults && <ProviderListing providers={searchResults} onProviderUpdated={handleSearch} />}
    </div>
  )
}
