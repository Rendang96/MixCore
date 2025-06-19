"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function PayorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleMenuClick = (menu: string) => {
    // Close the sidebar on mobile after navigation
    setSidebarOpen(false)

    // Navigate to the selected menu
    switch (menu) {
      case "home":
        router.push("/")
        break
      case "dashboard":
        router.push("/dashboard")
        break
      case "person":
        router.push("/person")
        break
      case "company":
        router.push("/company")
        break
      case "payor":
        router.push("/payor")
        break
      case "product":
        router.push("/product")
        break
      case "policy":
        router.push("/policy")
        break
      case "benefit-exclusion-catalogue":
        router.push("/benefit-exclusion-catalogue")
        break
      case "plan":
        router.push("/plan")
        break
      case "provider":
        router.push("/provider")
        break
      case "agent-broker":
        router.push("/agent-broker")
        break
      case "onboarding":
        router.push("/onboarding")
        break
      case "corporate-client":
        router.push("/onboarding/corporate-client")
        break
      case "individual-policy":
        router.push("/onboarding/individual-policy")
        break
      case "pmcare-subscriber":
        router.push("/onboarding/pmcare-subscriber")
        break
      case "gl":
        router.push("/gl")
        break
      case "claims":
        router.push("/claims")
        break
      case "finance":
        router.push("/finance")
        break
      case "report":
        router.push("/report")
        break
      case "record-management":
        router.push("/record-management")
        break
      case "administrator":
        router.push("/administrator")
        break
      default:
        router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeMenu="payor"
          onMenuClick={handleMenuClick}
        />
        <main className="flex-1 bg-slate-50 p-6">{children}</main>
      </div>
    </div>
  )
}
