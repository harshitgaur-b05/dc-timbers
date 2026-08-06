import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delivery Areas | DCtimbers",
  description:
    "Find out about DCtimbers delivery coverage across Northamptonshire, Warwickshire, and surrounding counties.",
};

const depots = [
  {
    name: "Woodford Halse Depot",
    address: "Old Station Yard, Station Rd, Woodford Halse, Northamptonshire, NN11 3RB",
    phone: "01327 262124",
    email: "sales@dctimbers.co.uk",
    map: "https://maps.google.com/?q=Old+Station+Yard+Station+Rd+Woodford+Halse+Northamptonshire+NN11+3RB",
    coverage: [
      "Northamptonshire",
      "South Warwickshire",
      "Oxfordshire (North)",
      "Buckinghamshire (North)",
      "Leicestershire (South)",
    ],
  },
  {
    name: "Marton Depot",
    address: "The Old Garage, Coventry Rd, Marton, Warwickshire, CV23 9RH",
    phone: "01926 633739",
    email: "marton@dctimbers.co.uk",
    map: "https://maps.google.com/?q=The+Old+Garage+Coventry+Rd+Marton+Warwickshire+CV23+9RH",
    coverage: [
      "Rugby & surrounds",
      "Coventry (South)",
      "Central Warwickshire",
      "Northamptonshire (West)",
    ],
  },
  {
    name: "Warwick Depot",
    address: "Unit 1, Park Farm, Banbury Road, Warwick, CV34 6ST",
    phone: "01926 353199",
    email: "warwick@dctimbers.co.uk",
    map: "https://maps.google.com/?q=Unit+1+Park+Farm+Banbury+Road+Warwick+CV34+6ST",
    coverage: [
      "Warwick & Leamington Spa",
      "Stratford-upon-Avon",
      "South Warwickshire",
      "Oxfordshire (North-West)",
    ],
  },
];

const faqs = [
  {
    q: "What is your standard delivery radius?",
    a: "We typically deliver within a 30-mile radius of each depot, covering the majority of Northamptonshire, Warwickshire, and surrounding counties. Deliveries outside this range may be possible — please call your nearest depot to discuss.",
  },
  {
    q: "How long does delivery take?",
    a: "Stock items are typically delivered within 2–5 working days. Made-to-order or bespoke items (such as custom gates) may take 7–14 working days depending on specification. You will be given an estimated delivery date when your order is confirmed.",
  },
  {
    q: "Can I collect from the depot?",
    a: "Yes — click & collect is available at all three depots. Simply place your order or call ahead, and our team will have your materials ready for loading when you arrive. A flatbed, trailer, or van is recommended for larger orders.",
  },
  {
    q: "Is there a minimum order for delivery?",
    a: "There is no strict minimum order, but delivery charges apply for orders under a certain value. Contact your local depot for current delivery charge information, as rates vary depending on volume and distance.",
  },
  {
    q: "Do you deliver to sites, not just addresses?",
    a: "Yes. We regularly deliver direct to building sites, agricultural properties, and rural locations. Please ensure adequate access for our vehicles (typically a flatbed truck) and that someone is on site to receive and sign for the delivery.",
  },
  {
    q: "Can I get a delivery quote?",
    a: "Absolutely. Use our contact form or call your nearest depot and we will provide a delivery quote based on your location, volume, and product type. Trade customers with accounts may have delivery included or discounted.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="py-16 px-8 max-w-5xl mx-auto w-full">
      {/* Breadcrumb */}
      <div
        className="text-xs uppercase tracking-widest mb-8"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}
      >
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--color-primary)" }}>Delivery Areas</span>
      </div>

      {/* Hero */}
      <h1
        className="text-5xl font-black uppercase mb-4"
        style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
      >
        Delivery Areas
      </h1>
      <p className="text-base opacity-75 mb-12 max-w-2xl" style={{ color: "var(--color-on-surface)" }}>
        DCtimbers delivers trade-grade timber and fencing materials direct to your site, yard, or home across the Midlands and surrounding counties. Delivery is available from all three of our depots.
      </p>

      {/* Depot coverage cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {depots.map((depot) => (
          <div
            key={depot.name}
            className="border-2 p-6 flex flex-col gap-4"
            style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-surface)" }}
          >
            <div>
              <span
                className="text-xs uppercase tracking-widest font-black block mb-1"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-warning-orange)" }}
              >
                Depot
              </span>
              <h2
                className="text-lg font-black uppercase"
                style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
              >
                {depot.name}
              </h2>
              <p className="text-xs opacity-60 mt-1" style={{ color: "var(--color-on-surface)" }}>
                {depot.address}
              </p>
            </div>

            <div>
              <p
                className="text-xs font-black uppercase tracking-wider mb-2"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}
              >
                Coverage Areas
              </p>
              <ul className="space-y-1">
                {depot.coverage.map((area) => (
                  <li key={area} className="text-sm flex items-center gap-2 opacity-80" style={{ color: "var(--color-on-surface)" }}>
                    <span style={{ color: "var(--color-warning-orange)" }}>✓</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-4 border-t" style={{ borderColor: "rgba(128,117,109,0.2)" }}>
              <a
                href={`tel:${depot.phone.replace(/\s/g, "")}`}
                className="text-sm font-bold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                📞 {depot.phone}
              </a>
              <a
                href={`mailto:${depot.email}`}
                className="text-sm font-bold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                ✉ {depot.email}
              </a>
              <a
                href={depot.map}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-wider font-black hover:underline mt-1"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-warning-orange)" }}
              >
                View on Map →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="mb-16">
        <h2
          className="text-3xl font-black uppercase mb-8"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Delivery FAQs
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border p-6"
              style={{ borderColor: "rgba(128,117,109,0.25)", backgroundColor: "var(--color-surface)" }}
            >
              <h3
                className="font-black uppercase text-base mb-2"
                style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
              >
                {faq.q}
              </h3>
              <p className="text-sm opacity-75 leading-relaxed" style={{ color: "var(--color-on-surface)" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="border-2 p-8 text-center"
        style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-surface-container)" }}
      >
        <h3
          className="text-2xl font-black uppercase mb-3"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Need a Delivery Quote?
        </h3>
        <p className="text-sm opacity-75 mb-6 max-w-xl mx-auto" style={{ color: "var(--color-on-surface)" }}>
          Contact your nearest depot directly or send us an enquiry and we&apos;ll get back to you with a delivery estimate and pricing.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 text-white font-black uppercase text-sm border-2"
          style={{
            fontFamily: "var(--font-headline)",
            backgroundColor: "var(--color-warning-orange)",
            borderColor: "var(--color-primary)",
          }}
        >
          Request a Delivery Quote
        </Link>
      </div>
    </div>
  );
}
