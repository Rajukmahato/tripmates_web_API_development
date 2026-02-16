"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordType, forgotPasswordSchema } from "../ForgetPasswordSchema";
import { forgotPassword } from "@/lib/api/auth";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setTransition] = useTransition();

  const onSubmit = async (values: ForgotPasswordType) => {
    setError("");
    setSuccess(false);

    setTransition(async () => {
      try {
        const response = await forgotPassword(values.email);
        if (response.success) {
          setSuccess(true);
        } else {
          setError(response.message || "Failed to process request");
        }
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to process request");
      }
    });
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-400">
            ✓ If an account exists with this email, you will receive a password reset link shortly.
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Check your email for further instructions.
        </p>
        <Link href="/login" className="block">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>Email Address</FieldLabel>
          <Input
            {...register("email")}
            placeholder="Enter your email address"
            type="email"
            autoComplete="email"
            disabled={isSubmitting || pending}
          />
          {touchedFields.email && errors.email && (
            <p className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting || pending}
        className="w-full mt-12"
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting || pending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </span>
      </Button>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-purple-600 hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}
