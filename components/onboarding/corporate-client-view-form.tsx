"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { CorporateClient } from "@/lib/corporate-client/corporate-client-storage"

interface CorporateClientViewFormProps {
  client: CorporateClient
}

export function CorporateClientViewForm({ client }: CorporateClientViewFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const steps = [
    { id: 1, name: "Company" },
    { id: 2, name: "Payor" },
    { id: 3, name: "Product" },
    { id: 4, name: "Policy" },
    { id: 5, name: "Plan" },
    { id: 6, name: "Member" },
    { id: 7, name: "Summary" },
  ]

  const handleBackToListing = () => {
    router.push("/onboarding/corporate-client")
  }

  const handleEdit = () => {
    router.push(`/onboarding/corporate-client/edit/${client.id}`)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {client.companyName}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Code</label>
                <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                  {client.companyCode}
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Payor Information</h2>
            {client.payors && client.payors.length > 0 ? (
              client.payors.map((payor, index) => (
                <div key={payor.id} className="space-y-4">
                  {index > 0 && <div className="border-t pt-4"></div>}
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Payor {index + 1}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payor Name</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {payor.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payor Code</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {payor.code}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Payor Type</div>
                    <div className="text-sm text-gray-700">
                      {payor.payorType === "insurer" ? "Insurer" : "Self-funded/Non-Insurer"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No payors configured</div>
            )}
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Product Information</h2>
            {client.products && client.products.length > 0 ? (
              client.products.map((product, index) => (
                <div key={product.id} className="space-y-4">
                  {index > 0 && <div className="border-t pt-4"></div>}
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Product {index + 1}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Product Name</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {product.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Product Code</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {product.code}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payor Name</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {product.payorName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payor Code</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {product.payorCode}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No products configured</div>
            )}
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Policy Information</h2>
            {client.policies && client.policies.length > 0 ? (
              client.policies.map((policy, index) => (
                <div key={policy.id} className="space-y-4">
                  {index > 0 && <div className="border-t pt-4"></div>}
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Policy {index + 1}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Policy Name</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {policy.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Policy Number</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {policy.code}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Effective Date</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {policy.effectiveDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {policy.expiryDate}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Product Name</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {policy.productName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Product Code</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {policy.productCode}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No policies configured</div>
            )}
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Plan Information</h2>
            {client.plans && client.plans.length > 0 ? (
              client.plans.map((plan, index) => (
                <div key={plan.id} className="space-y-4 border rounded-lg p-4">
                  {index > 0 && <div className="border-t pt-4"></div>}
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Plan {index + 1}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Plan Name</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {plan.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Plan Code</label>
                      <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {plan.code}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Plan Description</label>
                    <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                      {plan.description}
                    </div>
                  </div>

                  {/* Plan Policies */}
                  {plan.policies && plan.policies.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Associated Policies</h4>
                      {plan.policies.map((policy, policyIndex) => (
                        <div key={policy.id} className="border rounded-md p-3 mb-2 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs font-medium text-gray-500">Policy No.:</span>
                              <p className="text-sm">{policy.policyNo}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-500">Policy Name:</span>
                              <p className="text-sm">{policy.policyName}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-500">Effective Date:</span>
                              <p className="text-sm">{policy.effectiveDate}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-500">Expiry Date:</span>
                              <p className="text-sm">{policy.expiryDate}</p>
                            </div>
                          </div>
                          {policy.serviceTypes && policy.serviceTypes.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500">Service Types:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {policy.serviceTypes.map((type) => (
                                  <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No plans configured</div>
            )}
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Member Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium">Total Members: {client.memberCount}</h3>
              </div>
              {client.members && client.members.length > 0 ? (
                <div className="space-y-4">
                  {client.members.map((member, index) => (
                    <div key={member.id} className="border rounded-md p-4 bg-gray-50">
                      <h4 className="text-sm font-medium mb-2">Member {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Person ID:</span>
                          <p className="text-sm">{member.personId}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Person Name:</span>
                          <p className="text-sm">{member.personName}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">ID Number:</span>
                          <p className="text-sm">{member.idNumber}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Person Type:</span>
                          <p className="text-sm">{member.personType}</p>
                        </div>
                        {member.designation && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">Designation:</span>
                            <p className="text-sm">{member.designation}</p>
                          </div>
                        )}
                        {member.jobGrade && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">Job Grade:</span>
                            <p className="text-sm">{member.jobGrade}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  This corporate client has {client.memberCount} member(s) enrolled in the plan.
                </div>
              )}
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-md font-semibold mb-4 text-blue-600">Corporate Client Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Company Name:</span>
                  <p className="text-sm">{client.companyName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Company Code:</span>
                  <p className="text-sm">{client.companyCode}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Payors:</span>
                  <p className="text-sm">{client.payors?.length || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Products:</span>
                  <p className="text-sm">{client.products?.length || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Policies:</span>
                  <p className="text-sm">{client.policies?.length || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Total Plans:</span>
                  <p className="text-sm">{client.plans?.length || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Members:</span>
                  <p className="text-sm">{client.memberCount}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <p className="text-sm">{client.status}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Created Date:</span>
                  <p className="text-sm">{client.createdDate}</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <button onClick={handleBackToListing} className="hover:text-gray-700 transition-colors">
            Onboarding
          </button>
          <span>{">"}</span>
          <button onClick={handleBackToListing} className="hover:text-gray-700 transition-colors">
            Corporate Client
          </button>
          <span>{">"}</span>
          <span className="text-gray-900">View Corporate Client</span>
        </nav>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">View Corporate Client - {client.companyName}</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleBackToListing}>
            Back to Listing
          </Button>
          <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
            Edit
          </Button>
        </div>
      </div>

      {/* Horizontal Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-medium cursor-pointer ${
                  currentStep === step.id ? "bg-blue-600" : "bg-green-500"
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                {step.id}
              </div>
              <span className="font-medium text-sm mt-2 text-center">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <Card className="p-6 border">
        {renderStepContent()}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 mt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
            disabled={currentStep === 7}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  )
}
