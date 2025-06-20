"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: (date: Date) => boolean
  className?: string
  helperText?: string
}

export function DatePicker({
  label,
  date,
  setDate,
  minDate,
  maxDate,
  disabled,
  className,
  helperText,
}: DatePickerProps) {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            fromDate={minDate}
            toDate={maxDate}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}
