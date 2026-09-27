"use client";

import Link from "next/link";
import PageShell from "@/components/PageShell";

const INK = "#0F1A1C";
const MUTED = "#576F76";
const ORANGE = "#FB4402";

const FAQS = [
  {
    q: "Is Stanbuy only for certain neighborhoods?",
    a: "No — Stanbuy is launching hyperlocal and expanding fast, but anyone nearby can take part. Households, co-ops and neighbors around you can all join in.",
  },
  {
    q: "Why is the app free right now?",
    a: "We're piloting Stanbuy before opening it up more broadly. During the pilot, reserving and collecting food is $0.00. Once the pilot ends, each pickup will cost $0.99 to cover handoff and platform logistics — the food itself stays free.",
  },
  {
    q: "What happens if I don't collect my reservation?",
    a: "The listing releases back to the neighborhood automatically after 1 hour, and your Reliability Score drops 15%. See the Reliability Score page for details.",
  },
  {
    q: "Can businesses use Stanbuy?",
    a: "Individual neighbors always share for free. Local shops and businesses that want to post surplus regularly can do so through a separate, paid Stanbuy for Business subscription.",
  },
  {
    q: "Is my exact address shared with everyone?",
    a: "No. Listings show your neighborhood on the map, not your exact address. The precise pickup point is only shared with the specific buyer once they reserve.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <div className="relative overflow-hidden" style={{ aspectRatio: "2000 / 1199", borderRadius: 16, marginBottom: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/auth-food-strip.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,26,28,0) 55%, rgba(15,26,28,0.7) 100%)" }} />
        <div className="absolute" style={{ left: 20, bottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            About Stanbuy
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 8px 8px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: "0 0 10px" }}>Frequently asked questions</h2>
        <div className="flex flex-col" style={{ gap: 2 }}>
          {FAQS.map((item) => (
            <details key={item.q} className="rd-nav-item" style={{ borderRadius: 12, padding: "12px 14px" }}>
              <summary
                className="flex cursor-pointer items-center justify-between"
                style={{ listStyle: "none", fontSize: 14, fontWeight: 600, color: INK }}
              >
                {item.q}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-none">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{item.a}</p>
            </details>
          ))}
        </div>

        <div style={{ marginTop: 20, fontSize: 14, color: MUTED }}>
          Questions about how Stanbuy works?{" "}
          <Link href="/legal" style={{ color: ORANGE, fontWeight: 600 }}>
            Read our Terms &amp; policies
          </Link>
          .
        </div>
      </div>
    </PageShell>
  );
}
