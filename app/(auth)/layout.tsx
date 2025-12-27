import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen">
      <div className="grid min-h-screen md:grid-cols-2">
        
        <div className="hidden md:flex flex-col">
          <header className="py-6 px-6 text-center">
            <h2 className="text-3xl font-bold text-purple-600">
              Welcome to TripMates
            </h2>
            <p className="mt-2 text-muted-foreground">
              Travel together. Explore smarter.
            </p>
          </header>

          <div className="relative flex-1">
            <Image
              src="/auth-illustration.png"
              alt="TripMates Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="flex items-center justify-center px-4 md:px-10">
          <Card className="w-full max-w-md rounded-2xl p-6">
            {children}
          </Card>
        </div>
      </div>
    </section>
  );
}
