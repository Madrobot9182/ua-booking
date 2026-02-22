"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RoomModal from "@/components/dashboard/room-model";
import { Room, Organization, Resource } from "@/app/generated/prisma/browser";
import { deleteRoomAction, getRooms } from "@/lib/room-server-action";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RoomWithResources } from "@/lib/types/prisma-type";

interface OrganizationViewProps {
  initialRooms: RoomWithResources[];
  organizations: Organization[];
  resources: Resource[];
}

export default function OrganizationView({
  initialRooms,
  organizations,
  resources,
}: OrganizationViewProps) {
  const [rooms, setRooms] = useState<RoomWithResources[]>(initialRooms);
  const [buildingFilter, setBuildingFilter] = useState<string>("ALL");
  const [selectedRoom, setSelectedRoom] = useState<RoomWithResources | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const buildings = [
    "ALL",
    ...Array.from(new Set(initialRooms.map((r) => r.building))),
  ];

  const filteredRooms =
    buildingFilter === "ALL"
      ? rooms
      : rooms.filter((r) => r.building === buildingFilter);

  const refreshRooms = async () => {
    try {
      const updatedRooms = await getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      console.error("Failed to refresh rooms:", err);
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    await deleteRoomAction(roomId);
    await refreshRooms();
  };

  return (
    <div className="space-y-6">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-2xl font-bold">Organization Management</h1>
        <Button
          onClick={() => {
            setSelectedRoom(null);
            setShowModal(true);
          }}
        >
          + Create Room
        </Button>
      </div>

      {/* Building Filter */}
      <Select value={buildingFilter} onValueChange={setBuildingFilter}>
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Select Building" />
        </SelectTrigger>
        <SelectContent className="max-h-64 overflow-y-auto">
          {buildings.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Compact List */}
      <div className="space-y-3">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="flex justify-between items-center p-3 bg-card rounded-lg border hover:shadow cursor-pointer"
            onClick={() => {
              setSelectedRoom(room);
              setShowModal(true);
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold">
                {room.building} {room.number}
              </span>

              <span className="text-sm text-muted-foreground">
                Capacity: {room.capacity} | Floor: {room.floor ?? "-"} | Open:{" "}
                {room.openTime.toISOString().slice(11, 16)} -{" "}
                {room.closeTime.toISOString().slice(11, 16)}
              </span>

              {/* Resource Tags */}
              <div className="flex flex-wrap gap-1 mt-1">
                {room.resources.map((r) => (
                  <span
                    key={r.resource.id}
                    className="px-2 py-0.5 text-xs rounded-full bg-muted border"
                  >
                    {r.resource.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(room.id);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setShowModal(false)}
          refreshRooms={refreshRooms}
          organizations={organizations}
          resources={resources}
        />
      )}
    </div>
  );
}
