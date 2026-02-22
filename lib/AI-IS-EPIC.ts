"use server";

import OpenAI from "openai";
import { prisma } from "./prisma";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseRoomQuery(userQuery: string) {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo", //"gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
Parse the following query into JSON with fields:
capacity, building, startTime, endTime, keywords (list of words):
"${userQuery}"
        `,
      },
    ],
    temperature: 0,
  });

  const text = response.choices[0].message?.content || "{}";
  return JSON.parse(text);
}

/**
 * Perform actual room search using Prisma
 */
export async function searchRoomsWithNLP(userQuery: string) {
  // Parse the natural-language query
  const filters = await parseRoomQuery(userQuery);

  // Convert times if they exist
  const startTime = filters.startTime ? new Date(filters.startTime) : undefined;
  const endTime = filters.endTime ? new Date(filters.endTime) : undefined;
  const capacity_num = filters.capacity ? Number(filters.capacity) : undefined;
  const building = filters.building || undefined;

  // Find busy rooms
  let busyRoomIds: string[] = [];
  if (startTime && endTime) {
    const conflictingBookings = await prisma.bookingRequest.findMany({
      where: {
        status: "APPROVED",
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
      select: { roomId: true },
    });
    busyRoomIds = conflictingBookings.map((b) => b.roomId);
  }

  // Prisma query using your actual search function
  const rooms = await prisma.room.findMany({
    where: {
      ...(capacity_num !== undefined && { capacity: { gte: capacity_num } }),
      ...(building && building !== "ALL" && { building }),
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
    include: {
      resources: {
        include: { resource: true },
      },
    },
  });

  return rooms;
}

export async function aiSearchRooms(query: string) {
  return await searchRoomsWithNLP(query);
}
