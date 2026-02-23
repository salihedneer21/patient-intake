import { cn } from "@/lib/utils";

interface IntakeStatusBadgeProps {
  completed: boolean;
  step: number;
}

export function IntakeStatusBadge({ completed, step }: IntakeStatusBadgeProps) {
  if (completed) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
          "bg-green-100 text-green-700"
        )}
      >
        Complete
      </span>
    );
  }

  if (step > 1) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
          "bg-yellow-100 text-yellow-700"
        )}
      >
        In Progress (Step {step}/6)
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        "bg-gray-100 text-gray-700"
      )}
    >
      Not Started
    </span>
  );
}
