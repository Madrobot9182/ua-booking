import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth.getSession();

  const bookings = await prisma.bookingRequest.findMany({
    where: { userId: session.data!.user.id },
    include: { room: true },
  });

  return (
    <div>
      <h1>Your Admin Views!!!</h1>
      {bookings.map((b) => (
        <div key={b.id}>
          {b.room.building} - {b.room.number} — {b.startTime.toDateString()}
        </div>
      ))}
    </div>
  );
}