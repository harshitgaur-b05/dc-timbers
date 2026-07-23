import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us & Request a Quote | DCtimbers",
  description: "Contact our timber depots in Woodford Halse, Marton, and Warwick. Phone numbers, addresses, opening hours, and direct quote request form.",
};

const depots = [
  {
    name: "Woodford Halse Depot",
    address: "Old Station Yard, Station Rd, Woodford Halse, Northamptonshire, NN11 3RB",
    phone: "01327 262124",
    email: "sales@dctimbers.co.uk",
    map: "https://maps.google.com/?q=Old+Station+Yard+Station+Rd+Woodford+Halse+Northamptonshire+NN11+3RB",
  },
  {
    name: "Marton Depot",
    address: "The Old Garage, Coventry Rd, Marton, Warwickshire, CV23 9RH",
    phone: "01926 633739",
    email: "marton@dctimbers.co.uk",
    map: "https://maps.google.com/?q=The+Old+Garage+Coventry+Rd+Marton+Warwickshire+CV23+9RH",
  },
  {
    name: "Warwick Depot",
    address: "Unit 1, Park Farm, Banbury Road, Warwick, CV34 6ST",
    phone: "01926 353199",
    email: "warwick@dctimbers.co.uk",
    map: "https://maps.google.com/?q=Unit+1+Park+Farm+Banbury+Road+Warwick+CV34+6ST",
  },
];

export default function ContactPage() {
  return (
    <div className="py-12 px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1
          className="text-5xl font-black uppercase mb-3"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Contact &amp; Depot Network
        </h1>
        <p className="text-base opacity-80" style={{ color: "var(--color-on-surface-variant)" }}>
          Reach out to your local DCtimbers yard or submit a quote request online.
        </p>
      </div>

      {/* 3 Depot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {depots.map((d) => (
          <div
            key={d.name}
            className="p-6 border-2 flex flex-col justify-between"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-primary)",
            }}
          >
            <div>
              <div
                className="text-xs uppercase tracking-widest font-black mb-2"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}
              >
                Timber Yard
              </div>
              <h2
                className="text-2xl font-black uppercase mb-4"
                style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
              >
                {d.name}
              </h2>
              <p className="text-sm leading-relaxed mb-6 opacity-80" style={{ color: "var(--color-on-surface-variant)" }}>
                {d.address}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: "rgba(128,117,109,0.2)" }}>
              <a
                href={`tel:${d.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm font-bold hover:underline"
                style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
              >
                <span className="material-symbols-outlined text-base" style={{ color: "var(--color-warning-orange)" }}>
                  call
                </span>
                {d.phone}
              </a>
              <a
                href={`mailto:${d.email}`}
                className="flex items-center gap-2 text-sm opacity-80 hover:underline"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                <span className="material-symbols-outlined text-base" style={{ color: "var(--color-warning-orange)" }}>
                  mail
                </span>
                {d.email}
              </a>
              <a
                href={d.map}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-1 py-2 px-4 text-xs font-black uppercase border"
                style={{
                  fontFamily: "var(--font-mono)",
                  borderColor: "var(--color-primary)",
                  backgroundColor: "var(--color-surface-container)",
                  color: "var(--color-primary)",
                }}
              >
                Get Directions <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Main Enquiry Form */}
      <div
        className="p-10 border-2"
        style={{
          backgroundColor: "var(--color-surface-container-highest)",
          borderColor: "var(--color-primary)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-4xl font-black uppercase text-center mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            Send A Direct Yard Enquiry
          </h2>
          <p className="text-sm opacity-80 text-center mb-8">
            Provide your material list or project details for trade rates and delivery quotes.
          </p>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}
