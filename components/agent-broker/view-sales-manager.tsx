"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSalesManagerById, getAgentById } from "@/lib/agent-broker/agent-broker-storage"
import type { SalesManager, Agent } from "@/lib/agent-broker/types"
import Link from "next/link"

interface ViewSalesManagerProps {
  managerId: string
}

export function ViewSalesManager({ managerId }: ViewSalesManagerProps) {
  const router = useRouter()
  const [manager, setManager] = useState<SalesManager | null>(null)
  const [assignedAgents, setAssignedAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const managerData = await getSalesManagerById(managerId)
        if (managerData) {
          setManager(managerData)

          // Fetch all assigned agents
          const agentPromises = managerData.assignedAgents.map((agentId) => getAgentById(agentId))
          const agentResults = await Promise.all(agentPromises)
          setAssignedAgents(agentResults.filter((agent) => agent !== undefined) as Agent[])
        } else {
          alert("Sales Manager not found")
          router.push("/agent-broker/sales-manager")
        }
      } catch (error) {
        console.error("Error fetching sales manager details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [managerId, router])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!manager) {
    return <div className="text-center py-8">Sales Manager not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales & Marketing Manager Details</h1>
        <div className="flex gap-2">
          <Link
            href={`/agent-broker/sales-manager/edit/${managerId}`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
          >
            Edit
          </Link>
          <Link
            href={`/agent-broker/sales-manager/assign/${managerId}`}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Assign Agents
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="ml-2">{manager.name}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="ml-2">{manager.email}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Phone:</span>
                <span className="ml-2">{manager.phone}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Employment Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">Employee ID:</span>
                <span className="ml-2">{manager.employeeId}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Department:</span>
                <span className="ml-2">{manager.department}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Position:</span>
                <span className="ml-2">{manager.position}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Registration Date:</span>
                <span className="ml-2">{new Date(manager.registrationDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Status:</span>
                <span className="ml-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      manager.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {manager.status}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Assigned Agents ({assignedAgents.length})</h2>

        {assignedAgents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">License Number</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
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
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          agent.status === "active"
                            ? "bg-green-100 text-green-800"
                            : agent.status === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/agent-broker/agent/view/${agent.id}`} className="text-blue-600 hover:text-blue-800">
                        View
                      </Link>
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
    </div>
  )
}
