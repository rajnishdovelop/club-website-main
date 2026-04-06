import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Protected admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check if user has admin role
    if (token.role !== "admin" && token.role !== "editor") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check super admin access for admin management routes
    if (pathname.startsWith("/admin/admins") && !token.super) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    // Allow access to admin routes
    return NextResponse.next()
  }

  // Redirect to dashboard if logged in user tries to access login
  if (pathname === "/login") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (token && (token.role === "admin" || token.role === "editor")) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
