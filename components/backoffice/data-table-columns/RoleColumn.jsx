"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function RoleColumn({ row }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Support both nested user.role and flat role
  const currentRole = row.original.user?.role || row.original.role || "USER";
  const userId = row.original.userId || row.original.user?.id;
  const isMe = session?.user?.id === userId;

  const [loading, setLoading] = useState(false);

  async function handleRoleChange(newRole) {
    if (newRole === currentRole) return;
    if (isMe) {
      toast.error("ไม่สามารถเปลี่ยนบทบาทของตัวเองได้");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "เกิดข้อผิดพลาด");
        return;
      }

      toast.success(data.message || "เปลี่ยนบทบาทสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
    } catch (error) {
      console.error("Failed to change role:", error);
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนบทบาท");
    } finally {
      setLoading(false);
    }
  }

  if (isMe) {
    return (
      <Badge
        variant="outline"
        className="border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-300"
      >
        {currentRole === "ADMIN" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
      </Badge>
    );
  }

  return (
    <Select
      value={currentRole}
      onValueChange={handleRoleChange}
      disabled={loading}
    >
      <SelectTrigger className="w-[140px] h-8">
        <SelectValue>
          {currentRole === "ADMIN" ? (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">
              ผู้ดูแลระบบ
            </Badge>
          ) : (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
              ผู้ใช้งาน
            </Badge>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">
          <span className="text-purple-600 dark:text-purple-300">ผู้ดูแลระบบ</span>
        </SelectItem>
        <SelectItem value="USER">
          <span className="text-blue-600 dark:text-blue-300">ผู้ใช้งาน</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
