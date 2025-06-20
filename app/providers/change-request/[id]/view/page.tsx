"use client"

import { useState, useCallback } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FileText, AlertCircle } from "lucide-react"

// Mock data for provider information (replace with actual API calls)
const mockProviderDataMix = {
  // Basic Information
  providerCode: "PRV001",
  providerName: "City Medical Center",
  providerAlias: "City Med",
  address: "123 Healthcare Ave, Medical District",
  city: "Kuala Lumpur",
  state: "Wilayah Persekutuan",
  postcode: "50088",
  latitude: "3.1390",
  longitude: "101.6869",

  // Contact Information
  telNumber: "03-2345-6789",
  faxNumber: "03-2345-6780",
  email: "info@citymed.com",
  mobilePhone: "012-345-6789",
  whatsapp: "012-345-6789",
  website: "www.citymed.com",
  proprietor: "Dr. Ahmad Bin Abdullah",
  passportNo: "",

  // Registration & Compliance
  companyRegNo: "ABC12345",
  gstReg: "GST12345",
  tinNo: "TIN12345",

  // Classification & Services
  providerType: "Clinic",
  glIssuance: true,
  providerCategory: "Primary Care",
  servicesProvided: ["General Practice", "Basic Health Screening"],

  // Panel & Service Eligibility
  amePanel: true,
  perkesoPanel: false,
  panelGroup: "Group A",

  // Admission & Payment Policies
  imposeDeposit: true,
  depositAmount: 500,
  corporateDiscount: true,
  discounts: [{ category: "Corporate", item: "Consultation", discount: "10%", remarks: "For all corporate clients" }],

  // Operational Details
  operatingHours: "Regular Hours",
  dailyHours: "9:00 AM - 6:00 PM",
  weekdayHours: "9:00 AM - 7:00 PM",
  weekendHours: "10:00 AM - 2:00 PM",
  additionalHours: {
    monday: "9:00 AM - 7:00 PM",
    tuesday: "9:00 AM - 7:00 PM",
    wednesday: "9:00 AM - 7:00 PM",
    thursday: "9:00 AM - 7:00 PM",
    friday: "9:00 AM - 7:00 PM",
    saturday: "10:00 AM - 2:00 PM",
    sunday: "Closed",
    publicHoliday: "Closed",
  },

  // Payment
  accountNo: "1234567890",
  bank: "Maybank",
  payee: "City Medical Center Sdn Bhd",

  // Charges
  consultationFees: [
    { type: "General Consultation", charge: 50 },
    { type: "Specialist Consultation", charge: 120 },
  ],
  chronicIllnessCharges: [
    { illness: "Diabetes", averageCost: 80 },
    { illness: "Hypertension", averageCost: 70 },
  ],

  // Capabilities
  technologyInfrastructure: ["Electronic Medical Records", "Online Appointment System"],
  laboratoriesArrangement: ["In-house Basic Lab", "Outsourced to Pathlab"],
  facilitiesAvailable: [
    { facility: "X-Ray", charge: 100 },
    { facility: "ECG", charge: 80 },
  ],

  // Experience
  providerExperiences: ["10+ years in primary care", "5+ years in corporate health screening"],

  // Personnel
  picDoctor: "Dr. Ahmad Bin Abdullah",
  picPhone: "012-345-6789",
  staffing: [
    { role: "Doctor OSH", count: 1 },
    { role: "Nurse", count: 3 },
    { role: "Others", count: 2 },
  ],

  doctors: [
    {
      name: "Dr. Ahmad Bin Abdullah",
      role: "Principal Doctor",
      nric: "800101-14-5678",
      gender: "Male",
      university: "University of Malaya",
      degree: "MBBS",
      year: "2005",
      mmcNo: "MMC12345",
      nsrNo: "NSR12345",
      apcNo: "APC12345",
      additionalQualification: "DFM",
      workingHoursStart: "9:00 AM",
      workingHoursEnd: "7:00 PM",
    },
  ],

  ohdDoctors: [
    {
      name: "Dr. Ahmad Bin Abdullah",
      registrationNo: "OHD12345",
      effectiveDate: "2020-01-01",
      expiryDate: "2025-12-31",
      status: "Active",
    },
  ],

  residentSpecialist: ["General Practice"],
  spokenLanguages: ["English", "Malay", "Mandarin"],

  radiographers: [
    {
      name: "John Doe",
      regNo: "RAD12345",
      fieldValidation: "Certified",
    },
  ],

  // Contract
  panelApplicationDate: "2020-01-15",

  // Advertisement
  healthScreeningPackages: [
    {
      name: "Basic Health Screening",
      description: "Comprehensive basic health screening package",
      discount: "10%",
      bookingAppointment: "012-345-6789",
      examinations: ["Blood Test", "Urine Test", "Physical Examination"],
      fileAttachment: "basic_health_screening.pdf",
    },
  ],

  advertisementPromotions: [
    {
      title: "Year End Promotion",
      fileAttachment: "year_end_promo.pdf",
    },
  ],

  // Documents
  documents: [
    { name: "Certificate of Clinic License (Borang B)", file: "borang_b.pdf" },
    { name: "Annual Practicing Certificate (APC)", file: "apc.pdf" },
    { name: "SSM Form 9", file: "ssm_form9.pdf" },
  ],
}

const mockProviderDataMediline = {
  // Basic Information
  providerCode: "PRV001",
  providerName: "City Medical Center & Specialists",
  providerAlias: "City Med",
  address: "456 Wellness Blvd, Healthville",
  city: "Petaling Jaya",
  state: "Selangor",
  postcode: "47810",
  latitude: "3.1073",
  longitude: "101.6068",

  // Contact Information
  telNumber: "03-7654-3210",
  faxNumber: "03-7654-3211",
  email: "info@citymed.com",
  mobilePhone: "012-345-6789",
  whatsapp: "012-345-6789",
  website: "www.citymed.com",
  proprietor: "Dr. Ahmad Bin Abdullah",
  passportNo: "",

  // Registration & Compliance
  companyRegNo: "ABC12345",
  gstReg: "GST12345",
  tinNo: "TIN12345",

  // Classification & Services
  providerType: "Clinic & Specialist Center",
  glIssuance: true,
  providerCategory: "Primary & Secondary Care",
  servicesProvided: ["General Practice", "Specialist Consultation", "Health Screening", "Minor Surgery"],

  // Panel & Service Eligibility
  amePanel: true,
  perkesoPanel: true,
  panelGroup: "Group A",

  // Admission & Payment Policies
  imposeDeposit: true,
  depositAmount: 1000,
  corporateDiscount: true,
  discounts: [
    { category: "Corporate", item: "Consultation", discount: "15%", remarks: "For all corporate clients" },
    { category: "Corporate", item: "Health Screening", discount: "10%", remarks: "For corporate packages" },
  ],

  // Operational Details
  operatingHours: "Regular Hours",
  dailyHours: "8:00 AM - 8:00 PM",
  weekdayHours: "8:00 AM - 8:00 PM",
  weekendHours: "9:00 AM - 5:00 PM",
  additionalHours: {
    monday: "8:00 AM - 8:00 PM",
    tuesday: "8:00 AM - 8:00 PM",
    wednesday: "8:00 AM - 8:00 PM",
    thursday: "8:00 AM - 8:00 PM",
    friday: "8:00 AM - 8:00 PM",
    saturday: "9:00 AM - 5:00 PM",
    sunday: "9:00 AM - 1:00 PM",
    publicHoliday: "Closed",
  },

  // Payment
  accountNo: "0987654321",
  bank: "CIMB",
  payee: "City Medical Center Sdn Bhd",

  // Charges
  consultationFees: [
    { type: "General Consultation", charge: 60 },
    { type: "Specialist Consultation", charge: 150 },
    { type: "Follow-up Consultation", charge: 40 },
  ],
  chronicIllnessCharges: [
    { illness: "Diabetes", averageCost: 100 },
    { illness: "Hypertension", averageCost: 90 },
    { illness: "Asthma", averageCost: 120 },
  ],

  // Capabilities
  technologyInfrastructure: ["Electronic Medical Records", "Online Appointment System", "Telemedicine Platform"],
  laboratoriesArrangement: ["In-house Comprehensive Lab", "Outsourced to Pathlab for specialized tests"],
  facilitiesAvailable: [
    { facility: "X-Ray", charge: 120 },
    { facility: "ECG", charge: 100 },
    { facility: "Ultrasound", charge: 200 },
  ],

  // Experience
  providerExperiences: [
    "15+ years in primary care",
    "10+ years in corporate health screening",
    "5+ years in specialist services",
  ],

  // Personnel
  picDoctor: "Dr. Ahmad Bin Abdullah",
  picPhone: "012-345-6789",
  staffing: [
    { role: "Doctor OSH", count: 2 },
    { role: "Nurse", count: 5 },
    { role: "Others", count: 3 },
  ],

  doctors: [
    {
      name: "Dr. Ahmad Bin Abdullah",
      role: "Principal Doctor",
      nric: "800101-14-5678",
      gender: "Male",
      university: "University of Malaya",
      degree: "MBBS",
      year: "2005",
      mmcNo: "MMC12345",
      nsrNo: "NSR12345",
      apcNo: "APC23456",
      additionalQualification: "DFM, Master in Family Medicine",
      workingHoursStart: "8:00 AM",
      workingHoursEnd: "8:00 PM",
    },
    {
      name: "Dr. Sarah Binti Mohamed",
      role: "Specialist",
      nric: "850215-14-5432",
      gender: "Female",
      university: "National University of Malaysia",
      degree: "MBBS, MS",
      year: "2010",
      mmcNo: "MMC23456",
      nsrNo: "NSR23456",
      apcNo: "APC23456",
      additionalQualification: "MS (General Surgery)",
      workingHoursStart: "9:00 AM",
      workingHoursEnd: "5:00 PM",
    },
  ],

  ohdDoctors: [
    {
      name: "Dr. Ahmad Bin Abdullah",
      registrationNo: "OHD12345",
      effectiveDate: "2020-01-01",
      expiryDate: "2025-12-31",
      status: "Active",
    },
    {
      name: "Dr. Tan Wei Ming",
      registrationNo: "OHD23456",
      effectiveDate: "2021-06-01",
      expiryDate: "2026-05-31",
      status: "Active",
    },
  ],

  residentSpecialist: ["General Practice", "General Surgery", "Internal Medicine"],
  spokenLanguages: ["English", "Malay", "Mandarin", "Tamil"],

  radiographers: [
    {
      name: "John Doe",
      regNo: "RAD12345",
      fieldValidation: "Certified",
    },
    {
      name: "Jane Smith",
      regNo: "RAD23456",
      fieldValidation: "Certified",
    },
  ],

  // Contract
  panelApplicationDate: "2020-01-15",

  // Advertisement
  healthScreeningPackages: [
    {
      name: "Comprehensive Health Screening",
      description: "Full comprehensive health screening package",
      discount: "15%",
      bookingAppointment: "012-345-6789",
      examinations: ["Complete Blood Test", "Urine Test", "Physical Examination", "ECG", "Ultrasound", "X-Ray"],
      fileAttachment: "comprehensive_health_screening.pdf",
    },
    {
      name: "Executive Health Screening",
      description: "Premium health screening for executives",
      discount: "10%",
      bookingAppointment: "012-345-6789",
      examinations: [
        "Complete Blood Test",
        "Urine Test",
        "Physical Examination",
        "ECG",
        "Ultrasound",
        "X-Ray",
        "Stress Test",
      ],
      fileAttachment: "executive_health_screening.pdf",
    },
  ],

  // Documents
  documents: [
    { name: "Certificate of Clinic License (Borang B)", file: "borang_b.pdf" },
    { name: "Annual Practicing Certificate (APC)", file: "apc.pdf" },
    { name: "SSM Form 9", file: "ssm_form9.pdf" },
    { name: "Form 24 and 49", file: "form_24_49.pdf" },
    { name: "Sales and Purchase Agreement", file: "spa.pdf" },
    { name: "Practitioner's Registration Certificate (Borang 10)", file: "borang_10.pdf" },
    { name: "Information and Bank Account details", file: "bank_details.pdf" },
  ],
}

// List of required documents
const requiredDocuments = [
  "Copy of Sales and Purchase Agreement between previous owner",
  "Certified true copy of the Certificate of Clinic License to Operate as per Private Healthcare Facilities and Services Act- Borang B / Borang F",
  "Certified true copy of the Practitioner's Full Registration Certificate of partner(s) or assistant(s) - Borang 10",
  "Certified true copy of the Principal Doctor's Annual Practicing Certificate (APC); and Partner(s) or assistant(s) - APC Borang 12",
  "Certified true copy of Form 9 (Suruhanjaya Syarikat Malaysia) (if applicable) - SSM",
  "Form 24 and 49 (Return Giving Particulars in Register of Directors, Manager and Secretaries and Changes of Particulars) (if applicable)",
  "Information and Bank Account details (Borang Maklumat Klinik-PMCare)",
]

export default function ProviderChangeRequestViewPage({ params }: { params: { id: string } }) {
  const [providerMix, setProviderMix] = useState(mockProviderDataMix)
  const [providerMediline, setProviderMediline] = useState(mockProviderDataMediline)
  // Initialize selectedData with all differences defaulting to "mediline"
  const [selectedData, setSelectedData] = useState<Record<string, "mix" | "mediline">>(() => {
    const initialSelections: Record<string, "mix" | "mediline"> = {}

    // Helper function to check differences and set default selection
    const checkAndSetDefault = (field: string, subfield?: string) => {
      const fieldKey = subfield ? `${field}.${subfield}` : field
      const mixValue = subfield ? providerMix[field]?.[subfield] : providerMix[field]
      const medilineValue = subfield ? providerMediline[field]?.[subfield] : providerMediline[field]

      if (JSON.stringify(mixValue) !== JSON.stringify(medilineValue)) {
        initialSelections[fieldKey] = "mediline"
      }
    }

    // Check all fields for differences
    Object.keys(providerMix).forEach((field) => {
      if (typeof providerMix[field] === "object" && providerMix[field] !== null && !Array.isArray(providerMix[field])) {
        // For nested objects, check each subfield
        Object.keys(providerMix[field]).forEach((subfield) => {
          checkAndSetDefault(field, subfield)
        })
      } else {
        checkAndSetDefault(field)
      }
    })

    return initialSelections
  })

  // Define breadcrumb items
  const breadcrumbItems = [
    { title: "Home", href: "/" },
    { title: "Providers", href: "/providers" },
    { title: "Change Requests", href: "/providers/change-request" },
    { title: "View Change Request", href: `/providers/change-request/${params.id}/view`, current: true },
  ]

  // Function to check if a field is different between the two data sources
  const isDifferent = useCallback(
    (field: string, subfield?: string) => {
      if (subfield) {
        return JSON.stringify(providerMix[field]?.[subfield]) !== JSON.stringify(providerMediline[field]?.[subfield])
      }
      return JSON.stringify(providerMix[field]) !== JSON.stringify(providerMediline[field])
    },
    [providerMix, providerMediline],
  )

  // Function to handle selection of data source for a field
  const handleSelectData = (field: string, source: "mix" | "mediline") => {
    setSelectedData((prev) => ({
      ...prev,
      [field]: source,
    }))
  }

  // Function to handle approve and update
  const handleApproveAndUpdate = () => {
    console.log("Approved and updated with selected data:", selectedData)
    // Implement actual update logic here
  }

  // Render a field with comparison
  const renderField = (label: string, field: string, subfield?: string) => {
    const mixValue = subfield ? providerMix[field]?.[subfield] : providerMix[field]
    const medilineValue = subfield ? providerMediline[field]?.[subfield] : providerMediline[field]
    const fieldKey = subfield ? `${field}.${subfield}` : field
    const different = isDifferent(field, subfield)

    return (
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className={`space-y-2 p-3 rounded-md ${different ? "bg-yellow-50" : ""}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
            {different && (
              <RadioGroup
                value={selectedData[fieldKey] === "mix" ? "mix" : ""}
                onValueChange={() => handleSelectData(fieldKey, "mix")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mix" id={`mix-${fieldKey}`} />
                  <Label htmlFor={`mix-${fieldKey}`}>Select</Label>
                </div>
              </RadioGroup>
            )}
          </div>
          <div className="flex items-center">
            <p className="break-words">{typeof mixValue === "boolean" ? mixValue.toString() : mixValue || "N/A"}</p>
            {different && <AlertCircle className="h-4 w-4 ml-2 text-yellow-500" />}
          </div>
        </div>
        <div className={`space-y-2 p-3 rounded-md ${different ? "bg-yellow-50" : ""}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
            {different && (
              <RadioGroup
                value={selectedData[fieldKey] === "mediline" ? "mediline" : ""}
                onValueChange={() => handleSelectData(fieldKey, "mediline")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mediline" id={`mediline-${fieldKey}`} />
                  <Label htmlFor={`mediline-${fieldKey}`}>Select</Label>
                </div>
              </RadioGroup>
            )}
          </div>
          <div className="flex items-center">
            <p className="break-words">
              {typeof medilineValue === "boolean" ? medilineValue.toString() : medilineValue || "N/A"}
            </p>
            {different && <AlertCircle className="h-4 w-4 ml-2 text-yellow-500" />}
          </div>
        </div>
      </div>
    )
  }

  // Get provider status from URL params
  const [providerStatus, setProviderStatus] = useState(() => {
    // In a real implementation, you would fetch this from an API based on params.id
    // For demo purposes, we'll use the ID to determine the status
    const id = params.id
    if (id === "CR001") return "New"
    if (id === "CR002") return "Verified by Afiqah"
    if (id === "CR003") return "Approved by Azni"
    if (id === "CR004") return "Attended by Ahmad"
    return "New" // Default fallback
  })

  const [paymentVerified, setPaymentVerified] = useState(false)

  const handleVerifyPayment = () => {
    setPaymentVerified(true)
    console.log("Payment verified with previous provider")
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <PageHeader title="Provider Change Request View" description="View and manage provider information changes" />
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => {
            // Create a new object with all different fields set to "mediline"
            const allMediline: Record<string, "mix" | "mediline"> = {}

            // Helper function to check differences and set to mediline
            const checkAndSetMediline = (field: string, subfield?: string) => {
              const fieldKey = subfield ? `${field}.${subfield}` : field
              const mixValue = subfield ? providerMix[field]?.[subfield] : providerMix[field]
              const medilineValue = subfield ? providerMediline[field]?.[subfield] : providerMediline[field]

              if (JSON.stringify(mixValue) !== JSON.stringify(medilineValue)) {
                allMediline[fieldKey] = "mediline"
              }
            }

            // Check all fields for differences
            Object.keys(providerMix).forEach((field) => {
              if (
                typeof providerMix[field] === "object" &&
                providerMix[field] !== null &&
                !Array.isArray(providerMix[field])
              ) {
                // For nested objects, check each subfield
                Object.keys(providerMix[field]).forEach((subfield) => {
                  checkAndSetMediline(field, subfield)
                })
              } else {
                checkAndSetMediline(field)
              }
            })

            setSelectedData(allMediline)
          }}
        >
          Select All Data from Mediline
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Data from Mix</CardTitle>
            <CardDescription>Current provider information</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data from Mediline</CardTitle>
            <CardDescription>Updated provider information from Mediline</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-9 w-full">
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

        <TabsContent value="profile" className="space-y-4">
          <Accordion type="single" collapsible defaultValue="basic-info">
            <AccordionItem value="basic-info">
              <AccordionTrigger>
                <div className="flex items-center">
                  Basic Information
                  {(isDifferent("providerName") ||
                    isDifferent("providerAlias") ||
                    isDifferent("address") ||
                    isDifferent("city") ||
                    isDifferent("state") ||
                    isDifferent("postcode") ||
                    isDifferent("latitude") ||
                    isDifferent("longitude")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Provider Code (readonly)", "providerCode")}
                {renderField("Provider Name (As per Borang B/F)", "providerName")}
                {renderField("Provider Alias", "providerAlias")}
                {renderField("Address", "address")}
                {renderField("City", "city")}
                {renderField("State", "state")}
                {renderField("Postcode", "postcode")}
                {renderField("Latitude", "latitude")}
                {renderField("Longitude", "longitude")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact-info">
              <AccordionTrigger>
                <div className="flex items-center">
                  Contact Information
                  {(isDifferent("telNumber") ||
                    isDifferent("faxNumber") ||
                    isDifferent("email") ||
                    isDifferent("mobilePhone") ||
                    isDifferent("whatsapp") ||
                    isDifferent("website") ||
                    isDifferent("proprietor") ||
                    isDifferent("passportNo")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Provider Tel Number", "telNumber")}
                {renderField("Provider Fax No", "faxNumber")}
                {renderField("Email Address", "email")}
                {renderField("Mobile Phone No", "mobilePhone")}
                {renderField("Phone WhatsApp", "whatsapp")}
                {renderField("Website", "website")}
                {renderField("Proprietor", "proprietor")}
                {renderField("Passport No (For Non Malaysian Citizen Only)", "passportNo")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="registration-compliance">
              <AccordionTrigger>
                <div className="flex items-center">
                  Registration & Compliance
                  {(isDifferent("companyRegNo") || isDifferent("gstReg") || isDifferent("tinNo")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Company Registration No", "companyRegNo")}
                {renderField("GST Registration", "gstReg")}
                {renderField("TIN No", "tinNo")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="classification-services">
              <AccordionTrigger>
                <div className="flex items-center">
                  Classification & Services
                  {(isDifferent("providerType") ||
                    isDifferent("glIssuance") ||
                    isDifferent("providerCategory") ||
                    isDifferent("servicesProvided")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Provider Type", "providerType")}
                {renderField("Eligibility for GL Issuance?", "glIssuance")}
                {renderField("Provider Category", "providerCategory")}
                {renderField("Services Provided", "servicesProvided")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="panel-eligibility">
              <AccordionTrigger>
                <div className="flex items-center">
                  Panel & Service Eligibility
                  {(isDifferent("amePanel") || isDifferent("perkesoPanel") || isDifferent("panelGroup")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("AME Panel?", "amePanel")}
                {renderField("PERKESO Panel?", "perkesoPanel")}
                {renderField("Panel Group", "panelGroup")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="admission-payment">
              <AccordionTrigger>
                <div className="flex items-center">
                  Admission & Payment Policies
                  {(isDifferent("imposeDeposit") ||
                    isDifferent("depositAmount") ||
                    isDifferent("corporateDiscount") ||
                    isDifferent("discounts")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Impose deposit for admission?", "imposeDeposit")}
                {renderField("Deposit Amount (RM)", "depositAmount")}
                {renderField("Corporate Discount?", "corporateDiscount")}
                {/* Render discounts table here */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="operational-details">
              <AccordionTrigger>
                <div className="flex items-center">
                  Operational Details
                  {(isDifferent("operatingHours") ||
                    isDifferent("dailyHours") ||
                    isDifferent("weekdayHours") ||
                    isDifferent("weekendHours") ||
                    isDifferent("additionalHours")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Operating Hours", "operatingHours")}
                {renderField("Daily", "dailyHours")}
                {renderField("Monday – Friday", "weekdayHours")}
                {renderField("Saturday – Sunday", "weekendHours")}
                {/* Render additional hours here */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Accordion type="single" collapsible defaultValue="payee-details">
            <AccordionItem value="payee-details">
              <AccordionTrigger>
                <div className="flex items-center">
                  Payee List Details
                  {(isDifferent("accountNo") || isDifferent("bank") || isDifferent("payee")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Account No", "accountNo")}
                {renderField("Bank", "bank")}
                {renderField("Payee", "payee")}

                {/* Show verification button if there are payment changes */}
                {(isDifferent("accountNo") || isDifferent("bank") || isDifferent("payee")) && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    {!paymentVerified ? (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-700">
                          Payment details require verification with previous provider
                        </p>
                        <Button onClick={handleVerifyPayment} variant="outline" size="sm">
                          Verify with previous provider
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-green-700">The account no. have been verified by the clinic</p>
                      </div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="charges" className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="consultation-fees">
              <AccordionTrigger>
                <div className="flex items-center">
                  Charges for Consultation Fees
                  {isDifferent("consultationFees") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render consultation fees table here */}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="chronic-illness">
              <AccordionTrigger>
                <div className="flex items-center">
                  Charges for Common and Chronic Illness
                  {isDifferent("chronicIllnessCharges") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render chronic illness charges table here */}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="technology">
              <AccordionTrigger>
                <div className="flex items-center">
                  Provider Technology Infrastructure
                  {isDifferent("technologyInfrastructure") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Technology Infrastructure", "technologyInfrastructure")}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="laboratories">
              <AccordionTrigger>
                <div className="flex items-center">
                  Laboratories Arrangement
                  {isDifferent("laboratoriesArrangement") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{renderField("Laboratories Arrangement", "laboratoriesArrangement")}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="facilities">
              <AccordionTrigger>
                <div className="flex items-center">
                  Facilities/Services Available
                  {isDifferent("facilitiesAvailable") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render facilities table here */}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Accordion type="single" collapsible defaultValue="provider-experiences">
            <AccordionItem value="provider-experiences">
              <AccordionTrigger>
                <div className="flex items-center">
                  Provider Experiences
                  {isDifferent("providerExperiences") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{renderField("Experiences", "providerExperiences")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="personnel" className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="provider-representative">
              <AccordionTrigger>
                <div className="flex items-center">
                  Provider's Representative
                  {(isDifferent("picDoctor") || isDifferent("picPhone") || isDifferent("staffing")) && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderField("Name of PIC doctor", "picDoctor")}
                {renderField("Phone number", "picPhone")}
                {/* Render staffing table here */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="practicing-doctors">
              <AccordionTrigger>
                <div className="flex items-center">
                  Details of Practicing Doctors/Proprietors
                  {isDifferent("doctors") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render doctors table here */}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="ohd-doctors">
              <AccordionTrigger>
                <div className="flex items-center">
                  Occupational Health Doctor
                  {isDifferent("ohdDoctors") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render OHD doctors table here */}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="resident-specialist">
              <AccordionTrigger>
                <div className="flex items-center">
                  Resident Specialist
                  {isDifferent("residentSpecialist") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{renderField("Speciality", "residentSpecialist")}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="spoken-language">
              <AccordionTrigger>
                <div className="flex items-center">
                  Spoken Language
                  {isDifferent("spokenLanguages") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{renderField("Spoken Language", "spokenLanguages")}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="radiographer">
              <AccordionTrigger>
                <div className="flex items-center">
                  Radiographer
                  {isDifferent("radiographers") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render radiographers table here */}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="contract" className="space-y-4">
          <Accordion type="single" collapsible defaultValue="panel-application">
            <AccordionItem value="panel-application">
              <AccordionTrigger>
                <div className="flex items-center">
                  Panel Application Date
                  {isDifferent("panelApplicationDate") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{renderField("Date", "panelApplicationDate")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="advertisement" className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="health-screening">
              <AccordionTrigger>
                <div className="flex items-center">
                  Health Screening Package
                  {isDifferent("healthScreeningPackages") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render health screening packages here */}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="advertisement-promotion">
              <AccordionTrigger>
                <div className="flex items-center">
                  Advertisement & Promotion
                  {isDifferent("advertisementPromotions") && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100">
                      Changes
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>{/* Render advertisement promotions here */}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>View and download required documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requiredDocuments.map((doc, index) => {
                  const mixDoc = providerMix.documents?.find((d) => d.name.includes(doc.split(" - ")[0]))
                  const medilineDoc = providerMediline.documents?.find((d) => d.name.includes(doc.split(" - ")[0]))

                  return (
                    <div key={index} className="grid grid-cols-2 gap-6 p-4 border rounded-md">
                      <div>
                        <h3 className="font-medium mb-2">{doc}</h3>
                        {mixDoc ? (
                          <Button variant="outline" className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            View Document
                          </Button>
                        ) : (
                          <p className="text-muted-foreground">No document available</p>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">{doc}</h3>
                        {medilineDoc ? (
                          <Button variant="outline" className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            View Document
                          </Button>
                        ) : (
                          <p className="text-muted-foreground">No document available</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 mt-8">
        <div className="mr-auto">
          <Badge
            variant={
              providerStatus === "New"
                ? "default"
                : providerStatus.startsWith("Verified")
                  ? "outline"
                  : providerStatus.startsWith("Approved")
                    ? "success"
                    : providerStatus.startsWith("Attended")
                      ? "secondary"
                      : "default"
            }
          >
            {providerStatus}
          </Badge>
        </div>
        {providerStatus === "New" && (
          <>
            <Button
              onClick={() => console.log("Verify")}
              disabled={(isDifferent("accountNo") || isDifferent("bank") || isDifferent("payee")) && !paymentVerified}
            >
              Verify
            </Button>
          </>
        )}
        {providerStatus === "Verified by Afiqah" && <Button onClick={() => console.log("Approve")}>Approve</Button>}
        {providerStatus === "Approved by Azni" && <Button onClick={handleApproveAndUpdate}>Approve and Update</Button>}
      </div>
    </div>
  )
}
