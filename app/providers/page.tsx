"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProviderTable } from "./provider-table"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"

export default function ProvidersPage() {
  useEffect(() => {
    // Listen for setup data changes to refresh the page if needed
    const handleSetupChange = () => {
      // Optionally refresh or update state
    }

    window.addEventListener("setupDataChanged", handleSetupChange)

    return () => {
      window.removeEventListener("setupDataChanged", handleSetupChange)
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader title="Provider Network" description="Manage healthcare providers in your network" />

      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Input type="search" placeholder="Search providers..." className="pl-10" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Button asChild>
          <Link href="/providers/create" prefetch={false}>
            Create New Provider
          </Link>
        </Button>
      </div>

      <ProviderTable />
    </div>
  )
}
