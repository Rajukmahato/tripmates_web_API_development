"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginType, loginSchema } from "../Schema";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/dashboard");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>Phone Number</FieldLabel>
          <Input {...register("phoneNumber")} placeholder="98XXXXXXXX" />
          {touchedFields.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber?.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" {...register("Password")} />
          {touchedFields.Password && (
            <p className="text-sm text-destructive">
              {errors.Password?.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <Button className="w-full mt-10 bg-purple-600 hover:bg-purple-700">
        {pending ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center mt-4 text-sm">
        Don’t have an account?{" "}
        <Link href="/register" className="text-purple-600 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
