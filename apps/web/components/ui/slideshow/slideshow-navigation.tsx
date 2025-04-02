"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSlideshow } from "./slideshow"
import { cn } from "@/lib/utils"

type SlideshowNavigationProps = {
  nextLabel?: string
  prevLabel?: string
  showLabels?: boolean
  className?: string;
}

export function SlideshowNavigation({
  nextLabel = "Next",
  prevLabel = "Previous",
  showLabels = true,
  className,
}: SlideshowNavigationProps) {
  const { goToNextStep, goToPreviousStep, isFirstStep, isLastStep, canProceed } = useSlideshow()

  return (
    <div className={cn("flex justify-between pt-4", className)}>
      <Button variant="outline" onClick={goToPreviousStep} disabled={isFirstStep} className="flex items-center gap-2">
        <ChevronLeft className="h-4 w-4" />
        {showLabels && prevLabel}
      </Button>

      <Button onClick={goToNextStep} disabled={!canProceed} className="flex items-center gap-2">
        {showLabels && (isLastStep ? "Complete" : nextLabel)}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

