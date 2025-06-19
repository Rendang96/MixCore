"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2, Calendar, ChevronUp, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"
import { cn } from "@/lib/utils"
import { saveServiceTypeInfo } from "@/lib/policy/policy-storage"

interface ServiceTypeTabProps {
  policyId: string
  onSave: () => void
  onCancel: () => void
  initialData?: any
}

interface ServiceType {
  id: number
  code: string
  name: string
  description: string
  effectiveDate?: Date
  expiryDate?: Date
}

// Local storage key for selected service types
const STORAGE_KEY = "selectedServiceTypes"

export function ServiceTypeTab({ policyId, onSave, onCancel, initialData }: ServiceTypeTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<ServiceType[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentServiceType, setCurrentServiceType] = useState<ServiceType | null>(null)
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>(undefined)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [showEffectiveDateCalendar, setShowEffectiveDateCalendar] = useState(false)
  const [showExpiryDateCalendar, setShowExpiryDateCalendar] = useState(false)
  const [effectiveDateCurrentMonth, setEffectiveDateCurrentMonth] = useState(new Date())
  const [expiryDateCurrentMonth, setExpiryDateCurrentMonth] = useState(new Date())

  const inputRef = useRef<HTMLInputElement>(null)
  const effectiveDateRef = useRef<HTMLDivElement>(null)
  const expiryDateRef = useRef<HTMLDivElement>(null)

  // Predefined master list of service types
  const serviceTypes: ServiceType[] = [
    {
      id: 1,
      code: "GP",
      name: "General Practitioner",
      description: "Primary care physician services",
    },
    {
      id: 2,
      code: "SP",
      name: "Specialist",
      description: "Medical specialist consultation services",
    },
    {
      id: 3,
      code: "OC",
      name: "Optical",
      description: "Vision care and optical services",
    },
    {
      id: 4,
      code: "DT",
      name: "Dental",
      description: "Dental care and treatment services",
    },
    {
      id: 5,
      code: "HP",
      name: "Hospitalization",
      description: "Inpatient hospital services",
    },
    {
      id: 6,
      code: "MT",
      name: "Maternity",
      description: "Pregnancy and childbirth related services",
    },
  ]

  // Load initial data if available
  useEffect(() => {
    if (initialData && initialData.serviceTypes && initialData.serviceTypes.length > 0) {
      // Convert string dates back to Date objects if needed
      const hydratedData = initialData.serviceTypes.map((item: any) => ({
        ...item,
        effectiveDate: item.effectiveDate
          ? typeof item.effectiveDate === "string"
            ? parseISO(item.effectiveDate)
            : item.effectiveDate
          : undefined,
        expiryDate: item.expiryDate
          ? typeof item.expiryDate === "string"
            ? parseISO(item.expiryDate)
            : item.expiryDate
          : undefined,
      }))
      setSelectedServiceTypes(hydratedData)
    } else {
      // Load from local storage as fallback
      try {
        const storedData = localStorage.getItem(STORAGE_KEY)
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          // Convert string dates back to Date objects
          const hydratedData = parsedData.map((item: any) => ({
            ...item,
            effectiveDate: item.effectiveDate ? parseISO(item.effectiveDate) : undefined,
            expiryDate: item.expiryDate ? parseISO(item.expiryDate) : undefined,
          }))
          setSelectedServiceTypes(hydratedData)
        }
      } catch (error) {
        console.error("Error loading service types from local storage:", error)
      }
    }
  }, [initialData])

  // Save selected service types to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedServiceTypes))
    } catch (error) {
      console.error("Error saving service types to local storage:", error)
    }
  }, [selectedServiceTypes])

  // Close calendars when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showEffectiveDateCalendar &&
        effectiveDateRef.current &&
        !effectiveDateRef.current.contains(event.target as Node)
      ) {
        setShowEffectiveDateCalendar(false)
      }
      if (showExpiryDateCalendar && expiryDateRef.current && !expiryDateRef.current.contains(event.target as Node)) {
        setShowExpiryDateCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showEffectiveDateCalendar, showExpiryDateCalendar])

  // Filter service types based on search query
  const filteredServiceTypes = serviceTypes.filter(
    (serviceType) =>
      !selectedServiceTypes.some((selected) => selected.id === serviceType.id) &&
      (searchQuery === "" ||
        serviceType.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        serviceType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        serviceType.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSuggestions(value.length > 0)
  }

  // Open dialog to add service type with dates
  const openAddServiceTypeDialog = (serviceType: ServiceType) => {
    setCurrentServiceType(serviceType)
    setEffectiveDate(undefined)
    setExpiryDate(undefined)
    setIsDialogOpen(true)
    setShowSuggestions(false)
    setShowEffectiveDateCalendar(false)
    setShowExpiryDateCalendar(false)
    setEffectiveDateCurrentMonth(new Date())
    setExpiryDateCurrentMonth(new Date())
  }

  // Add service type to selected list with dates
  const addServiceTypeWithDates = () => {
    if (currentServiceType) {
      const serviceTypeWithDates = {
        ...currentServiceType,
        effectiveDate,
        expiryDate,
      }

      if (!selectedServiceTypes.some((selected) => selected.id === currentServiceType.id)) {
        setSelectedServiceTypes([...selectedServiceTypes, serviceTypeWithDates])
      }

      setIsDialogOpen(false)
      setSearchQuery("")
      setCurrentServiceType(null)
    }
  }

  // Remove service type from selected list
  const removeServiceType = (serviceTypeId: number) => {
    setSelectedServiceTypes(selectedServiceTypes.filter((serviceType) => serviceType.id !== serviceTypeId))
  }

  // Handle save button click - also updates local storage
  const handleSave = () => {
    // Save to policy storage
    saveServiceTypeInfo(policyId, { serviceTypes: selectedServiceTypes })

    // Show a success message or notification here if needed
    alert("Service type information saved successfully!")
  }

  // Toggle calendar visibility
  const toggleEffectiveDateCalendar = () => {
    setShowEffectiveDateCalendar(!showEffectiveDateCalendar)
    setShowExpiryDateCalendar(false)
  }

  const toggleExpiryDateCalendar = () => {
    setShowExpiryDateCalendar(!showExpiryDateCalendar)
    setShowEffectiveDateCalendar(false)
  }

  // Handle date selection
  const handleEffectiveDateSelect = (date: Date) => {
    setEffectiveDate(date)
    setShowEffectiveDateCalendar(false)
  }

  const handleExpiryDateSelect = (date: Date) => {
    setExpiryDate(date)
    setShowExpiryDateCalendar(false)
  }

  // Navigate months
  const nextEffectiveMonth = () => {
    setEffectiveDateCurrentMonth(addMonths(effectiveDateCurrentMonth, 1))
  }

  const prevEffectiveMonth = () => {
    setEffectiveDateCurrentMonth(subMonths(effectiveDateCurrentMonth, 1))
  }

  const nextExpiryMonth = () => {
    setExpiryDateCurrentMonth(addMonths(expiryDateCurrentMonth, 1))
  }

  const prevExpiryMonth = () => {
    setExpiryDateCurrentMonth(subMonths(expiryDateCurrentMonth, 1))
  }

  // Generate calendar days
  const generateCalendarDays = (currentMonth: Date) => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)

    // Get all days in the month
    const days = eachDayOfInterval({ start, end })

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = start.getDay()

    // Adjust for Monday as first day of week (0 = Sunday, 1 = Monday, 6 = Sunday)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1

    // Add days from previous month
    const previousMonthDays = []
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      const date = new Date(start)
      date.setDate(start.getDate() - i - 1)
      previousMonthDays.push(date)
    }

    // Add days from next month
    const totalDaysToShow = 42 // 6 rows of 7 days
    const nextMonthDays = []
    const daysNeeded = totalDaysToShow - days.length - previousMonthDays.length

    for (let i = 1; i <= daysNeeded; i++) {
      const date = new Date(end)
      date.setDate(end.getDate() + i)
      nextMonthDays.push(date)
    }

    return [...previousMonthDays, ...days, ...nextMonthDays]
  }

  // Clear date selection
  const clearEffectiveDate = () => {
    setEffectiveDate(undefined)
    setShowEffectiveDateCalendar(false)
  }

  const clearExpiryDate = () => {
    setExpiryDate(undefined)
    setShowExpiryDateCalendar(false)
  }

  // Set date to today
  const setEffectiveDateToday = () => {
    setEffectiveDate(new Date())
    setShowEffectiveDateCalendar(false)
  }

  const setExpiryDateToday = () => {
    setExpiryDate(new Date())
    setShowExpiryDateCalendar(false)
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-md border">
          <h3 className="text-lg font-semibold mb-4">Search Service Type</h3>
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Cumulative service type</p>
            <div className="relative max-w-md">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Service Type"
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && filteredServiceTypes.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredServiceTypes.map((serviceType) => (
                    <div
                      key={serviceType.id}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                      onClick={() => openAddServiceTypeDialog(serviceType)}
                    >
                      <div className="font-medium">{serviceType.name}</div>
                      <div className="text-sm text-gray-500">
                        {serviceType.code} - {serviceType.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border">
          <h3 className="text-lg font-semibold mb-4">List Service Type</h3>
          {selectedServiceTypes.length > 0 ? (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[150px]">Effective Date</TableHead>
                    <TableHead className="w-[150px]">Expiry Date</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedServiceTypes.map((serviceType) => (
                    <TableRow key={serviceType.id}>
                      <TableCell>{serviceType.code}</TableCell>
                      <TableCell>{serviceType.name}</TableCell>
                      <TableCell>
                        {serviceType.effectiveDate ? format(serviceType.effectiveDate, "dd/MM/yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        {serviceType.expiryDate ? format(serviceType.expiryDate, "dd/MM/yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeServiceType(serviceType.id)}
                          className="p-0 h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove from list</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No service types have been added to this policy rule yet.
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={onCancel} variant="destructive" className="bg-red-600 hover:bg-red-700">
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save
        </Button>
      </div>

      {/* Date Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentServiceType?.name} ({currentServiceType?.code})
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Effective Date</label>
                <div className="flex items-center">
                  <div className="relative flex-1" ref={effectiveDateRef}>
                    <Input
                      value={effectiveDate ? format(effectiveDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
                      readOnly
                      className="pr-10 bg-white"
                      placeholder="dd/mm/yyyy"
                    />
                    <button
                      type="button"
                      onClick={toggleEffectiveDateCalendar}
                      className="absolute right-0 top-0 h-full px-3 border-l border-gray-300 flex items-center justify-center"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>

                    {showEffectiveDateCalendar && (
                      <div className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-lg w-[280px]">
                        <div className="p-2 border-b flex items-center justify-between">
                          <div className="font-medium">{format(effectiveDateCurrentMonth, "MMMM, yyyy")}</div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={prevEffectiveMonth}
                              className="p-1 hover:bg-gray-100 rounded-md"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={nextEffectiveMonth}
                              className="p-1 hover:bg-gray-100 rounded-md"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="grid grid-cols-7 gap-1 mb-1">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                              <div key={i} className="text-center text-xs font-medium text-gray-500">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays(effectiveDateCurrentMonth).map((day, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleEffectiveDateSelect(day)}
                                className={cn(
                                  "h-7 w-7 text-center text-sm rounded-md flex items-center justify-center",
                                  !isSameMonth(day, effectiveDateCurrentMonth) && "text-gray-400",
                                  isSameDay(day, effectiveDate || new Date(-1)) && "bg-blue-500 text-white",
                                  isToday(day) &&
                                    !isSameDay(day, effectiveDate || new Date(-1)) &&
                                    "border border-blue-500",
                                  "hover:bg-gray-100",
                                )}
                              >
                                {day.getDate()}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-2 border-t flex items-center justify-between">
                          <button
                            type="button"
                            onClick={clearEffectiveDate}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={setEffectiveDateToday}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <div className="flex items-center">
                  <div className="relative flex-1" ref={expiryDateRef}>
                    <Input
                      value={expiryDate ? format(expiryDate, "dd/MM/yyyy") : "dd/mm/yyyy"}
                      readOnly
                      className="pr-10 bg-white"
                      placeholder="dd/mm/yyyy"
                    />
                    <button
                      type="button"
                      onClick={toggleExpiryDateCalendar}
                      className="absolute right-0 top-0 h-full px-3 border-l border-gray-300 flex items-center justify-center"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>

                    {showExpiryDateCalendar && (
                      <div className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-lg w-[280px]">
                        <div className="p-2 border-b flex items-center justify-between">
                          <div className="font-medium">{format(expiryDateCurrentMonth, "MMMM, yyyy")}</div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={prevExpiryMonth}
                              className="p-1 hover:bg-gray-100 rounded-md"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={nextExpiryMonth}
                              className="p-1 hover:bg-gray-100 rounded-md"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="grid grid-cols-7 gap-1 mb-1">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                              <div key={i} className="text-center text-xs font-medium text-gray-500">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays(expiryDateCurrentMonth).map((day, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleExpiryDateSelect(day)}
                                disabled={effectiveDate ? day < effectiveDate : false}
                                className={cn(
                                  "h-7 w-7 text-center text-sm rounded-md flex items-center justify-center",
                                  !isSameMonth(day, expiryDateCurrentMonth) && "text-gray-400",
                                  isSameDay(day, expiryDate || new Date(-1)) && "bg-blue-500 text-white",
                                  isToday(day) &&
                                    !isSameDay(day, expiryDate || new Date(-1)) &&
                                    "border border-blue-500",
                                  effectiveDate && day < effectiveDate
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100",
                                )}
                              >
                                {day.getDate()}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-2 border-t flex items-center justify-between">
                          <button
                            type="button"
                            onClick={clearExpiryDate}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={setExpiryDateToday}
                            className="text-sm text-blue-500 hover:underline"
                            disabled={effectiveDate && effectiveDate > new Date()}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button
                variant="destructive"
                onClick={() => setIsDialogOpen(false)}
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel
              </Button>
              <Button onClick={addServiceTypeWithDates} className="bg-blue-600 hover:bg-blue-700">
                Add to List
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
