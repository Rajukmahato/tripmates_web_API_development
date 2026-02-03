"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllUsers, deleteUser, User, PaginatedUsersResponse } from "@/lib/api/admin/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Dialog } from "@/components/ui/dialog";
import UsersTable from "./_components/UsersTable";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string | null;
  }>({ open: false, userId: null });
  const [deleting, setDeleting] = useState<string | null>(null);

  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response: PaginatedUsersResponse = await getAllUsers(page, limit);
      setUsers(response.data);
      setTotalPages(response.pagination.pages);
      setTotal(response.pagination.total);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Failed to fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [page, fetchUsers]);

  const handleDeleteClick = (userId: string) => {
    setDeleteDialog({ open: true, userId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.userId) return;

    setDeleting(deleteDialog.userId);

    try {
      await deleteUser(deleteDialog.userId);
      setUsers(users.filter((u) => u._id !== deleteDialog.userId));
      setTotal((prev) => prev - 1);
      setDeleteDialog({ open: false, userId: null });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all users in the system ({total} total)
          </p>
        </div>
        <Link href="/admin/users/create">
          <Button>Create User</Button>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <Card className="p-6">
        <UsersTable
          users={users}
          onDelete={handleDeleteClick}
          deleting={deleting}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={deleting !== null}
      />
    </div>
  );
}
