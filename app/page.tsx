import Link from "next/link";

// Stanbuy's public homepage — styled after institutional / VC-firm sites
// (Xfund, Stanford, Harvard): a full-bleed hero, an old-style serif for
// headlines paired with a modern sans for nav/body, crimson used only as
// a sparing accent, and faceted line-art graphics in place of stock
// photography (no real neighborhood photography is available yet — swap
// the FacetPattern blocks for real photos once we have them).

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

// A faceted line-art graphic, standing in for photography we don't have.
// `tone` picks the two stroke colors so it reads correctly on light or
// dark backgrounds.
function FacetPattern({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const a = tone === "light" ? RULE : "rgba(255,255,255,0.14)";
  const b = tone === "light" ? CRIMSON : "rgba(255,255,255,0.5)";
  const lines: [number, number, number, number, string][] = [
    [40, 0, 40, 600, a], [160, 0, 160, 600, a], [280, 0, 280, 600, a],
    [0, 80, 400, 80, a], [0, 260, 400, 260, a], [0, 440, 400, 440, a],
    [40, 0, 160, 80, b], [160, 80, 40, 260, a], [40, 260, 160, 440, b],
    [160, 440, 40, 600, a], [160, 80, 280, 0, a], [280, 0, 400, 80, b],
    [280, 260, 160, 440, a], [280, 260, 400, 440, b], [280, 440, 400, 600, a],
    [40, 260, 0, 440, b],
  ];
  return (
    <svg viewBox="0 0 400 600" className={className} preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
      {lines.map(([x1, y1, x2, y2, stroke], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={1.25} />
      ))}
    </svg>
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
        <Link href="/legal" style={{ ...NAV_LINK, color: "rgba(255,255,255,0.85)" }}>Legal</Link>
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
      {/* Hero — full-bleed, dark, faceted line-art standing in for photography */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #101012 0%, #1c1c1f 55%, #141416 100%)" }}>
        <div className="absolute inset-0" style={{ opacity: 0.5 }}>
          <FacetPattern tone="dark" className="absolute" />
          <div className="absolute" style={{ inset: 0, transform: "scaleX(-1) translateX(-20%)" }}>
            <FacetPattern tone="dark" />
          </div>
        </div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 100%, rgba(140,21,21,0.28), transparent 60%)" }} />

        <HeroNav />

        <div className="relative z-10" style={{ padding: "18vh 32px 9vh", maxWidth: 1180, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: SERIF, fontWeight: 600, color: "#ffffff",
              fontSize: "clamp(38px, 6vw, 72px)", lineHeight: 1.08, letterSpacing: "-0.01em",
              maxWidth: 820, margin: "0 0 28px",
            }}
          >
            The Neighborhood Marketplace for Food That Would Otherwise Go to Waste.
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, maxWidth: 560, margin: "0 0 40px" }}>
            Stanbuy connects neighbors who have extra food with neighbors who could use it — free, in under an
            hour, right around the corner.
          </p>
          <CTAButtons invert />
        </div>

        <div className="absolute flex items-center" style={{ bottom: 28, right: 32, gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i === 0 ? "#ffffff" : "rgba(255,255,255,0.35)" }} />
          ))}
        </div>
      </section>

      {/* About us */}
      <section className="mx-auto" style={{ maxWidth: 1180, padding: "120px 32px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 56 }}>
          <div>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 20 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={CRIMSON}><path d="M4 2h18l-7 9 7 9H4V2Z" /></svg>
              <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: CRIMSON, textTransform: "uppercase" }}>
                About us
              </span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.2, color: INK, margin: "0 0 24px" }}>
              Built to close the gap between having too much and needing enough.
            </h2>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, margin: "0 0 16px", maxWidth: 480 }}>
              Food doesn&apos;t go to waste because neighbors don&apos;t care — it goes to waste because there
              was never a fast, low-friction way to hand it to someone who would actually use it.
            </p>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>
              So we cut the app down to two buttons. If you have extra, post it. If you want something, browse
              what&apos;s free nearby and reserve it. Nothing else sits in between.
            </p>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center"
              style={{ height: 52, padding: "0 26px", borderRadius: 6, background: INK, color: "#ffffff", fontFamily: SANS, fontSize: 15, fontWeight: 700, gap: 10 }}
            >
              Learn more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div style={{ height: 420 }} className="hidden lg:block">
            <FacetPattern tone="light" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ borderTop: `1px solid ${RULE}`, background: "#FAFAFA" }}>
        <div className="mx-auto" style={{ maxWidth: 1180, padding: "100px 32px" }}>
          <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(26px, 3vw, 36px)", color: INK, margin: "0 0 48px" }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 40 }}>
            {[
              ["01", "Post what you have", "Snap a photo of the food you won't finish and share it with your street in under a minute."],
              ["02", "A neighbor reserves it", "Anyone nearby can reserve a listing. It's held for them for one hour, no one else can claim it."],
              ["03", "Meet, hand off, done", "The buyer walks over, shows their pickup code, and takes it home. No fees, no delivery."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 600, color: CRIMSON, marginBottom: 14 }}>{n}</div>
                <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: INK, marginBottom: 8 }}>{t}</div>
                <div style={{ fontSize: 15.5, color: MUTED, lineHeight: 1.65 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / reliability */}
      <section className="mx-auto" style={{ maxWidth: 1180, padding: "100px 32px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 56 }}>
          <div style={{ height: 380 }} className="hidden lg:block order-2">
            <FacetPattern tone="light" />
          </div>
          <div className="order-1">
            <div className="flex items-center" style={{ gap: 8, marginBottom: 20 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={CRIMSON}><path d="M4 2h18l-7 9 7 9H4V2Z" /></svg>
              <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: CRIMSON, textTransform: "uppercase" }}>
                Built on trust
              </span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(28px, 3.2vw, 40px)", lineHeight: 1.2, color: INK, margin: "0 0 24px" }}>
              Every neighbor carries a <span style={{ color: CRIMSON }}>Reliability Score.</span>
            </h2>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, margin: "0 0 16px", maxWidth: 480 }}>
              Show up for what you reserve and it stays high. Miss it, and it drops — fall far enough and
              reserving pauses for a week.
            </p>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, maxWidth: 480 }}>
              Listings only ever show a neighborhood on the map, never an exact address. And the food itself is
              free, full stop — during this pilot and after it.
            </p>
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section style={{ borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-3" style={{ maxWidth: 1180, padding: "64px 32px" }}>
          {[
            ["Roughly a third", "of all food produced is never eaten — most of it still edible when it's thrown out."],
            ["60 minutes", "is how long a reservation holds a listing before it's released back to the neighborhood."],
            ["$0.00", "is what the food itself costs on Stanbuy, during the pilot and after it."],
          ].map(([stat, desc], i) => (
            <div key={stat} style={{ padding: "8px 28px", borderLeft: i > 0 ? `1px solid ${RULE}` : "none" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 38, color: INK }}>{stat}</div>
              <div style={{ fontSize: 15, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner-with-us style CTA band */}
      <section className="mx-auto" style={{ maxWidth: 1180, padding: "120px 32px 60px" }}>
        <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(32px, 4vw, 52px)", color: INK, margin: "0 0 24px" }}>
          <span style={{ color: CRIMSON }}>Two buttons.</span> That&apos;s the app.
        </h2>
        <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
          Whatever brought you here, Stanbuy only asks you to do one of two things.
        </p>
        <CTAButtons />
      </section>
      <div style={{ height: 160 }}>
        <FacetPattern tone="light" />
      </div>

      {/* FAQ */}
      <section className="mx-auto" style={{ maxWidth: 780, padding: "100px 32px 8px" }}>
        <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(26px, 3vw, 34px)", color: INK, margin: "0 0 8px" }}>
          Common questions
        </h2>
        <div style={{ height: 1, background: RULE, margin: "24px 0" }} />
        {FAQS.map((item) => (
          <details key={item.q} style={{ borderBottom: `1px solid ${RULE}`, padding: "18px 0" }}>
            <summary className="flex cursor-pointer items-center justify-between" style={{ listStyle: "none", fontSize: 16.5, fontWeight: 700, color: INK }}>
              {item.q}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" className="flex-none">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p style={{ margin: "10px 0 0", fontSize: 15.5, color: MUTED, lineHeight: 1.7 }}>{item.a}</p>
          </details>
        ))}
        <div style={{ marginTop: 24, fontSize: 14.5, color: MUTED, paddingBottom: 8 }}>
          Questions about how Stanbuy works?{" "}
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
