"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "../_components/RegisterForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-600">
          Create your TripMates account
        </CardTitle>
        <CardDescription>
          Join and start exploring together
        </CardDescription>
      </CardHeader>

      <RegisterForm />
    </div>
  );
}
