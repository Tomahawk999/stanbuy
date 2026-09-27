"use client";

import Link from "next/link";

const INK = "#0B0B0C";
const MUTED = "#63666A";
const ORANGE = "#0B0B0C";

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: MUTED,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "16px 16px 6px",
};

const NAV_ITEM: React.CSSProperties = { margin: "0 8px", padding: "10px 8px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: INK };

function NavRow({ href, icon, label, onClose }: { href: string; icon: React.ReactNode; label: string; onClose: () => void }) {
  return (
    <Link href={href} onClick={onClose} className="rd-nav-item flex items-center gap-[14px]" style={NAV_ITEM}>
      {icon}
      {label}
    </Link>
  );
}

export default function HamburgerMenu({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0"
        style={{ background: "rgba(15,26,28,0.4)", zIndex: 9998 }}
      />
      <div
        className="fixed top-0 left-0 bottom-0 flex flex-col bg-white overflow-y-auto"
        style={{ width: 300, boxShadow: "8px 0 30px rgba(0,0,0,0.14)", zIndex: 9999 }}
      >
        <div className="flex flex-none items-center justify-between" style={{ padding: "14px 16px", borderBottom: "1px solid #E5E5E6" }}>
          <Link href="/profile" onClick={onClose} className="flex items-center" style={{ gap: 10 }}>
            <span className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, background: "#E5E5E6", color: INK }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="3.6" />
                <path d="M5 20c1.4-4 4.2-6 7-6s5.6 2 7 6" />
              </svg>
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>Tom · Your account</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rd-ghost flex cursor-pointer items-center justify-center border-none bg-none"
            style={{ width: 32, height: 32, borderRadius: 999, color: INK }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-none flex-col" style={{ padding: "12px 16px", borderBottom: "1px solid #E5E5E6" }}>
          <Link
            href="/sell"
            onClick={onClose}
            className="block text-center"
            style={{ background: ORANGE, color: "#ffffff", border: "none", borderRadius: 12, padding: "10px 0", fontSize: 14, fontWeight: 700 }}
          >
            Sell something
          </Link>
        </div>

        <div style={SECTION_LABEL}>Browse</div>
        <NavRow
          href="/"
          onClose={onClose}
          label="Home"
          icon={
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
              <path d="M3 11.5L12 4l9 7.5" />
              <path d="M5 10v10h14V10" />
            </svg>
          }
        />
        <NavRow
          href="/sell"
          onClose={onClose}
          label="Sell"
          icon={
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
              <circle cx="12" cy="12" r="9.2" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          }
        />
        <NavRow
          href="/saved"
          onClose={onClose}
          label="Saved"
          icon={
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
              <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.2C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.3 12 21 12 21Z" />
            </svg>
          }
        />

        <div style={SECTION_LABEL}>Your account</div>
        <NavRow
          href="/profile"
          onClose={onClose}
          label="Your listings"
          icon={
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" />
            </svg>
          }
        />
        <NavRow
          href="/about"
          onClose={onClose}
          label="About Stanbuy"
          icon={
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="flex-none">
              <circle cx="12" cy="12" r="9.2" />
              <path d="M12 11v6M12 7.5v.5" strokeLinecap="round" />
            </svg>
          }
        />

        <div style={SECTION_LABEL}>Help</div>
        <Link href="/legal" onClick={onClose} style={NAV_ITEM} className="rd-nav-item block">
          Help Center
        </Link>
        <Link href="/legal?tab=score" onClick={onClose} style={NAV_ITEM} className="rd-nav-item block">
          Reliability Score
        </Link>
        <Link href="/legal?tab=terms" onClick={onClose} style={NAV_ITEM} className="rd-nav-item block">
          Terms &amp; policies
        </Link>

        <div className="flex-1" />
      </div>
    </>
  );
}
