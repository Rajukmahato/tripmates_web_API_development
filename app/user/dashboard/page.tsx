"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Dashboard Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your trips</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Ready for your next adventure?</h2>
          <p className="mb-4 opacity-90">Create a new trip or browse existing ones to find travel companions</p>
          <div className="flex gap-4">
            <Link href="/user/trips/create">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Create New Trip
              </Button>
            </Link>
            <Link href="/user/trips">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Trips
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">My Trips</h3>
            <p className="text-muted-foreground mb-4">View and manage your upcoming trips</p>
            <Link href="/user/trips">
              <Button variant="outline" className="w-full">View Trips</Button>
            </Link>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📨</div>
            <h3 className="text-xl font-semibold mb-2">Requests</h3>
            <p className="text-muted-foreground mb-4">Manage your join requests</p>
            <Link href="/requests/received">
              <Button variant="outline" className="w-full">View Requests</Button>
            </Link>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👤</div>
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="text-muted-foreground mb-4">Manage your account and preferences</p>
            <Link href="/user/profile">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-muted-foreground text-center py-8">
            No recent activity to display
          </div>
        </div>
      </main>
    </div>
  );
}
