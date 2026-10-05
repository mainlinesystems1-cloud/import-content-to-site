import release from "@/data/release.json"

const VERSION_RE = /^\d+\.\d+\.\d+$/
const ROBLOX_BUILD_RE = /^version-[0-9a-fA-F]+$/

if (!VERSION_RE.test(release.version)) {
  throw new Error(`data/release.json: "version" must look like 1.2.4, got "${release.version}"`)
}
if (!ROBLOX_BUILD_RE.test(release.robloxVersion)) {
  throw new Error(
    `data/release.json: "robloxVersion" must look like version-02c37bc51a384b8f, got "${release.robloxVersion}"`,
  )
}

export const dynamic = "force-static"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
}

export function GET() {
  return Response.json(
    {
      version: release.version,
      robloxVersion: release.robloxVersion,
      changelog: release.changelog,
    },
    { headers: corsHeaders },
  )
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}
