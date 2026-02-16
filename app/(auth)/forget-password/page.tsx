"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ForgotPasswordForm from "../_components/ForgotPasswordForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-600">
          Reset Your Password
        </CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <ForgotPasswordForm />
    </div>
  );
}
