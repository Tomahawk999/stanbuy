import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import StoreHydrator from "@/components/StoreHydrator";
import "./globals.css";

// Uber Move, Airbnb Cereal and Cabify's typeface are all proprietary,
// closed-license fonts — not available for use outside those
// companies at any price. Inter is the industry-standard free
// substitute for exactly this category of confident, geometric
// product-UI type (used as-is or as a base by Stripe, Linear, and
// many others reaching for the same feel).
const brandFont = Inter({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Stanbuy",
  description: "Free surplus food from neighbors near you.",
  icons: { icon: "/stanbuy-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${brandFont.variable}`}>
      <body className="min-h-full bg-white text-[#0F1A1C]">
        <AuthProvider>
          <StoreHydrator />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
