import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import { connectDB } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export const metadata: Metadata = {
  title: "DCtimbers | Premium Timber, Gates, Fencing & Decking Merchant",
  description:
    "DCtimbers supplies premium fencing, bespoke gates, decking and structural timber to trade and public across the Midlands. Three depots: Woodford Halse, Marton, Warwick.",
};

const trustItems = [
  { icon: "verified", title: "Quality Guaranteed", sub: "Hand-picked stock" },
  { icon: "engineering", title: "Expert Advice", sub: "Decades of experience" },
  { icon: "local_shipping", title: "Local Delivery", sub: "Prompt yard-to-site" },
  { icon: "payments", title: "Trade Prices", sub: "Competitive rates" },
];

const categoryCards = [
  {
    title: "Fencing & Gravel Boards",
    slug: "fencing",
    spec: "Treated / Various Sizes",
    desc: "Heavy-duty lap panels, featheredge, and gravel boards built for the British weather. Tanalith-E treated.",
    badge: "IN STOCK",
  },
  {
    title: "Bespoke Gates",
    slug: "gates",
    spec: "Custom Joinery",
    desc: "Custom-built driveway and garden gates. Pedestrian, driveway, and field gate ranges — made to measure.",
    badge: "MADE TO ORDER",
  },
  {
    title: "Timber Products",
    slug: "timber-products",
    spec: "Sawn & Planed",
    desc: "Posts, battens, boards and structural timber. C24 graded, pressure treated for maximum durability.",
    badge: "IN STOCK",
  },
];

const whyFeatures = [
  {
    icon: "task_alt",
    title: "C24 Graded Stock",
    desc: "All structural timber is pressure treated and graded for maximum durability.",
  },
  {
    icon: "person",
    title: "Personal Service",
    desc: "No call centres. Speak directly to the yard manager who knows your order.",
  },
  {
    icon: "inventory_2",
    title: "In-Stock Promise",
    desc: "We maintain deep inventory levels of the most common trade sizes and profiles.",
  },
  {
    icon: "history_edu",
    title: "Technical Support",
    desc: "From cut lists to material estimations, we help you get the job done right.",
  },
];

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DCtimbers",
  url: "https://www.dctimbers.co.uk",
  department: [
    {
      "@type": "LocalBusiness",
      name: "DCtimbers — Woodford Halse",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Old Station Yard, Station Rd",
        addressLocality: "Woodford Halse",
        addressRegion: "Northamptonshire",
        postalCode: "NN11 3RB",
        addressCountry: "GB",
      },
      telephone: "+441327262124",
      email: "sales@dctimbers.co.uk",
    },
    {
      "@type": "LocalBusiness",
      name: "DCtimbers — Marton",
      address: {
        "@type": "PostalAddress",
        streetAddress: "The Old Garage, Coventry Rd",
        addressLocality: "Marton",
        addressRegion: "Warwickshire",
        postalCode: "CV23 9RH",
        addressCountry: "GB",
      },
      telephone: "+441926633739",
      email: "marton@dctimbers.co.uk",
    },
    {
      "@type": "LocalBusiness",
      name: "DCtimbers — Warwick",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit 1, Park Farm, Banbury Road",
        addressLocality: "Warwick",
        addressRegion: "Warwickshire",
        postalCode: "CV34 6ST",
        addressCountry: "GB",
      },
      telephone: "+441926353199",
      email: "warwick@dctimbers.co.uk",
    },
  ],
};

export default async function HomePage() {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  const heroImage = settings?.heroBannerImage || "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden blueprint-grid"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
      >
        {/* Dark overlay bg */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: heroImage
              ? `linear-gradient(135deg, rgba(50,34,20,0.85) 0%, rgba(50,34,20,0.6) 60%, rgba(50,34,20,0.3) 100%), url(${heroImage})`
              : "linear-gradient(135deg, rgba(50,34,20,0.85) 0%, rgba(50,34,20,0.6) 60%, rgba(50,34,20,0.3) 100%)",
          }}
        />

        {/* Decorative measurement lines */}
        <div className="absolute bottom-10 right-10 hidden lg:flex flex-col items-end opacity-30 gap-1">
          {["C24 GRADED", "TANALITH-E TREATED", "FSC CERTIFIED"].map((l) => (
            <div key={l} className="flex items-center gap-2">
              <div className="h-px bg-white" style={{ width: `${60 + l.length * 2}px` }} />
              <span
                className="text-white text-[10px] uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20">
          <div
            className="max-w-2xl p-6 sm:p-10 border-2 backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255,248,245,0.92)",
              borderColor: "var(--color-primary)",
              boxShadow: "6px 6px 0px 0px rgba(50,34,20,1)",
            }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span
                className="text-xs uppercase tracking-widest font-black"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-secondary)",
                }}
              >
                Est. 2024
              </span>
              <div
                className="h-px w-12 opacity-40"
                style={{ backgroundColor: "var(--color-outline)" }}
              />
            </div>

            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-tight sm:leading-none mb-4 sm:mb-5"
              style={{
                fontFamily: "var(--font-headline)",
                color: "var(--color-primary)",
              }}
            >
              Premium Timber,
              <br />
              Professional Grade.
              <br />
              Built to Last.
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Supplying trade and public customers with high-quality fencing,
              gates, and decking across Woodford Halse, Marton, and Warwick.
              Get a quote today from your local timber specialists.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-white font-black uppercase tracking-wide border-2 shadow-hard hover:shadow-none transition-all"
                style={{
                  fontFamily: "var(--font-headline)",
                  backgroundColor: "var(--color-warning-orange)",
                  borderColor: "var(--color-primary)",
                }}
              >
                Request a Quote
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 font-black uppercase tracking-wide border-2 transition-colors"
                style={{
                  fontFamily: "var(--font-headline)",
                  color: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                }}
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <section
        className="py-6 border-y-2"
        style={{
          backgroundColor: "var(--color-primary)",
          borderColor: "var(--color-outline)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {trustItems.map((t) => (
            <div key={t.title} className="flex items-center gap-3 sm:gap-4">
              <span
                className="material-symbols-outlined text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "var(--color-secondary-fixed-dim)" }}
              >
                {t.icon}
              </span>
              <div>
                <p
                  className="text-xs sm:text-sm font-black uppercase leading-tight text-white"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  {t.title}
                </p>
                <p
                  className="text-[11px] sm:text-xs opacity-70 text-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPECIALIST INVENTORY ──────────────────────────────────────── */}
      <section
        className="py-12 sm:py-20"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 flex items-end justify-between">
            <div>
              <h2
                className="text-2xl sm:text-4xl font-black uppercase"
                style={{
                  fontFamily: "var(--font-headline)",
                  color: "var(--color-primary)",
                }}
              >
                Specialist Inventory
              </h2>
              <div
                className="w-20 h-1 mt-2"
                style={{ backgroundColor: "var(--color-warning-orange)" }}
              />
            </div>
            <span
              className="hidden md:block text-xs uppercase tracking-widest opacity-50"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-outline)",
              }}
            >
              Catalogue Vol. 01 / 2024
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((card) => (
              <Link
                key={card.slug}
                href={`/products/${card.slug}`}
                className="group flex flex-col border-2 transition-all duration-500"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-primary)",
                }}
              >
                {/* Image area */}
                <div
                  className="h-64 border-b-2 relative overflow-hidden blueprint-grid flex items-center justify-center"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  <span
                    className="material-symbols-outlined opacity-10 text-9xl group-hover:scale-110 transition-transform duration-500"
                    style={{ color: "var(--color-primary)" }}
                  >
                    forest
                  </span>
                  {/* Stock badge */}
                  <div
                    className="absolute top-4 left-4 notched-tag px-3 py-1 text-white text-xs font-black uppercase tracking-widest"
                    style={{
                      fontFamily: "var(--font-mono)",
                      backgroundColor: "var(--color-primary)",
                    }}
                  >
                    {card.badge}
                  </div>
                </div>

                <div className="p-6 flex-1">
                  <h3
                    className="text-2xl font-black uppercase mb-3"
                    style={{
                      fontFamily: "var(--font-headline)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {card.desc}
                  </p>
                </div>

                <div
                  className="px-6 py-4 border-t flex justify-between items-center"
                  style={{
                    backgroundColor: "var(--color-surface-container)",
                    borderColor: "rgba(128,117,109,0.2)",
                  }}
                >
                  <span
                    className="text-xs uppercase tracking-wider font-black"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-secondary)",
                    }}
                  >
                    Spec: {card.spec}
                  </span>
                  <span
                    className="text-sm uppercase font-bold flex items-center gap-1 group-hover:underline"
                    style={{
                      fontFamily: "var(--font-headline)",
                      color: "var(--color-primary)",
                    }}
                  >
                    Learn More{" "}
                    <span className="material-symbols-outlined text-sm">
                      open_in_new
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-20 border-y-2" style={{ borderColor: "rgba(128,117,109,0.2)" }}>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div
              className="border-2 absolute -inset-3 rotate-1 -z-10"
              style={{
                backgroundColor: "var(--color-surface-container-high)",
                borderColor: "var(--color-primary)",
              }}
            />
            <div
              className="border-2 h-[500px] blueprint-grid flex items-center justify-center overflow-hidden"
              style={{ borderColor: "var(--color-primary)" }}
            >
              <span
                className="material-symbols-outlined opacity-20"
                style={{ color: "var(--color-primary)", fontSize: "160px" }}
              >
                hardware
              </span>
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-6">
            <h2
              className="text-5xl font-black uppercase leading-none"
              style={{
                fontFamily: "var(--font-headline)",
                color: "var(--color-primary)",
              }}
            >
              Built on Reliability &amp; Quality
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              DCtimbers isn&apos;t just a supplier — we&apos;re your project partner. We
              understand that in the trade, time is money and quality is your
              reputation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyFeatures.map((f) => (
                <div
                  key={f.title}
                  className="p-4 border"
                  style={{
                    borderColor: "rgba(128,117,109,0.2)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-3xl mb-2 block"
                    style={{ color: "var(--color-warning-orange)" }}
                  >
                    {f.icon}
                  </span>
                  <h4
                    className="text-base font-black uppercase mb-1"
                    style={{
                      fontFamily: "var(--font-headline)",
                      color: "var(--color-on-surface)",
                    }}
                  >
                    {f.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "200px", color: "white", fontVariationSettings: "'FILL' 1" }}
          >
            format_quote
          </span>
        </div>
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <div
            className="inline-block px-4 py-1 text-xs font-black uppercase tracking-widest mb-6"
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--color-warning-orange)",
              color: "var(--color-primary)",
            }}
          >
            Professional Standards
          </div>
          <blockquote
            className="text-3xl font-bold italic mb-6 leading-tight text-white"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            &ldquo;The integrity of a build starts with the grain of the timber.
            We source only the highest grade redwood and whitewood, ensuring
            every post, panel, and joist we supply meets the rigorous demands
            of professional landscaping and construction.&rdquo;
          </blockquote>
          <div className="w-12 h-px bg-white/40 mx-auto mb-4" />
          <cite
            className="not-italic text-sm uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-secondary-fixed-dim)",
            }}
          >
            Director, DCtimbers
          </cite>
        </div>
      </section>

      {/* ── ENQUIRY FORM ─────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--color-surface-container-highest)" }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div
            className="border-2 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            {/* Left panel */}
            <div
              className="p-10 flex flex-col justify-center"
              style={{ backgroundColor: "var(--color-primary)", color: "white" }}
            >
              <h2
                className="text-5xl font-black uppercase mb-4"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Start Your Enquiry
              </h2>
              <p className="text-lg opacity-80 mb-8 leading-relaxed">
                Looking for a specific cut list or trade pricing? Send us your
                requirements and our yard team will get back within 24 hours.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--color-warning-orange)" }}
                  >
                    call
                  </span>
                  <a
                    href="tel:01327262124"
                    className="font-bold hover:underline"
                    style={{ fontFamily: "var(--font-headline)" }}
                  >
                    01327 262124 (Woodford Halse)
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--color-warning-orange)" }}
                  >
                    location_on
                  </span>
                  <span className="text-sm opacity-80">
                    3 depots across Northamptonshire &amp; Warwickshire
                  </span>
                </div>
              </div>
            </div>

            {/* Right panel — form */}
            <div className="p-10">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
