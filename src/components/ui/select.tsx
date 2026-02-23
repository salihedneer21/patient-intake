import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

function Select({
  className,
  children,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-9 w-full appearance-none items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          "[&>option]:bg-background",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export { Select };
