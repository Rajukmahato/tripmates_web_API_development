import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-green-500">
          Trip Mate
        </span>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-8 text-sm font-medium">
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>

        <Link
          href="/login"
          className="border px-4 py-1 rounded-full"
        >
          Log in
        </Link>

        <Link
          href="/register"
          className="text-black"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}
