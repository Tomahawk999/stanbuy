import Link from "next/link";

// Stanbuy's public homepage — modeled closely on a Stanford news-site
// article layout (red utility bar, logo + search + nav header, feature
// eyebrow, bold sans headline, byline row, full-width photo, plain-text
// article body, fixed "Back to top" button). The org name in the source
// is swapped for Stanbuy's own so the page reads as Stanbuy's, not as
// an actual Stanford property.

const CRIMSON = "#8C1515"; // Stanford's published Cardinal Red (identity.stanford.edu/color)
const INK = "#1D1D1D";
const BODY_TEXT = "#262626";
const MUTED = "#5F5F5F";
const RULE = "#E2E2E2";
const LINK_BLUE = "#1B57B3";
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

const PUBLISHED = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const NAV_LINK: React.CSSProperties = { color: CRIMSON, fontWeight: 700, fontSize: 15 };
const CONTAINER = 900;

function ShareIcon({ path }: { path: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={INK}>
      <path d={path} />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: "#ffffff", color: BODY_TEXT, fontFamily: SANS }}>
      {/* Utility bar */}
      <div style={{ background: CRIMSON }}>
        <div className="mx-auto" style={{ maxWidth: 1180, padding: "9px 24px" }}>
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 13 }}>Stanbuy</span>
        </div>
      </div>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${RULE}` }}>
        <div className="mx-auto flex flex-wrap items-start justify-between" style={{ maxWidth: 1180, padding: "28px 24px 0", gap: 20 }}>
          <Link href="/" style={{ color: INK }}>
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.01em" }}>Stanbuy</div>
            <div style={{ fontSize: 17, fontWeight: 400, color: MUTED, marginTop: 2 }}>Neighborhood food, shared daily</div>
          </Link>
          <form action="/browse" method="GET" className="flex items-center" style={{ height: 42, minWidth: 240, borderRadius: 999, border: `1px solid ${RULE}`, padding: "0 6px 0 18px" }}>
            <label htmlFor="site-search" className="sr-only">Search this site</label>
            <input
              id="site-search"
              name="q"
              type="text"
              placeholder="Search this site"
              className="min-w-0 flex-1"
              style={{ border: "none", outline: "none", fontSize: 14, color: INK, background: "transparent" }}
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex flex-none cursor-pointer items-center justify-center border-none bg-transparent"
              style={{ width: 32, height: 32 }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={CRIMSON} strokeWidth="2.4">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </form>
        </div>
        <nav className="mx-auto flex flex-wrap items-center justify-end" style={{ maxWidth: 1180, padding: "18px 24px", gap: 28 }}>
          <Link href="/" style={NAV_LINK}>About</Link>
          <Link href="/browse" style={NAV_LINK}>Browse</Link>
          <Link href="/sell" style={NAV_LINK}>Sell</Link>
          <Link href="/legal" style={NAV_LINK}>Legal</Link>
          <Link href="/auth" style={NAV_LINK}>Sign In</Link>
        </nav>
      </header>

      {/* Article header */}
      <div className="mx-auto" style={{ maxWidth: CONTAINER, padding: "48px 24px 0" }}>
        <div style={{ color: CRIMSON, fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Feature</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 800, color: INK, lineHeight: 1.15, letterSpacing: "-0.01em", margin: 0 }}>
          One neighbor&apos;s leftovers are another&apos;s dinner
        </h1>
        <p style={{ fontSize: 22, fontWeight: 400, color: "#3C3C3C", lineHeight: 1.5, margin: "20px 0" }}>
          Stanbuy connects neighbors who have extra food with neighbors who could use it — free, in under an
          hour, right around the corner.
        </p>
        <div
          className="flex flex-wrap items-center"
          style={{ gap: 16, fontSize: 14, color: MUTED, paddingBottom: 24, borderBottom: `1px solid ${RULE}` }}
        >
          <span>{PUBLISHED} · By the Stanbuy Team</span>
          <div className="flex items-center" style={{ gap: 12 }}>
            <ShareIcon path="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
            <ShareIcon path="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.9a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.6a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.3Z" />
            <ShareIcon path="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9Z" />
            <ShareIcon path="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 2.4V18h14V6.4l-7 5.4-7-5.4Zm.8-.4 6.2 4.8L18.2 6H5.8Z" />
          </div>
        </div>
      </div>

      {/* Feature image */}
      <figure className="mx-auto" style={{ maxWidth: CONTAINER, padding: "28px 24px 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/category-produce.jpg"
          alt="A basket of surplus produce ready to be shared with a neighbor"
          style={{ width: "100%", height: "auto", maxHeight: 420, objectFit: "cover", display: "block" }}
        />
        <figcaption className="text-center" style={{ fontSize: 13, color: MUTED, marginTop: 10, padding: "0 12px" }}>
          A weekly haul of surplus produce, shared through Stanbuy instead of thrown away.
        </figcaption>
      </figure>

      {/* Article body */}
      <article className="mx-auto" style={{ maxWidth: CONTAINER, padding: "32px 24px 8px", fontSize: 19, lineHeight: 1.75, color: BODY_TEXT }}>
        <p style={{ margin: "0 0 22px" }}>
          Every night, kitchens up and down your street throw away food that is still good — a loaf going stale
          before it&apos;s finished, a tray of dinner cooked for guests who never came, a garden that produced
          more tomatoes than one household can eat. None of it is spoiled. All of it needs a neighbor before it
          needs a landfill.
        </p>
        <p style={{ margin: "0 0 22px" }}>
          Stanbuy exists to close that one-hour gap between &ldquo;I have extra&rdquo; and &ldquo;I could use
          that.&rdquo; A neighbor posts what they have, a nearby neighbor reserves it, and the two of them
          handle the rest — no delivery, no middleman, no charge for the food itself.
        </p>
        <p style={{ margin: "0 0 22px" }}>
          &ldquo;You build yourself before you build your company,&rdquo; is how Y Combinator&apos;s Garry Tan
          put it to a room of Stanford founders. The same is true of a neighborhood: it gets built one shared
          meal at a time, not by a delivery fleet.
        </p>

        {/* Two things you can do — replaces the article's embedded video with Stanbuy's two real actions */}
        <div style={{ border: `1px solid ${RULE}`, borderRadius: 4, padding: 28, margin: "8px 0 28px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CRIMSON, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Two things you can do right now
          </div>
          <div className="flex flex-col sm:flex-row" style={{ gap: 14 }}>
            <Link
              href="/sell"
              className="flex items-center justify-center"
              style={{ height: 52, padding: "0 24px", fontSize: 15, fontWeight: 700, color: "#ffffff", background: CRIMSON }}
            >
              Get rid of your leftovers →
            </Link>
            <Link
              href="/browse"
              className="flex items-center justify-center"
              style={{ height: 52, padding: "0 24px", fontSize: 15, fontWeight: 700, color: INK, background: "transparent", border: `1px solid ${INK}` }}
            >
              Find free food near you →
            </Link>
          </div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "8px 0 16px" }}>Why we exist</h2>
        <p style={{ margin: "0 0 22px" }}>
          Food doesn&apos;t go to waste because neighbors don&apos;t care. It goes to waste because there was
          never a fast, low-friction way to hand it to someone who would actually use it. By the time you&apos;ve
          thought about posting it somewhere, messaging a group chat, or driving it to a donation center, it&apos;s
          easier to just throw it out. That gap — not indifference — is what Stanbuy is built to close.
        </p>
        <p style={{ margin: "0 0 22px" }}>
          So we cut the app down to two buttons. If you have extra, you post it in under a minute. If you want
          something, you browse what&apos;s free nearby and reserve it. Nothing else — no cart, no checkout, no
          delivery fee — sits between a neighbor with too much and a neighbor with none.
        </p>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "8px 0 16px" }}>How it works</h2>
        <p style={{ margin: "0 0 22px" }}>
          Posting takes under a minute: snap a photo of the food you won&apos;t finish and share it with your
          street. Anyone nearby can reserve a listing — it&apos;s held for them for one hour, so no one else can
          claim it out from under them. The buyer walks over, shows their pickup code, and takes it home. No
          fees, no delivery, no app to schedule around.
        </p>
        <p style={{ margin: "0 0 22px" }}>
          If a reservation goes unclaimed, the listing quietly releases back to the neighborhood after an hour
          so the food doesn&apos;t just sit there — and someone else can still catch it before it goes to waste.
        </p>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "36px 0 16px" }}>Built on trust between neighbors</h2>
        <p style={{ margin: "0 0 22px" }}>
          Every neighbor on Stanbuy carries a Reliability Score. Show up for what you reserve and it stays high.
          Reserve something and never collect it, and it drops — fall far enough and reserving is paused for a
          week. It&apos;s the only thing standing between an honor system and a marketplace nobody can rely on.
        </p>
        <p style={{ margin: "0 0 22px" }}>
          Listings only ever show a neighborhood on the map, never an exact address — the precise pickup point is
          shared with a buyer only after they&apos;ve reserved. And the food itself is free, full stop: during
          this pilot and after it. A small $0.99 handoff fee will apply per pickup once the pilot ends, but it
          covers logistics, never the meal.
        </p>

        <h2 style={{ fontSize: 28, fontWeight: 800, color: INK, margin: "36px 0 16px" }}>Common questions</h2>
        {FAQS.map((item) => (
          <div key={item.q} style={{ margin: "0 0 20px" }}>
            <div style={{ fontWeight: 700, color: INK, marginBottom: 4 }}>{item.q}</div>
            <p style={{ margin: 0, color: BODY_TEXT }}>{item.a}</p>
          </div>
        ))}
        <p style={{ margin: "8px 0 0" }}>
          Questions about how Stanbuy works?{" "}
          <Link href="/legal" style={{ color: LINK_BLUE, textDecoration: "underline" }}>
            Read our Terms &amp; policies
          </Link>
          .
        </p>
      </article>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${RULE}`, marginTop: 56 }}>
        <div className="mx-auto flex flex-wrap items-center justify-between" style={{ maxWidth: CONTAINER, padding: "24px 24px", gap: 12, fontSize: 13, color: MUTED }}>
          <span>© {new Date().getFullYear()} Stanbuy, Inc.</span>
          <div className="flex flex-wrap items-center" style={{ gap: 18 }}>
            <Link href="/browse" style={{ color: MUTED }}>Browse listings</Link>
            <Link href="/sell" style={{ color: MUTED }}>Post surplus food</Link>
            <Link href="/legal?tab=privacy" style={{ color: MUTED }}>Privacy</Link>
            <Link href="/legal?tab=terms" style={{ color: MUTED }}>Terms</Link>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <a
        href="#top"
        className="fixed flex items-center"
        style={{ bottom: 24, right: 24, gap: 8, background: CRIMSON, color: "#ffffff", fontWeight: 700, fontSize: 14, padding: "10px 18px", borderRadius: 6, boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 15l6-6 6 6" />
        </svg>
        Back to Top
      </a>
    </div>
  );
}
