"use client"

import { useRouter, usePathname } from "next/navigation"

export type OnboardingStep = {
  id: number
  name: string
  path: string
}

export const corporateClientSteps: OnboardingStep[] = [
  { id: 1, name: "Company", path: "/onboarding/corporate-client/add#company" },
  { id: 2, name: "Policy", path: "/onboarding/corporate-client/add#policy" },
  { id: 3, name: "Plan", path: "/onboarding/corporate-client/add#plan" },
  { id: 4, name: "Member", path: "/onboarding/corporate-client/add#member" },
  { id: 5, name: "Summary", path: "/onboarding/corporate-client/add#summary" },
]

export function OnboardingStepsSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  // Only show the sidebar on the add form page
  if (!pathname.includes("/onboarding/corporate-client/add")) {
    return null
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Onboarding Steps</h3>
      <nav className="space-y-2">
        {corporateClientSteps.map((step) => (
          <button
            key={step.id}
            onClick={() => router.push(step.path)}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            {step.id}. {step.name}
          </button>
        ))}
      </nav>
    </div>
  )
}
