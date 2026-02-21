import { prisma } from "@/lib/prisma";
import OrganizationView from "./organization-view";

export const dynamic = "force-dynamic";

export default async function OrganizationPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { building: "asc" },
  });

  return <OrganizationView initialRooms={rooms} />;
}