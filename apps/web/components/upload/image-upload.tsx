"use client"

import type React from "react"
import { useState, useCallback, useEffect, useId } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { compress } from "@/lib/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ImageUpload({
  onChange,
  value,
  className,
  maxSizeMB = 5,
  accept = "image/*",
  disabled = false,
  quality = 0.7,
  variant = "default",
}: {
  onChange: (file: File | null) => void
  value?: File | string | null
  className?: string
  maxSizeMB?: number
  accept?: string
  disabled?: boolean
  quality?: number
  variant?: "default" | "pfp"
}) {
  const inputId = useId()
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Function to convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // useEffect to initialize the preview when the component mounts
  useEffect(() => {
    if (typeof value === "string" && value) {
      // If value is a base64 string, set the preview directly
      setPreview(value)
    } else if (value instanceof File) {
      // If value is a File, create a preview
      fileToBase64(value)
        .then((base64) => {
          setPreview(base64)
        })
        .catch((error) => {
          console.error("Error creating preview:", error)
          setError("Error creating preview")
        })
    }
  }, [value])

  const handleFile = useCallback(
    async (file: File | null) => {
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

      try {
        const compressedFile = await compress(file, 800, 600, quality)

        // Create preview and set the onChange
        fileToBase64(compressedFile).then((base64) => {
          setPreview(base64)
          onChange(compressedFile)
        })
      } catch (error) {
        setError(`Failed to compress image: ${error}`)
      }
    },
    [onChange, maxSizeMB, quality],
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
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors",
          dragActive && "border-primary bg-muted/50",
          preview && "border-muted-foreground/50",
          disabled && "cursor-not-allowed opacity-60",
          variant === "pfp" ? "w-[150px] mx-auto aspect-square rounded-full" : "min-h-[200px]",
          className,
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => {
          if (!disabled) {
            document.getElementById(inputId)?.click()
          }
        }}
      >
        <input
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
        />

        {preview ? (
          <div className="relative h-full w-full">
            {variant === "pfp" ? (
              <Avatar className="w-full h-full mx-auto">
                <AvatarImage src={preview || "/placeholder.svg"} alt="Avatar" />
                <AvatarFallback>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="mx-auto h-full max-h-[180px] w-auto rounded-md object-contain"
              />
            )}
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
            <div
              className={cn(
                "rounded-full bg-muted p-3",
                variant === "pfp" && "h-16 w-16 flex items-center justify-center",
              )}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            {variant === "default" && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Drag & drop an image or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to {maxSizeMB}MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      {variant === "pfp" && !preview && (
        <div className="text-center mb-2">
          <p className="text-sm font-medium">Upload profile picture</p>
          <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to {maxSizeMB}MB</p>
        </div>
      )}

      {variant === "pfp" && preview && (
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">Click on the image to change</p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
