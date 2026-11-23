"use client";
import CategorySidebar from "@/components/frontend/CategorySidebar";
import Sidebar from "@/components/frontend/Sidebar";
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="w-full">
      <div className="grid w-full min-w-0 gap-5 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
        <aside className="relative hidden lg:block">
          <Sidebar />
        </aside>
        <main className="min-w-0">{children}</main>
        <aside className="relative hidden lg:block">
          <CategorySidebar />
        </aside>
      </div>
    </div>
  );
}
