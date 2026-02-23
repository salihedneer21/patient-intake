import type { ReactNode } from "react";
import { ProgressBar } from "./ProgressBar";

interface IntakeLayoutProps {
  children: ReactNode;
  currentStep: number;
  title: string;
  description?: string;
}

export function IntakeLayout({
  children,
  currentStep,
  title,
  description,
}: IntakeLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <ProgressBar currentStep={currentStep} />

        {/* Content */}
        <div className="mt-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
