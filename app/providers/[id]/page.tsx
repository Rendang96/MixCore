"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Pencil, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, useRouter } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { getProvider, saveProvider, getSetupData } from "@/lib/local-storage"

// Helper function to check if provider needs contract renewal
const needsContractRenewal = (provider: any): boolean => {
  if (!provider?.contract?.endDate) return false

  const endDate = new Date(provider.contract.endDate)
  const currentDate = new Date()
  const thirtyDaysFromNow = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)

  // Flag if contract ends within 30 days or has already expired
  return endDate <= thirtyDaysFromNow
}

export default function ProviderDetailsPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const shouldStartInEditMode = searchParams.get("edit") === "true"
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProvider, setEditedProvider] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("profile")

  // States for various sections
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [showDepositField, setShowDepositField] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [showDiscountFields, setShowDiscountFields] = useState(false)
  const [selectedDiscountItems, setSelectedDiscountItems] = useState<
    { category: string; item: string; discount: string; remarks: string }[]
  >([])
  const [operatingHoursType, setOperatingHoursType] = useState("")
  const [showRegularHours, setShowRegularHours] = useState(false)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  // Setup data states
  const [providerTypes, setProviderTypes] = useState<string[]>([])
  const [providerCategories, setProviderCategories] = useState<string[]>([])
  const [panelGroups, setPanelGroups] = useState<string[]>([])
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([])

  // Add this function after the handleNestedInputChange function
  const normalizeProviderData = (data: any) => {
    // Ensure all expected fields exist
    const normalized = { ...data }

    // Handle services provided
    if (normalized.servicesProvided && normalized.servicesProvided.length === 0) {
      normalized.servicesProvided = []
    }

    // Handle drug list
    if (!normalized.drugList) {
      normalized.drugList = []
    }

    // Handle staffing
    if (normalized.staffingList) {
      normalized.staffing = normalized.staffingList.map((item: any) => ({
        role: item.role,
        count: item.numberOfStaff,
      }));
    } else if (!normalized.staffing) {
      normalized.staffing = [];
    }

    // Handle application date
    if (normalized.applicationDate) {
      console.log("Application date found:", normalized.applicationDate)
    }

    // Ensure nested objects exist for safe access, handling 'status' specifically
    if (typeof normalized.status === "string") {
      normalized.status = { status: normalized.status }
    } else {
      normalized.status = normalized.status || {} // Ensure it's an object if null/undefined
    }
    normalized.bankGuarantee = normalized.bankGuarantee || {}
    normalized.contract = normalized.contract || {}
    normalized.operatingHours = normalized.operatingHours || {}
    normalized.pmcareRepresentative = normalized.pmcareRepresentative || {}
    normalized.radiographer = normalized.radiographer || {}
    normalized.paymentDetails = normalized.paymentDetails || {}
    normalized.payeeList = normalized.payeeList || {} // Fallback for payment details

    // Populate pmcareRepresentative fields from top-level or existing nested data
    normalized.pmcareRepresentative.nameOfPICDoctor = normalized.pic || normalized.pmcareRepresentative.nameOfPICDoctor || "";
    normalized.pmcareRepresentative.phoneNumber = normalized.mobilePhone || normalized.telNumber || normalized.pmcareRepresentative.phoneNumber || "";

    // Ensure specific string fields are initialized properly - FIXED
    normalized.sstReg = normalized.sstReg || "";
    normalized.taxpayerStatus = normalized.taxpayerStatus || "";

    console.log("Normalizing - SST Reg:", normalized.sstReg);
    console.log("Normalizing - Taxpayer Status:", normalized.taxpayerStatus);

    // Ensure dropdown values are initialized correctly.
    // Convert empty strings to undefined so Select component shows placeholder.
    normalized.status.status = normalized.status.status === "" ? undefined : normalized.status.status ?? "active";
    normalized.panelGroup = normalized.panelGroup === "" ? undefined : normalized.panelGroup ?? "";
    normalized.providerType = normalized.providerType === "" ? undefined : normalized.providerType ?? "";
    normalized.providerCategory = normalized.providerCategory === "" ? undefined : normalized.providerCategory ?? "";
    normalized.operatingHours.type = normalized.operatingHours.type === "" ? undefined : normalized.operatingHours.type ?? "";
    normalized.pmcareRepresentative.status = normalized.pmcareRepresentative.status === "" ? undefined : normalized.pmcareRepresentative.status ?? "";

    return normalized
  }

  useEffect(() => {
    const fetchAndSetup = async () => {
      setIsLoading(true);
      try {
        // 1. Load setup data first
        const setupData = getSetupData();
        if (setupData) {
          setPanelGroups(setupData.panelGroups || []);
          setSpokenLanguages(setupData.spokenLanguages || []);
          setProviderTypes(setupData.providerTypes || []);
          setProviderCategories(setupData.providerCategories || []);
        }

        // 2. Then load provider data
        const providerData = getProvider(params.id);

        // 3. Fetch additional registration data from the specific key
        const registrationDataString = localStorage.getItem(`provider-registration-${params.id}`);
        const registrationData = registrationDataString ? JSON.parse(registrationDataString) : {};

        // Enhanced debug logs
        console.log('Raw Provider Data:', providerData);
        console.log('Registration Data from localStorage:', registrationData);
        console.log('Provider SST Reg from main data:', providerData?.sstReg);
        console.log('Provider Taxpayer Status from main data:', providerData?.taxpayerStatus);
        console.log('Registration SST Reg:', registrationData.sstRegistrationNo);
        console.log('Registration Taxpayer Status:', registrationData.taxpayerStatus);

        // 4. Merge registrationData into providerData, giving precedence to registrationData for these specific fields
        const mergedProviderData = {
          ...providerData,
          sstReg: registrationData.sstRegistrationNo ?? providerData?.sstReg ?? "", // Use sstRegistrationNo from registrationData if available, else providerData.sstReg
          taxpayerStatus: registrationData.taxpayerStatus ?? providerData?.taxpayerStatus ?? "", // Use taxpayerStatus from registrationData if available, else providerData.taxpayerStatus
        };

        console.log("Merged Provider Data:", mergedProviderData);
        console.log("Final SST Reg:", mergedProviderData.sstReg);
        console.log("Final Taxpayer Status:", mergedProviderData.taxpayerStatus);

        const normalizedData = normalizeProviderData(mergedProviderData); // Normalize the merged data

        if (!providerData) {
          toast({
            title: "Provider Not Found",
            description: "The requested provider could not be found.",
            variant: "destructive",
          });
          setTimeout(() => {
            router.push("/providers");
          }, 3000);
          return;
        }

        console.log("Final Normalized Data SST Reg:", normalizedData.sstReg);
        console.log("Final Normalized Data Taxpayer Status:", normalizedData.taxpayerStatus);

        setProvider(normalizedData);
        setEditedProvider(JSON.parse(JSON.stringify(normalizedData))); // Deep copy for editing

        // Set state variables based on provider data
        setSelectedLanguages(normalizedData.selectedLanguages || []);
        setShowDepositField(normalizedData.depositRequired || false);
        setDepositAmount(normalizedData.depositAmount || "");
        setShowDiscountFields(normalizedData.corporateDiscount || false);
        setSelectedDiscountItems(normalizedData.selectedDiscountItems || []);
        setOperatingHoursType(normalizedData.operatingHours?.type || "");
        setShowRegularHours(normalizedData.operatingHours?.type === "Regular Hours");
        setShowAdditionalInfo(normalizedData.operatingHours?.showAdditionalInfo || false);

        // Set edit mode if URL parameter is present
        if (shouldStartInEditMode) {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetup();

    // Listen for provider changes
    const handleProvidersChange = () => {
      fetchAndSetup(); // Re-fetch everything on provider change
    };

    window.addEventListener("providersChanged", handleProvidersChange);

    return () => {
      window.removeEventListener("providersChanged", handleProvidersChange);
    };
  }, [params.id, shouldStartInEditMode, router]);

  

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setEditedProvider(JSON.parse(JSON.stringify(provider)))
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      console.log("Saving provider data:", editedProvider)

      // Ensure all fields are properly set before saving
      if (editedProvider.sstReg) {
        console.log("Saving SST Registration:", editedProvider.sstReg)
      }
      if (editedProvider.taxpayerStatus) {
        console.log("Saving Taxpayer Status:", editedProvider.taxpayerStatus)
      }
      if (editedProvider.servicesProvided && editedProvider.servicesProvided.length > 0) {
        console.log("Saving Services Provided:", editedProvider.servicesProvided)
      }
      if (editedProvider.drugList && editedProvider.drugList.length > 0) {
        console.log("Saving Drug List:", editedProvider.drugList)
      }
      if (editedProvider.staffing && editedProvider.staffing.length > 0) {
        console.log("Saving Staffing:", editedProvider.staffing)
      }

      // Update the provider in local storage
      saveProvider(editedProvider)

      // Update the provider state with the edited data
      setProvider(JSON.parse(JSON.stringify(editedProvider)))
      setIsEditing(false)

      toast({
        title: "Success",
        description: "Provider information updated successfully.",
      })
    } catch (error) {
      console.error("Error updating provider:", error)
      toast({
        title: "Error",
        description: "Failed to update provider information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setEditedProvider((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setEditedProvider((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }))
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

  const currentProvider = isEditing ? editedProvider : provider

  const handleUploadPoster = () => {
    // TODO: Implement handleUploadPoster function
  }

  const handleNewPackage = () => {
    // TODO: Implement handleNewPackage function
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Provider Network", href: "/providers" },
    { label: currentProvider.name, href: `/providers/${params.id}` },
  ]

  // Console log for validation
  console.log('Rendered Panel Group:', currentProvider.panelGroup);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-start">
        <PageHeader title={currentProvider.name} description={`Provider Code: ${currentProvider.code}`} />
        <div className="flex space-x-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={handleEditToggle}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Provider
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Provider Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Select
                  value={currentProvider.status.status}
                  onValueChange={(value) => handleNestedInputChange("status", "status", value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem> {/* Added 'terminated' */}
                  </SelectContent>
                </Select>
              ) : (
                <Badge className="bg-green-100 text-green-800">
                  {currentProvider.status?.status || currentProvider.status || "-"}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Panel Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pmcare-panel">PMCare Panel:</Label>
                      <Checkbox
                        id="pmcare-panel"
                        checked={currentProvider.pmcarePanel}
                        onCheckedChange={(checked) => handleInputChange("pmcarePanel", checked === true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ame-panel">AME Panel:</Label>
                      <Checkbox
                        id="ame-panel"
                        checked={currentProvider.amePanel}
                        onCheckedChange={(checked) => handleInputChange("amePanel", checked === true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="perkeso-panel">PERKESO Panel:</Label>
                      <Checkbox
                        id="perkeso-panel"
                        checked={currentProvider.perkesoPanel}
                        onCheckedChange={(checked) => handleInputChange("perkesoPanel", checked === true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="use-mediline">Use Mediline?</Label>
                      <Checkbox
                        id="use-mediline"
                        checked={currentProvider.useMediline}
                        onCheckedChange={(checked) => handleInputChange("useMediline", checked === true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="panel-group">Panel Group:</Label>
                      <Select
                        value={currentProvider.panelGroup}
                        onValueChange={(value) => handleInputChange("panelGroup", value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {panelGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>PMCare Panel:</span>
                      <span>{currentProvider.pmcarePanel ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AME Panel:</span>
                      <span>{currentProvider.amePanel ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PERKESO Panel:</span>
                      <span>{currentProvider.perkesoPanel ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Use Mediline:</span>
                      <span>{currentProvider.useMediline ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Panel Group:</span>
                      <span>{currentProvider.panelGroup || "-"}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1">
            Profile
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1">
            Payment
          </TabsTrigger>
          <TabsTrigger value="charges" className="flex-1">
            Charges
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="flex-1">
            Capabilities
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex-1">
            Experience
          </TabsTrigger>
          <TabsTrigger value="personnel" className="flex-1">
            Personnel
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex-1">
            <div className="flex items-center space-x-2">
              <span>Contract</span>
              {needsContractRenewal(currentProvider) && (
                <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                  Renew Contract
                </Badge>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="advertisement" className="flex-1">
            Advertisement
          </TabsTrigger>
          <TabsTrigger value="document" className="flex-1">
            Document
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="provider-code">Provider Code</Label>
                      <Input
                        id="provider-code"
                        value={currentProvider.code}
                        onChange={(e) => handleInputChange("code", e.target.value)}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-muted-foreground">Auto-generated by the system</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider-name">Provider Name (As per Borang B/F)</Label>
                      <Input
                        id="provider-name"
                        value={currentProvider.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider-alias">Provider Alias</Label>
                      <Input
                        id="provider-alias"
                        value={currentProvider.alias}
                        onChange={(e) => handleInputChange("alias", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={currentProvider.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={currentProvider.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={currentProvider.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        value={currentProvider.postcode}
                        onChange={(e) => handleInputChange("postcode", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={currentProvider.latitude}
                        onChange={(e) => handleInputChange("latitude", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={currentProvider.longitude}
                        onChange={(e) => handleInputChange("longitude", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Provider Code</h3>
                      <p>{currentProvider.code}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Provider Name</h3>
                      <p>{currentProvider.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Provider Alias</h3>
                      <p>{currentProvider.alias || "-"}</p>
                    </div>

                    <div className="col-span-2">
                      <h3 className="font-medium">Address</h3>
                      <p>{currentProvider.address}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">City</h3>
                      <p>{currentProvider.city}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">State</h3>
                      <p>{currentProvider.state}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Postcode</h3>
                      <p>{currentProvider.postcode}</p>
                    </div>

                    <div>
                      <h3 className="font-medium">Latitude</h3>
                      <p>{currentProvider.latitude || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Longitude</h3>
                      <p>{currentProvider.longitude || "-"}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tel-number">Telephone</Label>
                      <Input
                        id="tel-number"
                        value={currentProvider.telNumber}
                        onChange={(e) => handleInputChange("telNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fax-number">Fax</Label>
                      <Input
                        id="fax-number"
                        value={currentProvider.faxNumber}
                        onChange={(e) => handleInputChange("faxNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={currentProvider.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile-phone">Mobile</Label>
                      <Input
                        id="mobile-phone"
                        value={currentProvider.mobilePhone}
                        onChange={(e) => handleInputChange("mobilePhone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={currentProvider.whatsapp}
                        onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={currentProvider.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proprietor">Proprietor</Label>
                      <Input
                        id="proprietor"
                        value={currentProvider.proprietor}
                        onChange={(e) => handleInputChange("proprietor", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport">Passport No (For Non Malaysian Citizen Only)</Label>
                      <Input
                        id="passport"
                        value={currentProvider.passport}
                        onChange={(e) => handleInputChange("passport", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Telephone</h3>
                      <p>{currentProvider.telNumber}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Fax</h3>
                      <p>{currentProvider.faxNumber || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p>{currentProvider.email}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Mobile</h3>
                      <p>{currentProvider.mobilePhone || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">WhatsApp</h3>
                      <p>{currentProvider.whatsapp || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Website</h3>
                      <p>{currentProvider.website || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Proprietor</h3>
                      <p>{currentProvider.proprietor || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Passport No</h3>
                      <p>{currentProvider.passport || "-"}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company-reg-no">Company Registration No</Label>
                      <Input
                        id="company-reg-no"
                        value={currentProvider.companyRegNo}
                        onChange={(e) => handleInputChange("companyRegNo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gst-reg">GST Registration</Label>
                      <Input
                        id="gst-reg"
                        value={currentProvider.gstReg}
                        onChange={(e) => handleInputChange("gstReg", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sst-reg">SST Registration No.</Label>
                      <Input
                        id="sst-reg"
                        value={currentProvider.sstReg || ""}
                        onChange={(e) => handleInputChange("sstReg", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tin-no">TIN No</Label>
                      <Input
                        id="tin-no"
                        value={currentProvider.tinNo}
                        onChange={(e) => handleInputChange("tinNo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxpayer-status">Taxpayer Status</Label>
                      <Input
                        id="taxpayer-status"
                        value={currentProvider.taxpayerStatus || ""}
                        onChange={(e) => handleInputChange("taxpayerStatus", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Company Registration No</h3>
                      <p>{currentProvider.companyRegNo}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">GST Registration</h3>
                      <p>{currentProvider.gstReg || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">SST Registration No.</h3>
                      <p>{(() => {
                        console.log("Rendering SST Reg:", currentProvider.sstReg);
                        return currentProvider.sstReg || "-";
                      })()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">TIN No</h3>
                      <p>{currentProvider.tinNo}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Taxpayer Status</h3>
                      <p>{(() => {
                        console.log("Rendering Taxpayer Status:", currentProvider.taxpayerStatus);
                        return currentProvider.taxpayerStatus || "-";
                      })()}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classification & Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="provider-type">Provider Type</Label>
                      <Select
                        value={currentProvider.providerType}
                        onValueChange={(value) => handleInputChange("providerType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {providerTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider-category">Provider Category</Label>
                      <Select
                        value={currentProvider.providerCategory}
                        onValueChange={(value) => handleInputChange("providerCategory", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {providerCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gl-issuance"
                          checked={currentProvider.glIssuance}
                          onCheckedChange={(checked) => handleInputChange("glIssuance", checked === true)}
                        />
                        <Label htmlFor="gl-issuance">Eligibility for GL Issuance?</Label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Provider Type</h3>
                      <p>{currentProvider.providerType || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Provider Category</h3>
                      <p>{currentProvider.providerCategory || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Eligibility for GL Issuance?</h3>
                      <p>{currentProvider.glIssuance ? "Yes" : "No"}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Services Provided Section */}
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Services Provided</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {(currentProvider.servicesProvided || []).map((service: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${index}`}
                          checked={true}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              const updated = currentProvider.servicesProvided.filter((s: string) => s !== service)
                              handleInputChange("servicesProvided", updated)
                            }
                          }}
                        />
                        <Label htmlFor={`service-${index}`}>{service}</Label>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const updated = [...(currentProvider.servicesProvided || []), "New Service"]
                        handleInputChange("servicesProvided", updated)
                      }}
                    >
                      Add Service
                    </Button>
                  </div>
                ) : !currentProvider.servicesProvided || currentProvider.servicesProvided.length === 0 ? (
                  <p className="text-muted-foreground">No services selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(currentProvider.servicesProvided || []).map((service: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="operating-hours">Operating Hours</Label>
                      <Select
                        value={operatingHoursType}
                        onValueChange={(value) => {
                          setOperatingHoursType(value)
                          setShowRegularHours(value === "Regular Hours")
                          handleNestedInputChange("operatingHours", "type", value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Please select.." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24 Hours">24 Hours</SelectItem>
                        <SelectItem value="Regular Hours">Regular Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showRegularHours && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Weekdays (Mon-Fri)</Label>
                          <Input
                            value={currentProvider.operatingHours?.weekdays || ""}
                            onChange={(e) => handleNestedInputChange("operatingHours", "weekdays", e.target.value)}
                            placeholder="e.g., 8:00 AM - 6:00 PM"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Weekends (Sat-Sun)</Label>
                          <Input
                            value={currentProvider.operatingHours?.weekends || ""}
                            onChange={(e) => handleNestedInputChange("operatingHours", "weekends", e.target.value)}
                            placeholder="e.g., 9:00 AM - 1:00 PM"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="additional-info"
                          checked={showAdditionalInfo}
                          onCheckedChange={(checked) => {
                            setShowAdditionalInfo(checked === true)
                            handleNestedInputChange("operatingHours", "showAdditionalInfo", checked === true)
                          }}
                        />
                        <Label htmlFor="additional-info">Additional info</Label>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium">Hours Type</h3>
                    <p>{currentProvider.operatingHours?.type || "-"}</p>
                  </div>
                  {currentProvider.operatingHours?.type === "Regular Hours" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Monday - Friday</h3>
                        <p>{currentProvider.operatingHours?.weekdays || "-"}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Saturday - Sunday</h3>
                        <p>{currentProvider.operatingHours?.weekends || "-"}</p>
                      </div>
                      {currentProvider.operatingHours?.showAdditionalInfo && (
                        <div className="col-span-2">
                          <h3 className="font-medium">Additional Info</h3>
                          <p>{currentProvider.operatingHours?.additionalInfo || "-"}</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admission & Payment Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="deposit-required">Deposit Required</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="deposit-required"
                        checked={showDepositField}
                        onCheckedChange={(checked) => {
                          setShowDepositField(checked === true)
                          handleInputChange("depositRequired", checked === true)
                        }}
                      />
                      <Label htmlFor="deposit-required">Required</Label>
                    </div>
                    {showDepositField && (
                      <div className="mt-2">
                        <Label htmlFor="deposit-amount">Deposit Amount (RM)</Label>
                        <Input
                          id="deposit-amount"
                          value={depositAmount}
                          onChange={(e) => {
                            setDepositAmount(e.target.value)
                            handleInputChange("depositAmount", e.target.value)
                          }}
                          type="number"
                          step="0.01"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="corporate-discount">Corporate Discount</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="corporate-discount"
                        checked={showDiscountFields}
                        onCheckedChange={(checked) => {
                          setShowDiscountFields(checked === true)
                          handleInputChange("corporateDiscount", checked === true)
                        }}
                      />
                      <Label htmlFor="corporate-discount">Available</Label>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium">Deposit Required</h3>
                    <p>{currentProvider.depositRequired ? "Yes" : "No"}</p>
                    {currentProvider.depositRequired && (
                      <p className="mt-1">Amount: RM {currentProvider.depositAmount || "0.00"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Corporate Discount</h3>
                    <p>{currentProvider.corporateDiscount ? "Available" : "Not Available"}</p>
                  </div>
                </>
              )}
            </div>
            {!isEditing &&
              currentProvider.corporateDiscount &&
              (currentProvider.selectedDiscountItems || []).length > 0 && (
                <div className="mt-4 border rounded-md">
                  <h4 className="font-medium px-4 py-2 bg-gray-50 border-b">Discount Items</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Discount (%)</th>
                        <th className="px-4 py-2 text-left">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProvider.selectedDiscountItems.map((item: any, index: number) => (
                        <tr
                          key={index}
                          className={index < currentProvider.selectedDiscountItems.length - 1 ? "border-b" : ""}
                        >
                          <td className="px-4 py-2">{item.category || "-"}</td>
                          <td className="px-4 py-2">{item.item || "-"}</td>
                          <td className="px-4 py-2">{item.discount || "-"}</td>
                          <td className="px-4 py-2">{item.remarks || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PMCare Representative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="person-in-charge">Person In Charge</Label>
                    <Input
                      id="person-in-charge"
                      value={
                        currentProvider.pmcareRepresentative?.personInCharge ||
                        currentProvider.personInCharge || // Fallback
                        ""
                      }
                      onChange={(e) =>
                        handleNestedInputChange("pmcareRepresentative", "personInCharge", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={
                        currentProvider.pmcareRepresentative?.designation ||
                        currentProvider.designation || // Fallback
                        ""
                      }
                      onChange={(e) => handleNestedInputChange("pmcareRepresentative", "designation", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rep-phone">Phone</Label>
                    <Input
                      id="rep-phone"
                      value={
                        currentProvider.pmcareRepresentative?.phone ||
                        currentProvider.phone || // Fallback
                        ""
                      }
                      onChange={(e) => handleNestedInputChange("pmcareRepresentative", "phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rep-email">Email</Label>
                    <Input
                      id="rep-email"
                      type="email"
                      value={
                        currentProvider.pmcareRepresentative?.email ||
                        currentProvider.email || // Fallback
                        ""
                      }
                      onChange={(e) => handleNestedInputChange("pmcareRepresentative", "email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rep-status">Status</Label>
                    <Select
                      value={
                        currentProvider.pmcareRepresentative?.status ||
                        currentProvider.repStatus || // Fallback
                        ""
                      }
                      onValueChange={(value) => handleNestedInputChange("pmcareRepresentative", "status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium">Person In Charge</h3>
                    <p>
                      {currentProvider.pmcareRepresentative?.personInCharge || currentProvider.personInCharge || "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Designation</h3>
                    <p>{currentProvider.pmcareRepresentative?.designation || currentProvider.designation || "-"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p>{currentProvider.pmcareRepresentative?.phone || currentProvider.phone || "-"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>{currentProvider.pmcareRepresentative?.email || currentProvider.email || "-"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Status</h3>
                    <p>{currentProvider.pmcareRepresentative?.status || currentProvider.repStatus || "-"}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payee List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="account-no">Account No</Label>
                      <Input
                        id="account-no"
                        value={
                          currentProvider.paymentDetails?.accountNo ||
                          currentProvider.accountNo ||
                          currentProvider.payeeList?.accountNo ||
                          ""
                        }
                        onChange={(e) => handleNestedInputChange("paymentDetails", "accountNo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank">Bank</Label>
                      <Input
                        id="bank"
                        value={
                          currentProvider.paymentDetails?.bank ||
                          currentProvider.bank ||
                          currentProvider.payeeList?.bank ||
                          ""
                        }
                        onChange={(e) => handleNestedInputChange("paymentDetails", "bank", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payee">Payee</Label>
                      <Input
                        id="payee"
                        value={
                          currentProvider.paymentDetails?.payee ||
                          currentProvider.payee ||
                          currentProvider.payeeList?.payee ||
                          ""
                        }
                        onChange={(e) => handleNestedInputChange("paymentDetails", "payee", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-method-code">Payment Method Code</Label>
                      <Input
                        id="payment-method-code"
                        value={
                          currentProvider.paymentDetails?.paymentMethodCode ||
                          currentProvider.paymentMethodCode ||
                          currentProvider.payeeList?.paymentMethodCode ||
                          ""
                        }
                        onChange={(e) => handleNestedInputChange("paymentDetails", "paymentMethodCode", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Account No</h3>
                      <p>
                        {currentProvider.paymentDetails?.accountNo ||
                          currentProvider.accountNo ||
                          currentProvider.payeeList?.accountNo ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Bank</h3>
                      <p>
                        {currentProvider.paymentDetails?.bank ||
                          currentProvider.bank ||
                          currentProvider.payeeList?.bank ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Payee</h3>
                      <p>
                        {currentProvider.paymentDetails?.payee ||
                          currentProvider.payee ||
                          currentProvider.payeeList?.payee ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Payment Method Code</h3>
                      <p>
                        {currentProvider.paymentDetails?.paymentMethodCode ||
                          currentProvider.paymentMethodCode ||
                          currentProvider.payeeList?.paymentMethodCode ||
                          "-"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bank Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bg-no">BG No</Label>
                      <Input
                        id="bg-no"
                        value={currentProvider.bankGuarantee?.bgNo || currentProvider.bgNo || ""}
                        onChange={(e) => handleNestedInputChange("bankGuarantee", "bgNo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bg-amount">BG Amount (RM)</Label>
                      <Input
                        id="bg-amount"
                        type="number"
                        step="0.01"
                        value={currentProvider.bankGuarantee?.bgAmount || currentProvider.bgAmount || ""}
                        onChange={(e) => handleNestedInputChange("bankGuarantee", "bgAmount", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bg-expiry-date">BG Expiry Date</Label>
                      <Input
                        id="bg-expiry-date"
                        type="date"
                        value={currentProvider.bankGuarantee?.expiryDate || currentProvider.bgExpiryDate || ""}
                        onChange={(e) => handleNestedInputChange("bankGuarantee", "expiryDate", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">BG No</h3>
                      <p>{currentProvider.bankGuarantee?.bgNo || currentProvider.bgNo || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">BG Amount</h3>
                      <p>
                        {currentProvider.bankGuarantee?.bgAmount || currentProvider.bgAmount
                          ? `RM ${(currentProvider.bankGuarantee?.bgAmount || currentProvider.bgAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">BG Expiry Date</h3>
                      <p>{currentProvider.bankGuarantee?.expiryDate || currentProvider.bgExpiryDate || "-"}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charges" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Charges Type</th>
                      <th className="px-4 py-2 text-right">Charges (RM)</th>
                      {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(currentProvider.consultationFees || currentProvider.consultationCharges || []).map(
                      (fee: any, index: number) => (
                        <tr
                          key={index}
                          className={
                            index <
                            ((currentProvider.consultationFees || currentProvider.consultationCharges)?.length || 0) - 1
                              ? "border-b"
                              : ""
                          }
                        >
                          <td className="px-4 py-2">{fee.type || fee.chargeType || "N/A"}</td>
                          <td className="px-4 py-2 text-right">
                            {typeof fee.amount === "number"
                              ? fee.amount.toFixed(2)
                              : fee.amount || fee.charges || "0.00"}
                          </td>
                          {isEditing && (
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedFees = [
                                    ...(currentProvider.consultationFees || currentProvider.consultationCharges || []),
                                  ]
                                  updatedFees.splice(index, 1)
                                  handleInputChange("consultationFees", updatedFees)
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          )}
                        </tr>
                      ),
                    )}
                    {(currentProvider.consultationFees || currentProvider.consultationCharges || []).length === 0 && (
                      <tr>
                        <td colSpan={isEditing ? 3 : 2} className="px-4 py-2 text-center text-muted-foreground">
                          No consultation fees configured
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const updatedFees = [
                      ...(currentProvider.consultationFees || []),
                      { type: "New Fee Type", amount: "0.00" },
                    ]
                    handleInputChange("consultationFees", updatedFees)
                  }}
                >
                  Add Fee
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common and Chronic Illness Charges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Diagnosed Illness</th>
                      <th className="px-4 py-2 text-right">Average Cost (RM)</th>
                      {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(currentProvider.illnessFees || currentProvider.illnessCharges || []).map(
                      (fee: any, index: number) => (
                        <tr
                          key={index}
                          className={
                            index < ((currentProvider.illnessFees || currentProvider.illnessCharges)?.length || 0) - 1
                              ? "border-b"
                              : ""
                          }
                        >
                          <td className="px-4 py-2">{fee.illness || fee.diagnosedIllness || "N/A"}</td>
                          <td className="px-4 py-2 text-right">
                            {typeof fee.amount === "number"
                              ? fee.amount.toFixed(2)
                              : fee.amount || fee.cost || fee.averageCost || "0.00"}
                          </td>
                          {isEditing && (
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedFees = [
                                    ...(currentProvider.illnessFees || currentProvider.illnessCharges || []),
                                  ]
                                  updatedFees.splice(index, 1)
                                  handleInputChange("illnessFees", updatedFees)
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          )}
                        </tr>
                      ),
                    )}
                    {(currentProvider.illnessFees || currentProvider.illnessCharges || []).length === 0 && (
                      <tr>
                        <td colSpan={isEditing ? 3 : 2} className="px-4 py-2 text-center text-muted-foreground">
                          No illness charges configured
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const updatedFees = [
                      ...(currentProvider.illnessFees || []),
                      { illness: "New Illness", cost: "0.00" },
                    ]
                    handleInputChange("illnessFees", updatedFees)
                  }}
                >
                  Add Illness
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Technology Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Select Technology Infrastructure</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {(currentProvider.selectedTechInfrastructures || []).map((tech: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tech-${index}`}
                          checked={true}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              const updated = currentProvider.selectedTechInfrastructures.filter(
                                (t: string) => t !== tech,
                              )
                              handleInputChange("selectedTechInfrastructures", updated)
                            }
                          }}
                        />
                        <Label htmlFor={`tech-${index}`}>{tech}</Label>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const updated = [...(currentProvider.selectedTechInfrastructures || []), "New Technology"]
                        handleInputChange("selectedTechInfrastructures", updated)
                      }}
                    >
                      Add Technology
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Technologies</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {(currentProvider.selectedTechInfrastructures || []).map((tech: string, index: number) => (
                      <li key={index}>{tech}</li>
                    ))}
                  </ul>
                  {(!currentProvider.selectedTechInfrastructures ||
                    currentProvider.selectedTechInfrastructures.length === 0) && (
                    <p className="text-muted-foreground">No technologies selected</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laboratories Arrangement</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Select Laboratory Arrangements</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {(currentProvider.selectedLabArrangements || []).map((lab: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lab-${index}`}
                          checked={true}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              const updated = currentProvider.selectedLabArrangements.filter((l: string) => l !== lab)
                              handleInputChange("selectedLabArrangements", updated)
                            }
                          }}
                        />
                        <Label htmlFor={`lab-${index}`}>{lab}</Label>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const updated = [...(currentProvider.selectedLabArrangements || []), "New Lab Arrangement"]
                        handleInputChange("selectedLabArrangements", updated)
                      }}
                    >
                      Add Lab Arrangement
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Lab Arrangements</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {(currentProvider.selectedLabArrangements || []).map((lab: string, index: number) => (
                      <li key={index}>{lab}</li>
                    ))}
                  </ul>
                  {(!currentProvider.selectedLabArrangements ||
                    currentProvider.selectedLabArrangements.length === 0) && (
                    <p className="text-muted-foreground">No lab arrangements selected</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facilities/Services Available</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Select Facilities/Services</Label>
                  <div className="border rounded-md p-4 space-y-4">
                    {(currentProvider.selectedFacilities || []).map((facility: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`facility-${index}`}
                              checked={true}
                              onCheckedChange={(checked) => {
                                if (!checked) {
                                  const updated = currentProvider.selectedFacilities.filter(
                                    (f: any) => f.name !== facility.name,
                                  )
                                  handleInputChange("selectedFacilities", updated)
                                }
                              }}
                            />
                            <Label htmlFor={`facility-${index}`}>{facility.name}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`facility-charges-${index}`}>Charges (RM):</Label>
                            <Input
                              id={`facility-charges-${index}`}
                              value={facility.charges}
                              onChange={(e) => {
                                const updated = [...currentProvider.selectedFacilities]
                                updated[index].charges = e.target.value
                                handleInputChange("selectedFacilities", updated)
                              }}
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const updated = [
                          ...(currentProvider.selectedFacilities || []),
                          { name: "New Facility", charges: "0" },
                        ]
                        handleInputChange("selectedFacilities", updated)
                      }}
                    >
                      Add Facility
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Facilities</h3>
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Facility</th>
                          <th className="px-4 py-2 text-right">Charges (RM)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(currentProvider.selectedFacilities || []).map((facility: any, index: number) => (
                          <tr
                            key={index}
                            className={index < (currentProvider.selectedFacilities?.length || 0) - 1 ? "border-b" : ""}
                          >
                            <td className="px-4 py-2">{facility.name || "-"}</td>
                            <td className="px-4 py-2">{facility.charges || "-"}</td>
                          </tr>
                        ))}
                        {(!currentProvider.selectedFacilities || currentProvider.selectedFacilities.length === 0) && (
                          <tr>
                            <td colSpan={2} className="px-4 py-2 text-center text-muted-foreground">
                              No facilities selected
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drug List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Drug Name</th>
                      <th className="px-4 py-2 text-left">Generic Name</th>
                      <th className="px-4 py-2 text-left">Product Name</th>
                      <th className="px-4 py-2 text-left">Dosage</th>
                      <th className="px-4 py-2 text-right">Unit Price (RM)</th>
                      <th className="px-4 py-2 text-right">Minimum Selling</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Selling Price (RM)</th>
                      {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(currentProvider.drugList || []).map((drug: any, index: number) => (
                      <tr key={index} className={index < (currentProvider.drugList?.length || 0) - 1 ? "border-b" : ""}>
                        <td className="px-4 py-2">{drug.name || drug.drugName || "-"}</td>
                        <td className="px-4 py-2">{drug.genericName || "-"}</td>
                        <td className="px-4 py-2">{drug.productName || "-"}</td>
                        <td className="px-4 py-2">{drug.dosage || "-"}</td>
                        <td className="px-4 py-2 text-right">{drug.unitPrice || "-"}</td>
                        <td className="px-4 py-2 text-right">{drug.minimumSelling || "-"}</td>
                        <td className="px-4 py-2 text-right">{drug.quantity || "-"}</td>
                        <td className="px-4 py-2 text-right">{drug.sellingPrice || "-"}</td>
                        {isEditing && (
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = [...currentProvider.drugList]
                                updated.splice(index, 1)
                                handleInputChange("drugList", updated)
                              }}
                            >
                              Remove
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {(!currentProvider.drugList || currentProvider.drugList.length === 0) && (
                      <tr>
                        <td colSpan={isEditing ? 9 : 8} className="px-4 py-2 text-center text-muted-foreground">
                          No drugs in list
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const updated = [
                      ...(currentProvider.drugList || []),
                      {
                        name: "New Drug",
                        genericName: "",
                        productName: "",
                        dosage: "",
                        unitPrice: "",
                        minimumSelling: "",
                        quantity: "",
                        sellingPrice: "",
                      },
                    ]
                    handleInputChange("drugList", updated)
                  }}
                >
                  Add Drug
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Experiences</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Select Provider Experiences</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {(currentProvider.selectedExperiences || []).map((exp: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`exp-${index}`}
                          checked={true}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              const updated = currentProvider.selectedExperiences.filter((e: string) => e !== exp)
                              handleInputChange("selectedExperiences", updated)
                            }
                          }}
                        />
                        <Label htmlFor={`exp-${index}`}>{exp}</Label>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const updated = [...(currentProvider.selectedExperiences || []), "New Experience"]
                        handleInputChange("selectedExperiences", updated)
                      }}
                    >
                      Add Experience
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Experiences</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {(currentProvider.selectedExperiences || []).map((exp: string, index: number) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                  {(!currentProvider.selectedExperiences || currentProvider.selectedExperiences.length === 0) && (
                    <p className="text-muted-foreground">No experiences selected</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personnel" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider's Representative</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pic-doctor">Name of PIC doctor</Label>
                      <Input
                        id="pic-doctor"
                        value={
                          currentProvider.pmcareRepresentative?.nameOfPICDoctor ||
                          currentProvider.nameOfPICDoctor ||
                          currentProvider.picDoctor ||
                          ""
                        }
                        onChange={(e) =>
                          handleNestedInputChange("pmcareRepresentative", "nameOfPICDoctor", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pic-phone">Phone number</Label>
                      <Input
                        id="pic-phone"
                        value={
                          currentProvider.pmcareRepresentative?.phoneNumber ||
                          currentProvider.phoneNumber ||
                          currentProvider.picPhone ||
                          ""
                        }
                        onChange={(e) => handleNestedInputChange("pmcareRepresentative", "phoneNumber", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Name of PIC doctor</h3>
                      <p>
                        {currentProvider.pmcareRepresentative?.nameOfPICDoctor ||
                          currentProvider.nameOfPICDoctor ||
                          currentProvider.picDoctor ||
                          "-"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Phone number</h3>
                      <p>
                        {currentProvider.pmcareRepresentative?.phoneNumber ||
                          currentProvider.phoneNumber ||
                          currentProvider.picPhone ||
                          "-"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details of Practicing Doctors/Proprietors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">NRIC</th>
                      <th className="px-4 py-2 text-left">Degree</th>
                      <th className="px-4 py-2 text-left">Specialty</th>
                      <th className="px-4 py-2 text-left">Sub Specialty</th>
                      <th className="px-4 py-2 text-left">Working Hours</th>
                      {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(currentProvider.doctors || currentProvider.practicingDoctors || []).map(
                      (doctor: any, index: number) => (
                        <tr
                          key={index}
                          className={
                            index < ((currentProvider.doctors || currentProvider.practicingDoctors)?.length || 0) - 1
                              ? "border-b"
                              : ""
                          }
                        >
                          <td className="px-4 py-2">{doctor.name || "-"}</td>
                          <td className="px-4 py-2">{doctor.role || doctor.designation || "-"}</td>
                          <td className="px-4 py-2">{doctor.nric || doctor.icNo || "-"}</td>
                          <td className="px-4 py-2">{doctor.degree || doctor.qualification || "-"}</td>
                          <td className="px-4 py-2">{doctor.specialty || "-"}</td>
                          <td className="px-4 py-2">{doctor.subSpecialty || "-"}</td>
                          <td className="px-4 py-2">
                            {doctor.workingHoursStart && doctor.workingHoursEnd
                              ? `${doctor.workingHoursStart} - ${doctor.workingHoursEnd}`
                              : doctor.workingHours || "-"}
                          </td>
                          {isEditing && (
                            <td className="px-4 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedDoctors = [
                                    ...(currentProvider.doctors || currentProvider.practicingDoctors || []),
                                  ]
                                  updatedDoctors.splice(index, 1)
                                  handleInputChange("doctors", updatedDoctors)
                                }}
                              >
                                Remove
                              </Button>
                            </td>
                          )}
                        </tr>
                      ),
                    )}
                    {(currentProvider.doctors || currentProvider.practicingDoctors || []).length === 0 && (
                      <tr>
                        <td colSpan={isEditing ? 8 : 7} className="px-4 py-2 text-center text-muted-foreground">
                          No practicing doctors listed
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const newDoctor = {
                      name: "",
                      role: "",
                      nric: "",
                      degree: "",
                      specialty: "",
                      subSpecialty: "",
                      workingHours: "",
                    }
                    const updatedDoctors = [...(currentProvider.doctors || []), newDoctor]
                    handleInputChange("doctors", updatedDoctors)
                  }}
                >
                  Add Doctor
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Occupational Health Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Registration No.</th>
                      <th className="px-4 py-2 text-left">Effective Date</th>
                      <th className="px-4 py-2 text-left">Expiry Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(currentProvider.healthDoctors || []).map((doctor: any, index: number) => (
                      <tr
                        key={index}
                        className={index < (currentProvider.healthDoctors?.length || 0) - 1 ? "border-b" : ""}
                      >
                        <td className="px-4 py-2">{doctor.name || "-"}</td>
                        <td className="px-4 py-2">{doctor.registrationNo || "-"}</td>
                        <td className="px-4 py-2">{doctor.effectiveDate || "-"}</td>
                        <td className="px-4 py-2">{doctor.expiryDate || "-"}</td>
                        <td className="px-4 py-2">{doctor.status || "-"}</td>
                        {isEditing && (
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedDoctors = [...currentProvider.healthDoctors]
                                updatedDoctors.splice(index, 1)
                                handleInputChange("healthDoctors", updatedDoctors)
                              }}
                            >
                              Remove
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {(!currentProvider.healthDoctors || currentProvider.healthDoctors.length === 0) && (
                      <tr>
                        <td colSpan={isEditing ? 6 : 5} className="px-4 py-2 text-center text-muted-foreground">
                          No occupational health doctors listed
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const updated = [
                      ...(currentProvider.healthDoctors || []),
                      { name: "", registrationNo: "", effectiveDate: "", expiryDate: "", status: "" },
                    ]
                    handleInputChange("healthDoctors", updated)
                  }}
                >
                  Add Doctor
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resident Specialist</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Select Resident Specialists</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {(currentProvider.selectedSpecialists || []).map((specialist: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`specialist-${index}`}
                          checked={true}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              const updated = currentProvider.selectedSpecialists.filter(
                                (s: string) => s !== specialist,
                              )
                              handleInputChange("selectedSpecialists", updated)
                            }
                          }}
                        />
                        <Label htmlFor={`specialist-${index}`}>{specialist}</Label>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const updated = [...(currentProvider.selectedSpecialists || []), "New Specialist"]
                        handleInputChange("selectedSpecialists", updated)
                      }}
                    >
                      Add Specialist
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Specialists</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {(currentProvider.selectedSpecialists || []).map((specialist: string, index: number) => (
                      <li key={index}>{specialist}</li>
                    ))}
                  </ul>
                  {(!currentProvider.selectedSpecialists || currentProvider.selectedSpecialists.length === 0) && (
                    <p className="text-muted-foreground">No specialists selected</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radiographer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="radiographer-name">Name</Label>
                      <Input
                        id="radiographer-name"
                        value={currentProvider.radiographer?.name || ""}
                        onChange={(e) => handleNestedInputChange("radiographer", "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiographer-reg">Reg. No.</Label>
                      <Input
                        id="radiographer-reg"
                        value={currentProvider.radiographer?.regNo || ""}
                        onChange={(e) => handleNestedInputChange("radiographer", "regNo", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiographer-field">Radiographer Field Validation</Label>
                      <Input
                        id="radiographer-field"
                        value={currentProvider.radiographer?.fieldValidation || ""}
                        onChange={(e) => handleNestedInputChange("radiographer", "fieldValidation", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Name</h3>
                      <p>{currentProvider.radiographer?.name || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Reg. No.</h3>
                      <p>{currentProvider.radiographer?.regNo || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Field Validation</h3>
                      <p>{currentProvider.radiographer?.fieldValidation || "-"}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staffing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Count</th>
                      {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(currentProvider.staffing || []).map((staff: any, index: number) => (
                      <tr key={index} className={index < (currentProvider.staffing?.length || 0) - 1 ? "border-b" : ""}>
                        <td className="px-4 py-2">{staff.role || "-"}</td>
                        <td className="px-4 py-2">{staff.count || "-"}</td>
                        {isEditing && (
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = [...currentProvider.staffing]
                                updated.splice(index, 1)
                                handleInputChange("staffing", updated)
                              }}
                            >
                              Remove
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {(!currentProvider.staffing || currentProvider.staffing.length === 0) && (
                      <tr>
                        <td colSpan={isEditing ? 3 : 2} className="px-4 py-2 text-center text-muted-foreground">
                          No staffing information available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    const updated = [...(currentProvider.staffing || []), { role: "New Role", count: 1 }]
                    handleInputChange("staffing", updated)
                  }}
                >
                  Add Staff
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spoken Language</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label>Select Languages</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {spokenLanguages.map((language, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`language-${index}`}
                          checked={selectedLanguages.includes(language)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLanguages([...selectedLanguages, language])
                            } else {
                              setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language))
                            }
                          }}
                        />
                        <Label htmlFor={`language-${index}`}>{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Selected Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {(currentProvider.selectedLanguages || []).map((language: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                  {(!currentProvider.selectedLanguages || currentProvider.selectedLanguages.length === 0) && (
                    <p className="text-muted-foreground">No languages selected</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Panel Application Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <Label htmlFor="panel-application-date">Application Date</Label>
                    <Input
                      id="panel-application-date"
                      type="date"
                      value={
                        currentProvider.applicationDate ||
                        currentProvider.panelApplicationDate ||
                        currentProvider.contract?.applicationDate ||
                        ""
                      }
                      onChange={(e) => handleInputChange("applicationDate", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-medium">Application Date</h3>
                    <p>
                      {currentProvider.applicationDate ||
                        currentProvider.panelApplicationDate ||
                        currentProvider.contract?.applicationDate ||
                        "-"}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Period with PMCare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contract-start-date">Start Date</Label>
                      <Input
                        id="contract-start-date"
                        type="date"
                        value={currentProvider.contract?.startDate || ""}
                        onChange={(e) => handleNestedInputChange("contract", "startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract-end-date">End Date</Label>
                      <Input
                        id="contract-end-date"
                        type="date"
                        value={currentProvider.contract?.endDate || ""}
                        onChange={(e) => handleNestedInputChange("contract", "endDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract-duration">Duration</Label>
                      <Input
                        id="contract-duration"
                        value={currentProvider.contract?.duration || ""}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 h-full pt-6">
                        <Checkbox
                          id="contract-renewal"
                          checked={currentProvider.contract?.renewal || false}
                          onCheckedChange={(checked) =>
                            handleNestedInputChange("contract", "renewal", checked === true)
                          }
                        />
                        <Label htmlFor="contract-renewal">Contract renewal?</Label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">From</h3>
                      <p>{currentProvider.contract?.startDate || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Until</h3>
                      <p>{currentProvider.contract?.endDate || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Duration</h3>
                      <p>{currentProvider.contract?.duration || "-"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Renewal</h3>
                      <p>{currentProvider.contract?.renewal ? "Yes" : "No"}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contract-status">Status</Label>
                      <Select
                        value={currentProvider.status?.status || ""}
                        onValueChange={(value) => handleNestedInputChange("status", "status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {(currentProvider.status?.status === "suspended" ||
                      currentProvider.status?.status === "terminated") && (
                      <div className="space-y-2">
                        <Label htmlFor="effective-date">Effective Date</Label>
                        <Input
                          id="effective-date"
                          type="date"
                          value={currentProvider.status?.effectiveDate || ""}
                          onChange={(e) => handleNestedInputChange("status", "effectiveDate", e.target.value)}
                        />
                      </div>
                    )}
                    {currentProvider.status?.status === "suspended" && (
                      <div className="space-y-2">
                        <Label htmlFor="suspension-date">Suspension date</Label>
                        <Input
                          id="suspension-date"
                          type="date"
                          value={currentProvider.status?.suspensionDate || currentProvider.suspensionDate || ""}
                          onChange={(e) => handleNestedInputChange("status", "suspensionDate", e.target.value)}
                        />
                      </div>
                    )}
                    {currentProvider.status?.status === "terminated" && (
                      <div className="space-y-2">
                        <Label htmlFor="termination-date">Termination date</Label>
                        <Input
                          id="termination-date"
                          type="date"
                          value={currentProvider.status?.terminationDate || currentProvider.terminationDate || ""}
                          onChange={(e) => handleNestedInputChange("status", "terminationDate", e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="ceo-approval-date">CEO Approval Date</Label>
                      <Input
                        id="ceo-approval-date"
                        type="date"
                        value={currentProvider.status?.ceoApprovalDate || currentProvider.ceoApprovalDate || ""}
                        onChange={(e) => handleNestedInputChange("status", "ceoApprovalDate", e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <p>
                        {currentProvider.status?.status ||
                          currentProvider.status ||
                          currentProvider.contract?.status ||
                          "-"}
                      </p>
                    </div>
                    {currentProvider.status?.effectiveDate && (
                      <div>
                        <h3 className="font-medium">Effective Date</h3>
                        <p>{currentProvider.status?.effectiveDate}</p>
                      </div>
                    )}
                    {(currentProvider.status?.suspensionDate || currentProvider.suspensionDate) && (
                      <div>
                        <h3 className="font-medium">Suspension Date</h3>
                        <p>{currentProvider.status?.suspensionDate || currentProvider.suspensionDate}</p>
                      </div>
                    )}
                    {(currentProvider.status?.terminationDate || currentProvider.terminationDate) && (
                      <div>
                        <h3 className="font-medium">Termination Date</h3>
                        <p>{currentProvider.status?.terminationDate || currentProvider.terminationDate}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">Appointment Date (Auto generated after CEO approved)</h3>
                      <p>
                        {currentProvider.status?.ceoApprovalDate ||
                          currentProvider.ceoApprovalDate ||
                          currentProvider.contract?.ceoApprovalDate ||
                          "-"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advertisement" className="space-y-6 pt-6">
          <Tabs defaultValue="health-screening">
            <TabsList className="w-full">
              <TabsTrigger value="health-screening" className="flex-1">
                Health Screening Package
              </TabsTrigger>
              <TabsTrigger value="promotion" className="flex-1">
                Advertisement & Promotion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="health-screening" className="pt-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Packages</h3>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!isEditing}
                        onClick={() => {
                          // Trigger file input click
                          const fileInput = document.getElementById("poster-upload")
                          if (fileInput) fileInput.click()
                        }}
                      >
                        Upload Poster
                      </Button>
                      <Input
                        id="poster-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUploadPoster}
                      />
                      <Button type="button" disabled={!isEditing} onClick={handleNewPackage}>
                        New Package
                      </Button>
                    </div>
                  </div>

                  {!currentProvider.packages || currentProvider.packages.length === 0 ? (
                    <div className="border rounded-md p-6 text-center text-muted-foreground">
                      No packages created yet.
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Package Name</th>
                            <th className="px-4 py-2 text-left">Gender</th>
                            <th className="px-4 py-2 text-left">Price (RM)</th>
                            <th className="px-4 py-2 text-left">Discount (%)</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Booking Appointment (WhatsApp No.)</th>
                            <th className="px-4 py-2 text-left">List of Examination</th>
                            <th className="px-4 py-2 text-left">Poster</th>
                            {isEditing && <th className="px-4 py-2 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {(currentProvider.packages || currentProvider.healthScreeningPackages || []).map(
                            (pkg: any, index: number) => (
                              <tr key={pkg.id || index} className="border-b">
                                <td className="px-4 py-2">{pkg.name || pkg.packageName || pkg.title || "-"}</td>
                                <td className="px-4 py-2">{pkg.gender || "-"}</td>
                                <td className="px-4 py-2">{pkg.price || pkg.packagePrice || pkg.cost || "-"}</td>
                                <td className="px-4 py-2">
                                  {pkg.discount || pkg.discountPercentage || pkg.discountRate || "-"}
                                </td>
                                <td className="px-4 py-2">{pkg.description || "-"}</td>
                                <td className="px-4 py-2">{pkg.whatsappNumber || pkg.bookingWhatsApp || "-"}</td>
                                <td className="px-4 py-2">
                                  {pkg.examinations && pkg.examinations.length > 0 ? pkg.examinations.join(", ") : "-"}
                                </td>
                                <td className="px-4 py-2">
                                  {pkg.posterUrl ? (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a
                                        href={pkg.posterUrl}
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                        rel="noreferrer"
                                      >
                                        View Poster
                                      </a>
                                    </Button>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                {isEditing && (
                                  <td className="px-4 py-2 text-right">
                                    <Button variant="ghost" size="sm">
                                      Edit
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      Delete
                                    </Button>
                                  </td>
                                )}
                              </tr>
                            ),
                          )}
                          {(currentProvider.packages || currentProvider.healthScreeningPackages || []).length === 0 && (
                            <tr>
                              <td colSpan={isEditing ? 9 : 8} className="px-4 py-2 text-center text-muted-foreground">
                                No packages created yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promotion" className="pt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="promotion-file">File Attachment</Label>
                      <Input id="promotion-file" type="file" multiple />
                    </div>
                  )}

                  {!currentProvider.promotionFiles || currentProvider.promotionFiles.length === 0 ? (
                    <div className="border rounded-md p-6 text-center text-muted-foreground">
                      No promotion files uploaded.
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">File Name</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Upload Date</th>
                            <th className="px-4 py-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(
                            currentProvider.promotionFiles ||
                            currentProvider.advertisementFiles ||
                            currentProvider.promotionDocuments ||
                            []
                          ).map((file: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2">
                                {file.url ? (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    className="text-blue-600 hover:underline"
                                    rel="noreferrer"
                                  >
                                    {typeof file === "string" ? file : file.name || file.fileName || file.title || "-"}
                                  </a>
                                ) : typeof file === "string" ? (
                                  file
                                ) : (
                                  file.name || file.fileName || file.title || "-"
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {typeof file === "string"
                                  ? "Document"
                                  : file.type || file.fileType || file.mimeType || "Document"}
                              </td>
                              <td className="px-4 py-2">
                                {typeof file === "string" ? "-" : file.uploadDate || file.date || "-"}
                              </td>
                              {!isEditing && (
                                <td className="px-4 py-2 text-right">
                                  {file.url && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a
                                        href={file.url}
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                        rel="noreferrer"
                                      >
                                        View
                                      </a>
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm">
                                    Remove
                                  </Button>
                                </td>
                              )}
                              {isEditing && (
                                <td className="px-4 py-2 text-right">
                                  <Button variant="ghost" size="sm">
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Remove
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                          {(!currentProvider.promotionFiles &&
                            !currentProvider.advertisementFiles &&
                            !currentProvider.promotionDocuments) ||
                            ((
                              currentProvider.promotionFiles ||
                              currentProvider.advertisementFiles ||
                              currentProvider.promotionDocuments ||
                              []
                            ).length === 0) ? (
                              <tr>
                                <td colSpan={isEditing ? 4 : 3} className="px-4 py-2 text-center text-muted-foreground">
                                  No promotion files uploaded.
                                </td>
                              </tr>
                            ) : null}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {isEditing && <Button type="button">Add More</Button>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="document" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Required Document Listing</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-clinic">Clinic Registration Documents</Label>
                    <Input id="document-clinic" type="file" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document-license">License Documents</Label>
                    <Input id="document-license" type="file" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document-other">Other Documents</Label>
                    <Input id="document-other" type="file" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Uploaded Documents</h3>
                  {(
                    currentProvider.documents ||
                    currentProvider.requiredDocuments ||
                    currentProvider.documentSubmissions ||
                    []
                  ).length > 0 ? (
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Document Type</th>
                            <th className="px-4 py-2 text-left">File Name</th>
                            <th className="px-4 py-2 text-left">Upload Date</th>
                            <th className="px-4 py-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(
                            currentProvider.documents ||
                            currentProvider.requiredDocuments ||
                            currentProvider.documentSubmissions ||
                            []
                          ).map((doc: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2">{doc.type || doc.documentType || doc.title || "Document"}</td>
                              <td className="px-4 py-2">
                                {doc.url ? (
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    className="text-blue-600 hover:underline"
                                    rel="noreferrer"
                                  >
                                    {doc.name || doc.fileName || doc.file || doc.filename || "-"}
                                  </a>
                                ) : (
                                  doc.name || doc.fileName || doc.file || doc.filename || "-"
                                )}
                              </td>
                              <td className="px-4 py-2">{doc.uploadDate || doc.date || "-"}</td>
                              <td className="px-4 py-2 text-right">
                                {!isEditing && doc.url && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      className="text-blue-600 hover:underline"
                                      rel="noreferrer"
                                    >
                                      View
                                    </a>
                                  </Button>
                                )}
                                {isEditing && (
                                  <Button variant="ghost" size="sm">
                                    Remove
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No documents have been uploaded yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QRCode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <Label htmlFor="qrcode-image">Upload QRCode</Label>
                    <Input id="qrcode-image" type="file" />
                  </>
                ) : (
                  <>
                    <h3 className="font-medium">QR Code</h3>
                    {currentProvider.qrCode ||
                    currentProvider.qrCodeImage ||
                    currentProvider.qrCodeFile ||
                    currentProvider.qrCodeUrl ? (
                      <div className="border rounded-md p-4 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          QR Code File:{" "}
                          {currentProvider.qrCode || currentProvider.qrCodeImage || currentProvider.qrCodeFile || "-"}
                        </p>
                        {(currentProvider.qrCodeUrl || currentProvider.qrCodeImage) && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={currentProvider.qrCodeUrl || currentProvider.qrCodeImage}
                              target="_blank"
                              className="text-blue-600 hover:underline"
                              rel="noreferrer"
                            >
                              View QR Code
                            </a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No QR code has been uploaded yet.</p>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )\
}
