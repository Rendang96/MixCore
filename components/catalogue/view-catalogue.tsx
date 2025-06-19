"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, ArrowLeft } from "lucide-react"
import type { Catalogue, CatalogueItem } from "@/lib/catalogue/catalogue-storage"

interface ViewCatalogueProps {
  catalogue: Catalogue
  onClose: () => void
}

export function ViewCatalogue({ catalogue, onClose }: ViewCatalogueProps) {
  const [activeTab, setActiveTab] = useState("all")

  const getItemsByType = (type: string) => {
    return catalogue.items.filter((item) => item.type === type)
  }

  const renderItemDetails = (item: CatalogueItem) => (
    <div key={item.id} className="border rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{item.name}</h4>
          {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
        </div>
        <Badge variant="outline" className="capitalize">
          {item.type.replace("-", " ")}
        </Badge>
      </div>

      {/* Financial parameters */}
      {(item.waitingPeriod || item.coInsurance || item.deductible || item.coPayment) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t">
          {item.waitingPeriod && (
            <div>
              <p className="text-xs text-gray-500">Waiting Period</p>
              <p className="text-sm font-medium">{item.waitingPeriod}</p>
            </div>
          )}
          {item.coInsurance && (
            <div>
              <p className="text-xs text-gray-500">Co-Insurance</p>
              <p className="text-sm font-medium">{item.coInsurance}</p>
            </div>
          )}
          {item.deductible && (
            <div>
              <p className="text-xs text-gray-500">Deductible</p>
              <p className="text-sm font-medium">{item.deductible}</p>
            </div>
          )}
          {item.coPayment && (
            <div>
              <p className="text-xs text-gray-500">Co-Payment</p>
              <p className="text-sm font-medium">{item.coPayment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-bold">{catalogue.name}</h2>
            <Badge variant="outline" className="ml-2 capitalize">
              {catalogue.status}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Catalogue ID</p>
            <p className="font-medium">{catalogue.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium capitalize">{catalogue.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium capitalize">{catalogue.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium">{catalogue.lastUpdated}</p>
          </div>
        </div>

        {catalogue.description && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1">{catalogue.description}</p>
          </div>
        )}

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All Items ({catalogue.items.length})</TabsTrigger>
            <TabsTrigger value="pre-existing">Pre-Existing ({getItemsByType("pre-existing").length})</TabsTrigger>
            <TabsTrigger value="specified">Specified ({getItemsByType("specified").length})</TabsTrigger>
            <TabsTrigger value="congenital">Congenital ({getItemsByType("congenital").length})</TabsTrigger>
            <TabsTrigger value="exclusion">Exclusions ({getItemsByType("exclusion").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {catalogue.items.length > 0 ? (
              <div className="space-y-2">{catalogue.items.map(renderItemDetails)}</div>
            ) : (
              <div className="text-center py-8 text-gray-500">No items in this catalogue.</div>
            )}
          </TabsContent>

          <TabsContent value="pre-existing" className="mt-4">
            {getItemsByType("pre-existing").length > 0 ? (
              <div className="space-y-2">{getItemsByType("pre-existing").map(renderItemDetails)}</div>
            ) : (
              <div className="text-center py-8 text-gray-500">No pre-existing conditions in this catalogue.</div>
            )}
          </TabsContent>

          <TabsContent value="specified" className="mt-4">
            {getItemsByType("specified").length > 0 ? (
              <div className="space-y-2">{getItemsByType("specified").map(renderItemDetails)}</div>
            ) : (
              <div className="text-center py-8 text-gray-500">No specified illnesses in this catalogue.</div>
            )}
          </TabsContent>

          <TabsContent value="congenital" className="mt-4">
            {getItemsByType("congenital").length > 0 ? (
              <div className="space-y-2">{getItemsByType("congenital").map(renderItemDetails)}</div>
            ) : (
              <div className="text-center py-8 text-gray-500">No congenital conditions in this catalogue.</div>
            )}
          </TabsContent>

          <TabsContent value="exclusion" className="mt-4">
            {getItemsByType("exclusion").length > 0 ? (
              <div className="space-y-2">{getItemsByType("exclusion").map(renderItemDetails)}</div>
            ) : (
              <div className="text-center py-8 text-gray-500">No exclusions in this catalogue.</div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
