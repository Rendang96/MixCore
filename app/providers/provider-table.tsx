"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getProviders, type Provider } from "@/lib/local-storage"

// Update the needsContractRenewal function to handle potential undefined values
const needsContractRenewal = (provider: Provider): boolean => {
  if (!provider.contract?.endDate) return false

  try {
    const endDate = new Date(provider.contract.endDate)
    const currentDate = new Date()
    const thirtyDaysFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Flag if contract ends within 30 days or has already expired
    return endDate <= thirtyDaysFromNow
  } catch (error) {
    console.error("Error checking contract renewal:", error)
    return false
  }
}

export function ProviderTable() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<"code" | "name" | "address" | "pic" | "postcode" | "status">("code")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const router = useRouter()

  useEffect(() => {
    const loadProviders = () => {
      try {
        const data = getProviders()
        setProviders(data || []) // Ensure we always have an array even if getProviders returns null/undefined
      } catch (error) {
        console.error("Error loading providers:", error)
        setProviders([]) // Set to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    loadProviders()

    // Listen for provider changes
    const handleProvidersChange = (event: any) => {
      console.log("Providers changed, reloading...")
      loadProviders()
    }

    window.addEventListener("providersChanged", handleProvidersChange)

    return () => {
      window.removeEventListener("providersChanged", handleProvidersChange)
    }
  }, [])

  const handleSort = (field: "code" | "name" | "address" | "pic" | "postcode" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedProviders = [...providers].sort((a, b) => {
    let aValue = ""
    let bValue = ""

    try {
      switch (sortField) {
        case "code":
          aValue = a.code || ""
          bValue = b.code || ""
          break
        case "name":
          aValue = a.name || ""
          bValue = b.name || ""
          break
        case "address":
          aValue = a.address || ""
          bValue = b.address || ""
          break
        case "pic":
          aValue = a.pic || ""
          bValue = b.pic || ""
          break
        case "postcode":
          aValue = a.postcode || ""
          bValue = b.postcode || ""
          break
        case "status":
          // Handle status properly - extract string value if it's an object
          const aStatus = typeof a.status === "object" ? (a.status as any)?.status || "Active" : a.status || "Active"
          const bStatus = typeof b.status === "object" ? (b.status as any)?.status || "Active" : b.status || "Active"
          aValue = aStatus
          bValue = bStatus
          break
      }
    } catch (error) {
      console.error("Error during sorting:", error)
      return 0
    }

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const handleEdit = (providerId: string) => {
    router.push(`/providers/${providerId}?edit=true`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("code")}>
              <div className="flex items-center space-x-1">
                <span>Provider Code</span>
                <Filter className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
              <div className="flex items-center space-x-1">
                <span>Provider Name</span>
                <Filter className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("address")}>
              <div className="flex items-center space-x-1">
                <span>Address</span>
                <Filter className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("pic")}>
              <div className="flex items-center space-x-1">
                <span>PIC</span>
                <Filter className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("postcode")}>
              <div className="flex items-center space-x-1">
                <span>Postcode</span>
                <Filter className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>PMCare Panel</TableHead>
            <TableHead>AME Panel</TableHead>
            <TableHead>Contract Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center space-x-1">
                <span>Status</span>
                <Filter className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProviders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                No providers found.{" "}
                <Link href="/providers/create" className="text-primary hover:underline">
                  Create your first provider
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            sortedProviders.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">
                  <Link href={`/providers/${provider.id}`} className="text-blue-600 hover:underline">
                    {provider.code}
                  </Link>
                </TableCell>
                <TableCell>{provider.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">{provider.address}</TableCell>
                <TableCell>{provider.pmcareRepresentative?.personInCharge || provider.pic || "-"}</TableCell>
                <TableCell>{provider.postcode}</TableCell>
                <TableCell>
                  <Badge variant={provider.isPMCarePanel ? "default" : "secondary"}>
                    {provider.isPMCarePanel ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={provider.isAMEPanel ? "default" : "secondary"}>
                    {provider.isAMEPanel ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {needsContractRenewal(provider) ? (
                    <Link href={`/providers/${provider.id}?edit=true&tab=contract`}>
                      <Badge
                        variant="destructive"
                        className="bg-orange-100 text-orange-800 border-orange-200 cursor-pointer hover:bg-orange-200 transition-colors"
                      >
                        Renew Contract
                      </Badge>
                    </Link>
                  ) : (
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      (typeof provider.status === "object"
                        ? (provider.status as any)?.status || "Active"
                        : provider.status || "Active") === "Active"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      (typeof provider.status === "object"
                        ? (provider.status as any)?.status || "Active"
                        : provider.status || "Active") === "Active"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {typeof provider.status === "object"
                      ? (provider.status as any)?.status || "Active"
                      : provider.status || "Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/providers/${provider.id}`}>View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(provider.id)}>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
