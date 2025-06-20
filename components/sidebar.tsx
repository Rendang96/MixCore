"use client"

import { useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  BarChart2,
  Users,
  Building2,
  DollarSign,
  Package,
  FileText,
  BookOpen,
  Calendar,
  UserCog,
  UserPlus,
  ClipboardList,
  BarChart,
  FileSpreadsheet,
  FileCog,
  Settings,
  ChevronUp,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  activeMenu?: string
  activeSubMenu?: string | null
  onMenuClick?: (menuName: string, subMenu?: string) => void
}

interface MenuItem {
  name: string
  icon: React.ElementType
  hasSubmenu?: boolean
  isActive?: boolean
  subMenuItems?: SubMenuItem[]
  isExpanded?: boolean
}

interface SubMenuItem {
  name: string
  path: string
  isActive?: boolean
}

export function Sidebar({ open, activeMenu = "dashboard", activeSubMenu = null, onMenuClick }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>("ONBOARDING") // Default expanded for testing
  const router = useRouter()

  const menuItems: MenuItem[] = [
    { name: "HOME", icon: Home, isActive: activeMenu === "home" },
    { name: "DASHBOARD", icon: BarChart2, hasSubmenu: true, isActive: activeMenu === "dashboard" },
    { name: "PERSON", icon: Users, hasSubmenu: true, isActive: activeMenu === "person" },
    { name: "COMPANY", icon: Building2, hasSubmenu: true, isActive: activeMenu === "company" },
    { name: "PAYOR", icon: DollarSign, hasSubmenu: true, isActive: activeMenu === "payor" },
    { name: "PRODUCT", icon: Package, hasSubmenu: true, isActive: activeMenu === "product" },
    { name: "POLICY", icon: FileText, hasSubmenu: true, isActive: activeMenu === "policy" },
    { name: "BENEFIT EXCLUSION CATALOGUE", icon: BookOpen, hasSubmenu: true, isActive: activeMenu === "benefit" },
    { name: "PLAN", icon: Calendar, hasSubmenu: true, isActive: activeMenu === "plan" },
    {
      name: "PROVIDER",
      icon: UserCog,
      hasSubmenu: true,
      isActive: activeMenu === "provider",
      isExpanded: expandedMenu === "PROVIDER",
      subMenuItems: [
        {
          name: "MAINTENANCE",
          path: "setup",
          isActive: activeMenu === "provider" && activeSubMenu === "setup",
        },
        {
          name: "ONBOARD",
          path: "onboard",
          isActive: activeMenu === "provider" && activeSubMenu === "onboard",
        },
        {
          name: "DATA MAPPING",
          path: "data-mapping",
          isActive: activeMenu === "provider" && activeSubMenu === "data-mapping",
        },
        {
          name: "DOCTOR",
          path: "doctor",
          isActive: activeMenu === "provider" && activeSubMenu === "doctor",
        },
        {
          name: "RECON",
          path: "recon",
          isActive: activeMenu === "provider" && activeSubMenu === "recon",
        },
        {
          name: "CHANGE REQUEST",
          path: "change-request",
          isActive: activeMenu === "provider" && activeSubMenu === "change-request",
        },
      ],
    },
    {
      name: "AGENT BROKER",
      icon: UserPlus,
      hasSubmenu: true,
      isActive: activeMenu === "agent-broker",
      isExpanded: expandedMenu === "AGENT BROKER",
      subMenuItems: [
        {
          name: "AGENT",
          path: "agent",
          isActive: activeMenu === "agent-broker" && activeSubMenu === "agent",
        },
        {
          name: "BROKER",
          path: "broker",
          isActive: activeMenu === "agent-broker" && activeSubMenu === "broker",
        },
        {
          name: "SALES MANAGER",
          path: "sales-manager",
          isActive: activeMenu === "agent-broker" && activeSubMenu === "sales-manager",
        },
      ],
    },
    {
      name: "ONBOARDING",
      icon: ClipboardList,
      hasSubmenu: true,
      isActive: activeMenu === "onboarding",
      isExpanded: expandedMenu === "ONBOARDING",
      subMenuItems: [
        {
          name: "CORPORATE CLIENT",
          path: "corporate-client",
          isActive: activeMenu === "onboarding" && activeSubMenu === "corporate-client",
        },
        {
          name: "INDIVIDUAL POLICY",
          path: "individual-policy",
          isActive: activeMenu === "onboarding" && activeSubMenu === "individual-policy",
        },
        {
          name: "PMCARE SUBSCRIBER",
          path: "pmcare-subscriber",
          isActive: activeMenu === "onboarding" && activeSubMenu === "pmcare-subscriber",
        },
      ],
    },
    {
      name: "MAINTENANCE",
      icon: Settings, // Using Settings icon as a placeholder, can be changed if a more specific icon is desired
      hasSubmenu: true,
      isActive: activeMenu === "maintenance",
      isExpanded: expandedMenu === "MAINTENANCE",
      subMenuItems: [
        {
          name: "CORPORATE CLIENT",
          path: "corporate-client",
          isActive: activeMenu === "maintenance" && activeSubMenu === "corporate-client",
        },
        {
          name: "MEMBERSHIP",
          path: "membership",
          isActive: activeMenu === "maintenance" && activeSubMenu === "membership",
        },
      ],
    },
    { name: "GL", icon: FileSpreadsheet, hasSubmenu: true, isActive: activeMenu === "gl" },
    { name: "CLAIMS", icon: ClipboardList, hasSubmenu: true, isActive: activeMenu === "claims" },
    { name: "FINANCE", icon: BarChart, hasSubmenu: true, isActive: activeMenu === "finance" },
    { name: "REPORT", icon: FileSpreadsheet, hasSubmenu: true, isActive: activeMenu === "report" },
    { name: "RECORD MANAGEMENT", icon: FileCog, hasSubmenu: true, isActive: activeMenu === "record" },
    { name: "ADMINISTRATOR", icon: Settings, hasSubmenu: true, isActive: activeMenu === "administrator" },
  ]

  const handleMenuClick = (menuName: string) => {
    const clickedMenu = menuItems.find((item) => item.name === menuName)

    if (clickedMenu && clickedMenu.hasSubmenu) {
      if (menuName === "PROVIDER") {
        if (expandedMenu !== menuName) {
          setExpandedMenu(menuName)
          router.push("/providers") // Corrected path for PROVIDER
        } else {
          setExpandedMenu(null)
        }
        return
      } else if (menuName === "AGENT BROKER") {
        if (expandedMenu !== menuName) {
          setExpandedMenu(menuName)
          router.push("/agent-broker") // Corrected path for AGENT BROKER
        } else {
          setExpandedMenu(null)
        }
        return
      }

      // General handling for other menus with submenus (just toggle expansion)
      if (clickedMenu.subMenuItems && clickedMenu.subMenuItems.length > 0) {
        setExpandedMenu(expandedMenu === menuName ? null : menuName)
        return
      }
    }

    // Default navigation for menus without submenus or if specific logic above didn't return
    switch (menuName) {
      case "HOME":
        router.push("/")
        break
      case "DASHBOARD":
        router.push("/dashboard")
        break
      case "PERSON":
        router.push("/person")
        break
      case "COMPANY":
        router.push("/company")
        break
      case "PAYOR":
        router.push("/payor")
        break
      case "PRODUCT":
        router.push("/product")
        break
      case "POLICY":
        router.push("/policy")
        break
      case "BENEFIT EXCLUSION CATALOGUE":
        router.push("/benefit")
        break
      case "PLAN":
        router.push("/plan")
        break
      case "ONBOARDING":
        router.push("/onboarding")
        break
      case "MAINTENANCE":
        // No direct navigation for parent menu, just expansion handled by setExpandedMenu
        break
      case "GL":
        router.push("/gl")
        break
      case "CLAIMS":
        router.push("/claims")
        break
      case "FINANCE":
        router.push("/finance")
        break
      case "REPORT":
        router.push("/report")
        break
      case "RECORD MANAGEMENT":
        router.push("/record")
        break
      case "ADMINISTRATOR":
        router.push("/administrator")
        break
      default:
        router.push("/")
    }

    // Call the parent's onMenuClick handler if provided
    if (onMenuClick) {
      onMenuClick(menuName.toLowerCase())
    }
  }

  const handleSubMenuClick = (menuName: string, subMenuPath: string) => {
    // Navigate to submenu routes
    if (menuName === "ONBOARDING") {
      router.push(`/onboarding/${subMenuPath}`)
    } else if (menuName === "MAINTENANCE") {
      router.push(`/maintenance/${subMenuPath}`)
    } else if (menuName === "PROVIDER") {
      router.push(`/providers/${subMenuPath}`)
    } else if (menuName === "AGENT BROKER") {
      router.push(`/agent-broker/${subMenuPath}`)
    }

    // Call the parent's onMenuClick handler if provided
    if (onMenuClick) {
      onMenuClick(menuName.toLowerCase(), subMenuPath)
    }
  }

  return (
    <aside className="w-64 border-r bg-white">
      <nav>
        <ul className="space-y-0.5 p-2 pt-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleMenuClick(item.name)
                  }}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                    item.isActive ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </div>
                  {item.hasSubmenu &&
                    (item.subMenuItems && item.subMenuItems.length > 0 ? (
                      item.isExpanded ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <span className="text-slate-400">›</span>
                      )
                    ) : (
                      <span className="text-slate-400">›</span>
                    ))}
                </a>

                {/* Submenu items */}
                {item.subMenuItems && item.isExpanded && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.subMenuItems.map((subItem) => (
                      <li key={subItem.name}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handleSubMenuClick(item.name, subItem.path)
                          }}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                            subItem.isActive ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                            <span>{subItem.name}</span>
                          </div>
                          <span className="text-slate-400">›</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
