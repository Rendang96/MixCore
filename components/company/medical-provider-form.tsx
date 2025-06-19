"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, X } from "lucide-react"

interface MedicalProviderFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: ProviderConfig[]
  onSaveData?: (data: ProviderConfig[]) => void
}

interface ProviderConfig {
  id: string
  serviceType: string
  panelship: string
  providerType: string
  state: string
  paymentMethod: string
  accessRule: string
}

export function MedicalProviderForm({ onNext, onBack, initialData, onSaveData }: MedicalProviderFormProps) {
  const [providers, setProviders] = useState<ProviderConfig[]>(
    initialData && initialData.length > 0
      ? initialData
      : [
          {
            id: "provider-1",
            serviceType: "",
            panelship: "",
            providerType: "",
            state: "",
            paymentMethod: "",
            accessRule: "",
          },
        ],
  )

  useEffect(() => {
    // Save data to parent component when providers change
    if (onSaveData) {
      onSaveData(providers)
    }
  }, [providers, onSaveData])

  const addProvider = () => {
    setProviders([
      ...providers,
      {
        id: `provider-${providers.length + 1}`,
        serviceType: "",
        panelship: "",
        providerType: "",
        state: "",
        paymentMethod: "",
        accessRule: "",
      },
    ])
  }

  const removeProvider = (id: string) => {
    if (providers.length > 1) {
      setProviders(providers.filter((provider) => provider.id !== id))
    }
  }

  const updateProvider = (id: string, field: keyof ProviderConfig, value: string) => {
    setProviders(providers.map((provider) => (provider.id === id ? { ...provider, [field]: value } : provider)))
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-slate-800 mb-8">Medical Provider</h3>

      {providers.map((provider, index) => (
        <div key={provider.id} className="mb-8 border border-slate-200 rounded-lg p-6 relative">
          {providers.length > 1 && (
            <button
              onClick={() => removeProvider(provider.id)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
              aria-label="Remove provider"
            >
              <X size={20} />
            </button>
          )}

          <h4 className="text-lg font-medium text-slate-700 mb-6">Provider {index + 1}</h4>

          <div className="grid grid-cols-2 gap-8 mb-4">
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">Service Type</label>
              <Select
                value={provider.serviceType}
                onValueChange={(value) => updateProvider(provider.id, "serviceType", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gp">GP</SelectItem>
                  <SelectItem value="sp">SP</SelectItem>
                  <SelectItem value="oc">OC</SelectItem>
                  <SelectItem value="dt">DT</SelectItem>
                  <SelectItem value="hp">HP</SelectItem>
                  <SelectItem value="mt">MT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">Panelship</label>
              <Select
                value={provider.panelship}
                onValueChange={(value) => updateProvider(provider.id, "panelship", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panel">Panel</SelectItem>
                  <SelectItem value="non-panel">Non-Panel</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">Provider Type</label>
              <Select
                value={provider.providerType}
                onValueChange={(value) => updateProvider(provider.id, "providerType", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="semi_private">Semi-Private</SelectItem>
                  <SelectItem value="corporatised">Corporatised</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">State</label>
              <Select value={provider.state} onValueChange={(value) => updateProvider(provider.id, "state", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selangor">Selangor</SelectItem>
                  <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                  <SelectItem value="penang">Penang</SelectItem>
                  <SelectItem value="johor">Johor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">Payment Method</label>
              <Select
                value={provider.paymentMethod}
                onValueChange={(value) => updateProvider(provider.id, "paymentMethod", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashless">Cashless</SelectItem>
                  <SelectItem value="reimbursement">Reimbursement</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">Access Rule</label>
              <Select
                value={provider.accessRule}
                onValueChange={(value) => updateProvider(provider.id, "accessRule", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct-access">Direct Access</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="gl">GL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" className="flex items-center gap-2 mb-8" onClick={addProvider}>
        <PlusCircle size={16} />
        Add New Provider
      </Button>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={onNext}>
          Save
        </Button>
      </div>
    </div>
  )
}
