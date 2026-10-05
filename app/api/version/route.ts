import { NextResponse } from "next/server"
import { getActiveRelease } from "@/lib/releases"

export const dynamic = "force-dynamic"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "no-store",
}

export async function GET() {
  try {
    const release = await getActiveRelease()
    if (!release) {
      return NextResponse.json({ error: "No live release" }, { status: 404, headers: CORS_HEADERS })
    }
    return NextResponse.json(
      {
        version: release.version,
        robloxVersion: release.supportedRobloxVersion,
        changelog: release.changelog,
      },
      { headers: CORS_HEADERS },
    )
  } catch {
    return NextResponse.json({ error: "Release data unavailable" }, { status: 503, headers: CORS_HEADERS })
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
