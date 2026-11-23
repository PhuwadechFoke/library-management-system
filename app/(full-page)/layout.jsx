import Navbar from "@/components/frontend/navbar/Navbar";

// app/(front-end)/login/layout.js
export default function Layout({ children }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-28 h-80 w-80 rounded-full bg-red-700/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <Navbar className="mx-auto max-w-[1600px] border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6" />
      <main className="relative z-10 min-h-[calc(100vh-4.5rem)]">{children}</main>
    </div>
  );
}
