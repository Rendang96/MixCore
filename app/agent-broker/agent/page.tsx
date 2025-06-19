"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { AgentDashboard } from "@/components/agent-broker/agent-dashboard"

export default function AgentPage() {
  return (
    <TPADashboard initialMenu="agent">
      <AgentDashboard />
    </TPADashboard>
  )
}
