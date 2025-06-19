"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleMenuClick = (menuName: string, subMenu?: string) => {
    // Close the sidebar on mobile after navigation
    setSidebarOpen(false)

    // Handle navigation based on menu name
    switch (menuName) {
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
      case "benefit":
        router.push("/benefit")
        break
      case "plan":
        router.push("/plan")
        break
      case "provider":
        router.push("/provider")
        break
      case "agent":
        router.push("/agent")
        break
      case "onboarding":
        if (subMenu) {
          router.push(`/onboarding/${subMenu}`)
        } else {
          router.push("/onboarding")
        }
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
      case "record":
        router.push("/record")
        break
      case "administrator":
        router.push("/administrator")
        break
      default:
        // Default to home if menu not recognized
        router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} activeMenu="company" onMenuClick={handleMenuClick} />
        <main className="flex-1 p-6">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
