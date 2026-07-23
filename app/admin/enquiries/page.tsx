"use client";
import { useEffect, useState } from "react";

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  projectType?: string;
  message?: string;
  productName?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus as any } : e))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-8 font-bold">Loading enquiries...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-4xl font-black uppercase"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Customer Enquiries
        </h1>
        <p className="text-sm opacity-70">
          Manage incoming trade and retail quote requests.
        </p>
      </div>

      <div
        className="border-2 p-6 overflow-x-auto"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-primary)",
        }}
      >
        {enquiries.length === 0 ? (
          <p className="text-sm opacity-70">No enquiries found.</p>
        ) : (
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr
                className="border-b text-xs uppercase"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-outline)",
                }}
              >
                <th className="py-3 px-2">Received</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Contact</th>
                <th className="py-3 px-2">Item / Type</th>
                <th className="py-3 px-2">Message</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr
                  key={e._id}
                  className="border-b last:border-0 hover:bg-surface-container-low transition-colors"
                >
                  <td className="py-4 px-2 text-xs opacity-70 whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleDateString("en-GB")}{" "}
                    {new Date(e.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 px-2 font-bold">{e.name}</td>
                  <td className="py-4 px-2 text-xs space-y-1">
                    <div>
                      <a href={`tel:${e.phone}`} className="hover:underline font-medium">
                        {e.phone}
                      </a>
                    </div>
                    <div className="opacity-70">
                      <a href={`mailto:${e.email}`} className="hover:underline">
                        {e.email}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-medium text-xs">
                    {e.productName ? (
                      <span className="font-bold text-primary">{e.productName}</span>
                    ) : (
                      e.projectType || "General"
                    )}
                  </td>
                  <td className="py-4 px-2 text-xs max-w-xs leading-relaxed opacity-90">
                    {e.message}
                  </td>
                  <td className="py-4 px-2">
                    <select
                      value={e.status}
                      onChange={(evt) => handleStatusChange(e._id, evt.target.value)}
                      className="px-2 py-1 text-xs font-bold uppercase border outline-none rounded cursor-pointer"
                      style={{
                        fontFamily: "var(--font-mono)",
                        backgroundColor:
                          e.status === "new"
                            ? "var(--color-warning-orange)"
                            : e.status === "contacted"
                            ? "var(--color-secondary-container)"
                            : "var(--color-surface-container-high)",
                        color: e.status === "new" ? "white" : "var(--color-primary)",
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
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
