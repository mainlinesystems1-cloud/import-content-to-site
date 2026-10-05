import Link from "next/link"
import Image from "next/image"
import { Download, KeyRound, RefreshCw, Zap } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DiscordIcon } from "@/components/icons"
import { getActiveRelease, getCompatibility } from "@/lib/releases"

export const dynamic = "force-dynamic"

const FEATURES = [
  { icon: Download, title: "Completely free", body: "No paywalls, no premium tiers. Download and start executing." },
  { icon: KeyRound, title: "Keyless", body: "No key systems, no ad links, no waiting. Open it and go." },
  { icon: Zap, title: "Fast execution", body: "A lightweight native injector with a responsive, clean editor." },
  { icon: RefreshCw, title: "Kept up to date", body: "Updated quickly after every Roblox release so you stay working." },
]

export default async function HomePage() {
  const [release, compatibility] = await Promise.all([getActiveRelease(), getCompatibility()])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/80">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
            <div className="flex flex-col items-center text-center">
              {release && (
                <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-chart-3" aria-hidden />
                  <span className="font-mono text-foreground">v{release.version}</span> is live
                </span>
              )}
              <Image src="/mainscript-logo.png" alt="" width={72} height={72} className="h-18 w-18" priority />
              <h1 className="mt-8 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
                MainScript
              </h1>
              <p className="mt-4 text-balance text-xl font-medium text-foreground/80 sm:text-2xl">
                Script execution, refined.
              </p>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                A free and keyless Roblox executor for Windows.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/download"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Download MainScript
                </Link>
                <a
                  href="https://discord.gg/htv6hZAUTe"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  <DiscordIcon className="h-4 w-4" />
                  Join the Discord
                </a>
              </div>
              {release && (
                <p className="mt-6 text-xs text-muted-foreground">
                  Supports Roblox <span className="font-mono text-foreground/80">{release.supportedRobloxVersion}</span>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-border/80">
          <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card">
                  <Icon className="h-5 w-5 text-foreground" aria-hidden />
                </div>
                <h2 className="font-semibold text-foreground">{title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compatibility</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Tested where it counts</h2>
              </div>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
                Read the docs →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Object.entries(compatibility).map(([target, result]) => (
                <div key={target} className="rounded-lg border border-border bg-card p-6">
                  <p className="font-mono text-3xl font-semibold text-foreground">{result.split(" ")[0]}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{target}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
