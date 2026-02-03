import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UsersNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The user you are looking for does not exist.
        </p>
        <Link href="/admin/users">
          <Button className="mt-4">Back to Users</Button>
        </Link>
      </div>
    </div>
  );
}
