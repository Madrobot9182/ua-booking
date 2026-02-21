"use server";

import { prisma } from "@/lib/prisma";
import { confirmBooking } from "./mailer-server-actions";

export async function createBooking(bookingData: any) {
  try {
    const newBooking = await prisma.bookingRequest.create({
      data: {
        id: bookingData.id,
        roomId: bookingData.roomId,
        userId: bookingData.userId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        status: bookingData.status,
        description: bookingData.description,
      },
    });

    await confirmBooking(bookingData.id);
    return { success: true, booking: newBooking };
  } 
  catch (e) {
    alert(e);
    return { success: false };
  }
}
