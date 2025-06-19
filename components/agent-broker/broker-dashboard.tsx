"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { getBrokers } from "@/lib/agent-broker/agent-broker-storage"
import type { Broker } from "@/lib/agent-broker/types"

export function BrokerDashboard() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBrokers, setFilteredBrokers] = useState<Broker[]>([])

  useEffect(() => {
    const brokerData = getBrokers()
    setBrokers(brokerData)
    setFilteredBrokers(brokerData)
  }, [])

  useEffect(() => {
    const filtered = brokers.filter(
      (broker) =>
        broker.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.brokerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBrokers(filtered)
  }, [searchTerm, brokers])

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Broker Management</h1>
          <p className="text-gray-600">Manage insurance brokers and their companies</p>
        </div>
        <Link href="/agent-broker/broker/register">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Register New Broker
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search brokers by company, contact person, email, or license number..."
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
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
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
              {filteredBrokers.map((broker) => (
                <tr key={broker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{broker.companyName}</div>
                      <div className="text-sm text-gray-500">{broker.brokerCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{broker.contactPerson}</div>
                    <div className="text-sm text-gray-500">{broker.email}</div>
                    <div className="text-sm text-gray-500">{broker.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{broker.licenseNumber}</div>
                    <div className="text-sm text-gray-500">Expires: {broker.licenseExpiryDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{broker.commissionRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(broker.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link href={`/agent-broker/broker/view/${broker.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/agent-broker/broker/edit/${broker.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBrokers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No brokers found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
