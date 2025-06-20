"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Download, Edit, Plus, Printer, Save, Upload, X } from "lucide-react"

export default function OnboardingProviderApplicationPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [imposeDeposit, setImposeDeposit] = useState(false)
  const [corporateDiscount, setCorporateDiscount] = useState(false)
  const [operatingHours, setOperatingHours] = useState("24-hours")
  const [additionalHours, setAdditionalHours] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch provider data
    const fetchProvider = async () => {
      setIsLoading(true)
      try {
        // In a real application, you would fetch this data from your API
        // const response = await fetch(`/api/onboarding/providers/${params.id}/full-application`)
        // const data = await response.json()

        // For demo purposes, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock provider data based on ID
        setProvider({
          id: params.id,
          applicationCode: "OB-2023-00" + params.id,
          name: params.id === "1" ? "John Smith" : "Sarah Lee",
          providerName: params.id === "1" ? "ABC Medical Center" : "Wellness Clinic",
          providerAlias: params.id === "1" ? "ABC Med" : "Wellness",
          address: params.id === "1" ? "123 Healthcare St" : "456 Wellness Blvd",
          city: params.id === "1" ? "Kuala Lumpur" : "Shah Alam",
          state: params.id === "1" ? "Kuala Lumpur" : "Selangor",
          postcode: params.id === "1" ? "50000" : "40000",
          latitude: params.id === "1" ? "3.1390" : "3.0731",
          longitude: params.id === "1" ? "101.6869" : "101.5183",
          telNumber: params.id === "1" ? "03-12345678" : "03-87654321",
          faxNumber: params.id === "1" ? "03-12345679" : "03-87654322",
          email: params.id === "1" ? "info@abcmedical.com" : "info@wellnessclinic.com",
          mobileNumber: params.id === "1" ? "012-3456789" : "019-8765432",
          whatsappNumber: params.id === "1" ? "012-3456789" : "019-8765432",
          website: params.id === "1" ? "www.abcmedical.com" : "www.wellnessclinic.com",
          proprietor: params.id === "1" ? "John Doe" : "Sarah Chen",
          companyRegNo: params.id === "1" ? "123456-A" : "789012-B",
          gstRegistration: params.id === "1" ? "GST-12345" : "GST-67890",
          tinNumber: params.id === "1" ? "TIN12345" : "TIN67890",
          providerType: params.id === "1" ? "Medical Center" : "Wellness Clinic",
          eligibleForGL: params.id === "1" ? true : false,
          providerCategory: params.id === "1" ? "Category A" : "Category B",
          servicesProvided: params.id === "1" ? ["General Medicine", "Specialist Care"] : ["Wellness", "Physiotherapy"],
          amePanel: params.id === "1" ? true : false,
          perkesoPanel: params.id === "1" ? false : true,
          panelGroup: params.id === "1" ? "Group A" : "Group B",
          imposeDeposit: params.id === "1" ? true : false,
          depositAmount: params.id === "1" ? "500" : "",
          corporateDiscount: params.id === "1" ? true : false,
          corporateDiscounts:
            params.id === "1"
              ? [{ category: "Corporate", item: "Consultation", discount: "10%", remarks: "For all corporate clients" }]
              : [],
          operatingHours: params.id === "1" ? "24-hours" : "regular",
          payeeDetails: {
            accountNo: params.id === "1" ? "1234-5678-9012" : "9876-5432-1098",
            bank: params.id === "1" ? "Maybank" : "CIMB",
            payee: params.id === "1" ? "ABC Medical Center Sdn Bhd" : "Wellness Clinic Sdn Bhd",
          },
          consultationFees: [
            { type: "Normal", charges: params.id === "1" ? "50" : "40" },
            { type: "Specialist", charges: params.id === "1" ? "100" : "80" },
          ],
          chronicalIllness: [
            { illness: "Diabetes", cost: params.id === "1" ? "150" : "120" },
            { illness: "Hypertension", cost: params.id === "1" ? "100" : "80" },
          ],
          technologyInfrastructure: [
            {
              technology: "Electronic Medical Records",
              availability: params.id === "1" ? "Available" : "Not Available",
            },
            { technology: "Telemedicine", availability: params.id === "1" ? "Available" : "Not Available" },
          ],
          laboratories: [
            { lab: "In-house Lab", arrangement: params.id === "1" ? "Full Service" : "Limited Service" },
            { lab: "External Lab", arrangement: params.id === "1" ? "Partnership" : "Case-by-case" },
          ],
          facilities: [
            { facility: "X-Ray", charges: params.id === "1" ? "150" : "120" },
            { facility: "Ultrasound", charges: params.id === "1" ? "200" : "180" },
          ],
          experiences: [
            { experience: "Hospital Care", availability: params.id === "1" ? "Yes" : "No" },
            { experience: "Chronic Disease Management", availability: params.id === "1" ? "Yes" : "Yes" },
          ],
          providerRepresentative: {
            doctorName: params.id === "1" ? "Dr. John Smith" : "Dr. Sarah Chen",
            phoneNumber: params.id === "1" ? "012-3456789" : "019-8765432",
          },
          staffing: [
            { role: "Doctor OSH", number: params.id === "1" ? "2" : "1" },
            { role: "Nurse", number: params.id === "1" ? "5" : "3" },
          ],
          practicingDoctors: [
            {
              name: params.id === "1" ? "Dr. John Smith" : "Dr. Sarah Chen",
              role: params.id === "1" ? "Primary Doctor" : "Primary Doctor",
              nric: params.id === "1" ? "800101-01-1234" : "810202-02-5678",
              gender: params.id === "1" ? "Male" : "Female",
              university: params.id === "1" ? "University of Malaya" : "University of Singapore",
              degree: params.id === "1" ? "MD" : "MBBS",
              year: params.id === "1" ? "2005" : "2006",
              mmcNo: params.id === "1" ? "MMC12345" : "MMC67890",
              nsrNo: params.id === "1" ? "NSR12345" : "NSR67890",
              apcNo: params.id === "1" ? "APC12345" : "APC67890",
              qualification: params.id === "1" ? "DFM" : "MRCP",
              workingHoursStart: params.id === "1" ? "09:00" : "08:30",
              workingHoursEnd: params.id === "1" ? "17:00" : "16:30",
            },
          ],
          ohDoctor: {
            name: params.id === "1" ? "Dr. Michael Wong" : "Dr. Lisa Tan",
            regNo: params.id === "1" ? "OHD12345" : "OHD67890",
            effectiveDate: params.id === "1" ? "2022-01-01" : "2022-02-01",
            expiryDate: params.id === "1" ? "2025-01-01" : "2025-02-01",
            status: params.id === "1" ? "Active" : "Active",
          },
          specialities: params.id === "1" ? ["Cardiology", "Orthopedics"] : ["General Medicine"],
          languages: params.id === "1" ? ["English", "Malay", "Mandarin"] : ["English", "Malay", "Tamil"],
          radiographer: {
            name: params.id === "1" ? "Ahmad Ismail" : "Mei Ling",
            regNo: params.id === "1" ? "RAD12345" : "RAD67890",
            validation: params.id === "1" ? "Validated" : "Pending",
          },
          panelApplicationDate: params.id === "1" ? "2023-01-01" : "2023-02-01",
          healthScreeningPackages: [
            {
              name: params.id === "1" ? "Basic Health Screening" : "Comprehensive Health Screening",
              description:
                params.id === "1" ? "Basic health check for general wellness" : "Comprehensive health assessment",
              discount: params.id === "1" ? "10%" : "15%",
              appointmentWhatsapp: params.id === "1" ? "012-3456789" : "019-8765432",
              examinations:
                params.id === "1"
                  ? ["Blood Test", "Urine Test", "BMI Assessment"]
                  : ["Full Blood Panel", "Cardiac Assessment", "Lung Function Test"],
              passportNo: params.id === "1" ? "A12345678" : "B87654321",
            },
          ],
          requiredDocuments: [
            { document: "Business License", status: params.id === "1" ? "Uploaded" : "Pending" },
            { document: "Professional Certifications", status: params.id === "1" ? "Uploaded" : "Uploaded" },
          ],
        })

        // Set state variables based on the fetched data
        setImposeDeposit(provider?.imposeDeposit || false)
        setCorporateDiscount(provider?.corporateDiscount || false)
        setOperatingHours(provider?.operatingHours || "24-hours")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load provider application data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProvider()
  }, [params.id])

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved successfully.",
    })
    setIsEditMode(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading provider application data...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Provider Not Found" description="The requested provider application could not be found." />
        <Button asChild className="mt-4">
          <Link href="/onboarding/providers">Back to Providers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Provider Application: ${provider.name}`}
          description={`Application Code: ${provider.applicationCode}`}
        />
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/onboarding/providers/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Details
            </Link>
          </Button>
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => setIsEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
          <TabsTrigger value="advertisement">Advertisement</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Basic provider details and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="providerName">Provider Name (As per Borang B/F)</Label>
                    <Input
                      id="providerName"
                      value={provider.providerName}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, providerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="providerAlias">Provider Alias</Label>
                    <Input
                      id="providerAlias"
                      value={provider.providerAlias}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, providerAlias: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={provider.address}
                    readOnly={!isEditMode}
                    onChange={(e) => isEditMode && setProvider({ ...provider, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={provider.city}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={provider.state}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={provider.postcode}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, postcode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">GPS Coordinates - Latitude</Label>
                    <Input
                      id="latitude"
                      value={provider.latitude}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, latitude: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">GPS Coordinates - Longitude</Label>
                    <Input
                      id="longitude"
                      value={provider.longitude}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, longitude: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Provider contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telNumber">Provider Tel Number</Label>
                    <Input
                      id="telNumber"
                      value={provider.telNumber}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, telNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faxNumber">Provider Fax No</Label>
                    <Input
                      id="faxNumber"
                      value={provider.faxNumber}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, faxNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={provider.email}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Phone No</Label>
                    <Input
                      id="mobileNumber"
                      value={provider.mobileNumber}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, mobileNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">Phone WhatsApp</Label>
                    <Input
                      id="whatsappNumber"
                      value={provider.whatsappNumber}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, whatsappNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={provider.website}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proprietor">Proprietor</Label>
                  <Input
                    id="proprietor"
                    value={provider.proprietor}
                    readOnly={!isEditMode}
                    onChange={(e) => isEditMode && setProvider({ ...provider, proprietor: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passportNo">Passport No (For Non Malaysian Citizen Only)</Label>
                  <Input
                    id="passportNo"
                    value={provider.passportNo || ""}
                    readOnly={!isEditMode}
                    onChange={(e) => isEditMode && setProvider({ ...provider, passportNo: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Registration & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Registration & Compliance</CardTitle>
                <CardDescription>Registration and compliance details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyRegNo">Company Registration No</Label>
                    <Input
                      id="companyRegNo"
                      value={provider.companyRegNo}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, companyRegNo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstRegistration">GST Registration</Label>
                    <Input
                      id="gstRegistration"
                      value={provider.gstRegistration}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, gstRegistration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tinNumber">TIN No</Label>
                    <Input
                      id="tinNumber"
                      value={provider.tinNumber}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, tinNumber: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification & Services */}
            <Card>
              <CardHeader>
                <CardTitle>Classification & Services</CardTitle>
                <CardDescription>Provider classification and services offered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="providerType">Provider Type</Label>
                    <Input
                      id="providerType"
                      value={provider.providerType}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, providerType: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="eligibleForGL"
                        checked={provider.eligibleForGL}
                        disabled={!isEditMode}
                        onCheckedChange={(checked) =>
                          isEditMode && setProvider({ ...provider, eligibleForGL: !!checked })
                        }
                      />
                      <Label htmlFor="eligibleForGL">Eligibility for GL Issuance?</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="providerCategory">Provider Category</Label>
                    <Input
                      id="providerCategory"
                      value={provider.providerCategory}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, providerCategory: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Services Provided</Label>
                  <div className="border rounded-md p-3 space-y-2">
                    {provider.servicesProvided.map((service: string, index: number) => (
                      <div key={index} className="text-sm flex items-center justify-between">
                        <span>{service}</span>
                        {isEditMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedServices = [...provider.servicesProvided]
                              updatedServices.splice(index, 1)
                              setProvider({ ...provider, servicesProvided: updatedServices })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          const newService = prompt("Enter new service:")
                          if (newService) {
                            setProvider({
                              ...provider,
                              servicesProvided: [...provider.servicesProvided, newService],
                            })
                          }
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Panel & Service Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle>Panel & Service Eligibility</CardTitle>
                <CardDescription>Panel memberships and eligibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="amePanel"
                        checked={provider.amePanel}
                        disabled={!isEditMode}
                        onCheckedChange={(checked) => isEditMode && setProvider({ ...provider, amePanel: !!checked })}
                      />
                      <Label htmlFor="amePanel">AME Panel?</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="perkesoPanel"
                        checked={provider.perkesoPanel}
                        disabled={!isEditMode}
                        onCheckedChange={(checked) =>
                          isEditMode && setProvider({ ...provider, perkesoPanel: !!checked })
                        }
                      />
                      <Label htmlFor="perkesoPanel">PERKESO Panel?</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panelGroup">Panel Group</Label>
                    <Input
                      id="panelGroup"
                      value={provider.panelGroup}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, panelGroup: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admission & Payment Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Admission & Payment Policies</CardTitle>
                <CardDescription>Payment and admission policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="imposeDeposit"
                      checked={imposeDeposit}
                      onCheckedChange={(checked) => {
                        if (isEditMode) {
                          setImposeDeposit(!!checked)
                          setProvider({ ...provider, imposeDeposit: !!checked })
                        }
                      }}
                      disabled={!isEditMode}
                    />
                    <Label htmlFor="imposeDeposit">Impose deposit for admission?</Label>
                  </div>
                </div>

                {imposeDeposit && (
                  <div className="pl-6 space-y-2">
                    <Label htmlFor="depositAmount">Amount (RM)</Label>
                    <Input
                      id="depositAmount"
                      value={provider.depositAmount}
                      readOnly={!isEditMode}
                      onChange={(e) => isEditMode && setProvider({ ...provider, depositAmount: e.target.value })}
                      className="max-w-xs"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="corporateDiscount"
                      checked={corporateDiscount}
                      onCheckedChange={(checked) => {
                        if (isEditMode) {
                          setCorporateDiscount(!!checked)
                          setProvider({ ...provider, corporateDiscount: !!checked })
                        }
                      }}
                      disabled={!isEditMode}
                    />
                    <Label htmlFor="corporateDiscount">Corporate Discount?</Label>
                  </div>
                </div>

                {corporateDiscount && (
                  <div className="pl-6 space-y-2">
                    <div className="border rounded-md p-3">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Category</th>
                            <th className="text-left py-2">Item</th>
                            <th className="text-left py-2">Discount</th>
                            <th className="text-left py-2">Remarks</th>
                            {isEditMode && <th className="text-left py-2">Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {provider.corporateDiscounts.map((discount: any, index: number) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-2">{discount.category}</td>
                              <td className="py-2">{discount.item}</td>
                              <td className="py-2">{discount.discount}</td>
                              <td className="py-2">{discount.remarks}</td>
                              {isEditMode && (
                                <td className="py-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedDiscounts = [...provider.corporateDiscounts]
                                      updatedDiscounts.splice(index, 1)
                                      setProvider({ ...provider, corporateDiscounts: updatedDiscounts })
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {isEditMode && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => {
                            const newDiscount = {
                              category: "Corporate",
                              item: "New Item",
                              discount: "5%",
                              remarks: "New discount",
                            }
                            setProvider({
                              ...provider,
                              corporateDiscounts: [...provider.corporateDiscounts, newDiscount],
                            })
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Discount
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Operational Details */}
            <Card>
              <CardHeader>
                <CardTitle>Operational Details</CardTitle>
                <CardDescription>Operating hours and additional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Select
                    disabled={!isEditMode}
                    value={operatingHours}
                    onValueChange={(value) => {
                      if (isEditMode) {
                        setOperatingHours(value)
                        setProvider({ ...provider, operatingHours: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operating hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24-hours">24 Hours</SelectItem>
                      <SelectItem value="regular">Regular Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {operatingHours === "regular" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dailyHours">Daily</Label>
                        <Input
                          id="dailyHours"
                          placeholder="e.g., 9:00 AM - 5:00 PM"
                          readOnly={!isEditMode}
                          defaultValue="9:00 AM - 5:00 PM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weekdayHours">Monday – Friday</Label>
                        <Input
                          id="weekdayHours"
                          placeholder="e.g., 9:00 AM - 5:00 PM"
                          readOnly={!isEditMode}
                          defaultValue="9:00 AM - 5:00 PM"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weekendHours">Saturday – Sunday</Label>
                      <Input
                        id="weekendHours"
                        placeholder="e.g., 10:00 AM - 2:00 PM"
                        readOnly={!isEditMode}
                        defaultValue="10:00 AM - 2:00 PM"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="additionalHours"
                          checked={additionalHours}
                          onCheckedChange={(checked) => {
                            if (isEditMode) {
                              setAdditionalHours(!!checked)
                            }
                          }}
                          disabled={!isEditMode}
                        />
                        <Label htmlFor="additionalHours">Additional Infos</Label>
                      </div>
                    </div>

                    {additionalHours && (
                      <div className="pl-6 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="mondayHours">Monday</Label>
                            <Input
                              id="mondayHours"
                              placeholder="Hours"
                              readOnly={!isEditMode}
                              defaultValue="9:00 AM - 5:00 PM"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tuesdayHours">Tuesday</Label>
                            <Input
                              id="tuesdayHours"
                              placeholder="Hours"
                              readOnly={!isEditMode}
                              defaultValue="9:00 AM - 5:00 PM"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="wednesdayHours">Wednesday</Label>
                            <Input
                              id="wednesdayHours"
                              placeholder="Hours"
                              readOnly={!isEditMode}
                              defaultValue="9:00 AM - 5:00 PM"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="thursdayHours">Thursday</Label>
                            <Input
                              id="thursdayHours"
                              placeholder="Hours"
                              readOnly={!isEditMode}
                              defaultValue="9:00 AM - 5:00 PM"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fridayHours">Friday</Label>
                            <Input
                              id="fridayHours"
                              placeholder="Hours"
                              readOnly={!isEditMode}
                              defaultValue="9:00 AM - 5:00 PM"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="saturdayHours">Saturday</Label>
                            <Input
                              id="saturdayHours"
                              placeholder="Hours"
                              readOnly={!isEditMode}
                              defaultValue="10:00 AM - 2:00 PM"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sundayHours">Sunday</Label>
                            <Input id="sundayHours" placeholder="Hours" readOnly={!isEditMode} defaultValue="Closed" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="holidayHours">Public Holiday</Label>
                            <Input id="holidayHours" placeholder="Hours" readOnly={!isEditMode} defaultValue="Closed" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payee List Details</CardTitle>
              <CardDescription>Payment account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNo">Account No</Label>
                  <Input
                    id="accountNo"
                    value={provider.payeeDetails.accountNo}
                    readOnly={!isEditMode}
                    onChange={(e) =>
                      isEditMode &&
                      setProvider({
                        ...provider,
                        payeeDetails: { ...provider.payeeDetails, accountNo: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank</Label>
                  <Input
                    id="bank"
                    value={provider.payeeDetails.bank}
                    readOnly={!isEditMode}
                    onChange={(e) =>
                      isEditMode &&
                      setProvider({
                        ...provider,
                        payeeDetails: { ...provider.payeeDetails, bank: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payee">Payee</Label>
                  <Input
                    id="payee"
                    value={provider.payeeDetails.payee}
                    readOnly={!isEditMode}
                    onChange={(e) =>
                      isEditMode &&
                      setProvider({
                        ...provider,
                        payeeDetails: { ...provider.payeeDetails, payee: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charges Tab */}
        <TabsContent value="charges">
          <div className="space-y-6">
            {/* Consultation Fees */}
            <Card>
              <CardHeader>
                <CardTitle>Charges for Consultation Fees</CardTitle>
                <CardDescription>Consultation fees for different service types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Charges Type</th>
                        <th className="text-left py-2">Charges (RM)</th>
                        {isEditMode && <th className="text-left py-2">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {provider.consultationFees.map((fee: any, index: number) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={fee.type}
                                onChange={(e) => {
                                  const updatedFees = [...provider.consultationFees]
                                  updatedFees[index].type = e.target.value
                                  setProvider({ ...provider, consultationFees: updatedFees })
                                }}
                                className="h-8"
                              />
                            ) : (
                              fee.type
                            )}
                          </td>
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={fee.charges}
                                onChange={(e) => {
                                  const updatedFees = [...provider.consultationFees]
                                  updatedFees[index].charges = e.target.value
                                  setProvider({ ...provider, consultationFees: updatedFees })
                                }}
                                className="h-8"
                              />
                            ) : (
                              fee.charges
                            )}
                          </td>
                          {isEditMode && (
                            <td className="py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedFees = [...provider.consultationFees]
                                  updatedFees.splice(index, 1)
                                  setProvider({ ...provider, consultationFees: updatedFees })
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        const newFee = {
                          type: "New Type",
                          charges: "0",
                        }
                        setProvider({
                          ...provider,
                          consultationFees: [...provider.consultationFees, newFee],
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Fee
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chronic Illness */}
            <Card>
              <CardHeader>
                <CardTitle>Charges for Common and Chronic Illness</CardTitle>
                <CardDescription>Medication costs for diagnosed illnesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">List of Diagnosed Illness</th>
                        <th className="text-left py-2">Average Cost of Medication Price</th>
                        {isEditMode && <th className="text-left py-2">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {provider.chronicalIllness.map((illness: any, index: number) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={illness.illness}
                                onChange={(e) => {
                                  const updatedIllnesses = [...provider.chronicalIllness]
                                  updatedIllnesses[index].illness = e.target.value
                                  setProvider({ ...provider, chronicalIllness: updatedIllnesses })
                                }}
                                className="h-8"
                              />
                            ) : (
                              illness.illness
                            )}
                          </td>
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={illness.cost}
                                onChange={(e) => {
                                  const updatedIllnesses = [...provider.chronicalIllness]
                                  updatedIllnesses[index].cost = e.target.value
                                  setProvider({ ...provider, chronicalIllness: updatedIllnesses })
                                }}
                                className="h-8"
                              />
                            ) : (
                              illness.cost
                            )}
                          </td>
                          {isEditMode && (
                            <td className="py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedIllnesses = [...provider.chronicalIllness]
                                  updatedIllnesses.splice(index, 1)
                                  setProvider({ ...provider, chronicalIllness: updatedIllnesses })
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        const newIllness = {
                          illness: "New Illness",
                          cost: "0",
                        }
                        setProvider({
                          ...provider,
                          chronicalIllness: [...provider.chronicalIllness, newIllness],
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Illness
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Capabilities Tab */}
        <TabsContent value="capabilities">
          <div className="space-y-6">
            {/* Technology Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle>Provider Technology Infrastructure</CardTitle>
                <CardDescription>Available technology and infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">List of Technology Infrastructure</th>
                        <th className="text-left py-2">Availability</th>
                        {isEditMode && <th className="text-left py-2">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {provider.technologyInfrastructure.map((tech: any, index: number) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={tech.technology}
                                onChange={(e) => {
                                  const updatedTech = [...provider.technologyInfrastructure]
                                  updatedTech[index].technology = e.target.value
                                  setProvider({ ...provider, technologyInfrastructure: updatedTech })
                                }}
                                className="h-8"
                              />
                            ) : (
                              tech.technology
                            )}
                          </td>
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={tech.availability}
                                onChange={(e) => {
                                  const updatedTech = [...provider.technologyInfrastructure]
                                  updatedTech[index].availability = e.target.value
                                  setProvider({ ...provider, technologyInfrastructure: updatedTech })
                                }}
                                className="h-8"
                              />
                            ) : (
                              tech.availability
                            )}
                          </td>
                          {isEditMode && (
                            <td className="py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedTech = [...provider.technologyInfrastructure]
                                  updatedTech.splice(index, 1)
                                  setProvider({ ...provider, technologyInfrastructure: updatedTech })
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        const newTech = {
                          technology: "New Technology",
                          availability: "Not Available",
                        }
                        setProvider({
                          ...provider,
                          technologyInfrastructure: [...provider.technologyInfrastructure, newTech],
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Technology
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Laboratories */}
            <Card>
              <CardHeader>
                <CardTitle>Laboratories Arrangement</CardTitle>
                <CardDescription>Laboratory services and arrangements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">List of Laboratories</th>
                        <th className="text-left py-2">Arrangement Status</th>
                        {isEditMode && <th className="text-left py-2">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {provider.laboratories.map((lab: any, index: number) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={lab.lab}
                                onChange={(e) => {
                                  const updatedLabs = [...provider.laboratories]
                                  updatedLabs[index].lab = e.target.value
                                  setProvider({ ...provider, laboratories: updatedLabs })
                                }}
                                className="h-8"
                              />
                            ) : (
                              lab.lab
                            )}
                          </td>
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={lab.arrangement}
                                onChange={(e) => {
                                  const updatedLabs = [...provider.laboratories]
                                  updatedLabs[index].arrangement = e.target.value
                                  setProvider({ ...provider, laboratories: updatedLabs })
                                }}
                                className="h-8"
                              />
                            ) : (
                              lab.arrangement
                            )}
                          </td>
                          {isEditMode && (
                            <td className="py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedLabs = [...provider.laboratories]
                                  updatedLabs.splice(index, 1)
                                  setProvider({ ...provider, laboratories: updatedLabs })
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        const newLab = {
                          lab: "New Laboratory",
                          arrangement: "Pending",
                        }
                        setProvider({
                          ...provider,
                          laboratories: [...provider.laboratories, newLab],
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Laboratory
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Facilities/Services Available</CardTitle>
                <CardDescription>Available facilities and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Facilities/Services Listing</th>
                        <th className="text-left py-2">Charges (RM)</th>
                        {isEditMode && <th className="text-left py-2">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {provider.facilities.map((facility: any, index: number) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={facility.facility}
                                onChange={(e) => {
                                  const updatedFacilities = [...provider.facilities]
                                  updatedFacilities[index].facility = e.target.value
                                  setProvider({ ...provider, facilities: updatedFacilities })
                                }}
                                className="h-8"
                              />
                            ) : (
                              facility.facility
                            )}
                          </td>
                          <td className="py-2">
                            {isEditMode ? (
                              <Input
                                value={facility.charges}
                                onChange={(e) => {
                                  const updatedFacilities = [...provider.facilities]
                                  updatedFacilities[index].charges = e.target.value
                                  setProvider({ ...provider, facilities: updatedFacilities })
                                }}
                                className="h-8"
                              />
                            ) : (
                              facility.charges
                            )}
                          </td>
                          {isEditMode && (
                            <td className="py-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedFacilities = [...provider.facilities]
                                  updatedFacilities.splice(index, 1)
                                  setProvider({ ...provider, facilities: updatedFacilities })
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {isEditMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        const newFacility = {
                          facility: "New Facility",
                          charges: "0",
                        }
                        setProvider({
                          ...provider,
                          facilities: [...provider.facilities, newFacility],
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Facility
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Provider Experiences</CardTitle>
              <CardDescription>Experience in different medical areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Experiences</th>
                      <th className="text-left py-2">Availability</th>
                      {isEditMode && <th className="text-left py-2">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {provider.experiences.map((exp: any, index: number) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2">
                          {isEditMode ? (
                            <Input
                              value={exp.experience}
                              onChange={(e) => {
                                const updatedExperiences = [...provider.experiences]
                                updatedExperiences[index].experience = e.target.value
                                setProvider({ ...provider, experiences: updatedExperiences })
                              }}
                              className="h-8"
                            />
                          ) : (
                            exp.experience
                          )}
                        </td>
                        <td className="py-2">
                          {isEditMode ? (
                            <Input
                              value={exp.availability}
                              onChange={(e) => {
                                const updatedExperiences = [...provider.experiences]
                                updatedExperiences[index].availability = e.target.value
                                setProvider({ ...provider, experiences: updatedExperiences })
                              }}
                              className="h-8"
                            />
                          ) : (
                            exp.availability
                          )}
                        </td>
                        {isEditMode && (
                          <td className="py-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedExperiences = [...provider.experiences]
                                updatedExperiences.splice(index, 1)
                                setProvider({ ...provider, experiences: updatedExperiences })
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                      const newExperience = {
                        experience: "New Experience",
                        availability: "No",
                      }
                      setProvider({
                        ...provider,
                        experiences: [...provider.experiences, newExperience],
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personnel Tab */}
        <TabsContent value="personnel">
          <div className="space-y-6">
            {/* Provider's Representative */}
            <Card>
              <CardHeader>
                <CardTitle>Provider's Representative</CardTitle>
                <CardDescription>Primary contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Name of PIC doctor</Label>
                    <Input
                      id="doctorName"
                      value={provider.providerRepresentative.doctorName}
                      readOnly={!isEditMode}
                      onChange={(e) =>
                        isEditMode &&
                        setProvider({
                          ...provider,
                          providerRepresentative: {
                            ...provider.providerRepresentative,
                            doctorName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input
                      id="phoneNumber"
                      value={provider.providerRepresentative.phoneNumber}
                      readOnly={!isEditMode}
                      onChange={(e) =>
                        isEditMode &&
                        setProvider({
                          ...provider,
                          providerRepresentative: {
                            ...provider.providerRepresentative,
                            phoneNumber: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Staffing</Label>
                  <div className="border rounded-md p-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Role</th>
                          <th className="text-left py-2">Number of staff(s)</th>
                          {isEditMode && <th className="text-left py-2">Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {provider.staffing.map((staff: any, index: number) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="py-2">
                              {isEditMode ? (
                                <Input
                                  value={staff.role}
                                  onChange={(e) => {
                                    const updatedStaffing = [...provider.staffing]
                                    updatedStaffing[index].role = e.target.value
                                    setProvider({ ...provider, staffing: updatedStaffing })
                                  }}
                                  className="h-8"
                                />
                              ) : (
                                staff.role
                              )}
                            </td>
                            <td className="py-2">
                              {isEditMode ? (
                                <Input
                                  value={staff.number}
                                  onChange={(e) => {
                                    const updatedStaffing = [...provider.staffing]
                                    updatedStaffing[index].number = e.target.value
                                    setProvider({ ...provider, staffing: updatedStaffing })
                                  }}
                                  className="h-8"
                                />
                              ) : (
                                staff.number
                              )}
                            </td>
                            {isEditMode && (
                              <td className="py-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedStaffing = [...provider.staffing]
                                    updatedStaffing.splice(index, 1)
                                    setProvider({ ...provider, staffing: updatedStaffing })
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {isEditMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => {
                          const newStaff = {
                            role: "New Role",
                            number: "0",
                          }
                          setProvider({
                            ...provider,
                            staffing: [...provider.staffing, newStaff],
                          })
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Staff
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practicing Doctors */}
            <Card>
              <CardHeader>
                <CardTitle>Details of Practicing Doctors/Proprietors</CardTitle>
                <CardDescription>Information about practicing doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {provider.practicingDoctors.map((doctor: any, index: number) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-base">Doctor {index + 1}</h3>
                        {isEditMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedDoctors = [...provider.practicingDoctors]
                              updatedDoctors.splice(index, 1)
                              setProvider({ ...provider, practicingDoctors: updatedDoctors })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.name}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].name = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.name}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.role}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].role = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.role}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>New NRIC No</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.nric}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].nric = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.nric}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.gender}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].gender = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.gender}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>College/University</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.university}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].university = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.university}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.degree}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].degree = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.degree}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.year}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].year = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.year}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>MMC No.</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.mmcNo}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].mmcNo = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.mmcNo}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>NSR No.</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.nsrNo}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].nsrNo = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.nsrNo}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>APC No.</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.apcNo}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].apcNo = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.apcNo}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Additional Qualification</Label>
                          {isEditMode ? (
                            <Input
                              value={doctor.qualification}
                              onChange={(e) => {
                                const updatedDoctors = [...provider.practicingDoctors]
                                updatedDoctors[index].qualification = e.target.value
                                setProvider({ ...provider, practicingDoctors: updatedDoctors })
                              }}
                            />
                          ) : (
                            <div className="text-sm">{doctor.qualification}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Working Hours</Label>
                          {isEditMode ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={doctor.workingHoursStart}
                                onChange={(e) => {
                                  const updatedDoctors = [...provider.practicingDoctors]
                                  updatedDoctors[index].workingHoursStart = e.target.value
                                  setProvider({ ...provider, practicingDoctors: updatedDoctors })
                                }}
                                className="w-24"
                              />
                              <span>-</span>
                              <Input
                                value={doctor.workingHoursEnd}
                                onChange={(e) => {
                                  const updatedDoctors = [...provider.practicingDoctors]
                                  updatedDoctors[index].workingHoursEnd = e.target.value
                                  setProvider({ ...provider, practicingDoctors: updatedDoctors })
                                }}
                                className="w-24"
                              />
                            </div>
                          ) : (
                            <div className="text-sm">
                              {doctor.workingHoursStart} - {doctor.workingHoursEnd}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isEditMode && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const newDoctor = {
                          name: "New Doctor",
                          role: "Doctor",
                          nric: "",
                          gender: "Male",
                          university: "",
                          degree: "",
                          year: "",
                          mmcNo: "",
                          nsrNo: "",
                          apcNo: "",
                          qualification: "",
                          workingHoursStart: "09:00",
                          workingHoursEnd: "17:00",
                        }
                        setProvider({
                          ...provider,
                          practicingDoctors: [...provider.practicingDoctors, newDoctor],
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Doctor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Occupational Health Doctor */}
            <Card>
              <CardHeader>
                <CardTitle>Occupational Health Doctor</CardTitle>
                <CardDescription>Occupational health doctor details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.ohDoctor.name}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            ohDoctor: { ...provider.ohDoctor, name: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.ohDoctor.name}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>OHD Registration No.</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.ohDoctor.regNo}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            ohDoctor: { ...provider.ohDoctor, regNo: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.ohDoctor.regNo}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Effective date</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.ohDoctor.effectiveDate}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            ohDoctor: { ...provider.ohDoctor, effectiveDate: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.ohDoctor.effectiveDate}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry date</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.ohDoctor.expiryDate}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            ohDoctor: { ...provider.ohDoctor, expiryDate: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.ohDoctor.expiryDate}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.ohDoctor.status}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            ohDoctor: { ...provider.ohDoctor, status: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.ohDoctor.status}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resident Specialist */}
            <Card>
              <CardHeader>
                <CardTitle>Resident Specialist</CardTitle>
                <CardDescription>Available medical specialties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3">
                  <div className="space-y-2">
                    <Label>Speciality</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {provider.specialities.map((specialty: string, index: number) => (
                        <div key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full flex items-center">
                          {specialty}
                          {isEditMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 ml-1 p-0"
                              onClick={() => {
                                const updatedSpecialities = [...provider.specialities]
                                updatedSpecialities.splice(index, 1)
                                setProvider({ ...provider, specialities: updatedSpecialities })
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const newSpecialty = prompt("Enter new specialty:")
                          if (newSpecialty) {
                            setProvider({
                              ...provider,
                              specialities: [...provider.specialities, newSpecialty],
                            })
                          }
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Specialty
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spoken Language */}
            <Card>
              <CardHeader>
                <CardTitle>Spoken Language</CardTitle>
                <CardDescription>Languages spoken by staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3">
                  <div className="space-y-2">
                    <Label>Spoken Language</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {provider.languages.map((language: string, index: number) => (
                        <div key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full flex items-center">
                          {language}
                          {isEditMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 ml-1 p-0"
                              onClick={() => {
                                const updatedLanguages = [...provider.languages]
                                updatedLanguages.splice(index, 1)
                                setProvider({ ...provider, languages: updatedLanguages })
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const newLanguage = prompt("Enter new language:")
                          if (newLanguage) {
                            setProvider({
                              ...provider,
                              languages: [...provider.languages, newLanguage],
                            })
                          }
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Language
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Radiographer */}
            <Card>
              <CardHeader>
                <CardTitle>Radiographer</CardTitle>
                <CardDescription>Radiographer information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.radiographer.name}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            radiographer: { ...provider.radiographer, name: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.radiographer.name}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Reg. No.</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.radiographer.regNo}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            radiographer: { ...provider.radiographer, regNo: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.radiographer.regNo}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Radiographer Field Validation</Label>
                    {isEditMode ? (
                      <Input
                        value={provider.radiographer.validation}
                        onChange={(e) =>
                          setProvider({
                            ...provider,
                            radiographer: { ...provider.radiographer, validation: e.target.value },
                          })
                        }
                      />
                    ) : (
                      <div className="text-sm">{provider.radiographer.validation}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contract Tab */}
        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle>Panel Application Date</CardTitle>
              <CardDescription>Contract application details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                {isEditMode ? (
                  <Input
                    value={provider.panelApplicationDate}
                    onChange={(e) => setProvider({ ...provider, panelApplicationDate: e.target.value })}
                    className="max-w-xs"
                  />
                ) : (
                  <div className="text-sm">{provider.panelApplicationDate}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advertisement Tab */}
        <TabsContent value="advertisement">
          <Card>
            <CardHeader>
              <CardTitle>Health Screening Package</CardTitle>
              <CardDescription>Health screening packages offered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {provider.healthScreeningPackages.map((package_: any, index: number) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-base">Package {index + 1}</h3>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedPackages = [...provider.healthScreeningPackages]
                            updatedPackages.splice(index, 1)
                            setProvider({ ...provider, healthScreeningPackages: updatedPackages })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Package Name</Label>
                        {isEditMode ? (
                          <Input
                            value={package_.name}
                            onChange={(e) => {
                              const updatedPackages = [...provider.healthScreeningPackages]
                              updatedPackages[index].name = e.target.value
                              setProvider({ ...provider, healthScreeningPackages: updatedPackages })
                            }}
                          />
                        ) : (
                          <div className="text-sm">{package_.name}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Discount</Label>
                        {isEditMode ? (
                          <Input
                            value={package_.discount}
                            onChange={(e) => {
                              const updatedPackages = [...provider.healthScreeningPackages]
                              updatedPackages[index].discount = e.target.value
                              setProvider({ ...provider, healthScreeningPackages: updatedPackages })
                            }}
                          />
                        ) : (
                          <div className="text-sm">{package_.discount}</div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>Description</Label>
                      {isEditMode ? (
                        <Textarea
                          value={package_.description}
                          onChange={(e) => {
                            const updatedPackages = [...provider.healthScreeningPackages]
                            updatedPackages[index].description = e.target.value
                            setProvider({ ...provider, healthScreeningPackages: updatedPackages })
                          }}
                        />
                      ) : (
                        <div className="text-sm">{package_.description}</div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>Booking Appointment (WhatsApp No.)</Label>
                      {isEditMode ? (
                        <Input
                          value={package_.appointmentWhatsapp}
                          onChange={(e) => {
                            const updatedPackages = [...provider.healthScreeningPackages]
                            updatedPackages[index].appointmentWhatsapp = e.target.value
                            setProvider({ ...provider, healthScreeningPackages: updatedPackages })
                          }}
                        />
                      ) : (
                        <div className="text-sm">{package_.appointmentWhatsapp}</div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>List of Examination</Label>
                      <div className="flex flex-col gap-2 mt-1">
                        {package_.examinations.map((exam: string, i: number) => (
                          <div key={i} className="text-sm flex items-center">
                            <span>- {exam}</span>
                            {isEditMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 ml-1 p-0"
                                onClick={() => {
                                  const updatedPackages = [...provider.healthScreeningPackages]
                                  updatedPackages[index].examinations.splice(i, 1)
                                  setProvider({ ...provider, healthScreeningPackages: updatedPackages })
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        {isEditMode && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              const newExam = prompt("Enter new examination:")
                              if (newExam) {
                                const updatedPackages = [...provider.healthScreeningPackages]
                                updatedPackages[index].examinations.push(newExam)
                                setProvider({ ...provider, healthScreeningPackages: updatedPackages })
                              }
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Examination
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label>File Attachment</Label>
                      <Button variant="outline" className="text-sm">
                        <Upload className="mr-2 h-4 w-4" />
                        View File
                      </Button>
                    </div>
                  </div>
                ))}
                {isEditMode && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const newPackage = {
                        name: "New Health Screening Package",
                        description: "Description of the package",
                        discount: "0%",
                        appointmentWhatsapp: "",
                        examinations: ["Basic Examination"],
                      }
                      setProvider({
                        ...provider,
                        healthScreeningPackages: [...provider.healthScreeningPackages, newPackage],
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Package
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Tab */}
        <TabsContent value="document">
          <Card>
            <CardHeader>
              <CardTitle>Required Document Listing</CardTitle>
              <CardDescription>Required documents for the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Document</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provider.requiredDocuments.map((doc: any, index: number) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2">
                          {isEditMode ? (
                            <Input
                              value={doc.document}
                              onChange={(e) => {
                                const updatedDocs = [...provider.requiredDocuments]
                                updatedDocs[index].document = e.target.value
                                setProvider({ ...provider, requiredDocuments: updatedDocs })
                              }}
                              className="h-8"
                            />
                          ) : (
                            doc.document
                          )}
                        </td>
                        <td className="py-2">
                          {isEditMode ? (
                            <Select
                              value={doc.status}
                              onValueChange={(value) => {
                                const updatedDocs = [...provider.requiredDocuments]
                                updatedDocs[index].status = value
                                setProvider({ ...provider, requiredDocuments: updatedDocs })
                              }}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Uploaded">Uploaded</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            doc.status
                          )}
                        </td>
                        <td className="py-2">
                          {doc.status === "Uploaded" && (
                            <Button variant="outline" size="sm">
                              <Upload className="mr-2 h-3 w-3" />
                              View
                            </Button>
                          )}
                          {isEditMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => {
                                const updatedDocs = [...provider.requiredDocuments]
                                updatedDocs.splice(index, 1)
                                setProvider({ ...provider, requiredDocuments: updatedDocs })
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                      const newDoc = {
                        document: "New Document",
                        status: "Pending",
                      }
                      setProvider({
                        ...provider,
                        requiredDocuments: [...provider.requiredDocuments, newDoc],
                      })
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
