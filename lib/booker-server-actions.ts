"use server";

import { prisma } from "@/lib/prisma";
import { approveBooking, confirmBooking } from "./mailer-server-actions";

export async function createBooking(bookingData: any) {
  try {
    const reqApproval = await prisma.room.findUnique({
      where: { id: bookingData.roomId },
      select: { reqApproval: true },
    });

    const newBooking = await prisma.bookingRequest.create({
      data: {
        roomId: bookingData.roomId,
        userId: bookingData.userId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        status: bookingData.status ?? "PENDING",
        description: bookingData.description,
      },
    });

    console.log("Booking created with id:", newBooking.id);

    // Check if room requires confirmation or not
    if (reqApproval) {
      await confirmBooking(newBooking.id);
    } else {
      await approveBooking(newBooking.id);
    }

    return { success: true, booking: newBooking };
  } catch (e) {
    console.error("Failed to create booking:", e);
    return { success: false };
  }
}
