"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Home, Bell } from "lucide-react"

type MenuItem = {
  title: string
  href?: string
  icon?: React.ReactNode
  submenu?: MenuItem[]
  expanded?: boolean
}

export function SidebarNavigation() {
  const pathname = usePathname()
  const [hasNewChangeRequests, setHasNewChangeRequests] = useState(true) // Mock data - set to true to show the bell
  const bellAnimation = hasNewChangeRequests ? "animate-pulse" : ""
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      title: "HOME",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      title: "DASHBOARD",
      href: "/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "PERSON",
      href: "/person",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "COMPANY",
      href: "/company",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "INSURER",
      href: "/insurer",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "PAYOR",
      href: "/payor",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "PRODUCT",
      href: "/product",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "POLICY",
      href: "/policy",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "BENEFIT EXCLUSION CATALOGUE",
      href: "/benefit-exclusion",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "PLAN",
      href: "/plan",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "PROVIDER",
      href: "/providers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 7h-9" />
          <path d="M14 17H5" />
          <circle cx="17" cy="17" r="3" />
          <circle cx="7" cy="7" r="3" />
        </svg>
      ),
      expanded: pathname.startsWith("/providers"),
      submenu: [
        {
          title: "MAINTENANCE",
          href: "/providers/setup",
        },
        {
          title: "ONBOARD",
          href: "/onboarding/providers",
        },
        {
          title: "DATA MAPPING",
          href: "/providers/data-mapping",
        },
        {
          title: "DOCTOR",
          href: "/providers/doctor",
        },
        {
          title: "RECON",
          href: "/providers/recon",
        },
        {
          title: "CHANGE REQUEST",
          href: "/providers/change-request",
          icon: hasNewChangeRequests ? <Bell className={`h-3 w-3 text-red-500 ${bellAnimation}`} /> : null,
        },
      ],
    },
    {
      title: "AGENT BROKER",
      href: "/agent-broker",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      expanded: false,
    },
    {
      title: "ONBOARDING",
      href: "/onboarding",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
      expanded: pathname.startsWith("/onboarding"),
      submenu: [
        {
          title: "PROVIDERS",
          href: "/onboarding/providers",
        },
        {
          title: "CORPORATE CLIENT",
          href: "/onboarding/corporate-client",
        },
        {
          title: "INDIVIDUAL POLICY",
          href: "/onboarding/individual-policy",
        },
        {
          title: "PMCARE SUBSCRIBER",
          href: "/onboarding/pmcare-subscriber",
        },
      ],
    },
    {
      title: "GL",
      href: "/gl",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      expanded: false,
    },
  ])

  const toggleSubmenu = (index: number) => {
    const updatedMenuItems = [...menuItems]
    updatedMenuItems[index].expanded = !updatedMenuItems[index].expanded
    setMenuItems(updatedMenuItems)
  }

  return (
    <div className="w-64 bg-white border-r h-screen overflow-y-auto">
      <div className="p-4 border-b">
        <div className="bg-blue-500 text-white p-2 rounded font-bold">PMCare Logo</div>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <div>
                  <div className="flex items-center w-full">
                    <Link
                      href={item.href || "#"}
                      className={`flex items-center flex-1 p-2 rounded-md hover:bg-gray-100 ${
                        pathname === item.href ? "bg-gray-100 font-medium" : ""
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1 text-sm">{item.title}</span>
                    </Link>
                    <button onClick={() => toggleSubmenu(index)} className="p-2 rounded-md hover:bg-gray-100">
                      {item.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                  {item.expanded && (
                    <ul className="pl-6 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href || "#"}
                            className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${
                              pathname === subItem.href ||
                              (subItem.href === "/onboarding/providers" && pathname.startsWith("/onboarding/providers"))
                                ? "bg-gray-100 font-medium"
                                : ""
                            }`}
                          >
                            <span className="text-sm flex items-center gap-2">
                              • {subItem.title}
                              {subItem.href === "/providers/change-request" && hasNewChangeRequests && (
                                <Bell className="h-3 w-3 text-red-500 animate-pulse" />
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${
                    pathname === item.href ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
