import { auth } from "@/lib/auth/server";
import OrganizationView from "./organization-view";
import { getAllResources, getCurrentUserOrganization, getRooms } from "@/lib/room-server-action";

export const dynamic = "force-dynamic";

export default async function OrganizationPage() {
  const session = await auth.getSession();
  if (!session) return null;

  const rooms = await getRooms(); 
  const organizations = await getCurrentUserOrganization(session.data!.user.id);
  const resources = await getAllResources();
  
  return <OrganizationView initialRooms={rooms} organizations={organizations!} resources={resources}/>;
}