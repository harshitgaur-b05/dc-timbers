import Link from "next/link";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import BlogPost from "@/models/BlogPost";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let totalEnquiries = 0, newEnquiries = 0, totalPosts = 0, totalProducts = 0;
  let recentEnquiries: any[] = [];

  try {
    const conn = await connectDB();
    if (conn) {
      [totalEnquiries, newEnquiries, totalPosts, totalProducts] = await Promise.all([
        Enquiry.countDocuments(),
        Enquiry.countDocuments({ status: "new" }),
        BlogPost.countDocuments(),
        Product.countDocuments(),
      ]);
      const raw = await Enquiry.find().sort({ createdAt: -1 }).limit(5).lean();
      recentEnquiries = JSON.parse(JSON.stringify(raw));
    }
  } catch (e) {
    console.error("[AdminDashboard] DB error:", e);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-4xl font-black uppercase"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Yard Overview
        </h1>
        <p className="text-sm opacity-70">Welcome to the DCtimbers administration dashboard.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "New Enquiries", value: newEnquiries, accent: true },
          { label: "Total Enquiries", value: totalEnquiries },
          { label: "Blog Articles", value: totalPosts },
          { label: "Active Products", value: totalProducts },
        ].map(({ label, value, accent }) => (
          <div key={label} className="p-6 border-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
            <span className="text-xs font-black uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}>
              {label}
            </span>
            <span className="text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: accent ? "var(--color-warning-orange)" : "var(--color-primary)" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { href: "/admin/products/new", icon: "add_box", label: "Add New Product", color: "bg-amber-600" },
          { href: "/admin/products", icon: "inventory_2", label: "Manage Products", color: "bg-stone-700" },
          { href: "/admin/enquiries", icon: "inbox", label: "View Enquiries", color: "bg-stone-700" },
        ].map(({ href, icon, label, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-5 py-4 ${color} text-white font-bold text-sm uppercase tracking-wide rounded-lg hover:opacity-90 transition-all`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Recent Enquiries */}
      <div className="border-2 p-6" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            Recent Customer Enquiries
          </h2>
          <Link href="/admin/enquiries" className="text-xs font-bold uppercase hover:underline" style={{ fontFamily: "var(--font-mono)", color: "var(--color-warning-orange)" }}>
            View All →
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-sm opacity-70">No enquiries received yet.</p>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-xs uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}>
                <th className="py-2">Date</th>
                <th className="py-2">Name</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Product / Type</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.map((e: any) => (
                <tr key={e._id} className="border-b last:border-0">
                  <td className="py-3 text-xs opacity-70">{new Date(e.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-3 font-bold">{e.name}</td>
                  <td className="py-3">{e.phone}</td>
                  <td className="py-3">{e.productName || e.projectType || "General"}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs font-bold uppercase" style={{ fontFamily: "var(--font-mono)", backgroundColor: e.status === "new" ? "var(--color-warning-orange)" : "var(--color-surface-container-high)", color: e.status === "new" ? "white" : "var(--color-primary)" }}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
