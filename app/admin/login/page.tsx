"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#1e130c] text-white px-4 py-12"
      style={{ width: "100%", minHeight: "100vh" }}
    >
      <div
        className="w-full bg-[#2a1c13] border-2 border-amber-900/60 p-8 shadow-2xl rounded-lg"
        style={{ width: "100%", maxWidth: "450px", boxSizing: "border-box" }}
      >
        {/* Brand / Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative h-14 w-14 mb-3">
            <Image
              src="/logo.jpeg"
              alt="DCtimbers Logo"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <span
            className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold"
          >
            DCtimbers Control Panel
          </span>
          <h1
            className="text-3xl font-black uppercase text-white mt-1"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Admin Sign In
          </h1>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-semibold rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-amber-200">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-[#180e08] border border-amber-900/60 text-white rounded outline-none focus:border-amber-400 text-sm transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dctimbers.co.uk"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-amber-200">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-[#180e08] border border-amber-900/60 text-white rounded outline-none focus:border-amber-400 text-sm transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black uppercase tracking-wider text-sm rounded transition-all shadow-md active:scale-95 disabled:opacity-50"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-amber-900/40 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline flex items-center justify-center gap-1"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
