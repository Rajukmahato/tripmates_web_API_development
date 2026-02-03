import { Loading } from "@/components/ui/loading";

export default function UsersLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading size="lg" text="Loading users..." />
    </div>
  );
}
