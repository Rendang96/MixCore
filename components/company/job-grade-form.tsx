"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from "lucide-react"
import React from "react"
import { JobGradeViewModal } from "./job-grade-view-modal"

// Helper function to format category display names
const formatCategoryDisplay = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    "job-grade": "Job Grade",
    designation: "Designation",
    "employment-type": "Employment Type",
    "staff-category": "Staff Category",
  }
  return categoryMap[category] || category
}

export interface JobGradeSet {
  id: number
  category: string
  grades: string[]
}

interface JobGradeFormProps {
  onNext: () => void
  onBack: () => void
  initialData?: JobGradeSet[] // Keep original prop interface
  onSaveData?: (data: JobGradeSet[]) => void // Keep original prop interface
}

export function JobGradeForm({ onNext, onBack, initialData, onSaveData }: JobGradeFormProps) {
  // Initialize saved job grade sets from props or localStorage
  const [savedJobGradeSets, setSavedJobGradeSets] = useState<JobGradeSet[]>([])
  const [currentJobGradeSet, setCurrentJobGradeSet] = useState<JobGradeSet>({
    id: 1,
    category: "",
    grades: ["", "", "", "", "", ""],
  })
  const [nextJobGradeSetId, setNextJobGradeSetId] = useState(2)
  const [isInitialized, setIsInitialized] = useState(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedJobGradeSet, setSelectedJobGradeSet] = useState<JobGradeSet | null>(null)

  // Initialize job grade sets from props or localStorage only once
  useEffect(() => {
    if (isInitialized) return

    let initialJobGrades: JobGradeSet[] = []

    // First try to use props data
    if (initialData && initialData.length > 0) {
      initialJobGrades = initialData.map((item, index) => ({
        id: item.id || index + 1,
        category: item.category,
        grades: item.grades,
      }))
    } else {
      // If no props data, try to load from localStorage
      try {
        const existingData = localStorage.getItem("company_form_draft")
        if (existingData) {
          const parsedData = JSON.parse(existingData)
          if (parsedData.jobGrade && Array.isArray(parsedData.jobGrade)) {
            initialJobGrades = parsedData.jobGrade.map((item: any, index: number) => ({
              id: item.id || index + 1,
              category: item.category || "",
              grades: item.grades || ["", ""],
            }))
          }
        }
      } catch (error) {
        console.error("Error loading saved job grade data:", error)
      }
    }

    if (initialJobGrades.length > 0) {
      setSavedJobGradeSets(initialJobGrades)
      setNextJobGradeSetId(Math.max(...initialJobGrades.map((j) => j.id)) + 1)
    }

    setIsInitialized(true)
  }, [initialData, isInitialized])

  // Update parent component when saved job grade sets change
  useEffect(() => {
    if (isInitialized && onSaveData) {
      onSaveData(savedJobGradeSets)
    }
  }, [savedJobGradeSets, onSaveData, isInitialized])

  const handleCategoryChange = useCallback((value: string) => {
    setCurrentJobGradeSet((prev) => ({ ...prev, category: value }))
  }, [])

  const handleJobGradeChange = useCallback((gradeIndex: number, value: string) => {
    setCurrentJobGradeSet((prev) => {
      const updatedGrades = [...prev.grades]
      updatedGrades[gradeIndex] = value
      return { ...prev, grades: updatedGrades }
    })
  }, [])

  const handleAddColumn = useCallback(() => {
    setCurrentJobGradeSet((prev) => ({
      ...prev,
      grades: [...prev.grades, "", "", ""], // Add 3 new empty strings
    }))
  }, [])

  const handleRemoveColumn = useCallback(() => {
    setCurrentJobGradeSet((prev) => {
      if (prev.grades.length > 3) {
        // Ensure at least 3 fields remain
        const updatedGrades = [...prev.grades]
        updatedGrades.splice(updatedGrades.length - 3, 3) // Remove the last 3 elements
        return { ...prev, grades: updatedGrades }
      }
      return prev
    })
  }, [])

  const handleSaveJobGradeSet = useCallback(() => {
    // Add current job grade set to saved job grade sets
    const newSavedJobGradeSets = [...savedJobGradeSets, { ...currentJobGradeSet }]
    setSavedJobGradeSets(newSavedJobGradeSets)

    // Save to localStorage immediately
    try {
      const existingData = localStorage.getItem("company_form_draft")
      const parsedData = existingData ? JSON.parse(existingData) : {}
      parsedData.jobGrade = newSavedJobGradeSets
      localStorage.setItem("company_form_draft", JSON.stringify(parsedData))
    } catch (error) {
      console.error("Error saving job grade data:", error)
    }

    // Reset form for next job grade set
    setCurrentJobGradeSet({
      id: nextJobGradeSetId,
      category: "",
      grades: ["", "", "", "", "", ""],
    })
    setNextJobGradeSetId(nextJobGradeSetId + 1)
  }, [savedJobGradeSets, currentJobGradeSet, nextJobGradeSetId])

  const handleResetJobGradeSet = useCallback(() => {
    // Reset current job grade set form
    setCurrentJobGradeSet({
      ...currentJobGradeSet,
      category: "",
      grades: ["", "", "", "", "", ""], // Reset to 6 default fields
    })
  }, [currentJobGradeSet])

  const handleRemoveSavedJobGradeSet = useCallback(
    (jobGradeSetId: number) => {
      const newSavedJobGradeSets = savedJobGradeSets.filter((jobGradeSet) => jobGradeSet.id !== jobGradeSetId)
      setSavedJobGradeSets(newSavedJobGradeSets)

      // Save to localStorage immediately
      try {
        const existingData = localStorage.getItem("company_form_draft")
        const parsedData = existingData ? JSON.parse(existingData) : {}
        parsedData.jobGrade = newSavedJobGradeSets
        localStorage.setItem("company_form_draft", JSON.stringify(parsedData))
      } catch (error) {
        console.error("Error saving job grade data:", error)
      }
    },
    [savedJobGradeSets],
  )

  const handleEditSavedJobGradeSet = useCallback(
    (jobGradeSetId: number) => {
      const jobGradeSetToEdit = savedJobGradeSets.find((jobGradeSet) => jobGradeSet.id === jobGradeSetId)
      if (jobGradeSetToEdit) {
        // Load the saved job grade set data into the current form
        setCurrentJobGradeSet({ ...jobGradeSetToEdit })

        // Remove from saved job grade sets since it's being edited
        const newSavedJobGradeSets = savedJobGradeSets.filter((jobGradeSet) => jobGradeSet.id !== jobGradeSetId)
        setSavedJobGradeSets(newSavedJobGradeSets)

        // Save to localStorage immediately
        try {
          const existingData = localStorage.getItem("company_form_draft")
          const parsedData = existingData ? JSON.parse(existingData) : {}
          parsedData.jobGrade = newSavedJobGradeSets
          localStorage.setItem("company_form_draft", JSON.stringify(parsedData))
        } catch (error) {
          console.error("Error saving job grade data:", error)
        }
      }
    },
    [savedJobGradeSets],
  )

  // New handler for viewing job grade set details
  const handleViewJobGradeSet = useCallback(
    (jobGradeSetId: number) => {
      const jobGradeSetToView = savedJobGradeSets.find((jobGradeSet) => jobGradeSet.id === jobGradeSetId)
      if (jobGradeSetToView) {
        setSelectedJobGradeSet(jobGradeSetToView)
        setViewModalOpen(true)
      }
    },
    [savedJobGradeSets],
  )

  // Filter and search logic
  const filteredJobGradeSets = React.useMemo(() => {
    let filtered = savedJobGradeSets

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (jobGradeSet) =>
          jobGradeSet.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          jobGradeSet.grades.some((grade) => grade.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter((jobGradeSet) => jobGradeSet.category === filterCategory)
    }

    return filtered
  }, [savedJobGradeSets, searchTerm, filterCategory])

  // Pagination logic
  const totalPages = Math.ceil(filteredJobGradeSets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedJobGradeSets = filteredJobGradeSets.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterCategory])

  const handleSave = useCallback(() => {
    // Save to localStorage
    try {
      const existingData = localStorage.getItem("company_form_draft")
      const parsedData = existingData ? JSON.parse(existingData) : {}
      parsedData.jobGrade = savedJobGradeSets
      localStorage.setItem("company_form_draft", JSON.stringify(parsedData))
      console.log("Job grade data saved:", savedJobGradeSets)
    } catch (error) {
      console.error("Error saving job grade data:", error)
    }

    // Pass data back to parent component only when explicitly saving
    if (onSaveData) {
      onSaveData(savedJobGradeSets)
    }

    // Continue to next step
    onNext()
  }, [savedJobGradeSets, onSaveData, onNext])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-slate-800">Job Category Information</h3>
      </div>

      {/* Single Job Grade Set Form */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Job Grade Set Details</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <label htmlFor="job-category" className="text-sm font-medium text-black w-24">
              Job Category
            </label>
            <Select value={currentJobGradeSet.category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="job-category" className="w-64 text-slate-700">
                <SelectValue placeholder="Please select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job-grade">Job Grade</SelectItem>
                <SelectItem value="designation">Designation</SelectItem>
                <SelectItem value="employment-type">Employment Type</SelectItem>
                <SelectItem value="staff-category">Staff Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start">
            <div className="grid grid-cols-3 gap-x-8 gap-y-4 flex-grow">
              {currentJobGradeSet.grades.map((grade, gradeIndex) => (
                <div key={gradeIndex} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700 w-6">{gradeIndex + 1}</span>
                  <Input
                    value={grade}
                    onChange={(e) => handleJobGradeChange(gradeIndex, e.target.value)}
                    className="w-full"
                    placeholder={`Enter ${currentJobGradeSet.category || "job grade"} ${gradeIndex + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 ml-4 mt-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black text-white h-8 w-8 hover:bg-gray-800"
                onClick={handleAddColumn}
                title="Add new grade"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-600 text-white h-8 w-8 hover:bg-gray-700"
                onClick={handleRemoveColumn}
                disabled={currentJobGradeSet.grades.length <= 3}
                title="Remove last grade"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Save and Reset buttons for the job grade set form */}
          <div className="flex gap-3 mt-4">
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSaveJobGradeSet}>
              Save
            </Button>
            <Button variant="outline" onClick={handleResetJobGradeSet}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Job Grade Set Listing Section */}
      <div className="mt-8">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-slate-800">Job Grade Set Listing</h4>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search job grade sets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value === "all" ? "" : value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="job-grade">Job Grade</SelectItem>
                <SelectItem value="designation">Designation</SelectItem>
                <SelectItem value="employment-type">Employment Type</SelectItem>
                <SelectItem value="staff-category">Staff Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">No.</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Grades</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Total Grades</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-slate-600 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobGradeSets.length > 0 ? (
                  paginatedJobGradeSets.map((jobGradeSet, index) => (
                    <tr key={jobGradeSet.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-800">{startIndex + index + 1}</td>
                      <td className="py-3 px-4 text-sm text-blue-600 font-medium">
                        {formatCategoryDisplay(jobGradeSet.category) || "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-800">
                        <div className="max-w-xs truncate">
                          {jobGradeSet.grades.filter((grade) => grade.trim() !== "").join(", ") || "-"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-800">
                        {jobGradeSet.grades.filter((grade) => grade.trim() !== "").length}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewJobGradeSet(jobGradeSet.id)}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditSavedJobGradeSet(jobGradeSet.id)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveSavedJobGradeSet(jobGradeSet.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-slate-500">
                      {savedJobGradeSets.length === 0
                        ? "No job grade sets saved yet. Please fill out the job grade set form above and click Save."
                        : "No job grade sets match your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job grade set count display */}
        <div className="mt-4 text-right">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredJobGradeSets.length)} of {filteredJobGradeSets.length}{" "}
            job grade sets
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {/* View Modal */}
      <JobGradeViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        jobGradeSet={selectedJobGradeSet}
      />
    </div>
  )
}
