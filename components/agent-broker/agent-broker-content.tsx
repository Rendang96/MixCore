"use client"

import Link from "next/link"
import { Users, Building2, UserCheck } from "lucide-react"
import { PageBreadcrumbs } from "@/components/page-breadcrumbs"

export function AgentBrokerContent() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Agent Broker", href: "/agent-broker" },
  ]

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agent & Broker Management</h1>
        <p className="mt-2 text-gray-600">Manage insurance agents and brokers in your network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agent Management Card */}
        <Link href="/agent-broker/agent" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Agent Management</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage insurance agents, their licenses, and performance tracking.</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium">Manage Agents</span>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        </Link>

        {/* Broker Management Card */}
        <Link href="/agent-broker/broker" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <Building2 className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Broker Management</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage insurance brokers, their companies, and business relationships.</p>
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium">Manage Brokers</span>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        </Link>

        {/* Sales & Marketing Management Card */}
        <Link href="/agent-broker/sales-manager" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <UserCheck className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Sales & Marketing</h2>
            </div>
            <p className="text-gray-600 mb-4">Manage S&M supervisors and their assigned agents.</p>
            <div className="flex justify-between items-center">
              <span className="text-purple-600 font-medium">Manage S&M</span>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-gray-600">Total Agents</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-gray-600">Total Brokers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">2</div>
            <div className="text-gray-600">S&M Managers</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-gray-600">Active Assignments</div>
          </div>
        </div>
      </div>
    </div>
  )
}
