import { getAllReleases } from "@/lib/releases"
import { getPublicOrigin, publicJson, publicOptions, toPublicManifest } from "@/lib/public-api"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const origin = getPublicOrigin(request)
    const releases = await getAllReleases()
    return publicJson({ releases: releases.map((release) => toPublicManifest(origin, release)) })
  } catch {
    return publicJson({ error: "Release data unavailable" }, 503)
  }
}

export const OPTIONS = publicOptions
