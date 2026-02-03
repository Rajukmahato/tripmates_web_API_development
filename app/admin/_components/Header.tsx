"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AdminHeader() {
  const { logout } = useAuth();

  return (
    <header className="w-full border-b bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xl font-bold">
            Admin Dashboard
          </Link>
          <span className="text-sm text-muted-foreground">TripMates</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Admin Panel</span>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
