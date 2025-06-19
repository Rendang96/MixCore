"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"
import { DashboardContent } from "@/components/dashboard-content"
import { CompanySearch } from "@/components/company/company-search"
import { ProductSearch } from "@/components/product/product-search"
import { PayorSearch } from "@/components/payor/payor-search"
import { HomePage } from "@/components/home-page"
import { CorporateClientForm } from "@/components/onboarding/corporate-client-form"
// Update import for PersonSearch to point to the new location
import { PersonSearch } from "@/components/person/person-search"
import { PolicySearch } from "@/components/policy/policy-search"
import { PlanContent } from "@/components/plan/plan-content"
import { PlansProvider } from "@/contexts/plans-context"

type ActiveMenu =
  | "dashboard"
  | "company"
  | "home"
  | "product"
  | "payor"
  | "onboarding"
  | "person"
  | "policy"
  | "plan"
  | string

interface TPADashboardProps {
  initialMenu?: ActiveMenu
}

export function TPADashboard({ initialMenu = "dashboard" }: TPADashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(initialMenu)
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null)

  // Handle URL paths on initial load
  useEffect(() => {
    const path = window.location.pathname

    if (path === "/") {
      setActiveMenu("home")
    } else if (path === "/dashboard") {
      setActiveMenu("dashboard")
    } else if (path.includes("/policy")) {
      setActiveMenu("policy")
    } else if (path.includes("/payor")) {
      setActiveMenu("payor")
    } else if (path.includes("/product")) {
      setActiveMenu("product")
    } else if (path.includes("/company")) {
      setActiveMenu("company")
    } else if (path.includes("/person")) {
      setActiveMenu("person")
    } else if (path.includes("/onboarding")) {
      setActiveMenu("onboarding")
      // Extract submenu from path if present
      if (path.includes("/corporate-client")) {
        setActiveSubMenu("corporate-client")
      } else if (path.includes("/individual-policy")) {
        setActiveSubMenu("individual-policy")
      } else if (path.includes("/pmcare-subscriber")) {
        setActiveSubMenu("pmcare-subscriber")
      }
    } else if (path.includes("/plan")) {
      setActiveMenu("plan")
    }
  }, [])

  const handleMenuClick = (menuName: string, subMenu?: string) => {
    console.log("Menu clicked:", menuName, "Submenu:", subMenu)
    const menu = menuName.toLowerCase()
    setActiveMenu(menu)

    // Update URL based on menu
    let newPath = "/"
    switch (menu) {
      case "home":
        newPath = "/"
        break
      case "dashboard":
        newPath = "/dashboard"
        break
      case "company":
        newPath = "/company"
        break
      case "product":
        newPath = "/product"
        break
      case "payor":
        newPath = "/payor"
        break
      case "person":
        newPath = "/person"
        break
      case "policy":
        newPath = "/policy"
        break
      case "plan":
        newPath = "/plan"
        break
      case "onboarding":
        newPath = "/onboarding"
        if (subMenu) {
          newPath += `/${subMenu}`
        }
        break
      default:
        newPath = "/"
    }

    // Update URL without page reload
    window.history.pushState({}, "", newPath)

    if (subMenu) {
      setActiveSubMenu(subMenu)
    } else {
      setActiveSubMenu(null)
    }
  }

  // For debugging
  console.log("Active Menu:", activeMenu, "Active SubMenu:", activeSubMenu)

  // If the active menu is "home", render the HomePage component without the sidebar
  if (activeMenu === "home") {
    return (
      <PlansProvider>
        <HomePage
          onNavigateToDashboard={() => {
            setActiveMenu("dashboard")
            window.history.pushState({}, "", "/dashboard")
          }}
        />
      </PlansProvider>
    )
  }

  return (
    <PlansProvider>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            open={sidebarOpen}
            onMenuClick={handleMenuClick}
            activeMenu={activeMenu}
            activeSubMenu={activeSubMenu}
          />

          <main className="flex-1 overflow-y-auto p-6">
            {activeMenu === "dashboard" && <DashboardContent />}
            {activeMenu === "company" && <CompanySearch />}
            {activeMenu === "product" && <ProductSearch />}
            {activeMenu === "payor" && <PayorSearch />}
            {activeMenu === "person" && <PersonSearch />}
            {activeMenu === "policy" && <PolicySearch />}
            {activeMenu === "plan" && <PlanContent />}

            {/* Onboarding submenu content */}
            {activeMenu === "onboarding" && activeSubMenu === "corporate-client" && <CorporateClientForm />}
            {activeMenu === "onboarding" && activeSubMenu === "individual-policy" && (
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Individual Policy Onboarding</h1>
                <p>This screen will be implemented in the future.</p>
              </div>
            )}
            {activeMenu === "onboarding" && activeSubMenu === "pmcare-subscriber" && (
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">PMCare Subscriber Onboarding</h1>
                <p>This screen will be implemented in the future.</p>
              </div>
            )}
            {/* Default content for onboarding menu with no submenu selected */}
            {activeMenu === "onboarding" && !activeSubMenu && (
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Onboarding Dashboard</h1>
                <p>Please select a submenu option from the sidebar.</p>
              </div>
            )}

            {/* Add other content components for different menu items as needed */}
          </main>
        </div>

        <Footer />
      </div>
    </PlansProvider>
  )
}
