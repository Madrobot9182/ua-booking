import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import PendingBookings from "@/components/dashboard/pending-bookings";
import AdminCalendar from "@/components/Admin-Calendar";

export const dynamic = "force-dynamic"; // refresh each request

export default async function AdminDashBoard() {
  // Fetch bookings: include pending + approved for the calendar
  const bookings = await prisma.bookingRequest.findMany({
    include: { room: true, user: true },
  });

  // Pending bookings sorted by startTime
  const pending = bookings
    .filter((b) => b.status === "PENDING")
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <main className="flex flex-col md:flex-row gap-6 p-6 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen">
      {/* Left: Pending Bookings List */}
      <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-lg font-semibold">Pending Bookings</h2>
        <PendingBookings bookings={pending} />
      </div>

      {/* Right: Calendar */}
      <div className="w-full md:w-2/3">
        <h2 className="text-lg font-semibold">Calendar</h2>
        <AdminCalendar bookings={bookings} />
      </div>
    </main>
  );
}