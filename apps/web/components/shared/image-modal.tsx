"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt?: string
}

export function ImageModal({ isOpen, onClose, src, alt }: ImageModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [isOpen, onClose])

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setIsAnimating(true)
    } else {
      document.body.style.overflow = ""
      setIsAnimating(false)
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Image of ${alt || "clothing item"}`}
    >
      <div
        className={`relative max-w-[90vw] max-h-[90vh] transition-transform duration-300 ${isOpen ? "scale-100" : "scale-95"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Use a direct Image component instead of ClothingImage for simplicity */}
        <div className="relative w-[80vw] h-[80vh] flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={src || "/placeholder.svg"}
              alt={alt || "Clothing item"}
              fill
              sizes="80vw"
              className="object-contain"
              quality={90}
              priority
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
            aria-label="Close image"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

