"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { registerSchema, RegisterType } from "../Schema";


export default function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterType) => {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/login");
    });
    console.log("register", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Phone */}
      <div>
        <input
          {...register("phoneNumber")}
          placeholder="Phone number"
          type="tel"
          className="w-full rounded-xl border px-4 py-3 outline-none"
        />
        {touchedFields.phoneNumber && errors.phoneNumber && (
          <p className="text-sm text-red-500 mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="w-full rounded-xl border px-4 py-3 outline-none"
        />
        {touchedFields.password && errors.password && (
          <p className="text-sm text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <input
          {...register("confirmPassword")}
          placeholder="Confirm password"
          type="password"
          className="w-full rounded-xl border px-4 py-3 outline-none"
        />
        {touchedFields.confirmPassword &&
          errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
      </div>

      {/* Button */}
      <button
        disabled={isSubmitting || pending}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
      >
        {pending ? "Creating account..." : "Sign up"}
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600">
          Log in
        </Link>
      </p>
    </form>
  );
}
