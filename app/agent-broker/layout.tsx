import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agent Broker - TPA Management System",
  description: "Manage insurance agents and brokers",
}

export default function AgentBrokerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
