"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/tripmates-logo.png"
              alt="Tripmates logo"
              width={140}
              height={40}
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm hover:text-primary">
              Login
            </Link>
            <Link href="/register">
              <Button className="text-sm px-5 py-4 font-semibold transition-transform hover:scale-[1.03]">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-[Poppins] text-3xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              About <span className="text-primary">TripMates</span>
            </h1>

            <p className="text-foreground/70 md:text-lg leading-relaxed mb-10 max-w-xl">
              TripMates is a community-driven platform designed to connect travelers, facilitate
              trip planning, and create unforgettable shared experiences around the world.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-semibold text-primary mb-2">🎯 Our Mission</h3>
                <p className="text-foreground/70">
                  To make travel more social, safer, and more affordable by connecting
                  like-minded explorers who share similar interests and travel goals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">✨ Our Vision</h3>
                <p className="text-foreground/70">
                  A world where no traveler has to explore alone, where cultural exchange
                  happens naturally, and where every journey creates meaningful memories.
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block h-96 rounded-xl overflow-hidden">
            <Image
              src="/images/travel-illustration.png"
              alt="TripMates Illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-2xl md:text-4xl font-[Poppins] font-semibold text-center mb-16">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="p-8 rounded-xl border"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-3">Community First</h3>
            <p className="text-foreground/70">
              We believe in the power of genuine connections and building a supportive
              community where travelers feel welcome and safe.
            </p>
          </div>

          <div
            className="p-8 rounded-xl border"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-3">Safety & Trust</h3>
            <p className="text-foreground/70">
              User safety and privacy are paramount. We implement robust verification
              systems and trust-building features.
            </p>
          </div>

          <div
            className="p-8 rounded-xl border"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
          >
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-3">Cultural Exchange</h3>
            <p className="text-foreground/70">
              We celebrate diversity and foster meaningful cross-cultural connections
              that enrich every traveler's journey.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <h2 className="text-2xl md:text-4xl font-[Poppins] font-semibold text-center mb-16">
          Why Choose TripMates?
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-2xl min-w-fit">✈️</div>
              <div>
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-foreground/70">
                  Our algorithm connects you with compatible travel partners based on
                  interests, dates, and travel style.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl min-w-fit">📅</div>
              <div>
                <h3 className="font-semibold mb-2">Easy Planning</h3>
                <p className="text-foreground/70">
                  Create, share, and collaborate on itineraries with your travel group
                  in real-time.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl min-w-fit">💬</div>
              <div>
                <h3 className="font-semibold mb-2">Direct Messaging</h3>
                <p className="text-foreground/70">
                  Chat securely with potential travel mates before committing to a trip.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-2xl min-w-fit">🛡️</div>
              <div>
                <h3 className="font-semibold mb-2">Verified Users</h3>
                <p className="text-foreground/70">
                  All members go through a verification process to ensure a safe and
                  trustworthy community.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl min-w-fit">📸</div>
              <div>
                <h3 className="font-semibold mb-2">Share Memories</h3>
                <p className="text-foreground/70">
                  Document and share your travel stories with your group and the wider
                  TripMates community.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl min-w-fit">🌐</div>
              <div>
                <h3 className="font-semibold mb-2">Global Reach</h3>
                <p className="text-foreground/70">
                  Connect with travelers from around the world and explore destinations
                  together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div
          className="p-12 rounded-2xl text-center shadow-xl"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          <h3 className="text-2xl md:text-3xl font-[Poppins] font-semibold mb-4">
            Ready to Start Your Next Adventure?
          </h3>
          <p className="opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have found their perfect travel companions
            on TripMates. Your next great journey awaits!
          </p>
          <Link href="/register">
            <Button
              className="px-8 py-3 font-semibold transition-transform hover:scale-[1.05]"
              style={{
                backgroundColor: "var(--primary-foreground)",
                color: "var(--primary)",
              }}
            >
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="p-6 text-center border-t"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} TripMates. Connecting travelers worldwide.
        </div>
      </footer>
    </main>
  );
}
