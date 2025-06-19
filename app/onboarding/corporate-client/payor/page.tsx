import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { Home } from "lucide-react"
import { StepNavigation } from "@/components/onboarding/step-navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PayorStepPage() {
  return (
    <div>
      <div className="mb-6">
        <PageBreadcrumbs
          items={[
            { label: <Home className="h-4 w-4" />, href: "/" },
            { label: "Onboarding", href: "/onboarding" },
            { label: "Corporate Client", href: "/onboarding/corporate-client" },
            { label: "Payor", href: "/onboarding/corporate-client/payor" },
          ]}
        />
      </div>

      <div className="flex gap-8">
        <StepNavigation />

        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Payor Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payor Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter payor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payor Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Select payor type</option>
                  <option value="insurance">Insurance</option>
                  <option value="employer">Employer</option>
                  <option value="government">Government</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Link href="/onboarding/corporate-client/company">
                <Button variant="outline">Back</Button>
              </Link>
              <Link href="/onboarding/corporate-client/product">
                <Button>Save</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
