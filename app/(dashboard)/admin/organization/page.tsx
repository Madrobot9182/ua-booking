import OrganizationView from "./organization-view";
import { getOrganizations, getRooms } from "@/lib/room-server-action";

export const dynamic = "force-dynamic";

export default async function OrganizationPage() {
  const rooms = await getRooms(); 
  const organizations = await getOrganizations();


  return <OrganizationView initialRooms={rooms} organizations={organizations} />;
}