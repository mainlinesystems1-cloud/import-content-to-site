import { NextResponse, type NextRequest } from "next/server"
import {
  verifyPassword,
  setSessionCookie,
  recordFailedAttempt,
  clearFailedAttempts,
  isRateLimited,
  isPasswordConfigured,
} from "@/lib/auth"

export async function POST(request: NextRequest) {
  if (!isPasswordConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured. Set the ADMIN_PASSWORD environment variable." },
      { status: 500 },
    )
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  if (isRateLimited(ip)) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return NextResponse.json({ error: "Invalid password" }, { status: 429 })
  }

  let password = ""
  try {
    const body = await request.json()
    password = typeof body?.password === "string" ? body.password : ""
  } catch {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 })
  }

  const ok = password.length > 0 && verifyPassword(password)

  if (!ok) {
    recordFailedAttempt(ip)
    await new Promise((resolve) => setTimeout(resolve, 400))
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  clearFailedAttempts(ip)
  await setSessionCookie()
  return NextResponse.json({ ok: true })
}
