import { NextResponse, type NextRequest } from "next/server"
import { publishRelease, getActiveRelease } from "@/lib/releases"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const version = String(form.get("version") ?? "").trim()
    const supportedRobloxVersion = String(form.get("robloxBuild") ?? "").trim()
    const channel = String(form.get("channel") ?? "stable").trim()
    const changelogText = String(form.get("changelog") ?? "")
    const file = form.get("installer") as File | null

    const newFiles: Parameters<typeof publishRelease>[0]["newFiles"] = []
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      newFiles.push({
        kind: "installer",
        buffer,
        filename: file.name,
        displayName: "MainScript.exe",
        path: "MainScript.exe",
      })
    } else {
      const current = await getActiveRelease()
      const hasInstaller = current?.files.some((f) => f.kind === "installer")
      if (!hasInstaller) {
        return NextResponse.json(
          { error: "An installer file is required for the first release" },
          { status: 400 },
        )
      }
    }

    const release = await publishRelease({
      version,
      supportedRobloxVersion,
      channel,
      changelogText,
      newFiles,
    })

    return NextResponse.json({ ok: true, release })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Publish failed" }, { status: 400 })
  }
}
