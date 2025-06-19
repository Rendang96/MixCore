"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PayorListing } from "@/components/payor/payor-listing"
import { CreateNewPayor } from "@/components/payor/create-new-payor"
import { ViewPayor } from "@/components/payor/view-payor"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Search, Download } from "lucide-react"
import { PayorStorage } from "@/lib/payor/payor-storage"
import type { Payor } from "@/lib/payor/payor-storage"

export function PayorSearch() {
  const [view, setView] = useState<"search" | "listing" | "create" | "edit" | "view">("search")
  const [searchTerm, setSearchTerm] = useState("")
  const [payorCodeSearch, setPayorCodeSearch] = useState("")
  const [payors, setPayors] = useState<Payor[]>([])
  const [showResults, setShowResults] = useState(false)
  const [filteredPayors, setFilteredPayors] = useState<Payor[]>([])
  const [editingPayor, setEditingPayor] = useState<Payor | null>(null)
  const [viewingPayor, setViewingPayor] = useState<Payor | null>(null)

  // Handle URL paths and browser history
  useEffect(() => {
    // Parse the current URL to determine the view
    const path = window.location.pathname
    if (path.includes("/payor/create")) {
      setView("create")
    } else if (path.includes("/payor/edit")) {
      // We would need to get the ID from the URL here
      // For now, just set the view to edit
      setView("edit")
    } else if (path.includes("/payor/view")) {
      // We would need to get the ID from the URL here
      // For now, just set the view to view
      setView("view")
    } else if (path.includes("/payor/results")) {
      setShowResults(true)
      setView("search")
    } else if (path.includes("/payor")) {
      setView("search")
    }

    // Handle browser back/forward navigation
    const handlePopState = () => {
      const newPath = window.location.pathname
      if (newPath.includes("/payor/create")) {
        setView("create")
      } else if (newPath.includes("/payor/edit")) {
        setView("edit")
      } else if (newPath.includes("/payor/view")) {
        setView("view")
      } else if (newPath.includes("/payor/results")) {
        setShowResults(true)
        setView("search")
      } else if (newPath.includes("/payor")) {
        setView("search")
        setShowResults(false)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Update URL when view changes
  useEffect(() => {
    let newPath = "/payor"

    if (view === "create") {
      newPath = "/payor/create"
    } else if (view === "edit" && editingPayor) {
      newPath = `/payor/edit/${editingPayor.id}`
    } else if (view === "view" && viewingPayor) {
      newPath = `/payor/view/${viewingPayor.id}`
    } else if (showResults) {
      newPath = "/payor/results"
    }

    // Only update if the path is different
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath)
    }
  }, [view, editingPayor, viewingPayor, showResults])

  // Initialize dummy data on component mount
  useEffect(() => {
    PayorStorage.initializeDummyData()
  }, [])

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigation = (targetView: "search" | "listing") => {
    setView(targetView)
    if (targetView === "search") {
      setShowResults(false)
      window.history.pushState({}, "", "/payor")
    }
    setEditingPayor(null)
    setViewingPayor(null)
  }

  // Breadcrumb items for Payor Search
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Payor",
      onClick: () => handleBreadcrumbNavigation("search"),
    },
    { label: "Payor Search" },
  ]

  // Load payors from storage on component mount
  useEffect(() => {
    const payors = PayorStorage.getAllPayors()
    setPayors(payors)
  }, [])

  const handleSearch = () => {
    // Always set showResults to true and update URL to /payor/results
    setShowResults(true)
    window.history.pushState({}, "", "/payor/results")

    // Filter payors based on search term
    const filtered = payors.filter(
      (payor) =>
        payor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payor.code.toLowerCase().includes(payorCodeSearch.toLowerCase()),
    )

    setFilteredPayors(filtered)
  }

  const handleAddNew = () => {
    setEditingPayor(null)
    setView("create")
    window.history.pushState({}, "", "/payor/create")
  }

  const handleEditPayor = (payor: Payor) => {
    setEditingPayor(payor)
    setView("edit")
    window.history.pushState({}, "", `/payor/edit/${payor.id}`)
  }

  const handleViewPayor = (payor: Payor) => {
    setViewingPayor(payor)
    setView("view")
    window.history.pushState({}, "", `/payor/view/${payor.id}`)
  }

  const handleBack = () => {
    setView("search")
    setShowResults(false)
    setEditingPayor(null)
    setViewingPayor(null)
    window.history.pushState({}, "", "/payor")
  }

  const handleSavePayor = (payor: Payor, navigateBack = false) => {
    try {
      const existingPayor = PayorStorage.getPayorById(payor.id)

      let success = false
      if (existingPayor) {
        success = PayorStorage.updatePayor(payor)
      } else {
        success = PayorStorage.addPayor({ ...payor, status: "Active" })
      }

      if (success) {
        const updatedPayors = PayorStorage.getAllPayors()
        setPayors(updatedPayors)
        console.log("Payor data saved successfully to storage")
      } else {
        throw new Error("Failed to save payor")
      }

      if (navigateBack) {
        setView("search")
        window.history.pushState({}, "", "/payor")
      }
    } catch (error) {
      console.error("Error saving payor:", error)
      alert("Error saving payor data. Please try again.")
    }
  }

  // Render different views based on the current state
  if (view === "create") {
    return <CreateNewPayor onBack={handleBack} onSave={handleSavePayor} />
  }

  if (view === "edit") {
    return <CreateNewPayor onBack={handleBack} onSave={handleSavePayor} initialPayor={editingPayor || undefined} />
  }

  if (view === "view" && viewingPayor) {
    return <ViewPayor payor={viewingPayor} onBack={handleBack} />
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <PageBreadcrumbs items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Payor Search</h2>
      </div>

      {/* Search Form - Always visible */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="payor-name" className="text-sm font-medium text-slate-700">
              Payor Name
            </label>
            <Input
              id="payor-name"
              placeholder="Enter Payor Name"
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="payor-code" className="text-sm font-medium text-slate-700">
              Payor Code
            </label>
            <Input
              id="payor-code"
              placeholder="Enter Payor Code"
              className="w-full"
              value={payorCodeSearch}
              onChange={(e) => setPayorCodeSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleAddNew}>
            Add New
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {/* Results Section - Only visible when showResults is true */}
      {showResults && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Payor Listing</h2>
          <Card className="rounded-lg border bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {payors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>No payor has been created.</p>
                </div>
              ) : filteredPayors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>No payors match your search criteria.</p>
                </div>
              ) : (
                <PayorListing
                  payors={filteredPayors}
                  onAddNew={handleAddNew}
                  onEditPayor={handleEditPayor}
                  onViewPayor={handleViewPayor}
                  onUpdatePayors={(updatedPayors) => {
                    PayorStorage.saveAllPayors(updatedPayors)
                    const newPayorsList = PayorStorage.getAllPayors()
                    setPayors(newPayorsList)
                    setFilteredPayors(updatedPayors)
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
