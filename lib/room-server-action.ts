"use server";

import { WeekDay } from "@/app/generated/prisma/enums";
import { prisma } from "./prisma";

export interface RoomInput {
  number: string;
  building: string;
  floor?: number | null;
  capacity: number;
  description?: string | null;
  visible: boolean;
  reqApproval: boolean;
  organizationId: string;
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
  isActive?: boolean;
  availableOn?: WeekDay[];
}

// Convert "HH:MM" string to Date object for Prisma @db.Time
function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(0); // Epoch, only time matters
  d.setUTCHours(hours, minutes, 0, 0);
  return d;
}

// Serialize Prisma Room object for JSON-safe response
function serializeRoom(room: any) {
  return {
    ...room,
    openTime: room.openTime instanceof Date ? room.openTime.toISOString().slice(11,16) : room.openTime,
    closeTime: room.closeTime instanceof Date ? room.closeTime.toISOString().slice(11,16) : room.closeTime,
    createdAt: room.createdAt?.toISOString?.() ?? room.createdAt,
    updatedAt: room.updatedAt?.toISOString?.() ?? room.updatedAt,
  };
}

// -------- CREATE ROOM --------
export async function createRoomAction(data: RoomInput) {
  try {
    const room = await prisma.room.create({
      data: {
        building: data.building,
        number: data.number,
        floor: data.floor ?? null,
        capacity: data.capacity,
        description: data.description ?? null,
        visible: data.visible,
        reqApproval: data.reqApproval,
        isActive: true,
        organizationId: data.organizationId,
        openTime: timeStringToDate(data.openTime),
        closeTime: timeStringToDate(data.closeTime),
        availableOn: data.availableOn ?? ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],
      },
    });
    return serializeRoom(room);
  } catch (err) {
    console.error("Failed to create room:", err);
    throw err;
  }
}

// -------- UPDATE ROOM --------
export async function updateRoomAction(id: string, data: RoomInput) {
  try {
    const room = await prisma.room.update({
      where: { id },
      data: {
        building: data.building,
        number: data.number,
        floor: data.floor ?? null,
        capacity: data.capacity,
        description: data.description ?? null,
        visible: data.visible,
        reqApproval: data.reqApproval,
        isActive: data.isActive ?? true,
        organizationId: data.organizationId,
        openTime: timeStringToDate(data.openTime),
        closeTime: timeStringToDate(data.closeTime),
        availableOn: data.availableOn ?? ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],
      },
    });
    return serializeRoom(room);
  } catch (err) {
    console.error("Update room failed:", err);
    throw err;
  }
}

// -------- DELETE ROOM --------
export async function deleteRoomAction(id: string) {
  try {
    return await prisma.room.delete({ where: { id } });
  } catch (err) {
    console.error("Failed to delete room:", err);
    throw err;
  }
}

// -------- DELETE BOOKING REQUEST --------
export async function deleteBookingRequest(id: string) {
  try {
    return await prisma.bookingRequest.delete({ where: { id } });
  } catch (err) {
    console.error("Failed to delete booking request:", err);
    throw err;
  }
}

// -------- GET ROOMS --------
export async function getRooms() {
  return prisma.room.findMany({ orderBy: { building: "asc" } });
}

// -------- GET ORGANIZATIONS --------
export async function getCurrentUserOrganization(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true },
  });

  if (!user?.organizationId) return null;

  return await prisma.organization.findMany({
    where: { id: user.organizationId },
    // include: {
    //   rooms: true,
    //   members: { select: { id: true, email: true, role: true } },
    // },
  });
}