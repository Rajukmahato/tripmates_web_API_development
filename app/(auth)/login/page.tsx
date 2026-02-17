"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "../_components/LoginForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">
          Login to TripMates
        </CardTitle>
        <CardDescription>
          Continue your journey with us
        </CardDescription>
      </CardHeader>

      <LoginForm />
    </div>
  );
}
