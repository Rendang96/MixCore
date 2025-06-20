"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploaderProps {
  accept: string
  maxSize: string
  onError: (error: Error) => void
  helperText?: string
  onFileUpload: (file: File) => void
  uploadedFile: File | null
}

export function FileUploader({ accept, maxSize, onError, helperText, onFileUpload, uploadedFile }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const maxSizeBytes = parseSizeToBytes(maxSize)

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        validateAndUploadFile(file)
      }
    },
    [onFileUpload, onError, maxSizeBytes],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragOver(false)
      const file = event.dataTransfer.files?.[0]
      if (file) {
        validateAndUploadFile(file)
      }
    },
    [onFileUpload, onError, maxSizeBytes],
  )

  const validateAndUploadFile = useCallback(
    (file: File) => {
      if (file.size > maxSizeBytes) {
        onError(new Error(`File size exceeds ${maxSize}.`))
        return
      }
      if (
        !accept
          .split(",")
          .some((type) => file.type.includes(type.trim().replace(".", "")) || file.name.endsWith(type.trim()))
      ) {
        onError(new Error(`File type not supported. Accepted types: ${accept}.`))
        return
      }
      onFileUpload(file)
    },
    [accept, maxSize, maxSizeBytes, onError, onFileUpload],
  )

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  function parseSizeToBytes(size: string): number {
    const value = Number.parseFloat(size)
    const unit = size.replace(/[0-9.]/g, "").toLowerCase()
    switch (unit) {
      case "kb":
        return value * 1024
      case "mb":
        return value * 1024 * 1024
      case "gb":
        return value * 1024 * 1024 * 1024
      default:
        return value // Assume bytes if no unit
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
        isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          {uploadedFile ? (
            <p className="mb-2 text-sm text-gray-900 font-semibold">File selected: {uploadedFile.name}</p>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {helperText || `Accepted: ${accept}, Max size: ${maxSize}`}
              </p>
            </>
          )}
        </div>
        <Input id="file-upload" type="file" className="hidden" accept={accept} onChange={handleFileChange} />
      </Label>
    </div>
  )
}
