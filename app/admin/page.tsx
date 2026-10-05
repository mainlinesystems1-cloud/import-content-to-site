import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getActiveRelease, getAllReleases, formatBytes } from "@/lib/releases"

export default async function AdminDashboardPage() {
  const [active, all] = await Promise.all([getActiveRelease(), getAllReleases()])
  const installer = active?.files.find((f) => f.kind === "installer")
  const module_ = active?.files.find((f) => f.kind === "module")

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Current live release and quick status.</p>
      </div>

      {active ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Live release</CardTitle>
            <Badge className="bg-primary/15 text-primary hover:bg-primary/15">v{active.version}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Supported Roblox build</p>
              <p className="mt-1 font-mono text-foreground">{active.supportedRobloxVersion}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Channel</p>
              <p className="mt-1 capitalize text-foreground">{active.channel}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Installer</p>
              <p className="mt-1 text-foreground">
                {installer ? `${installer.displayName} · ${formatBytes(installer.size)}` : "Not uploaded"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Module</p>
              <p className="mt-1 text-foreground">
                {module_ ? `${module_.displayName} · ${formatBytes(module_.size)}` : "Not uploaded"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No release has been published yet.</p>
            <Link href="/admin/installer" className="mt-3 inline-block text-sm text-primary hover:underline">
              Publish the first installer →
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-5">
            <p className="text-2xl font-semibold text-foreground">{all.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Total releases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-2xl font-semibold text-foreground">
              {all.filter((r) => r.files.some((f) => f.kind === "module")).length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Releases with a module update</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-2xl font-semibold text-foreground">
              {all.reduce((sum, r) => sum + r.changelog.length, 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Changelog entries</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/installer"
          className="rounded-md border border-border/80 px-4 py-2 text-sm text-foreground hover:bg-muted"
        >
          Publish installer
        </Link>
        <Link
          href="/admin/updates"
          className="rounded-md border border-border/80 px-4 py-2 text-sm text-foreground hover:bg-muted"
        >
          Push update
        </Link>
        <Link
          href="/admin/changelog"
          className="rounded-md border border-border/80 px-4 py-2 text-sm text-foreground hover:bg-muted"
        >
          Edit changelog
        </Link>
        <Link
          href="/admin/releases"
          className="rounded-md border border-border/80 px-4 py-2 text-sm text-foreground hover:bg-muted"
        >
          Release history
        </Link>
      </div>
    </div>
  )
}
