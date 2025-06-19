"use client"

import { useState } from "react"
import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full width at the top */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content area with sidebar */}
      <div className="flex">
        {/* Sidebar - Below header on the left */}
        <div className="w-64 flex-shrink-0">
          <Sidebar
            open={sidebarOpen}
            activeMenu="onboarding"
            activeSubMenu="corporate-client"
            onMenuClick={(menuName, subMenu) => {
              console.log("Menu clicked:", menuName, subMenu)
            }}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-4">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
