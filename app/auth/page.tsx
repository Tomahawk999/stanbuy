import AuthPageClient from "./AuthPageClient";

export default function AuthPage() {
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  return <AuthPageClient googleEnabled={googleEnabled} />;
}
