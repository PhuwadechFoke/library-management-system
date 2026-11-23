import React from "react";
import { SparklesTextDemo } from "../../frontend/SparklesTextDemo";
import { BookOpen } from "lucide-react";
import { CommandDialogDemo } from "../../frontend/CommandDialogDemo";
import Link from "next/link";
import { Button } from "../../ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NavAvatar } from "@/components/frontend/navbar/NavAvatar";
import NotificationBell from "@/components/frontend/navbar/NotificationBell";
import AdminHamburgerMenu from "./AdminHamburgerMenu";
import SwitchTheme from "@/components/SwitchTheme";

export default async function AdminNavbar({ className }) {
  const session = await getServerSession(authOptions);

  return (
    <div
      className={`sticky top-0 z-40 flex w-full items-center justify-between bg-background/80 backdrop-blur-xl ${className}`}
    >
      <Link href="/home" className="admin-brand flex min-w-0 items-center gap-2.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-800/10 bg-gradient-to-br from-red-700/10 to-amber-500/15 shadow-inner">
          <BookOpen width={22} height={22} className="text-custom-text" />
        </span>
        <SparklesTextDemo text={"LMS"} />
        <span className="text-xs font-semibold leading-tight text-custom-text sm:text-sm">
          วิทยาลัยอาชีวศึกษาอุดรธานี
        </span>
      </Link>
      <div className="flex shrink-0 items-center justify-center gap-1 sm:gap-3">
        <CommandDialogDemo />
        <SwitchTheme customClass={"hidden sm:block"} />
        {!session ? (
          <Link href="/login" className="flex items-center">
            <Button>Login</Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <NotificationBell />
            <NavAvatar session={session} />
          </div>
        )}
        <div className="ml-1 block lg:hidden">
          <AdminHamburgerMenu />
        </div>
      </div>
    </div>
  );
}
