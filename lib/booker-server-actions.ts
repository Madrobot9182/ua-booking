"use server";

import { prisma } from "@/lib/prisma";
import { confirmBooking } from "./mailer-server-actions";

export async function createBooking(bookingData: any) {
  try {
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

    await confirmBooking(newBooking.id);

    return { success: true, booking: newBooking };
  } catch (e) {
    console.error("Failed to create booking:", e);
    return { success: false };
  }
}