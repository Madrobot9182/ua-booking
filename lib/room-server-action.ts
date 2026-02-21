"use server";
import { prisma } from "@/lib/prisma";
import { Room } from "@/app/generated/prisma/browser";

export async function createRoomAction(data: Room) {
  await prisma.room.create({ data });
}

export async function updateRoomAction(data: Room) {
  const { id, ...rest } = data;
  await prisma.room.update({
    where: { id },
    data: rest,
  });
}

export async function deleteRoomAction(id: string) {
  await prisma.room.delete({ where: { id } });
}