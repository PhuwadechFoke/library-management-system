import AdminSidebar from "@/components/backoffice/AdminSidebar";
import AdminNavbar from "@/components/backoffice/navbar/AdminNavbar";

export default function Layout({ children }) {
  return (
    <div className="admin-shell relative isolate min-h-screen">
      <AdminNavbar className="admin-navbar mx-auto max-w-[1600px] border-b border-border/70 px-4 py-3 sm:px-6" />
      <div className="mx-auto mt-5 max-w-[1600px] px-3 pb-8 sm:px-6">
        <div className="admin-panel grid w-full min-w-0 gap-4 rounded-3xl border border-border/70 bg-card/65 p-3 shadow-xl shadow-zinc-900/5 backdrop-blur-sm sm:p-4 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-5">
          <aside className="relative hidden lg:block">
            <AdminSidebar />
          </aside>
          <main className="admin-content min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
