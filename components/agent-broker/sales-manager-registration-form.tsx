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
import { createSalesManager, getSalesManagers } from "@/lib/agent-broker/agent-broker-storage"
import type { SalesManager } from "@/lib/agent-broker/types"

export function SalesManagerRegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    managerCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    region: "",
    status: "Active",
    dateJoined: new Date().toISOString().split("T")[0],
    address: "",
    city: "",
    state: "",
    zipCode: "",
    targetRevenue: "",
    managementLevel: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingCode, setIsGeneratingCode] = useState(true)

  useEffect(() => {
    const generateManagerCode = () => {
      const existingManagers = getSalesManagers()
      const existingCodes = existingManagers.map((manager) => manager.managerCode)

      let counter = 1
      let newCode: string
      do {
        newCode = `SM${counter.toString().padStart(3, "0")}`
        counter++
      } while (existingCodes.includes(newCode))

      setFormData((prev) => ({ ...prev, managerCode: newCode }))
      setIsGeneratingCode(false)
    }

    generateManagerCode()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.managerCode.trim()) newErrors.managerCode = "Manager code is required"
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.region.trim()) newErrors.region = "Region is required"

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.targetRevenue && isNaN(Number(formData.targetRevenue))) {
      newErrors.targetRevenue = "Target revenue must be a valid number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const newSalesManager: Omit<SalesManager, "id" | "assignedAgents"> = {
        ...formData,
        targetRevenue: formData.targetRevenue ? Number(formData.targetRevenue) : undefined,
      }

      createSalesManager(newSalesManager)
      router.push("/agent-broker/sales-manager")
    } catch (error) {
      console.error("Error creating sales manager:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Sales & Marketing Manager</h1>
          <p className="text-gray-600">Add a new S&M manager to supervise agents</p>
        </div>
        <Link href="/agent-broker/sales-manager">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Managers
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="managerCode">Manager Code (Auto-generated) *</Label>
                  <Input
                    id="managerCode"
                    value={formData.managerCode}
                    readOnly
                    className="bg-gray-50"
                    placeholder={isGeneratingCode ? "Generating..." : ""}
                  />
                  {errors.managerCode && <p className="text-sm text-red-600">{errors.managerCode}</p>}
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                </div>
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
                <Label htmlFor="dateJoined">Date Joined</Label>
                <Input
                  id="dateJoined"
                  type="date"
                  value={formData.dateJoined}
                  onChange={(e) => handleInputChange("dateJoined", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                    <SelectItem value="Business Development">Business Development</SelectItem>
                    <SelectItem value="Regional Sales">Regional Sales</SelectItem>
                    <SelectItem value="Corporate Sales">Corporate Sales</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <Label htmlFor="region">Region *</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="East">East</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="National">National</SelectItem>
                  </SelectContent>
                </Select>
                {errors.region && <p className="text-sm text-red-600">{errors.region}</p>}
              </div>

              <div>
                <Label htmlFor="managementLevel">Management Level</Label>
                <Select
                  value={formData.managementLevel}
                  onValueChange={(value) => handleInputChange("managementLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select management level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                    <SelectItem value="Team Lead">Team Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetRevenue">Target Revenue (Annual)</Label>
                <Input
                  id="targetRevenue"
                  type="number"
                  value={formData.targetRevenue}
                  onChange={(e) => handleInputChange("targetRevenue", e.target.value)}
                  placeholder="Enter target revenue"
                />
                {errors.targetRevenue && <p className="text-sm text-red-600">{errors.targetRevenue}</p>}
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
          <Link href="/agent-broker/sales-manager">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Registering..." : "Register S&M Manager"}
          </Button>
        </div>
      </form>
    </div>
  )
}
