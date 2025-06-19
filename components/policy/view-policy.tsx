"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Pencil } from "lucide-react"
import type { CompletePolicy } from "@/lib/policy/policy-storage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ViewPolicyProps {
  policy: CompletePolicy
  onBack: () => void
  onEdit: () => void
  onBreadcrumbClick: (path: string) => void
}

export function ViewPolicy({ policy, onBack, onEdit, onBreadcrumbClick }: ViewPolicyProps) {
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">View Policy</h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={onEdit} className="bg-sky-600 hover:bg-sky-700">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="rules">Policy Rules</TabsTrigger>
          <TabsTrigger value="services">Service Types</TabsTrigger>
          <TabsTrigger value="contacts">Contact Information</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card className="rounded-lg border bg-white p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold mb-6">Policy Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-700">Policy Number</p>
                  <p className="mt-1">{policy.policyNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Policy Name</p>
                  <p className="mt-1">{policy.policyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Policy Term/Period</p>
                  <p className="mt-1">{policy.policyTerm}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Funding Type</p>
                  <p className="mt-1">{policy.fundingType}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">Policy Effective Date</p>
                  <p className="mt-1">{policy.effectiveDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Policy Expiry Date</p>
                  <p className="mt-1">{policy.expiryDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <p className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        policy.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : policy.status === "Inactive"
                            ? "bg-gray-100 text-gray-700"
                            : policy.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card className="rounded-lg border bg-white p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold mb-6">Policy Rules</h2>

              {policy.policyRule ? (
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Catalogue Code</p>
                    <p className="mt-1">{policy.policyRule.catalogueCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Catalogue Name</p>
                    <p className="mt-1">{policy.policyRule.catalogueName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Catalogue Description</p>
                    <p className="mt-1">{policy.policyRule.catalogueDescription}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Pre-existing Conditions</p>
                    {policy.policyRule.preExistingConditions && policy.policyRule.preExistingConditions.length > 0 ? (
                      <ul className="mt-1 list-disc pl-5">
                        {policy.policyRule.preExistingConditions.map((condition, index) => (
                          <li key={index}>{condition.name || condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-gray-500">None specified</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Specified Illnesses</p>
                    {policy.policyRule.specifiedIllnesses && policy.policyRule.specifiedIllnesses.length > 0 ? (
                      <ul className="mt-1 list-disc pl-5">
                        {policy.policyRule.specifiedIllnesses.map((illness, index) => (
                          <li key={index}>{illness.name || illness}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-gray-500">None specified</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Congenital Conditions</p>
                    {policy.policyRule.congenitalConditions && policy.policyRule.congenitalConditions.length > 0 ? (
                      <ul className="mt-1 list-disc pl-5">
                        {policy.policyRule.congenitalConditions.map((condition, index) => (
                          <li key={index}>{condition.name || condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-gray-500">None specified</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Exclusions</p>
                    {policy.policyRule.exclusions && policy.policyRule.exclusions.length > 0 ? (
                      <ul className="mt-1 list-disc pl-5">
                        {policy.policyRule.exclusions.map((exclusion, index) => (
                          <li key={index}>{exclusion.name || exclusion}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-gray-500">None specified</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No policy rules have been defined.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="rounded-lg border bg-white p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold mb-6">Service Types</h2>

              {policy.serviceType && policy.serviceType.serviceTypes && policy.serviceType.serviceTypes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Code</th>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policy.serviceType.serviceTypes.map((service, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4">{service.code}</td>
                          <td className="py-2 px-4">{service.name}</td>
                          <td className="py-2 px-4">{service.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No service types have been defined.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card className="rounded-lg border bg-white p-6 shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-lg font-semibold mb-6">Contact Information</h2>

              {policy.contactInfo && policy.contactInfo.contacts && policy.contactInfo.contacts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Role</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policy.contactInfo.contacts.map((contact, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4">{contact.name}</td>
                          <td className="py-2 px-4">{contact.role}</td>
                          <td className="py-2 px-4">{contact.email}</td>
                          <td className="py-2 px-4">{contact.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No contacts have been added.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
