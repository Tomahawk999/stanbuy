import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import StoreHydrator from "@/components/StoreHydrator";
import "./globals.css";

// Verified directly against realrun.app's computed styles (not a
// guess): its body and heading font is Poppins (headings at weight
// 800). Since RealRun is now our primary reference, we use the exact
// same free Google Font — no substitute needed.
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
      <body className="min-h-full bg-white text-[#0B0B0C]">
        <AuthProvider>
          <StoreHydrator />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
