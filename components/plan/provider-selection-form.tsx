"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Provider {
  id: string
  name: string
  type: string
  location: string
  status: string
  phone?: string
  hours?: string
}

interface ProviderSelectionFormProps {
  onNext: () => void
  onBack: () => void
  selectedProviders: Provider[]
  onProvidersChange: (providers: Provider[]) => void
}

export function ProviderSelectionForm({
  onNext,
  onBack,
  selectedProviders,
  onProvidersChange,
}: ProviderSelectionFormProps) {
  const [providers, setProviders] = useState(selectedProviders)

  const handleNext = () => {
    onProvidersChange(providers)
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">Provider selection interface will be implemented here.</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
