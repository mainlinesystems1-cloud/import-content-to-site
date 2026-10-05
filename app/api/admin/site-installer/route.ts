import { NextResponse, type NextRequest } from "next/server"
import { replaceSiteInstaller, rotateGateKey, setLootlabsUrl } from "@/lib/site-installer"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get("installer") as File | null
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Choose an installer file" }, { status: 400 })
    }
    await replaceSiteInstaller(Buffer.from(await file.arrayBuffer()), file.name)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Upload failed" }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.rotateKey) {
      await rotateGateKey()
      return NextResponse.json({ ok: true })
    }

    if ("lootlabsUrl" in body) {
      const raw = String(body.lootlabsUrl ?? "").trim()
      if (raw === "") {
        await setLootlabsUrl(null)
      } else {
        const url = new URL(raw)
        if (url.protocol !== "https:") throw new Error("The LootLabs link must start with https://")
        await setLootlabsUrl(url.toString())
      }
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  } catch (err: any) {
    const message = err instanceof TypeError ? "That is not a valid URL" : (err?.message ?? "Update failed")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
