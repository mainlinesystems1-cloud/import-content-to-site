import { NextResponse, type NextRequest } from "next/server"
import { publishRelease, getActiveRelease } from "@/lib/releases"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const version = String(form.get("version") ?? "").trim()
    const supportedRobloxVersion = String(form.get("robloxBuild") ?? "").trim()
    const channel = String(form.get("channel") ?? "stable").trim()
    const changelogText = String(form.get("changelog") ?? "")
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0)
    const newFiles: Parameters<typeof publishRelease>[0]["newFiles"] = []

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
      const lowerName = file.name.toLowerCase()
      const kind = lowerName.endsWith(".exe") ? "installer" : lowerName.endsWith(".dll") ? "module" : "asset"
      newFiles.push({
        kind,
        buffer: Buffer.from(await file.arrayBuffer()),
        filename: file.name,
        displayName: file.name,
        path: safeName,
      })
    }

    if (!newFiles.some((file) => file.kind === "installer")) {
      const current = await getActiveRelease()
      const hasInstaller = current?.files.some((file) => file.kind === "installer")
      if (!hasInstaller) {
        return NextResponse.json(
          { error: "An .exe installer is required for the first release" },
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
