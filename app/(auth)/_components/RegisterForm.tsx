"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterType, registerScheme } from "../Schema";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const { register, handleSubmit, } = useForm<RegisterType>({
    resolver: zodResolver(registerScheme),
  });

  const onSubmit = async () => {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/login");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input {...register("fullName")} />
        </Field>

        <Field>
          <FieldLabel>Phone Number</FieldLabel>
          <Input {...register("phoneNumber")} />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" {...register("Password")} />
        </Field>

        <Field>
          <FieldLabel>Confirm Password</FieldLabel>
          <Input type="password" {...register("confirmPassword")} />
        </Field>
      </FieldGroup>

      <Button className="w-full mt-10 bg-purple-600 hover:bg-purple-700">
        {pending ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-purple-600 font-medium">
          Login
        </Link>
      </p>
    </form>
  );
}
