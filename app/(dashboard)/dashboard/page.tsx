import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/dashboard/nav-bar";
import SearchBar from "@/components/dashboard/search-bar";
import CalendarDemo from "@/components/calendar-demo";
import BookingList from "@/components/dashboard/booking-list";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.getSession();
  // if (!session?.data?.session) {
  //   // redirect to login page if not logged in
  //   redirect("/auth/login");
  // }

  const bookings = await prisma.bookingRequest.findMany({
    where: { userId: session.data?.user.id },
    include: { room: true, user: true },
    orderBy: { startTime: "asc" },
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <SearchBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
            <CalendarDemo />
          </div>

          <div className="lg:col-span-1 rounded-2xl border bg-card p-6 shadow-sm">
            <BookingList bookings={bookings} />
          </div>
        </div>
      </div>
    </div>
  );
}
