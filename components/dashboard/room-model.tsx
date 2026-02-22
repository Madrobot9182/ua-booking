"use client";

import { useState, useEffect } from "react";
import { Room, Organization, WeekDay } from "@/app/generated/prisma/browser";
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
  organizations: Organization[];
}

interface RoomFormData {
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

export default function RoomModal({
  room,
  onClose,
  refreshRooms,
  organizations,
}: RoomModalProps) {
  const [form, setForm] = useState<RoomFormData>({
    number: "",
    building: "",
    floor: 0,
    capacity: 0,
    description: "",
    visible: true,
    reqApproval: false,
    organizationId: "",
    openTime: "",
    closeTime: "",
    isActive: true,
    availableOn: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],
  });

  // Populate form when editing
  useEffect(() => {
    if (room) {
      setForm({
        number: room.number,
        building: room.building,
        floor: room.floor,
        capacity: room.capacity,
        description: room.description,
        visible: room.visible,
        reqApproval: room.reqApproval,
        organizationId: room.organizationId,
        openTime: new Date(room.openTime).toISOString().slice(11,16),
        closeTime: new Date(room.closeTime).toISOString().slice(11,16),
        isActive: room.isActive,
        availableOn: room.availableOn,
      });
    }
  }, [room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.organizationId) {
      alert("Please select an organization.");
      return;
    }

    try {
      if (room) {
        await updateRoomAction(room.id, form);
      } else {
        await createRoomAction(form);
      }

      onClose();
      await refreshRooms();
    } catch (err) {
      console.error("Room save failed:", err);
      alert("Failed to save room. Check console.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Create Room"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <Label>Building Name</Label>
          <Input
            value={form.building}
            onChange={(e) => setForm({ ...form, building: e.target.value })}
          />

          <Label>Room Number</Label>
          <Input
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />

          <Label>Floor</Label>
          <Input
            type="number"
            value={form.floor ?? 0}
            onChange={(e) => setForm({ ...form, floor: Number(e.target.value) })}
          />

          <Label>Capacity</Label>
          <Input
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
          />

          <Label>Open Time</Label>
          <Input
            type="time"
            value={form.openTime}
            onChange={(e) => setForm({ ...form, openTime: e.target.value })}
          />

          <Label>Close Time</Label>
          <Input
            type="time"
            value={form.closeTime}
            onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
          />

          <Label>Description</Label>
          <Textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Select
            value={form.organizationId}
            onValueChange={(value) => setForm({ ...form, organizationId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={String(org.id)}>
                  {org.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.visible}
              onCheckedChange={(checked) => setForm({ ...form, visible: checked as boolean })}
            />
            <span>Visible to Users</span>
          </label>

          <label className="flex items-center gap-2">
            <Checkbox
              checked={form.reqApproval}
              onCheckedChange={(checked) => setForm({ ...form, reqApproval: checked as boolean })}
            />
            <span>Requires Approval</span>
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