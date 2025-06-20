import type React from "react"

interface ActionBarProps {
  stats: string
  children: React.ReactNode
}

export function ActionBar({ stats, children }: ActionBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 border rounded-md shadow-sm mb-6 space-y-3 md:space-y-0">
      <div className="text-sm font-medium text-gray-700">{stats}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}
