"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, User } from "lucide-react"

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          <User size={16} />
        </div>
        <span>[User Name]</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-slate-200 bg-white shadow-lg">
          <div className="p-4 border-b border-slate-100">
            <p className="font-medium">User Name</p>
            <p className="text-sm text-slate-500">user@example.com</p>
          </div>
          <div className="p-2">
            <button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100">Profile</button>
            <button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100">Settings</button>
            <button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100">Log out</button>
          </div>
        </div>
      )}
    </div>
  )
}
