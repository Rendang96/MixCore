"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import { getCatalogueById, type Catalogue, type CatalogueItem } from "@/lib/catalogue/catalogue-storage"

export default function ViewCataloguePage() {
  const params = useParams()
  const router = useRouter()
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      const fetchedCatalogue = getCatalogueById(id)
      setCatalogue(fetchedCatalogue || null)
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto py-6">Loading...</div>
  }

  if (!catalogue) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Catalogue Not Found</h1>
        <Button onClick={() => router.push("/catalogue/records")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalogues
        </Button>
      </div>
    )
  }

  const preExistingItems = catalogue.items.filter((item) => item.type === "pre-existing")
  const specifiedItems = catalogue.items.filter((item) => item.type === "specified")
  const congenitalItems = catalogue.items.filter((item) => item.type === "congenital")
  const exclusionItems = catalogue.items.filter((item) => item.type === "exclusion")

  const renderItemList = (items: CatalogueItem[]) => {
    if (items.length === 0) {
      return <p className="text-gray-500 py-4">No items in this category.</p>
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <h4 className="font-medium">{item.name}</h4>
                {item.description && <p className="text-sm text-gray-500">{item.description}</p>}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  {item.waitingPeriod && (
                    <div>
                      <span className="text-xs text-gray-500 block">Waiting Period</span>
                      <span className="font-medium">{item.waitingPeriod}</span>
                    </div>
                  )}

                  {item.coInsurance && (
                    <div>
                      <span className="text-xs text-gray-500 block">Co-Insurance</span>
                      <span className="font-medium">{item.coInsurance}</span>
                    </div>
                  )}

                  {item.deductible && (
                    <div>
                      <span className="text-xs text-gray-500 block">Deductible</span>
                      <span className="font-medium">{item.deductible}</span>
                    </div>
                  )}

                  {item.coPayment && (
                    <div>
                      <span className="text-xs text-gray-500 block">Co-Payment</span>
                      <span className="font-medium">{item.coPayment}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/catalogue/records")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{catalogue.name}</h1>
          <Badge variant="outline" className="capitalize">
            {catalogue.status}
          </Badge>
        </div>
        <Button onClick={() => router.push(`/catalogue/edit/${catalogue.id}`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Catalogue
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Catalogue ID</h3>
              <p>{catalogue.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="capitalize">{catalogue.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="capitalize">{catalogue.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p>{catalogue.lastUpdated}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p>{catalogue.description || "No description provided."}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue={
              preExistingItems.length > 0
                ? "preExisting"
                : specifiedItems.length > 0
                  ? "specified"
                  : congenitalItems.length > 0
                    ? "congenital"
                    : "exclusion"
            }
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="preExisting">Pre-Existing Conditions ({preExistingItems.length})</TabsTrigger>
              <TabsTrigger value="specified">Specified Illnesses ({specifiedItems.length})</TabsTrigger>
              <TabsTrigger value="congenital">Congenital Conditions ({congenitalItems.length})</TabsTrigger>
              <TabsTrigger value="exclusion">General Exclusions ({exclusionItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="preExisting">{renderItemList(preExistingItems)}</TabsContent>

            <TabsContent value="specified">{renderItemList(specifiedItems)}</TabsContent>

            <TabsContent value="congenital">{renderItemList(congenitalItems)}</TabsContent>

            <TabsContent value="exclusion">{renderItemList(exclusionItems)}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
