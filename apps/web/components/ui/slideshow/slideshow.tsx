"use client";


import React, { useEffect, useCallback } from "react";
import { type ReactNode, useState, createContext, useContext } from "react";
import { SlideshowDots } from "./slideshow-dots";
import { SlideshowNavigation } from "./slideshow-navigation";
import { cn } from "@/lib/utils";
import { usePersistentState } from "@/lib/hooks/use-persistent-state";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion


// Define types for our context and slides
type SlideshowContextType<T> = {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  goToNextStep: () => Promise<void>;
  goToPreviousStep: () => Promise<void>;
  isFirstStep: boolean;
  isLastStep: boolean;
  slideData: T;
  updateSlideData: (step: number, data: any) => void;
  canProceed: boolean;
  setCanProceed: (canProceed: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};


type SlideshowProps<T> = {
  children: ReactNode;
  initialStep?: number;
  onComplete?: (data: T) => void | Promise<void>;
  showDefaultNavigation?: boolean;
  className?: string;
  slideData: T;
  setSlideData: React.Dispatch<React.SetStateAction<T>>;
};


// Create context for the slideshow
const SlideshowContext = createContext<any | undefined>(undefined);


export function useSlideshow<T>() {
  const context = useContext(SlideshowContext) as SlideshowContextType<T>;
  if (!context) {
    throw new Error("useSlideshow must be used within a Slideshow component");
  }
  return context;
}


export function Slideshow<T>({
  children,
  initialStep = 0,
  onComplete,
  showDefaultNavigation = true,
  className,
  slideData,
  setSlideData,
}: SlideshowProps<T>) {
  const [currentStep, setCurrentStep] = usePersistentState<number>(
    "image-upload-step",
    initialStep
  );
  const [canProceed, setCanProceed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);


  useEffect(() => {
    setHasMounted(true); // Set hasMounted to true when component mounts
  }, []);


  // Count the number of direct children to determine total steps
  const childrenArray = React.Children.toArray(children);
  const totalSteps = childrenArray.length;


  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;


  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };


  const goToNextStep = useCallback(
    async () => {
      if (!canProceed || isLoading) return;


      if (!isLastStep) {
        setCurrentStep((prev) => prev + 1); // Use functional update
      } else if (onComplete) {
        setIsLoading(true);
        try {
          const promise = await Promise.resolve(onComplete(slideData));
          setCurrentStep(initialStep);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [canProceed, isLoading, isLastStep, onComplete, slideData, initialStep]
  );


  const goToPreviousStep = useCallback(
    async () => {
      if (isLoading) return;


      if (!isFirstStep) {
        setCurrentStep((prev) => prev - 1); // Use functional update
      }
    },
    [isLoading, isFirstStep]
  );


  const updateSlideData = (step: number, data: any) => {
    setSlideData((prevData) => ({
      ...prevData,
      [step]: data,
    }));
  };


  const value: SlideshowContextType<T> = {
    currentStep,
    totalSteps,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    slideData,
    updateSlideData,
    canProceed,
    setCanProceed,
    isLoading,
    setIsLoading,
  };


  const slideVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.25, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
  };


  return (
    <SlideshowContext.Provider value={value}>
      <div className={cn("flex flex-col w-full space-y-6", className)}>
        {hasMounted ? (
          <>
            <SlideshowDots />
            <AnimatePresence mode="wait" initial={false}>
              {React.Children.toArray(children).map((child, index) => (
                index === currentStep && (
                  <motion.div
                    key={index}
                    className="grow"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {child}
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            {showDefaultNavigation && <SlideshowNavigation />}
          </>
        ) : (
          <span>loading...</span>
        )}
      </div>
    </SlideshowContext.Provider>
  );
}
