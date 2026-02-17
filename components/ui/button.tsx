import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
        outline: "border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900",
        ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus-visible:ring-red-200 dark:focus-visible:ring-red-900",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg focus-visible:ring-green-200 dark:focus-visible:ring-green-900",
        warning: "bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:shadow-lg focus-visible:ring-amber-200 dark:focus-visible:ring-amber-900",
        link: "text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({
  className,
  variant,
  size,
  fullWidth,
  disabled,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    fullWidth?: boolean;
  }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
