"use client"

import { useState, useEffect } from "react"
import { SearchIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { PolicyListing } from "./policy-listing"
import { CreateNewPolicy } from "./create-new-policy"
import { ViewPolicy } from "./view-policy"
import { EditPolicy } from "./edit-policy"
import {
  getPolicies,
  deletePolicy,
  saveBasicPolicyInfo,
  initializeDummyPolicyData,
  type CompletePolicy,
} from "@/lib/policy/policy-storage"

// Define policy type
export interface Policy {
  id: string
  policyNumber: string
  policyName: string
  product: string
  fundingType: string
  policyTerm: string
  effectiveDate: string
  expiryDate: string
  payor: string
  status: string
}

export function PolicySearch() {
  // State for search fields
  const [policyNumber, setPolicyNumber] = useState("")
  const [policyName, setPolicyName] = useState("")

  // State for policies
  const [policies, setPolicies] = useState<CompletePolicy[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  // State for view management
  const [currentView, setCurrentView] = useState<"search" | "create" | "view" | "edit">("search")
  const [selectedPolicy, setSelectedPolicy] = useState<CompletePolicy | null>(null)

  // Handle URL paths and browser history
  useEffect(() => {
    // Parse the current URL to determine the view
    const path = window.location.pathname
    if (path.includes("/policy/create")) {
      setCurrentView("create")
    } else if (path.includes("/policy/edit")) {
      // We would need to get the ID from the URL here
      // For now, just set the view to edit
      setCurrentView("edit")
    } else if (path.includes("/policy/view")) {
      // We would need to get the ID from the URL here
      // For now, just set the view to view
      setCurrentView("view")
    } else if (path.includes("/policy")) {
      setCurrentView("search")
    }

    // Handle browser back/forward navigation
    const handlePopState = () => {
      const newPath = window.location.pathname
      if (newPath.includes("/policy/create")) {
        setCurrentView("create")
      } else if (newPath.includes("/policy/edit")) {
        setCurrentView("edit")
      } else if (newPath.includes("/policy/view")) {
        setCurrentView("view")
      } else if (newPath.includes("/policy")) {
        setCurrentView("search")
        setSearchPerformed(false)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Update URL when view changes
  useEffect(() => {
    let newPath = "/policy"

    if (currentView === "create") {
      newPath = "/policy/create"
    } else if (currentView === "edit" && selectedPolicy) {
      newPath = `/policy/edit`
    } else if (currentView === "view" && selectedPolicy) {
      newPath = `/policy/view/${selectedPolicy.id}`
    }

    // Only update if the path is different
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath)
    }
  }, [currentView, selectedPolicy])

  // Load policies from localStorage on component mount
  useEffect(() => {
    // Initialize dummy data if no policies exist
    initializeDummyPolicyData()

    setPolicies(getPolicies())
  }, [])

  // Handle search
  const handleSearch = () => {
    setSearchPerformed(true)
    window.history.pushState({}, "", "/policy/results")

    // Get the latest policies from local storage
    const allPolicies = getPolicies()

    // Filter policies based on search criteria
    const filteredPolicies = allPolicies.filter((policy) => {
      const matchesName = !policyName || policy.policyName.toLowerCase().includes(policyName.toLowerCase())
      const matchesNumber = !policyNumber || policy.policyNumber.toLowerCase().includes(policyNumber.toLowerCase())
      return matchesName && matchesNumber
    })

    setPolicies(filteredPolicies)
  }

  // Handle create new policy
  const handleCreateNew = () => {
    setCurrentView("create")
    window.history.pushState({}, "", "/policy/create")
  }

  // Handle back to search
  const handleBackToSearch = () => {
    setCurrentView("search")
    // Refresh the search results
    setSearchPerformed(true)
    setPolicies(getPolicies())
    window.history.pushState({}, "", "/policy")
  }

  // Handle save policy
  const handleSavePolicy = (policy: CompletePolicy) => {
    // Save the policy to local storage
    saveBasicPolicyInfo(policy)

    // After saving, refresh the policies list
    setPolicies(getPolicies())
    setCurrentView("search")
    setSearchPerformed(true)
    window.history.pushState({}, "", "/policy")
  }

  // Handle view policy
  const handleViewPolicy = (policy: CompletePolicy) => {
    setSelectedPolicy(policy)
    setCurrentView("view")
    window.history.pushState({}, "", `/policy/view/${policy.id}`)
  }

  // Handle edit policy
  const handleEditPolicy = (policy: CompletePolicy) => {
    setSelectedPolicy(policy)
    setCurrentView("edit")
    window.history.pushState({}, "", `/policy/edit`)
  }

  // Handle delete policy
  const handleDeletePolicy = (policyId: string) => {
    deletePolicy(policyId)
    setPolicies(getPolicies())
  }

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigation = (path: string) => {
    if (path === "home") {
      // Navigate to home
      window.location.href = "/"
    } else if (path === "policy") {
      setCurrentView("search")
      window.history.pushState({}, "", "/policy")
    }
  }

  // Render the appropriate view
  const renderView = () => {
    switch (currentView) {
      case "create":
        return (
          <CreateNewPolicy
            onSave={handleSavePolicy}
            onCancel={handleBackToSearch}
            onBreadcrumbClick={handleBreadcrumbNavigation}
          />
        )
      case "view":
        return (
          <ViewPolicy
            policy={selectedPolicy!}
            onBack={handleBackToSearch}
            onEdit={() => handleEditPolicy(selectedPolicy!)}
            onBreadcrumbClick={handleBreadcrumbNavigation}
          />
        )
      case "edit":
        return (
          <EditPolicy
            policy={selectedPolicy!}
            onSave={handleSavePolicy}
            onCancel={handleBackToSearch}
            onBreadcrumbClick={handleBreadcrumbNavigation}
          />
        )
      default:
        return (
          <>
            <div className="mb-6">
              <PageBreadcrumbs
                items={[
                  { label: "Home", href: "/", isHome: true, onClick: () => handleBreadcrumbNavigation("home") },
                  { label: "Policy", href: "#", onClick: () => handleBreadcrumbNavigation("policy") },
                  { label: "Search Policy" },
                ]}
              />
              <h1 className="text-xl font-semibold mt-4">Search Policy</h1>
            </div>

            <Card className="rounded-lg border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="policyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Name
                    </label>
                    <Input
                      id="policyName"
                      value={policyName}
                      onChange={(e) => setPolicyName(e.target.value)}
                      placeholder="Enter Policy Name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Number
                    </label>
                    <Input
                      id="policyNumber"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="Enter Policy Number"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button onClick={handleCreateNew} className="bg-sky-600 hover:bg-sky-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                  <Button onClick={handleSearch} className="bg-sky-600 hover:bg-sky-700">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {searchPerformed && (
              <PolicyListing
                policies={policies}
                onView={handleViewPolicy}
                onEdit={handleEditPolicy}
                onDelete={handleDeletePolicy}
              />
            )}
          </>
        )
    }
  }

  return <div className="w-full">{renderView()}</div>
}
