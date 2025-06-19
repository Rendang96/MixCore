import type * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: {
    name: string
    href?: string
  }[]
  separator?: React.ReactNode
}

export function Breadcrumbs({
  segments,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {segments.map((segment, index) => {
          const isLastItem = index === segments.length - 1
          return (
            <li key={segment.name} className="flex items-center gap-1.5">
              {segment.href && !isLastItem ? (
                <Link href={segment.href} className="hover:text-foreground hover:underline">
                  {segment.name}
                </Link>
              ) : (
                <span className={isLastItem ? "font-medium text-foreground" : ""}>{segment.name}</span>
              )}
              {!isLastItem && separator}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
