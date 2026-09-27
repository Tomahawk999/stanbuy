import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth", "/legal", "/about"];

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
  // Skip API routes, Next.js internals, and any request for a static
  // file in /public (anything with a file extension) — listing public
  // asset names one by one is fragile and easy to miss.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[\\w]+$).*)"],
};
