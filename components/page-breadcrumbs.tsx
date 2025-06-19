"use client"

import type React from "react"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbItem {
  label: string | React.ReactNode
  href?: string
  onClick?: () => void
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-slate-400 mx-1" />}

              {isLast ? (
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              ) : item.href ? (
                <Link href={item.href} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                  {item.label === "Home" ? <Home className="h-4 w-4" /> : item.label}
                </Link>
              ) : (
                <button onClick={item.onClick} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                  {item.label === "Home" ? <Home className="h-4 w-4" /> : item.label}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
