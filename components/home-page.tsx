"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { UserProfile } from "@/components/user-profile"
import { Footer } from "@/components/footer"
import Image from "next/image"

interface HomePageProps {
  onNavigateToDashboard: () => void
}

export function HomePage({ onNavigateToDashboard }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const banners = [
    {
      id: 1,
      title: "Welcome to PMCare MIX 2.0",
      description: "Your comprehensive healthcare management solution",
      bgColor: "bg-gradient-to-r from-sky-600 to-blue-700",
    },
    {
      id: 2,
      title: "Streamline Your Healthcare Operations",
      description: "Manage claims, policies, and providers in one place",
      bgColor: "bg-gradient-to-r from-blue-800 to-sky-500",
    },
    {
      id: 3,
      title: "Data-Driven Insights",
      description: "Make informed decisions with comprehensive analytics",
      bgColor: "bg-gradient-to-r from-sky-500 to-indigo-600",
    },
  ]

  // Application images with descriptive content
  const applications = [
    {
      id: 1,
      name: "MIX",
      description: "Third Party Administration System",
      isHighlighted: true,
    },
    {
      id: 2,
      name: "Mediline",
      description: "Healthcare Provider Network",
      isHighlighted: false,
    },
    {
      id: 3,
      name: "Medibase",
      description: "Medical Records Management",
      isHighlighted: false,
    },
    {
      id: 4,
      name: "Medismile",
      description: "Patient Engagement Platform",
      isHighlighted: false,
    },
    {
      id: 5,
      name: "Medifile",
      description: "Document Management System",
      isHighlighted: false,
    },
    {
      id: 6,
      name: "PMCare Mobile App",
      description: "Desktop Version",
      isHighlighted: false,
    },
  ]

  // Auto-rotate banner slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Function to get the custom description for each application
  const getDescription = (appName: string) => {
    switch (appName) {
      case "MIX":
        return "Medicare Integrated Exchange 2.0"
      case "Mediline":
        return "Panel Clinic's System"
      case "Medibase":
        return "Panel Hospital's System"
      case "Medismile":
        return "Panel Dental's System"
      case "Medifile":
        return "HR Dashboard & Reporting System"
      default:
        return applications.find((app) => app.name === appName)?.description || ""
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header without sidebar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
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

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-xl font-semibold text-slate-800">MIX 2.0</h1>
        </div>

        <div className="flex items-center gap-4">
          <UserProfile />
        </div>
      </header>

      <main className="flex-1">
        {/* Banner Slider with enhanced colors */}
        <div className="relative mx-auto max-w-7xl overflow-hidden">
          <div className="relative h-[400px] w-full">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className={`relative h-full w-full ${banner.bgColor}`}>
                  <div className="absolute inset-0 flex flex-col justify-center px-12">
                    <div className="max-w-2xl">
                      <h2 className="text-4xl font-bold text-white mb-4">{banner.title}</h2>
                      <p className="text-xl text-white/90">{banner.description}</p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/10"></div>
                    <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10"></div>
                    <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-white/10"></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm hover:bg-white/50"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm hover:bg-white/50"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">Applications</h2>

          <div className="relative">
            <div className="flex flex-wrap justify-center gap-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={app.isHighlighted ? onNavigateToDashboard : undefined}
                  className={`flex flex-col items-center rounded-lg p-4 transition-transform hover:scale-105 ${
                    app.isHighlighted
                      ? "cursor-pointer bg-sky-600 text-white shadow-lg"
                      : "bg-white text-slate-800 shadow"
                  }`}
                >
                  <div className="mb-4 h-[150px] w-[200px] overflow-hidden rounded-md bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-400 text-sm">{app.name}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{app.name}</h3>
                  <p className="text-center text-sm">{getDescription(app.name)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="bg-slate-100 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-xl font-semibold text-slate-800">Latest Updates</h3>
                <ul className="space-y-4">
                  <li className="border-b border-slate-100 pb-2">
                    <p className="font-medium">System Maintenance</p>
                    <p className="text-sm text-slate-500">Scheduled for May 15, 2025</p>
                  </li>
                  <li className="border-b border-slate-100 pb-2">
                    <p className="font-medium">New Features Released</p>
                    <p className="text-sm text-slate-500">Enhanced reporting capabilities</p>
                  </li>
                  <li>
                    <p className="font-medium">Training Webinar</p>
                    <p className="text-sm text-slate-500">Join us on May 20, 2025</p>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-xl font-semibold text-slate-800">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sky-600 hover:underline">
                      User Manual
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sky-600 hover:underline">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sky-600 hover:underline">
                      Support Ticket
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sky-600 hover:underline">
                      Contact Support
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-xl font-semibold text-slate-800">System Status</h3>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">MIX 2.0</span>
                      <span className="text-xs font-medium text-emerald-600">Operational</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Mediline</span>
                      <span className="text-xs font-medium text-emerald-600">Operational</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Medibase</span>
                      <span className="text-xs font-medium text-amber-600">Partial Outage</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-amber-500" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
