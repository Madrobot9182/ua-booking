"use client";

import { useState } from "react";
import { Room } from "@/app/generated/prisma/browser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRoomAction, updateRoomAction } from "@/lib/room-server-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoomModalProps {
  room: Room | null;
  onClose: () => void;
  refreshRooms: () => void;
}

const ALL_RESOURCES = ["Projector", "Whiteboard", "Video Conferencing", "Speaker System"];

export default function RoomModal({ room, onClose, refreshRooms }: RoomModalProps) {
  const [form, setForm] = useState<Partial<Room>>(
    room || { number: "", building: "", capacity: 0, type: "MEETING", resources: [], isActive: true }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (room) {
      await updateRoomAction({ ...form, id: room.id } as Room);
    } else {
      await createRoomAction(form as Room);
    }
    onClose();
    await refreshRooms();
  };

  const toggleResource = (resource: string) => {
    setForm({
      ...form,
      resources: form.resources?.includes(resource)
        ? form.resources.filter(r => r !== resource)
        : [...(form.resources || []), resource]
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Create Room"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Room Number"
            value={form.roomNumber || ""}
            onChange={e => setForm({ ...form, roomNumber: e.target.value })}
          />

          <Input
            placeholder="Building"
            value={form.building || ""}
            onChange={e => setForm({ ...form, building: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Floor"
            value={form.floor ?? ""}
            onChange={e => setForm({ ...form, floor: Number(e.target.value) })}
          />

          <Input
            type="number"
            placeholder="Capacity"
            value={form.capacity ?? 0}
            onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
          />

          <Select
            value={form.type}
            onValueChange={value => setForm({ ...form, type: value as RoomType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Room Type" />
            </SelectTrigger>
            <SelectContent>
              {["LECTURE", "LAB", "MEETING"].map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Description"
            value={form.description || ""}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex flex-col gap-1">
            <span>Resources:</span>
            {ALL_RESOURCES.map(resource => (
              <label key={resource} className="flex items-center gap-2">
                <Checkbox
                  checked={form.resources?.includes(resource) || false}
                  onCheckedChange={() => toggleResource(resource)}
                />
                <span>{resource}</span>
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.isActive ?? true}
              onCheckedChange={checked => setForm({ ...form, isActive: checked as boolean })}
            />
            <span>Active</span>
          </label>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{room ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}