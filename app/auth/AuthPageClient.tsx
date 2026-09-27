"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const INK = "#0B0B0C";
const MUTED = "#63666A";

const INPUT: React.CSSProperties = {
  border: "1px solid #E5E5E6",
  borderRadius: 8,
  padding: "12px 14px",
  fontSize: 14,
  color: INK,
  background: "#ffffff",
  width: "100%",
};

export default function AuthPageClient({ googleEnabled }: { googleEnabled: boolean }) {
  return (
    <Suspense fallback={null}>
      <AuthPageContent googleEnabled={googleEnabled} />
    </Suspense>
  );
}

function AuthPageContent({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const handleGoogle = async () => {
    setGoogleBusy(true);
    await signIn("google", { callbackUrl: next });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Incorrect email or password.");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, neighborhood }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
        return;
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Account created — sign in below.");
        setMode("signin");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-dvh w-full" style={{ color: INK }}>
      <div className="flex w-full flex-col overflow-y-auto lg:w-1/2" style={{ padding: "32px 40px" }}>
        <Link href="/" aria-label="Stanbuy home" className="inline-flex items-center flex-none" style={{ gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stanbuy-icon.png" alt="" style={{ height: 24, width: 24, display: "block" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stanbuy-logo.png" alt="Stanbuy" style={{ height: 18, display: "block" }} />
        </Link>

        <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 380, width: "100%", margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: INK, letterSpacing: "-0.02em", margin: "0 0 20px" }}>
            {mode === "signin" ? "Welcome back" : "Get started"}
          </h1>

          {googleEnabled && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleBusy}
                className="box-border flex w-full items-center justify-center gap-[10px] cursor-pointer"
                style={{ border: "1px solid #E5E5E6", borderRadius: 8, padding: 13, fontSize: 14, fontWeight: 600, color: INK, background: "#ffffff", marginBottom: 12, opacity: googleBusy ? 0.7 : 1 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
                  <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.3 21.3 7.3 24 12 24z" />
                  <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10.1 0 12s.5 3.8 1.4 5.5l4-3.1z" />
                  <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.5l4 3.1c.9-2.8 3.5-4.8 6.6-4.8z" />
                </svg>
                {googleBusy ? "Connecting…" : "Continue with Google"}
              </button>
              <div className="my-1 flex items-center gap-3" style={{ marginBottom: 12 }}>
                <div className="h-px flex-1" style={{ background: "#E5E5E6" }} />
                <span style={{ fontSize: 12, color: MUTED }}>or</span>
                <div className="h-px flex-1" style={{ background: "#E5E5E6" }} />
              </div>
            </>
          )}

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="flex flex-col" style={{ gap: 12 }}>
              <label className="flex flex-col" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: INK }}>
                Email
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={INPUT} />
              </label>
              <label className="flex flex-col" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: INK }}>
                Password
                <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} style={INPUT} />
              </label>
              {error && <div style={{ fontSize: 13, color: "#C4351C", fontWeight: 600 }}>{error}</div>}
              <button
                type="submit"
                disabled={busy}
                className="box-border block w-full text-center cursor-pointer"
                style={{ background: INK, color: "#ffffff", border: "none", borderRadius: 8, padding: 14, fontSize: 14, fontWeight: 700, marginTop: 4, opacity: busy ? 0.7 : 1 }}
              >
                {busy ? "Signing in…" : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col" style={{ gap: 12 }}>
              <label className="flex flex-col" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: INK }}>
                Name
                <input type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} style={INPUT} />
              </label>
              <label className="flex flex-col" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: INK }}>
                Email
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={INPUT} />
              </label>
              <label className="flex flex-col" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: INK }}>
                Password
                <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} style={INPUT} />
              </label>
              <label className="flex flex-col" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: INK }}>
                Neighborhood <span style={{ fontWeight: 400, color: MUTED }}>(optional)</span>
                <input type="text" autoComplete="off" placeholder="Elm Street" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} style={INPUT} />
              </label>
              {error && <div style={{ fontSize: 13, color: "#C4351C", fontWeight: 600 }}>{error}</div>}
              <button
                type="submit"
                disabled={busy}
                className="box-border block w-full text-center cursor-pointer"
                style={{ background: INK, color: "#ffffff", border: "none", borderRadius: 8, padding: 14, fontSize: 14, fontWeight: 700, marginTop: 4, opacity: busy ? 0.7 : 1 }}
              >
                {busy ? "Creating account…" : "Continue"}
              </button>
            </form>
          )}

          <div style={{ textAlign: "center", fontSize: 13, color: MUTED, marginTop: 20 }}>
            {mode === "signin" ? "New to Stanbuy?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
              className="cursor-pointer border-none bg-transparent"
              style={{ color: INK, fontWeight: 700, padding: 0, font: "inherit" }}
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: MUTED, margin: "16px 0 0" }}>
            By continuing you agree to Stanbuy&apos;s{" "}
            <Link href="/legal" style={{ color: INK, fontWeight: 600 }}>
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal" style={{ color: INK, fontWeight: 600 }}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div style={{ fontSize: 12, color: MUTED }}>© {new Date().getFullYear()} Stanbuy, Inc.</div>
      </div>

      <div className="hidden flex-1 items-center justify-center lg:flex" style={{ background: "#F5F5F6", borderLeft: "1px solid #E5E5E6" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/stanbuy-logo.png" alt="" aria-hidden style={{ width: 220, opacity: 0.12 }} />
      </div>
    </div>
  );
}
