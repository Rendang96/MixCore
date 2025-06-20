"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { MatchedProvider } from "@/lib/mock-data-matching"

interface MatchedProvidersTableProps {
  data: MatchedProvider[]
}

export function MatchedProvidersTable({ data }: MatchedProvidersTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showMapDialog, setShowMapDialog] = useState(false)
  const [selectedProviderForMap, setSelectedProviderForMap] = useState<MatchedProvider | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(data.map((row) => row.id))
      setSelectedRows(newSelected)
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleViewMap = (provider: MatchedProvider) => {
    setSelectedProviderForMap(provider)
    setShowMapDialog(true)
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.size === data.length && data.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all matched providers"
              />
            </TableHead>
            <TableHead>Provider Code</TableHead>
            <TableHead>Provider Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Panel Status</TableHead>
            <TableHead>Nearby Panel Alternatives (≤10km)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                No matched providers to display.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                    aria-label={`Select row for ${row.providerName}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.providerCode}</TableCell>
                <TableCell>{row.providerName}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell
                  className="blur-sm hover:blur-none transition-all duration-200"
                  title="Hover to reveal contact"
                >
                  {row.contact}
                </TableCell>
                <TableCell>
                  <Badge variant={row.panelStatus === "✅ Panel" ? "default" : "destructive"}>{row.panelStatus}</Badge>
                </TableCell>
                <TableCell>
                  {row.nearbyPanelAlternatives !== "-" ? (
                    <Button variant="link" size="sm" onClick={() => handleViewMap(row)}>
                      {row.nearbyPanelAlternatives}
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nearby Panel Alternatives</DialogTitle>
            <DialogDescription>
              Showing nearby panel alternatives for {selectedProviderForMap?.providerName}.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[300px] w-full bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
            {/* Placeholder for Leaflet Map */}
            <p>Map preview of {selectedProviderForMap?.address} and alternatives would go here.</p>
            <p className="absolute bottom-4 right-4 text-xs text-gray-600">
              {selectedProviderForMap?.nearbyPanelAlternatives}
            </p>
          </div>
          <div className="text-sm text-gray-700 mt-4">
            <p>
              <strong>Provider:</strong> {selectedProviderForMap?.providerName}
            </p>
            <p>
              <strong>Address:</strong> {selectedProviderForMap?.address}
            </p>
            <p>
              <strong>Suggested Alternatives:</strong> {selectedProviderForMap?.nearbyPanelAlternatives}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
