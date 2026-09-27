"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";

type TabId = "terms" | "privacy" | "score" | "cookies";

const TABS: { id: TabId; label: string }[] = [
  { id: "terms", label: "Terms of use" },
  { id: "privacy", label: "Privacy policy" },
  { id: "score", label: "Reliability Score" },
  { id: "cookies", label: "Cookies" },
];

const TAB_IDS: TabId[] = ["terms", "privacy", "score", "cookies"];

const INK = "#0B0B0C";
const MUTED = "#63666A";
const ORANGE = "#0B0B0C";

const H2: React.CSSProperties = { fontSize: 17, fontWeight: 700, color: INK, margin: "24px 0 8px" };
const H2_FIRST: React.CSSProperties = { ...H2, margin: "0 0 8px" };
const P: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, color: INK, margin: "0 0 14px" };
const LI: React.CSSProperties = { fontSize: 14, lineHeight: 1.7, color: INK, margin: "0 0 6px" };
const LINK: React.CSSProperties = { color: ORANGE, fontWeight: 600 };

export default function LegalPage() {
  return (
    <Suspense fallback={null}>
      <LegalPageContent />
    </Suspense>
  );
}

function LegalPageContent() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab = TAB_IDS.includes(requestedTab as TabId) ? (requestedTab as TabId) : "terms";
  const [tab, setTab] = useState<TabId>(initialTab);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [tab]);

  return (
    <PageShell maxWidth={960}>
      <div style={{ padding: "0 8px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: INK, margin: "0 0 4px" }}>Legal &amp; policies</h1>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 20 }}>Last updated: September 1, 2026</div>
      </div>

      <div className="flex flex-col sm:flex-row items-start" style={{ gap: 32, paddingBottom: 40 }}>
        <aside className="flex-none w-full sm:sticky sm:w-[220px]" style={{ top: 72 }}>
          <div className="flex flex-row sm:flex-col overflow-x-auto" style={{ gap: 2, padding: "0 24px 0 8px" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                ref={tab === t.id ? activeTabRef : undefined}
                type="button"
                onClick={() => setTab(t.id)}
                className="rd-nav-item flex-none cursor-pointer border-none bg-none text-left"
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: tab === t.id ? 700 : 500,
                  color: tab === t.id ? ORANGE : INK,
                  background: tab === t.id ? "#F0F0F1" : "transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20, borderTop: "1px solid #E5E5E6", padding: "14px 8px 0" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Need help?
            </div>
            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <a href="mailto:legal@stanbuy.app" style={LINK}>legal@stanbuy.app</a>
            </div>
            <div style={{ fontSize: 13 }}>
              <a href="mailto:privacy@stanbuy.app" style={LINK}>privacy@stanbuy.app</a>
            </div>
          </div>
        </aside>

        <div className="min-w-0" style={{ flex: 1, maxWidth: 680, padding: "0 8px" }}>
          {tab === "terms" && (
            <>
              <h2 style={H2_FIRST}>What Stanbuy is</h2>
              <p style={P}>
                Stanbuy is a neighbor-to-neighbor marketplace for surplus food. We&apos;re launching
                hyperlocal and expanding fast — houses, co-ops and apartments nearby — no need to
                live in the same building. Sellers list food that would otherwise go to waste;
                buyers reserve it and collect it in person, a short walk away.
              </p>
              <p style={P}>
                During the launch pilot, reserving and collecting a listing is free. After the
                pilot period, each pickup costs $0.99 to cover handoff and platform logistics —
                see <button type="button" onClick={() => setTab("score")} style={{ ...LINK, background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}>Reliability Score</button> for
                how reservations work.
              </p>

              <h2 style={H2}>Eligibility</h2>
              <p style={P}>
                You must be at least 18 years old to create a Stanbuy account. By creating an account
                you confirm the information you provide — your name, approximate neighborhood, and
                contact details — is accurate.
              </p>

              <h2 style={H2}>Food safety</h2>
              <p style={P}>
                Sellers are responsible for accurately describing the condition, ingredients and
                age of listed food. Stanbuy does not inspect listings before publication. Buyers
                should use their own judgment before consuming any item collected through the
                platform, and should ask the seller directly about allergens.
              </p>

              <h2 style={H2}>Prohibited listings</h2>
              <ul style={{ margin: "0 0 14px", paddingLeft: 20 }}>
                <li style={LI}>Alcohol, and any item requiring an age-restricted sale</li>
                <li style={LI}>Food that has passed its safety-critical expiration date</li>
                <li style={LI}>Anything not intended for human consumption</li>
                <li style={LI}>Listings that misrepresent quantity, condition or location</li>
              </ul>

              <h2 style={H2}>Account &amp; conduct</h2>
              <p style={P}>
                Repeated no-shows or inaccurate listings lower your Reliability Score, reduce your
                visibility in search, or lead to account suspension. We may remove listings or
                suspend accounts that violate these terms without prior notice.
              </p>

              <h2 style={H2}>Disputes</h2>
              <p style={P}>
                Most disagreements between neighbors are best resolved directly, in person, at
                pickup. If that isn&apos;t possible, contact us and we&apos;ll review the
                reservation history for that listing.
              </p>

              <h2 style={H2}>Changes to these terms</h2>
              <p style={P}>
                We may update these terms as Stanbuy grows beyond the launch pilot. Material
                changes will be reflected in the &quot;Last updated&quot; date above.
              </p>

              <h2 style={H2}>Contact</h2>
              <p style={P}>
                Questions about these terms can be sent to{" "}
                <a href="mailto:legal@stanbuy.app" style={LINK}>legal@stanbuy.app</a>.
              </p>
            </>
          )}

          {tab === "privacy" && (
            <>
              <h2 style={H2_FIRST}>Data we collect</h2>
              <p style={P}>
                We collect your name, approximate neighborhood, and listing and reservation
                history, in order to run the marketplace, prevent fraud, and show you relevant
                listings nearby. Location is shown at the neighborhood level on the map — your
                exact address is never published.
              </p>

              <h2 style={H2}>How we use it</h2>
              <ul style={{ margin: "0 0 14px", paddingLeft: 20 }}>
                <li style={LI}>Matching you with nearby, available listings</li>
                <li style={LI}>Calculating your Reliability Score</li>
                <li style={LI}>Generating the pickup QR code for a confirmed reservation</li>
                <li style={LI}>Contacting you about a reservation you&apos;re part of</li>
              </ul>

              <h2 style={H2}>What we don&apos;t do</h2>
              <p style={P}>
                We do not sell your personal data, and we do not use advertising trackers. Your
                exact meeting point is only shared with the buyer of a specific listing, once
                reserved, and only for the duration of that reservation.
              </p>

              <h2 style={H2}>Third-party services</h2>
              <p style={P}>
                Maps are rendered with{" "}
                <a href="https://leafletjs.com" target="_blank" rel="noreferrer" style={LINK}>Leaflet</a>{" "}
                and tile data from{" "}
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" style={LINK}>OpenStreetMap</a>.
                No listing or account data is sent to either service beyond the map coordinates
                needed to draw a pin.
              </p>

              <h2 style={H2}>Data retention</h2>
              <p style={P}>
                Listing and reservation history is kept for as long as your account is active, so
                your Reliability Score stays accurate. You can request deletion of your account
                and associated data at any time.
              </p>

              <h2 style={H2}>Your rights</h2>
              <p style={P}>
                You can request a copy of the data we hold about you, ask us to correct it, or ask
                us to delete it, by contacting us below.
              </p>

              <h2 style={H2}>Contact</h2>
              <p style={P}>
                Privacy questions can be sent to{" "}
                <a href="mailto:privacy@stanbuy.app" style={LINK}>privacy@stanbuy.app</a>.
              </p>
            </>
          )}

          {tab === "score" && (
            <>
              <h2 style={H2_FIRST}>Reservations</h2>
              <p style={P}>
                Claiming a listing is free during the launch pilot. When you reserve an item,
                it&apos;s locked for you for 1 hour. On arrival, the seller scans your pickup
                QR code to confirm the handoff.
              </p>

              <h2 style={H2}>Pricing after the pilot</h2>
              <p style={P}>
                Once the pilot period ends, each completed pickup costs{" "}
                <span style={{ textDecoration: "line-through", color: MUTED }}>$0.99</span>{" "}
                <strong>$0.00 during the pilot</strong> — afterwards, the full $0.99 covers
                pickup and platform logistics, not the food itself, which remains free to give
                away.
              </p>

              <h2 style={H2}>How the score works</h2>
              <p style={P}>
                Every account starts at a 100% Reliability Score. If you don&apos;t collect a
                reserved item within the 1-hour window, it&apos;s released back to the
                neighborhood and your score drops by 15%.
              </p>
              <p style={P}>
                If your score falls below 80%, you won&apos;t be able to reserve new listings for
                7 days. Donating surplus food yourself helps your score recover faster.
              </p>

              <h2 style={H2}>Why it matters</h2>
              <p style={P}>
                Unlike a store, sellers on Stanbuy set aside real food for a specific pickup. A
                no-show wastes that effort. The Reliability Score keeps the marketplace usable for
                everyone by favoring neighbors who actually show up.
              </p>

              <h2 style={H2}>Businesses</h2>
              <p style={P}>
                There is no in-platform currency and nothing is bought or sold between neighbors.
                Local shops and businesses can post surplus to the community through a separate,
                paid Stanbuy for Business subscription.
              </p>
            </>
          )}

          {tab === "cookies" && (
            <>
              <h2 style={H2_FIRST}>What we store</h2>
              <p style={P}>
                Stanbuy doesn&apos;t use advertising or tracking cookies. We store your reservations,
                saved listings and Reliability Score locally in your browser&apos;s storage so the
                app works without needing you to sign in on every visit.
              </p>

              <h2 style={H2}>Once you sign in</h2>
              <p style={P}>
                Once you create an account, this same information moves to your account instead,
                so it follows you across devices, and local browser storage is no longer the
                source of truth.
              </p>

              <h2 style={H2}>Clearing your data</h2>
              <p style={P}>
                Clearing your browser&apos;s site data for Stanbuy removes any locally stored
                reservations, saved listings and score progress that haven&apos;t been moved to an
                account yet.
              </p>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
