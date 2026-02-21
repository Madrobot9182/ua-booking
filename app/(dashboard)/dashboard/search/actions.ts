"use server";

import { prisma } from "@/lib/prisma";

export async function createBooking(bookingData: any) {
  // This runs securely on the server!
  const newBooking = await prisma.bookingRequest.create({
    data: {
      id: bookingData.id,
      roomId: (bookingData.roomId),
      userId: (bookingData.userId),
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      status: bookingData.status,
      description: bookingData.description
    }
  });
  
  return { success: true, booking: newBooking };
}