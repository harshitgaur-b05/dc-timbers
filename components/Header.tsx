"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SubCategoryItem {
  label: string;
  href: string;
}

interface CategoryNav {
  label: string;
  href: string;
  isClearance?: boolean;
  subcategories?: SubCategoryItem[];
}

const mainNavigation: CategoryNav[] = [
  {
    label: "Fencing",
    href: "/products/fencing",
    subcategories: [
      { label: "Fence Panels", href: "/products/fencing?subcategory=Fence+Panels" },
      { label: "Fence Posts", href: "/products/fencing?subcategory=Fence+Posts" },
      { label: "Gravel Boards", href: "/products/fencing?subcategory=Gravel+Boards" },
      { label: "Trellis & Lattice", href: "/products/fencing?subcategory=Trellis" },
      { label: "Fencing Accessories", href: "/products/fencing?subcategory=Fencing+Accessories" },
    ],
  },
  {
    label: "Gates",
    href: "/products/gates",
    subcategories: [
      { label: "Pedestrian Gates", href: "/products/gates?subcategory=Pedestrian+Gates" },
      { label: "Driveway & Estate Gates", href: "/products/gates?subcategory=Driveway+%26+Estate+Gates" },
      { label: "Field Gates", href: "/products/gates?subcategory=Field+Gates" },
      { label: "Gate Posts & Ironmongery", href: "/products/gates?subcategory=Gate+Posts+%26+Ironmongery" },
    ],
  },
  {
    label: "Decking",
    href: "/products/decking",
    subcategories: [
      { label: "Timber Decking Boards", href: "/products/decking?subcategory=Timber+Decking+Boards" },
      { label: "Composite Decking", href: "/products/decking?subcategory=Composite+Decking" },
      { label: "Decking Framework & Joists", href: "/products/decking?subcategory=Decking+Framework" },
      { label: "Decking Accessories", href: "/products/decking?subcategory=Decking+Accessories" },
    ],
  },
  {
    label: "Timber Products",
    href: "/products/timber-products",
    subcategories: [
      { label: "Sleepers", href: "/products/timber-products?subcategory=Sleepers" },
      { label: "Structural & C24 Timber", href: "/products/timber-products?subcategory=Structural+Timber" },
      { label: "Cladding & Matchboarding", href: "/products/timber-products?subcategory=Cladding" },
      { label: "Carcassing & Sawn Timber", href: "/products/timber-products?subcategory=Carcassing" },
      { label: "Sheet Materials", href: "/products/timber-products?subcategory=Sheet+Materials" },
    ],
  },
  {
    label: "Concrete Products",
    href: "/products/concrete-products",
    subcategories: [
      { label: "Concrete Posts", href: "/products/concrete-products?subcategory=Concrete+Posts" },
      { label: "Concrete Gravel Boards", href: "/products/concrete-products?subcategory=Concrete+Gravel+Boards" },
      { label: "Concrete Accessories", href: "/products/concrete-products?subcategory=Concrete+Accessories" },
    ],
  },
  {
    label: "Accessories",
    href: "/products/accessories",
    subcategories: [
      { label: "Fixings & Fasteners", href: "/products/accessories?subcategory=Fixings+%26+Fasteners" },
      { label: "Preservatives & Stains", href: "/products/accessories?subcategory=Preservatives" },
      { label: "Tools & Hardware", href: "/products/accessories?subcategory=Tools" },
      { label: "Security & Locks", href: "/products/accessories?subcategory=Locks" },
    ],
  },
  {
    label: "Clearance",
    href: "/products/clearance",
    isClearance: true,
  },
  {
    label: "More",
    href: "/products",
    subcategories: [
      { label: "Agricultural & Equestrian", href: "/products?category=Agricultural" },
      { label: "Garden Structures", href: "/products?category=Garden+Structures" },
      { label: "Custom Joinery", href: "/products?category=Custom+Timber" },
      { label: "Trade Depots & Delivery", href: "/contact" },
      { label: "Blog & Advice", href: "/blog" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <header className="w-full top-0 sticky z-50 bg-[#251810] text-amber-50 border-b border-amber-950/80 shadow-lg">
      {/* ── TOP UTILITY & BRAND BAR ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 border-b border-amber-900/30">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.jpeg"
              alt="DCtimbers Logo"
              fill
              className="object-contain rounded-sm"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span
              className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-none text-white group-hover:text-amber-400 transition-colors"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              DCtimbers
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-amber-400/90 font-semibold hidden sm:inline">
              Timber &amp; Fencing Merchants
            </span>
          </div>
        </Link>

        {/* Quick Contact & Quote CTA */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono">
              Depot Sales Helpline
            </span>
            <a
              href="tel:01327262124"
              className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 justify-end"
            >
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              01327 262124
            </a>
          </div>

          <Link
            href="/contact"
            className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all rounded-xs shadow-md active:scale-95 flex items-center gap-2 border border-amber-300"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            <span>Get Quote</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-md text-amber-100 hover:text-white hover:bg-amber-900/60 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── DESKTOP CATEGORY NAVIGATION BAR WITH UNDERLINE & FLYOUT DROPDOWNS ────────── */}
      <nav className="hidden md:block bg-[#1c120c] border-b border-amber-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-1 lg:gap-3 text-sm font-bold uppercase tracking-wider">
            {mainNavigation.map((item) => {
              const hasSubs = item.subcategories && item.subcategories.length > 0;
              const isHovered = activeDropdown === item.label;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <li
                  key={item.label}
                  className="relative group py-2.5"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`relative px-3 py-1.5 transition-all flex items-center gap-1.5 rounded-xs ${
                      item.isClearance
                        ? "text-red-400 hover:text-red-300 font-extrabold"
                        : isActive || isHovered
                        ? "text-amber-300"
                        : "text-stone-300 hover:text-amber-200"
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasSubs && (
                      <span className="text-xs transition-transform duration-200 opacity-80">
                        {isHovered ? "∧" : "∨"}
                      </span>
                    )}

                    {/* Active Underline Highlight Bar */}
                    {(isActive || isHovered) && (
                      <span
                        className={`absolute bottom-0 left-3 right-3 h-[2px] transition-all duration-300 ${
                          item.isClearance ? "bg-red-500" : "bg-amber-400"
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu Styled in Timber Theme with Nested Flyouts */}
                  {hasSubs && isHovered && (
                    <div
                      className="absolute left-0 top-full z-50 w-72 bg-[#1d140e] border border-amber-900/60 rounded-md shadow-2xl py-2 animate-fadeIn"
                      style={{
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <div className="px-4 py-2 border-b border-amber-900/40 mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                          {item.label} Range
                        </span>
                        <span className="text-[10px] text-stone-400 font-normal">Select subcategory</span>
                      </div>

                      {item.subcategories!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="flex items-center justify-between px-4 py-2.5 text-stone-200 hover:text-amber-300 hover:bg-amber-950/70 text-xs font-semibold tracking-wide transition-all border-l-2 border-transparent hover:border-amber-400 group/sub"
                        >
                          <span>{sub.label}</span>
                          <span className="text-stone-500 group-hover/sub:text-amber-400 group-hover/sub:translate-x-0.5 transition-all text-xs font-mono">
                            ›
                          </span>
                        </Link>
                      ))}

                      <div className="mt-1 pt-2 border-t border-amber-900/40 px-4 py-1.5 bg-[#170e0a]">
                        <Link
                          href={item.href}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center justify-between uppercase tracking-wider"
                        >
                          <span>Explore All {item.label}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ── MOBILE ACCORDION DRAWER NAVIGATION ───────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xs sm:max-w-sm ml-auto h-full bg-[#1c120c] text-white flex flex-col shadow-2xl overflow-hidden border-l border-amber-950">
            {/* Mobile Drawer Header */}
            <div className="p-4 border-b border-amber-900/50 flex items-center justify-between bg-[#150d08]">
              <div className="flex items-center gap-2.5">
                <div className="relative h-7 w-7">
                  <Image src="/logo.jpeg" alt="DCtimbers" fill className="object-contain rounded-xs" />
                </div>
                <span
                  className="font-black text-lg text-white uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  DCtimbers Menu
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-amber-900/40"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Phone Helpline Banner inside Drawer */}
            <div className="px-4 py-2.5 bg-amber-950 border-b border-amber-900/40 text-xs font-semibold flex items-center justify-between text-amber-200">
              <span>Depot Helpline:</span>
              <a href="tel:01327262124" className="text-amber-400 underline font-bold">
                01327 262124
              </a>
            </div>

            {/* Scrollable Category Accordions */}
            <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-amber-950/60">
              {mainNavigation.map((item) => {
                const hasSubs = item.subcategories && item.subcategories.length > 0;
                const isExpanded = openMobileSub === item.label;

                return (
                  <div key={item.label} className="py-2.5">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-base font-bold transition-colors ${
                          item.isClearance ? "text-red-400" : "text-stone-100 hover:text-amber-400"
                        }`}
                      >
                        {item.label}
                      </Link>

                      {hasSubs && (
                        <button
                          onClick={() => setOpenMobileSub(isExpanded ? null : item.label)}
                          className="p-2 text-stone-400 hover:text-amber-400"
                          aria-label={`Toggle ${item.label}`}
                        >
                          <span className={`inline-block transition-transform duration-200 ${isExpanded ? "rotate-180 text-amber-400" : ""}`}>
                            ∨
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Subcategories Accordion Content */}
                    {hasSubs && isExpanded && (
                      <div className="mt-2 ml-3 pl-3 border-l-2 border-amber-500/40 flex flex-col gap-1.5 py-2 bg-[#140b07] rounded-r-md">
                        {item.subcategories!.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-xs font-medium text-stone-300 hover:text-amber-300 py-1.5 px-2 rounded hover:bg-amber-950/60 flex items-center justify-between"
                          >
                            <span>{sub.label}</span>
                            <span className="text-stone-500 text-[10px]">›</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Footer CTAs */}
            <div className="p-4 border-t border-amber-900/50 bg-[#120a06] flex flex-col gap-2">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider text-amber-950 bg-amber-400 hover:bg-amber-300 rounded shadow-md"
              >
                Request a Quote
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-stone-400 hover:text-white"
              >
                Full Product Catalogue
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
