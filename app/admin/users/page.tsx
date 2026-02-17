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
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.totalCount);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Users
            </h1>
            <p className="mt-2 text-muted-foreground text-base">
              Manage all system users ({total} total)
            </p>
          </div>
          <Link href="/admin/users/create">
            <Button size="lg">
              Add User
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 animate-slideInDown">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Users Table Card */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="overflow-x-auto">
            <UsersTable
              users={users}
              onDelete={handleDeleteClick}
              deleting={deleting}
            />
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t pt-6 gap-4">
            <p className="text-sm text-muted-foreground font-medium">
              Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span> • <span className="font-bold text-blue-600">{total}</span> users
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
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
