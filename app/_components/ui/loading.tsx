import * as React from "react";
import { cn } from "@/app/_utils/cn";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  className,
  fullScreen = false,
  text,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={cn(
          "animate-spin rounded-full border-gray-300 border-t-blue-600",
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

const ButtonLoading: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex items-center gap-2">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    <span>{text}</span>
  </div>
);

export { Loading, ButtonLoading };
