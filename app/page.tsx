import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">TripMates</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to TripMates
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Connect with fellow travelers, plan amazing trips, and create unforgettable memories together.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Plan Trips</h3>
              <p className="text-muted-foreground">
                Organize your travel plans and itineraries with ease
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Find Travel Mates</h3>
              <p className="text-muted-foreground">
                Connect with like-minded travelers around the world
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="text-xl font-semibold mb-2">Share Experiences</h3>
              <p className="text-muted-foreground">
                Share your travel stories and inspire others
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
