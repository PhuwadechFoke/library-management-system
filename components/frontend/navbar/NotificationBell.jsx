"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import toast from "react-hot-toast";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);
  const knownIdsRef = useRef(new Set());

  useEffect(() => {
    fetchNotifications();

    // Polling แบบ Realtime ทุก 8 วินาที
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (isBackground = false) => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        
        // ถ้าเป็นการ fetch รอบหลังๆ แล้วเจอแจ้งเตือนใหม่ที่ยังไม่อ่าน ให้เด้ง Toast แจ้งเตือนแบบ Realtime
        if (!isFirstLoad.current && Array.isArray(data)) {
          const newUnreadItems = data.filter(
            (item) => !item.isRead && !knownIdsRef.current.has(item.id)
          );

          if (newUnreadItems.length > 0) {
            newUnreadItems.forEach((item) => {
              toast(
                (t) => (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      toast.dismiss(t.id);
                      if (item.link) window.location.href = item.link;
                    }}
                  >
                    <p className="font-semibold text-sm">{item.title}</p>
                    {item.message && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {item.message}
                      </p>
                    )}
                  </div>
                ),
                {
                  icon: "🔔",
                  duration: 5000,
                  position: "top-right",
                }
              );
            });
          }
        }

        if (Array.isArray(data)) {
          data.forEach((n) => knownIdsRef.current.add(n.id));
        }

        setNotifications(data || []);
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteReadNotifications = async () => {
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Error deleting read notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasRead = notifications.some((n) => n.isRead);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-semibold text-sm">การแจ้งเตือน</span>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="อ่านทั้งหมด"
                onClick={(e) => {
                  e.preventDefault();
                  markAllAsRead();
                }}
              >
                <CheckCheck className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            {hasRead && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="ลบที่อ่านแล้ว"
                onClick={(e) => {
                  e.preventDefault();
                  deleteReadNotifications();
                }}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              กำลังโหลด...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              ไม่มีการแจ้งเตือน
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-4 cursor-pointer gap-1 ${
                  !notification.isRead ? "bg-muted/50" : ""
                }`}
                onClick={() => {
                  if (!notification.isRead) markAsRead(notification.id);
                  if (notification.link) {
                    window.location.href = notification.link;
                  }
                }}
              >
                <div className="flex justify-between w-full items-start">
                  <span className="font-semibold text-sm">
                    {notification.title}
                  </span>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                  )}
                </div>
                {notification.message && (
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: th,
                  })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
