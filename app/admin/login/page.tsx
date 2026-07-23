"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-surface-container-low)" }}
    >
      <div
        className="w-full max-w-md p-8 border-2 shadow-hard"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-primary)",
        }}
      >
        <div className="text-center mb-8">
          <span
            className="text-xs uppercase tracking-widest font-black"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}
          >
            DCtimbers Control Panel
          </span>
          <h1
            className="text-4xl font-black uppercase mt-1"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            Admin Sign In
          </h1>
        </div>

        {error && (
          <div
            className="p-3 mb-6 border text-sm font-medium"
            style={{
              backgroundColor: "var(--color-error-container)",
              borderColor: "var(--color-error)",
              color: "var(--color-on-error-container)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-xs uppercase tracking-wider font-black"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border outline-none text-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-outline)",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dctimbers.co.uk"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-xs uppercase tracking-wider font-black"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-primary)" }}
            >
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border outline-none text-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-outline)",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-white font-black uppercase tracking-wide border-2 mt-4 transition-all disabled:opacity-50"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "18px",
              backgroundColor: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              boxShadow: "4px 4px 0px 0px rgba(50,34,20,1)",
            }}
          >
            {loading ? "Signing In..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
