import crypto from "crypto"
import { put, del } from "@vercel/blob"
import { hasDatabase, query } from "./db"

const SETTINGS_KEYS = {
  installerBlobUrl: "installer_blob_url",
  installerSha256: "installer_sha256",
  installerSize: "installer_size",
  installerFilename: "installer_filename",
  gateKey: "gate_key",
  lootlabsUrl: "lootlabs_url",
} as const

async function getSetting(key: string): Promise<string | null> {
  if (!hasDatabase) return null
  const rows = await query<{ value: string | null }>(
    `SELECT value FROM site_settings WHERE key = $1`,
    [key],
  )
  return rows[0]?.value ?? null
}

async function setSetting(key: string, value: string | null): Promise<void> {
  if (!hasDatabase) return
  await query(
    `INSERT INTO site_settings (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, value],
  )
}

export async function replaceSiteInstaller(buffer: Buffer, filename: string): Promise<void> {
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase()

  const oldUrl = await getSetting(SETTINGS_KEYS.installerBlobUrl)
  const blob = await put(`site-installer/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/octet-stream",
  })

  await setSetting(SETTINGS_KEYS.installerBlobUrl, blob.url)
  await setSetting(SETTINGS_KEYS.installerSha256, sha256)
  await setSetting(SETTINGS_KEYS.installerSize, String(buffer.length))
  await setSetting(SETTINGS_KEYS.installerFilename, filename)

  if (oldUrl) {
    await del(oldUrl).catch(() => {})
  }
}

export async function rotateGateKey(): Promise<string> {
  const newKey = crypto.randomBytes(32).toString("hex")
  await setSetting(SETTINGS_KEYS.gateKey, newKey)
  return newKey
}

export async function setLootlabsUrl(url: string | null): Promise<void> {
  await setSetting(SETTINGS_KEYS.lootlabsUrl, url)
}
