import { NextResponse, type NextRequest } from "next/server"
import { publishRelease, getActiveRelease } from "@/lib/releases"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const version = String(form.get("version") ?? "").trim()
    const supportedRobloxVersion = String(form.get("robloxBuild") ?? "").trim()
    const changelogText = String(form.get("changelog") ?? "")
    const file = form.get("module") as File | null

    const current = await getActiveRelease()
    if (!current) {
      return NextResponse.json(
        { error: "Publish an installer first — there is no live release to update" },
        { status: 400 },
      )
    }

    const newFiles: Parameters<typeof publishRelease>[0]["newFiles"] = []
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      newFiles.push({
        kind: "module",
        buffer,
        filename: file.name,
        displayName: file.name,
        path: `bin/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
      })
    } else {
      const hasModule = current.files.some((f) => f.kind === "module")
      if (!hasModule) {
        return NextResponse.json({ error: "A module file is required for the first update" }, { status: 400 })
      }
    }

    const release = await publishRelease({
      version,
      supportedRobloxVersion,
      channel: current.channel,
      changelogText,
      newFiles,
    })

    return NextResponse.json({ ok: true, release })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Publish failed" }, { status: 400 })
  }
}
