import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/_utils/cn";

const cardVariants = cva("rounded-xl transition-all duration-200", {
  variants: {
    variant: {
      default: "border bg-background shadow-sm hover:shadow-md",
      elevated: "border-0 bg-background shadow-md hover:shadow-xl hover:-translate-y-0.5",
      outlined: "border-2 border-slate-200 dark:border-slate-700 bg-background",
      filled: "border-0 bg-slate-100 dark:bg-slate-800",
      gradient: "border-0 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/30 dark:to-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Card({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return (
    <div
      className={cn(cardVariants({ variant }), "p-6", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-6 space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-2xl font-bold text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex gap-3 border-t pt-6", className)} {...props} />;
}

export function CardImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("relative h-48 w-full overflow-hidden rounded-t-xl bg-slate-200 dark:bg-slate-700", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
