"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit, Users } from "lucide-react"
import Link from "next/link"
import { getSalesManagers, getAgents } from "@/lib/agent-broker/agent-broker-storage"
import type { SalesManager, Agent } from "@/lib/agent-broker/types"

export function SalesManagerDashboard() {
  const [salesManagers, setSalesManagers] = useState<SalesManager[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredManagers, setFilteredManagers] = useState<SalesManager[]>([])

  useEffect(() => {
    const managerData = getSalesManagers()
    const agentData = getAgents()
    setSalesManagers(managerData)
    setAgents(agentData)
    setFilteredManagers(managerData)
  }, [])

  useEffect(() => {
    const filtered = salesManagers.filter(
      (manager) =>
        `${manager.firstName} ${manager.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.managerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.region.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredManagers(filtered)
  }, [searchTerm, salesManagers])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "Inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getAssignedAgentsNames = (assignedAgentIds: string[]) => {
    return assignedAgentIds
      .map((id) => {
        const agent = agents.find((a) => a.id === id)
        return agent ? `${agent.firstName} ${agent.lastName}` : ""
      })
      .filter((name) => name)
      .join(", ")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Marketing Management</h1>
          <p className="text-gray-600">Manage S&M supervisors and their assigned agents</p>
        </div>
        <Link href="/agent-broker/sales-manager/register">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Register New S&M Manager
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search managers by name, email, code, department, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department/Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Agents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredManagers.map((manager) => (
                <tr key={manager.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {manager.firstName} {manager.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{manager.managerCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{manager.email}</div>
                    <div className="text-sm text-gray-500">{manager.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{manager.department}</div>
                    <div className="text-sm text-gray-500">{manager.region}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {manager.assignedAgents.length > 0 ? (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{manager.assignedAgents.length} agent(s)</span>
                          </div>
                          <div className="text-xs text-gray-500">{getAssignedAgentsNames(manager.assignedAgents)}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No agents assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(manager.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link href={`/agent-broker/sales-manager/view/${manager.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/agent-broker/sales-manager/edit/${manager.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/agent-broker/sales-manager/assign/${manager.id}`}>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredManagers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No sales managers found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
