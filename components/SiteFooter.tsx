"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

const INK = "#0B0B0C";
const MUTED = "#63666A";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Get to know us",
    links: [
      { href: "/", label: "About Stanbuy" },
      { href: "/", label: "How it works" },
      { href: "/legal?tab=score", label: "Reliability Score" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/legal", label: "Help Center" },
      { href: "/legal?tab=score", label: "Cancellations & no-shows" },
      { href: "/legal", label: "Report a listing" },
      { href: "/legal", label: "Safety & food handling" },
    ],
  },
  {
    heading: "Browse by category",
    links: CATEGORIES.filter((c) => c.id !== "all").map((c) => ({ href: `/browse?category=${c.id}`, label: c.label })),
  },
  {
    heading: "Community",
    links: [
      { href: "/sell", label: "Sell something" },
      { href: "/browse", label: "Browse nearby" },
      { href: "/saved", label: "Saved listings" },
      { href: "/profile", label: "Your listings" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal?tab=terms", label: "Terms of use" },
      { href: "/legal?tab=privacy", label: "Privacy policy" },
      { href: "/legal?tab=cookies", label: "Cookies" },
      { href: "/legal?tab=score", label: "Reliability Score policy" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#F7F8F8", borderTop: "1px solid #E5E5E6", marginTop: 40 }}>
      <div className="mx-auto" style={{ maxWidth: 1120, padding: "40px 24px 28px" }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: "28px 16px" }}>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 14 }}>{col.heading}</div>
              <div className="flex flex-col" style={{ gap: 11 }}>
                {col.links.map((l, i) => (
                  <Link key={`${l.label}-${i}`} href={l.href} style={{ fontSize: 13, color: MUTED }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#E5E5E6", margin: "28px 0 16px" }} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" style={{ gap: 12 }}>
          <div className="flex flex-wrap items-center" style={{ gap: "6px 12px", fontSize: 12, color: MUTED }}>
            <span>© {year} Stanbuy, Inc.</span>
            <span>·</span>
            <Link href="/legal?tab=privacy" style={{ color: MUTED }}>Privacy</Link>
            <span>·</span>
            <Link href="/legal?tab=terms" style={{ color: MUTED }}>Terms</Link>
            <span>·</span>
            <span>Built for neighbors everywhere</span>
          </div>
          <div className="flex items-center" style={{ gap: 6, fontSize: 12, color: MUTED }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
            </svg>
            English (US)
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#8BA2AD", lineHeight: 1.5, marginTop: 14, maxWidth: 640 }}>
          Category photos via Rawpixel and Wikimedia Commons — Santeri Viinamäki, HaJunkiyada, Jakub Kapusnak and others (CC0 / CC BY-SA)
        </div>
      </div>
    </footer>
  );
}
