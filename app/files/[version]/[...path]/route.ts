import { get } from "@vercel/blob"
import { getReleaseFileByVersion } from "@/lib/releases"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BASE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Expose-Headers": "Content-Length, Content-Disposition, X-Content-SHA256",
  "X-Content-Type-Options": "nosniff",
}

type Params = { params: Promise<{ version: string; path: string[] }> }

async function resolve({ params }: Params) {
  const { version, path } = await params
  return getReleaseFileByVersion(version, path.join("/"))
}

function fileHeaders(file: { path: string; size: number; sha256: string }) {
  const filename = file.path.split(/[\\/]/).pop() ?? "download"
  return {
    ...BASE_HEADERS,
    "Content-Type": "application/octet-stream",
    "Content-Length": String(file.size),
    "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
    // Bytes at a versioned URL never change once published.
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-SHA256": file.sha256.toUpperCase(),
  }
}

function notFound() {
  return new Response("Not found", { status: 404, headers: { ...BASE_HEADERS, "Content-Type": "text/plain" } })
}

export async function HEAD(_request: Request, context: Params) {
  const file = await resolve(context).catch(() => null)
  if (!file) return notFound()
  return new Response(null, { status: 200, headers: fileHeaders(file) })
}

export async function GET(_request: Request, context: Params) {
  const file = await resolve(context).catch(() => null)
  if (!file) return notFound()

  const blob = await get(file.blobUrl, { access: "private", useCache: false }).catch(() => null)
  if (!blob || blob.statusCode !== 200) {
    return new Response("File unavailable", { status: 502, headers: { ...BASE_HEADERS, "Content-Type": "text/plain" } })
  }

  return new Response(blob.stream, { status: 200, headers: fileHeaders(file) })
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: BASE_HEADERS })
}
