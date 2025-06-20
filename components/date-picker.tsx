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
  disabled?: (date: Date) => boolean
  helperText?: string
  className?: string // Add className prop for external styling
}

export function DatePicker({ label, date, setDate, minDate, disabled, helperText, className }: DatePickerProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            id={id}
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
            disabled={disabled || (minDate ? (d) => d < minDate : undefined)}
          />
        </PopoverContent>
      </Popover>
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
}
