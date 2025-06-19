"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { EditAgent } from "@/components/agent-broker/edit-agent"

interface AgentEditPageProps {
  params: {
    id: string
  }
}

export default function AgentEditPage({ params }: AgentEditPageProps) {
  return (
    <TPADashboard initialMenu="agent">
      <EditAgent agentId={params.id} />
    </TPADashboard>
  )
}
