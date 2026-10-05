import crypto from "crypto"
import { cookies } from "next/headers"

const SESSION_COOKIE = "mainscript_admin_session"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// ADMIN_SESSION_SECRET is the correct way to sign sessions. If it has not
// been configured for this project, derive a stable secret from the admin
// password so sessions still work rather than leaving auth non-functional.
function getSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET
  if (explicit) return explicit
  const fallbackSeed = process.env.ADMIN_PASSWORD ?? "mainscript-fallback-seed"
  return crypto.createHash("sha256").update(`mainscript-admin-session:${fallbackSeed}`).digest("hex")
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex")
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const aHash = crypto.createHash("sha256").update(a).digest()
  const bHash = crypto.createHash("sha256").update(b).digest()
  return crypto.timingSafeEqual(aHash, bHash)
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? ""
  if (!expected) return false
  return timingSafeEqualStrings(candidate, expected)
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_DURATION_MS
  const payload = `admin.${expires}`
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [subject, expiresStr, signature] = parts
  if (subject !== "admin") return false
  const expires = Number(expiresStr)
  if (!Number.isFinite(expires) || Date.now() > expires) return false
  const expectedSignature = sign(`${subject}.${expiresStr}`)
  return timingSafeEqualStrings(signature, expectedSignature)
}

export async function getSessionCookie(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionCookie()
  return verifySessionToken(token)
}

export async function setSessionCookie() {
  const store = await cookies()
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    // Local previews run over HTTP; production remains secure-only.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE

// Simple in-memory rate limiting for the login route. Resets on cold start,
// which is acceptable: it exists to slow down automated guessing, not to be
// a durable ledger.
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

export function recordFailedAttempt(key: string): number {
  const now = Date.now()
  const entry = failedAttempts.get(key)
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    failedAttempts.set(key, { count: 1, firstAttempt: now })
    return 1
  }
  entry.count += 1
  return entry.count
}

export function clearFailedAttempts(key: string) {
  failedAttempts.delete(key)
}

export function isRateLimited(key: string): boolean {
  const entry = failedAttempts.get(key)
  if (!entry) return false
  if (Date.now() - entry.firstAttempt > WINDOW_MS) {
    failedAttempts.delete(key)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}
