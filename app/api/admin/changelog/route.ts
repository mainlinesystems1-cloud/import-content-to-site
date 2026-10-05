import { NextResponse, type NextRequest } from "next/server"
import { updateChangelog } from "@/lib/releases"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { releaseId, changelog } = body ?? {}
    if (!releaseId) return NextResponse.json({ error: "releaseId is required" }, { status: 400 })
    const release = await updateChangelog(releaseId, String(changelog ?? ""))
    return NextResponse.json({ ok: true, release })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Update failed" }, { status: 400 })
  }
}
