import { NextResponse, type NextRequest } from "next/server"
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/")
  const isLoginPage = pathname === "/admin/login"
  const isAdminApi = pathname.startsWith("/api/admin/")
  const isLoginApi = pathname === "/api/admin/login"

  if ((isAdminPage && !isLoginPage) || (isAdminApi && !isLoginApi)) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const authed = verifySessionToken(token)

    if (!authed) {
      if (isAdminApi) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
      }
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
}
