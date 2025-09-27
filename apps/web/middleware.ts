import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Handle only API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const res = NextResponse.next();

    // Replace with your actual extension ID
    const EXTENSION_ID = "ebjlhhfdbijmgdaeaeffgahbimkbbgik";
    const allowedOrigin = `chrome-extension://${EXTENSION_ID}`;

    res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

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