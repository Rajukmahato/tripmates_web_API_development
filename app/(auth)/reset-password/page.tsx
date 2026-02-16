"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "../_components/ResetPasswordForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-600">
          Create New Password
        </CardTitle>
        <CardDescription>
          Enter your new password to regain access to your account
        </CardDescription>
      </CardHeader>

      <ResetPasswordForm />
    </div>
  );
}
