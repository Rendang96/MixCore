"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { PolicyListing } from "./policy-listing"
import { ViewPolicy } from "./view-policy"
import { EditPolicy } from "./edit-policy"
import {
  getPolicies,
  deletePolicy,
  saveBasicPolicyInfo,
  initializeDummyPolicyData,
  prepareCopiedPolicy,
  type CompletePolicy,
} from "@/lib/policy/policy-storage"

export function PolicyResultsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [policies, setPolicies] = useState<CompletePolicy[]>([])
  const [currentView, setCurrentView] = useState<"list" | "view" | "edit">("list")
  const [selectedPolicy, setSelectedPolicy] = useState<CompletePolicy | null>(null)

  const policyName = searchParams.get("policyName") || ""
  const policyNumber = searchParams.get("policyNumber") || ""

  useEffect(() => {
    initializeDummyPolicyData() // Ensure dummy data is initialized
    fetchAndFilterPolicies()
  }, [policyName, policyNumber, currentView]) // Re-fetch when search params or view changes

  const fetchAndFilterPolicies = () => {
    const allPolicies = getPolicies()
    const filtered = allPolicies.filter((policy) => {
      const matchesName = !policyName || policy.policyName.toLowerCase().includes(policyName.toLowerCase())
      const matchesNumber = !policyNumber || policy.policyNumber.toLowerCase().includes(policyNumber.toLowerCase())
      return matchesName && matchesNumber
    })
    setPolicies(filtered)
  }

  const handleViewPolicy = (policy: CompletePolicy) => {
    setSelectedPolicy(policy)
    setCurrentView("view")
    router.push(`/policy/view/${policy.id}`)
  }

  const handleEditPolicy = (policy: CompletePolicy) => {
    setSelectedPolicy(policy)
    setCurrentView("edit")
    router.push(`/policy/edit/${policy.id}`)
  }

  const handleDeletePolicy = (policyId: string) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      deletePolicy(policyId)
      fetchAndFilterPolicies() // Refresh the list after deletion
    }
  }

  const handleCopyPolicy = (policyId: string) => {
    const copiedPolicy = prepareCopiedPolicy(policyId)
    if (copiedPolicy) {
      // Store the copied policy in localStorage to be picked up by CreateNewPolicy
      localStorage.setItem("policyToInitialize", JSON.stringify(copiedPolicy))
      router.push("/policy/create")
    } else {
      alert("Failed to copy policy. Policy not found.")
    }
  }

  const handleSavePolicy = (policy: CompletePolicy) => {
    saveBasicPolicyInfo(policy)
    setCurrentView("list")
    router.push(`/policy/results?policyName=${policyName}&policyNumber=${policyNumber}`) // Go back to results with current search
  }

  const handleCancel = () => {
    setCurrentView("list")
    router.push(`/policy/results?policyName=${policyName}&policyNumber=${policyNumber}`) // Go back to results with current search
  }

  const onBreadcrumbClick = (path: string) => {
    if (path === "home") {
      router.push("/")
    } else if (path === "policy") {
      router.push("/policy")
    } else if (path === "policy-results") {
      setCurrentView("list")
      router.push(`/policy/results?policyName=${policyName}&policyNumber=${policyNumber}`)
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case "view":
        return selectedPolicy ? (
          <ViewPolicy
            policy={selectedPolicy}
            onBack={handleCancel}
            onEdit={() => handleEditPolicy(selectedPolicy)}
            onBreadcrumbClick={onBreadcrumbClick}
          />
        ) : (
          <div>Policy not found.</div>
        )
      case "edit":
        return selectedPolicy ? (
          <EditPolicy
            policy={selectedPolicy}
            onSave={handleSavePolicy}
            onCancel={handleCancel}
            onBreadcrumbClick={onBreadcrumbClick}
          />
        ) : (
          <div>Policy not found.</div>
        )
      case "list":
      default:
        return (
          <>
            <div className="mb-6">
              <PageBreadcrumbs
                items={[
                  { label: "Home", href: "/", isHome: true, onClick: () => onBreadcrumbClick("home") },
                  { label: "Policy", href: "#", onClick: () => onBreadcrumbClick("policy") },
                  { label: "Search Policy", href: "/policy", onClick: () => onBreadcrumbClick("policy") },
                  { label: "Policy Results" },
                ]}
              />
              <h1 className="text-2xl font-semibold mt-4">Policy Results</h1>
            </div>
            <PolicyListing
              policies={policies}
              onView={handleViewPolicy}
              onEdit={handleEditPolicy}
              onDelete={handleDeletePolicy}
              onCopy={handleCopyPolicy} // Pass the new copy handler
            />
          </>
        )
    }
  }

  return <div className="w-full">{renderContent()}</div>
}
