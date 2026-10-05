import crypto from "crypto"
import { cookies } from "next/headers"

export const ADMIN_SESSION_COOKIE = "mainscript_admin_session"
const SESSION_MS = 7 * 24 * 60 * 60 * 1000

function secret() {
  return process.env.ADMIN_SESSION_SECRET || crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD || "mainscript-admin").digest("hex")
}

function signature(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex")
}

export function verifyAdminPassword(value: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !value) return false
  const a = crypto.createHash("sha256").update(value).digest()
  const b = crypto.createHash("sha256").update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

export function verifyAdminSession(token?: string | null) {
  if (!token) return false
  const [subject, expires, sig] = token.split(".")
  if (subject !== "admin" || !expires || !sig || Date.now() > Number(expires)) return false
  return crypto.timingSafeEqual(Buffer.from(signature(`${subject}.${expires}`)), Buffer.from(sig))
}

export async function signAdminSession() {
  const expires = String(Date.now() + SESSION_MS)
  const token = `admin.${expires}.${signature(`admin.${expires}`)}`
  const store = await cookies()
  store.set(ADMIN_SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_MS / 1000 })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(ADMIN_SESSION_COOKIE)
}

export async function isAdminAuthenticated() {
  const store = await cookies()
  return verifyAdminSession(store.get(ADMIN_SESSION_COOKIE)?.value)
}
