import { getActiveRelease } from "@/lib/releases"
import { getPublicOrigin, publicJson, publicOptions, toPublicManifest } from "@/lib/public-api"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const release = await getActiveRelease()
    if (!release) return publicJson({ error: "No live release" }, 404)
    const { version, supportedRobloxVersion, publishedAt } = toPublicManifest(getPublicOrigin(request), release)
    return publicJson({ version, supportedRobloxVersion, publishedAt })
  } catch {
    return publicJson({ error: "Release data unavailable" }, 503)
  }
}

export const OPTIONS = publicOptions
