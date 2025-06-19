"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { ViewAgent } from "@/components/agent-broker/view-agent"

interface AgentViewPageProps {
  params: {
    id: string
  }
}

export default function AgentViewPage({ params }: AgentViewPageProps) {
  return (
    <TPADashboard initialMenu="agent">
      <ViewAgent agentId={params.id} />
    </TPADashboard>
  )
}
