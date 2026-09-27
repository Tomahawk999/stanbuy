import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import StoreHydrator from "@/components/StoreHydrator";
import "./globals.css";

// DoorDash's real typeface (TT Norms Pro, from TypeType) is a paid
// commercial font (~$20-90/license) — not on Google Fonts, not free
// at any price without buying it. Manrope is the free font most
// commonly used as its substitute: same neutral modern-grotesque
// proportions. If a licensed TT Norms Pro file is provided, swap it
// in directly via next/font/local instead.
const brandFont = Manrope({
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
      <body className="min-h-full bg-white text-[#0B0B0C]">
        <AuthProvider>
          <StoreHydrator />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
