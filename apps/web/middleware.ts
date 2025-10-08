import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Handle only API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const res = NextResponse.next();

    const allowedOrigins = [
      "chrome-extension://ebjlhhfdbijmgdaeaeffgahbimkbbgik",
      "chrome-extension://eigcajjledcgdjcihjcocmajcgnnphdl",
    ];

    const origin = req.headers.get("origin");
    if (origin && allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }

    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Handle preflight requests quickly
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: res.headers,
      });
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
