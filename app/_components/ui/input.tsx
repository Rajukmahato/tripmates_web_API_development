import * as React from "react";
import { cn } from "@/app/_utils/cn";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
  }
>(({ className, error, icon, iconPosition = "left", type, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {icon && iconPosition === "left" && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "w-full rounded-lg border-2 bg-background px-4 py-3 text-sm font-medium transition-all duration-200",
          "placeholder:text-muted-foreground placeholder:font-normal",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "focus:border-purple-500 focus:ring-purple-200 dark:focus:ring-purple-900/30",
          "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed opacity-100 disabled:opacity-50",
          icon && iconPosition === "left" && "pl-10",
          icon && iconPosition === "right" && "pr-10",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30" : "border-slate-200 dark:border-slate-700",
          className
        )}
        ref={ref}
        {...props}
      />
      {icon && iconPosition === "right" && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 pointer-events-none">
          {icon}
        </div>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium animate-slideInUp">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
