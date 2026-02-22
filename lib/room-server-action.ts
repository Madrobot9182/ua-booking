"use server";

import { WeekDay } from "@/app/generated/prisma/enums";
import { prisma } from "./prisma";
import { RoomFormData } from "@/components/dashboard/room-model";

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
  resourceIds?: string[];
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
    openTime:
      room.openTime instanceof Date
        ? room.openTime.toISOString().slice(11, 16)
        : room.openTime,
    closeTime:
      room.closeTime instanceof Date
        ? room.closeTime.toISOString().slice(11, 16)
        : room.closeTime,
    resources:
      room.resources?.map((r: any) => ({
        id: r.resource.id,
        name: r.resource.name,
      })) ?? [],
  };
}

// -------- CREATE ROOM --------
export async function createRoomAction(data: RoomFormData) {
  return await prisma.room.create({
    data: {
      number: data.number,
      building: data.building,
      floor: data.floor,
      capacity: data.capacity,
      description: data.description,
      visible: data.visible,
      reqApproval: data.reqApproval,
      organizationId: data.organizationId,
      isActive: data.isActive ?? true,
      availableOn: data.availableOn ?? [],
      openTime: new Date(`1970-01-01T${data.openTime}:00`),
      closeTime: new Date(`1970-01-01T${data.closeTime}:00`),

      // 🔥 THIS IS THE IMPORTANT PART
      resources: {
        create: data.resourceIds.map((id: string) => ({
          resource: {
            connect: { id },
          },
        })),
      },
    },
  });
}

// -------- UPDATE ROOM --------
export async function updateRoomAction(
  roomId: string,
  data: RoomFormData
) {
  return await prisma.room.update({
    where: { id: roomId },
    data: {
      number: data.number,
      building: data.building,
      floor: data.floor,
      capacity: data.capacity,
      description: data.description,
      visible: data.visible,
      reqApproval: data.reqApproval,
      organizationId: data.organizationId,
      isActive: data.isActive ?? true,
      availableOn: data.availableOn ?? [],
      openTime: new Date(`1970-01-01T${data.openTime}:00`),
      closeTime: new Date(`1970-01-01T${data.closeTime}:00`),

      // 🔥 RESET RELATION
      resources: {
        deleteMany: {},

        create: data.resourceIds.map((id: string) => ({
          resource: {
            connect: { id },
          },
        })),
      },
    },
  });
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
// -------- GET BOOKING REQUEST --------
export async function getBookingRequest(userId: string) {
  try {
    return await prisma.bookingRequest.findMany({
      where: { userId: userId },
      include: { room: true, user: true },
      orderBy: { startTime: "asc" },
    });
  } catch (err) {
    console.error("Failed to get Booking Request:", err);
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
  return await prisma.room.findMany({
    include: {
      resources: {
        include: {
          resource: true,
        },
      },
    },
    orderBy: { building: "asc" },
  });
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

// ---GET RESOURCES
export async function getAllResources() {
  const resources = await prisma.resource.findMany({
    orderBy: { name: "asc" },
  });
  return resources;
}

// ----- CREATE RESOURCES -----
export async function createResourceAction(name: string) {
  try {
    const resource = await prisma.resource.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    return resource;
  } catch (err) {
    console.error("Failed to create resource:", err);
    throw err;
  }
}
