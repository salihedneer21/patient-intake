import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = [
  "Demographics",
  "Address",
  "Insurance",
  "Medical History",
  "Consent",
  "Review",
];

export function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium hidden sm:block",
                    (isCompleted || isCurrent) && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    stepNumber < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
