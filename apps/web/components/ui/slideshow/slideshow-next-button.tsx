"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2 } from "lucide-react"
import { useSlideshow } from "./slideshow"
import { useState } from "react"

type SlideshowNextButtonProps = {
  children?: React.ReactNode
  onBeforeNext?: () => Promise<boolean> | boolean
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  disabled?: boolean
}

export function SlideshowNextButton({
  children,
  onBeforeNext,
  className = "",
  variant = "default",
  size = "default",
  showIcon = true,
  disabled = false
}: SlideshowNextButtonProps) {
  const { goToNextStep, canProceed, isLastStep, isLoading } = useSlideshow()
  const [localLoading, setLocalLoading] = useState(false)

  const handleClick = async () => {
    if (!canProceed || isLoading || localLoading || disabled) return

    if (onBeforeNext) {
      setLocalLoading(true)
      try {
        const shouldProceed = await Promise.resolve(onBeforeNext())
        if (!shouldProceed) {
          setLocalLoading(false)
          return
        }
      } catch (error) {
        console.error("Error in onBeforeNext:", error)
        setLocalLoading(false)
        return
      }
      setLocalLoading(false)
    }

    await goToNextStep()
  }

  const buttonText = children || (isLastStep ? "Complete" : "Next")
  const loading = isLoading || localLoading

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={!canProceed || loading || disabled}
      className={`${className} ${showIcon ? "flex items-center gap-2" : ""}`}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {buttonText}
          {showIcon && <ChevronRight className="h-4 w-4" />}
        </>
      )}
    </Button>
  )
}

