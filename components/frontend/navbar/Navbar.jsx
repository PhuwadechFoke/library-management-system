import React from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import HamburgerMenu from "./HamburgerMenu";
import { NavAvatar } from "./NavAvatar";
import NotificationBell from "./NotificationBell";
import SwitchTheme from "@/components/SwitchTheme";
import LanguageSwitcher from "@/components/frontend/LanguageSwitcher";
import { SparklesTextDemo } from "../SparklesTextDemo";
import { CommandDialogDemo } from "../CommandDialogDemo";
import { Button } from "@/components/ui/button";
import LocalizedText from "@/components/frontend/LocalizedText";

export default async function Navbar({ className }) {
  const session = await getServerSession(authOptions);

  return (
    <div
      className={`sticky top-0 z-40 flex w-full items-center justify-between bg-background/80 backdrop-blur-xl ${className}`}
    >
      <Link href="/home" className="flex min-w-0 items-center gap-2.5">
        <BookOpen width={24} height={24} className="shrink-0 text-custom-text" />
        <SparklesTextDemo text={"LMS"} />
        <span className="text-xs font-semibold leading-tight text-custom-text sm:text-sm">
          วิทยาลัยอาชีวศึกษาอุดรธานี
        </span>
      </Link>
    <div className="flex shrink-0 items-center justify-center gap-1 sm:gap-3">
        <CommandDialogDemo />
        <LanguageSwitcher customClass={"hidden sm:block"} />
        <SwitchTheme customClass={"hidden sm:block"} />
        {!session ? (
          <Link href="/login" className="flex items-center">
            <Button><LocalizedText value="auth.login" /></Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <NotificationBell />
            <NavAvatar session={session} />
          </div>
        )}
        <div className="ml-1 block lg:hidden">
          <HamburgerMenu />
        </div>
      </div>
    </div>
  );
}
