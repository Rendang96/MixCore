"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { JobGradeSet } from "./job-grade-form"

const formatCategoryForDisplay = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    "job-grade": "Job Grade",
    designation: "Designation",
    "employment-type": "Employment Type",
    "staff-category": "Staff Category",
  }
  return categoryMap[category] || category
}

interface JobGradeViewModalProps {
  isOpen: boolean
  onClose: () => void
  jobGradeSet: JobGradeSet | null
}

export function JobGradeViewModal({ isOpen, onClose, jobGradeSet }: JobGradeViewModalProps) {
  if (!jobGradeSet) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {formatCategoryForDisplay(jobGradeSet.category) || "Job Grade Set"} Details
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="mt-1 text-base font-medium text-blue-600">
              {formatCategoryForDisplay(jobGradeSet.category) || "-"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Grades</h3>
            <div className="mt-2 space-y-2">
              {jobGradeSet.grades.filter((grade) => grade.trim() !== "").length > 0 ? (
                jobGradeSet.grades
                  .filter((grade) => grade.trim() !== "")
                  .map((grade, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-800">{grade}</span>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 italic">No grades defined</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
