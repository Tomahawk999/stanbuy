import type { Metadata, Viewport } from "next";
import { Poppins, Source_Sans_3, Lora } from "next/font/google";
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

// Editorial type pair used only by the public homepage (app/page.tsx),
// styled after old-money institutional sites (Xfund, Stanford, Harvard):
// an old-style book serif for headlines, paired with a modern grotesque
// sans for navigation, buttons and body copy.
const editorialSansFont = Source_Sans_3({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-editorial-sans",
});

const editorialSerifFont = Lora({
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-editorial-serif",
});

// Force every route to render dynamically per-request instead of being
// prerendered/CDN-cached — otherwise Vercel's edge cache can serve a
// static page directly, bypassing proxy.ts's login check entirely.
export const dynamic = "force-dynamic";

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
    <html lang="en" className={`h-full ${brandFont.variable} ${editorialSansFont.variable} ${editorialSerifFont.variable}`}>
      <body className="min-h-full bg-white text-[#0B0B0C]">
        <AuthProvider>
          <StoreHydrator />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
