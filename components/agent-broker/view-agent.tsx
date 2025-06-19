"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getAgentById } from "@/lib/agent-broker/agent-broker-storage"
import type { Agent } from "@/lib/agent-broker/types"
import Link from "next/link"

interface ViewAgentProps {
  agentId: string
}

export function ViewAgent({ agentId }: ViewAgentProps) {
  const [agent, setAgent] = useState<Agent | null>(null)

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent Broker", href: "/agent-broker" },
    { label: "Agent Management", href: "/agent-broker/agent" },
    { label: "View Agent", href: `/agent-broker/agent/view/${agentId}` },
  ]

  useEffect(() => {
    const agentData = getAgentById(agentId)
    setAgent(agentData || null)
  }, [agentId])

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "Inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "Suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{`${agent.firstName} ${agent.lastName}`}</h1>
          <p className="text-gray-600">Agent Code: {agent.agentCode}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/agent-broker/agent">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
          <Link href={`/agent-broker/agent/edit/${agent.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Agent
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{agent.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{agent.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date Joined</p>
                <p className="font-medium">{new Date(agent.dateJoined).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">{getStatusBadge(agent.status)}</div>
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
              <p className="text-sm text-gray-600">License Number</p>
              <p className="font-medium">{agent.licenseNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">License Expiry Date</p>
              <p className="font-medium">{new Date(agent.licenseExpiryDate).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Commission Rate</p>
                <p className="font-medium">{agent.commissionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <div className="font-medium">
                  <p>{agent.address}</p>
                  <p>{`${agent.city}, ${agent.state} ${agent.zipCode}`}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
