import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "admin" | "user" | "success" | "error";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      admin: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      user: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      success: "bg-green-500/10 text-green-500 border-green-500/20",
      error: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
