"use client"

import { OnboardingStepsSidebar, corporateClientSteps } from "@/components/onboarding/onboarding-steps-sidebar"
import { useCorporateClientForm } from "@/components/onboarding/corporate-client-form-provider"
import { useRouter } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Home } from "lucide-react"

export default function SummaryStep() {
  const { formData } = useCorporateClientForm()
  const router = useRouter()

  const handleSubmit = () => {
    // Submit all data
    console.log("Submitting all data:", formData)
    // Navigate to completion or dashboard
    router.push("/company")
  }

  return (
    <>
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: <Home className="h-4 w-4" />, href: "/" },
            { label: "Onboarding", href: "/onboarding" },
            { label: "Corporate Client", href: "/onboarding/corporate-client" },
            { label: "Summary", href: "/onboarding/corporate-client/summary" },
          ]}
        />
      </div>

      <div className="flex gap-12">
        {/* Steps sidebar */}
        <OnboardingStepsSidebar steps={corporateClientSteps} />

        {/* Main content */}
        <div className="flex-1 bg-white p-12">
          <div className="space-y-8">
            <h2 className="text-xl font-semibold">Summary</h2>

            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Company Information</h3>
                <p>Company Name: {formData.company.name || "Not provided"}</p>
                <p>Company Code: {formData.company.code || "Not provided"}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Payor Information</h3>
                <p>Payor Type: {formData.payor.type === "insurer" ? "Insurer" : "Employer"}</p>
                <p>Selected Payor: {formData.payor.selected || "Not selected"}</p>
              </div>

              {/* Add more summary sections for other steps */}
            </div>

            <div className="flex justify-between gap-3 mt-12">
              <button
                onClick={() => router.push("/onboarding/corporate-client/member")}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button className="px-6 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
