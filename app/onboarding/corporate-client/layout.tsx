import type React from "react"

interface Props {
  children: React.ReactNode
}

export default function CorporateClientLayout({ children }: Props) {
  return <>{children}</>
}
