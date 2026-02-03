import { redirect } from "next/navigation";
import { getAuthToken, getUserData } from "@/lib/cookie";

export default async function Page() {
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  if (!token || !user) {
    redirect("/login");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  redirect("/user/dashboard");
}