"use client"

import type React from "react"

interface CompanySummaryViewProps {
  onBack: () => void
  onComplete: () => void
}

const CompanySummaryView: React.FC<CompanySummaryViewProps> = ({ onBack, onComplete }) => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Company Summary</h1>
      <p className="mb-4">Review your company information below before completing the setup.</p>

      {/* Company Information Display (Placeholder) */}
      <div className="bg-white shadow-md rounded-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Company Details</h2>
        <p>Company Name: [Company Name]</p>
        <p>Industry: [Industry]</p>
        <p>Location: [Location]</p>
        {/* Add more company details here */}
      </div>

      {/* Contact Information Display (Placeholder) */}
      <div className="bg-white shadow-md rounded-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
        <p>Contact Person: [Contact Person]</p>
        <p>Email: [Email]</p>
        <p>Phone: [Phone]</p>
        {/* Add more contact details here */}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              console.log("Saving as draft...")
              // Add your save as draft logic here
            }}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button onClick={onComplete} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanySummaryView
