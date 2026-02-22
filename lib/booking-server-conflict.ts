"use server"

// Adjust this import path to wherever your Prisma client is instantiated
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/app/generated/prisma/enums"

export async function checkBookingConflict(
  roomId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId: string // The ID of the booking we are currently reviewing
) {
  try {
    const conflicts = await prisma.bookingRequest.findMany({
      where: {
        roomId: roomId,
        
        status: "PENDING",
        // Exclude the current booking itself from the check
        id: { not: excludeBookingId }, 
        // The standard overlap logic:
        // (Existing Start < New End) AND (Existing End > New Start)
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    })

    return {
      hasConflict: conflicts.length > 0,
      conflicts: conflicts,
    }
  } catch (error) {
    console.error("Error checking booking conflicts:", error)
    throw new Error("Failed to check booking conflicts.")
  }
}
export async function deleteBookingConflicts(roomId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId: string // The ID of the booking we are currently reviewing
){
    try {
      await prisma.bookingRequest.deleteMany({
      where: {
        roomId: roomId,
        
        status: "PENDING",
        // Exclude the current booking itself from the check
        id: { not: excludeBookingId }, 
        
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },

    })
  } catch (error) {
    console.error("Error deleting booking conflicts:", error)
    throw new Error("Failed to deleting booking conflicts.")
  }
}