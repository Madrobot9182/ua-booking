import { Building2, Hash, AlignLeft, Users, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/server";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// We import the client-side pop-up button here
import BookRoomDialog from "./BookRoomDialog";
import BookingSearchBar from "@/components/dashboard/booking-search-bar";
import { getRooms } from "@/lib/room-server-action";

export default async function RoomList({
  searchParams,
}: {
  searchParams: Promise<{
    building?: string;
    capacity?: string;
    start?: string;
    end?: string;
  }>; // Define the expected "q" parameter
}) {
  function convertTime(time: Date) {
    const dateObj = new Date(time);
    // Format it to local time zone
    return dateObj.toLocaleTimeString();
  }
  const initialRooms = await getRooms();

  //get user ID
  const session = await auth.getSession();
  const userId = session.data!.user.id;

  const params = await searchParams;
  const capacity = params.capacity;
  const building = params.building;

  const startTime = params?.start ? new Date(params.start) : undefined;
  const endTime = params?.end ? new Date(params.end) : undefined;

  var capacity_num;
  if (capacity) {
    capacity_num = parseInt(capacity);
  }

  const conflictingBookings = await prisma.bookingRequest.findMany({
    where: {
      startTime: { lt: startTime },
      endTime: { gt: endTime },
    },
    select: {
      roomId: true,
    },
  });

  const busyRoomIds = conflictingBookings.map((booking) => booking.roomId); //get only the IDs
  const data = await prisma.room.findMany({
    where: {
      ...(capacity_num !== undefined && { capacity: { gte: capacity_num } }),
      ...(building && building !== "ALL" && { building }), // only include if not "ALL"
      ...(startTime && { openTime: { lte: startTime } }),
      ...(endTime && { closeTime: { gte: endTime } }),
      ...(busyRoomIds.length > 0 && { id: { notIn: busyRoomIds } }),
      ...(startTime &&
        endTime && {
          bookings: {
            none: {
              status: "APPROVED",
              startTime: { lt: endTime },
              endTime: { gt: startTime },
            },
          },
        }),
    },
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-4">
        <BookingSearchBar initialRooms={initialRooms} />
      </div>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Directory</h1>
          <p className="text-muted-foreground mt-2">
            Browse available spaces and capacities.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          Total Rooms: {data.length}
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {data.map((room) => (
          <Card
            key={room.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-primary/50 transition-colors"
          >
            {/* Left Section: Main Details */}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  {room.building}
                  <span className="text-muted-foreground font-normal mx-1">
                    |
                  </span>
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  {room.number}
                </CardTitle>
                <Badge variant="secondary" className="font-mono text-s">
                  Floor: {room.floor} <br></br> ID: {room.id}
                </Badge>
                {room.reqApproval ? (
                  <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs">
                    Requires Approval
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs">
                    Instant Booking
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground text-sm flex items-start gap-2 mt-3 mb-4 max-w-2xl">
                <AlignLeft className="h-4 w-4 shrink-0 mt-0.5" />
                {room.description}
              </p>

              {/* Added: Flex container to group Capacity and Hours side-by-side */}
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Capacity: {room.capacity} people
                </div>

                {/* Added: Opening Hours Section */}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {/* Assumes your room object has an openingHours property. 
                      Fallback provided just in case. */}
                  Hours:{" "}
                  {String(convertTime(room.openTime)) +
                    "-" +
                    String(convertTime(room.closeTime))}
                </div>
              </div>
            </div>

            {/* Right Section: The Modal Button */}
            <div className="p-6 pt-0 sm:pt-6 border-t sm:border-t-0 sm:border-l flex items-center justify-center w-full sm:w-40 bg-muted/10 sm:h-full">
              {/* This replaces the button and handles all the client-side pop-up logic */}
              <BookRoomDialog
                room={room}
                userId={userId}
                defaultStartTime={startTime}
                defaultEndTime={endTime}
              />
            </div>
          </Card>
        ))}

        {data.length === 0 && (
          <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
            No rooms available in the database.
          </div>
        )}
      </div>
    </div>
  );
}
