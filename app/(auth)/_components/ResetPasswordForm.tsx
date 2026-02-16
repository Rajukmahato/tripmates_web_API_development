"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordType, resetPasswordSchema } from "../ForgetPasswordSchema";
import { resetPassword } from "@/lib/api/auth";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setTransition] = useTransition();

  if (!token) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">
            Invalid or missing reset token. Please request a new password reset link.
          </p>
        </div>
        <Link href="/forget-password" className="block">
          <Button className="w-full">Request New Link</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: ResetPasswordType) => {
    setError("");
    setSuccess(false);

    setTransition(async () => {
      try {
        const response = await resetPassword(token, values.password, values.confirmPassword);
        if (response.success) {
          setSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setError(response.message || "Failed to reset password");
        }
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "Failed to reset password");
      }
    });
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-400">
            ✓ Password reset successful! Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      <FieldGroup>
        <Field className="space-y-0">
          <FieldLabel>New Password</FieldLabel>
          <Input
            {...register("password")}
            placeholder="Enter new password"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting || pending}
          />
          {touchedFields.password && errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </Field>

        <Field className="space-y-0">
          <FieldLabel>Confirm Password</FieldLabel>
          <Input
            {...register("confirmPassword")}
            placeholder="Confirm your password"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting || pending}
          />
          {touchedFields.confirmPassword && errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
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
              Resetting...
            </>
          ) : (
            "Reset Password"
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
