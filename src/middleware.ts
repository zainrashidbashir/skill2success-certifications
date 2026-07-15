import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Protect Admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }

    // Protect Student routes
    if (req.nextUrl.pathname.startsWith("/student") && token?.role !== "STUDENT") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply this middleware only to /admin and /student routes
export const config = { matcher: ["/admin/:path*", "/student/:path*"] };
