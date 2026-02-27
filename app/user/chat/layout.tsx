export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 lg:inset-x-0 top-16 bottom-0 overflow-hidden bg-white dark:bg-slate-900">
      {children}
    </div>
  );
}
