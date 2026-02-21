import AdminNavBar from "@/components/dashboard/admin-navbar";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.data!.user.id },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <div> <AdminNavBar /> {children}</div>;
}
