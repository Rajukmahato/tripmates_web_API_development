import * as React from "react";
import Image from "next/image";
import { cn, getProfileImageUrl } from "@/app/_utils/cn";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  name?: string;
  profileImagePath?: string | null;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", name, profileImagePath, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-16 w-16 text-lg",
      xl: "h-24 w-24 text-2xl",
    };

    const getInitials = (name?: string) => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    // Priority: profileImagePath > src
    const imageUrl = profileImagePath ? getProfileImageUrl(profileImagePath) : src;
    const displayName = name || fallback || alt;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={alt || displayName || "Avatar"}
            fill
            unoptimized
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
            {getInitials(displayName)}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
