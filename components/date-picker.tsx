"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DatePickerProps {
  label: string
  value: string
  onChange: (date: string) => void
  minDate?: string
  disabled?: boolean
  helperText?: string
}

export function DatePicker({ label, value, onChange, minDate, disabled, helperText }: DatePickerProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>{label}</Label>
      <Input
        id={label.toLowerCase().replace(/\s+/g, "-")}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        disabled={disabled}
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  )
}
