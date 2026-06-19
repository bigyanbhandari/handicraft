import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminPaths = ["/admin"];
const authPaths = ["/checkout", "/orders"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p)) && pathname !== "/admin/login";
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

  if (isAdminPath || isAuthPath) {
    if (!token) {
      const loginUrl = isAdminPath
        ? new URL("/admin/login", request.url)
        : new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Basic JWT payload check (without verifying signature, just check format)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (isAdminPath && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        const loginUrl = isAdminPath
          ? new URL("/admin/login", request.url)
          : new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = isAdminPath
        ? new URL("/admin/login", request.url)
        : new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout", "/orders/:path*"],
};
