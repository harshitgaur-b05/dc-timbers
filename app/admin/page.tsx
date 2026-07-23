import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import BlogPost from "@/models/BlogPost";
import Product from "@/models/Product";

export default async function AdminDashboardPage() {
  await connectDB();
  const totalEnquiries = await Enquiry.countDocuments();
  const newEnquiries = await Enquiry.countDocuments({ status: "new" });
  const totalPosts = await BlogPost.countDocuments();
  const totalProducts = await Product.countDocuments();

  const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5).lean();

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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 border-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
          <span className="text-xs font-black uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}>
            New Enquiries
          </span>
          <span className="text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-warning-orange)" }}>
            {newEnquiries}
          </span>
        </div>

        <div className="p-6 border-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
          <span className="text-xs font-black uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}>
            Total Enquiries
          </span>
          <span className="text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            {totalEnquiries}
          </span>
        </div>

        <div className="p-6 border-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
          <span className="text-xs font-black uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}>
            Blog Articles
          </span>
          <span className="text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            {totalPosts}
          </span>
        </div>

        <div className="p-6 border-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
          <span className="text-xs font-black uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}>
            Active Products
          </span>
          <span className="text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            {totalProducts}
          </span>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="border-2 p-6" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            Recent Customer Enquiries
          </h2>
          <Link href="/admin/enquiries" className="text-xs font-bold uppercase hover:underline" style={{ fontFamily: "var(--font-mono)", color: "var(--color-warning-orange)" }}>
            View All ({totalEnquiries}) →
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
                <tr key={e._id.toString()} className="border-b last:border-0">
                  <td className="py-3 text-xs opacity-70">{new Date(e.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-3 font-bold">{e.name}</td>
                  <td className="py-3">{e.phone}</td>
                  <td className="py-3">{e.productName || e.projectType || "General"}</td>
                  <td className="py-3">
                    <span
                      className="px-2 py-1 text-xs font-bold uppercase rounded"
                      style={{
                        fontFamily: "var(--font-mono)",
                        backgroundColor: e.status === "new" ? "var(--color-warning-orange)" : "var(--color-surface-container-high)",
                        color: e.status === "new" ? "white" : "var(--color-primary)",
                      }}
                    >
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
