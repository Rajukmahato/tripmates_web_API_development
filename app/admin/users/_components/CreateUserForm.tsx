"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCreateUserSchema, AdminCreateUserFormData } from "@/app/admin/users/schema";
import { createUser } from "@/lib/api/admin/user";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminCreateUserFormData>({
    resolver: zodResolver(adminCreateUserSchema),
  });

  const onSubmit = async (data: AdminCreateUserFormData) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("password", data.password);

      if (data.bio && data.bio.trim()) {
        formData.append("bio", data.bio);
      }
      if (data.location && data.location.trim()) {
        formData.append("location", data.location);
      }

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await createUser(formData);

      if (response.success) {
        router.push("/admin/users");
      }
    } catch (err) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 409) {
        setError("Email or phone number already exists");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create user. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fullName">
            Full Name <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter full name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">
            Email <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="phoneNumber">
            Phone Number <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="phoneNumber"
            type="text"
            placeholder="10-digit phone number"
            maxLength={10}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phoneNumber.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">
            Password <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Min 6 characters, 1 uppercase letter, 1 number
          </p>
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <textarea
            id="bio"
            placeholder="Enter bio (optional)"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("bio")}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input
            id="location"
            type="text"
            placeholder="Enter location (optional)"
            {...register("location")}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="profileImage">Profile Image</FieldLabel>
          <FileInput id="profileImage" onChange={setProfileImage} />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/users")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating User..." : "Create User"}
        </Button>
      </div>
    </form>
  );
}
