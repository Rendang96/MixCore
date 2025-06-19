"use client"

import { Menu, X, ChevronLeft } from "lucide-react"
import { UserProfile } from "@/components/user-profile"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isNewCompanyPage = pathname === "/company/new"

  return (
    <header className="w-full sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center">
        {isNewCompanyPage ? (
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        <div className="flex items-center">
          <div className="flex h-10 items-center">
            <Image
              src="/images/pmcare-new-logo.png"
              alt="PMCare Logo"
              width={120}
              height={40}
              className="h-auto"
              priority
            />
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-xl font-semibold text-slate-800">MIX 2.0</h1>
      </div>

      <div className="flex items-center gap-4">
        <UserProfile />
      </div>
    </header>
  )
}
