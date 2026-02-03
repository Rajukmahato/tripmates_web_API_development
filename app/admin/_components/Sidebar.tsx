import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Navigation</h2>
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Overview
          </Link>
          <Link
            href="/admin/users"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Users
          </Link>
        </nav>
      </div>
    </aside>
  );
}
