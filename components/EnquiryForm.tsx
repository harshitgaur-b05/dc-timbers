"use client";
import { useState } from "react";

const projectTypes = [
  "Select a category...",
  "Fencing / Gravel Boards",
  "Bespoke Gates",
  "Decking & Joists",
  "General Building Timber",
  "Trellis & Panels",
  "Concrete Products",
  "Accessories / Fixings",
  "Trade Account Enquiry",
];

interface EnquiryFormProps {
  productName?: string;
}

export default function EnquiryForm({ productName }: EnquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    message: productName ? `Re: ${productName}\n\n` : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Please describe your requirements";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productName }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 border outline-none transition-all text-sm";
  const inputStyle = {
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-outline)",
    color: "var(--color-on-surface)",
    fontFamily: "var(--font-body)",
  };
  const focusStyle = "focus:ring-2";
  const labelStyle = {
    fontFamily: "var(--font-mono)",
    color: "var(--color-primary)",
    fontSize: "11px",
  };

  if (status === "success") {
    return (
      <div
        className="h-full flex flex-col items-center justify-center gap-4 py-16 text-center"
        style={{ color: "var(--color-primary)" }}
      >
        <span className="material-symbols-outlined text-5xl" style={{ color: "var(--color-warning-orange)" }}>
          check_circle
        </span>
        <h3 className="text-3xl font-black uppercase" style={{ fontFamily: "var(--font-headline)" }}>
          Enquiry Received!
        </h3>
        <p className="text-base opacity-70">
          Thanks — our yard team will respond within 24 hours.
        </p>
        <button
          onClick={() => { setStatus("idle"); setForm({ name: "", phone: "", email: "", projectType: "", message: "" }); }}
          className="mt-4 px-6 py-3 text-sm font-black uppercase border-2 transition-all hover:translate-x-0.5 hover:translate-y-0.5"
          style={{
            fontFamily: "var(--font-headline)",
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
          }}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-widest block" style={labelStyle}>Full Name *</label>
          <input
            type="text"
            className={`${inputClass} ${focusStyle}`}
            style={inputStyle}
            placeholder="John Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <span className="text-xs" style={{ color: "var(--color-error)" }}>{errors.name}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-widest block" style={labelStyle}>Phone Number *</label>
          <input
            type="tel"
            className={`${inputClass} ${focusStyle}`}
            style={inputStyle}
            placeholder="07123 456 789"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <span className="text-xs" style={{ color: "var(--color-error)" }}>{errors.phone}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="uppercase tracking-widest block" style={labelStyle}>Email Address *</label>
        <input
          type="email"
          className={`${inputClass} ${focusStyle}`}
          style={inputStyle}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <span className="text-xs" style={{ color: "var(--color-error)" }}>{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="uppercase tracking-widest block" style={labelStyle}>Project Type</label>
        <select
          className={`${inputClass} ${focusStyle}`}
          style={inputStyle}
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
        >
          {projectTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="uppercase tracking-widest block" style={labelStyle}>
          Your Requirements *
        </label>
        <textarea
          className={`${inputClass} ${focusStyle}`}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="e.g. 10x 6ft Closeboard panels, 12x 8ft Posts..."
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        {errors.message && <span className="text-xs" style={{ color: "var(--color-error)" }}>{errors.message}</span>}
      </div>

      {status === "error" && (
        <p className="text-sm" style={{ color: "var(--color-error)" }}>
          Something went wrong — please try again or call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 text-white font-black uppercase tracking-wide border-2 transition-all hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "18px",
          backgroundColor: "var(--color-warning-orange)",
          borderColor: "var(--color-primary)",
          boxShadow: "4px 4px 0px 0px rgba(50,34,20,1)",
        }}
      >
        {status === "loading" ? "Sending..." : "Submit Quote Request"}
      </button>
    </form>
  );
}
