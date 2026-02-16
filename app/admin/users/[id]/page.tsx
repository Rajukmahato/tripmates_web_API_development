"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById, deleteUser, User } from "@/lib/api/admin/user";
import { getUserProfile } from "@/lib/api/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { Dialog } from "@/components/ui/dialog";
import Link from "next/link";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getUserById(userId);
        let userData = response.data;

        // If bio or location are missing, fallback to profile endpoint
        if (!userData.bio || !userData.location) {
          try {
            const profileResponse = await getUserProfile(userId);
            userData = {
              ...userData,
              bio: userData.bio || profileResponse.data.bio,
              location: userData.location || profileResponse.data.location,
            };
          } catch {
            // Ignore profile fallback errors
          }
        }

        setUser(userData);
      } catch (err) {
        const error = err as { response?: { status?: number; data?: { message?: string } } };
        if (error.response?.status === 404) {
          setError("User not found");
        } else {
          setError(
            error.response?.data?.message || "Failed to fetch user details"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteUser(userId);
      router.push("/admin/users");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Failed to delete user");
      setDeleting(false);
      setDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading user details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium text-red-500">{error}</p>
            <Link href="/admin/users">
              <Button className="mt-4">Back to Users</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="outline" className="mb-4">
            ← Back to Users
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">User Details</h1>
        <p className="mt-2 text-sm text-muted-foreground">User ID: {userId}</p>
      </div>

      <Card className="p-6">
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={user.fullName}
              profileImagePath={user.profileImage}
              size="lg"
            />
            <div>
              <h2 className="text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <Badge variant={user.role === "admin" ? "admin" : "user"}>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="mt-8 grid gap-6 border-t pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone Number
              </label>
              <p className="mt-1">{user.phoneNumber}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Location
              </label>
              <p className="mt-1">{user.location || "Not provided"}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Bio
            </label>
            <p className="mt-1 whitespace-pre-wrap">
              {user.bio || "No bio provided"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Account Created
              </label>
              <p className="mt-1">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="mt-1">
                {new Date(user.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3 border-t pt-6">
          <Button
            variant="outline"
            onClick={() => setDeleteDialog(true)}
            className="text-red-600 hover:text-red-700"
          >
            Delete User
          </Button>
          <Link href={`/admin/users/${userId}/edit`}>
            <Button>Edit User</Button>
          </Link>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will permanently remove all user data."
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
}
