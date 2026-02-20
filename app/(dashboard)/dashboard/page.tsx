import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/dashboard/NavBar";
import SearchBar from "@/components/dashboard/SearchBar"
import CalendarDemo from "@/components/calendar-demo";

export default function DashboardPage() {
  const mockBookings = [
    { id: "1", title: "Studio Session", date: "March 2", status: "upcoming" },
    { id: "2", title: "Event Review", date: "March 5", status: "review" }
  ]

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
          </div>
        </div>
      </div>
    </div>
  )
}