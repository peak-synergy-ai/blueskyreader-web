import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Protect /reader routes
  if (pathname.startsWith("/reader")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Protect /admin routes - only for peaksynergyai.com domain users
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    if (!token.email?.endsWith("@peaksynergyai.com")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/reader/:path*", "/admin/:path*"],
}
