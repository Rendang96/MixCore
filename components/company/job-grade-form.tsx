"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus } from "lucide-react"

export interface JobGradeSet {
  category: string
  grades: string[]
}

interface JobGradeFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: JobGradeSet[] // Add prop to receive existing data
  onSaveData?: (data: JobGradeSet[]) => void // Add prop to send data back
}

export function JobGradeForm({ onNext, onBack, initialData, onSaveData }: JobGradeFormProps) {
  // Initialize with at least one job grade set with empty fields
  const [jobGradeSets, setJobGradeSets] = useState<JobGradeSet[]>(
    initialData && initialData.length > 0 ? initialData : [{ category: "", grades: ["", ""] }],
  )

  // Force display of at least one job grade set on initial render
  useEffect(() => {
    if (jobGradeSets.length === 0) {
      setJobGradeSets([{ category: "", grades: ["", ""] }])
    }
  }, [])

  const handleCategoryChange = (setIndex: number, value: string) => {
    const updatedSets = [...jobGradeSets]
    updatedSets[setIndex].category = value
    setJobGradeSets(updatedSets)
  }

  const handleJobGradeChange = (setIndex: number, gradeIndex: number, value: string) => {
    const updatedSets = [...jobGradeSets]
    updatedSets[setIndex].grades[gradeIndex] = value
    setJobGradeSets(updatedSets)
  }

  const handleAddNew = () => {
    setJobGradeSets([{ category: "", grades: ["", ""] }, ...jobGradeSets])
  }

  const handleAddColumn = (setIndex: number) => {
    const updatedSets = [...jobGradeSets]
    updatedSets[setIndex].grades.push("")
    setJobGradeSets(updatedSets)
  }

  const handleRemoveColumn = (setIndex: number) => {
    const updatedSets = [...jobGradeSets]
    if (updatedSets[setIndex].grades.length > 1) {
      updatedSets[setIndex].grades.pop()
      setJobGradeSets(updatedSets)
    }
  }

  const handleRemoveSet = (setIndex: number) => {
    if (jobGradeSets.length > 1) {
      const updatedSets = jobGradeSets.filter((_, index) => index !== setIndex)
      setJobGradeSets(updatedSets)
    }
  }

  // Add a function to save data to localStorage and pass back to parent
  const handleSave = () => {
    // Save to localStorage
    try {
      const existingData = localStorage.getItem("company_form_draft")
      const parsedData = existingData ? JSON.parse(existingData) : {}
      parsedData.jobGrade = jobGradeSets
      localStorage.setItem("company_form_draft", JSON.stringify(parsedData))
      console.log("Job grade data saved:", jobGradeSets)
    } catch (error) {
      console.error("Error saving job grade data:", error)
    }

    // Pass data back to parent component
    if (onSaveData) {
      onSaveData(jobGradeSets)
    }

    // Continue to next step
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Header with Add New button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Job Category Information</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddNew}>
          Add New
        </Button>
      </div>

      {/* Job grade sets */}
      {jobGradeSets.map((gradeSet, setIndex) => (
        <div key={setIndex} className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <label htmlFor={`job-category-${setIndex}`} className="text-sm font-medium text-black w-24">
                Job Category
              </label>
              <Select value={gradeSet.category} onValueChange={(value) => handleCategoryChange(setIndex, value)}>
                <SelectTrigger id={`job-category-${setIndex}`} className="w-64 text-slate-700">
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job-grade">Job Grade</SelectItem>
                  <SelectItem value="designation">Designation</SelectItem>
                  <SelectItem value="employment-type">Employment Type</SelectItem>
                  <SelectItem value="staff-category">Staff Category</SelectItem>
                </SelectContent>
              </Select>

              {jobGradeSets.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveSet(setIndex)}
                >
                  Remove Set
                </Button>
              )}
            </div>

            <div className="flex items-start">
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 flex-grow">
                {gradeSet.grades.map((grade, gradeIndex) => (
                  <div key={`${setIndex}-${gradeIndex}`} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-6">{gradeIndex + 1}</span>
                    <Input
                      value={grade}
                      onChange={(e) => handleJobGradeChange(setIndex, gradeIndex, e.target.value)}
                      className="w-full"
                      placeholder={`Enter ${gradeSet.category || "job grade"} ${gradeIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 ml-4 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black text-white h-8 w-8 hover:bg-gray-800"
                  onClick={() => handleAddColumn(setIndex)}
                  title="Add new grade"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-600 text-white h-8 w-8 hover:bg-gray-700"
                  onClick={() => handleRemoveColumn(setIndex)}
                  disabled={gradeSet.grades.length <= 1}
                  title="Remove last grade"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom navigation buttons */}
      <div className="flex gap-3">
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  )
}
