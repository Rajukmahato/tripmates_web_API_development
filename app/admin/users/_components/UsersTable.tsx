"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/api/admin/user";

interface UsersTableProps {
  users: User[];
  onDelete: (userId: string) => void;
  deleting?: string | null;
}

export default function UsersTable({ users, onDelete, deleting }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">No users found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new user to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 dark:bg-slate-800 border-b">
            <TableHead className="font-semibold text-foreground">User</TableHead>
            <TableHead className="font-semibold text-foreground">Email</TableHead>
            <TableHead className="font-semibold text-foreground">Phone</TableHead>
            <TableHead className="font-semibold text-foreground">Role</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors duration-150 even:bg-slate-50/50 dark:even:bg-slate-900/50"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={user.fullName}
                    profileImagePath={user.profileImage}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{user.fullName}</span>
                    <span className="text-xs text-muted-foreground">ID: {user._id.slice(0, 8)}...</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm break-all">{user.email}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{user.phoneNumber || "—"}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "admin" ? "admin" : "user"}
                  size="sm"
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                  <Link href={`/admin/users/${user._id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/users/${user._id}/edit`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(user._id)}
                    disabled={deleting === user._id}
                    className="text-xs"
                  >
                    {deleting === user._id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
