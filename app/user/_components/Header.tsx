"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function UserHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/user/dashboard" className="text-xl font-bold">
          TripMates
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/user/dashboard" className="hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/user/trips" className="hover:text-primary transition">
            Trips
          </Link>
          <Link href="/requests/received" className="hover:text-primary transition">
            Requests
          </Link>
          <Link href="/user/profile" className="hover:text-primary transition">
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Avatar 
            name={user?.fullName || "User"} 
            profileImagePath={user?.profileImagePath}
          />
          <div className="hidden sm:block text-sm">
            <p className="font-medium">{user?.fullName || "User"}</p>
            <p className="text-muted-foreground text-xs">{user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => logout()}
            className="hover:bg-destructive/10"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
