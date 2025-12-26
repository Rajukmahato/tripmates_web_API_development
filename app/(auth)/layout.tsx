import { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2025 TripMates. All rights reserved.
      </footer>
    </div>
  );
}

