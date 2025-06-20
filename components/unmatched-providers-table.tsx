"use client"

import { useState, useCallback, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Import Textarea for address

import {
  type UnmatchedProvider,
  mockMatchedProviders, // Import mock matched providers for suggestions
} from "@/lib/mock-data-matching"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils" // For conditional class names

interface UnmatchedProvidersTableProps {
  data: UnmatchedProvider[]
  onDataUpdate: (updatedData: UnmatchedProvider[]) => void // Callback to update parent state
}

interface SuggestedMatch {
  id: string
  providerName: string
  address: string
  confidence: number
}

// Simple similarity score simulation (Levenshtein distance not directly available in Next.js)
function getSimilarityScore(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()

  if (s1 === s2) return 100 // Exact match

  let score = 0
  // Check for substring presence
  if (s1.includes(s2) || s2.includes(s1)) {
    score += 40 // Base score for partial match
  }

  // Calculate Jaccard similarity for words
  const words1 = new Set(s1.split(/\s+/))
  const words2 = new Set(s2.split(/\s+/))
  const intersection = new Set([...words1].filter((x) => words2.has(x))).size
  const union = words1.size + words2.size - intersection
  if (union > 0) {
    score += (intersection / union) * 40 // Add up to 40 for word overlap
  }

  // Add points for length similarity
  const lengthDiff = Math.abs(s1.length - s2.length)
  score += Math.max(0, 20 - lengthDiff) // Up to 20 points for similar length

  // Introduce some randomness to simulate fuzzy logic
  score += Math.random() * 5 - 2.5 // +/- 2.5 points

  return Math.min(100, Math.max(0, Math.round(score)))
}

export function UnmatchedProvidersTable({ data, onDataUpdate }: UnmatchedProvidersTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [editingProvider, setEditingProvider] = useState<UnmatchedProvider | null>(null) // State for modal editing
  const [modalEditedName, setModalEditedName] = useState("")
  const [modalEditedAddress, setModalEditedAddress] = useState("")
  const [modalEditedContact, setModalEditedContact] = useState("")
  const [suggestions, setSuggestions] = useState<{ [key: string]: SuggestedMatch[] }>({})
  const [ignoredProviders, setIgnoredProviders] = useState<UnmatchedProvider[]>([])
  const [fadingOutId, setFadingOutId] = useState<string | null>(null)

  // Load ignored providers from localStorage on mount
  useEffect(() => {
    const storedIgnored = localStorage.getItem("ignoredProviders")
    if (storedIgnored) {
      setIgnoredProviders(JSON.parse(storedIgnored))
    }
  }, [])

  // Save ignored providers to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ignoredProviders", JSON.stringify(ignoredProviders))
  }, [ignoredProviders])

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

  const handleSuggestFixes = useCallback((provider: UnmatchedProvider) => {
    toast({
      title: "Suggesting Fixes",
      description: `AI is analyzing "${provider.providerName}" for potential corrections.`,
    })

    const currentSuggestions: SuggestedMatch[] = []
    mockMatchedProviders.forEach((matchedP) => {
      const nameScore = getSimilarityScore(provider.providerName, matchedP.providerName)
      const addressScore = getSimilarityScore(provider.address, matchedP.address)
      const overallConfidence = nameScore * 0.6 + addressScore * 0.4 // Weighted average

      if (overallConfidence >= 75) {
        currentSuggestions.push({
          id: matchedP.id,
          providerName: matchedP.providerName,
          address: matchedP.address,
          confidence: Math.round(overallConfidence),
        })
      }
    })

    // Sort by confidence and take top 3
    const topSuggestions = currentSuggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3)

    setSuggestions((prev) => ({ ...prev, [provider.id]: topSuggestions }))

    setTimeout(() => {
      if (topSuggestions.length > 0) {
        toast({
          title: "Suggestion Ready",
          description: `Found ${topSuggestions.length} potential matches for "${provider.providerName}".`,
        })
      } else {
        toast({
          title: "No Suggestions",
          description: `Could not find strong matches for "${provider.providerName}".`,
        })
      }
    }, 500) // Simulate slight delay for suggestions
  }, [])

  const handleEdit = useCallback((provider: UnmatchedProvider) => {
    setEditingProvider(provider)
    setModalEditedName(provider.providerName)
    setModalEditedAddress(provider.address)
    setModalEditedContact(provider.contact)
  }, [])

  const handleSaveEdit = useCallback(() => {
    if (editingProvider) {
      // Basic validation for address format (can be expanded)
      if (!modalEditedAddress.trim()) {
        toast({
          title: "Validation Error",
          description: "Address cannot be empty.",
          variant: "destructive",
        })
        return
      }

      const updatedData = data.map((p) =>
        p.id === editingProvider.id
          ? {
              ...p,
              providerName: modalEditedName,
              address: modalEditedAddress,
              contact: modalEditedContact,
            }
          : p,
      )
      onDataUpdate(updatedData) // Update parent state
      setEditingProvider(null) // Close modal
      toast({
        title: "Provider Updated",
        description: `"${modalEditedName}" details saved.`,
      })
    }
  }, [editingProvider, modalEditedName, modalEditedAddress, modalEditedContact, data, onDataUpdate])

  const handleCancelEdit = useCallback(() => {
    setEditingProvider(null) // Close modal without saving
  }, [])

  const handleIgnore = useCallback(
    (providerToIgnore: UnmatchedProvider) => {
      setFadingOutId(providerToIgnore.id) // Start fade out animation

      setTimeout(() => {
        const updatedData = data.filter((p) => p.id !== providerToIgnore.id)
        onDataUpdate(updatedData) // Remove from parent's unmatched list
        setIgnoredProviders((prev) => [...prev, providerToIgnore]) // Add to ignored list
        setFadingOutId(null) // Reset fading out state

        toast({
          title: "Provider Ignored",
          description: `"${providerToIgnore.providerName}" has been moved to ignored.`,
          duration: 3000,
          // position: "bottom-right", // This would be configured in the ToastProvider
        })
      }, 300) // Match CSS transition duration
    },
    [data, onDataUpdate],
  )

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow>
            {/* */}
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.size === data.length && data.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all unmatched providers"
              />
            </TableHead>
            {/* */}
            <TableHead>Provider Name</TableHead>
            {/* */}
            <TableHead>Address</TableHead>
            {/* */}
            <TableHead>Contact</TableHead>
            {/* */}
            <TableHead>Source File</TableHead>
            {/* */}
            <TableHead>Issue</TableHead>
            {/* */}
            <TableHead className="w-[120px]">Quick Actions</TableHead>
            {/* */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              {/* */}
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                No unmatched providers to display.
              </TableCell>
              {/* */}
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={row.id}
                className={cn("transition-opacity duration-300 ease-out", fadingOutId === row.id && "opacity-0")}
              >
                {/* */}
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                    aria-label={`Select row for ${row.providerName}`}
                  />
                </TableCell>
                {/* */}
                <TableCell className="font-medium">{row.providerName}</TableCell>
                {/* */}
                <TableCell>{row.address}</TableCell>
                {/* */}
                <TableCell
                  className="blur-sm hover:blur-none transition-all duration-200"
                  title="Hover to reveal contact"
                >
                  {row.contact}
                </TableCell>
                {/* */}
                <TableCell>{row.sourceFile}</TableCell>
                {/* */}
                <TableCell>{row.issue}</TableCell>
                {/* */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSuggestFixes(row)}>
                        <span role="img" aria-label="rocket emoji">
                          🚀
                        </span>{" "}
                        Suggest Fixes
                      </DropdownMenuItem>
                      {suggestions[row.id] && suggestions[row.id].length > 0 && (
                        <div className="px-2 py-1 text-sm text-gray-500">
                          <p className="font-semibold mb-1">Suggestions:</p>
                          {suggestions[row.id].map((s, index) => (
                            <div key={s.id} className="mb-1 last:mb-0">
                              <p className="text-xs">
                                {index + 1}. {s.providerName} ({s.confidence}%)
                              </p>
                              <p className="text-xs text-gray-400 pl-3">{s.address}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <DropdownMenuItem onClick={() => handleEdit(row)}>
                        <span role="img" aria-label="pencil emoji">
                          ✏️
                        </span>{" "}
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleIgnore(row)} className="text-red-600">
                        <span role="img" aria-label="trash can emoji">
                          🗑️
                        </span>{" "}
                        Ignore
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                {/* */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Display Ignored Providers (optional, could be a separate component/tab) */}
      {ignoredProviders.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Ignored Providers</h3>
          <div className="flex flex-wrap gap-2">
            {ignoredProviders.map((p) => (
              <Badge key={p.id} variant="secondary" className="flex items-center gap-1">
                {p.providerName}
                <span className="text-xs text-gray-500">(Ignored)</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      <Dialog open={!!editingProvider} onOpenChange={setEditingProvider}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Unmatched Provider</DialogTitle>
            <DialogDescription>
              Make changes to the provider details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modal-name" className="text-right">
                Name
              </Label>
              <Input
                id="modal-name"
                value={modalEditedName}
                onChange={(e) => setModalEditedName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modal-address" className="text-right">
                Address
              </Label>
              <Textarea
                id="modal-address"
                value={modalEditedAddress}
                onChange={(e) => setModalEditedAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modal-contact" className="text-right">
                Contact
              </Label>
              <Input
                id="modal-contact"
                value={modalEditedContact}
                onChange={(e) => setModalEditedContact(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
