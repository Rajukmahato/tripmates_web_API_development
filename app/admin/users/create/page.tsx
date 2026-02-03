"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateUserForm from "../_components/CreateUserForm";

export default function CreateUserPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="outline" className="mb-4">
            ← Back to Users
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New User</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new user to the system
        </p>
      </div>

      <Card className="p-6">
        <CreateUserForm />
      </Card>
    </div>
  );
}
