import { auth } from "@/lib/auth/server";
import Navbar from "@/components/dashboard/nav-bar";
import BookingSearchBar from "@/components/dashboard/booking-search-bar";
import BookingList from "@/components/dashboard/booking-list";
import AdminCalendar from "@/components/Admin-Calendar";
import { getBookingRequest, getRooms } from "@/lib/room-server-action";

export default async function DashboardPage() {
  const session = await auth.getSession();

  const initialRooms = await getRooms()
  const bookings = await getBookingRequest(session.data!.user.id)

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <BookingSearchBar initialRooms={initialRooms}/>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 rounded-2xl border bg-card p-6 shadow-sm">
            <BookingList bookings={bookings} />
          </div>
          <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
            <AdminCalendar bookings={bookings} />
          </div>
        </div>
      </div>
    </div>
  );
}
