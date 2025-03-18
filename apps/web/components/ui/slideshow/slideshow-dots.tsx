"use client"

import { useSlideshow } from "./slideshow"

export function SlideshowDots() {
  const { canProceed, isLoading, currentStep, totalSteps, goToStep } = useSlideshow()

  return (
    <div className="flex justify-center space-x-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => (canProceed && !isLoading) && goToStep(index)}
          className={`h-3 w-3 rounded-full transition-all ${currentStep === index ? "bg-primary scale-125" : "bg-muted hover:bg-muted-foreground/50"
            }`}
          aria-label={`Go to step ${index + 1}`}
        />
      ))}
    </div>
  )
}

