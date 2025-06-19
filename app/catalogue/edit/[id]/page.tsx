"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getCatalogueById, type Catalogue } from "@/lib/catalogue/catalogue-storage"
import { EditCatalogue } from "@/components/catalogue/edit-catalogue"

export default function EditCataloguePage() {
  const params = useParams()
  const router = useRouter()
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      console.log("Fetching catalogue with ID:", id)
      const fetchedCatalogue = getCatalogueById(id)
      console.log("Fetched catalogue:", fetchedCatalogue)
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

  const handleClose = () => {
    router.push("/catalogue/records")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/catalogue/records")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalogues
        </Button>
        <h1 className="text-2xl font-bold ml-4">Edit Catalogue: {catalogue.name}</h1>
      </div>

      <EditCatalogue catalogue={catalogue} onClose={handleClose} />
    </div>
  )
}
