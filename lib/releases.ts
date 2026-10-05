import crypto from "crypto"
import { put, del, get } from "@vercel/blob"
import { hasDatabase, pool, query } from "./db"

export type FileKind = "installer" | "module"

export interface ReleaseFile {
  id: string
  releaseId: string
  kind: FileKind
  path: string
  displayName: string
  size: number
  sha256: string
  blobUrl: string
  createdAt: string
}

export interface ChangelogLine {
  id: string
  releaseId: string
  ordinal: number
  body: string
}

export interface Release {
  id: string
  version: string
  supportedRobloxVersion: string
  channel: string
  publishedAt: string
  active: boolean
  createdAt: string
  files: ReleaseFile[]
  changelog: string[]
}

const VERSION_RE = /^\d+\.\d+\.\d+$/
const ROBLOX_BUILD_RE = /^version-[0-9a-fA-F]+$/

export function validateVersion(version: string) {
  if (!VERSION_RE.test(version)) {
    throw new Error("Version must look like 1.3.4")
  }
}

export function validateRobloxBuild(build: string) {
  if (!ROBLOX_BUILD_RE.test(build)) {
    throw new Error("Roblox build must start with version- followed by a hex id")
  }
}

function parseChangelogText(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
}

async function hashBuffer(buffer: Buffer): Promise<string> {
  return crypto.createHash("sha256").update(buffer).digest("hex").toUpperCase()
}

async function rowsToRelease(releaseRow: any, fileRows: any[], changelogRows: any[]): Promise<Release> {
  return {
    id: releaseRow.id,
    version: releaseRow.version,
    supportedRobloxVersion: releaseRow.supported_roblox_version,
    channel: releaseRow.channel,
    publishedAt: releaseRow.published_at,
    active: releaseRow.active,
    createdAt: releaseRow.created_at,
    files: fileRows
      .filter((f) => f.release_id === releaseRow.id)
      .map((f) => ({
        id: f.id,
        releaseId: f.release_id,
        kind: f.kind,
        path: f.path,
        displayName: f.display_name,
        size: Number(f.size),
        sha256: f.sha256,
        blobUrl: f.blob_url,
        createdAt: f.created_at,
      })),
    changelog: changelogRows
      .filter((c) => c.release_id === releaseRow.id)
      .sort((a, b) => a.ordinal - b.ordinal)
      .map((c) => c.body),
  }
}

async function hydrateReleases(releaseRows: any[]): Promise<Release[]> {
  if (releaseRows.length === 0) return []
  const ids = releaseRows.map((r) => r.id)
  const fileRows = await query(`SELECT * FROM files WHERE release_id = ANY($1)`, [ids])
  const changelogRows = await query(`SELECT * FROM changelog WHERE release_id = ANY($1)`, [ids])
  return Promise.all(releaseRows.map((r) => rowsToRelease(r, fileRows, changelogRows)))
}

export async function getActiveRelease(): Promise<Release | null> {
  if (!hasDatabase) return null
  const rows = await query(`SELECT * FROM releases WHERE active = true LIMIT 1`)
  if (rows.length === 0) return null
  const [release] = await hydrateReleases(rows)
  return release
}

export async function getAllReleases(): Promise<Release[]> {
  if (!hasDatabase) return []
  const rows = await query(`SELECT * FROM releases ORDER BY created_at DESC`)
  return hydrateReleases(rows)
}

export async function getReleaseById(id: string): Promise<Release | null> {
  if (!hasDatabase) return null
  const rows = await query(`SELECT * FROM releases WHERE id = $1`, [id])
  if (rows.length === 0) return null
  const [release] = await hydrateReleases(rows)
  return release
}

export async function getReleaseFileByVersion(version: string, urlPath: string): Promise<ReleaseFile | null> {
  if (!hasDatabase || !VERSION_RE.test(version)) return null
  const normalized = urlPath.replace(/\\/g, "/").toLowerCase()
  const rows = await query(
    `SELECT f.* FROM files f JOIN releases r ON r.id = f.release_id
     WHERE r.version = $1 AND lower(replace(f.path, '\\', '/')) = $2
     LIMIT 1`,
    [version, normalized],
  )
  if (rows.length === 0) return null
  const f = rows[0]
  return {
    id: f.id,
    releaseId: f.release_id,
    kind: f.kind,
    path: f.path,
    displayName: f.display_name,
    size: Number(f.size),
    sha256: f.sha256,
    blobUrl: f.blob_url,
    createdAt: f.created_at,
  }
}

export async function getCompatibility(): Promise<Record<string, string>> {
  if (!hasDatabase) return {}
  const rows = await query(`SELECT target, result FROM compatibility ORDER BY target`)
  const out: Record<string, string> = {}
  for (const row of rows) out[row.target] = row.result
  return out
}

export async function getKnownGaps(): Promise<{ name: string; impact: string; resolvedIn: string | null }[]> {
  if (!hasDatabase) return []
  const rows = await query(`SELECT name, impact, resolved_in FROM known_gaps ORDER BY name`)
  return rows.map((r) => ({ name: r.name, impact: r.impact, resolvedIn: r.resolved_in }))
}

interface PublishInstallerInput {
  version: string
  supportedRobloxVersion: string
  channel: string
  changelogText: string
  installerFile?: { buffer: Buffer; filename: string }
}

interface PublishUpdateInput {
  version: string
  supportedRobloxVersion: string
  changelogText: string
  moduleFile?: { buffer: Buffer; filename: string }
}

async function uploadAndHash(buffer: Buffer, pathName: string) {
  const sha256 = await hashBuffer(buffer)
  const blob = await put(pathName, buffer, {
    access: "private",
    addRandomSuffix: true,
    contentType: "application/octet-stream",
  })
  return { size: buffer.length, sha256, blobUrl: blob.url }
}

async function verifyBlob(blobUrl: string, expectedSha256: string, expectedSize: number) {
  const res = await get(blobUrl, { access: "private", useCache: false })
  if (!res || res.statusCode !== 200) throw new Error("Verification download failed")
  const buffer = Buffer.from(await new Response(res.stream).arrayBuffer())
  if (buffer.length !== expectedSize) {
    throw new Error("Verification failed: size mismatch after upload")
  }
  const actualHash = await hashBuffer(buffer)
  if (actualHash !== expectedSha256) {
    throw new Error("Verification failed: SHA-256 mismatch after upload")
  }
}

/**
 * Atomic publish for either the installer or the updates page. Carries
 * forward any file kind that was not re-attached from the current active
 * release, uploads + hashes new files, verifies them by re-downloading and
 * re-hashing, and only then flips the active flag. Any failure rolls back
 * the transaction and leaves the previously live release untouched.
 */
export async function publishRelease(options: {
  version: string
  supportedRobloxVersion: string
  channel?: string
  changelogText: string
  newFiles: { kind: FileKind; buffer: Buffer; filename: string; displayName: string; path: string }[]
}): Promise<Release> {
  validateVersion(options.version)
  validateRobloxBuild(options.supportedRobloxVersion)

  const current = await getActiveRelease()
  const carryForward = (current?.files ?? []).filter(
    (f) => !options.newFiles.some((nf) => nf.kind === f.kind),
  )

  const uploaded: { kind: FileKind; path: string; displayName: string; size: number; sha256: string; blobUrl: string }[] =
    []

  for (const file of options.newFiles) {
    const result = await uploadAndHash(
      file.buffer,
      `releases/${options.version}/${file.path.replace(/\\/g, "/")}`,
    )
    uploaded.push({ kind: file.kind, path: file.path, displayName: file.displayName, ...result })
  }

  // Step 4: verify every freshly uploaded blob before touching the DB.
  try {
    for (const file of uploaded) {
      await verifyBlob(file.blobUrl, file.sha256, file.size)
    }
  } catch (err) {
    // Clean up the blobs we just uploaded since this publish never commits.
    await Promise.all(uploaded.map((f) => del(f.blobUrl).catch(() => {})))
    throw err
  }

  const allFiles = [
    ...carryForward.map((f) => ({
      kind: f.kind,
      path: f.path,
      displayName: f.displayName,
      size: f.size,
      sha256: f.sha256,
      blobUrl: f.blobUrl,
    })),
    ...uploaded,
  ]

  if (allFiles.length === 0) {
    throw new Error("A release must include at least one file (installer carried forward or module carried forward)")
  }

  const changelogLines = parseChangelogText(options.changelogText)
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const releaseRows = await client.query(
      `INSERT INTO releases (version, supported_roblox_version, channel, active)
       VALUES ($1, $2, $3, false) RETURNING *`,
      [options.version, options.supportedRobloxVersion, options.channel ?? "stable"],
    )
    const releaseId = releaseRows.rows[0].id

    for (const file of allFiles) {
      await client.query(
        `INSERT INTO files (release_id, kind, path, display_name, size, sha256, blob_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [releaseId, file.kind, file.path, file.displayName, file.size, file.sha256, file.blobUrl],
      )
    }

    for (let i = 0; i < changelogLines.length; i++) {
      await client.query(`INSERT INTO changelog (release_id, ordinal, body) VALUES ($1, $2, $3)`, [
        releaseId,
        i,
        changelogLines[i],
      ])
    }

    await client.query(`UPDATE releases SET active = false WHERE active = true`)
    await client.query(`UPDATE releases SET active = true WHERE id = $1`, [releaseId])
    await client.query("COMMIT")

    const release = await getReleaseById(releaseId)
    if (!release) throw new Error("Failed to load published release")
    return release
  } catch (err) {
    await client.query("ROLLBACK")
    // Clean up blobs uploaded for this failed attempt.
    await Promise.all(uploaded.map((f) => del(f.blobUrl).catch(() => {})))
    throw err
  } finally {
    client.release()
  }
}

export async function makeReleaseLive(releaseId: string): Promise<Release> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const existing = await client.query(`SELECT id FROM releases WHERE id = $1`, [releaseId])
    if (existing.rows.length === 0) throw new Error("Release not found")
    await client.query(`UPDATE releases SET active = false WHERE active = true`)
    await client.query(`UPDATE releases SET active = true WHERE id = $1`, [releaseId])
    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
  const release = await getReleaseById(releaseId)
  if (!release) throw new Error("Failed to load release")
  return release
}

export async function deleteRelease(releaseId: string): Promise<void> {
  const release = await getReleaseById(releaseId)
  if (!release) throw new Error("Release not found")
  if (release.active) throw new Error("Cannot delete the live release")
  await query(`DELETE FROM releases WHERE id = $1`, [releaseId])
  await Promise.all(release.files.map((f) => del(f.blobUrl).catch(() => {})))
}

export async function updateChangelog(releaseId: string, changelogText: string): Promise<Release> {
  const lines = parseChangelogText(changelogText)
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query(`DELETE FROM changelog WHERE release_id = $1`, [releaseId])
    for (let i = 0; i < lines.length; i++) {
      await client.query(`INSERT INTO changelog (release_id, ordinal, body) VALUES ($1, $2, $3)`, [
        releaseId,
        i,
        lines[i],
      ])
    }
    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
  const release = await getReleaseById(releaseId)
  if (!release) throw new Error("Failed to load release")
  return release
}

export function shortHash(hash: string, length = 10): string {
  return hash.slice(0, length)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, exponent)
  return `${exponent === 0 ? value : value.toFixed(2)} ${units[exponent]}`
}
