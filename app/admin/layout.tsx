import { redirect as nextRedirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Route protection
  if (!session) {
    nextRedirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
      {/* Sidebar */}
      <aside
        className="w-full md:w-64 border-b md:border-b-0 md:border-r p-6 flex flex-col justify-between"
        style={{
          backgroundColor: "var(--color-primary)",
          borderColor: "var(--color-outline)",
          color: "white",
        }}
      >
        <div>
          <div className="mb-8">
            <span
              className="text-xs uppercase tracking-widest font-black"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-warning-orange)" }}
            >
              Control Panel
            </span>
            <h2
              className="text-2xl font-black uppercase"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              DCtimbers Admin
            </h2>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/admin"
              className="px-4 py-3 rounded font-bold uppercase text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              Overview
            </Link>
            <Link
              href="/admin/enquiries"
              className="px-4 py-3 rounded font-bold uppercase text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              <span className="material-symbols-outlined text-lg">inbox</span>
              Customer Enquiries
            </Link>
            <Link
              href="/admin/blog"
              className="px-4 py-3 rounded font-bold uppercase text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              Blog &amp; Articles
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/20 flex flex-col gap-2">
          <span className="text-xs opacity-70 truncate">{session.email}</span>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-xs font-bold uppercase text-warning-orange hover:underline flex items-center gap-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
