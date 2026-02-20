import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
