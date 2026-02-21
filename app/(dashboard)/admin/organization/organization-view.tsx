"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RoomModal from "@/components/dashboard/room-model";
import { Room } from "@/app/generated/prisma/browser";
import { deleteRoomAction } from "@/lib/room-server-action";

interface OrganizationViewProps {
  initialRooms: Room[];
}

export default function OrganizationView({ initialRooms }: OrganizationViewProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [buildingFilter, setBuildingFilter] = useState<string>("ALL");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);

  const buildings = ["ALL", ...Array.from(new Set(initialRooms.map(r => r.building)))];

  const filteredRooms =
    buildingFilter === "ALL"
      ? rooms
      : rooms.filter(r => r.building === buildingFilter);

  const refreshRooms = async () => {
    const updatedRooms = await fetch("/admin/organization?cache=reload").then(res => res.json());
    setRooms(updatedRooms);
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    await deleteRoomAction(roomId);
    await refreshRooms();
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-dark text-light">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organization Management</h1>
        <Button onClick={() => { setSelectedRoom(null); setShowModal(true); }}>+ Create Room</Button>
      </div>

      {/* Building Filter */}
      <div className="flex gap-3 flex-wrap">
        {buildings.map(b => (
          <Button
            key={b}
            variant={buildingFilter === b ? "default" : "outline"}
            onClick={() => setBuildingFilter(b)}
          >
            {b}
          </Button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => (
          <div key={room.id} className="p-4 border rounded-xl bg-muted/20 hover:bg-muted/50 transition">
            <h3 className="font-semibold">{room.number} </h3>
            <p className="text-sm opacity-70">{room.building}</p>
            <p className="text-sm">Capacity: {room.capacity}</p>
            {room.description && <p className="text-sm mt-1">{room.description}</p>}
            {/* {room.resources.length > 0 && <p className="text-sm mt-1">Resources: {room.resources.join(", ")}</p>} */}
            {/* <p className="text-sm mt-1">{room.isActive ? "Active" : "Inactive"}</p> */}

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => { setSelectedRoom(room); setShowModal(true); }}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(room.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setShowModal(false)}
          refreshRooms={refreshRooms}
        />
      )}
    </div>
  );
}