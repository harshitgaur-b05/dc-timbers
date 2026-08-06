import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | DCtimbers",
  description:
    "Read the terms and conditions governing the use of DCtimbers products and services.",
};

export default function TermsPage() {
  return (
    <div className="py-16 px-8 max-w-4xl mx-auto w-full">
      {/* Breadcrumb */}
      <div
        className="text-xs uppercase tracking-widest mb-8"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}
      >
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span style={{ color: "var(--color-primary)" }}>Terms of Service</span>
      </div>

      <h1
        className="text-5xl font-black uppercase mb-4"
        style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
      >
        Terms of Service
      </h1>
      <p className="text-sm opacity-60 mb-10" style={{ fontFamily: "var(--font-mono)" }}>
        Last updated: January 2025
      </p>

      <div className="prose prose-stone max-w-none space-y-8 text-base leading-relaxed" style={{ color: "var(--color-on-surface)" }}>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            1. Acceptance of Terms
          </h2>
          <p className="opacity-80">
            By accessing and placing an order with DCtimbers (DC Timber & Fencing Ltd), you confirm that you are in agreement with and bound by the terms and conditions contained herein. These terms apply to the entire website and any email or other type of communication between you and DCtimbers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            2. Products & Pricing
          </h2>
          <p className="opacity-80 mb-3">
            All prices quoted are exclusive of VAT unless otherwise stated. DCtimbers reserves the right to alter prices without prior notice. Product images are for illustrative purposes only; actual products may vary in colour, grain, and texture as natural timber products can differ between batches.
          </p>
          <p className="opacity-80">
            We make every effort to ensure that prices are accurate at the time of publication; however, if an error is discovered after an order has been placed, we will inform you as soon as possible and give you the option to cancel or reconfirm your order at the correct price.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            3. Orders & Contract
          </h2>
          <p className="opacity-80">
            A contract between DCtimbers and the customer is formed when we accept your order and confirm it in writing or by email. We reserve the right to refuse or cancel any order at our discretion, including but not limited to situations where goods are unavailable, pricing errors have occurred, or we are unable to obtain authorisation for payment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            4. Payment
          </h2>
          <p className="opacity-80">
            Payment is required in full prior to despatch of goods unless a prior credit account has been agreed in writing. For trade account customers, payment terms are strictly 30 days from invoice date unless otherwise agreed. DCtimbers reserves the right to charge interest on overdue accounts at 8% above the Bank of England base rate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            5. Returns & Cancellations
          </h2>
          <p className="opacity-80 mb-3">
            Cut-to-size, bespoke, or made-to-order timber products cannot be returned unless they are defective. Standard stock items may be returned within 14 days of delivery, unused and in original condition, subject to a restocking fee. Goods must be returned at the customer&apos;s expense unless the return is due to our error.
          </p>
          <p className="opacity-80">
            To arrange a return, please contact the depot from which your order was fulfilled. Refunds will be processed within 14 working days of us receiving the returned goods in satisfactory condition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            6. Limitation of Liability
          </h2>
          <p className="opacity-80">
            DCtimbers shall not be liable for any indirect, special, or consequential loss, including loss of profit, arising from the use or misuse of our products. Our liability in any event shall not exceed the total price paid for the goods in question. Nothing in these terms limits our liability for death or personal injury caused by our negligence.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            7. Governing Law
          </h2>
          <p className="opacity-80">
            These terms and conditions are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase mb-3" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
            8. Contact
          </h2>
          <p className="opacity-80">
            For any queries regarding these terms, please contact us at{" "}
            <a href="mailto:sales@dctimbers.co.uk" className="underline font-bold" style={{ color: "var(--color-warning-orange)" }}>
              sales@dctimbers.co.uk
            </a>{" "}
            or call your nearest depot.
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
          Have a Question? Contact Us
        </Link>
      </div>
    </div>
  );
}
