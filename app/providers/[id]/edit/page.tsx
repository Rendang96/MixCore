"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

// Add API integration, validation, and optimistic updates

// Import necessary hooks and utilities at the top of the file
import { useRouter } from "next/navigation"
import { z } from "zod"
import { getProvider, saveProvider, getSetupData } from "@/lib/local-storage"

// Add a validation schema after the imports
const providerSchema = z.object({
  providerType: z.string().min(1, "Provider type is required"),
  providerCode: z.string().min(1, "Provider code is required"),
  providerName: z.string().min(1, "Provider name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  telNumber: z.string().min(1, "Telephone number is required"),
  email: z.string().email("Invalid email address"),
  companyRegNo: z.string().min(1, "Company registration number is required"),
  tinNo: z.string().min(1, "TIN number is required"),
  providerCategory: z.string().min(1, "Provider category is required"),
})

export default function EditProviderPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)

  // Add these state variables inside the component
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [setupData, setSetupData] = useState<any>(null)
  const router = useRouter()
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [consultationCharges, setConsultationCharges] = useState<number>(0)

  // Replace the useEffect for fetching provider data
  useEffect(() => {
    // Load provider data from local storage
    const fetchProvider = async () => {
      setIsLoading(true)
      try {
        const providerData = getProvider(params.id)

        if (!providerData) {
          toast({
            title: "Provider Not Found",
            description: "The requested provider could not be found. Please check the provider ID and try again.",
            variant: "destructive",
          })
          setTimeout(() => {
            router.push("/providers")
          }, 3000)
          return
        }

        console.log("Provider data loaded:", providerData)
        setProvider(providerData)

        // Set all the state variables with the fetched data
        if (providerData.selectedLanguages) {
          setSelectedLanguages(providerData.selectedLanguages)
        }

        if (providerData.consultationCharges) {
          setConsultationCharges(providerData.consultationCharges)
        }
      } catch (error) {
        console.error("Error fetching provider data:", error)
        toast({
          title: "Provider Not Found",
          description: "The requested provider could not be found. Please check the provider ID and try again.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push("/providers")
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProvider()

    // Also load setup data from local storage
    const loadSetupData = () => {
      try {
        const data = getSetupData()
        setSetupData(data)
        // Set state variables with loaded data
        // ...
      } catch (error) {
        console.error("Error loading setup data:", error)
        toast({
          title: "Warning",
          description: "Failed to load setup data. Some options may be using default values.",
          variant: "warning",
        })
      }
    }

    loadSetupData()
  }, [params.id, router])

  // Replace the handleSubmit function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Collect form data
    const formData = new FormData(e.currentTarget)
    const providerData: Record<string, any> = Object.fromEntries(formData.entries())

    // Add additional data that's not in form fields
    // Similar to the create page, add all the state variables to providerData

    try {
      // Validate the data
      const validationResult = providerSchema.safeParse(providerData)

      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {}
        validationResult.error.issues.forEach((issue) => {
          formattedErrors[issue.path[0].toString()] = issue.message
        })
        setErrors(formattedErrors)

        // Scroll to the first error
        const firstErrorField = document.getElementById(Object.keys(formattedErrors)[0])
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
          firstErrorField.focus()
        }

        toast({
          title: "Validation Error",
          description: "Please correct the highlighted fields.",
          variant: "destructive",
        })

        setIsSubmitting(false)
        return
      }

      // Update provider in local storage
      const updatedProvider = {
        ...provider,
        ...providerData,
        updatedAt: new Date().toISOString(),
      }

      saveProvider(updatedProvider)

      toast({
        title: "Provider updated",
        description: "The provider has been updated successfully.",
      })

      // Navigate to the providers list
      router.push("/providers")
    } catch (error) {
      console.error("Error updating provider:", error)
      toast({
        title: "Error",
        description: "There was an error updating the provider. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add this helper function to check for field errors
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? { error: true, message: errors[fieldName] } : {}
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
          <Link href="/providers">Back to Providers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader title={`Edit Provider: ${provider.name}`} description="Update provider information" />

      <form onSubmit={handleSubmit}>
        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <div className="space-y-1">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  1
                </div>
                Profile
              </Button>
              <Button
                variant={activeTab === "payment" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("payment")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  2
                </div>
                Payment
              </Button>
              <Button
                variant={activeTab === "charges" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("charges")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  3
                </div>
                Charges
              </Button>
              <Button
                variant={activeTab === "capabilities" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("capabilities")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  4
                </div>
                Capabilities
              </Button>
              <Button
                variant={activeTab === "experience" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("experience")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  5
                </div>
                Experience
              </Button>
              <Button
                variant={activeTab === "personnel" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("personnel")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  6
                </div>
                Personnel
              </Button>
              <Button
                variant={activeTab === "contract" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("contract")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  7
                </div>
                Contract
              </Button>
              <Button
                variant={activeTab === "advertisement" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("advertisement")}
                type="button"
              >
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  8
                </div>
                Advertisement
              </Button>
              <Button
                variant={activeTab === "document" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("document")}
                type="button"
              >
                <div className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  9
                </div>
                Document
              </Button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-code">Provider Code</Label>
                        <Input id="provider-code" name="providerCode" defaultValue={provider.code} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provider-name">Provider Name (As per Borang B/F)</Label>
                        <Input id="provider-name" name="providerName" defaultValue={provider.name} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider-alias">Provider Alias</Label>
                      <Input id="provider-alias" name="providerAlias" defaultValue={provider.alias} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" name="address" defaultValue={provider.address} required />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" defaultValue={provider.city} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select name="state" defaultValue={provider.state} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
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
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input id="postcode" name="postcode" defaultValue={provider.postcode} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">GPS Coordinates - Latitude</Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          type="number"
                          step="0.000001"
                          defaultValue={provider.latitude}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">GPS Coordinates - Longitude</Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="0.000001"
                          defaultValue={provider.longitude}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tel-number">Provider Tel Number</Label>
                        <Input id="tel-number" name="telNumber" defaultValue={provider.telNumber} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fax-number">Provider Fax No</Label>
                        <Input id="fax-number" name="faxNumber" defaultValue={provider.faxNumber} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" defaultValue={provider.email} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile-phone">Mobile Phone No</Label>
                        <Input id="mobile-phone" name="mobilePhone" defaultValue={provider.mobilePhone} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">Phone WhatsApp</Label>
                        <Input id="whatsapp" name="whatsapp" defaultValue={provider.whatsapp} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" type="url" defaultValue={provider.website} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proprietor">Proprietor</Label>
                        <Input id="proprietor" name="proprietor" defaultValue={provider.proprietor} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passport">Passport No (For Non Malaysian Citizen Only)</Label>
                        <Input id="passport" name="passport" defaultValue={provider.passport || ""} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Registration & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-reg-no">Company Registration No</Label>
                        <Input id="company-reg-no" name="companyRegNo" defaultValue={provider.companyRegNo} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gst-reg">GST Registration</Label>
                        <Input id="gst-reg" name="gstReg" defaultValue={provider.gstReg} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tin-no">TIN No</Label>
                        <Input id="tin-no" name="tinNo" defaultValue={provider.tinNo} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Classification & Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider-type">Provider Type</Label>
                        <Select name="providerType" defaultValue={provider.providerType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinic">Clinic</SelectItem>
                            <SelectItem value="hospital">Hospital</SelectItem>
                            <SelectItem value="specialist">Specialist</SelectItem>
                            <SelectItem value="dental">Dental</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="laboratory">Laboratory</SelectItem>
                            <SelectItem value="wellness">Wellness Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="gl-issuance" name="glIssuance" defaultChecked={provider.glIssuance} />
                          <Label htmlFor="gl-issuance">Eligibility for GL Issuance?</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider-category">Provider Category</Label>
                      <Select name="providerCategory" defaultValue={provider.providerCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary-care">Primary Care</SelectItem>
                          <SelectItem value="secondary-care">Secondary Care</SelectItem>
                          <SelectItem value="tertiary-care">Tertiary Care</SelectItem>
                          <SelectItem value="specialized-care">Specialized Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Services Provided</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="service-general-consultation" name="serviceGeneralConsultation" />
                          <Label htmlFor="service-general-consultation">General Consultation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="service-specialist-consultation" name="serviceSpecialistConsultation" />
                          <Label htmlFor="service-specialist-consultation">Specialist Consultation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="service-laboratory" name="serviceLaboratory" />
                          <Label htmlFor="service-laboratory">Laboratory</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="service-radiology" name="serviceRadiology" />
                          <Label htmlFor="service-radiology">Radiology</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="service-pharmacy" name="servicePharmacy" />
                          <Label htmlFor="service-pharmacy">Pharmacy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="service-dental" name="serviceDental" />
                          <Label htmlFor="service-dental">Dental</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Panel & Service Eligibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="use-mediline" name="useMediline" defaultChecked={provider.useMediline} />
                        <Label htmlFor="use-mediline">Use mediline?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ame-panel" name="amePanel" defaultChecked={provider.amePanel} />
                        <Label htmlFor="ame-panel">AME Panel?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perkeso-panel" name="perkesoPanel" defaultChecked={provider.perkesoPanel} />
                        <Label htmlFor="perkeso-panel">PERKESO Panel?</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pmcare-panel" name="pmcarePanel" defaultChecked={provider.pmcarePanel} />
                        <Label htmlFor="pmcare-panel">PMCare Panel?</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="panel-group">Panel Group</Label>
                      <Select name="panelGroup" defaultValue={provider.panelGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group-a">Group A</SelectItem>
                          <SelectItem value="group-b">Group B</SelectItem>
                          <SelectItem value="group-c">Group C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional cards for other profile sections would go here */}
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/providers">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
