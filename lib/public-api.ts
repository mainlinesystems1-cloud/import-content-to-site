import { NextResponse } from "next/server"
import type { Release, ReleaseFile } from "./releases"

export const PUBLIC_JSON_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
}

export function publicJson(body: unknown, status = 200) {
  return new NextResponse(JSON.stringify(body), { status, headers: PUBLIC_JSON_HEADERS })
}

export function publicOptions() {
  return new NextResponse(null, { status: 204, headers: PUBLIC_JSON_HEADERS })
}

// The desktop client compares paths with OrdinalIgnoreCase, which does not
// normalize slashes, so manifest paths must always use Windows separators.
export function toClientPath(path: string) {
  return path.replace(/\//g, "\\")
}

export function toUrlPath(path: string) {
  return path
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/")
}

export function getPublicOrigin(request: Request) {
  const configured = process.env.PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/+$/, "")
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = forwardedHost ?? request.headers.get("host")
  if (!host) return new URL(request.url).origin
  const proto = request.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto.split(",")[0].trim()}://${host.split(",")[0].trim()}`
}

export function fileUrl(origin: string, version: string, file: Pick<ReleaseFile, "path">) {
  return `${origin}/files/${encodeURIComponent(version)}/${toUrlPath(file.path)}`
}

export function toPublicFile(origin: string, version: string, file: ReleaseFile) {
  return {
    path: toClientPath(file.path),
    url: fileUrl(origin, version, file),
    size: file.size,
    sha256: file.sha256.toUpperCase(),
  }
}

function toIso(value: string | Date) {
  return new Date(value).toISOString().replace(/\.\d{3}Z$/, "Z")
}

export function toPublicManifest(origin: string, release: Release) {
  return {
    version: release.version,
    supportedRobloxVersion: release.supportedRobloxVersion,
    publishedAt: toIso(release.publishedAt),
    changelog: release.changelog.join("\n"),
    files: release.files.map((file) => toPublicFile(origin, release.version, file)),
  }
}
