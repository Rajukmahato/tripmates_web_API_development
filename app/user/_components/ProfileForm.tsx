"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, UpdateProfileFormData } from "../schema";
import { updateUserProfile } from "@/lib/api/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAuth } from "@/context/AuthContext";
import { setUserData } from "@/lib/cookie";

interface ProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ProfileForm({ onCancel, onSuccess }: ProfileFormProps) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.bio || "",
      location: user?.location || "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!user?._id) {
      setError("User not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData
      const formData = new FormData();

      // Only append fields that have values
      if (data.fullName && data.fullName.trim()) {
        formData.append("fullName", data.fullName);
      }
      if (data.phoneNumber && data.phoneNumber.trim()) {
        formData.append("phoneNumber", data.phoneNumber);
      }
      if (data.bio && data.bio.trim()) {
        formData.append("bio", data.bio);
      }
      if (data.location && data.location.trim()) {
        formData.append("location", data.location);
      }
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await updateUserProfile(user._id, formData);

      if (response.success) {
        // Update context and cookie
        setUser(response.data);
        await setUserData(response.data);
        onSuccess();
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Failed to update profile. Please try again."
      );
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
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <Input
            id="phoneNumber"
            type="text"
            placeholder="10-digit phone number"
            maxLength={10}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <textarea
            id="bio"
            placeholder="Tell us about yourself"
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
            placeholder="Enter your location"
            {...register("location")}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="profileImage">Profile Image</FieldLabel>
          <FileInput
            id="profileImage"
            onChange={setProfileImage}
            currentImage={user?.profileImage}
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onCancel} variant="outline" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}
