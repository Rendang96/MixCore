"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Trash2, Filter } from "lucide-react"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"
import { getAgents, deleteAgent, searchAgents } from "@/lib/agent-broker/agent-broker-storage"
import type { Agent } from "@/lib/agent-broker/types"
import Link from "next/link"

export function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent Broker", href: "/agent-broker" },
    { label: "Agent Management", href: "/agent-broker/agent" },
  ]

  useEffect(() => {
    const loadAgents = () => {
      const agentData = getAgents()
      setAgents(agentData)
      setFilteredAgents(agentData)
    }
    loadAgents()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAgents(agents)
    } else {
      const results = searchAgents(searchQuery)
      setFilteredAgents(results)
    }
  }, [searchQuery, agents])

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      deleteAgent(id)
      const updatedAgents = getAgents()
      setAgents(updatedAgents)
      setFilteredAgents(updatedAgents)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-600">Manage insurance agents and their information</p>
        </div>
        <Link href="/agent-broker/agent/register">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Register New Agent
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search agents by name, email, license number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agents ({filteredAgents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.agentCode}</TableCell>
                  <TableCell>{`${agent.firstName} ${agent.lastName}`}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.phone}</TableCell>
                  <TableCell>{agent.licenseNumber}</TableCell>
                  <TableCell>{agent.commissionRate}%</TableCell>
                  <TableCell>{getStatusBadge(agent.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/agent-broker/agent/view/${agent.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/agent-broker/agent/edit/${agent.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(agent.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
