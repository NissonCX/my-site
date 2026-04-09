export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 pt-24">{children}</main>
  );
}