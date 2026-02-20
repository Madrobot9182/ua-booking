import { auth } from "@/lib/auth/server";
import Image from "next/image";
import { CalendarWithTime } from "@/components/Calendar"
import { BookingTable } from "@/components/BookingTable";
import CalendarDemo from '@/components/calendar-demo'
import { redirect } from "next/navigation";

export default async function Home() {
  // Test logic for logging in 
  const session = await auth.getSession();
  if (!session) redirect("/auth/login");
  
  return (
    <>
      <CalendarDemo />
    </>
  );
}
