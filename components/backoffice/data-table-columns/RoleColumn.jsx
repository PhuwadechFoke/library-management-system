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
import { useLanguage } from "@/context/LanguageContext";

export default function RoleColumn({ row }) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Support both nested user.role and flat role
  const currentRole = row.original.user?.role || row.original.role || "USER";
  const userId = row.original.userId || row.original.user?.id;
  const isMe = session?.user?.id === userId;
  const canManageRoles = session?.user?.role === "ADMIN";

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

  const roleLabels = {
    ADMIN: t("role.admin"),
    LIBRARIAN: t("role.librarian"),
    USER: t("role.user"),
  };
  const roleStyles = {
    ADMIN: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    LIBRARIAN: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    USER: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  };

  if (isMe || !canManageRoles) {
    return (
      <Badge
        variant="outline"
        className={roleStyles[currentRole] || roleStyles.USER}
      >
        {roleLabels[currentRole] || roleLabels.USER}
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
            <Badge variant="outline" className={roleStyles[currentRole] || roleStyles.USER}>
              {roleLabels[currentRole] || roleLabels.USER}
            </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">
          <span className="text-purple-600 dark:text-purple-300">{t("role.admin")}</span>
        </SelectItem>
        <SelectItem value="LIBRARIAN">
          <span className="text-amber-700 dark:text-amber-300">{t("role.librarian")}</span>
        </SelectItem>
        <SelectItem value="USER">
          <span className="text-blue-600 dark:text-blue-300">{t("role.user")}</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
