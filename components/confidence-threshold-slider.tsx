"use client"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface ConfidenceThresholdSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
}

export function ConfidenceThresholdSlider({ value, onValueChange }: ConfidenceThresholdSliderProps) {
  return (
    <div className="flex items-center space-x-4 w-full md:w-auto min-w-[200px]">
      <Label htmlFor="confidence-threshold" className="whitespace-nowrap text-sm font-medium">
        Auto-approve Threshold:
      </Label>
      <Slider
        id="confidence-threshold"
        min={0}
        max={100}
        step={1}
        value={value}
        onValueChange={onValueChange}
        className="w-full"
        aria-label="Confidence threshold slider"
      />
      <span className="text-sm font-semibold w-10 text-right">{value[0]}%</span>
    </div>
  )
}
