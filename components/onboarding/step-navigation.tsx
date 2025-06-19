"use client"

import type React from "react"
import { useRouter } from "next/router"
import Link from "next/link"

interface StepNavigationProps {
  steps: {
    name: string
    label: string
    href: string
  }[]
  currentStepName: string
}

const StepNavigation: React.FC<StepNavigationProps> = ({ steps, currentStepName }) => {
  const router = useRouter()

  return (
    <nav>
      <ul>
        {steps.map((step) => (
          <li key={step.name}>
            <Link href={`${step.href}?step=${step.name}`} passHref>
              <a
                style={{
                  fontWeight: step.name === currentStepName ? "bold" : "normal",
                  textDecoration: "none",
                  color: step.name === currentStepName ? "blue" : "black",
                }}
              >
                {step.label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default StepNavigation
