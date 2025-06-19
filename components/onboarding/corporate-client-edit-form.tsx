"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  type CorporateClient,
  getCorporateClients,
  saveCorporateClients,
} from "@/lib/corporate-client/corporate-client-storage"
import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns"

// Define the interfaces for form entries
interface PayorEntry {
  id: string
  name: string
  code: string
  payorType: "insurer" | "self-funded"
}

interface ProductEntry {
  id: string
  name: string
  code: string
  payorName: string
  payorCode: string
}

interface PolicyEntry {
  id: string
  name: string
  code: string
  productName: string
  productCode: string
  effectiveDate: Date | undefined
  expiryDate: Date | undefined
}

interface PlanEntry {
  id: string
  name: string
  code: string
  description: string
  policies: PolicyInPlanEntry[]
}

interface PolicyInPlanEntry {
  id: string
  policyNo: string
  policyName: string
  effectiveDate: Date | undefined
  expiryDate: Date | undefined
  serviceTypes: string[]
}

interface MemberEntry {
  id: string
  personId: string
  personName: string
  idNumber: string
  personType: string
  employeePersonId: string
  designation: string
  jobGrade: string
  employmentType: string
  staffCategory: string
  setupProvider: string
}

interface CorporateClientEditFormProps {
  client: CorporateClient
}

export function CorporateClientEditForm({ client }: CorporateClientEditFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  // Form state
  const [companyName, setCompanyName] = useState(client.companyName)
  const [companyCode, setCompanyCode] = useState(client.companyCode)
  const [status, setStatus] = useState(client.status)

  // Replace the single field states with arrays
  const [payorEntries, setPayorEntries] = useState<PayorEntry[]>([])
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([])
  const [policyEntries, setPolicyEntries] = useState<PolicyEntry[]>([])
  const [planEntries, setPlanEntries] = useState<PlanEntry[]>([])
  const [memberEntries, setMemberEntries] = useState<MemberEntry[]>([])

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

  // Initialize form data from client object
  useEffect(() => {
    // Load payors
    if (client.payors && client.payors.length > 0) {
      setPayorEntries(
        client.payors.map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          payorType: p.payorType,
        })),
      )
    } else {
      // Fallback to legacy single payor
      setPayorEntries([
        {
          id: "payor-1",
          name: client.payorName || "",
          code: "",
          payorType: "insurer",
        },
      ])
    }

    // Load products
    if (client.products && client.products.length > 0) {
      setProductEntries(
        client.products.map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          payorName: p.payorName,
          payorCode: p.payorCode,
        })),
      )
    } else {
      setProductEntries([
        {
          id: "product-1",
          name: client.productName || "",
          code: "",
          payorName: "",
          payorCode: "",
        },
      ])
    }

    // Load policies
    if (client.policies && client.policies.length > 0) {
      setPolicyEntries(
        client.policies.map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          productName: p.productName,
          productCode: p.productCode,
          effectiveDate: p.effectiveDate ? new Date(p.effectiveDate) : undefined,
          expiryDate: p.expiryDate ? new Date(p.expiryDate) : undefined,
        })),
      )
    } else {
      setPolicyEntries([
        {
          id: "policy-1",
          name: "",
          code: client.policyNo || "",
          productName: "",
          productCode: "",
          effectiveDate: client.effectiveDate ? new Date(client.effectiveDate) : undefined,
          expiryDate: client.expiryDate ? new Date(client.expiryDate) : undefined,
        },
      ])
    }

    // Load plans
    if (client.plans && client.plans.length > 0) {
      setPlanEntries(
        client.plans.map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          description: p.description,
          policies: p.policies.map((pol) => ({
            id: pol.id,
            policyNo: pol.policyNo,
            policyName: pol.policyName,
            effectiveDate: pol.effectiveDate ? new Date(pol.effectiveDate) : undefined,
            expiryDate: pol.expiryDate ? new Date(pol.expiryDate) : undefined,
            serviceTypes: pol.serviceTypes || [],
          })),
        })),
      )
    } else {
      setPlanEntries([
        {
          id: "plan-1",
          name: client.planName || "",
          code: "",
          description: "",
          policies: [
            {
              id: "plan-1-policy-1",
              policyNo: "",
              policyName: "",
              effectiveDate: undefined,
              expiryDate: undefined,
              serviceTypes: [],
            },
          ],
        },
      ])
    }

    // Load members
    if (client.members && client.members.length > 0) {
      setMemberEntries(
        client.members.map((m) => ({
          id: m.id,
          personId: m.personId,
          personName: m.personName,
          idNumber: m.idNumber,
          personType: m.personType,
          employeePersonId: m.employeePersonId,
          designation: m.designation,
          jobGrade: m.jobGrade,
          employmentType: m.employmentType,
          staffCategory: m.staffCategory,
          setupProvider: m.setupProvider,
        })),
      )
    } else {
      setMemberEntries([
        {
          id: "member-1",
          personId: "",
          personName: "",
          idNumber: "",
          personType: "",
          employeePersonId: "",
          designation: "",
          jobGrade: "",
          employmentType: "",
          staffCategory: "",
          setupProvider: "",
        },
      ])
    }
  }, [client])

  const handleSave = () => {
    const updatedClient: CorporateClient = {
      ...client,
      companyName,
      companyCode,
      status,

      // Save all multiple entries
      payors: payorEntries.map((payor) => ({
        id: payor.id,
        name: payor.name,
        code: payor.code,
        payorType: payor.payorType,
      })),
      products: productEntries.map((product) => ({
        id: product.id,
        name: product.name,
        code: product.code,
        payorName: product.payorName,
        payorCode: product.payorCode,
      })),
      policies: policyEntries.map((policy) => ({
        id: policy.id,
        name: policy.name,
        code: policy.code,
        productName: policy.productName,
        productCode: policy.productCode,
        effectiveDate: policy.effectiveDate ? format(policy.effectiveDate, "yyyy-MM-dd") : "",
        expiryDate: policy.expiryDate ? format(policy.expiryDate, "yyyy-MM-dd") : "",
      })),
      plans: planEntries.map((plan) => ({
        id: plan.id,
        name: plan.name,
        code: plan.code,
        description: plan.description,
        policies: plan.policies.map((policy) => ({
          id: policy.id,
          policyNo: policy.policyNo,
          policyName: policy.policyName,
          effectiveDate: policy.effectiveDate ? format(policy.effectiveDate, "yyyy-MM-dd") : "",
          expiryDate: policy.expiryDate ? format(policy.expiryDate, "yyyy-MM-dd") : "",
          serviceTypes: policy.serviceTypes,
        })),
      })),
      members: memberEntries.map((member) => ({
        id: member.id,
        personId: member.personId,
        personName: member.personName,
        idNumber: member.idNumber,
        personType: member.personType,
        employeePersonId: member.employeePersonId,
        designation: member.designation,
        jobGrade: member.jobGrade,
        employmentType: member.employmentType,
        staffCategory: member.staffCategory,
        setupProvider: member.setupProvider,
      })),

      // Update legacy fields for backward compatibility
      payorName: payorEntries[0]?.name || "",
      productName: productEntries[0]?.name || "",
      policyNo: policyEntries[0]?.code || "",
      planName: planEntries[0]?.name || "",
      memberCount: memberEntries.length,
      effectiveDate: policyEntries[0]?.effectiveDate ? format(policyEntries[0].effectiveDate, "yyyy-MM-dd") : "",
      expiryDate: policyEntries[0]?.expiryDate ? format(policyEntries[0].expiryDate, "yyyy-MM-dd") : "",
    }

    const allClients = getCorporateClients()
    const updatedClients = allClients.map((c) => (c.id === client.id ? updatedClient : c))
    saveCorporateClients(updatedClients)

    alert("Corporate client updated successfully!")
    router.push("/onboarding/corporate-client")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Code</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Payor Information</h2>
            <div className="space-y-4">
              {payorEntries.map((payor, index) => (
                <div key={payor.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Payor {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setPayorEntries(payorEntries.filter((p) => p.id !== payor.id))}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payor Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={payor.name}
                        onChange={(e) => {
                          const newPayorEntries = [...payorEntries]
                          newPayorEntries[index] = { ...payor, name: e.target.value }
                          setPayorEntries(newPayorEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payor Code</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={payor.code}
                        onChange={(e) => {
                          const newPayorEntries = [...payorEntries]
                          newPayorEntries[index] = { ...payor, code: e.target.value }
                          setPayorEntries(newPayorEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payor Type</label>
                      <select
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={payor.payorType}
                        onChange={(e) => {
                          const newPayorEntries = [...payorEntries]
                          newPayorEntries[index] = { ...payor, payorType: e.target.value as "insurer" | "self-funded" }
                          setPayorEntries(newPayorEntries)
                        }}
                      >
                        <option value="insurer">Insurer</option>
                        <option value="self-funded">Self-Funded</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={() =>
                  setPayorEntries([...payorEntries, { id: uuidv4(), name: "", code: "", payorType: "insurer" }])
                }
              >
                Add Payor
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Product Information</h2>
            <div className="space-y-4">
              {productEntries.map((product, index) => (
                <div key={product.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Product {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setProductEntries(productEntries.filter((p) => p.id !== product.id))}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.name}
                        onChange={(e) => {
                          const newProductEntries = [...productEntries]
                          newProductEntries[index] = { ...product, name: e.target.value }
                          setProductEntries(newProductEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Code</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.code}
                        onChange={(e) => {
                          const newProductEntries = [...productEntries]
                          newProductEntries[index] = { ...product, code: e.target.value }
                          setProductEntries(newProductEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payor Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.payorName}
                        onChange={(e) => {
                          const newProductEntries = [...productEntries]
                          newProductEntries[index] = { ...product, payorName: e.target.value }
                          setProductEntries(newProductEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payor Code</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={product.payorCode}
                        onChange={(e) => {
                          const newProductEntries = [...productEntries]
                          newProductEntries[index] = { ...product, payorCode: e.target.value }
                          setProductEntries(newProductEntries)
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={() =>
                  setProductEntries([
                    ...productEntries,
                    { id: uuidv4(), name: "", code: "", payorName: "", payorCode: "" },
                  ])
                }
              >
                Add Product
              </Button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Policy Information</h2>
            <div className="space-y-4">
              {policyEntries.map((policy, index) => (
                <div key={policy.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Policy {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setPolicyEntries(policyEntries.filter((p) => p.id !== policy.id))}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Policy Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={policy.name}
                        onChange={(e) => {
                          const newPolicyEntries = [...policyEntries]
                          newPolicyEntries[index] = { ...policy, name: e.target.value }
                          setPolicyEntries(newPolicyEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Policy Code</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={policy.code}
                        onChange={(e) => {
                          const newPolicyEntries = [...policyEntries]
                          newPolicyEntries[index] = { ...policy, code: e.target.value }
                          setPolicyEntries(newPolicyEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={policy.productName}
                        onChange={(e) => {
                          const newPolicyEntries = [...policyEntries]
                          newPolicyEntries[index] = { ...policy, productName: e.target.value }
                          setPolicyEntries(newPolicyEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Code</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={policy.productCode}
                        onChange={(e) => {
                          const newPolicyEntries = [...policyEntries]
                          newPolicyEntries[index] = { ...policy, productCode: e.target.value }
                          setPolicyEntries(newPolicyEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Effective Date</label>
                      <input
                        type="date"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={policy.effectiveDate ? format(policy.effectiveDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const newPolicyEntries = [...policyEntries]
                          newPolicyEntries[index] = {
                            ...policy,
                            effectiveDate: e.target.value ? new Date(e.target.value) : undefined,
                          }
                          setPolicyEntries(newPolicyEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry Date</label>
                      <input
                        type="date"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={policy.expiryDate ? format(policy.expiryDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const newPolicyEntries = [...policyEntries]
                          newPolicyEntries[index] = {
                            ...policy,
                            expiryDate: e.target.value ? new Date(e.target.value) : undefined,
                          }
                          setPolicyEntries(newPolicyEntries)
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={() =>
                  setPolicyEntries([
                    ...policyEntries,
                    {
                      id: uuidv4(),
                      name: "",
                      code: "",
                      productName: "",
                      productCode: "",
                      effectiveDate: undefined,
                      expiryDate: undefined,
                    },
                  ])
                }
              >
                Add Policy
              </Button>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Plan Information</h2>
            <div className="space-y-4">
              {planEntries.map((plan, index) => (
                <div key={plan.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Plan {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setPlanEntries(planEntries.filter((p) => p.id !== plan.id))}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Plan Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={plan.name}
                        onChange={(e) => {
                          const newPlanEntries = [...planEntries]
                          newPlanEntries[index] = { ...plan, name: e.target.value }
                          setPlanEntries(newPlanEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Plan Code</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={plan.code}
                        onChange={(e) => {
                          const newPlanEntries = [...planEntries]
                          newPlanEntries[index] = { ...plan, code: e.target.value }
                          setPlanEntries(newPlanEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={plan.description}
                        onChange={(e) => {
                          const newPlanEntries = [...planEntries]
                          newPlanEntries[index] = { ...plan, description: e.target.value }
                          setPlanEntries(newPlanEntries)
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-medium">Policies in Plan</h4>
                    {plan.policies.map((policy, policyIndex) => (
                      <div key={policy.id} className="border rounded-md p-4 mt-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium">Policy {policyIndex + 1}</h5>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              const newPlanEntries = [...planEntries]
                              newPlanEntries[index].policies = newPlanEntries[index].policies.filter(
                                (p) => p.id !== policy.id,
                              )
                              setPlanEntries(newPlanEntries)
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-trash-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Policy No</label>
                            <input
                              type="text"
                              className="w-full h-8 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                              value={policy.policyNo}
                              onChange={(e) => {
                                const newPlanEntries = [...planEntries]
                                newPlanEntries[index].policies[policyIndex] = { ...policy, policyNo: e.target.value }
                                setPlanEntries(newPlanEntries)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Policy Name</label>
                            <input
                              type="text"
                              className="w-full h-8 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                              value={policy.policyName}
                              onChange={(e) => {
                                const newPlanEntries = [...planEntries]
                                newPlanEntries[index].policies[policyIndex] = { ...policy, policyName: e.target.value }
                                setPlanEntries(newPlanEntries)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Effective Date</label>
                            <input
                              type="date"
                              className="w-full h-8 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                              value={policy.effectiveDate ? format(policy.effectiveDate, "yyyy-MM-dd") : ""}
                              onChange={(e) => {
                                const newPlanEntries = [...planEntries]
                                newPlanEntries[index].policies[policyIndex] = {
                                  ...policy,
                                  effectiveDate: e.target.value ? new Date(e.target.value) : undefined,
                                }
                                setPlanEntries(newPlanEntries)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Expiry Date</label>
                            <input
                              type="date"
                              className="w-full h-8 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                              value={policy.expiryDate ? format(policy.expiryDate, "yyyy-MM-dd") : ""}
                              onChange={(e) => {
                                const newPlanEntries = [...planEntries]
                                newPlanEntries[index].policies[policyIndex] = {
                                  ...policy,
                                  expiryDate: e.target.value ? new Date(e.target.value) : undefined,
                                }
                                setPlanEntries(newPlanEntries)
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Service Types</label>
                            <input
                              type="text"
                              className="w-full h-8 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                              value={policy.serviceTypes ? policy.serviceTypes.join(", ") : ""}
                              onChange={(e) => {
                                const newPlanEntries = [...planEntries]
                                newPlanEntries[index].policies[policyIndex] = {
                                  ...policy,
                                  serviceTypes: e.target.value.split(",").map((s) => s.trim()),
                                }
                                setPlanEntries(newPlanEntries)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        const newPlanEntries = [...planEntries]
                        newPlanEntries[index].policies = [
                          ...newPlanEntries[index].policies,
                          {
                            id: uuidv4(),
                            policyNo: "",
                            policyName: "",
                            effectiveDate: undefined,
                            expiryDate: undefined,
                            serviceTypes: [],
                          },
                        ]
                        setPlanEntries(newPlanEntries)
                      }}
                    >
                      Add Policy to Plan
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={() =>
                  setPlanEntries([
                    ...planEntries,
                    {
                      id: uuidv4(),
                      name: "",
                      code: "",
                      description: "",
                      policies: [],
                    },
                  ])
                }
              >
                Add Plan
              </Button>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Member Information</h2>
            <div className="space-y-4">
              {memberEntries.map((member, index) => (
                <div key={member.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium">Member {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setMemberEntries(memberEntries.filter((m) => m.id !== member.id))}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Person ID</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.personId}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, personId: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Person Name</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.personName}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, personName: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ID Number</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.idNumber}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, idNumber: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Person Type</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.personType}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, personType: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Employee Person ID</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.employeePersonId}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, employeePersonId: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Designation</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.designation}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, designation: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Grade</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.jobGrade}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, jobGrade: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Employment Type</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.employmentType}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, employmentType: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Staff Category</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.staffCategory}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, staffCategory: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Setup Provider</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={member.setupProvider}
                        onChange={(e) => {
                          const newMemberEntries = [...memberEntries]
                          newMemberEntries[index] = { ...member, setupProvider: e.target.value }
                          setMemberEntries(newMemberEntries)
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={() =>
                  setMemberEntries([
                    ...memberEntries,
                    {
                      id: uuidv4(),
                      personId: "",
                      personName: "",
                      idNumber: "",
                      personType: "",
                      employeePersonId: "",
                      designation: "",
                      jobGrade: "",
                      employmentType: "",
                      staffCategory: "",
                      setupProvider: "",
                    },
                  ])
                }
              >
                Add Member
              </Button>
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-md font-semibold mb-4 text-blue-600">Updated Corporate Client Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Company Name:</span>
                  <p className="text-sm">{companyName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Company Code:</span>
                  <p className="text-sm">{companyCode}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <p className="text-sm">{status}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Payors:</span>
                  <ul>
                    {payorEntries.map((payor) => (
                      <li key={payor.id}>{payor.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Products:</span>
                  <ul>
                    {productEntries.map((product) => (
                      <li key={product.id}>{product.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Policies:</span>
                  <ul>
                    {policyEntries.map((policy) => (
                      <li key={policy.id}>{policy.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Plans:</span>
                  <ul>
                    {planEntries.map((plan) => (
                      <li key={plan.id}>{plan.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Members:</span>
                  <p className="text-sm">{memberEntries.length}</p>
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
          <span className="text-gray-900">Edit Corporate Client</span>
        </nav>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Edit Corporate Client - {client.companyName}</h1>
        <Button variant="outline" onClick={handleBackToListing}>
          Back to Listing
        </Button>
      </div>

      {/* Horizontal Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-medium cursor-pointer ${
                  currentStep === step.id ? "bg-blue-600" : currentStep > step.id ? "bg-green-500" : "bg-gray-300"
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
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleBackToListing}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
          </div>
          <div className="flex space-x-4">
            {currentStep === 7 ? (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Update Corporate Client
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}>Next</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
