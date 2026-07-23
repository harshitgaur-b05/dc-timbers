import Link from "next/link";

const depots = [
  {
    name: "Woodford Halse",
    address: "Old Station Yard, Station Rd, Woodford Halse, Northamptonshire, NN11 3RB",
    phone: "01327 262124",
    email: "sales@dctimbers.co.uk",
    map: "https://maps.google.com/?q=Old+Station+Yard+Station+Rd+Woodford+Halse+Northamptonshire+NN11+3RB",
  },
  {
    name: "Marton",
    address: "The Old Garage, Coventry Rd, Marton, Warwickshire, CV23 9RH",
    phone: "01926 633739",
    email: "marton@dctimbers.co.uk",
    map: "https://maps.google.com/?q=The+Old+Garage+Coventry+Rd+Marton+Warwickshire+CV23+9RH",
  },
  {
    name: "Warwick",
    address: "Unit 1, Park Farm, Banbury Road, Warwick, CV34 6ST",
    phone: "01926 353199",
    email: "warwick@dctimbers.co.uk",
    map: "https://maps.google.com/?q=Unit+1+Park+Farm+Banbury+Road+Warwick+CV34+6ST",
  },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/products/gates", label: "Gates" },
  { href: "/products/fencing", label: "Fencing" },
  { href: "/products/timber-products", label: "Timber" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/delivery", label: "Delivery Areas" },
  { href: "/contact", label: "Enquiry Guide" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t-2"
      style={{
        backgroundColor: "var(--color-primary)",
        borderColor: "var(--color-outline)",
      }}
    >
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1 — Logo + description */}
        <div className="flex flex-col gap-4">
          <span
            className="text-2xl font-black uppercase tracking-tight"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-primary)" }}
          >
            DCtimbers
          </span>
          <p className="text-sm leading-relaxed opacity-75" style={{ color: "var(--color-on-primary)" }}>
            The regional leader in premium timber supply — fencing, decking,
            bespoke gates, and specialist landscaping products for trade and
            public customers.
          </p>
          <div
            className="inline-block px-3 py-1 text-xs font-black uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--color-warning-orange)",
              color: "var(--color-primary)",
            }}
          >
            Built for the Trade
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h3
            className="text-sm font-black uppercase tracking-widest mb-4 pb-2 border-b"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--color-secondary-fixed-dim)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm opacity-70 hover:opacity-100 hover:underline transition-opacity"
                  style={{ color: "var(--color-on-primary)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Depots */}
        <div>
          <h3
            className="text-sm font-black uppercase tracking-widest mb-4 pb-2 border-b"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--color-secondary-fixed-dim)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            Our Depots
          </h3>
          <div className="flex flex-col gap-5">
            {depots.map((d) => (
              <div key={d.name}>
                <p
                  className="text-xs font-black uppercase tracking-wider mb-1"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-warning-orange)",
                  }}
                >
                  {d.name}
                </p>
                <p className="text-xs opacity-70 leading-relaxed mb-1" style={{ color: "var(--color-on-primary)" }}>
                  {d.address}
                </p>
                <div className="flex gap-3 text-xs">
                  <a
                    href={`tel:${d.phone.replace(/\s/g, "")}`}
                    className="opacity-70 hover:opacity-100 hover:underline transition-opacity"
                    style={{ color: "var(--color-on-primary)" }}
                  >
                    {d.phone}
                  </a>
                  <span className="opacity-30" style={{ color: "var(--color-on-primary)" }}>|</span>
                  <a
                    href={d.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 hover:underline transition-opacity"
                    style={{ color: "var(--color-on-primary)" }}
                  >
                    Map →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 4 — Legal */}
        <div>
          <h3
            className="text-sm font-black uppercase tracking-widest mb-4 pb-2 border-b"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--color-secondary-fixed-dim)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            Legal
          </h3>
          <ul className="flex flex-col gap-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm opacity-70 hover:opacity-100 hover:underline transition-opacity"
                  style={{ color: "var(--color-on-primary)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-8 py-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <p className="text-xs opacity-50" style={{ color: "var(--color-on-primary)" }}>
          © {year} DCtimbers. All Rights Reserved.
        </p>
        <p
          className="text-xs opacity-40 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-on-primary)" }}
        >
          Est. 2024 · Built for the Trade
        </p>
      </div>
    </footer>
  );
}
