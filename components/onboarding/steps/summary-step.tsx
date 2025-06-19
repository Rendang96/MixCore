"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useCorporateClientForm, type CorporateClientFormData } from "@/contexts/corporate-client-form-context"
import { Building2, FileText, Shield, Users } from "lucide-react"
import { useEffect } from "react"

interface SummaryStepProps {
  onPrevious: () => void
}

export function SummaryStep({ onPrevious }: SummaryStepProps) {
  const router = useRouter()
  const { formData, updateFormData } = useCorporateClientForm()

  // Debug: Log the form data to see what's available
  console.log("Summary Step - Form Data:", formData)
  console.log("Company Name:", formData.companyName)
  console.log("Company Code:", formData.companyCode)
  console.log("Payor 1 Name:", formData.payorName1)
  console.log("Payor 2 Name:", formData.payorName2)
  console.log("SummaryStep: formData.memberEntries on render", formData.memberEntries)

  // Additional detailed logging for member entries
  if (formData.memberEntries && formData.memberEntries.length > 0) {
    console.log("SummaryStep: Member entries details:")
    formData.memberEntries.forEach((member, index) => {
      console.log(`Member ${index + 1}:`, {
        id: member.id,
        personName: member.personName,
        personId: member.personId,
        idNumber: member.idNumber,
        designation: member.designation,
        hasPersonName: !!(member.personName && member.personName.trim() !== ""),
      })
    })

    const validMembers = formData.memberEntries.filter((member) => member.personName && member.personName.trim() !== "")
    console.log("SummaryStep: Valid members (with non-empty personName):", validMembers.length)
    console.log("SummaryStep: Valid members data:", validMembers)
  }

  useEffect(() => {
    // Only load data if it's not already present and we haven't loaded it before
    let shouldUpdate = false
    const updates: Partial<CorporateClientFormData> = {}

    // Load company data if context is empty
    if (!formData.companyName && !formData.companyCode && !formData.payorName1) {
      const savedData = localStorage.getItem("corporateClientCompanyStep")
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          updates.companyName = parsedData.companyName || ""
          updates.companyCode = parsedData.companyCode || ""
          updates.payorName1 = parsedData.payorName1 || ""
          updates.payorCode1 = parsedData.payorCode1 || ""
          updates.payorType1 = parsedData.payorType1 || ""
          updates.payorName2 = parsedData.payorName2 || ""
          updates.payorCode2 = parsedData.payorCode2 || ""
          updates.payorType2 = parsedData.payorType2 || ""
          shouldUpdate = true
        } catch (error) {
          console.error("Error loading company data from localStorage:", error)
        }
      }
    }

    // Load member data if context is empty
    if (
      !formData.memberEntries ||
      formData.memberEntries.length === 0 ||
      !formData.memberEntries.some((m) => m.personName && m.personName.trim() !== "")
    ) {
      const savedMemberData = localStorage.getItem("corporateClientMemberStep")
      if (savedMemberData) {
        try {
          const parsedMemberData = JSON.parse(savedMemberData)
          if (parsedMemberData.memberEntries && parsedMemberData.memberEntries.length > 0) {
            // Restore dates properly
            const restoredMembers = parsedMemberData.memberEntries.map((member: any) => ({
              ...member,
              joinedDate: member.joinedDate ? new Date(member.joinedDate) : undefined,
              startDate: member.startDate ? new Date(member.startDate) : undefined,
              endDate: member.endDate ? new Date(member.endDate) : undefined,
              planEffectiveDate: member.planEffectiveDate ? new Date(member.planEffectiveDate) : undefined,
              planExpiryDate: member.planExpiryDate ? new Date(member.planExpiryDate) : undefined,
              dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
              dependentInfo: member.dependentInfo
                ? {
                    ...member.dependentInfo,
                    dateOfBirth: member.dependentInfo.dateOfBirth
                      ? new Date(member.dependentInfo.dateOfBirth)
                      : undefined,
                  }
                : undefined,
            }))
            updates.memberEntries = restoredMembers
            shouldUpdate = true
            console.log("SummaryStep: Loaded member data from localStorage:", restoredMembers.length, "members")
          }
        } catch (error) {
          console.error("Error loading member data from localStorage:", error)
        }
      }
    }

    // Load policy data if context is empty
    if (!formData.policyEntries || formData.policyEntries.length === 0 || !formData.policyEntries[0]?.name) {
      const savedPolicyData = localStorage.getItem("corporateClientPolicyStep")
      if (savedPolicyData) {
        try {
          const parsedPolicyData = JSON.parse(savedPolicyData)
          updates.policyEntries = parsedPolicyData.policyEntries || []
          shouldUpdate = true
        } catch (error) {
          console.error("Error loading policy data from localStorage:", error)
        }
      }
    }

    // Load plan data if context is empty
    if (!formData.planEntries || formData.planEntries.length === 0 || !formData.planEntries[0]?.name) {
      const savedPlanData = localStorage.getItem("corporateClientPlanStep")
      if (savedPlanData) {
        try {
          const parsedPlanData = JSON.parse(savedPlanData)
          updates.planEntries = parsedPlanData.savedPlanRecords || []
          shouldUpdate = true
        } catch (error) {
          console.error("Error loading plan data from localStorage:", error)
        }
      }
    }

    // Only call updateFormData if we have updates to make
    if (shouldUpdate && Object.keys(updates).length > 0) {
      console.log("SummaryStep: Updating form data with:", updates)
      updateFormData(updates)
    }
  }, [formData.companyName, formData.memberEntries, formData.policyEntries, formData.planEntries, updateFormData])

  const handleFinalSubmit = () => {
    alert("Corporate client onboarding completed successfully!")
    router.push("/onboarding/corporate-client")
  }

  // Check if we have any company data
  const hasCompanyData = formData.companyName || formData.companyCode || formData.payorName1 || formData.payorName2

  // Count payors
  const payorCount = [
    formData.payorName1 && formData.payorName1.trim() !== "",
    formData.payorName2 && formData.payorName2.trim() !== "",
  ].filter(Boolean).length

  // Filter valid members - let's be more lenient with the filtering
  const validMembers = formData.memberEntries
    ? formData.memberEntries.filter((member) => {
        // Check if member has either personName, personId, or idNumber
        return (
          (member.personName && member.personName.trim() !== "") ||
          (member.personId && member.personId.trim() !== "") ||
          (member.idNumber && member.idNumber.trim() !== "")
        )
      })
    : []

  console.log("SummaryStep: Final validMembers for display:", validMembers)

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Corporate Client Summary</h1>
        <p className="text-lg text-gray-600">
          Please review all information below before submitting your corporate client onboarding
        </p>
      </div>

      {/* 1. Company Information */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {formData.companyName || formData.companyCode || formData.payorName1 || formData.payorName2 ? (
            <div className="space-y-4">
              {/* Company Details */}
              {(formData.companyName || formData.companyCode) && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Company Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{formData.companyName || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Code</p>
                      <p className="font-medium">{formData.companyCode || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payor 1 Information */}
              {(formData.payorName1 || formData.payorCode1 || formData.payorType1) && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Payor 1 Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payor Name</p>
                      <p className="font-medium">{formData.payorName1 || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payor Code</p>
                      <p className="font-medium">{formData.payorCode1 || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payor Type</p>
                      <p className="font-medium">{formData.payorType1 || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payor 2 Information */}
              {(formData.payorName2 || formData.payorCode2 || formData.payorType2) && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Payor 2 Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payor Name</p>
                      <p className="font-medium">{formData.payorName2 || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payor Code</p>
                      <p className="font-medium">{formData.payorCode2 || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payor Type</p>
                      <p className="font-medium">{formData.payorType2 || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No company information provided</p>
                <p className="text-sm text-gray-400">Please go back to the Company step to enter information</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Policy Information */}
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <FileText className="h-5 w-5" />
            Policy Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {formData.policyEntries &&
          formData.policyEntries.length > 0 &&
          formData.policyEntries.some((policy) => policy.name || policy.code) ? (
            <div className="space-y-4">
              {formData.policyEntries.map((policy, index) => (
                <div key={policy.id} className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Policy {index + 1}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Policy Number</p>
                      <p className="font-medium">{policy.code || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Policy Name</p>
                      <p className="font-medium">{policy.name || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service Type</p>
                      <p className="font-medium">{policy.serviceType || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Product Name</p>
                      <p className="font-medium">{policy.productName || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Product Code</p>
                      <p className="font-medium">{policy.productCode || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Effective Date</p>
                      <p className="font-medium">
                        {policy.effectiveDate ? new Date(policy.effectiveDate).toLocaleDateString() : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiry Date</p>
                      <p className="font-medium">
                        {policy.expiryDate ? new Date(policy.expiryDate).toLocaleDateString() : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No policy information provided</p>
                <p className="text-sm text-gray-400">Please go back to the Policy step to enter information</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Plan Information */}
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Shield className="h-5 w-5" />
            Plan Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {formData.planEntries &&
          formData.planEntries.length > 0 &&
          formData.planEntries.some((plan) => plan.name || plan.code) ? (
            <div className="space-y-4">
              {formData.planEntries.map((plan, index) => (
                <div key={plan.id} className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Plan {index + 1}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Plan Name</p>
                      <p className="font-medium">{plan.name || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Plan Code</p>
                      <p className="font-medium">{plan.code || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium">{plan.description || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Effective Date</p>
                      <p className="font-medium">
                        {plan.effectiveDate ? new Date(plan.effectiveDate).toLocaleDateString() : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expiry Date</p>
                      <p className="font-medium">
                        {plan.expiryDate ? new Date(plan.expiryDate).toLocaleDateString() : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Associated Policies</p>
                      <p className="font-medium">
                        {plan.policies && plan.policies.length > 0
                          ? `${plan.policies.length} ${plan.policies.length === 1 ? "policy" : "policies"} selected`
                          : "No policies selected"}
                      </p>
                    </div>
                  </div>

                  {/* Policy Details */}
                  {plan.policies && plan.policies.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-3">Policy Details</h5>
                      <div className="space-y-2">
                        {plan.policies.map((policy, policyIndex) => (
                          <div key={policy.id} className="bg-gray-50 p-3 rounded border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500">Policy Name</p>
                                <p className="text-sm font-medium">{policy.policyName || "Not specified"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Policy Number</p>
                                <p className="text-sm font-medium">{policy.policyNo || "Not specified"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No plan information provided</p>
                <p className="text-sm text-gray-400">Please go back to the Plan step to enter information</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Member Information */}
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Users className="h-5 w-5" />
            Member Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {validMembers.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Emp. NRIC/Passport No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Emp. Gender
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Designation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employment Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dependent Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dep. NRIC/Passport No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Relationship
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {validMembers.map((member, index) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {member.personName || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.idNumber || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.gender || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.designation || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.employmentType || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.staffCategory || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.dependentInfo?.name || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.dependentInfo?.nricPassport || "Not provided"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.dependentInfo?.relationship || "Not provided"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Total Members:</strong> {validMembers.length}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No member information provided</p>
                <p className="text-sm text-gray-400">Please go back to the Member step to enter information</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700" size="lg">
          Submit Corporate Client
        </Button>
      </div>
    </div>
  )
}
