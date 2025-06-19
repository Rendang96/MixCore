"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getBrokerById } from "@/lib/agent-broker/agent-broker-storage"
import type { Broker } from "@/lib/agent-broker/types"
import Link from "next/link"

interface ViewBrokerProps {
  brokerId: string
}

export function ViewBroker({ brokerId }: ViewBrokerProps) {
  const router = useRouter()
  const [broker, setBroker] = useState<Broker | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const brokerData = await getBrokerById(brokerId)
        if (brokerData) {
          setBroker(brokerData)
        } else {
          alert("Broker not found")
          router.push("/agent-broker/broker")
        }
      } catch (error) {
        console.error("Error fetching broker details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [brokerId, router])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!broker) {
    return <div className="text-center py-8">Broker not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Broker Details</h1>
        <div className="flex gap-2">
          <Link
            href={`/agent-broker/broker/edit/${brokerId}`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
          >
            Edit
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">Company Name:</span>
                <span className="ml-2">{broker.companyName}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Contact Person:</span>
                <span className="ml-2">{broker.contactPerson}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="ml-2">{broker.email}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Phone:</span>
                <span className="ml-2">{broker.phone}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Address:</span>
                <span className="ml-2">{broker.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">License Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">License Number:</span>
                <span className="ml-2">{broker.licenseNumber}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">License Expiry Date:</span>
                <span className="ml-2">{new Date(broker.licenseExpiryDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Registration Date:</span>
                <span className="ml-2">{new Date(broker.registrationDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Status:</span>
                <span className="ml-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      broker.status === "active"
                        ? "bg-green-100 text-green-800"
                        : broker.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {broker.status}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Commission Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 font-medium">Commission Rate:</span>
                <span className="ml-2">{broker.commissionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Specializations</h2>
          {broker.specializations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {broker.specializations.map((spec, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {spec}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No specializations listed</div>
          )}
        </div>
      </div>
    </div>
  )
}
