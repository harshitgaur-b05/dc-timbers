import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | DCtimbers",
  description:
    "Learn how DCtimbers collects, uses, and protects your personal data in accordance with UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 px-8 max-w-4xl mx-auto w-full">
      {/* Breadcrumb */}
      <div
        className="text-xs uppercase tracking-widest mb-8"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}
      >
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--color-primary)" }}>Privacy Policy</span>
      </div>

      <h1
        className="text-5xl font-black uppercase mb-4"
        style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm opacity-60 mb-10" style={{ fontFamily: "var(--font-mono)" }}>
        Last updated: January 2025 · Compliant with UK GDPR
      </p>

      <div className="space-y-8 text-base leading-relaxed" style={{ color: "var(--color-on-surface)" }}>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            1. Who We Are
          </h2>
          <p className="opacity-80">
            DCtimbers (trading name of DC Timber & Fencing Ltd) is a timber and fencing supplier operating from depots in Northamptonshire and Warwickshire, England. We are the data controller responsible for your personal information collected via this website and through our business operations.
          </p>
          <p className="opacity-80 mt-2">
            Contact: <a href="mailto:sales@dctimbers.co.uk" className="underline font-bold" style={{ color: "var(--color-warning-orange)" }}>sales@dctimbers.co.uk</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            2. What Data We Collect
          </h2>
          <p className="opacity-80 mb-3">We may collect the following personal data:</p>
          <ul className="list-disc list-inside opacity-80 space-y-1 ml-2">
            <li><strong>Contact information:</strong> name, email address, phone number, business name</li>
            <li><strong>Enquiry details:</strong> project descriptions, quantities, and messages submitted via our contact form</li>
            <li><strong>Technical data:</strong> IP address, browser type, pages visited, and time spent on our site (collected via analytics)</li>
            <li><strong>Transaction data:</strong> purchase history and billing information for trade account customers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            3. How We Use Your Data
          </h2>
          <p className="opacity-80 mb-3">We use your data to:</p>
          <ul className="list-disc list-inside opacity-80 space-y-1 ml-2">
            <li>Respond to your product and pricing enquiries</li>
            <li>Process orders and manage trade accounts</li>
            <li>Send transactional emails (order confirmations, delivery updates)</li>
            <li>Improve the functionality and content of our website</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="opacity-80 mt-3">
            We do <strong>not</strong> sell your data to third parties or use it for unsolicited marketing without your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            4. Legal Basis for Processing
          </h2>
          <p className="opacity-80">
            We process your data on the following legal bases under UK GDPR: (a) <strong>Legitimate interests</strong> — responding to trade enquiries and improving our service; (b) <strong>Contractual necessity</strong> — fulfilling orders and managing trade accounts; (c) <strong>Legal obligation</strong> — retaining records as required by law; (d) <strong>Consent</strong> — for any marketing communications you have opted into.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            5. Data Retention
          </h2>
          <p className="opacity-80">
            Enquiry data is retained for up to 2 years from last contact. Transaction and account records are retained for 7 years in compliance with HMRC requirements. You may request deletion of your data at any time, subject to any legal retention obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            6. Your Rights
          </h2>
          <p className="opacity-80 mb-3">Under UK GDPR, you have the right to:</p>
          <ul className="list-disc list-inside opacity-80 space-y-1 ml-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li>Object to or restrict our processing of your data</li>
            <li>Data portability — receive your data in a machine-readable format</li>
            <li>Lodge a complaint with the ICO (Information Commissioner&apos;s Office) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--color-warning-orange)" }}>ico.org.uk</a></li>
          </ul>
          <p className="opacity-80 mt-3">
            To exercise any of these rights, email us at <a href="mailto:sales@dctimbers.co.uk" className="underline font-bold" style={{ color: "var(--color-warning-orange)" }}>sales@dctimbers.co.uk</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            7. Cookies
          </h2>
          <p className="opacity-80">
            This website uses essential cookies required for core functionality (e.g. authentication sessions). We may also use anonymised analytics cookies to understand how visitors use our site. No personal data is shared with third-party advertising networks. You can disable cookies in your browser settings, though this may affect site functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            8. Changes to This Policy
          </h2>
          <p className="opacity-80">
            We may update this privacy policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page. Continued use of our website after changes have been made constitutes acceptance of the revised policy.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t" style={{ borderColor: "rgba(128,117,109,0.2)" }}>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 text-white font-black uppercase text-sm border-2"
          style={{
            fontFamily: "var(--font-headline)",
            backgroundColor: "var(--color-warning-orange)",
            borderColor: "var(--color-primary)",
          }}
        >
          Privacy Questions? Contact Us
        </Link>
      </div>
    </div>
  );
}
