"use client"

import { type ReactNode, useEffect } from "react"
import { useSlideshow } from "./slideshow"

// Update the SlideProps type to include the required prop
type SlideProps = {
  children: ReactNode
  className?: string
  initialData?: any
  onDataChange?: (data: any) => void
  required?: string[] // Array of required field names
}

// Update the Slide component to handle required fields
export function Slide({ children, className, initialData = {}, onDataChange, required = [] }: SlideProps) {
  const { currentStep, updateSlideData, slideData, setCanProceed } = useSlideshow()

  // Initialize slide data if not already set
  useEffect(() => {
    if (!slideData[currentStep] && initialData) {
      updateSlideData(currentStep, initialData)
    }
  }, [currentStep, initialData, slideData, updateSlideData])

  // Call onDataChange when slide data changes
  useEffect(() => {
    if (onDataChange && slideData[currentStep]) {
      onDataChange(slideData[currentStep])
    }
  }, [currentStep, onDataChange, slideData])

  // Check if all required fields are filled
  useEffect(() => {
    if (required.length === 0) {
      setCanProceed(true)
      return
    }

    const currentSlideData = slideData[currentStep] || {}
    const allRequiredFieldsFilled = required.every((field) => {
      const value = currentSlideData[field]
      return value !== undefined && value !== null && value !== ""
    })

    setCanProceed(allRequiredFieldsFilled)
  }, [currentStep, required, setCanProceed, slideData])

  return <div className={className}>{children}</div>
}

