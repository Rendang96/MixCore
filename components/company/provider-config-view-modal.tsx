"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { ProviderConfig } from "./medical-provider-form"

interface ProviderConfigViewModalProps {
  isOpen: boolean
  onClose: () => void
  providerConfig: ProviderConfig
}

// Helper function to format service type for display
const formatServiceType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    gp: "GP",
    sp: "SP",
    oc: "OC",
    dt: "DT",
    hp: "HP",
    mt: "MT",
  }
  return typeMap[type] || type.toUpperCase()
}

// Helper function to format panelship for display
const formatPanelship = (panelship: string): string => {
  const panelshipMap: { [key: string]: string } = {
    all: "All",
    panel: "Panel",
    select_access: "Select Access",
  }
  return panelshipMap[panelship] || panelship
}

// Helper function to format provider type for display
const formatProviderType = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    all: "All",
    government: "Government",
    semi_government: "Semi-Government",
    private: "Private",
    corporatised: "Corporatised",
  }
  return typeMap[type] || type
}

// Helper function to format payment method for display
const formatPaymentMethod = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    cashless: "Cashless",
    pay_and_claim: "Pay and Claim",
    both: "Both",
  }
  return methodMap[method] || method
}

// Helper function to format access rule for display
const formatAccessRule = (rule: string): string => {
  const ruleMap: { [key: string]: string } = {
    "direct-access": "Direct Access",
    referral: "Referral",
    gl: "GL",
  }
  return ruleMap[rule] || rule
}

export function ProviderConfigViewModal({ isOpen, onClose, providerConfig }: ProviderConfigViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Provider Configuration Details</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Service Types</h4>
              <div className="flex flex-wrap gap-2">
                {providerConfig.serviceType ? (
                  providerConfig.serviceType
                    .split(", ")
                    .filter(Boolean)
                    .map((type, index) => (
                      <Badge key={index} variant="secondary">
                        {formatServiceType(type)}
                      </Badge>
                    ))
                ) : (
                  <span className="text-slate-500">Not specified</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Panelship</h4>
              <p className="text-slate-900">{formatPanelship(providerConfig.panelship) || "Not specified"}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Provider Categories</h4>
              <div className="flex flex-wrap gap-2">
                {providerConfig.providerType ? (
                  providerConfig.providerType
                    .split(", ")
                    .filter(Boolean)
                    .map((type, index) => (
                      <Badge key={index} variant="secondary">
                        {formatProviderType(type)}
                      </Badge>
                    ))
                ) : (
                  <span className="text-slate-500">Not specified</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">State</h4>
              <p className="text-slate-900">{providerConfig.state || "Not specified"}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Payment Method</h4>
              <p className="text-slate-900">{formatPaymentMethod(providerConfig.paymentMethod) || "Not specified"}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Access Rule</h4>
              <p className="text-slate-900">{formatAccessRule(providerConfig.accessRule) || "Not specified"}</p>
            </div>
          </div>

          {/* Selected Providers */}
          {providerConfig.panelship === "select_access" &&
            providerConfig.selectedProviders &&
            providerConfig.selectedProviders.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-4">Selected Providers</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {(() => {
                    const groupedProviders = providerConfig.selectedProviders.reduce(
                      (acc: Record<string, any[]>, selectedProvider: any) => {
                        const type = selectedProvider.type.toUpperCase()
                        if (!acc[type]) acc[type] = []
                        acc[type].push(selectedProvider)
                        return acc
                      },
                      {},
                    )

                    return Object.entries(groupedProviders).map(([type, typeProviders]) => (
                      <div key={type} className="mb-4 last:mb-0">
                        <div className="text-xs font-medium text-gray-600 mb-2 tracking-wide">
                          {type === "CLINIC"
                            ? "CLINICS"
                            : type === "HOSPITAL"
                              ? "HOSPITALS"
                              : type === "PHARMACY"
                                ? "PHARMACIES"
                                : type === "DENTIST"
                                  ? "DENTISTS"
                                  : type === "PHYSIOTHERAPY"
                                    ? "PHYSIOTHERAPY"
                                    : type}
                        </div>
                        <div className="space-y-2">
                          {typeProviders.map((selectedProvider: any) => (
                            <div key={selectedProvider.id} className="bg-white border border-gray-200 rounded p-3">
                              <div className="font-medium text-slate-800 text-sm">{selectedProvider.name}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Code: {selectedProvider.code} • {selectedProvider.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  })()}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Total selected: {providerConfig.selectedProviders.length} providers
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
