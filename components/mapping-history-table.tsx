"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface MappingHistoryEntry {
  id: string
  fileName: string
  companyName: string
  matchedCount: number
  unmatchedCount: number
  mappedBy: string
  timestamp: string // ISO string
}

interface MappingHistoryTableProps {
  data: MappingHistoryEntry[]
}

export function MappingHistoryTable({ data }: MappingHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Matched</TableHead>
            <TableHead>Unmatched</TableHead>
            <TableHead>Mapped By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No mapping history yet. Upload a file and map data to see history.
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="font-medium">{entry.fileName}</TableCell>
                <TableCell>{entry.companyName}</TableCell>
                <TableCell>{entry.matchedCount}</TableCell>
                <TableCell>{entry.unmatchedCount}</TableCell>
                <TableCell>{entry.mappedBy}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
