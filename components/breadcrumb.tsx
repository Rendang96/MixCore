"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showBackButton?: boolean
}

export function Breadcrumb({ items, showBackButton = true }: BreadcrumbProps) {
  const router = useRouter()

  const handleBack = () => {
    if (items.length > 1) {
      // Navigate to the previous breadcrumb item
      const previousItem = items[items.length - 2]
      router.push(previousItem.href)
    } else {
      // Fallback to browser back
      router.back()
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground mb-4">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div role="list" className="flex items-center">
          {items.map((item, index) => (
            <div key={item.href} role="listitem" className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
              {index === items.length - 1 ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground hover:underline transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(item.href)
                  }}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
