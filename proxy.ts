import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (req.auth || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/auth";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|stanbuy-icon.png|stanbuy-logo.png|category-.*).*)"],
};
