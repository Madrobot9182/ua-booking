"use client";

import { useState } from "react";
import { Room, Organization } from "@/app/generated/prisma/browser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRoomAction, updateRoomAction } from "@/lib/room-server-action";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface RoomModalProps {
  room: Room | null;
  onClose: () => void;
  refreshRooms: () => void;
//   organizations: Organization[]; // pass list of organizations for the dropdown
}

export default function RoomModal({
  room,
  onClose,
  refreshRooms,
  // organizations,
}: RoomModalProps) {
  const [form, setForm] = useState<Partial<Room>>(
    room || {
      number: "",
      building: "",
      floor: 0,
      capacity: 0,
      description: "",
      visible: true,
      reqApproval: false,
      // organizationId: organizations[0]?.id || "",
      openTime: new Date(),
      closeTime: new Date(),
    },
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Create Room"}</DialogTitle>
        </DialogHeader>

        <Label>Building Name</Label>

        <Input
          placeholder="Building"
          value={form.building || ""}
          onChange={(e) => setForm({ ...form, building: e.target.value })}
        />
        <Label>Room Number</Label>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Room Number"
            value={form.number || ""}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
          <Label>Floor</Label>
          <Input
            type="number"
            placeholder="Floor"
            value={form.floor ?? 0}
            onChange={(e) =>
              setForm({ ...form, floor: Number(e.target.value) })
            }
          />
          <Label>Room Capacity</Label>

          <Input
            type="number"
            placeholder="Capacity"
            value={form.capacity ?? 0}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
          />
          <Label>Open Time</Label>
          <Input
            type="time"
            placeholder="Open Time"
            value={
              form.openTime ? form.openTime.toISOString().slice(11, 16) : ""
            }
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const d = new Date(form.openTime || new Date());
              d.setHours(hours, minutes);
              setForm({ ...form, openTime: d });
            }}
          />

          <Label>Closing Time</Label>
          <Input
            type="time"
            placeholder="Close Time"
            value={
              form.closeTime ? form.closeTime.toISOString().slice(11, 16) : ""
            }
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":").map(Number);
              const d = new Date(form.closeTime || new Date());
              d.setHours(hours, minutes);
              setForm({ ...form, closeTime: d });
            }}
          />

          {/* Description */}
          <Label>Description</Label>
          <Textarea
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {/* <Select
            value={form.organizationId || ""}
            onValueChange={value => setForm({ ...form, organizationId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org.id} value={org.id}>
                  {org.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.visible ?? true}
              onCheckedChange={(checked) =>
                setForm({ ...form, visible: checked as boolean })
              }
            />
            <span>Visible to Users</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.reqApproval ?? false}
              onCheckedChange={(checked) =>
                setForm({ ...form, reqApproval: checked as boolean })
              }
            />
            <span>Requires Approval</span>
          </label>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{room ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
