"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/products/gates", label: "Gates" },
  { href: "/products/fencing", label: "Fencing" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="w-full top-0 sticky z-50 border-b"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "rgba(128,117,109,0.2)",
      }}
    >
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        {/* Logo / Wordmark */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/logo.png"
              alt="DCtimbers Logo"
              fill
              className="object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <span
            className="text-2xl font-black tracking-tight uppercase leading-none"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--color-primary)",
            }}
          >
            DCtimbers
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-medium transition-colors duration-200 hover:text-[var(--color-secondary)]"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-6 py-2 text-white text-sm font-black uppercase tracking-wide border-2 transition-all active:scale-95"
            style={{
              fontFamily: "var(--font-headline)",
              backgroundColor: "var(--color-warning-orange)",
              borderColor: "var(--color-primary)",
            }}
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          style={{ color: "var(--color-primary)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-8 py-6 flex flex-col gap-4"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "rgba(128,117,109,0.2)",
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-medium py-2 border-b"
              style={{
                color: "var(--color-on-surface-variant)",
                borderColor: "rgba(128,117,109,0.15)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 text-center px-6 py-3 text-white font-black uppercase tracking-wide border-2"
            style={{
              fontFamily: "var(--font-headline)",
              backgroundColor: "var(--color-warning-orange)",
              borderColor: "var(--color-primary)",
            }}
            onClick={() => setMobileOpen(false)}
          >
            Get Quote
          </Link>
        </div>
      )}
    </header>
  );
}
