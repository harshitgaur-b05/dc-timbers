import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: {
    default:
      "DCtimbers | Trade & Retail Timber Merchant — Fencing, Gates, Decking",
    template: "%s | DCtimbers",
  },
  description:
    "DCtimbers supplies premium fencing, bespoke gates, decking and timber products to trade and public customers across the Midlands. Get a quote today.",
  metadataBase: new URL("https://www.dctimbers.co.uk"),
  openGraph: {
    siteName: "DCtimbers",
    type: "website",
    images: ["/og-default.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Fira+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
