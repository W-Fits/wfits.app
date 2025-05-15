"use client"

import { type ReactNode, useEffect } from "react"
import { useSlideshow } from "./slideshow"

// Update the SlideProps type to be generic
type SlideProps<T> = {
  children: ReactNode
  className?: string
  initialData?: T // Use the generic type T for initialData
  onDataChange?: (data: T) => void // Use the generic type T for onDataChange
  required?: (keyof T)[] // Array of required field names, using keyof T
}

// Update the Slide component to be generic
export function Slide<T>({
  children,
  className,
  initialData = {} as T, // Initialize with an empty object cast to T
  onDataChange,
  required = [],
}: SlideProps<T>) {
  const { currentStep, updateSlideData, slideData, setCanProceed } = useSlideshow()

  // Cast slideData to a record with the generic type for better type safety
  const typedSlideData = slideData as Record<number, T>

  // Initialize slide data if not already set
  useEffect(() => {
    if (!typedSlideData[currentStep] && initialData) {
      updateSlideData(currentStep, initialData)
    }
  }, [currentStep, initialData, typedSlideData, updateSlideData])

  // Call onDataChange when slide data changes
  useEffect(() => {
    if (onDataChange && typedSlideData[currentStep]) {
      onDataChange(typedSlideData[currentStep])
    }
  }, [currentStep, onDataChange, typedSlideData])

  // Check if all required fields are filled
  useEffect(() => {
    if (required.length === 0) {
      setCanProceed(true)
      return
    }

    const currentSlideData = typedSlideData[currentStep] || ({} as T) // Initialize with an empty object cast to T
    const allRequiredFieldsFilled = required.every((field) => {
      const value = currentSlideData[field]
      return value !== undefined && value !== null && value !== ""
    })

    setCanProceed(allRequiredFieldsFilled)
  }, [currentStep, required, setCanProceed, typedSlideData])

  return <div className={className}>{children}</div>
}
