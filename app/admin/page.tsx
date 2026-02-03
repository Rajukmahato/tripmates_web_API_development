import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="mt-2 text-muted-foreground">
          Manage users and monitor platform activity.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="text-sm text-muted-foreground">
              View, create, and manage users.
            </p>
          </div>
          <Link href="/admin/users">
            <Button>Go to Users</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
