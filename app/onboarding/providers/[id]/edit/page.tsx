"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditOnboardingProviderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [provider, setProvider] = useState<any>(null)

  useEffect(() => {
    // Simulate API call to fetch provider data
    const fetchProvider = async () => {
      setIsLoading(true)
      try {
        // In a real application, you would fetch this data from your API
        // const response = await fetch(`/api/onboarding/providers/${params.id}`)
        // const data = await response.json()

        // For demo purposes, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock provider data based on ID
        setProvider({
          id: params.id,
          applicationCode: "OB-2023-00" + params.id,
          name: params.id === "1" ? "John Smith" : "Sarah Lee",
          providerName: params.id === "1" ? "ABC Medical Center" : "Wellness Clinic",
          tinNumber: params.id === "1" ? "123456789" : "987654321",
          email: params.id === "1" ? "john@abcmedical.com" : "sarah@wellnessclinic.com",
          phoneNumber: params.id === "1" ? "012-3456789" : "019-8765432",
          state: params.id === "1" ? "kuala-lumpur" : "selangor",
          status: params.id === "1" ? "filling" : "verification",
          notes: "Provider has been contacted via email and is in the process of completing their registration.",
          providerType: params.id === "1" ? "Medical" : "Wellness",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load provider data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProvider()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get form data
      const formData = new FormData(e.currentTarget)
      const providerData = Object.fromEntries(formData.entries())

      // Simulate API call to update data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real application, you would send this data to your API
      // const response = await fetch(`/api/onboarding/providers/${params.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(providerData),
      // })

      toast({
        title: "Provider updated",
        description: "The provider information has been updated successfully.",
      })

      // Navigate back to the provider details
      router.push(`/onboarding/providers/${params.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the provider. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading provider data...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Provider Not Found" description="The requested provider could not be found." />
        <Button asChild className="mt-4">
          <Link href="/onboarding/providers">Back to Providers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit Provider: ${provider.name}`} description="Update provider information" />

      <Card>
        <CardHeader>
          <CardTitle>Provider Details</CardTitle>
          <CardDescription>Update the basic information for this provider.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationCode">Application Code</Label>
                  <Input
                    id="applicationCode"
                    name="applicationCode"
                    defaultValue={provider.applicationCode}
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated by the system</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={provider.name} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="providerType">Provider Type</Label>
                <Input id="providerType" name="providerType" defaultValue={provider.providerType} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="providerName">Provider Name</Label>
                <Input id="providerName" name="providerName" defaultValue={provider.providerName} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tinNumber">TIN Number</Label>
                  <Input id="tinNumber" name="tinNumber" defaultValue={provider.tinNumber} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={provider.email} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" defaultValue={provider.phoneNumber} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select name="state" defaultValue={provider.state} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                      <SelectItem value="selangor">Selangor</SelectItem>
                      <SelectItem value="penang">Penang</SelectItem>
                      <SelectItem value="johor">Johor</SelectItem>
                      <SelectItem value="sabah">Sabah</SelectItem>
                      <SelectItem value="sarawak">Sarawak</SelectItem>
                      {/* Add other Malaysian states */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={provider.status} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filling">Provider Filling Form</SelectItem>
                    <SelectItem value="verification">Waiting Verification</SelectItem>
                    <SelectItem value="ceo-approval">CEO Approval</SelectItem>
                    <SelectItem value="payment">Pending Payment</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pnm-verified">Verified by PNM</SelectItem>
                    <SelectItem value="pnm-approved">Approved by PNM Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={4} defaultValue={provider.notes} />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/onboarding/providers/${params.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
