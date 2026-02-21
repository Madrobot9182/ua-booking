"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RoomModal from "@/components/dashboard/room-model";
import { Room } from "@/app/generated/prisma/browser";
import { deleteRoomAction } from "@/lib/room-server-action";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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

  {/* Building Dropdown */}
  <Select
    value={buildingFilter}
    onValueChange={setBuildingFilter}
  >
    <SelectTrigger className="w-60">
      <SelectValue placeholder="Select Building" />
    </SelectTrigger>
    <SelectContent className="grid grid-cols-2 gap-2 p-2 max-h-64 overflow-y-auto">
      {buildings.map(b => (
        <SelectItem key={b} value={b}>{b}</SelectItem>
      ))}
    </SelectContent>
  </Select>

  {/* Timeline Table */}
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full table-fixed border-collapse">
      <thead>
        <tr className="bg-muted text-sm">
          <th className="p-2 border">Room</th>
          {Array.from({ length: 24 }, (_, i) => (
            <th key={i} className="p-2 border">{i}:00</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredRooms.map(room => {
          const cells = Array.from({ length: 24 }, (_, hour) => {
            const openHour = room.openTime.getHours();
            const closeHour = room.closeTime.getHours();
            const isOpen = hour >= openHour && hour < closeHour;
            // const isBooked = room.?.some(
            //   b => b.startTime.getHours() <= hour && b.endTime.getHours() > hour
            // );
            // const bg = !isOpen ? "bg-gray-700" : isBooked ? "bg-red-500/50" : "bg-green-500/20";
            const bg = "bg-gray-700"
            return <td key={hour} className={`border h-8 ${bg}`} />;
          });

          return (
            <tr key={room.id}>
              <td className="border p-1 font-semibold">{room.number}</td>
              {cells}
            </tr>
          );
        })}
      </tbody>
    </table>
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