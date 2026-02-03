"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">My Trips</h3>
            <p className="text-muted-foreground mb-4">View and manage your upcoming trips</p>
            <Button variant="outline" className="w-full">View Trips</Button>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-xl font-semibold mb-2">Trip Mates</h3>
            <p className="text-muted-foreground mb-4">Connect with your travel companions</p>
            <Button variant="outline" className="w-full">Find Mates</Button>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">Settings</h3>
            <p className="text-muted-foreground mb-4">Manage your account preferences</p>
            <Button variant="outline" className="w-full">Settings</Button>
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
