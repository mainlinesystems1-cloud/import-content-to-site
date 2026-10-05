import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getActiveRelease, formatBytes } from "@/lib/releases"
import { DownloadButton } from "@/components/download-button"
import { AlertTriangle, ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DownloadPage() {
  const release = await getActiveRelease()
  const installer = release?.files.find((f) => f.kind === "installer")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Download MainScript</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Free, direct download. No license key, no account, no payment.
          </p>

          {!release || !installer ? (
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-border bg-card p-5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                No release has been published yet. Check back shortly or join our{" "}
                <a
                  href="https://discord.gg/htv6hZAUTe"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-foreground"
                >
                  Discord
                </a>{" "}
                for announcements.
              </p>
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mono-num text-lg font-semibold text-foreground">
                    MainScript v{release.version}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supports Roblox <span className="mono-num">{release.supportedRobloxVersion}</span> ·{" "}
                    {formatBytes(installer.size)}
                  </p>
                </div>
                <DownloadButton blobUrl={installer.blobUrl} fileName={installer.displayName} />
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  SHA-256 checksum
                </p>
                <p className="mono-num mt-2 break-all rounded bg-muted px-3 py-2 text-xs text-foreground">
                  {installer.sha256}
                </p>
                <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Verify with{" "}
                  <code className="mono-num rounded bg-muted px-1 py-0.5 text-foreground">
                    Get-FileHash .\MainScript.exe -Algorithm SHA256
                  </code>{" "}
                  before running. If it doesn&apos;t match, don&apos;t run the file — see our{" "}
                  <a href="/security" className="underline hover:text-foreground">
                    security policy
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          <div className="mt-10 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              MainScript requests administrator rights on launch — this is required to inject the native executor into
              the Roblox client and to apply machine-identity changes if you enable that feature. Review exactly what
              it does in our{" "}
              <a href="/terms" className="underline hover:text-foreground">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
            <p>
              Using a third-party tool to alter the Roblox client violates Roblox&apos;s Terms of Use and can result
              in an account ban. Use it only on content you own or control.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
