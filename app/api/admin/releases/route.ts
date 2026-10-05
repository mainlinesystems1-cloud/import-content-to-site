import { NextResponse, type NextRequest } from "next/server"
import { getAllReleases, makeReleaseLive, deleteRelease } from "@/lib/releases"

export async function GET() {
  const releases = await getAllReleases()
  return NextResponse.json({ releases })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, releaseId } = body ?? {}
    if (!releaseId) return NextResponse.json({ error: "releaseId is required" }, { status: 400 })

    if (action === "make-live") {
      const release = await makeReleaseLive(releaseId)
      return NextResponse.json({ ok: true, release })
    }
    if (action === "delete") {
      await deleteRelease(releaseId)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Action failed" }, { status: 400 })
  }
}
