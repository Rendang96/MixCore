"use client"

import { useState, useCallback } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { MatchedProvidersTable } from "@/components/matched-providers-table"
import { UnmatchedProvidersTable } from "@/components/unmatched-providers-table"
import { ActionBar } from "@/components/action-bar"
import { ConfidenceThresholdSlider } from "@/components/confidence-threshold-slider"
import { MappingHistoryTable, type MappingHistoryEntry } from "@/components/mapping-history-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  mockMatchProviders,
  type UploadedProvider,
  type MatchedProvider,
  type UnmatchedProvider,
} from "@/lib/mock-data-matching"
import { toast } from "@/hooks/use-toast"

export default function ProviderDataMappingPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [matchedProviders, setMatchedProviders] = useState<MatchedProvider[]>([])
  const [unmatchedProviders, setUnmatchedProviders] = useState<UnmatchedProvider[]>([])
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(75)
  const [isMatching, setIsMatching] = useState(false)
  const [activeTab, setActiveTab] = useState("mapping")
  const [mappingHistory, setMappingHistory] = useState<MappingHistoryEntry[]>([])

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file)
    toast({
      title: "File Uploaded",
      description: `${file.name} is ready for mapping.`,
    })
  }, [])

  const handleReset = useCallback(() => {
    setUploadedFile(null)
    setCompanyName("")
    setMatchedProviders([])
    setUnmatchedProviders([])
    toast({
      title: "Reset",
      description: "All data has been cleared for new mapping.",
    })
    setActiveTab("mapping")
  }, [])

  const startMatching = useCallback(async () => {
    if (!uploadedFile) {
      toast({
        title: "No File",
        description: "Please upload a file first.",
        variant: "destructive",
      })
      return
    }
    if (!companyName.trim()) {
      toast({
        title: "Company Name Missing",
        description: "Please enter the company name before mapping.",
        variant: "destructive",
      })
      return
    }

    setIsMatching(true)
    toast({
      title: "Matching Data",
      description: "Processing your provider list...",
    })

    try {
      // Simulate parsing the uploaded file into UploadedProvider[]
      const mockUploadedData: UploadedProvider[] = [
        {
          id: "temp-1",
          name: "Klinik ABC",
          address: "Jalan Tun Razak",
          contact: "03-XXXX XXXX",
          sourceFile: uploadedFile.name,
        },
        {
          id: "temp-2",
          name: "Hospital XYZ (Non-Panel)",
          address: "Jalan Bukit Bintang",
          contact: "03-YYYY YYYY",
          sourceFile: uploadedFile.name,
        },
        {
          id: "temp-3",
          name: "Klinik ABC 123",
          address: "Jln Tun Razak",
          contact: "03-ZZZ ZZZZ",
          sourceFile: uploadedFile.name,
        },
        {
          id: "temp-4",
          name: "Dental Clinic",
          address: "Missing address",
          contact: "-",
          sourceFile: uploadedFile.name,
        },
        {
          id: "temp-5",
          name: "New Medical Center",
          address: "123 Main St",
          contact: "012-3456789",
          sourceFile: uploadedFile.name,
        },
      ]

      const { matched, unmatched } = await mockMatchProviders(mockUploadedData)
      setMatchedProviders(matched)
      setUnmatchedProviders(unmatched)

      // Record mapping history
      setMappingHistory((prev) => [
        {
          id: Date.now().toString(),
          fileName: uploadedFile.name,
          companyName: companyName,
          matchedCount: matched.length,
          unmatchedCount: unmatched.length,
          mappedBy: "Admin User", // Mock username
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ])

      toast({
        title: "Matching Complete",
        description: `${matched.length} providers matched, ${unmatched.length} needing review.`,
      })
    } catch (error) {
      toast({
        title: "Matching Error",
        description: "Failed to process data. Please try again.",
        variant: "destructive",
      })
      console.error("Matching error:", error)
    } finally {
      setIsMatching(false)
    }
  }, [uploadedFile, companyName])

  const retryWithStrictRules = useCallback(async () => {
    toast({
      title: "Retrying",
      description: "Applying stricter matching rules...",
    })
    setIsMatching(true)
    // Simulate re-matching with stricter rules (e.g., by filtering current unmatched)
    const reMatched: MatchedProvider[] = []
    const reUnmatched: UnmatchedProvider[] = []

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay

    unmatchedProviders.forEach((p) => {
      if (p.issue === "Name typo" && Math.random() > 0.5) {
        // Simulate some getting matched
        reMatched.push({
          id: `matched-${p.id}`,
          providerCode: `PRV-${Math.floor(Math.random() * 10000)}`,
          providerName: p.providerName.replace(" 123", ""), // Simulate fix
          address: p.address,
          contact: p.contact,
          panelStatus: Math.random() > 0.5 ? "✅ Panel" : "❌ Non-Panel",
          nearbyPanelAlternatives: Math.random() > 0.5 ? "1. Klinik DEF (2.3km)" : "-",
        })
      } else {
        reUnmatched.push(p)
      }
    })
    setMatchedProviders((prev) => [...prev, ...reMatched])
    setUnmatchedProviders(reUnmatched)
    setIsMatching(false)
    toast({
      title: "Retry Complete",
      description: `${reMatched.length} more providers matched.`,
    })
  }, [unmatchedProviders])

  const exportUnmatchedCSV = useCallback(() => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Provider Name", "Address", "Contact", "Source File", "Issue"].join(",") +
      "\n" +
      unmatchedProviders
        .map((e) =>
          [`"${e.providerName}"`, `"${e.address}"`, `"${e.contact}"`, `"${e.sourceFile}"`, `"${e.issue}"`].join(","),
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "unmatched_providers.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({
      title: "Exported",
      description: "Unmatched providers exported to CSV.",
    })
  }, [unmatchedProviders])

  const handleUnmatchedDataUpdate = useCallback((updatedData: UnmatchedProvider[]) => {
    setUnmatchedProviders(updatedData)
  }, [])

  const showResults = matchedProviders.length > 0 || unmatchedProviders.length > 0

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Provider Data Mapping"
        description="Streamline provider data integration with intelligent matching and bulk actions."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mx-auto">
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Provider List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  placeholder="e.g., Acme Health Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isMatching}
                  className="w-full"
                />
              </div>
              <FileUploader
                accept=".csv,.xlsx,.json"
                maxSize="5MB"
                onError={(error) =>
                  toast({ title: "Upload Error", description: error.message, variant: "destructive" })
                }
                helperText="Upload provider lists (Name, Address, Contact, Source)"
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset} disabled={isMatching}>
                  Reset
                </Button>
                <Button onClick={startMatching} disabled={isMatching || !uploadedFile || !companyName.trim()}>
                  {isMatching ? "Mapping..." : "Map Data"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {showResults && (
            <>
              {companyName && (
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {companyName} - <span className="text-gray-600">Mapping Results</span>
                </h2>
              )}

              <ActionBar stats={`${matchedProviders.length} matched · ${unmatchedProviders.length} needing review`}>
                <Button onClick={retryWithStrictRules} disabled={isMatching || unmatchedProviders.length === 0}>
                  <span className="sr-only">Retry with Strict Rules</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                  Retry with Strict Rules
                </Button>
                <Button onClick={exportUnmatchedCSV} disabled={unmatchedProviders.length === 0}>
                  <span className="sr-only">Export Unmatched</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Export Unmatched
                </Button>
                <ConfidenceThresholdSlider
                  value={[autoApproveThreshold]}
                  onValueChange={(v) => setAutoApproveThreshold(v[0])}
                />
              </ActionBar>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Matched Providers ({matchedProviders.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MatchedProvidersTable data={matchedProviders} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Unmatched Providers ({unmatchedProviders.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UnmatchedProvidersTable data={unmatchedProviders} onDataUpdate={handleUnmatchedDataUpdate} />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mapping History</CardTitle>
            </CardHeader>
            <CardContent>
              <MappingHistoryTable data={mappingHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
