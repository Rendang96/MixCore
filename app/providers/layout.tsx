"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { useState } from "react"

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar activeMenu="PROVIDER" open={sidebarOpen} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
