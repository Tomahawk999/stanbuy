import Link from "next/link";

// Stanbuy's public homepage — matches the structure of the xfund.com
// reference the user provided: a full-bleed photo hero, a two-column
// "About us" block, and a "Partner with us"-style CTA block with a
// full-width photo band. No photography is available yet, so image
// areas are plain neutral placeholders (ImageSlot) — swap the src in
// once real photos of neighbors/pickups exist. No food photography,
// no decorative graphics standing in for it.

const CRIMSON = "#8C1515"; // Stanford's published Cardinal Red (identity.stanford.edu/color)
const INK = "#0A0A0A";
const MUTED = "#63666A";
const RULE = "#E5E5E6";
const SERIF = "var(--font-editorial-serif)";
const SANS = "var(--font-editorial-sans)";

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
    a: "The listing releases back to the neighborhood automatically after 1 hour, and your Reliability Score drops 15%. Show up and it stays high; miss enough and reserving pauses for a week.",
  },
  {
    q: "Is my exact address shared with everyone?",
    a: "No. Listings show your neighborhood on the map, not your exact address. The precise pickup point is only shared with the specific buyer once they reserve.",
  },
];

// Plain placeholder for a photo we don't have yet. Swap the commented
// <img> in for a real photo (team, neighbors, a pickup in progress —
// never food close-ups) once one exists.
function ImageSlot({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${className ?? ""}`}
      style={{ background: "#EDEDED", border: `1px solid ${RULE}`, width: "100%", height: "100%" }}
    >
      <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#A3A3A3", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

const NAV_LINK: React.CSSProperties = { fontFamily: SANS, fontWeight: 600, fontSize: 15 };

function HeroNav() {
  return (
    <nav className="relative z-10 flex flex-wrap items-center justify-between" style={{ padding: "24px 32px", gap: 16 }}>
      <div className="flex items-center" style={{ gap: 28 }}>
        <Link href="/" style={{ ...NAV_LINK, color: "#ffffff" }}>Stanbuy</Link>
        <Link href="/" style={{ ...NAV_LINK, color: "rgba(255,255,255,0.85)" }}>About</Link>
        <Link href="/browse" style={{ ...NAV_LINK, color: "rgba(255,255,255,0.85)" }}>Browse</Link>
        <Link href="/sell" style={{ ...NAV_LINK, color: "rgba(255,255,255,0.85)" }}>Sell</Link>
      </div>
      <div className="flex items-center" style={{ gap: 10 }}>
        <Link
          href="/auth"
          className="flex items-center justify-center"
          style={{ ...NAV_LINK, height: 42, padding: "0 22px", borderRadius: 6, background: "#ffffff", color: INK }}
        >
          Sign In
        </Link>
        <Link
          href="/browse"
          aria-label="Find free food near you"
          className="flex items-center justify-center"
          style={{ height: 42, width: 42, borderRadius: 6, background: CRIMSON }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}

function CTAButtons({ invert = false }: { invert?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row" style={{ gap: 14 }}>
      <Link
        href="/sell"
        className="flex items-center justify-center"
        style={{
          height: 54, padding: "0 28px", fontFamily: SANS, fontSize: 15, fontWeight: 700, borderRadius: 6,
          color: invert ? INK : "#ffffff",
          background: invert ? "#ffffff" : INK,
        }}
      >
        Get rid of your leftovers →
      </Link>
      <Link
        href="/browse"
        className="flex items-center justify-center"
        style={{
          height: 54, padding: "0 28px", fontFamily: SANS, fontSize: 15, fontWeight: 700, borderRadius: 6,
          color: invert ? "#ffffff" : INK,
          background: "transparent",
          border: `1px solid ${invert ? "rgba(255,255,255,0.6)" : INK}`,
        }}
      >
        Find free food near you →
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div id="top" style={{ background: "#ffffff", color: INK, fontFamily: SANS }}>
      {/* Hero — full-bleed photo (placeholder until we have one) */}
      <section className="relative overflow-hidden" style={{ background: "#16140F", minHeight: "88vh" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)" }} />

        <div className="relative flex h-full flex-col" style={{ minHeight: "88vh" }}>
          <HeroNav />
          <div className="relative z-10 flex flex-1 flex-col justify-end" style={{ padding: "0 32px 9vh", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
            <h1
              style={{
                fontFamily: SERIF, fontWeight: 600, color: "#ffffff",
                fontSize: "clamp(36px, 5.6vw, 68px)", lineHeight: 1.08, letterSpacing: "-0.01em",
                maxWidth: 780, margin: "0 0 26px",
              }}
            >
              The neighborhood marketplace for food that would otherwise go to waste.
            </h1>
            <p style={{ fontFamily: SANS, fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, maxWidth: 540, margin: "0 0 36px" }}>
              Stanbuy connects neighbors who have extra food with neighbors who could use it — free, in under an
              hour, right around the corner.
            </p>
            <CTAButtons invert />
          </div>
        </div>
      </section>

      {/* About us */}
      <section className="mx-auto" style={{ maxWidth: 1180, padding: "110px 32px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 64 }}>
          <div>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 20 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={CRIMSON}><path d="M4 2h18l-7 9 7 9H4V2Z" /></svg>
              <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: CRIMSON, textTransform: "uppercase" }}>
                About us
              </span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(28px, 3.2vw, 42px)", lineHeight: 1.2, color: INK, margin: "0 0 24px" }}>
              Built to close the gap between having too much and needing enough.
            </h2>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, margin: "0 0 16px", maxWidth: 460 }}>
              Food doesn&apos;t go to waste because neighbors don&apos;t care — it goes to waste because there
              was never a fast, low-friction way to hand it to someone who would actually use it. So we cut the
              app down to two buttons: post what you have, or browse what&apos;s free nearby.
            </p>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 460 }}>
              Post it, a neighbor reserves it within the hour, you hand it off in person. Every neighbor carries
              a Reliability Score, so the system stays honest without anyone policing it.
            </p>
            <Link
              href="/legal"
              className="inline-flex items-center justify-center"
              style={{ height: 52, padding: "0 26px", borderRadius: 6, background: INK, color: "#ffffff", fontFamily: SANS, fontSize: 15, fontWeight: 700, gap: 10 }}
            >
              Learn more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div style={{ aspectRatio: "4 / 5" }} className="hidden lg:block">
            <ImageSlot label="Photo: neighbors, team" />
          </div>
        </div>
      </section>

      {/* How it works — kept plain, no color/graphic treatment */}
      <section style={{ borderTop: `1px solid ${RULE}`, background: "#FAFAFA" }}>
        <div className="mx-auto" style={{ maxWidth: 780, padding: "90px 32px" }}>
          <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(24px, 2.8vw, 32px)", color: INK, margin: "0 0 32px" }}>
            How it works
          </h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {[
              ["Post what you have", "Snap a photo of the food you won't finish and share it with your street in under a minute."],
              ["A neighbor reserves it", "Anyone nearby can reserve a listing. It's held for them for one hour, no one else can claim it."],
              ["Meet, hand off, done", "The buyer walks over, shows their pickup code, and takes it home. No fees, no delivery."],
            ].map(([t, d], i) => (
              <li key={t} style={{ display: "flex", gap: 20, padding: "18px 0", borderTop: i > 0 ? `1px solid ${RULE}` : "none" }}>
                <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: MUTED, flex: "none", width: 20, paddingTop: 2 }}>{i + 1}</span>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: INK, marginBottom: 4 }}>{t}</div>
                  <div style={{ fontSize: 15, color: MUTED, lineHeight: 1.6 }}>{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Partner-with-us style CTA, with a full-width photo band beneath */}
      <section className="mx-auto" style={{ maxWidth: 1180, padding: "110px 32px 0" }}>
        <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(30px, 3.8vw, 48px)", color: INK, margin: "0 0 24px" }}>
          <span style={{ color: CRIMSON }}>Two buttons.</span> That&apos;s the app.
        </h2>
        <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
          Whatever brought you here, Stanbuy only asks you to do one of two things.
        </p>
        <CTAButtons />
      </section>
      <div className="mx-auto" style={{ maxWidth: 1180, padding: "56px 32px 0", aspectRatio: "16 / 6" }}>
        <ImageSlot label="Photo: a pickup, in person" />
      </div>

      {/* FAQ */}
      <section className="mx-auto" style={{ maxWidth: 720, padding: "110px 32px 8px" }}>
        <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(24px, 2.8vw, 32px)", color: INK, margin: "0 0 8px" }}>
          Common questions
        </h2>
        <div style={{ height: 1, background: RULE, margin: "24px 0" }} />
        {FAQS.map((item) => (
          <details key={item.q} style={{ borderBottom: `1px solid ${RULE}`, padding: "16px 0" }}>
            <summary className="flex cursor-pointer items-center justify-between" style={{ listStyle: "none", fontSize: 16, fontWeight: 700, color: INK }}>
              {item.q}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" className="flex-none">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p style={{ margin: "10px 0 0", fontSize: 15, color: MUTED, lineHeight: 1.7 }}>{item.a}</p>
          </details>
        ))}
        <div style={{ marginTop: 22, fontSize: 14, color: MUTED, paddingBottom: 8 }}>
          More questions?{" "}
          <Link href="/legal" style={{ color: CRIMSON, fontWeight: 600 }}>
            Read our Terms &amp; policies
          </Link>
          .
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${RULE}`, marginTop: 64 }}>
        <div className="mx-auto flex flex-wrap items-center justify-between" style={{ maxWidth: 1180, padding: "28px 32px", gap: 12, fontSize: 13.5, color: MUTED }}>
          <span>© {new Date().getFullYear()} Stanbuy, Inc.</span>
          <div className="flex flex-wrap items-center" style={{ gap: 22 }}>
            <Link href="/browse" style={{ color: MUTED }}>Browse listings</Link>
            <Link href="/sell" style={{ color: MUTED }}>Post surplus food</Link>
            <Link href="/legal?tab=privacy" style={{ color: MUTED }}>Privacy</Link>
            <Link href="/legal?tab=terms" style={{ color: MUTED }}>Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
