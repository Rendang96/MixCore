"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { ArrowLeft, Edit } from "lucide-react"
import type { CompletePolicy } from "@/lib/policy/policy-storage"
import { PolicyRuleTab } from "./policy-rule-tab"
import { ServiceTypeTab } from "./service-type-tab"
import { ContactInformationTab } from "./contact-information-tab"

interface ViewPolicyProps {
  policy: CompletePolicy
  onBack: () => void
  onEdit: () => void
  onBreadcrumbClick: (path: string) => void
}

export function ViewPolicy({ policy, onBack, onEdit, onBreadcrumbClick }: ViewPolicyProps) {
  const [activeTab, setActiveTab] = useState("basic-info")

  // Dummy handlers for view mode (no actual saving in view mode)
  const handleSave = () => {
    console.log("View mode - no save action")
  }

  const handleCancel = () => {
    console.log("View mode - no cancel action")
  }

  return (
    <div>
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: "/", isHome: true, onClick: () => onBreadcrumbClick("home") },
            { label: "Policy", href: "#", onClick: () => onBreadcrumbClick("policy") },
            { label: "View Policy" },
          ]}
        />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-xl font-semibold">View Policy</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={onEdit} className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
          <TabsTrigger value="policy-rule">Policy Rule</TabsTrigger>
          <TabsTrigger value="service-type">Service Type</TabsTrigger>
          <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Policy Number</h3>
                  <p className="text-base">{policy.policyNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Policy Name</h3>
                  <p className="text-base">{policy.policyName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Product</h3>
                  <p className="text-base">
                    {policy.productName} ({policy.productCode})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Funding Type</h3>
                  <p className="text-base">{policy.fundingType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Policy Term</h3>
                  <p className="text-base">{policy.policyTerm}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Effective Date</h3>
                  <p className="text-base">{policy.effectiveDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Expiry Date</h3>
                  <p className="text-base">{policy.expiryDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payor</h3>
                  <p className="text-base">{policy.payor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      policy.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : policy.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {policy.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy-rule">
          <PolicyRuleTab
            policyId={policy.id}
            onSave={handleSave}
            onCancel={handleCancel}
            initialData={policy.policyRule}
          />
        </TabsContent>

        <TabsContent value="service-type">
          <ServiceTypeTab
            policyId={policy.id}
            onSave={handleSave}
            onCancel={handleCancel}
            initialData={policy.serviceType}
          />
        </TabsContent>

        <TabsContent value="contact-info">
          <ContactInformationTab
            policyId={policy.id}
            onSave={handleSave}
            onCancel={handleCancel}
            initialData={policy.contactInfo}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
