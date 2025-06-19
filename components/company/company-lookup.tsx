"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { getCompanies, type Company } from "@/lib/company/company-storage"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface CompanyLookupProps {
  value?: string
  onChange: (value: string, company?: Company) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CompanyLookup({
  value,
  onChange,
  placeholder = "Enter or select company",
  className,
  disabled = false,
}: CompanyLookupProps) {
  const [open, setOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [inputValue, setInputValue] = useState(value || "")
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load companies from storage
    const loadedCompanies = getCompanies()
    setCompanies(loadedCompanies)
    setFilteredCompanies(loadedCompanies)
  }, [])

  useEffect(() => {
    // Update input value when value prop changes
    if (value !== undefined) {
      setInputValue(value)
    }
  }, [value])

  useEffect(() => {
    // Filter companies based on input value
    if (inputValue) {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          company.code.toLowerCase().includes(inputValue.toLowerCase()),
      )
      setFilteredCompanies(filtered)
    } else {
      setFilteredCompanies(companies)
    }
  }, [inputValue, companies])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
    setOpen(true)
  }

  const handleSelect = (companyName: string) => {
    setInputValue(companyName)
    const selectedCompany = companies.find((company) => company.name === companyName)
    onChange(companyName, selectedCompany)
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleInputFocus = () => {
    setOpen(true)
  }

  const handleInputBlur = () => {
    // Delay closing to allow for selection
    setTimeout(() => setOpen(false), 200)
  }

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              className={cn("pr-10", className)}
              disabled={disabled}
            />
            <ChevronsUpDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandList>
              {filteredCompanies.length === 0 ? (
                <CommandEmpty>No company found.</CommandEmpty>
              ) : (
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {filteredCompanies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={company.name}
                      onSelect={handleSelect}
                      className="flex items-center cursor-pointer"
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", inputValue === company.name ? "opacity-100" : "opacity-0")}
                      />
                      <div className="flex flex-col">
                        <span>{company.name}</span>
                        <span className="text-xs text-muted-foreground">{company.code}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
