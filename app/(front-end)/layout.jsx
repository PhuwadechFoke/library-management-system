// components/Layout.jsx
import Navbar from "@/components/frontend/navbar/Navbar";
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="relative isolate min-h-screen">
      <Navbar className="mx-auto max-w-[1600px] border-b border-border/70 px-4 py-3 sm:px-6" />
      <main className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6 sm:py-6">
        <div className="min-w-0">{children}</div>
      </main>
    </div>
  );
}
