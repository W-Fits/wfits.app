"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onChange: (file: File | null) => void
  value?: File | string | null
  className?: string
  maxSizeMB?: number
  accept?: string
  disabled?: boolean
}

export function ImageUpload({
  onChange,
  value,
  className,
  maxSizeMB = 5,
  accept = "image/*",
  disabled = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(typeof value === "string" ? value : null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null)

      if (!file) {
        onChange(null)
        setPreview(null)
        return
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds ${maxSizeMB}MB limit`)
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }

      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      onChange(file)

      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    },
    [onChange, maxSizeMB],
  )

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    },
    [handleFile],
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange(null)
      setPreview(null)
    },
    [onChange],
  )

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors",
          dragActive && "border-primary bg-muted/50",
          preview && "border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => {
          if (!disabled) {
            document.getElementById("file-upload")?.click()
          }
        }}
      >
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
        />

        {preview ? (
          <div className="relative h-full w-full">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="mx-auto h-full max-h-[180px] w-auto rounded-md object-contain"
            />
            {!disabled && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-0 top-0 h-6 w-6"
                onClick={handleRemove}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Drag & drop an image or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to {maxSizeMB}MB</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

