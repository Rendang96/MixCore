"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getCorporateClients, type CorporateClient } from "@/lib/corporate-client/corporate-client-storage"
import { CorporateClientEditForm } from "@/components/onboarding/corporate-client-edit-form"

export default function EditCorporateClientPage() {
  const params = useParams()
  const [client, setClient] = useState<CorporateClient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const clientId = params.id as string
    const clients = getCorporateClients()
    const foundClient = clients.find((c) => c.id === clientId)

    setClient(foundClient || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!client) {
    return <div className="flex items-center justify-center min-h-screen">Corporate client not found</div>
  }

  return <CorporateClientEditForm client={client} />
}
