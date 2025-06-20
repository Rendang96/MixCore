"use client"

import { useFormikContext } from "formik"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import { useState, useMemo } from "react"
import type { PlanCreationFormValues, Provider } from "@/types/plan-creation-form"
import { DUMMY_PROVIDERS } from "@/lib/plan/dummy-provider-data"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProviderSelectionStep() {
  const { values, setFieldValue } = useFormikContext<PlanCreationFormValues>()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProviders = useMemo(() => {
    if (!searchTerm) {
      return DUMMY_PROVIDERS
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return DUMMY_PROVIDERS.filter(
      (provider) =>
        provider.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        provider.address.toLowerCase().includes(lowerCaseSearchTerm) ||
        provider.type.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [searchTerm])

  const handleAddProvider = (provider: Provider) => {
    if (!values.selectedProviders.some((p) => p.id === provider.id)) {
      setFieldValue("selectedProviders", [...values.selectedProviders, provider])
    }
  }

  const handleRemoveProvider = (providerId: string) => {
    setFieldValue(
      "selectedProviders",
      values.selectedProviders.filter((p) => p.id !== providerId),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Providers</CardTitle>
          <CardDescription>Search and select specific providers for this plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search providers by name, address, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provider Search Results */}
            <div className="space-y-2">
              <Label>Available Providers ({filteredProviders.length})</Label>
              <ScrollArea className="h-[400px] border rounded-md p-4">
                {filteredProviders.length === 0 ? (
                  <p className="text-center text-gray-500">No providers found.</p>
                ) : (
                  filteredProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <h4 className="font-semibold">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.address}</p>
                        <p className="text-xs text-gray-500">
                          {provider.phone} | Hours: {provider.hours} | Type: {provider.type}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddProvider(provider)}
                        disabled={values.selectedProviders.some((p) => p.id === provider.id)}
                        className="bg-black text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Selected Providers */}
            <div className="space-y-2">
              <Label>Selected Providers ({values.selectedProviders.length})</Label>
              <ScrollArea className="h-[400px] border rounded-md p-4">
                {values.selectedProviders.length === 0 ? (
                  <p className="text-center text-gray-500">No providers selected.</p>
                ) : (
                  values.selectedProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <h4 className="font-semibold">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.address}</p>
                        <p className="text-xs text-gray-500">
                          {provider.phone} | Hours: {provider.hours} | Type: {provider.type}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProvider(provider.id)}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
