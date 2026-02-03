"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, UpdateProfileFormData } from "@/app/user/schema";
import { getUserById, User } from "@/lib/api/admin/user";
import { getUserProfile, updateUserProfile } from "@/lib/api/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileInput } from "@/components/ui/file-input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loading } from "@/components/ui/loading";

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      bio: "",
      location: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");

      try {
        let userData: User | null = null;

        try {
          const profileResponse = await getUserProfile(userId);
          userData = profileResponse.data;
        } catch {
          const adminResponse = await getUserById(userId);
          userData = adminResponse.data;
        }

        if (userData) {
          setValue("fullName", userData.fullName || "");
          setValue("phoneNumber", userData.phoneNumber || "");
          setValue("bio", userData.bio || "");
          setValue("location", userData.location || "");
          setCurrentImagePath(userData.profileImagePath || null);
        }
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, setValue]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

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

      const response = await updateUserProfile(userId, formData);

      if (response.success) {
        router.push(`/admin/users/${userId}`);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to update user profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading user..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Link href={`/admin/users/${userId}`}>
          <Button variant="outline" className="mb-4">
            ← Back to User Details
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit User Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">User ID: {userId}</p>
      </div>

      <Card className="p-6">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input id="fullName" type="text" {...register("fullName")} />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
              <Input id="phoneNumber" type="text" maxLength={10} {...register("phoneNumber")} />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <textarea
                id="bio"
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
              <Input id="location" type="text" {...register("location")} />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="profileImage">Profile Image</FieldLabel>
              <FileInput
                id="profileImage"
                onChange={setProfileImage}
                currentImagePath={currentImagePath}
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push(`/admin/users/${userId}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
