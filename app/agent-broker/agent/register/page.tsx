"use client"

import { TPADashboard } from "@/components/tpa-dashboard"
import { AgentRegistrationForm } from "@/components/agent-broker/agent-registration-form"

export default function AgentRegisterPage() {
  return (
    <TPADashboard initialMenu="agent">
      <AgentRegistrationForm />
    </TPADashboard>
  )
}
