"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createBroker, getBrokers } from "@/lib/agent-broker/agent-broker-storage"
import type { Broker } from "@/lib/agent-broker/types"

export function BrokerRegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    brokerCode: "",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    commissionRate: "",
    status: "Active",
    dateJoined: new Date().toISOString().split("T")[0],
    address: "",
    city: "",
    state: "",
    zipCode: "",
    website: "",
    businessType: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingCode, setIsGeneratingCode] = useState(true)

  // Generate unique broker code on component mount
  useEffect(() => {
    const generateBrokerCode = async () => {
      setIsGeneratingCode(true)
      try {
        const brokers = getBrokers()
        const existingCodes = brokers.map((broker) => broker.brokerCode)

        let counter = 1
        let newCode = ""

        do {
          newCode = `BRK${counter.toString().padStart(3, "0")}`
          counter++
        } while (existingCodes.includes(newCode))

        setFormData((prev) => ({ ...prev, brokerCode: newCode }))
      } catch (error) {
        console.error("Error generating broker code:", error)
      } finally {
        setIsGeneratingCode(false)
      }
    }

    generateBrokerCode()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    // Don't allow changing the broker code
    if (field === "brokerCode") return

    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.brokerCode.trim()) newErrors.brokerCode = "Broker code is required"
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required"
    if (!formData.licenseExpiryDate) newErrors.licenseExpiryDate = "License expiry date is required"
    if (!formData.commissionRate.trim()) newErrors.commissionRate = "Commission rate is required"

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (
      formData.commissionRate &&
      (isNaN(Number(formData.commissionRate)) ||
        Number(formData.commissionRate) < 0 ||
        Number(formData.commissionRate) > 100)
    ) {
      newErrors.commissionRate = "Commission rate must be between 0 and 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const newBroker: Omit<Broker, "id"> = {
        ...formData,
        commissionRate: Number(formData.commissionRate),
      }

      await createBroker(newBroker)
      router.push("/agent-broker/broker")
    } catch (error) {
      console.error("Error creating broker:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Broker</h1>
          <p className="text-gray-600">Add a new insurance broker company to the system</p>
        </div>
        <Link href="/agent-broker/broker">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brokers
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brokerCode">Broker Code (Auto-generated) *</Label>
                  <Input
                    id="brokerCode"
                    value={formData.brokerCode}
                    onChange={(e) => handleInputChange("brokerCode", e.target.value)}
                    placeholder={isGeneratingCode ? "Generating..." : "e.g., BRK001"}
                    className="bg-gray-100"
                    readOnly
                  />
                  {errors.brokerCode && <p className="text-sm text-red-600">{errors.brokerCode}</p>}
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                />
                {errors.companyName && <p className="text-sm text-red-600">{errors.companyName}</p>}
              </div>

              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  placeholder="Enter contact person name"
                />
                {errors.contactPerson && <p className="text-sm text-red-600">{errors.contactPerson}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="Enter website URL"
                />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  placeholder="e.g., Insurance Brokerage"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>License & Commission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  placeholder="Enter license number"
                />
                {errors.licenseNumber && <p className="text-sm text-red-600">{errors.licenseNumber}</p>}
              </div>

              <div>
                <Label htmlFor="licenseExpiryDate">License Expiry Date *</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={formData.licenseExpiryDate}
                  onChange={(e) => handleInputChange("licenseExpiryDate", e.target.value)}
                />
                {errors.licenseExpiryDate && <p className="text-sm text-red-600">{errors.licenseExpiryDate}</p>}
              </div>

              <div>
                <Label htmlFor="commissionRate">Commission Rate (%) *</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commissionRate}
                  onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                  placeholder="e.g., 7.5"
                />
                {errors.commissionRate && <p className="text-sm text-red-600">{errors.commissionRate}</p>}
              </div>

              <div>
                <Label htmlFor="dateJoined">Date Joined</Label>
                <Input
                  id="dateJoined"
                  type="date"
                  value={formData.dateJoined}
                  onChange={(e) => handleInputChange("dateJoined", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Address Information</h4>
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Link href="/agent-broker/broker">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Registering..." : "Register Broker"}
          </Button>
        </div>
      </form>
    </div>
  )
}
