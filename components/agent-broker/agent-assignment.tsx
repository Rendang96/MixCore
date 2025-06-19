"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  getSalesManagerById,
  getAgents,
  assignAgentToManager,
  unassignAgentFromManager,
} from "@/lib/agent-broker/agent-broker-storage"
import type { SalesManager, Agent } from "@/lib/agent-broker/types"

interface AgentAssignmentProps {
  managerId: string
}

export function AgentAssignment({ managerId }: AgentAssignmentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [manager, setManager] = useState<SalesManager | null>(null)
  const [allAgents, setAllAgents] = useState<Agent[]>([])
  const [assignedAgents, setAssignedAgents] = useState<Agent[]>([])
  const [unassignedAgents, setUnassignedAgents] = useState<Agent[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch manager
        const managerData = await getSalesManagerById(managerId)
        if (!managerData) {
          alert("Sales Manager not found")
          router.push("/agent-broker/sales-manager")
          return
        }
        setManager(managerData)

        // Fetch all agents
        const agentsData = await getAgents()
        setAllAgents(agentsData)

        // Separate assigned and unassigned agents
        const assigned = agentsData.filter((agent) => agent.salesManagerId === managerId)
        const unassigned = agentsData.filter((agent) => !agent.salesManagerId || agent.salesManagerId !== managerId)

        setAssignedAgents(assigned)
        setUnassignedAgents(unassigned)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [managerId, router])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, reset to original unassigned list
      const unassigned = allAgents.filter((agent) => !agent.salesManagerId || agent.salesManagerId !== managerId)
      setUnassignedAgents(unassigned)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allAgents.filter(
      (agent) =>
        (!agent.salesManagerId || agent.salesManagerId !== managerId) &&
        (agent.name.toLowerCase().includes(query) ||
          agent.email.toLowerCase().includes(query) ||
          agent.licenseNumber.toLowerCase().includes(query)),
    )
    setUnassignedAgents(filtered)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    const unassigned = allAgents.filter((agent) => !agent.salesManagerId || agent.salesManagerId !== managerId)
    setUnassignedAgents(unassigned)
  }

  const toggleAgentSelection = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter((id) => id !== agentId))
    } else {
      setSelectedAgents([...selectedAgents, agentId])
    }
  }

  const handleAssignAgents = async () => {
    if (selectedAgents.length === 0 || !manager) return

    setSaving(true)
    try {
      // Assign each selected agent to the manager
      const assignPromises = selectedAgents.map((agentId) => assignAgentToManager(agentId, managerId))
      await Promise.all(assignPromises)

      // Refresh the data
      const agentsData = await getAgents()
      const assigned = agentsData.filter((agent) => agent.salesManagerId === managerId)
      const unassigned = agentsData.filter((agent) => !agent.salesManagerId || agent.salesManagerId !== managerId)

      setAllAgents(agentsData)
      setAssignedAgents(assigned)
      setUnassignedAgents(unassigned)
      setSelectedAgents([])
    } catch (error) {
      console.error("Error assigning agents:", error)
      alert("Failed to assign agents. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleUnassignAgent = async (agentId: string) => {
    if (!manager) return

    setSaving(true)
    try {
      await unassignAgentFromManager(agentId, managerId)

      // Refresh the data
      const agentsData = await getAgents()
      const assigned = agentsData.filter((agent) => agent.salesManagerId === managerId)
      const unassigned = agentsData.filter((agent) => !agent.salesManagerId || agent.salesManagerId !== managerId)

      setAllAgents(agentsData)
      setAssignedAgents(assigned)
      setUnassignedAgents(unassigned)
    } catch (error) {
      console.error("Error unassigning agent:", error)
      alert("Failed to unassign agent. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!manager) {
    return <div className="text-center py-8">Sales Manager not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assign Agents to {manager.name}</h1>
        <button onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Agents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Assigned Agents ({assignedAgents.length})</h2>

          {assignedAgents.length > 0 ? (
            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">License</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{agent.name}</td>
                      <td className="py-2 px-4 border-b">{agent.email}</td>
                      <td className="py-2 px-4 border-b">{agent.licenseNumber}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleUnassignAgent(agent.id)}
                          disabled={saving}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          Unassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500">No agents assigned to this manager</div>
          )}
        </div>

        {/* Available Agents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Available Agents ({unassignedAgents.length})</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by name, email, or license"
              className="flex-1 p-2 border border-gray-300 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              Search
            </button>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {unassignedAgents.length > 0 ? (
            <>
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Select</th>
                      <th className="py-2 px-4 border-b text-left">Name</th>
                      <th className="py-2 px-4 border-b text-left">Email</th>
                      <th className="py-2 px-4 border-b text-left">License</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unassignedAgents.map((agent) => (
                      <tr
                        key={agent.id}
                        className={`hover:bg-gray-50 ${selectedAgents.includes(agent.id) ? "bg-blue-50" : ""}`}
                        onClick={() => toggleAgentSelection(agent.id)}
                      >
                        <td className="py-2 px-4 border-b">
                          <input
                            type="checkbox"
                            checked={selectedAgents.includes(agent.id)}
                            onChange={() => {}}
                            className="h-4 w-4"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">{agent.name}</td>
                        <td className="py-2 px-4 border-b">{agent.email}</td>
                        <td className="py-2 px-4 border-b">{agent.licenseNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAssignAgents}
                  disabled={selectedAgents.length === 0 || saving}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  {saving ? "Assigning..." : `Assign Selected (${selectedAgents.length})`}
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No available agents found</div>
          )}
        </div>
      </div>
    </div>
  )
}
