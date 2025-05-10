"use client";

import type React from "react";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
  isNextDisabled?: boolean;
  /** Function to call before moving to the next step. If it returns false, the navigation will be blocked. */
  onNext?: () => boolean | void | Promise<boolean | void>;
  /** Function to call before moving to the previous step. If it returns false, the navigation will be blocked. */
  onPrevious?: () => boolean | void | Promise<boolean | void>;
}

interface StepFormProps {
  onComplete?: () => void;
  onSkip?: () => void;
  startAtStep?: number;
  className?: string;
  headerTop?: string
  steps: Step[];
  completedContent: React.ReactNode;
}

export interface StepFormRef {
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
}

export const StepForm = forwardRef<StepFormRef, StepFormProps>(function StepForm(
  { onComplete, onSkip, startAtStep = 0, className, headerTop, steps, completedContent },
  ref
) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(startAtStep);
  const [completed, setCompleted] = useState(false);
  const [prevStep, setPrevStep] = useState(startAtStep);
  const totalSteps = steps.length;
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);


  useEffect(() => {
    setPrevStep(currentStep);
  }, [currentStep]);

  useEffect(() => {
    const calculateProgressBarWidth = () => {
      if (currentStep > 0 && stepRefs.current[currentStep]) {
        const firstStepElement = stepRefs.current[0];
        const currentStepElement = stepRefs.current[currentStep];

        if (firstStepElement && currentStepElement) {
          const firstRect = firstStepElement.getBoundingClientRect();
          const currentRect = currentStepElement.getBoundingClientRect();


          const distance = currentRect.left - firstRect.left;
          setProgressBarWidth(distance + currentRect.width);
        }
      } else {
        setProgressBarWidth(0);
      }
    };

    calculateProgressBarWidth();
    window.addEventListener("resize", calculateProgressBarWidth);

    return () => {
      window.removeEventListener("resize", calculateProgressBarWidth);
    };
  }, [currentStep]);

  const handleNext = async () => {
    if (isTransitioning) return;

    const currentStepData = steps[currentStep];

    if (currentStepData.onNext) {
      setIsTransitioning(true);
      try {
        const canProceed = await currentStepData.onNext();
        if (canProceed === false) {
          setIsTransitioning(false);
          return;
        }
      } catch (error) {
        console.error("Error in onNext:", error);
        setIsTransitioning(false);
        return;
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      if (onComplete) {
        onComplete();
      }
    }
    setIsTransitioning(false);
  };

  const handlePrevious = async () => {
    if (isTransitioning) return;

    const currentStepData = steps[currentStep];

    if (currentStepData.onPrevious) {
      setIsTransitioning(true);
      try {
        const canProceed = await currentStepData.onPrevious();
        if (canProceed === false) {
          setIsTransitioning(false);
          return;
        }
      } catch (error) {
        console.error("Error in onPrevious:", error);
        setIsTransitioning(false);
        return;
      }
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    setIsTransitioning(false);
  };

  const handleGoToStep = async (stepIndex: number) => {
    if (isTransitioning || stepIndex < 0 || stepIndex >= totalSteps || completed || stepIndex === currentStep) return;

    const currentStepData = steps[currentStep];


    if (stepIndex > currentStep) {
      if (currentStepData.onNext) {
        setIsTransitioning(true);
        try {
          const canProceed = await currentStepData.onNext();
          if (canProceed === false) {
            setIsTransitioning(false);
            return;
          }
        } catch (error) {
          console.error("Error in onNext during goToStep:", error);
          setIsTransitioning(false);
          return;
        }
      }
    } else {
      if (currentStepData.onPrevious) {
        setIsTransitioning(true);
        try {
          const canProceed = await currentStepData.onPrevious();
          if (canProceed === false) {
            setIsTransitioning(false);
            return;
          }
        } catch (error) {
          console.error("Error in onPrevious during goToStep:", error);
          setIsTransitioning(false);
          return;
        }
      }
    }

    setCurrentStep(stepIndex);
    setIsTransitioning(false);
  };


  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  useImperativeHandle(ref, () => ({
    nextStep: handleNext,
    previousStep: handlePrevious,
    goToStep: handleGoToStep,
  }));

  if (!steps.length) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const direction = currentStep > prevStep ? 1 : -1;

  return (
    <div className={cn("flex flex-col bg-background", className)}>
      <header className={cn(
        "sticky top-0 left-0 right-0 z-10 bg-background border-b",
        headerTop
      )}>
        {/* Morphing Progress Indicator */}
        <div className="px-4 py-2">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div className="relative h-8 mb-2">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {

                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={index} className="relative flex items-center">
                    <div
                      // @ts-ignore
                      ref={(el) => (stepRefs.current[index] = el)}
                      className={cn("relative flex flex-col", "items-center")}
                    >
                      <motion.div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center z-10 relative",
                          isCompleted || isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                        initial={false}
                        animate={{
                          boxShadow: isCurrent
                            ? "0 0 0 4px rgba(var(--primary), 0.2)"
                            : "none",
                          backgroundColor:
                            isCompleted || isCurrent ? "" : "your_muted_color",
                          color:
                            isCompleted || isCurrent
                              ? "your_primary_foreground_color"
                              : "your_default_color",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          delay: 0.5,
                        }}
                      >
                        <span className="text-xs font-medium">{index + 1}</span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
            {progressBarWidth > 0 && (
              <motion.div
                className="absolute top-1/2 left-0 h-full bg-primary rounded-full origin-left"
                style={{
                  width: progressBarWidth,
                  y: "-50%",
                  left: "",
                }}
                initial={{ width: 0 }}
                animate={{ width: progressBarWidth }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </div>
        </div>
      </header>

      <section className="flex-1 p-4 flex flex-col overflow-hidden pb-24">
        <AnimatePresence mode="wait" custom={direction}>
          {completed ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 flex flex-col"
            >
              {completedContent}
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-6">
                <motion.h3
                  className="text-xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentStepData.title}
                </motion.h3>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentStepData.description}
                </motion.p>
              </div>

              <div className="flex-1 flex">
                <div className="max-w-md w-full">
                  {currentStepData.content && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        delay: 0.2,
                      }}
                      className="flex mb-6"
                    >
                      {currentStepData.content}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {!completed && (
        <footer className="fixed bottom-16 left-0 right-0 flex justify-between p-4 bg-background border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || completed || isTransitioning}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button
              onClick={handleNext}
              disabled={completed || steps[currentStep].isNextDisabled || isTransitioning}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={isTransitioning}>
              Complete
            </Button>
          )}
        </footer>
      )}
    </div>
  );
});