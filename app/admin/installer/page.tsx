"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdminInstallerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/admin/installer", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Publish failed")
        setLoading(false)
        return
      }
      toast.success(`Published v${data.release.version} and set it live`)
      router.push("/admin")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Publish installer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload any file type for this release. Executables and libraries are classified automatically, verified by hash, and made live together.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New release</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input id="version" name="version" placeholder="1.3.4" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="robloxBuild">Supported Roblox build</Label>
                <Input id="robloxBuild" name="robloxBuild" placeholder="version-abc123def456" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Input id="channel" name="channel" placeholder="stable" defaultValue="stable" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="files">Release files</Label>
                <Input id="files" name="files" type="file" multiple required />
                <p className="text-xs text-muted-foreground">
                  Any file type is accepted. Include an .exe for the installer; .dll files and other files are stored as release assets.
                </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="changelog">Changelog (one line per entry)</Label>
              <Textarea
                id="changelog"
                name="changelog"
                rows={5}
                placeholder={"- Fixed startup crash\n- Improved injection speed"}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Publishing…" : "Publish & go live"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
