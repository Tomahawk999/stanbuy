import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth", "/legal"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (req.auth || PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/auth";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
});

export const config = {
  // Skip API routes, Next.js internals, and static files in /public
  // (images, fonts, etc.) so new assets never need to be listed here
  // by name to stay reachable.
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|webp|gif|svg|ico|css|js|woff|woff2|ttf|map)$).*)",
  ],
};
