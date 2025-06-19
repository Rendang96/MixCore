"use client"

import { OnboardingStepsSidebar, corporateClientSteps } from "@/components/onboarding/onboarding-steps-sidebar"
import { useCorporateClientForm } from "@/components/onboarding/corporate-client-form-provider"
import { useRouter } from "next/navigation"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Home } from "lucide-react"

export default function ProviderStep() {
  const { formData, updateFormData } = useCorporateClientForm()
  const router = useRouter()

  const handleSave = () => {
    // Save logic here
    console.log("Saving provider data:", formData.provider)
    // Navigate to next step
    router.push("/onboarding/corporate-client/member")
  }

  return (
    <>
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: <Home className="h-4 w-4" />, href: "/" },
            { label: "Onboarding", href: "/onboarding" },
            { label: "Corporate Client", href: "/onboarding/corporate-client" },
            { label: "Provider", href: "/onboarding/corporate-client/provider" },
          ]}
        />
      </div>

      <div className="flex gap-12">
        {/* Steps sidebar */}
        <OnboardingStepsSidebar steps={corporateClientSteps} />

        {/* Main content */}
        <div className="flex-1 bg-white p-12">
          <div className="space-y-8">
            <h2 className="text-xl font-semibold">Provider Information</h2>

            <div className="space-y-6">
              <p>Provider form will go here</p>
            </div>

            <div className="flex justify-between gap-3 mt-12">
              <button
                onClick={() => router.push("/onboarding/corporate-client/plan")}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button className="px-6 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
                  Save & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
