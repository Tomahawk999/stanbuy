import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import StoreHydrator from "@/components/StoreHydrator";
import "./globals.css";

// Airbnb's real typeface (Cereal) is proprietary and unavailable at
// any price. Poppins is the free font the design community actually
// reaches for as a Cereal substitute — true geometric circles in its
// o/e/a, the specific trait that gives Airbnb's UI its look.
const brandFont = Poppins({
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
