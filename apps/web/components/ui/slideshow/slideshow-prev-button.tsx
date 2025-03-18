
"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useSlideshow } from "./slideshow"

type SlideshowPrevButtonProps = {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
}

export function SlideshowPrevButton({
  children,
  className = "",
  variant = "outline",
  size = "default",
  showIcon = true,
}: SlideshowPrevButtonProps) {
  const { goToPreviousStep, isFirstStep, isLoading } = useSlideshow()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={goToPreviousStep}
      disabled={isFirstStep || isLoading}
      className={`${className} ${showIcon ? "flex items-center gap-2" : ""}`}
    >
      {showIcon && <ChevronLeft className="h-4 w-4" />}
      {children || "Previous"}
    </Button>
  )
}

