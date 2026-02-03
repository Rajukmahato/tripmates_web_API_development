import UserHeader from "./_components/Header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <UserHeader />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
