"use client";

//import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/_utils/cn";
import { Label }  from "@/app/_components/ui/lable";
//import { Separator } from "@/app/_components/ui/separator";

export function FieldSet({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

const fieldVariants = cva("flex flex-col gap-1");

export function Field({
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div className={cn(fieldVariants(), className)} {...props} />
  );
}


export function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

export function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) return null;

  return (
    <p className="text-sm text-destructive mt-1">
      {message}
    </p>
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
