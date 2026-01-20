"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FeatureCard from "./_components/FeatureCard";

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
          <Image
            src="/images/tripmates-logo.png"
            alt="Tripmates logo"
            width={140}
            height={40}
            priority
          />

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

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-left">
            <h1 className="font-[Poppins] text-3xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              Travel together. <br />
              Create memories.
            </h1>

            <p className="text-foreground/70 md:text-lg leading-relaxed mb-10 max-w-xl">
              Tripmates helps you find travel partners, plan trips together,
              share experiences, and explore destinations safely — all in one
              community-driven platform.
            </p>

            <div className="flex gap-4">
              <Link href="/register">
                <Button className="px-7 py-6 font-semibold transition-transform hover:scale-[1.03]">
                  Create account
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block h-105 animate-fade-in-right">
            <Image
              src="/images/travel-illustration.png"
              alt="Tripmates app preview"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: "🌍",
              title: "Find Tripmates",
              desc: "Match with like-minded travelers",
            },
            {
              icon: "🗓️",
              title: "Plan Together",
              desc: "Organize trips easily",
            },
            {
              icon: "🔐",
              title: "Safe Community",
              desc: "Verified & trusted users",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: "var(--card)" }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-[Poppins] font-semibold text-center mb-12">
          Why Tripmates?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Find Partners"
            icon="🤝"
            desc="Meet travelers with similar plans."
          />
          <FeatureCard
            title="Trip Planning"
            icon="🧭"
            desc="Plan routes, dates & budgets."
          />
          <FeatureCard
            title="Chat & Connect"
            icon="💬"
            desc="Talk before you travel."
          />
          <FeatureCard
            title="Shared Itineraries"
            icon="📍"
            desc="Keep everyone aligned."
          />
          <FeatureCard
            title="Community Trust"
            icon="🛡️"
            desc="Travel with confidence."
          />
          <FeatureCard
            title="Memories Together"
            icon="📸"
            desc="Turn trips into stories."
            highlight
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-primary text-primary-foreground p-12 rounded-2xl text-center shadow-xl shadow-primary/20">
          <h3 className="text-2xl md:text-3xl font-[Poppins] font-semibold mb-4">
            Start your journey with Tripmates
          </h3>
          <p className="opacity-90 mb-8">
            Create an account and explore the world with the right people.
          </p>
          <Link href="/register">
            <button
              className="rounded-xl px-8 py-3 font-semibold transition-transform hover:scale-[1.04]"
              style={{
                backgroundColor: "var(--primary-foreground)",
                color: "var(--primary)",
              }}
            >
              Join Tripmates
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="p-4 flex justify-center border-t"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tripmates. Travel together.
        </div>
      </footer>
    </main>
  );
}
