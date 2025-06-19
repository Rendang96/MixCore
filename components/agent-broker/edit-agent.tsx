"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getAgentById, updateAgent } from "@/lib/agent-broker/agent-broker-storage"
import type { Agent } from "@/lib/agent-broker/types"
import Link from "next/link"

interface EditAgentProps {
  agentId: string
}

export function EditAgent({ agentId }: EditAgentProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [formData, setFormData] = useState({
    agentCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    commissionRate: "",
    status: "Active" as Agent["status"],
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent Broker", href: "/agent-broker" },
    { label: "Agent Management", href: "/agent-broker/agent" },
    { label: "Edit Agent", href: `/agent-broker/agent/edit/${agentId}` },
  ]

  useEffect(() => {
    const agentData = getAgentById(agentId)
    if (agentData) {
      setAgent(agentData)
      setFormData({
        agentCode: agentData.agentCode,
        firstName: agentData.firstName,
        lastName: agentData.lastName,
        email: agentData.email,
        phone: agentData.phone,
        licenseNumber: agentData.licenseNumber,
        licenseExpiryDate: agentData.licenseExpiryDate,
        commissionRate: agentData.commissionRate.toString(),
        status: agentData.status,
        address: agentData.address,
        city: agentData.city,
        state: agentData.state,
        zipCode: agentData.zipCode,
      })
    }
  }, [agentId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const updates: Partial<Agent> = {
        ...formData,
        commissionRate: Number.parseFloat(formData.commissionRate),
      }

      updateAgent(agentId, updates)
      router.push(`/agent-broker/agent/view/${agentId}`)
    } catch (error) {
      console.error("Error updating agent:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!agent) {
    return (
      <div className="space-y-6">
        <PageBreadcrumbs items={breadcrumbs} />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Agent not found</h2>
          <p className="text-gray-600 mt-2">The agent you're looking for doesn't exist.</p>
          <Link href="/agent-broker/agent">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Agent</h1>
          <p className="text-gray-600">Update agent information</p>
        </div>
        <Link href={`/agent-broker/agent/view/${agentId}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agent
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="agentCode">Agent Code *</Label>
                <Input
                  id="agentCode"
                  value={formData.agentCode}
                  onChange={(e) => handleInputChange("agentCode", e.target.value)}
                  placeholder="AGT001"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Smith"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john.smith@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1-555-0101"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  placeholder="LIC001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="licenseExpiryDate">License Expiry Date *</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={formData.licenseExpiryDate}
                  onChange={(e) => handleInputChange("licenseExpiryDate", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="commissionRate">Commission Rate (%) *</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.commissionRate}
                  onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                  placeholder="5.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="NY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Link href={`/agent-broker/agent/view/${agentId}`}>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "Updating..." : "Update Agent"}
          </Button>
        </div>
      </form>
    </div>
  )
}
