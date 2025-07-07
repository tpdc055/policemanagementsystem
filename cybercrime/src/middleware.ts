import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to sign-in page and API routes
    if (
      req.nextUrl.pathname.startsWith("/auth/") ||
      req.nextUrl.pathname.startsWith("/api/auth/")
    ) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Check role-based access for admin routes
    if (req.nextUrl.pathname.startsWith("/users") ||
        req.nextUrl.pathname.startsWith("/settings")) {
      const userRole = req.nextauth.token.role;
      if (userRole !== "ADMIN" && userRole !== "UNIT_COMMANDER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        // For all other pages, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
