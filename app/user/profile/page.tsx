"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Loading } from "@/components/ui/loading";
import ProfileForm from "../_components/ProfileForm";

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = () => {
    setIsEditing(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6">
          <p className="text-red-500">User not found. Please login again.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your personal information and settings
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-400">
            {successMessage}
          </p>
        </div>
      )}

      <Card className="p-6">
        {!isEditing ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar
                name={user.fullName}
                profileImagePath={user.profileImagePath}
                size="lg"
              />
              <div>
                <h2 className="text-2xl font-semibold">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid gap-4 border-t pt-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </label>
                <p className="mt-1">{user.phoneNumber || "Not provided"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Bio
                </label>
                <p className="mt-1 whitespace-pre-wrap">
                  {user.bio || "No bio provided"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Location
                </label>
                <p className="mt-1">{user.location || "Not provided"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Account Created
                </label>
                <p className="mt-1">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end border-t pt-6">
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-xl font-semibold">Edit Profile</h3>
            <ProfileForm
              onCancel={() => setIsEditing(false)}
              onSuccess={handleSuccess}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
